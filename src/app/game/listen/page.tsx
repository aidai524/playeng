"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { units } from "@/data/units"
import { speak } from "@/lib/speech"
import { useGameStore, initializeGameStore, checkAndUnlockBadges } from "@/lib/game"
import { useProgressStore, initializeStore } from "@/lib/progress"
import NavBar from "@/components/NavBar"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ListenQuizContent() {
  const searchParams = useSearchParams()
  const unitId = searchParams.get("unit") || "all"

  const [mounted, setMounted] = useState(false)
  const addScore = useGameStore(s => s.addScore)
  const unlockBadge = useGameStore(s => s.unlockBadge)
  const markWordSeen = useProgressStore(s => s.markWordSeen)

  const [phase, setPhase] = useState<"ready" | "playing" | "result">("ready")
  const [questions, setQuestions] = useState<typeof units[0]["words"]>([])
  const [qIdx, setQIdx] = useState(0)
  const [options, setOptions] = useState<{ en: string; cn: string; wordId: string }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalQ, setTotalQ] = useState(10)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    initializeGameStore()
    initializeStore()
    setMounted(true)
  }, [])

  const getWords = useCallback(() => {
    if (unitId === "all") {
      return units.flatMap(u => u.words)
    }
    return units.find(u => u.id === unitId)?.words || []
  }, [unitId])

  const startGame = useCallback(() => {
    const allWords = getWords()
    const pool = shuffle(allWords).slice(0, totalQ)
    setQuestions(pool)
    setQIdx(0)
    setScore(0)
    setStreak(0)
    setCorrectCount(0)
    setSelected(null)
    setShowAnswer(false)
    setPhase("playing")
    generateQuestion(pool, 0, allWords)
  }, [getWords, totalQ])

  const generateQuestion = useCallback((
    pool: typeof units[0]["words"],
    idx: number,
    allWords: typeof units[0]["words"],
  ) => {
    const correct = pool[idx]
    const others = shuffle(allWords.filter(w => w.id !== correct.id)).slice(0, 3)
    const opts = shuffle([
      { en: correct.en, cn: correct.cn, wordId: correct.id },
      ...others.map(w => ({ en: w.en, cn: w.cn, wordId: w.id })),
    ])
    setOptions(opts)
    setSelected(null)
    setShowAnswer(false)

    setTimeout(() => {
      speak(correct.en)
    }, 300)
  }, [])

  const handleSelect = (wordId: string) => {
    if (selected) return
    setSelected(wordId)

    const correct = questions[qIdx]
    const isCorrect = wordId === correct.id

    if (isCorrect) {
      const pts = 10 + streak * 2
      setScore(s => s + pts)
      setStreak(s => s + 1)
      setCorrectCount(c => c + 1)
      markWordSeen(correct.id, true)
    } else {
      setStreak(0)
      markWordSeen(correct.id, false)
    }

    setShowAnswer(true)
  }

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      addScore("listen", score)
      checkAndUnlockBadges("listen", score, correctCount === questions.length, 0, streak, unlockBadge)
      setPhase("result")
      return
    }
    const nextIdx = qIdx + 1
    setQIdx(nextIdx)
    generateQuestion(questions, nextIdx, getWords())
  }

  const handleReplay = () => {
    if (!questions[qIdx]) return
    setIsPlaying(true)
    speak(questions[qIdx].en).finally(() => setIsPlaying(false))
  }

  if (!mounted) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>
  }

  if (phase === "ready") {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 space-y-5">
          <header className="text-center pt-4">
            <Link href="/game" className="text-sm text-text-light hover:text-primary">← 返回游戏中心</Link>
            <h1 className="text-2xl font-bold mt-2">🎧 听力大闯关</h1>
            <p className="text-text-light text-sm mt-1">听发音，选出正确的中文意思</p>
          </header>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-5 text-white text-center">
            <span className="text-5xl">🎧</span>
            <p className="mt-3 font-bold text-lg">听单词 → 选中文</p>
            <p className="text-white/80 text-sm mt-1">系统朗读英文单词，选出对应中文含义</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold mb-3">题目数量</h3>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setTotalQ(n)}
                  className={`flex-1 py-2 rounded-xl font-medium text-sm transition-colors ${
                    totalQ === n
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-light hover:bg-gray-200"
                  }`}
                >
                  {n}题
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all active:scale-[0.98] shadow-lg"
          >
            开始挑战 🎧
          </button>
        </div>
        <NavBar />
      </div>
    )
  }

  if (phase === "result") {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 space-y-5">
          <header className="text-center pt-4">
            <h1 className="text-2xl font-bold">🎉 挑战结束</h1>
          </header>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-6xl font-bold text-primary">{score}</p>
            <p className="text-text-light text-sm mt-1">总分</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-success">{correctCount}</p>
              <p className="text-xs text-text-light">答对</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-danger">{questions.length - correctCount}</p>
              <p className="text-xs text-text-light">答错</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-primary">{accuracy}%</p>
              <p className="text-xs text-text-light">正确率</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all active:scale-[0.98]"
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

  const currentWord = questions[qIdx]
  const correctOption = options.find(o => o.wordId === currentWord?.id)

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/game" className="text-sm text-text-light hover:text-primary">← 退出</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">{score} 分</span>
            <span className="text-sm text-text-light">🔥 {streak}</span>
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-text-light">第 {qIdx + 1} / {questions.length} 题</p>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <button
            onClick={handleReplay}
            disabled={isPlaying}
            className="text-6xl hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isPlaying ? "🔊" : "🔈"}
          </button>
          <p className="mt-3 text-white/80 text-sm">
            {isPlaying ? "正在播放..." : "点击重新播放"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selected === opt.wordId
            const isCorrectOpt = opt.wordId === currentWord?.id
            let bgClass = "bg-white border-gray-200 hover:border-cyan-300 hover:shadow-md"

            if (selected) {
              if (isCorrectOpt) bgClass = "bg-green-50 border-green-400 shadow-sm"
              else if (isSelected) bgClass = "bg-red-50 border-red-400 shadow-sm"
              else bgClass = "bg-gray-50 border-gray-200 opacity-50"
            }

            return (
              <button
                key={opt.wordId + opt.cn}
                onClick={() => handleSelect(opt.wordId)}
                disabled={!!selected}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${bgClass}`}
              >
                <p className="font-bold text-lg">{opt.cn}</p>
                {selected && (isCorrectOpt || isSelected) && (
                  <p className="text-xs text-text-light mt-1">{opt.en}</p>
                )}
              </button>
            )
          })}
        </div>

        {showAnswer && (
          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${
              selected === currentWord?.id
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {selected === currentWord?.id ? "✅ 答对了！" : `❌ 正确答案: ${correctOption?.cn}`}
            </div>
            <div className="mt-3">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                {qIdx + 1 >= questions.length ? "查看结果" : "下一题 →"}
              </button>
            </div>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}

export default function ListenQuizPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>}>
      <ListenQuizContent />
    </Suspense>
  )
}
