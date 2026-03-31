"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { units } from "@/data/units"
import { useProgressStore, initializeStore } from "@/lib/progress"
import WordCard from "@/components/WordCard"
import ProgressBar from "@/components/ProgressBar"
import NavBar from "@/components/NavBar"

export const runtime = "edge";

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unitId as string
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const unit = units.find(u => u.id === unitId)
  const getUnitProgress = useProgressStore(s => s.getUnitProgress)
  const markWordSeen = useProgressStore(s => s.markWordSeen)

  useEffect(() => {
    initializeStore()
    setMounted(true)
  }, [])

  const handleMastered = useCallback((wordId: string, correct: boolean) => {
    markWordSeen(wordId, correct)
  }, [markWordSeen])

  if (!mounted) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>
  }

  if (!unit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">😕</span>
        <p>找不到这个单元</p>
        <button onClick={() => router.push("/")} className="text-primary font-medium">返回首页</button>
      </div>
    )
  }

  const progress = getUnitProgress(unit.id, unit.words.length)
  const word = unit.words[currentIndex]

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-4">
        <header className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-2xl">←</button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">{unit.emoji} {unit.title}</h1>
            <ProgressBar mastered={progress.mastered} learning={progress.learning} newCount={progress.new} total={unit.words.length} />
          </div>
          <span className="text-sm text-text-light">{currentIndex + 1}/{unit.words.length}</span>
        </header>

        <WordCard key={word.id} word={word} onMastered={handleMastered} />

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-text-light disabled:opacity-30 hover:bg-gray-200 transition-colors"
          >
            ← 上一个
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(unit.words.length - 1, currentIndex + 1))}
            disabled={currentIndex === unit.words.length - 1}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-30 hover:bg-primary-dark transition-colors"
          >
            下一个 →
          </button>
        </div>

        {unit.dialogues.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-primary">💬 对话场景：{unit.dialogues[0].title}</h3>
            {unit.dialogues[0].lines.map((line, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-bold text-primary w-6">{line.speaker}</span>
                <div>
                  <p className="text-text">{line.en}</p>
                  <p className="text-text-light text-xs">{line.cn}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}
