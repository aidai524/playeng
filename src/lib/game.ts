"use client"

import { create } from "zustand"

export interface Badge {
  id: string
  name: string
  emoji: string
  description: string
  unlockedAt?: number
}

export const ALL_BADGES: Badge[] = [
  { id: "first-game", name: "初出茅庐", emoji: "🎮", description: "完成第一个游戏" },
  { id: "perfect-match", name: "完美配对", emoji: "🎯", description: "配对游戏零失误通关" },
  { id: "speed-demon", name: "快手达人", emoji: "⚡", description: "配对游戏60秒内通关" },
  { id: "spell-5", name: "拼写新星", emoji: "⭐", description: "拼写挑战连续答对5题" },
  { id: "spell-10", name: "拼写大师", emoji: "🏅", description: "拼写挑战连续答对10题" },
  { id: "score-100", name: "百分学霸", emoji: "💯", description: "单次游戏获得100分" },
  { id: "score-200", name: "超级学霸", emoji: "🏆", description: "单次游戏获得200分" },
  { id: "daily-3", name: "勤奋学员", emoji: "📅", description: "累计学习3天" },
  { id: "daily-7", name: "一周坚持", emoji: "🔥", description: "连续学习7天" },
]

interface GameState {
  totalScore: number
  badges: string[]
  gameHistory: { game: string; score: number; date: string }[]

  addScore: (game: string, score: number) => void
  unlockBadge: (badgeId: string) => void
  hasBadge: (badgeId: string) => boolean
}

const STORAGE_KEY = "english-practice-games"

function loadGames(): Partial<GameState> {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch {}
  return {}
}

function saveGames(state: { totalScore: number; badges: string[]; gameHistory: { game: string; score: number; date: string }[] }) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export const useGameStore = create<GameState>((set, get) => ({
  totalScore: 0,
  badges: [],
  gameHistory: [],

  addScore: (game: string, score: number) => {
    set((state) => {
      const newState = {
        totalScore: state.totalScore + score,
        badges: state.badges,
        gameHistory: [...state.gameHistory, { game, score, date: new Date().toISOString().split("T")[0] }],
      }
      saveGames(newState)
      return newState
    })
  },

  unlockBadge: (badgeId: string) => {
    set((state) => {
      if (state.badges.includes(badgeId)) return state
      const newState = {
        totalScore: state.totalScore,
        badges: [...state.badges, badgeId],
        gameHistory: state.gameHistory,
      }
      saveGames(newState)
      return newState
    })
  },

  hasBadge: (badgeId: string) => get().badges.includes(badgeId),
}))

export function initializeGameStore() {
  const saved = loadGames()
  if (saved.totalScore || saved.badges?.length || saved.gameHistory?.length) {
    useGameStore.setState({
      totalScore: (saved.totalScore as number) || 0,
      badges: (saved.badges as string[]) || [],
      gameHistory: (saved.gameHistory as { game: string; score: number; date: string }[]) || [],
    })
  }
}

export function checkAndUnlockBadges(
  game: string,
  score: number,
  perfect: boolean,
  timeMs: number,
  streak: number,
  unlockBadge: (id: string) => void
) {
  unlockBadge("first-game")
  if (score >= 100) unlockBadge("score-100")
  if (score >= 200) unlockBadge("score-200")
  if (game === "match" && perfect) unlockBadge("perfect-match")
  if (game === "match" && timeMs < 60000) unlockBadge("speed-demon")
  if (game === "spell" && streak >= 5) unlockBadge("spell-5")
  if (game === "spell" && streak >= 10) unlockBadge("spell-10")
}
