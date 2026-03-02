"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslation } from "@/lib/i18n"
import { validateAccessCode } from "@/lib/auth"
import { Shield, X, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccessCodeModalProps {
  onSuccess: () => void
  onClose: () => void
}

export function AccessCodeModal({ onSuccess, onClose }: AccessCodeModalProps) {
  const { t } = useTranslation()
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateAccessCode(code)) {
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-xl">
      <div
        className={`relative w-full max-w-md mx-4 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden ${
          shake ? "animate-shake" : ""
        }`}
        style={{
          boxShadow:
            "0 0 40px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Animated glow background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-400/50 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 to-blue-400/20 animate-pulse" />
            <KeyRound className="h-10 w-10 text-blue-300 relative z-10" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">{t("auth.accessCode.title")}</h2>
            <p className="text-gray-300 text-sm">{t("auth.accessCode.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError(false)
                }}
                placeholder={t("auth.accessCode.placeholder")}
                className={`w-full px-4 py-3 bg-white/5 backdrop-blur border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all font-mono tracking-wide ${
                  error
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-white/10 focus:ring-blue-500/50 focus:border-blue-500/30"
                }`}
              />
              {error && (
                <p className="text-red-400 text-sm animate-pulse">{t("auth.accessCode.error")}</p>
              )}
              <p className="text-gray-500 text-xs">{t("auth.accessCode.hint")}</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
              size="lg"
            >
              <Shield className="mr-2 h-4 w-4" />
              {t("auth.accessCode.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
