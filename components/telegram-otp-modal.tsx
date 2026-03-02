"use client"

import { useState, useRef } from "react"
import { useTranslation } from "@/lib/i18n"
import { generateOTP, hashOTP, verifyOTP } from "@/lib/auth"
import { sendOTPToChannel } from "@/lib/telegram"
import { Send, Shield, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TelegramOTPModalProps {
  onSuccess: () => void
  onBack: () => void
}

export function TelegramOTPModal({ onSuccess, onBack }: TelegramOTPModalProps) {
  const { t } = useTranslation()
  const [botToken, setBotToken] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const otpHashRef = useRef<string>("")

  const handleSendOTP = async () => {
    if (!botToken.trim()) return
    setSending(true)
    setError("")

    try {
      const otp = generateOTP()
      const hash = await hashOTP(otp)
      otpHashRef.current = hash

      const success = await sendOTPToChannel(botToken.trim(), otp)
      if (success) {
        setOtpSent(true)
      } else {
        setError(t("auth.telegram.sendError"))
      }
    } catch {
      setError(t("auth.telegram.sendError"))
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpInput.trim() || !otpHashRef.current) return
    setVerifying(true)
    setError("")

    try {
      const isValid = await verifyOTP(otpInput.trim(), otpHashRef.current)
      if (isValid) {
        onSuccess()
      } else {
        setError(t("auth.telegram.error"))
        setShake(true)
        setTimeout(() => setShake(false), 600)
      }
    } catch {
      setError(t("auth.telegram.error"))
    } finally {
      setVerifying(false)
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
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm z-10"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("auth.telegram.back")}
        </button>

        <div className="relative z-10 flex flex-col items-center space-y-6 mt-2">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-400/50 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 to-blue-400/20 animate-pulse" />
            <Send className="h-10 w-10 text-blue-300 relative z-10" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">{t("auth.telegram.title")}</h2>
            <p className="text-gray-300 text-sm">{t("auth.telegram.subtitle")}</p>
          </div>

          <div className="w-full space-y-4">
            {/* Bot Token Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t("auth.telegram.botTokenLabel")}</label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder={t("auth.telegram.botTokenPlaceholder")}
                disabled={otpSent}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm disabled:opacity-50"
              />
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <Button
                onClick={handleSendOTP}
                disabled={!botToken.trim() || sending}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all disabled:opacity-50"
                size="lg"
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.telegram.sending")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("auth.telegram.generateBtn")}
                  </>
                )}
              </Button>
            )}

            {/* OTP Sent Confirmation */}
            {otpSent && (
              <>
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{t("auth.telegram.sent")}</span>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">{t("auth.telegram.otpLabel")}</label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setOtpInput(val)
                        setError("")
                      }}
                      placeholder={t("auth.telegram.otpPlaceholder")}
                      maxLength={6}
                      className={`w-full px-4 py-4 bg-white/5 backdrop-blur border rounded-xl text-white text-center text-3xl tracking-[0.3em] font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all font-bold ${
                        error
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-white/10 focus:ring-blue-500/50 focus:border-blue-500/30"
                      }`}
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={otpInput.length !== 6 || verifying}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-semibold shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all disabled:opacity-50"
                    size="lg"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("auth.telegram.verifying")}
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        {t("auth.telegram.verifyBtn")}
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
