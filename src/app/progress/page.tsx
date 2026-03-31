"use client"

import { useEffect, useState } from "react"
import { units } from "@/data/units"
import { useProgressStore, initializeStore } from "@/lib/progress"
import NavBar from "@/components/NavBar"

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false)
  const getUnitProgress = useProgressStore(s => s.getUnitProgress)
  const getTodayStats = useProgressStore(s => s.getTodayStats)
  const getStreakDays = useProgressStore(s => s.getStreakDays)

  useEffect(() => {
    initializeStore()
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>
  }

  const todayStats = getTodayStats()
  const streak = getStreakDays()

  let totalWords = 0, totalMastered = 0
  units.forEach(u => {
    const p = getUnitProgress(u.id, u.words.length)
    totalWords += u.words.length
    totalMastered += p.mastered
  })

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-5">
        <header className="text-center pt-4">
          <h1 className="text-2xl font-bold">📊 学习进度</h1>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-primary">{totalMastered}</p>
            <p className="text-xs text-text-light mt-1">已掌握单词</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-warning">{totalWords - totalMastered}</p>
            <p className="text-xs text-text-light mt-1">待学习单词</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-success">🔥 {streak}</p>
            <p className="text-xs text-text-light mt-1">连续学习天数</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-primary">{todayStats.learned + todayStats.reviewed}</p>
            <p className="text-xs text-text-light mt-1">今日练习次数</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-3">总体进度</h2>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 rounded-full"
              style={{ width: `${totalWords > 0 ? (totalMastered / totalWords) * 100 : 0}%` }}
            />
          </div>
          <p className="text-sm text-text-light mt-2 text-center">
            {totalMastered} / {totalWords} 个单词已掌握
            ({totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0}%)
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-bold">各单元详情</h2>
          {units.map(unit => {
            const p = getUnitProgress(unit.id, unit.words.length)
            const pct = unit.words.length > 0 ? Math.round((p.mastered / unit.words.length) * 100) : 0
            return (
              <div key={unit.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{unit.emoji}</span>
                  <span className="text-sm font-medium flex-1">{unit.title}</span>
                  <span className="text-xs text-text-light">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex gap-3 mt-1 text-xs text-text-light">
                  <span>✅ {p.mastered}</span>
                  <span>🔄 {p.learning}</span>
                  <span>🆕 {p.new}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <NavBar />
    </div>
  )
}
