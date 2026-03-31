"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { units } from "@/data/units"
import { speak } from "@/lib/speech"
import { useGameStore, initializeGameStore, checkAndUnlockBadges } from "@/lib/game"
import NavBar from "@/components/NavBar"

function RolePlayContent() {
  const searchParams = useSearchParams()
  const unitId = searchParams.get("unit") || units[0].id

  const [mounted, setMounted] = useState(false)
  const addScore = useGameStore(s => s.addScore)
  const unlockBadge = useGameStore(s => s.unlockBadge)

  const [phase, setPhase] = useState<"select" | "playing" | "result">("select")
  const [selectedUnit, setSelectedUnit] = useState(unitId)
  const [dialogueIdx, setDialogueIdx] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const [userInputs, setUserInputs] = useState<Record<number, string>>({})
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<Record<number, "correct" | "wrong">>({})
  const [score, setScore] = useState(0)
  const [totalLines, setTotalLines] = useState(0)

  useEffect(() => {
    initializeGameStore()
    setMounted(true)
  }, [])

  const getDialogues = useCallback(() => {
    const unit = units.find(u => u.id === selectedUnit)
    return unit?.dialogues || []
  }, [selectedUnit])

  const startGame = useCallback(() => {
    const unit = units.find(u => u.id === selectedUnit)
    if (!unit || !unit.dialogues.length) return
    setDialogueIdx(0)
    setLineIdx(0)
    setUserInputs({})
    setFeedback({})
    setScore(0)
    setTotalLines(unit.dialogues.reduce((acc, d) => acc + d.lines.length, 0))
    setPhase("playing")
    speak(unit.dialogues[0].lines[0].en)
  }, [selectedUnit])

  if (!mounted) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>
  }

  if (phase === "select") {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 space-y-5">
          <header className="text-center pt-4">
            <Link href="/game" className="text-sm text-text-light hover:text-primary">← 返回游戏中心</Link>
            <h1 className="text-2xl font-bold mt-2">🎭 对话角色扮演</h1>
            <p className="text-text-light text-sm mt-1">扮演角色，完成英语对话</p>
          </header>

          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white text-center">
            <span className="text-5xl">🎭</span>
            <p className="mt-3 font-bold text-lg">听对话 → 补全句子</p>
            <p className="text-white/80 text-sm mt-1">系统说一半，你来接一半</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">选择单元</h3>
            <div className="space-y-2">
              {units.filter(u => u.dialogues.length > 0).map(unit => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    selectedUnit === unit.id
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl">{unit.emoji}</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">{unit.title}</p>
                    <p className="text-xs text-text-light">{unit.dialogues.length} 个对话</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all active:scale-[0.98] shadow-lg"
          >
            开始扮演 🎭
          </button>
        </div>
        <NavBar />
      </div>
    )
  }

  if (phase === "result") {
    const accuracy = totalLines > 0 ? Math.round((Object.values(feedback).filter(v => v === "correct").length / totalLines) * 100) : 0
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 space-y-5">
          <header className="text-center pt-4">
            <h1 className="text-2xl font-bold">🎉 角色扮演完成</h1>
          </header>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-6xl font-bold text-primary">{score}</p>
            <p className="text-text-light text-sm mt-1">总分</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-success">{accuracy}%</p>
              <p className="text-xs text-text-light">正确率</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-primary">{totalLines}</p>
              <p className="text-xs text-text-light">完成句数</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPhase("select")}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all active:scale-[0.98]"
            >
              再来一次 🔄
            </button>
            <Link
              href="/game"
              className="flex-1 py-3 bg-gray-100 text-text-light rounded-2xl font-bold text-center hover:bg-gray-200 transition-colors"
            >
              返回 🏠
            </Link>
          </div>
        </div>
        <NavBar />
      </div>
    )
  }

  const dialogues = getDialogues()
  const dialogue = dialogues[dialogueIdx]
  if (!dialogue) {
    setPhase("result")
    return null
  }

  const currentLine = dialogue.lines[lineIdx]
  const words = currentLine.en.split(" ")
  const blankStart = Math.floor(words.length / 2)
  const firstHalf = words.slice(0, blankStart).join(" ")
  const answerPart = words.slice(blankStart).join(" ")
  const lineFeedback = feedback[lineIdx]

  const checkAnswer = () => {
    const input = (userInputs[lineIdx] || "").trim().toLowerCase()
    const expected = answerPart.toLowerCase().replace(/[.,!?']/g, "")
    const cleaned = input.replace(/[.,!?']/g, "")
    const isCorrect = cleaned === expected || expected.includes(cleaned) || cleaned.includes(expected)

    setFeedback(prev => ({ ...prev, [lineIdx]: isCorrect ? "correct" : "wrong" }))
    if (isCorrect) {
      setScore(s => s + 15)
    }
    speak(currentLine.en)
  }

  const nextLine = () => {
    setShowHint(false)
    if (lineIdx + 1 < dialogue.lines.length) {
      const nextIdx = lineIdx + 1
      setLineIdx(nextIdx)
      speak(dialogue.lines[nextIdx].en)
    } else if (dialogueIdx + 1 < dialogues.length) {
      setDialogueIdx(dialogueIdx + 1)
      setLineIdx(0)
      speak(dialogues[dialogueIdx + 1].lines[0].en)
    } else {
      addScore("roleplay", score)
      checkAndUnlockBadges("roleplay", score, true, 0, 0, unlockBadge)
      setPhase("result")
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase("select")} className="text-sm text-text-light hover:text-primary">← 退出</button>
          <span className="text-sm font-medium text-primary">{score} 分</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎭</span>
            <h3 className="font-bold">{dialogue.title}</h3>
          </div>
          <div className="space-y-2">
            {dialogue.lines.map((line, i) => {
              const isPast = i < lineIdx
              const isCurrent = i === lineIdx
              const fb = feedback[i]
              const isAnswered = isCurrent && !!lineFeedback
              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl text-sm ${
                    isCurrent
                      ? "bg-blue-50 border-2 border-blue-300"
                      : isPast
                        ? fb === "correct"
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                        : "bg-gray-50 opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                      line.speaker === "A" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                    }`}>
                      {line.speaker}
                    </span>
                    <div className="flex-1">
                      {isCurrent && !isAnswered ? (
                        <p className="font-medium text-blue-400">{firstHalf} ________</p>
                      ) : (
                        <p className="font-medium">{line.en}</p>
                      )}
                      <p className="text-text-light text-xs">{line.cn}</p>
                    </div>
                    {isPast && (
                      <span>{fb === "correct" ? "✅" : "❌"}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 text-white">
          <p className="text-white/80 text-xs mb-1">请补全句子：</p>
          <p className="font-bold text-lg">
            {firstHalf} ____________
          </p>
          {lineFeedback && (
            <p className="text-sm mt-1 text-white/90">
              完整: {currentLine.en}
            </p>
          )}
          {!lineFeedback && showHint && (
            <p className="text-sm mt-1 text-yellow-200">
              提示: {answerPart.slice(0, Math.ceil(answerPart.length / 2))}...
            </p>
          )}
        </div>

        {!lineFeedback ? (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={userInputs[lineIdx] || ""}
                onChange={e => setUserInputs(prev => ({ ...prev, [lineIdx]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter" && (userInputs[lineIdx] || "").trim()) checkAnswer() }}
                placeholder="输入英文补全句子..."
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl text-base focus:border-primary focus:outline-none transition-colors"
                autoFocus
              />
              <button
                onClick={() => speak(currentLine.en, 0.5)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                title="慢速播放"
              >
                🐢
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(true)}
                className="flex-1 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200 transition-colors"
              >
                提示 💡
              </button>
              <button
                onClick={checkAnswer}
                disabled={!(userInputs[lineIdx] || "").trim()}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                确认 ✓
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${
              lineFeedback === "correct" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {lineFeedback === "correct" ? "✅ 太棒了！" : "❌ 继续加油！"}
            </div>
            <div>
              <button
                onClick={nextLine}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                {lineIdx + 1 >= dialogue.lines.length && dialogueIdx + 1 >= dialogues.length
                  ? "查看结果"
                  : "下一句 →"}
              </button>
            </div>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}

export default function RolePlayPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>}>
      <RolePlayContent />
    </Suspense>
  )
}
