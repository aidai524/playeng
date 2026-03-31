"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { units } from "@/data/units"
import { downloadWorkbook } from "@/lib/workbook"
import NavBar from "@/components/NavBar"

export default function WorkbookPage() {
  const router = useRouter()
  const [generating, setGenerating] = useState<string | null>(null)

  const handleDownload = (unit: typeof units[0]) => {
    setGenerating(unit.id)
    setTimeout(() => {
      downloadWorkbook(unit)
      setGenerating(null)
    }, 100)
  }

  const handleDownloadAll = () => {
    setGenerating("all")
    setTimeout(() => {
      units.forEach((unit, i) => {
        setTimeout(() => downloadWorkbook(unit), i * 200)
      })
      setGenerating(null)
    }, 100)
  }

  const sections = [
    {
      title: "Section 1: Word Tracing",
      desc: "Trace the English words and practice handwriting",
      emoji: "✍️",
    },
    {
      title: "Section 2: Look and Write",
      desc: "Look at the emoji/icon and write the English word",
      emoji: "👀",
    },
    {
      title: "Section 3: Dialogue Fill-in",
      desc: "Fill in the missing words in conversations",
      emoji: "💬",
    },
    {
      title: "Section 4: Matching",
      desc: "Match English words with their Chinese meanings",
      emoji: "🔗",
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-5">
        <header className="text-center pt-4">
          <h1 className="text-2xl font-bold">📄 可打印练习册</h1>
          <p className="text-text-light text-sm mt-1">选择单元 → 下载 PDF → 打印练习</p>
        </header>

        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-4 text-white">
          <h3 className="font-bold mb-2">📋 练习册包含 4 个板块</h3>
          <div className="space-y-1.5">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{s.emoji}</span>
                <span className="font-medium">{s.title}</span>
                <span className="text-white/70">- {s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">📚 按单元下载</h2>
            <button
              onClick={handleDownloadAll}
              disabled={generating === "all"}
              className="text-sm px-3 py-1.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {generating === "all" ? "生成中..." : "全部下载"}
            </button>
          </div>

          <div className="space-y-3">
            {units.map(unit => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{unit.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{unit.title}</h3>
                    <p className="text-text-light text-xs">
                      {unit.words.length} 个单词 · {unit.dialogues.length} 个对话
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(unit)}
                    disabled={generating === unit.id}
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium text-sm hover:from-teal-600 hover:to-cyan-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {generating === unit.id ? "⏳ 生成中" : "📥 下载 PDF"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <h3 className="font-bold text-sm text-amber-800 mb-2">💡 使用提示</h3>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• 下载后用 A4 纸打印效果最佳</li>
            <li>• 建议每天练习 1-2 页，搭配 App 一起使用</li>
            <li>• 每个单元的练习册可以重复打印多次</li>
            <li>• 家长可以用 Answer 行检查答案</li>
          </ul>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
