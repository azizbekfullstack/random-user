'use client'

import { useEffect, useRef } from 'react'

interface MatrixRainProps {
  visible: boolean
  onComplete?: () => void
}

export function MatrixRain({ visible, onComplete }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!visible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0)

    let frameCount = 0
    const duration = 8000 // 8 seconds for matrix rain
    const startTime = Date.now()

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      frameCount++
      const elapsed = Date.now() - startTime
      if (elapsed < duration) {
        requestAnimationFrame(draw)
      } else if (onComplete) {
        onComplete()
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    draw()

    return () => window.removeEventListener('resize', handleResize)
  }, [visible, onComplete])

  if (!visible) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 bg-black z-40 pointer-events-none"
      style={{ backgroundColor: 'rgb(0, 0, 0)' }}
    />
  )
}
