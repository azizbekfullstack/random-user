'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Lock, Settings, Zap } from 'lucide-react'

interface PreparationPhaseProps {
  participantCount: number
  dedupCount: number
  onLockSession: (winnerCount: number) => void
  disabled?: boolean
}

export function PreparationPhase({
  participantCount,
  dedupCount,
  onLockSession,
  disabled = false,
}: PreparationPhaseProps) {
  const { t } = useTranslation()
  const [selectedWinners, setSelectedWinners] = useState(1)
  const [customCount, setCustomCount] = useState(1)
  const [useCustom, setUseCustom] = useState(false)

  const eligibleCount = participantCount - dedupCount

  const presetOptions = [1, 2, 3, 5]
  const finalWinnerCount = useCustom ? customCount : selectedWinners

  const handleLock = () => {
    if (eligibleCount > 0 && finalWinnerCount > 0 && finalWinnerCount <= eligibleCount) {
      onLockSession(finalWinnerCount)
    }
  }

  return (
    <div className="space-y-6">
      {/* Preparation Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Settings className="h-8 w-8 text-purple-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{t("dashboard.preparation.title")}</h2>
            <p className="text-gray-400 text-sm">{t("dashboard.preparation.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-500 font-mono">TOTAL_PARTICIPANTS</p>
          <p className="text-3xl font-bold text-cyan-400">{participantCount.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-500 font-mono">DUPLICATES_REMOVED</p>
          <p className="text-3xl font-bold text-orange-400">{dedupCount.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-500 font-mono">ELIGIBLE_COUNT</p>
          <p className="text-3xl font-bold text-green-400">{eligibleCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Winner Count Selector */}
      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <p className="text-sm text-gray-400 font-mono">&gt; SELECT_WINNER_COUNT</p>

          {/* Preset Options */}
          <div className="grid grid-cols-4 gap-3">
            {presetOptions.map((count) => (
              <button
                key={count}
                onClick={() => {
                  setSelectedWinners(count)
                  setUseCustom(false)
                }}
                disabled={disabled || count > eligibleCount}
                className={`py-3 px-2 rounded-lg font-bold transition-all border-2 ${
                  !useCustom && selectedWinners === count
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30'
                    : disabled || count > eligibleCount
                      ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-400/50 hover:bg-cyan-500/10'
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          {/* Custom Count */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-mono">CUSTOM_WINNER_COUNT</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={eligibleCount}
                value={customCount}
                onChange={(e) => {
                  const val = Math.min(Math.max(parseInt(e.target.value) || 1, 1), eligibleCount)
                  setCustomCount(val)
                }}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                onClick={() => setUseCustom(!useCustom)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 ${
                  useCustom
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-400/50'
                }`}
              >
                {useCustom ? 'Active' : 'Use'}
              </button>
            </div>
          </div>

          {/* Winner Layout Preview */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 font-mono mb-3">WINNER_RANKING</p>
            <div className="space-y-2">
              {Array.from({ length: finalWinnerCount }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-yellow-500/40 to-orange-500/40 rounded flex items-center justify-center text-yellow-300 font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="text-gray-400 text-sm">Place {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lock Button */}
      <Button
        onClick={handleLock}
        disabled={disabled || eligibleCount === 0 || finalWinnerCount > eligibleCount}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-6 text-lg shadow-lg shadow-purple-600/50 hover:shadow-purple-600/70 transition-all"
      >
        <Lock className="mr-3 h-5 w-5" />
        Lock & Prepare Live Session
      </Button>

      {eligibleCount === 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          No eligible participants available
        </div>
      )}
    </div>
  )
}
