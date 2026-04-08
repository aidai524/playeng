"use client"

import { useState, useRef, useCallback } from "react"
import { speak } from "@/lib/speech"
import { startListening, isRecognitionSupported, getError_message } from "@/lib/speechRecognition"

interface SpeakingPracticeProps {
  word: string
  onComplete?: (isCorrect: boolean) => void
}

type SpeakingState = "idle" | "playing" | "listening" | "result"

export default function SpeakingPractice({ word, onComplete }: SpeakingPracticeProps) {
  const [state, setState] = useState<SpeakingState>("idle")
  const [isMatch, setIsMatch] = useState<boolean | null>(null)
  const [transcript, setTranscript] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const recognitionRef = useRef<ReturnType<typeof startListening> | null>(null)
  const supported = isRecognitionSupported()

  const handlePlayAndListen = useCallback(async () => {
    setErrorMsg("")
    setTranscript("")
    setIsMatch(null)

    setState("playing")
    try {
      await speak(word, 0.7)
    } catch {}

    setState("listening")
    recognitionRef.current = startListening(
      word,
      (text, matched) => {
        setTranscript(text)
        setIsMatch(matched)
        setState("result")
        onComplete?.(matched)
      },
      (error) => {
        setErrorMsg(getError_message(error))
        setState("idle")
      },
    )
  }, [word, onComplete])

  const handleRetry = () => {
    recognitionRef.current?.abort()
    setState("idle")
    setIsMatch(null)
    setTranscript("")
    setErrorMsg("")
  }

  if (!supported) return null

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎤</span>
        <h3 className="font-bold text-sm text-purple-700">口语跟读</h3>
      </div>

      {state === "idle" && (
        <button
          onClick={handlePlayAndListen}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all active:scale-[0.98]"
        >
          🎤 开始跟读
        </button>
      )}

      {state === "playing" && (
        <div className="text-center py-3">
          <p className="text-purple-600 font-bold animate-pulse">🔊 听发音中...</p>
          <p className="text-text-light text-sm mt-1">仔细听，然后跟着说</p>
        </div>
      )}

      {state === "listening" && (
        <div className="text-center py-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <p className="text-red-600 font-bold">正在听你说...</p>
          </div>
          <p className="text-text-light text-sm mt-2">大声说出「{word}」</p>
        </div>
      )}

      {state === "result" && (
        <div className="space-y-2">
          <div className={`text-center p-3 rounded-xl ${
            isMatch
              ? "bg-green-50 border border-green-200"
              : "bg-orange-50 border border-orange-200"
          }`}>
            <p className="text-2xl mb-1">{isMatch ? "🎉" : "💪"}</p>
            <p className={`font-bold ${isMatch ? "text-green-700" : "text-orange-700"}`}>
              {isMatch ? "发音很棒！" : "继续加油！"}
            </p>
            <p className="text-text-light text-sm mt-1">
              你说的是：<span className="font-medium">{transcript}</span>
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="w-full py-2 bg-purple-100 text-purple-700 rounded-xl font-medium text-sm hover:bg-purple-200 transition-colors"
          >
            🔄 再试一次
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-danger text-sm text-center">{errorMsg}</p>
      )}
    </div>
  )
}
