"use client"

interface ProgressBarProps {
  mastered: number
  learning: number
  newCount: number
  total: number
}

export default function ProgressBar({ mastered, learning, newCount, total }: ProgressBarProps) {
  const masteredPct = total > 0 ? (mastered / total) * 100 : 0
  const learningPct = total > 0 ? (learning / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex gap-4 text-xs text-text-light">
        <span>✅ 已掌握 {mastered}</span>
        <span>🔄 学习中 {learning}</span>
        <span>🆕 未学习 {newCount}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className="bg-success transition-all duration-500"
          style={{ width: `${masteredPct}%` }}
        />
        <div
          className="bg-warning transition-all duration-500"
          style={{ width: `${learningPct}%` }}
        />
      </div>
      <p className="text-xs text-text-light text-right">
        {total > 0 ? Math.round((mastered / total) * 100) : 0}% 完成
      </p>
    </div>
  )
}
