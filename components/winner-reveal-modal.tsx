'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

interface WinnerData {
  index: number
  row: string[]
  rank: number
}

interface WinnerRevealModalProps {
  visible: boolean
  winners: WinnerData[]
  onClose: () => void
  onExportExcel?: () => void
  onExportJSON?: () => void
}

export function WinnerRevealModal({
  visible,
  winners,
  onClose,
  onExportExcel,
  onExportJSON,
}: WinnerRevealModalProps) {
  const { t } = useTranslation()
  const [displayedWinners, setDisplayedWinners] = useState<WinnerData[]>([])

  // Animate winner reveals one by one
  useEffect(() => {
    if (!visible) {
      setDisplayedWinners([])
      return
    }

    setDisplayedWinners([])
    winners.forEach((winner, idx) => {
      setTimeout(() => {
        setDisplayedWinners((prev) => [...prev, winner])
      }, idx * 600)
    })
  }, [visible, winners])

  if (!visible) return null

  const isSingleWinner = winners.length === 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-2xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Winner Container */}
        <div className={`space-y-6 ${isSingleWinner ? 'max-w-xl mx-auto' : ''}`}>
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              🎉 WINNER SELECTED
            </div>
            <p className="text-gray-400 text-sm">Cryptographically verified selection</p>
          </div>

          {/* Winner Cards */}
          <div className={isSingleWinner ? 'flex justify-center' : 'space-y-4'}>
            {displayedWinners.map((winner, idx) => (
              <div
                key={idx}
                className="animate-slide-in"
                style={{
                  animationDelay: `${idx * 0.2}s`,
                }}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl backdrop-blur transition-all duration-500 ${
                    isSingleWinner
                      ? 'bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-red-500/20 border-2 border-yellow-400/60 shadow-2xl shadow-yellow-500/40 p-8 max-w-md'
                      : `bg-gradient-to-br border-2 ${
                          winner.rank === 1
                            ? 'from-yellow-500/30 to-orange-500/20 border-yellow-400/50 shadow-lg shadow-yellow-500/30 p-6'
                            : winner.rank === 2
                              ? 'from-gray-400/20 to-gray-500/20 border-gray-400/40 shadow-lg shadow-gray-400/20 p-5'
                              : 'from-orange-600/20 to-orange-700/20 border-orange-600/40 shadow-lg shadow-orange-600/20 p-5'
                        }`
                  }`}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 opacity-30 ${
                      winner.rank === 1
                        ? 'bg-gradient-to-tr from-yellow-500/0 to-yellow-400/30'
                        : winner.rank === 2
                          ? 'bg-gradient-to-tr from-gray-400/0 to-gray-300/20'
                          : 'bg-gradient-to-tr from-orange-600/0 to-orange-500/20'
                    } pointer-events-none`}
                  />

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Rank Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex items-center justify-center h-16 w-16 rounded-full font-bold text-xl ${
                          winner.rank === 1
                            ? 'bg-gradient-to-br from-yellow-400/40 to-yellow-500/30 border-2 border-yellow-400/70 text-yellow-300'
                            : winner.rank === 2
                              ? 'bg-gradient-to-br from-gray-300/40 to-gray-400/30 border-2 border-gray-400/70 text-gray-200'
                              : 'bg-gradient-to-br from-orange-500/40 to-orange-600/30 border-2 border-orange-500/70 text-orange-200'
                        }`}
                      >
                        {winner.rank}
                      </div>
                      <span
                        className={`text-sm font-bold uppercase tracking-widest ${
                          winner.rank === 1
                            ? 'text-yellow-300'
                            : winner.rank === 2
                              ? 'text-gray-300'
                              : 'text-orange-300'
                        }`}
                      >
                        {winner.rank === 1 ? '🥇 First Place' : winner.rank === 2 ? '🥈 Second Place' : '🥉 Third Place'}
                      </span>
                    </div>

                    {/* Winner Info */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 font-mono">PARTICIPANT_ID</p>
                      <p className="text-lg font-bold text-white break-words">{winner.row[0] || `Row #${winner.index + 1}`}</p>
                    </div>

                    {/* Additional Data */}
                    {winner.row.length > 1 && (
                      <div className="space-y-1 pt-2 border-t border-white/10">
                        {winner.row.slice(1, 4).map((cell, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Field {i + 2}</span>
                            <span className="text-sm text-gray-300 font-mono truncate">{cell}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          {displayedWinners.length === winners.length && (
            <div className="flex gap-3 justify-center pt-4">
              {onExportExcel && (
                <Button
                  onClick={onExportExcel}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-600/50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
              )}
              {onExportJSON && (
                <Button
                  onClick={onExportJSON}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-600/50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              )}
            </div>
          )}

          {/* Close Button */}
          {displayedWinners.length === winners.length && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
