"use client"

import Link from "next/link"
import { getAllUnits } from "@/data/courses"
import { useGameStore, initializeGameStore, ALL_BADGES } from "@/lib/game"
import { useEffect, useState } from "react"
import NavBar from "@/components/NavBar"

export default function GameCenter() {
  const [mounted, setMounted] = useState(false)
  const totalScore = useGameStore(s => s.totalScore)
  const badges = useGameStore(s => s.badges)

  useEffect(() => {
    initializeGameStore()
    setMounted(true)
  }, [])

  if (!mounted) return <div className="flex-1 flex items-center justify-center"><p className="text-text-light">加载中...</p></div>

  const games = [
    {
      id: "match",
      title: "配对消消乐",
      emoji: "🃏",
      description: "英文 ↔ 中文配对，计时挑战",
      href: "/game/match",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "spell",
      title: "拼写大挑战",
      emoji: "✏️",
      description: "听发音，拼出正确单词",
      href: "/game/spell",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "listen",
      title: "听力大闯关",
      emoji: "🎧",
      description: "听发音，选出正确中文意思",
      href: "/game/listen",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "roleplay",
      title: "对话角色扮演",
      emoji: "🎭",
      description: "扮演角色，补全英语对话",
      href: "/game/roleplay",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-5">
        <header className="text-center pt-4">
          <h1 className="text-2xl font-bold">🎮 游戏中心</h1>
          <p className="text-text-light text-sm mt-1">总分：{totalScore} 🪙</p>
        </header>

        <div className="space-y-3">
          <h2 className="font-bold text-lg">选择游戏</h2>
          {games.map(game => (
            <Link
              key={game.id}
              href={game.href}
              className="block"
            >
              <div className={`bg-gradient-to-r ${game.color} rounded-2xl p-5 text-white shadow-lg hover:scale-[1.02] transition-transform active:scale-[0.98]`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{game.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{game.title}</h3>
                    <p className="text-white/80 text-sm">{game.description}</p>
                  </div>
                  <span className="ml-auto text-2xl">›</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-3">🏅 徽章墙 ({badges.length}/{ALL_BADGES.length})</h2>
          <div className="grid grid-cols-3 gap-2">
            {ALL_BADGES.map(badge => {
              const unlocked = badges.includes(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`text-center p-2 rounded-xl ${unlocked ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 opacity-40"}`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <p className="text-xs font-medium mt-1">{badge.name}</p>
                  {!unlocked && <p className="text-xs text-text-light">🔒</p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
