"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth"
import { syncOnLogin } from "@/lib/sync"
import { initializeStore } from "@/lib/progress"
import { initializeGameStore } from "@/lib/game"

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore(s => s.user)
  const initialized = useAuthStore(s => s.initialized)
  const initializeAuth = useAuthStore(s => s.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!initialized) return

    if (!user && pathname !== "/login") {
      router.replace("/login")
      return
    }

    if (user && pathname === "/login") {
      initializeStore()
      initializeGameStore()
      syncOnLogin(user.id)
      router.replace("/")
      return
    }

    if (user) {
      initializeStore()
      initializeGameStore()
    }
  }, [user, initialized, pathname, router])

  if (!initialized) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-light">加载中...</p>
      </div>
    )
  }

  return <>{children}</>
}
