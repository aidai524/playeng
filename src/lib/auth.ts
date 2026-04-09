"use client"

import { create } from "zustand"
import { getSupabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean

  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string }>
  signOut: () => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  signUp: async (email: string, password: string) => {
    set({ loading: true })
    const { data, error } = await getSupabase().auth.signUp({ email, password })
    set({ loading: false })
    if (error) return { error: error.message }

    if (data.user) {
      // If email confirmation is disabled, data.session exists and user is logged in
      // If email confirmation is enabled, data.session is null — user must verify email first
      if (data.session) {
        set({ user: data.user })
        await getSupabase().from("profiles").upsert({
          id: data.user.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" })
        return { error: null }
      }
      // Email confirmation required
      return { error: "注册成功！请查收邮箱确认后再登录。如果收不到邮件，请联系管理员。" }
    }

    return { error: null }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
    set({ loading: false })
    if (error) return { error: error.message }
    if (data.user) set({ user: data.user })
    return { error: "" }
  },

  signOut: async () => {
    await getSupabase().auth.signOut()
    set({ user: null })
    localStorage.removeItem("english-practice-progress")
    localStorage.removeItem("english-practice-games")
  },

  initializeAuth: async () => {
    const { data: { session } } = await getSupabase().auth.getSession()
    set({ user: session?.user ?? null, initialized: true })

    getSupabase().auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },
}))
