'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { Download, Share2, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Winner {
  rank: number
  index: number
  name: string
  data: string[]
}

interface WinnerResultsPageProps {
  winners: Winner[]
  onExportExcel: () => void
  onExportJSON: () => void
  onNewDraw: () => void
}

export function WinnerResultsPage({
  winners,
  onExportExcel,
  onExportJSON,
  onNewDraw,
}: WinnerResultsPageProps) {
  const { t } = useTranslation()
  const [exported, setExported] = useState(false)

  // Trigger confetti on mount
  useEffect(() => {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 100)
  }, [])

  const handleExport = (type: 'excel' | 'json') => {
    if (type === 'excel') {
      onExportExcel()
    } else {
      onExportJSON()
    }
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 space-y-8 pb-12">
      {/* Celebration Header */}
      <div className="text-center space-y-4 pt-12">
        <div className="text-6xl animate-bounce">🎊</div>
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
          {t('animation.victoryMessage')}
        </h1>
        <p className="text-gray-300 text-lg">{winners.length} {t('animation.selectedWinner')}{winners.length > 1 ? 's' : ''}</p>
      </div>

      {/* Podium Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end justify-center max-w-2xl mx-auto">
          {/* 2nd Place */}
          {winners[1] && (
            <div className="order-1 md:order-1 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-2xl p-6 relative overflow-hidden border-2 border-gray-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 pointer-events-none" />
                <div className="relative z-10 text-center space-y-3">
                  <div className="text-4xl">🥈</div>
                  <div className="text-5xl font-black text-gray-700">2</div>
                  <div className="text-lg font-bold text-gray-800">{winners[1]?.name || 'N/A'}</div>
                  <div className="h-12"></div>
                </div>
              </div>
              <div className="bg-gray-500/50 h-16"></div>
            </div>
          )}

          {/* 1st Place (Center & Taller) */}
          {winners[0] && (
            <div className="order-2 md:order-2 animate-slide-in">
              <div className="bg-gradient-to-b from-yellow-400 via-yellow-500 to-orange-500 rounded-t-3xl p-8 relative overflow-hidden border-4 border-yellow-300 shadow-2xl shadow-yellow-500/50 transform md:scale-110">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-white/5 pointer-events-none" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="text-6xl">🥇</div>
                  <div className="text-7xl font-black text-white drop-shadow-lg">1</div>
                  <div className="text-2xl font-bold text-white">{winners[0]?.name || 'N/A'}</div>
                  <div className="text-sm text-yellow-900 font-semibold">GRAND PRIZE</div>
                  <div className="h-12"></div>
                </div>
              </div>
              <div className="bg-yellow-500/50 h-24 shadow-lg"></div>
            </div>
          )}

          {/* 3rd Place */}
          {winners[2] && (
            <div className="order-3 md:order-3 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-b from-orange-600 to-orange-700 rounded-t-2xl p-6 relative overflow-hidden border-2 border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/10 pointer-events-none" />
                <div className="relative z-10 text-center space-y-3">
                  <div className="text-4xl">🥉</div>
                  <div className="text-5xl font-black text-orange-900">3</div>
                  <div className="text-lg font-bold text-orange-100">{winners[2]?.name || 'N/A'}</div>
                  <div className="h-12"></div>
                </div>
              </div>
              <div className="bg-orange-700/50 h-10"></div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard (if more than 3 winners) */}
      {winners.length > 3 && (
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-400/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">{t('dashboard.table.title')}</h3>
            <div className="space-y-2">
              {winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl font-bold text-center w-8">
                    {['🥇', '🥈', '🥉', ...Array(winners.length - 3).fill('🎖️')][idx]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{winner.name}</p>
                    {winner.data[1] && <p className="text-xs text-gray-400">{winner.data[1]}</p>}
                  </div>
                  <div className="text-lg font-bold text-gray-400">#{winner.rank}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-400/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">{t('dashboard.export.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => handleExport('excel')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="h-5 w-5" />
              {t('dashboard.export.excel')}
            </Button>
            <Button
              onClick={() => handleExport('json')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="h-5 w-5" />
              {t('dashboard.export.json')}
            </Button>
          </div>
          {exported && (
            <p className="text-green-300 text-sm font-semibold text-center animate-pulse">
              ✓ {t('animation.winner')}
            </p>
          )}
        </div>
      </div>

      {/* New Draw Button */}
      <div className="container mx-auto px-4 max-w-2xl flex justify-center">
        <Button
          onClick={onNewDraw}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 text-lg rounded-lg flex items-center gap-2 shadow-lg"
        >
          <RotateCcw className="h-5 w-5" />
          {t('cta.startBtn')}
        </Button>
      </div>
    </div>
  )
}
