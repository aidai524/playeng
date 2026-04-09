"use client"

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getAllUnits } from "@/data/courses"
import type { Word } from "@/data/units"
import { speak } from "@/lib/speech"
import { useGameStore, initializeGameStore, checkAndUnlockBadges } from "@/lib/game"
import NavBar from "@/components/NavBar"

const units = getAllUnits()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TOTAL_ROUNDS = 10

function SpellGameInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const unitId = searchParams.get("unit") || "all"
  const [mounted, setMounted] = useState(false)

  const [words, setWords] = useState<Word[]>([])
  const [round, setRound] = useState(0)
  const [input, setInput] = useState("")
  const [result, setResult] = useState<"correct" | "wrong" | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [finished, setFinished] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addScore = useGameStore(s => s.addScore)
  const unlockBadge = useGameStore(s => s.unlockBadge)

  useEffect(() => {
    initializeGameStore()
    setMounted(true)
  }, [])

  const pickWords = useCallback(() => {
    let pool: Word[] = []
    if (unitId === "all") {
      units.forEach(u => pool.push(...u.words))
    } else {
      const unit = units.find(u => u.id === unitId)
      if (unit) pool = unit.words
    }
    setWords(shuffle(pool).slice(0, TOTAL_ROUNDS))
  }, [unitId])

  useEffect(() => {
    if (mounted) {
      pickWords()
    }
  }, [mounted, pickWords])

  const currentWord = words[round]

  const playAudio = useCallback(() => {
    if (currentWord) {
      speak(currentWord.en, 0.8)
      setHasPlayedAudio(true)
    }
  }, [currentWord])

  useEffect(() => {
    if (currentWord) {
      setResult(null)
      setInput("")
      setHintLevel(0)
      setHasPlayedAudio(false)
      setTimeout(() => playAudio(), 300)
    }
  }, [round, currentWord, playAudio])

  useEffect(() => {
    if (result === null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [result, round])

  const checkAnswer = () => {
    if (!currentWord || result) return
    const isCorrect = input.trim().toLowerCase() === currentWord.en.toLowerCase()

    if (isCorrect) {
      setResult("correct")
      const points = 10 + streak * 2
      const newStreak = streak + 1
      setScore(s => s + points)
      setStreak(newStreak)
      setMaxStreak(ms => Math.max(ms, newStreak))
      speak(currentWord.en, 0.9)

      setTimeout(() => {
        if (round + 1 >= words.length) {
          setFinished(true)
          addScore("spell", score + points)
          checkAndUnlockBadges("spell", score + points, mistakes === 0, 0, newStreak, unlockBadge)
        } else {
          setRound(r => r + 1)
        }
      }, 1200)
    } else {
      setResult("wrong")
      setStreak(0)
      setMistakes(m => m + 1)
      setTimeout(() => {
        setResult(null)
        setInput("")
        setHintLevel(0)
      }, 1500)
    }
  }

  const getHint = () => {
    if (!currentWord || hintLevel >= 3) return
    setHintLevel(h => h + 1)
  }

  const getHintDisplay = () => {
    if (!currentWord) return ""
    const word = currentWord.en
    if (hintLevel === 0) return ""
    const revealed = new Set<number>([0, word.length - 1])
    if (hintLevel >= 2) {
      const mid = Math.floor(word.length / 2)
      revealed.add(mid)
    }
    if (hintLevel >= 3) {
      for (let i = 0; i < word.length; i++) {
        if (i % 2 === 0) revealed.add(i)
      }
    }
    return word.split("").map((c, i) => revealed.has(i) ? c : "_").join(" ")
  }

  if (!mounted) return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>

  if (finished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6 text-center">
        <span className="text-7xl">{mistakes === 0 ? "🏆" : "🎉"}</span>
        <h1 className="text-3xl font-bold text-primary">挑战完成！</h1>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-primary">{score}</p>
            <p className="text-xs text-text-light">得分</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-success">{maxStreak}</p>
            <p className="text-xs text-text-light">最长连击</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-danger">{mistakes}</p>
            <p className="text-xs text-text-light">失误</p>
          </div>
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => { pickWords(); setRound(0); setScore(0); setStreak(0); setMaxStreak(0); setMistakes(0); setFinished(false); }} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            再来一局
          </button>
          <button onClick={() => router.push("/game")} className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-text-light hover:bg-gray-200 transition-colors">
            返回
          </button>
        </div>
        <NavBar />
      </div>
    )
  }

  if (!currentWord) return null

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-4">
        <header className="flex items-center justify-between">
          <button onClick={() => router.push("/game")} className="text-2xl">←</button>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-bold text-primary">{score} 分</span>
            {streak > 0 && <span className="text-warning font-bold">🔥x{streak}</span>}
          </div>
          <div className="text-sm text-text-light">
            {round + 1}/{words.length}
          </div>
        </header>

        <div className="flex gap-1 justify-center">
          {words.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < round ? "bg-success" :
                i === round ? "bg-primary" :
                "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
          <span className="text-5xl block">{currentWord.emoji}</span>

          <button
            onClick={playAudio}
            className="mx-auto block px-6 py-3 bg-primary text-white rounded-xl text-lg font-medium hover:bg-primary-dark transition-colors active:scale-95"
          >
            🔊 听发音
          </button>

          {hintLevel > 0 && (
            <p className="text-lg font-mono tracking-widest text-text-light">{getHintDisplay()}</p>
          )}

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setResult(null) }}
              onKeyDown={e => e.key === "Enter" && checkAnswer()}
              placeholder={hasPlayedAudio ? "输入你听到的单词..." : "先听发音再拼写哦~"}
              disabled={result === "correct"}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-50"
            />
            <button
              onClick={checkAnswer}
              disabled={!input.trim() || result === "correct"}
              className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-30"
            >
              ✓
            </button>
          </div>

          {result === "correct" && (
            <p className="text-success font-bold text-lg animate-bounce">🎉 正确！+{10 + streak * 2}分</p>
          )}
          {result === "wrong" && (
            <div className="space-y-1">
              <p className="text-danger font-bold">❌ 再试一次</p>
              <p className="text-text-light text-sm">正确答案：<span className="text-primary font-bold">{currentWord.en}</span></p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={getHint}
              disabled={hintLevel >= 3 || result === "correct"}
              className="text-sm text-text-light underline underline-offset-4 hover:text-primary disabled:opacity-30"
            >
              💡 提示 ({3 - hintLevel} 次剩余)
            </button>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}

export default function SpellGamePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>}>
      <SpellGameInner />
    </Suspense>
  )
}
