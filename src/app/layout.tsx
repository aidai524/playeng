import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "英语小达人 - 四年级下册",
  description: "小学四年级下学期英语学习助手",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6366f1",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="max-w-lg mx-auto min-h-dvh flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
