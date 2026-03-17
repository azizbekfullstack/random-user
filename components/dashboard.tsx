"use client"

import { useTranslation, type Locale } from "@/lib/i18n"
import { LotteryContainer } from "@/components/lottery"
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
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Lottery System</h1>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex gap-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    locale === loc.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16">
        <LotteryContainer />
      </main>
    </div>
  )
}
