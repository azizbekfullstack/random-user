"use client"

import { useEffect, useState } from "react"
import { Settings, Eye, EyeOff, Volume2, VolumeX } from "lucide-react"

interface OperatorPanelProps {
  isLiveMode: boolean
  setLiveMode: (value: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (value: boolean) => void
  onClose: () => void
}

export function OperatorPanel({
  isLiveMode,
  setLiveMode,
  soundEnabled,
  setSoundEnabled,
  onClose,
}: OperatorPanelProps) {
  const [visible, setVisible] = useState(false)

  // Listen for Ctrl+Shift+O
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "O") {
        e.preventDefault()
        setVisible((prev) => !prev)
      }
      if (e.key === "Escape" && visible) {
        setVisible(false)
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-black/95 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <Settings className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">Operator Panel</h3>
        <button
          onClick={() => setVisible(false)}
          className="ml-auto text-gray-500 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Live Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            {isLiveMode ? (
              <Eye className="h-4 w-4 text-green-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm text-gray-300">Live Mode</span>
          </div>
          <button
            onClick={() => setLiveMode(!isLiveMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isLiveMode ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isLiveMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm text-gray-300">Sound</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              soundEnabled ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                soundEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* System Status */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
          <p className="text-xs text-gray-500">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        {/* Keyboard Hint */}
        <p className="text-xs text-gray-500 text-center mt-4">Press Ctrl+Shift+O to toggle | ESC to close</p>
      </div>
    </div>
  )
}
