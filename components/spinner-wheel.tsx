'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { Play, Square } from 'lucide-react'

interface SpinnerWheelProps {
  participants: string[]
  winnerCount: number
  onComplete: (winnerIndices: number[]) => void
}

export function SpinnerWheel({ participants, winnerCount, onComplete }: SpinnerWheelProps) {
  const { t } = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedWinners, setSelectedWinners] = useState<number[]>([])
  const [spinMessage, setSpinMessage] = useState('')

  const segmentAngle = 360 / participants.length
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
  ]

  const handleSpin = () => {
    if (selectedWinners.length >= winnerCount) return

    setIsSpinning(true)
    const randomRotation = Math.random() * 360
    const newRotation = rotation + 360 * 3 + randomRotation
    
    setRotation(newRotation)

    setTimeout(() => {
      const normalizedRotation = ((newRotation % 360) + 360) % 360
      const selectedIndex = Math.floor(((360 - normalizedRotation) / segmentAngle + participants.length) % participants.length)

      if (!selectedWinners.includes(selectedIndex)) {
        const newWinners = [...selectedWinners, selectedIndex]
        setSelectedWinners(newWinners)
        setSpinMessage(`${participants[selectedIndex]} ${t('liveDraw.title')}!`)

        if (newWinners.length === winnerCount) {
          setTimeout(() => {
            onComplete(newWinners)
          }, 1000)
        }
      }

      setIsSpinning(false)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-white">{t('liveDraw.title')}</h2>
        <p className="text-gray-300 text-lg">
          {selectedWinners.length}/{winnerCount} {t('liveDraw.selectedWinners')}
        </p>
      </div>

      {/* Spinner Container */}
      <div className="flex justify-center py-8">
        <div className="relative w-80 h-80">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400"></div>

          {/* Wheel */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            }}
          >
            {participants.map((participant, index) => {
              const startAngle = (index * segmentAngle * Math.PI) / 180
              const endAngle = (((index + 1) * segmentAngle) * Math.PI) / 180
              const radius = 100
              const largeArc = segmentAngle > 180 ? 1 : 0

              const x1 = 100 + radius * Math.cos(startAngle)
              const y1 = 100 + radius * Math.sin(startAngle)
              const x2 = 100 + radius * Math.cos(endAngle)
              const y2 = 100 + radius * Math.sin(endAngle)

              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                'Z',
              ].join(' ')

              const midAngle = startAngle + (endAngle - startAngle) / 2
              const textRadius = 65
              const textX = 100 + textRadius * Math.cos(midAngle)
              const textY = 100 + textRadius * Math.sin(midAngle)

              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                    opacity={selectedWinners.includes(index) ? 0.5 : 1}
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    style={{
                      pointerEvents: 'none',
                      transform: `rotate(${((midAngle * 180) / Math.PI + 90) % 360}deg)`,
                      transformOrigin: `${textX}px ${textY}px`,
                    }}
                  >
                    {participant.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Message */}
      {spinMessage && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg p-4 text-center">
          <p className="text-yellow-300 font-bold text-lg">{spinMessage}</p>
        </div>
      )}

      {/* Selected Winners List */}
      {selectedWinners.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-400 font-mono">{t('liveDraw.selectedWinners')}</p>
          <div className="flex flex-wrap gap-2">
            {selectedWinners.map((idx, rank) => (
              <div key={idx} className="bg-purple-500/30 border border-purple-400/50 rounded-lg px-3 py-1">
                <p className="text-sm font-bold text-purple-300">
                  {rank + 1}. {participants[idx]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSpin}
          disabled={isSpinning || selectedWinners.length >= winnerCount}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-6 px-12 text-xl shadow-lg shadow-cyan-600/50 hover:shadow-cyan-600/70 transition-all disabled:opacity-50"
        >
          {isSpinning ? (
            <>
              <Square className="mr-2 h-5 w-5 animate-spin" />
              {t('liveDraw.spinningMessage')}
            </>
          ) : selectedWinners.length >= winnerCount ? (
            <>
              ✓ {t('liveDraw.doneButton')}
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              {t('liveDraw.spinButton')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
