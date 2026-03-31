"use client"

import { useEffect, useState, useMemo } from "react"
import { units } from "@/data/units"
import { useProgressStore, initializeStore } from "@/lib/progress"
import NavBar from "@/components/NavBar"

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false)
  const getUnitProgress = useProgressStore(s => s.getUnitProgress)
  const getTodayStats = useProgressStore(s => s.getTodayStats)
  const getStreakDays = useProgressStore(s => s.getStreakDays)
  const getDailyLogs = useProgressStore(s => s.getDailyLogs)
  const getWeakWords = useProgressStore(s => s.getWeakWords)
  const wordProgress = useProgressStore(s => s.wordProgress)

  useEffect(() => {
    initializeStore()
    setMounted(true)
  }, [])

  const calendarData = useMemo(() => {
    const logs = mounted ? getDailyLogs() : []
    const logMap = new Map(logs.map(l => [l.date, l]))
    const days: { date: string; count: number; dayOfWeek: number }[] = []
    const today = new Date()
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      const log = logMap.get(dateStr)
      days.push({
        date: dateStr,
        count: log ? log.wordsLearned + log.wordsReviewed : 0,
        dayOfWeek: d.getDay(),
      })
    }
    return days
  }, [mounted, getDailyLogs])

  const weakWordsList = useMemo(() => {
    if (!mounted) return []
    return getWeakWords(8).map(ww => {
      const word = units.flatMap(u => u.words).find(w => w.id === ww.wordId)
      return word ? { ...ww, en: word.en, cn: word.cn, emoji: word.emoji } : null
    }).filter(Boolean) as { wordId: string; wrongCount: number; correctCount: number; en: string; cn: string; emoji: string }[]
  }, [mounted, getWeakWords, wordProgress])

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

  const weekLabels = ["日", "一", "二", "三", "四", "五", "六"]
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

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

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">学习日历</h2>
            <span className="text-xs text-text-light">近4周</span>
          </div>
          <div className="flex gap-0.5 justify-center mb-1">
            {weekLabels.map(d => (
              <div key={d} className="w-[calc((100%-6px)/7)] text-center text-xs text-text-light">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const firstDay = calendarData[0]?.dayOfWeek ?? 0
              const cells = []
              for (let i = 0; i < firstDay; i++) {
                cells.push(<div key={`empty-${i}`} />)
              }
              calendarData.forEach(day => {
                let color = "bg-gray-100"
                if (day.count > 0 && day.count <= 5) color = "bg-green-200"
                else if (day.count > 5 && day.count <= 15) color = "bg-green-400"
                else if (day.count > 15 && day.count <= 30) color = "bg-green-500"
                else if (day.count > 30) color = "bg-green-700"
                cells.push(
                  <div
                    key={day.date}
                    className={`aspect-square rounded-sm ${color} flex items-center justify-center`}
                    title={`${day.date}: ${day.count} 次`}
                  >
                    <span className="text-[8px] text-text-light">{new Date(day.date).getDate()}</span>
                  </div>
                )
              })
              return cells
            })()}
          </div>
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-xs text-text-light">少</span>
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-700" />
            <span className="text-xs text-text-light">多</span>
          </div>
        </div>

        {weakWordsList.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold mb-3">⚠️ 薄弱词汇 ({weakWordsList.length})</h2>
            <p className="text-xs text-text-light mb-3">这些单词错误率较高，需要加强练习</p>
            <div className="space-y-2">
              {weakWordsList.map(word => {
                const total = word.correctCount + word.wrongCount
                const pct = total > 0 ? Math.round((word.correctCount / total) * 100) : 0
                return (
                  <div key={word.wordId} className="flex items-center gap-2 p-2 bg-red-50 rounded-xl">
                    <span className="text-lg">{word.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{word.en}</span>
                        <span className="text-xs text-text-light">{word.cn}</span>
                      </div>
                      <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-red-400 rounded-full"
                          style={{ width: `${100 - pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-red-600 font-bold">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
