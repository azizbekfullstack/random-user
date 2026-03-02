'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  playScanningLoop,
  playTickingLoop,
  playReveal,
  playVictory,
  setSoundEnabled,
  setSoundVolume,
  isSoundEnabled,
  resumeAudio,
} from '@/lib/sound-manager'

interface CinematicAnimationProps {
  visible: boolean
  winner: { index: number; row: string[] } | null
  onComplete?: () => void
}

type AnimationPhase = 'scanning' | 'counting' | 'cycling' | 'reveal' | 'complete'

export function CinematicAnimation({
  visible,
  winner,
  onComplete,
}: CinematicAnimationProps) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<AnimationPhase>('scanning')
  const [cycleIndex, setCycleIndex] = useState(0)
  const [showSoundControl, setShowSoundControl] = useState(false)
  const [soundMuted, setSoundMuted] = useState(false)
  const soundStopsRef = useRef<Array<() => void>>([])

  // Resume audio context on first user interaction
  useEffect(() => {
    if (visible) {
      resumeAudio()
    }
  }, [visible])

  // Handle scanning phase
  useEffect(() => {
    if (phase === 'scanning') {
      const stopScanning = playScanningLoop()
      soundStopsRef.current.push(stopScanning)
      
      const timer = setTimeout(() => {
        setPhase('counting')
      }, 12000) // 12 seconds scanning
      
      return () => {
        clearTimeout(timer)
        stopScanning()
      }
    }
  }, [phase])

  // Handle counting phase
  useEffect(() => {
    if (phase === 'counting') {
      const stopTicking = playTickingLoop()
      soundStopsRef.current.push(stopTicking)
      
      const timer = setTimeout(() => {
        setPhase('cycling')
      }, 20000) // 20 seconds counting
      
      return () => {
        clearTimeout(timer)
        stopTicking()
      }
    }
  }, [phase])

  // Handle cycling phase
  useEffect(() => {
    if (phase === 'cycling') {
      const interval = setInterval(() => {
        setCycleIndex((prev) => (prev + 1) % 12)
      }, 300)
      
      const timer = setTimeout(() => {
        setPhase('reveal')
      }, 20000) // 20 seconds cycling
      
      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [phase])

  // Handle reveal phase
  useEffect(() => {
    if (phase === 'reveal') {
      // Stop all looping sounds
      soundStopsRef.current.forEach(stop => stop())
      soundStopsRef.current = []
      
      playReveal()
      
      const timer = setTimeout(() => {
        setPhase('complete')
        playVictory()
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Handle completion
  useEffect(() => {
    if (phase === 'complete' && onComplete) {
      const timer = setTimeout(onComplete, 4000)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center space-y-8">
      {/* Sound Control Button */}
      <button
        onClick={() => {
          setShowSoundControl(!showSoundControl)
          resumeAudio()
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xs"
      >
        {soundMuted ? '🔇 Unmute' : '🔊 Mute'}
      </button>

      {/* Sound Control Slider */}
      {showSoundControl && (
        <div className="absolute top-12 right-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-32">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            onChange={(e) => {
              const vol = Number(e.target.value) / 100
              setSoundVolume(vol)
            }}
            className="w-full"
          />
          <button
            onClick={() => {
              setSoundMuted(!soundMuted)
              setSoundEnabled(!soundMuted)
            }}
            className="w-full mt-2 px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
          >
            {soundMuted ? 'Enable' : 'Disable'} Sound
          </button>
        </div>
      )}

      {/* Phase Display */}
      <div className="text-center space-y-4">
        {phase === 'scanning' && (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-cyan-400 animate-pulse">
              {t('animation.scanning')}
            </div>
            <div className="w-64 h-1 bg-cyan-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {phase === 'counting' && (
          <div className="space-y-4">
            <div className="text-lg md:text-2xl font-bold text-blue-400">{t('animation.counting')}</div>
            <div className="text-4xl md:text-6xl font-mono font-bold text-white tabular-nums">
              {Math.floor((Date.now() / 100) % 100)}
            </div>
          </div>
        )}

        {phase === 'cycling' && (
          <div className="space-y-6">
            <div className="text-lg md:text-xl font-bold text-yellow-400">{t('animation.analyzing')}</div>
            <div className="grid grid-cols-4 gap-1 md:gap-2 w-64 md:w-80">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 md:h-12 rounded transition-all ${
                    i === cycleIndex
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 scale-110'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="space-y-4 animate-bounce">
            <div className="text-2xl md:text-4xl font-bold text-green-400">{t('animation.winner')}</div>
            <div className="text-lg md:text-2xl font-bold text-white">
              {winner ? `${t('dashboard.winner.row')} #${winner.index + 1}` : '...'}
            </div>
          </div>
        )}

        {phase === 'complete' && winner && (
          <div className="space-y-6 max-w-sm md:max-w-md px-4">
            <div className="text-3xl md:text-5xl font-bold text-yellow-400 drop-shadow-lg">
              🎉 {t('animation.victoryMessage')}
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 space-y-2">
              <div className="text-xs md:text-sm text-gray-400">{t('animation.selectedWinner')}</div>
              <div className="text-base md:text-xl font-bold text-yellow-300 line-clamp-2">
                {winner.row.slice(0, 3).join(' • ')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-8 w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden left-1/2 -translate-x-1/2">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-yellow-400 to-green-400 rounded-full transition-all duration-1000"
          style={{
            width:
              phase === 'scanning'
                ? '25%'
                : phase === 'counting'
                  ? '50%'
                  : phase === 'cycling'
                    ? '75%'
                    : phase === 'reveal'
                      ? '90%'
                      : '100%',
          }}
        />
      </div>
    </div>
  )
}
