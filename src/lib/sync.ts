import { getSupabase } from "./supabase"
import { useProgressStore, type WordProgress, type DailyLog } from "./progress"
import { useGameStore } from "./game"

export async function pullFromCloud(userId: string) {
  const sb = getSupabase()
  const [wordResult, logsResult, gameResult] = await Promise.all([
    sb.from("word_progress").select("*").eq("user_id", userId),
    sb.from("daily_logs").select("*").eq("user_id", userId).order("date"),
    sb.from("game_records").select("*").eq("user_id", userId).limit(1),
  ])

  if (wordResult.data && wordResult.data.length > 0) {
    const localProgress = useProgressStore.getState().wordProgress
    const cloudProgress: Record<string, WordProgress> = {}

    for (const row of wordResult.data) {
      cloudProgress[row.word_id] = {
        wordId: row.word_id,
        status: row.status,
        correctCount: row.correct_count,
        wrongCount: row.wrong_count,
        lastSeen: new Date(row.last_seen).getTime(),
        nextReview: new Date(row.next_review).getTime(),
      }
    }

    const merged = { ...localProgress }
    for (const [id, cloud] of Object.entries(cloudProgress)) {
      const local = merged[id]
      if (!local || cloud.lastSeen > local.lastSeen) {
        merged[id] = cloud
      }
    }

    useProgressStore.setState({ wordProgress: merged })
  }

  if (logsResult.data && logsResult.data.length > 0) {
    const logs: DailyLog[] = logsResult.data.map((row: Record<string, unknown>) => ({
      date: row.date as string,
      wordsLearned: row.words_learned as number,
      wordsReviewed: row.words_reviewed as number,
      timeSpent: row.time_spent as number,
    }))
    useProgressStore.setState({ dailyLogs: logs })
  }

  if (gameResult.data && gameResult.data.length > 0) {
    const record = gameResult.data[0]
    useGameStore.setState({
      totalScore: record.total_score ?? 0,
      badges: record.badges ?? [],
      gameHistory: record.game_history ?? [],
    })
  }
}

export async function pushProgressToCloud(userId: string) {
  const { wordProgress } = useProgressStore.getState()

  const rows = Object.values(wordProgress).map((wp) => ({
    user_id: userId,
    word_id: wp.wordId,
    status: wp.status,
    correct_count: wp.correctCount,
    wrong_count: wp.wrongCount,
    last_seen: new Date(wp.lastSeen).toISOString(),
    next_review: new Date(wp.nextReview).toISOString(),
  }))

  if (rows.length === 0) return

  await getSupabase().from("word_progress").upsert(rows, {
    onConflict: "user_id,word_id",
  })
}

export async function pushDailyLogsToCloud(userId: string) {
  const { dailyLogs } = useProgressStore.getState()

  if (dailyLogs.length === 0) return

  const rows = dailyLogs.map((log) => ({
    user_id: userId,
    date: log.date,
    words_learned: log.wordsLearned,
    words_reviewed: log.wordsReviewed,
    time_spent: log.timeSpent,
  }))

  await getSupabase().from("daily_logs").upsert(rows, {
    onConflict: "user_id,date",
  })
}

export async function pushGameToCloud(userId: string) {
  const { totalScore, badges, gameHistory } = useGameStore.getState()

  await getSupabase().from("game_records").upsert({
    user_id: userId,
    total_score: totalScore,
    badges,
    game_history: gameHistory,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: "user_id",
  })
}

export async function pushAllToCloud(userId: string) {
  await Promise.all([
    pushProgressToCloud(userId),
    pushDailyLogsToCloud(userId),
    pushGameToCloud(userId),
  ])
}

export async function syncOnLogin(userId: string) {
  await pullFromCloud(userId)
}

let syncTimer: ReturnType<typeof setTimeout> | null = null

export function scheduleSync(userId: string) {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    pushAllToCloud(userId)
    syncTimer = null
  }, 3000)
}
