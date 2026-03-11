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
  const { locale, setLocale, t } = useTranslation()

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-base md:text-lg font-bold text-foreground">{t('dashboard.title')}</h1>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex gap-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                    locale === loc.code
                      ? "bg-accent text-accent-foreground shadow-md shadow-accent/30"
                      : "bg-secondary text-muted-foreground border border-border hover:bg-secondary/80"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-14">
        <LotteryContainer />
      </main>
    </div>
  )
}
