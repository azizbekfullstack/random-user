"use client"

import { useTranslation, type Locale } from "@/lib/i18n"
import { LotteryContainer } from "@/components/lottery"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

const LOCALES: { code: Locale; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
]

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="relative min-h-screen">
      {/* Simple Header with Logout and Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-50 via-purple-50 to-transparent backdrop-blur-sm border-b border-purple-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lottery System
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    locale === loc.code
                      ? "bg-purple-500/20 text-purple-600 border border-purple-500/30"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - LotteryContainer */}
      <main className="pt-24">
        <LotteryContainer />
      </main>
    </div>
  )
}
