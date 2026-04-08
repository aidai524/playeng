type RecognitionCallback = (transcript: string) => void
type ErrorCallback = (error: string) => void

interface SpeechRecognitionInstance {
  start: () => void
  stop: () => void
  abort: () => void
}

export function isRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window
}

export function startListening(
  expectedWord: string,
  onResult: (transcript: string, isMatch: boolean) => void,
  onError: (error: string) => void,
): SpeechRecognitionInstance | null {
  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition

  if (!Ctor) {
    onError("not-supported")
    return null
  }

  const recognition = new Ctor()
  recognition.lang = "en-US"
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 3

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const results = event.results[0]
    const alternatives: string[] = []
    for (let i = 0; i < results.length; i++) {
      alternatives.push(results[i].transcript.trim().toLowerCase())
    }

    const target = expectedWord.trim().toLowerCase()
    const isMatch = alternatives.some(alt =>
      alt === target || alt.includes(target) || target.includes(alt)
    )

    onResult(alternatives[0], isMatch)
  }

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error)
  }

  recognition.start()

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
  }
}

export function getError_message(errorCode: string): string {
  const messages: Record<string, string> = {
    "not-supported": "你的浏览器不支持语音识别，请使用 Chrome 浏览器",
    "not-allowed": "请允许使用麦克风",
    "no-speech": "没有检测到声音，请再试一次",
    "audio-capture": "找不到麦克风，请检查设备",
    "network": "网络连接出现问题",
    "aborted": "识别被中断",
  }
  return messages[errorCode] ?? "识别失败，请重试"
}
