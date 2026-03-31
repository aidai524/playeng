"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { units } from "@/data/units"
import { useProgressStore, initializeStore } from "@/lib/progress"
import { initVoices } from "@/lib/speech"
import ProgressBar from "@/components/ProgressBar"
import NavBar from "@/components/NavBar"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const getUnitProgress = useProgressStore(s => s.getUnitProgress)
  const getTodayStats = useProgressStore(s => s.getTodayStats)
  const getStreakDays = useProgressStore(s => s.getStreakDays)
  const getReviewCount = useProgressStore(s => s.getReviewCount)

  useEffect(() => {
    initializeStore()
    initVoices()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-light">加载中...</p>
      </div>
    )
  }

  const todayStats = getTodayStats()
  const streak = getStreakDays()
  const reviewCount = getReviewCount()

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-5">
        <header className="text-center pt-4 pb-2">
          <h1 className="text-2xl font-bold text-primary">🎓 英语小达人</h1>
          <p className="text-text-light text-sm mt-1">四年级下册 · 词汇学习</p>
        </header>

        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm">今日学习</p>
              <p className="text-2xl font-bold">{todayStats.learned + todayStats.reviewed} 个单词</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">连续学习</p>
              <p className="text-2xl font-bold">🔥 {streak} 天</p>
            </div>
          </div>
        </div>

        {reviewCount > 0 && (
          <Link
            href="/review"
            className="block bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-sm hover:scale-[1.02] transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔄</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">待复习</h3>
                <p className="text-white/80 text-sm">{reviewCount} 个单词等你来复习</p>
              </div>
              <span className="text-2xl font-bold">开始 →</span>
            </div>
          </Link>
        )}

        <div>
          <h2 className="text-lg font-bold mb-3">📚 选择单元</h2>
          <div className="space-y-3">
            {units.map(unit => {
              const progress = getUnitProgress(unit.id, unit.words.length)
              return (
                <Link
                  key={unit.id}
                  href={`/learn/${unit.id}`}
                  className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-light transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{unit.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{unit.title}</h3>
                      <p className="text-text-light text-xs">{unit.words.length} 个单词</p>
                    </div>
                    <span className="text-primary font-bold text-sm">
                      {progress.mastered}/{unit.words.length}
                    </span>
                  </div>
                  <ProgressBar
                    mastered={progress.mastered}
                    learning={progress.learning}
                    newCount={progress.new}
                    total={unit.words.length}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
