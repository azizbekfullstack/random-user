'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { LiveDrawEngine, type DrawState } from '@/lib/live-draw-engine'
import { Button } from '@/components/ui/button'
import { Zap, Play, Square } from 'lucide-react'

interface LiveDrawStageProps {
  participantCount: number
  winnerCount: number
  onComplete: (winnerIndices: number[]) => void
  disabled?: boolean
}

export function LiveDrawStage({
  participantCount,
  winnerCount,
  onComplete,
  disabled = false,
}: LiveDrawStageProps) {
  const { t } = useTranslation()
  const [engine, setEngine] = useState<LiveDrawEngine | null>(null)
  const [drawState, setDrawState] = useState<DrawState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize engine
  useEffect(() => {
    const newEngine = new LiveDrawEngine({
      totalParticipants: participantCount,
      winnerCount: winnerCount,
      durationSeconds: 60,
      updateFrequency: 50, // Update every 50ms for smooth animation
    })
    setEngine(newEngine)
  }, [participantCount, winnerCount])

  // Handle animation complete
  useEffect(() => {
    if (drawState && drawState.animationProgress >= 100 && drawState.finalWinners.length > 0) {
      setIsAnimating(false)
      onComplete(drawState.finalWinners)
    }
  }, [drawState, onComplete])

  const handleStartDraw = () => {
    if (!engine || isAnimating) return

    setIsAnimating(true)
    engine.start((state) => {
      setDrawState(state)
    })
  }

  const handleStopDraw = () => {
    if (!engine) return
    engine.stop()
    setIsAnimating(false)
  }

  if (!drawState) {
    drawState = engine?.getState() || null
  }

  const progress = drawState?.animationProgress || 0
  const currentCandidate = drawState?.currentCandidate || 0
  const elapsedSeconds = drawState?.elapsedSeconds || 0

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Zap className="h-8 w-8 text-cyan-400 mt-1 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">Live Draw Stage</h2>
            <p className="text-gray-400 text-sm">
              60-second cryptographic winner selection - Winners determined during broadcast
            </p>
          </div>
        </div>
      </div>

      {/* Draw Configuration Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-mono mb-1">TOTAL_PARTICIPANTS</p>
          <p className="text-2xl font-bold text-cyan-400">{participantCount.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-mono mb-1">WINNERS_TO_SELECT</p>
          <p className="text-2xl font-bold text-purple-400">{winnerCount}</p>
        </div>
      </div>

      {/* Animation Container */}
      <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
        {/* Timer */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            {/* Progress Circle */}
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeDasharray={`${(progress / 100) * 339.29} 339.29`}
                className="transition-all duration-100"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer Text */}
            <div className="relative flex flex-col items-center">
              <div className="text-4xl font-bold text-white font-mono">
                {elapsedSeconds}
              </div>
              <div className="text-xs text-gray-500 font-mono">/ 60 sec</div>
            </div>
          </div>
        </div>

        {/* Current Candidate Display */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 font-mono">SCANNING_PARTICIPANTS</p>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            {currentCandidate.toLocaleString()}
          </div>
          <p className="text-gray-400 text-sm">
            Row {(currentCandidate % participantCount).toLocaleString()} of {participantCount.toLocaleString()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 font-mono">RANDOMIZATION_PROGRESS</p>
            <p className="text-sm font-bold text-cyan-400">{Math.round(progress)}%</p>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Selected Winners Preview (if animation complete) */}
        {drawState?.finalWinners.length > 0 && progress >= 100 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-xs text-gray-500 font-mono">SELECTED_WINNERS</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {drawState.finalWinners.map((winnerIndex, rank) => (
                <div
                  key={rank}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 text-center animate-pulse"
                >
                  <div className="text-yellow-400 font-bold text-lg">{rank + 1}</div>
                  <div className="text-gray-400 text-xs font-mono">Row {winnerIndex}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleStartDraw}
          disabled={disabled || isAnimating}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 text-lg shadow-lg shadow-cyan-600/50 hover:shadow-cyan-600/70 transition-all"
        >
          <Play className="mr-2 h-5 w-5" />
          Start 60-Second Draw
        </Button>

        {isAnimating && (
          <Button
            onClick={handleStopDraw}
            className="px-6 bg-red-600/50 hover:bg-red-600 border border-red-400/50 text-white font-bold shadow-lg shadow-red-600/30"
          >
            <Square className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
