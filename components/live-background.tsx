'use client'

import { useEffect, useRef } from 'react'

interface LiveBackgroundProps {
  visible: boolean
  participantCount: number
}

export function LiveBackground({ visible, participantCount }: LiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    if (!visible || !containerRef.current) return

    const handleScroll = () => {
      scrollRef.current += 0.5
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${scrollRef.current}px)`
      }
    }

    const interval = setInterval(handleScroll, 50)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Blurred Background Table */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

      {/* Scrolling Participant Grid */}
      <div ref={containerRef} className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-6 gap-2 p-4">
          {Array.from({ length: participantCount > 100 ? 100 : participantCount }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-lg animate-pulse"
              style={{
                animationDelay: `${(i % 10) * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
    </div>
  )
}
