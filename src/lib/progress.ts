"use client"

import { create } from "zustand"

export type WordStatus = "new" | "learning" | "mastered"

export interface WordProgress {
  wordId: string
  status: WordStatus
  correctCount: number
  wrongCount: number
  lastSeen: number
  nextReview: number
}

export interface DailyLog {
  date: string
  wordsLearned: number
  wordsReviewed: number
  timeSpent: number
}

interface ProgressState {
  wordProgress: Record<string, WordProgress>
  dailyLogs: DailyLog[]
  streakDays: number

  getWordProgress: (wordId: string) => WordProgress
  markWordSeen: (wordId: string, correct: boolean) => void
  getUnitProgress: (unitId: string, totalWords: number) => { mastered: number; learning: number; new: number }
  getTodayStats: () => { learned: number; reviewed: number }
  getStreakDays: () => number
  getReviewWordIds: () => string[]
  getReviewCount: () => number
}

const STORAGE_KEY = "english-practice-progress"

function loadFromStorage(): Partial<ProgressState> {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch {}
  return {}
}

function saveToStorage(state: { wordProgress: Record<string, WordProgress>; dailyLogs: DailyLog[] }) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      wordProgress: state.wordProgress,
      dailyLogs: state.dailyLogs,
    }))
  } catch {}
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  wordProgress: {},
  dailyLogs: [],
  streakDays: 0,

  getWordProgress: (wordId: string) => {
    const state = get()
    return state.wordProgress[wordId] || {
      wordId,
      status: "new" as WordStatus,
      correctCount: 0,
      wrongCount: 0,
      lastSeen: 0,
      nextReview: 0,
    }
  },

  markWordSeen: (wordId: string, correct: boolean) => {
    set((state) => {
      const existing = state.wordProgress[wordId] || {
        wordId,
        status: "new" as WordStatus,
        correctCount: 0,
        wrongCount: 0,
        lastSeen: 0,
        nextReview: 0,
      }

      const now = Date.now()
      const correctCount = existing.correctCount + (correct ? 1 : 0)
      const wrongCount = existing.wrongCount + (correct ? 0 : 1)

      let status: WordStatus = "learning"
      if (correctCount >= 3 && correctCount > wrongCount * 2) {
        status = "mastered"
      }

      const hoursUntilNext = status === "mastered" ? 72 : status === "learning" ? 8 : 2
      const nextReview = now + hoursUntilNext * 60 * 60 * 1000

      const today = getTodayDate()
      const logs = [...state.dailyLogs]
      const todayLog = logs.find(l => l.date === today)
      if (todayLog) {
        if (existing.status === "new") todayLog.wordsLearned++
        todayLog.wordsReviewed++
      } else {
        logs.push({ date: today, wordsLearned: existing.status === "new" ? 1 : 0, wordsReviewed: 1, timeSpent: 0 })
      }

      const newState = {
        wordProgress: { ...state.wordProgress, [wordId]: { wordId, status, correctCount, wrongCount, lastSeen: now, nextReview } },
        dailyLogs: logs,
      }
      saveToStorage(newState)
      return newState
    })
  },

  getUnitProgress: (unitId: string, totalWords: number) => {
    const state = get()
    const prefix = unitId.replace("unit-", "u") + "-"
    let mastered = 0, learning = 0, newCount = 0
    for (let i = 1; i <= totalWords; i++) {
      const id = prefix + String(i).padStart(2, "0")
      const wp = state.wordProgress[id]
      if (!wp || wp.status === "new") newCount++
      else if (wp.status === "mastered") mastered++
      else learning++
    }
    return { mastered, learning, new: newCount }
  },

  getTodayStats: () => {
    const today = getTodayDate()
    const log = get().dailyLogs.find(l => l.date === today)
    return { learned: log?.wordsLearned ?? 0, reviewed: log?.wordsReviewed ?? 0 }
  },

  getStreakDays: () => {
    const logs = get().dailyLogs.sort((a, b) => b.date.localeCompare(a.date))
    if (logs.length === 0) return 0
    let streak = 0
    const today = getTodayDate()
    let checkDate = new Date(today)
    for (const log of logs) {
      const logDateStr = checkDate.toISOString().split("T")[0]
      if (log.date === logDateStr) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (log.date < logDateStr) {
        break
      }
    }
    return streak
  },

  getReviewWordIds: () => {
    const state = get()
    const now = Date.now()
    return Object.values(state.wordProgress)
      .filter(wp => wp.status === "learning" && wp.nextReview <= now)
      .sort((a, b) => a.nextReview - b.nextReview)
      .map(wp => wp.wordId)
  },

  getReviewCount: () => get().getReviewWordIds().length,
}))

export function initializeStore() {
  const saved = loadFromStorage()
  if (saved.wordProgress || saved.dailyLogs) {
    useProgressStore.setState({
      wordProgress: (saved.wordProgress as Record<string, WordProgress>) || {},
      dailyLogs: (saved.dailyLogs as DailyLog[]) || [],
    })
  }
}
