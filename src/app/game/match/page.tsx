"use client"

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getAllUnits } from "@/data/courses"
import type { Word } from "@/data/units"
import { speak } from "@/lib/speech"
import { useGameStore, initializeGameStore, checkAndUnlockBadges } from "@/lib/game"
import NavBar from "@/components/NavBar"

const units = getAllUnits()

interface Card {
  id: string
  text: string
  type: "en" | "cn"
  wordId: string
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function MatchGameInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const unitId = searchParams.get("unit") || "all"
  const [mounted, setMounted] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [matched, setMatched] = useState(0)
  const [total, setTotal] = useState(0)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const [wrongPair, setWrongPair] = useState<string[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addScore = useGameStore(s => s.addScore)
  const unlockBadge = useGameStore(s => s.unlockBadge)

  useEffect(() => {
    initializeGameStore()
    setMounted(true)
  }, [])

  const initGame = useCallback(() => {
    let words: Word[] = []
    if (unitId === "all") {
      units.forEach(u => words.push(...u.words))
    } else {
      const unit = units.find(u => u.id === unitId)
      if (unit) words = unit.words
    }

    const gameWords = shuffle(words).slice(0, 8)

    const gameCards: Card[] = []
    gameWords.forEach(w => {
      gameCards.push({ id: w.id + "-en", text: w.en, type: "en", wordId: w.id, matched: false })
      gameCards.push({ id: w.id + "-cn", text: w.cn, type: "cn", wordId: w.id, matched: false })
    })

    setCards(shuffle(gameCards))
    setTotal(gameWords.length)
    setMatched(0)
    setCombo(0)
    setScore(0)
    setMistakes(0)
    setSelected(null)
    setFinished(false)
    setWrongPair([])
    const now = Date.now()
    setStartTime(now)
    setElapsed(0)

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - now) / 1000))
    }, 1000)
  }, [unitId])

  useEffect(() => {
    if (mounted) initGame()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [mounted, initGame])

  const handleCardClick = (cardId: string) => {
    if (finished) return
    const card = cards.find(c => c.id === cardId)
    if (!card || card.matched) return
    if (cardId === selected) return

    if (!selected) {
      setSelected(cardId)
      if (card.type === "en") speak(card.text, 0.9)
      return
    }

    const firstCard = cards.find(c => c.id === selected)!
    if (firstCard.type === card.type) {
      setSelected(cardId)
      return
    }

    if (firstCard.wordId === card.wordId) {
      const newCombo = combo + 1
      const points = 10 + (newCombo > 1 ? newCombo * 5 : 0)
      const newScore = score + points
      const newMatched = matched + 1

      setCombo(newCombo)
      setScore(newScore)
      setMatched(newMatched)
      setSelected(null)
      setCards(prev => prev.map(c =>
        c.wordId === card.wordId ? { ...c, matched: true } : c
      ))

      if (card.type === "en") speak(card.text, 0.9)
      else speak(firstCard.text, 0.9)

      if (newMatched === total) {
        if (timerRef.current) clearInterval(timerRef.current)
        const timeMs = Date.now() - startTime
        setFinished(true)
        addScore("match", newScore)
        checkAndUnlockBadges("match", newScore, mistakes === 0, timeMs, 0, unlockBadge)
      }
    } else {
      setCombo(0)
      setMistakes(m => m + 1)
      setWrongPair([selected!, cardId])
      setSelected(null)
      setTimeout(() => setWrongPair([]), 600)
    }
  }

  if (!mounted) return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>

  if (finished) {
    const timeMs = Date.now() - startTime
    const seconds = Math.floor(timeMs / 1000)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6 text-center">
        <span className="text-7xl">🎉</span>
        <h1 className="text-3xl font-bold text-primary">恭喜通关！</h1>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-primary">{score}</p>
            <p className="text-xs text-text-light">得分</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-warning">{seconds}s</p>
            <p className="text-xs text-text-light">用时</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-danger">{mistakes}</p>
            <p className="text-xs text-text-light">失误</p>
          </div>
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={initGame} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
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

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-3">
        <header className="flex items-center justify-between">
          <button onClick={() => router.push("/game")} className="text-2xl">←</button>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono text-text-light">⏱️ {elapsed}s</span>
            <span className="font-bold text-primary">{score} 分</span>
          </div>
          <div className="text-sm">
            <span className="text-success">{matched}</span>/{total}
            {combo > 1 && <span className="ml-2 text-warning font-bold">🔥x{combo}</span>}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2">
          {cards.map(card => {
            const isSelected = selected === card.id
            const isWrong = wrongPair.includes(card.id)
            const isMatched = card.matched

            let bgClass = "bg-white border-gray-200"
            if (isMatched) bgClass = "bg-green-50 border-green-300 opacity-50"
            else if (isWrong) bgClass = "bg-red-50 border-red-300 animate-pulse"
            else if (isSelected) bgClass = "bg-indigo-50 border-indigo-400 shadow-md"
            else if (card.type === "en") bgClass = "bg-blue-50 border-blue-200"
            else bgClass = "bg-orange-50 border-orange-200"

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isMatched}
                className={`${bgClass} border-2 rounded-xl p-3 transition-all active:scale-95 ${
                  isMatched ? "scale-90" : "hover:shadow-md"
                }`}
              >
                <p className={`text-sm font-medium ${isMatched ? "line-through text-text-light" : ""}`}>
                  {card.text}
                </p>
                <p className="text-xs text-text-light mt-0.5">{card.type === "en" ? "🇬🇧" : "🇨🇳"}</p>
              </button>
            )
          })}
        </div>
      </div>
      <NavBar />
    </div>
  )
}

export default function MatchGamePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>}>
      <MatchGameInner />
    </Suspense>
  )
}
