"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavBar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "首页", emoji: "🏠" },
    { href: "/game", label: "游戏", emoji: "🎮" },
    { href: "/review", label: "复习", emoji: "🔄" },
    { href: "/progress", label: "进度", emoji: "📊" },
  ]

  return (
    <nav className="mt-auto border-t border-gray-100 bg-white sticky bottom-0 pb-[env(safe-area-inset-bottom)]">
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
