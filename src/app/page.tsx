"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { grades } from "@/data/courses"
import { useProgressStore, initializeStore } from "@/lib/progress"
import { useAuthStore } from "@/lib/auth"
import { initVoices } from "@/lib/speech"
import ProgressBar from "@/components/ProgressBar"
import NavBar from "@/components/NavBar"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null)
  const getUnitProgress = useProgressStore(s => s.getUnitProgress)
  const getTodayStats = useProgressStore(s => s.getTodayStats)
  const getStreakDays = useProgressStore(s => s.getStreakDays)
  const getReviewCount = useProgressStore(s => s.getReviewCount)
  const user = useAuthStore(s => s.user)
  const signOut = useAuthStore(s => s.signOut)

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
  const selectedGrade = grades.find(g => g.id === selectedGradeId)

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-5">
        <header className="text-center pt-4 pb-2 relative">
          <h1 className="text-2xl font-bold text-primary">🎓 英语小达人</h1>
          <p className="text-text-light text-sm mt-1">小学英语 · 词汇学习</p>
          {user && (
            <button
              onClick={signOut}
              className="absolute right-0 top-4 text-xs text-text-light hover:text-danger transition-colors"
            >
              退出登录
            </button>
          )}
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

        {!selectedGrade ? (
          <div>
            <h2 className="text-lg font-bold mb-3">📚 选择教材</h2>
            <div className="space-y-3">
              {grades.map(grade => {
                const totalWords = grade.units.reduce((s, u) => s + u.words.length, 0)
                return (
                  <button
                    key={grade.id}
                    onClick={() => setSelectedGradeId(grade.id)}
                    className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-light transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{grade.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{grade.title}</h3>
                        <p className="text-text-light text-sm mt-1">{grade.description}</p>
                        <p className="text-text-light text-xs mt-1">{grade.units.length} 个单元 · {totalWords} 个单词</p>
                      </div>
                      <span className="text-primary text-xl">›</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setSelectedGradeId(null)}
                className="text-primary font-medium text-sm hover:underline"
              >
                ← 返回教材选择
              </button>
              <span className="text-text-light">·</span>
              <h2 className="text-lg font-bold">{selectedGrade.emoji} {selectedGrade.title}</h2>
            </div>
            <div className="space-y-3">
              {selectedGrade.units.map(unit => {
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
        )}
      </div>
      <NavBar />
    </div>
  )
}
