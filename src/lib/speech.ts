const ENGLISH_VOICE_NAME = "Microsoft Zira" 
const FALLBACK_LANG = "en-US"

let speechSupported: boolean | null = null

export function isSpeechSupported(): boolean {
  if (speechSupported !== null) return speechSupported
  speechSupported = typeof window !== "undefined" && "speechSynthesis" in window
  return speechSupported
}

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  return voices.find(v => v.name.includes(ENGLISH_VOICE_NAME))
    || voices.find(v => v.lang.startsWith("en") && v.name.includes("Female"))
    || voices.find(v => v.lang.startsWith("en"))
    || null
}

export function speak(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error("Speech not supported"))
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = FALLBACK_LANG
    utterance.rate = rate
    utterance.pitch = 1.1

    const voice = getEnglishVoice()
    if (voice) utterance.voice = voice

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(e)

    window.speechSynthesis.speak(utterance)
  })
}

export function speakSlowly(text: string): Promise<void> {
  return speak(text, 0.55)
}

export function initVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) { resolve(); return }
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) { resolve(); return }
    window.speechSynthesis.onvoiceschanged = () => resolve()
    setTimeout(resolve, 2000)
  })
}
