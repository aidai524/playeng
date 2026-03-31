"use client"

import { speak, speakSlowly } from "@/lib/speech"
import { useState } from "react"

interface WordCardProps {
  word: {
    id: string
    en: string
    cn: string
    example?: string
    emoji: string
  }
  onMastered?: (wordId: string, correct: boolean) => void
  showSpelling?: boolean
}

export default function WordCard({ word, onMastered, showSpelling = true }: WordCardProps) {
  const [showCn, setShowCn] = useState(false)
  const [showSpellingInput, setShowSpellingInput] = useState(false)
  const [spellingInput, setSpellingInput] = useState("")
  const [spellingResult, setSpellingResult] = useState<"correct" | "wrong" | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = async (slow: boolean = false) => {
    setIsSpeaking(true)
    try {
      if (slow) {
        await speakSlowly(word.en)
      } else {
        await speak(word.en)
      }
    } catch {}
    setIsSpeaking(false)
  }

  const checkSpelling = () => {
    const isCorrect = spellingInput.trim().toLowerCase() === word.en.toLowerCase()
    setSpellingResult(isCorrect ? "correct" : "wrong")
    onMastered?.(word.id, isCorrect)
    if (isCorrect) {
      setTimeout(() => {
        setShowSpellingInput(false)
        setSpellingInput("")
        setSpellingResult(null)
      }, 1500)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="text-center">
        <span className="text-6xl block mb-3">{word.emoji}</span>
        <h2 className="text-3xl font-bold text-primary">
          {showSpellingInput && spellingResult !== "correct" ? "❓" : word.en}
        </h2>
        <button
          onClick={() => setShowCn(!showCn)}
          className="mt-2 text-text-light hover:text-text transition-colors"
        >
          {showCn ? (
            <span className="text-lg">{word.cn}</span>
          ) : (
            <span className="text-sm underline underline-offset-4">点击显示中文</span>
          )}
        </button>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleSpeak(false)}
          disabled={isSpeaking}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          🔊 发音
        </button>
        <button
          onClick={() => handleSpeak(true)}
          disabled={isSpeaking}
          className="px-4 py-2 bg-primary-light text-white rounded-xl text-sm font-medium hover:bg-primary transition-colors disabled:opacity-50"
        >
          🐢 慢速
        </button>
        {showSpelling && !showSpellingInput && (
          <button
            onClick={() => setShowSpellingInput(true)}
            className="px-4 py-2 bg-success text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
          >
            ✏️ 拼写
          </button>
        )}
      </div>

      {word.example && (
        <div className="text-center text-sm text-text-light bg-gray-50 rounded-xl p-3">
          📝 {word.example}
        </div>
      )}

      {showSpellingInput && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={spellingInput}
              onChange={(e) => {
                setSpellingInput(e.target.value)
                setSpellingResult(null)
              }}
              onKeyDown={(e) => e.key === "Enter" && checkSpelling()}
              placeholder="输入单词拼写..."
              autoFocus
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-center text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={checkSpelling}
              className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              ✓
            </button>
          </div>
          {spellingResult === "correct" && (
            <p className="text-center text-success font-medium">🎉 正确！太棒了！</p>
          )}
          {spellingResult === "wrong" && (
            <div className="text-center space-y-1">
              <p className="text-danger font-medium">❌ 再试一次</p>
              <p className="text-text-light text-sm">提示：{word.en[0]}_{"".padStart(word.en.length - 2, "_")}{word.en[word.en.length - 1]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
