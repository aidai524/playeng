"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Word } from "@/data/units"
import { useProgressStore, initializeStore } from "@/lib/progress"
import { useCourseStore } from "@/lib/courseStore"
import { speak } from "@/lib/speech"
import NavBar from "@/components/NavBar"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ReviewPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [reviewWords, setReviewWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [result, setResult] = useState<"known" | "unknown" | null>(null)
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 })
  const [finished, setFinished] = useState(false)
  const allWords = useCourseStore(s => s.currentWords)

  const getReviewWordIds = useProgressStore(s => s.getReviewWordIds)
  const markWordSeen = useProgressStore(s => s.markWordSeen)

  useEffect(() => {
    initializeStore()
    setMounted(true)
  }, [])

  const loadReviewWords = useCallback(() => {
    const dueIds = new Set(getReviewWordIds())
    const due = allWords.filter(w => dueIds.has(w.id))

    if (due.length === 0) {
      const learning = allWords.filter(w => {
        const p = useProgressStore.getState().wordProgress[w.id]
        return p && p.status === "learning"
      })
      setReviewWords(shuffle(learning).slice(0, 10))
    } else {
      setReviewWords(shuffle(due).slice(0, 15))
    }
    setCurrentIndex(0)
    setFlipped(false)
    setResult(null)
    setSessionStats({ correct: 0, wrong: 0 })
    setFinished(false)
  }, [getReviewWordIds])

  useEffect(() => {
    if (mounted) loadReviewWords()
  }, [mounted, loadReviewWords])

  const currentWord = reviewWords[currentIndex]

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true)
      if (currentWord) speak(currentWord.en, 0.85)
    }
  }

  const handleAnswer = (known: boolean) => {
    if (!currentWord) return
    markWordSeen(currentWord.id, known)
    setResult(known ? "known" : "unknown")

    const newStats = {
      correct: sessionStats.correct + (known ? 1 : 0),
      wrong: sessionStats.wrong + (known ? 0 : 1),
    }
    setSessionStats(newStats)

    setTimeout(() => {
      if (currentIndex + 1 >= reviewWords.length) {
        setSessionStats(newStats)
        setFinished(true)
      } else {
        setCurrentIndex(i => i + 1)
        setFlipped(false)
        setResult(null)
      }
    }, 800)
  }

  if (!mounted) return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>

  if (reviewWords.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4 text-center">
          <span className="text-7xl">✨</span>
          <h1 className="text-2xl font-bold">暂无待复习单词</h1>
          <p className="text-text-light">先去学习一些新单词吧！</p>
          <button onClick={() => router.push("/")} className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            去学习
          </button>
        </div>
        <NavBar />
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6 text-center">
          <span className="text-7xl">{sessionStats.wrong === 0 ? "🌟" : "👏"}</span>
          <h1 className="text-3xl font-bold text-primary">复习完成！</h1>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-3xl font-bold text-success">{sessionStats.correct}</p>
              <p className="text-sm text-text-light">认识</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-3xl font-bold text-danger">{sessionStats.wrong}</p>
              <p className="text-sm text-text-light">不认识</p>
            </div>
          </div>
          <p className="text-text-light text-sm">
            正确率 {sessionStats.correct + sessionStats.wrong > 0
              ? Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.wrong)) * 100)
              : 0}%
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={loadReviewWords} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
              继续复习
            </button>
            <button onClick={() => router.push("/")} className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-text-light hover:bg-gray-200 transition-colors">
              返回首页
            </button>
          </div>
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
          <button onClick={() => router.push("/")} className="text-2xl">←</button>
          <h1 className="font-bold text-lg">🔄 每日复习</h1>
          <span className="text-sm text-text-light">{currentIndex + 1}/{reviewWords.length}</span>
        </header>

        <div className="flex gap-1">
          {reviewWords.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < currentIndex ? "bg-success" :
                i === currentIndex ? "bg-primary" :
                "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3 justify-center text-sm">
          <span className="text-success font-medium">✅ {sessionStats.correct}</span>
          <span className="text-danger font-medium">❌ {sessionStats.wrong}</span>
        </div>

        <div
          onClick={handleFlip}
          className={`bg-white rounded-2xl p-8 shadow-sm border-2 transition-all cursor-pointer active:scale-[0.98] min-h-[280px] flex flex-col items-center justify-center ${
            !flipped ? "border-primary-light" :
            result === "known" ? "border-success" :
            result === "unknown" ? "border-danger" :
            "border-primary"
          }`}
        >
          <span className="text-6xl mb-4">{currentWord.emoji}</span>

          {!flipped ? (
            <>
              <h2 className="text-3xl font-bold mb-2">{currentWord.cn}</h2>
              <p className="text-text-light text-sm">👆 点击翻转查看英文</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-primary mb-2">{currentWord.en}</h2>
              <p className="text-text-light">{currentWord.cn}</p>
              {currentWord.example && (
                <p className="text-sm text-text-light mt-3 bg-gray-50 px-3 py-2 rounded-lg">📝 {currentWord.example}</p>
              )}
            </>
          )}
        </div>

        {flipped && !result && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 bg-red-50 border-2 border-red-200 text-danger rounded-xl font-bold text-lg hover:bg-red-100 transition-colors active:scale-95"
            >
              😕 不认识
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 bg-green-50 border-2 border-green-200 text-success rounded-xl font-bold text-lg hover:bg-green-100 transition-colors active:scale-95"
            >
              😊 认识
            </button>
          </div>
        )}

        {result && (
          <div className="text-center">
            {result === "known"
              ? <p className="text-success font-bold">太棒了！继续保持 💪</p>
              : <p className="text-danger font-medium">没关系，下次一定记住！加油 💪</p>
            }
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}
