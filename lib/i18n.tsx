"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import en from "@/lib/translations/en.json"
import ru from "@/lib/translations/ru.json"
import uz from "@/lib/translations/uz.json"

export type Locale = "en" | "ru" | "uz"

const translations: Record<Locale, Record<string, unknown>> = { en, ru, uz }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationValue = any

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => TranslationValue
}

const I18nContext = createContext<I18nContextType | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): TranslationValue {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return current ?? path
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("uz")

  const t = useCallback(
    (key: string): TranslationValue => {
      return getNestedValue(translations[locale], key)
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}
