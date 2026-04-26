import { useEffect, useState } from "react"

interface GreetingConfig {
  phrase: string
  emoji: string
  sub: string
}

function getGreeting(): GreetingConfig {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 8) return { phrase: "early light", emoji: "🌅", sub: "the quiet before the world wakes" }
  if (hour >= 8 && hour < 12) return { phrase: "morning focus", emoji: "☀️", sub: "sharp mind, clear intentions" }
  if (hour >= 12 && hour < 14) return { phrase: "midday pause", emoji: "🌤", sub: "step back, then step forward" }
  if (hour >= 14 && hour < 17) return { phrase: "afternoon flow", emoji: "🌿", sub: "in the groove now" }
  if (hour >= 17 && hour < 20) return { phrase: "golden hour", emoji: "🌇", sub: "the day settling into itself" }
  if (hour >= 20 && hour < 23) return { phrase: "evening calm", emoji: "🌙", sub: "softer light, slower thoughts" }
  return { phrase: "midnight quiet", emoji: "🌌", sub: "still, silent, yours" }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function Home() {
  const [now, setNow] = useState(new Date())
  const [greeting, setGreeting] = useState<GreetingConfig>(getGreeting())

  useEffect(() => {
    const tick = setInterval(() => {
      const next = new Date()
      setNow(next)
      setGreeting(getGreeting())
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <div className="
      min-h-[calc(100vh-4rem)]
      flex flex-col items-center justify-center
      text-center select-none
    ">
      {/* Emoji */}
      <div className="text-5xl mb-6">
        {greeting.emoji}
      </div>

      {/* Greeting phrase */}
      <h1 className="
        text-4xl font-light tracking-tight
        text-gray-900 dark:text-gray-100
        mb-2
      ">
        {greeting.phrase}
      </h1>

      {/* Sub-phrase */}
      <p className="
        text-sm font-normal tracking-widest uppercase
        text-teal-600 dark:text-teal-400
        mb-10
      ">
        {greeting.sub}
      </p>

      {/* Divider */}
      <div className="w-12 h-px bg-gray-200 dark:bg-navy-600 mb-10" />

      {/* Live time */}
      <div className="
        text-5xl font-light tabular-nums
        text-gray-800 dark:text-gray-200
        mb-3
      ">
        {formatTime(now)}
      </div>

      {/* Date */}
      <div className="
        text-sm text-gray-400 dark:text-gray-500
        font-normal tracking-wide
      ">
        {formatDate(now)}
      </div>
    </div>
  )
}