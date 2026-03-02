"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SplineScene } from "@/components/ui/spline-scene"
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"
import { SparklesCore } from "@/components/ui/sparkles"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { Navbar } from "@/components/ui/navbar"
import { I18nProvider, useTranslation } from "@/lib/i18n"
import { AccessCodeModal } from "@/components/access-code-modal"
import { TelegramOTPModal } from "@/components/telegram-otp-modal"
import { Dashboard } from "@/components/dashboard"
import { useState, useEffect, useCallback } from "react"
import {
  CheckCircle,
  ArrowRight,
  Shield,
  FileSpreadsheet,
  Lock,
  Sparkles as SparklesIcon,
  ServerOff,
  Mail,
  Send,
  Briefcase,
  Database,
  Timer,
  Dice5,
} from "lucide-react"

type AppState = "landing" | "accessCode" | "telegramOTP" | "dashboard"

function LandingContent() {
  const { t } = useTranslation()
  const [appState, setAppState] = useState<AppState>("landing")

  const handleStartSystem = useCallback(() => {
    setAppState("accessCode")
  }, [])

  // Warn before unload when in dashboard
  useEffect(() => {
    if (appState !== "dashboard") return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [appState])

  if (appState === "dashboard") {
    return <Dashboard onLogout={() => setAppState("landing")} />
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onStartSystem={handleStartSystem} />

      {/* Auth Modals */}
      {appState === "accessCode" && (
        <AccessCodeModal
          onSuccess={() => setAppState("telegramOTP")}
          onClose={() => setAppState("landing")}
        />
      )}
      {appState === "telegramOTP" && (
        <TelegramOTPModal
          onSuccess={() => setAppState("dashboard")}
          onBack={() => setAppState("accessCode")}
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="container mx-auto px-4">
          <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-none">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            <div className="flex h-full">
              <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-balance">
                  {t("hero.title")}
                </h1>
                <p className="mt-4 text-neutral-300 max-w-lg">
                  {t("hero.subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100"
                    onClick={handleStartSystem}
                  >
                    {t("hero.startBtn")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent"
                    onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {t("hero.learnMore")}
                  </Button>
                </div>

                <div className="flex items-center gap-8 text-sm text-neutral-400 mt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>{t("hero.badge1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>{t("hero.badge2")}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative hidden md:block">
                <SplineScene
                  scene="https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
                {t("problem.title")}
              </h2>
              <div className="space-y-4 text-gray-300">
                {(t("problem.items") as unknown as string[]).map((item: string, i: number) => (
                  <p key={i} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">{"✗"}</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">{t("problem.solutionTitle")}</h3>
              <div className="space-y-4 text-gray-300">
                {(t("problem.solutions") as unknown as string[]).map((item: string, i: number) => (
                  <p key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("services.title")}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-3">
            <BentoCard
              name={t("services.items.crypto.name")}
              className="lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={Shield}
              description={t("services.items.crypto.description")}
              href="#"
              cta={t("hero.learnMore")}
            />
            <BentoCard
              name={t("services.items.excel.name")}
              className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={FileSpreadsheet}
              description={t("services.items.excel.description")}
              href="#"
              cta={t("hero.learnMore")}
            />
            <BentoCard
              name={t("services.items.auth.name")}
              className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={Lock}
              description={t("services.items.auth.description")}
              href="#"
              cta={t("hero.learnMore")}
            />
            <BentoCard
              name={t("services.items.animation.name")}
              className="lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={SparklesIcon}
              description={t("services.items.animation.description")}
              href="#"
              cta={t("hero.learnMore")}
            />
            <BentoCard
              name={t("services.items.security.name")}
              className="lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={ServerOff}
              description={t("services.items.security.description")}
              href="#"
              cta={t("hero.learnMore")}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Benefits / Stats Section */}
      <section id="benefits" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("benefits.title")}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("benefits.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-green-900/40 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t("benefits.items.rows.value")}</h3>
              <p className="text-gray-300">{t("benefits.items.rows.label")}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-blue-900/40 rounded-full flex items-center justify-center mx-auto">
                <Dice5 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t("benefits.items.random.value")}</h3>
              <p className="text-gray-300">{t("benefits.items.random.label")}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-cyan-900/40 rounded-full flex items-center justify-center mx-auto">
                <ServerOff className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t("benefits.items.backend.value")}</h3>
              <p className="text-gray-300">{t("benefits.items.backend.label")}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-orange-900/40 rounded-full flex items-center justify-center mx-auto">
                <Timer className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t("benefits.items.animation.value")}</h3>
              <p className="text-gray-300">{t("benefits.items.animation.label")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("process.title")}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("process.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(t("process.steps") as unknown as { number: string; title: string; description: string }[]).map(
              (step: { number: string; title: string; description: string }) => (
                <div key={step.number} className="text-center space-y-6">
                  <div className="h-20 w-20 bg-white text-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <AnimatedGradientBackground
          Breathing={true}
          gradientColors={["#0A0A0A", "#2979FF", "#00E5FF", "#1DE9B6", "#0A0A0A", "#2979FF", "#00B8D4"]}
          gradientStops={[35, 50, 60, 70, 80, 90, 100]}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative h-32 w-full flex flex-col items-center justify-center">
              <div className="w-full absolute inset-0">
                <SparklesCore
                  id="ctasparticles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={100}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                  speed={0.8}
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 relative z-20 text-balance">
                {t("cta.title")}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100"
                onClick={handleStartSystem}
              >
                {t("cta.startBtn")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                onClick={() => document.getElementById("technology")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t("cta.learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative py-20 bg-black border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/90" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">{t("footer.brand")}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t("footer.description")}
                </p>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Technology */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">{t("footer.technology")}</h4>
              <ul className="space-y-3">
                {(t("footer.techLinks") as unknown as string[]).map((tech: string) => (
                  <li key={tech}>
                    <a
                      href="#technology"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {tech}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">{t("footer.info")}</h4>
              <ul className="space-y-3">
                {(t("footer.infoLinks") as unknown as { name: string; href: string }[]).map(
                  (item: { name: string; href: string }) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {item.name}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">{t("footer.contact")}</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <Mail className="h-4 w-4" />
                  </div>
                  <a href="mailto:info@winnersystem.uz" className="hover:text-white transition-colors duration-300">
                    {t("footer.email")}
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <Send className="h-4 w-4" />
                  </div>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                    {t("footer.telegram")}
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span>{t("footer.corporate")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400 text-center lg:text-left">
                {"© 2024 "}{t("footer.copyright")}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-end space-x-8">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  {t("footer.privacy")}
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  {t("footer.terms")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <I18nProvider>
      <LandingContent />
    </I18nProvider>
  )
}
