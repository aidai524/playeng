"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"
import { syncOnLogin } from "@/lib/sync"
import { initializeStore } from "@/lib/progress"
import { initializeGameStore } from "@/lib/game"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")

  const signUp = useAuthStore(s => s.signUp)
  const signIn = useAuthStore(s => s.signIn)
  const loading = useAuthStore(s => s.loading)

  const handleSubmit = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) { setError("请输入邮箱"); return }
    if (!password) { setError("请输入密码"); return }
    if (password.length < 6) { setError("密码至少6位"); return }
    setError("")

    if (mode === "register") {
      const { error } = await signUp(trimmedEmail, password)
      if (error) {
        setError(error)
        return
      }
    } else {
      const { error } = await signIn(trimmedEmail, password)
      if (error) {
        setError(error)
        return
      }
    }

    initializeStore()
    initializeGameStore()

    const user = useAuthStore.getState().user
    if (user) await syncOnLogin(user.id)

    router.push("/")
  }

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError("")
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="text-6xl block mb-3">🎓</span>
          <h1 className="text-2xl font-bold text-primary">英语小达人</h1>
          <p className="text-text-light text-sm mt-1">
            {mode === "login" ? "登录以同步学习进度" : "创建新账号"}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="输入邮箱"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={mode === "register" ? "设置密码（至少6位）" : "输入密码"}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && <p className="text-danger text-sm text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "请稍候..." : mode === "login" ? "登录" : "注册"}
          </button>

          <button
            onClick={switchMode}
            className="w-full py-2 text-text-light text-sm hover:text-primary transition-colors"
          >
            {mode === "login" ? "没有账号？点击注册" : "已有账号？点击登录"}
          </button>
        </div>
      </div>
    </div>
  )
}
