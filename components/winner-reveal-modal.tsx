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

          {/* Winner Cards - Podium Layout for Multiple Winners */}
          <div className={isSingleWinner ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 px-4'}>
            {/* 2nd Place (left) - show before 3rd place when there are 3+ winners */}
            {!isSingleWinner && displayedWinners.length >= 2 && displayedWinners[1] && (
              <div className="md:flex md:flex-col md:justify-end">
                {/* Rank 2 */}
                {displayedWinners.find(w => w.rank === 2) && (
                  <div
                    className="animate-slide-in"
                    style={{ animationDelay: '0.6s' }}
                  >
                    <div className="relative overflow-hidden rounded-2xl backdrop-blur transition-all duration-500 bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-2 border-gray-400/40 shadow-lg shadow-gray-400/20 p-5">
                      <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-gray-400/0 to-gray-300/20 pointer-events-none" />
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full font-bold text-xl bg-gradient-to-br from-gray-300/40 to-gray-400/30 border-2 border-gray-400/70 text-gray-200">
                            2
                          </div>
                          <span className="text-sm font-bold uppercase tracking-widest text-gray-300">🥈 Second</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-mono">PARTICIPANT_ID</p>
                          <p className="text-lg font-bold text-white break-words">{displayedWinners.find(w => w.rank === 2)?.row[0] || `Row #${displayedWinners.find(w => w.rank === 2)?.index ?? 0 + 1}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 1st Place (center/top) - Always prominent */}
            {displayedWinners[0] && (
              <div className={isSingleWinner ? '' : 'md:flex md:flex-col md:justify-start'}>
                <div
                  className="animate-slide-in"
                  style={{ animationDelay: '0s' }}
                >
                  <div className={`relative overflow-hidden rounded-2xl backdrop-blur transition-all duration-500 ${
                    isSingleWinner
                      ? 'bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-red-500/20 border-2 border-yellow-400/60 shadow-2xl shadow-yellow-500/40 p-8 max-w-md'
                      : 'bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/30 p-6 md:scale-110 md:z-20'
                  }`}>
                    <div className={`absolute inset-0 opacity-30 bg-gradient-to-tr from-yellow-500/0 to-yellow-400/30 pointer-events-none`} />
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full font-bold text-xl bg-gradient-to-br from-yellow-400/40 to-yellow-500/30 border-2 border-yellow-400/70 text-yellow-300">
                          1
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-yellow-300">🥇 First Place</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-mono">PARTICIPANT_ID</p>
                        <p className="text-lg font-bold text-white break-words">{displayedWinners[0].row[0] || `Row #${displayedWinners[0].index + 1}`}</p>
                      </div>
                      {displayedWinners[0].row.length > 1 && (
                        <div className="space-y-1 pt-2 border-t border-white/10">
                          {displayedWinners[0].row.slice(1, 3).map((cell, i) => (
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
              </div>
            )}

            {/* 3rd Place (right) - show after 2nd place when there are 3+ winners */}
            {!isSingleWinner && displayedWinners.length >= 3 && displayedWinners[2] && (
              <div className="md:flex md:flex-col md:justify-end">
                {/* Rank 3 */}
                {displayedWinners.find(w => w.rank === 3) && (
                  <div
                    className="animate-slide-in"
                    style={{ animationDelay: '1.2s' }}
                  >
                    <div className="relative overflow-hidden rounded-2xl backdrop-blur transition-all duration-500 bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-2 border-orange-600/40 shadow-lg shadow-orange-600/20 p-5">
                      <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-orange-600/0 to-orange-500/20 pointer-events-none" />
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full font-bold text-xl bg-gradient-to-br from-orange-500/40 to-orange-600/30 border-2 border-orange-500/70 text-orange-200">
                            3
                          </div>
                          <span className="text-sm font-bold uppercase tracking-widest text-orange-300">🥉 Third</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-mono">PARTICIPANT_ID</p>
                          <p className="text-lg font-bold text-white break-words">{displayedWinners.find(w => w.rank === 3)?.row[0] || `Row #${displayedWinners.find(w => w.rank === 3)?.index ?? 0 + 1}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Winners (4+) - List format */}
            {!isSingleWinner && displayedWinners.length > 3 && (
              displayedWinners.slice(3).map((winner, idx) => (
                <div
                  key={idx + 3}
                  className="animate-slide-in md:col-span-3"
                  style={{ animationDelay: `${(idx + 3) * 0.6}s` }}
                >
                  <div className="relative overflow-hidden rounded-xl backdrop-blur transition-all duration-500 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 shadow-lg shadow-purple-600/20 p-4">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full font-bold text-lg bg-purple-500/40 border border-purple-400/50 text-purple-200">
                          {winner.rank}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-mono">PLACE {winner.rank}</p>
                          <p className="text-sm font-bold text-white">{winner.row[0] || `Row #${winner.index + 1}`}</p>
                        </div>
                      </div>
                      {winner.row.length > 1 && (
                        <p className="text-xs text-gray-400 font-mono truncate max-w-xs">{winner.row[1]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
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
