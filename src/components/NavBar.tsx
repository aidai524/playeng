"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useCourseStore } from "@/lib/courseStore"
import { getGradeById } from "@/data/courses"

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const currentGradeId = useCourseStore(s => s.currentGradeId)
  const setCurrentGrade = useCourseStore(s => s.setCurrentGrade)
  const currentGrade = currentGradeId ? getGradeById(currentGradeId) : undefined

  const handleSwitchGrade = () => {
    setCurrentGrade(null)
    router.push("/")
  }

  const links = [
    { href: "/", label: "首页", emoji: "🏠" },
    { href: "/game", label: "游戏", emoji: "🎮" },
    { href: "/review", label: "复习", emoji: "🔄" },
    { href: "/progress", label: "进度", emoji: "📊" },
  ]

  return (
    <nav className="mt-auto border-t border-gray-100 bg-white sticky bottom-0 pb-[env(safe-area-inset-bottom)]">
      {currentGrade && (
        <button
          onClick={handleSwitchGrade}
          className="w-full flex items-center justify-center gap-1 py-1 text-xs text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <span>{currentGrade.emoji}</span>
          <span className="font-medium">{currentGrade.title}</span>
          <span className="text-text-light">· 点击切换</span>
        </button>
      )}
      <div className="flex justify-around py-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              pathname === link.href ? "text-primary" : "text-text-light"
            }`}
          >
            <span className="text-xl">{link.emoji}</span>
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
