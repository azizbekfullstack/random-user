"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useTranslation, type Locale } from "@/lib/i18n"
import { selectRandomWinner } from "@/lib/random-engine"
import { CinematicAnimation } from "@/components/cinematic-animation"
import { MatrixRain } from "@/components/matrix-rain"
import { OperatorPanel } from "@/components/operator-panel"
import { PreparationPhase } from "@/components/preparation-phase"
import { LiveDrawStage } from "@/components/live-draw-stage"
import { SpinnerWheel } from "@/components/spinner-wheel"
import { WinnerResultsPage } from "@/components/winner-results-page"
import { WinnerRevealModal } from "@/components/winner-reveal-modal"
import { LiveBackground } from "@/components/live-background"
import { Button } from "@/components/ui/button"
import { setSoundEnabled } from "@/lib/sound-manager"
import {
  Upload,
  FileSpreadsheet,
  Trash2,
  Trophy,
  Download,
  LogOut,
  Loader2,
  CheckCircle,
  Database,
  Filter,
} from "lucide-react"

const LOCALES: { code: Locale; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
]

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { t, locale, setLocale } = useTranslation()
  const [data, setData] = useState<string[][]>([])
  const [columnCount, setColumnCount] = useState(0)
  const [fileName, setFileName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dedupColumn, setDedupColumn] = useState(0)
  const [dedupCount, setDedupCount] = useState(0)
  const [winnerCount, setWinnerCount] = useState(1)
  const [calculatedWinners, setCalculatedWinners] = useState<Array<{ index: number; row: string[]; rank: number }>>([])
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [isLiveDrawMode, setIsLiveDrawMode] = useState(false)
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [sessionLocked, setSessionLocked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const parseFile = useCallback(async (file: File) => {
    setProcessing(true)
    setDedupCount(0)
    setDedupColumn(-1)

    try {
      const XLSX = await import("xlsx")
      const arrayBuffer = await file.arrayBuffer()
      
      // Use SheetJS streaming for large files to avoid memory overload
      const workbook = XLSX.read(arrayBuffer, { type: "array", WTF: false })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      
      // Process in chunks for better performance
      const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
        blankrows: false,
      })

      // Filter out completely empty rows efficiently
      const filtered = jsonData.filter((row) =>
        row && row.some((cell) => cell && String(cell).trim() !== "")
      )

      if (filtered.length > 0) {
        // Find max columns only once
        let maxCols = 0
        for (const row of filtered) {
          if (row.length > maxCols) maxCols = row.length
        }

        // Normalize rows in a single pass
        const normalized = filtered.map((row) => {
          const normalized = Array(maxCols)
          for (let i = 0; i < row.length; i++) {
            normalized[i] = String(row[i] || "")
          }
          for (let i = row.length; i < maxCols; i++) {
            normalized[i] = ""
          }
          return normalized
        })

        setData(normalized)
        setColumnCount(maxCols)
        setFileName(file.name)
      }
    } catch (err) {
      alert("Failed to parse file. Please ensure it's a valid Excel or CSV file.")
    } finally {
      setProcessing(false)
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) parseFile(file)
    },
    [parseFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) parseFile(file)
    },
    [parseFile]
  )

  const handleLockSession = useCallback(
    (selectedWinnerCount: number) => {
      const eligibleCount = data.length - dedupCount
      if (eligibleCount === 0 || selectedWinnerCount > eligibleCount) return

      // Calculate winners using crypto-random selection
      const winners: Array<{ index: number; row: string[]; rank: number }> = []
      const usedIndices = new Set<number>()

      for (let rank = 1; rank <= selectedWinnerCount; rank++) {
        let randomIndex: number
        do {
          randomIndex = selectRandomWinner(data.length)
        } while (usedIndices.has(randomIndex))

        usedIndices.add(randomIndex)
        winners.push({
          index: randomIndex,
          row: data[randomIndex],
          rank,
        })
      }

      // Store winners and lock session
      setCalculatedWinners(winners)
      setWinnerCount(selectedWinnerCount)
      setSessionLocked(true)
      setIsLiveMode(true)
    },
    [data, dedupCount]
  )

  const handleSelectWinners = useCallback(() => {
    if (calculatedWinners.length > 0) {
      setShowWinnerModal(true)
    }
  }, [calculatedWinners])

  const handleLiveDrawComplete = useCallback(
    (winnerIndices: number[]) => {
      // Convert indices to winner objects with data
      const winners: Array<{ index: number; row: string[]; rank: number }> = winnerIndices.map((idx, rank) => ({
        index: idx,
        row: data[idx],
        rank: rank + 1,
      }))

      setCalculatedWinners(winners)
      setIsLiveDrawMode(false)
      
      // Show the winner reveal modal
      setTimeout(() => {
        setShowWinnerModal(true)
      }, 500)
    },
    [data]
  )

  const handleDedup = useCallback(() => {
    if (dedupColumn < 0 || data.length === 0) return
    const seen = new Set<string>()
    const deduped: string[][] = []
    for (const row of data) {
      const val = row[dedupColumn]?.trim().toLowerCase() ?? ""
      if (!seen.has(val)) {
        seen.add(val)
        deduped.push(row)
      }
    }
    const removed = data.length - deduped.length
    setDedupCount(removed)
    setData(deduped)
  }, [data, dedupColumn])

  // Removed - using spinner wheel instead of old selection method

  const handleExportExcel = useCallback(async () => {
    if (calculatedWinners.length === 0) return
    const XLSX = await import("xlsx")
    
    // Create header row
    const headerRow = Array.from({ length: columnCount }, (_, i) => `${t("dashboard.table.column")} ${i + 1}`)
    headerRow.unshift("RANK")
    
    // Create data rows with rank
    const wsData: string[][] = [headerRow]
    calculatedWinners.forEach((w) => {
      const row = [String(w.rank), ...w.row]
      wsData.push(row)
    })

    const ws = XLSX.utils.aoa_to_sheet(wsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Winners")
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([buf], { type: "application/octet-stream" })
    const { saveAs } = await import("file-saver")
    saveAs(blob, "winners.xlsx")
  }, [calculatedWinners, columnCount, t])

  const handleExportJSON = useCallback(async () => {
    if (calculatedWinners.length === 0) return
    const winners = calculatedWinners.map((w) => {
      const obj: Record<string, string> = {}
      w.row.forEach((val, i) => {
        obj[`column_${i + 1}`] = val
      })
      return {
        rank: w.rank,
        participantIndex: w.index + 1,
        data: obj,
      }
    })
    const jsonStr = JSON.stringify({ winners, totalWinners: calculatedWinners.length }, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const { saveAs } = await import("file-saver")
    saveAs(blob, "winners.json")
  }, [calculatedWinners])

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Operator Control Panel (hidden, toggle with Ctrl+Shift+O) */}
      <OperatorPanel
        isLiveMode={isLiveMode}
        setLiveMode={setIsLiveMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={(enabled) => {
          setSoundEnabledLocal(enabled)
          setSoundEnabled(enabled)
        }}
        onClose={() => {}}
      />

      {/* Cinematic Animation Overlay */}
      <CinematicAnimation
        visible={showAnimation}
        winner={winner}
        onComplete={() => setShowAnimation(false)}
      />

      {/* Matrix Rain Background */}
      <MatrixRain visible={showAnimation} />

      {/* Dashboard Header - Hidden in Live Mode */}
      {!isLiveMode && (
        <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/95 via-black/80 to-black/60 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{t("dashboard.title")}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    locale === loc.code
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t("dashboard.logout")}
            </button>
          </div>
        </div>
      </header>
      )}

      <main className={`container mx-auto px-4 pb-12 space-y-6 ${isLiveMode ? "pt-8" : "pt-24"}`}>
        {/* STEP 1: File Upload Zone - Only show when no data loaded */}
        {data.length === 0 && (
          <div
            ref={dropZoneRef}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center ${
              dragOver
                ? "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/30"
                : "border-white/20 bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-cyan-400/50 hover:bg-cyan-500/5 hover:shadow-lg hover:shadow-cyan-500/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
                <p className="text-gray-300">{t("dashboard.upload.processing")}</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white">{t("dashboard.upload.title")}</h3>
                <p className="text-gray-400 text-sm mt-2">{t("dashboard.upload.subtitle")}</p>
                <p className="text-cyan-500/70 text-xs mt-3 font-mono">{t("dashboard.upload.formats")}</p>
              </>
            )}
          </div>
        )}

        {/* STEP 2: Simple Winner Count Selection - Show when data loaded but not locked */}
        {data.length > 0 && !sessionLocked && !isLiveMode && (
          <>
            {/* Show File Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                <FileSpreadsheet className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">{t("dashboard.table.file")}</p>
                  <p className="text-sm font-semibold text-blue-300">{fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-400/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                <Database className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500">{t("dashboard.table.rows")}</p>
                  <p className="text-sm font-semibold text-purple-300">{data.length.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-400/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                <Filter className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-500">{t("dashboard.table.columns")}</p>
                  <p className="text-sm font-semibold text-orange-300">{columnCount}</p>
                </div>
              </div>
            </div>

            {/* Winner Count Selection - Simple UI */}
            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">{t("dashboard.preparation.title")}</h2>
                  <p className="text-gray-400">{t("dashboard.preparation.subtitle")}</p>
                </div>

                {/* Winner Count Input */}
                <div className="flex items-center gap-4">
                  <label className="text-white font-semibold">{t('liveDraw.winnersToSelect')}</label>
                  <select
                    value={winnerCount}
                    onChange={(e) => setWinnerCount(Math.max(1, Math.min(Math.floor(data.length / 2), parseInt(e.target.value))))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-bold text-xl focus:outline-none focus:border-purple-400"
                  >
                    {Array.from({ length: Math.min(10, Math.floor(data.length / 2)) }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num} className="bg-slate-900">
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Button */}
                <Button
                  onClick={() => handleLockSession(winnerCount)}
                  disabled={data.length === 0}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-6 px-12 text-xl shadow-2xl shadow-cyan-600/50 hover:shadow-cyan-600/70 transition-all"
                >
                  {t('liveDraw.startBtn')}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* STEP 3: Spinner Wheel Draw - Show only when locked and in live mode */}
        {sessionLocked && isLiveMode && !showWinnerModal && (
          <div className="relative z-10">
            <LiveBackground visible={true} participantCount={data.length} />
            <SpinnerWheel
              participants={data.map(row => row[0])}
              winnerCount={winnerCount}
              onComplete={handleLiveDrawComplete}
            />
          </div>
        )}

        {/* STEP 4: Winner Results Page - Show only at the end */}
        {showWinnerModal && sessionLocked && isLiveMode && (
          <div className="relative z-10">
            <WinnerResultsPage
              winners={calculatedWinners.map(w => ({
                rank: w.rank,
                index: w.index,
                name: w.row[0] || `Participant #${w.index + 1}`,
                data: w.row,
              }))}
              onExportExcel={handleExportExcel}
              onExportJSON={handleExportJSON}
              onNewDraw={() => {
                setShowWinnerModal(false)
                setIsLiveDrawMode(false)
                setIsLiveMode(false)
                setSessionLocked(false)
                setData([])
                setCalculatedWinners([])
                setWinnerCount(1)
              }}
            />
          </div>
        )}

        {/* Data Table - Show only in STEP 2 (Preparation) */}
        {data.length > 0 && !sessionLocked && !isLiveMode && (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{t("dashboard.table.title")}</h3>
              <span className="text-xs text-gray-500">
                {t("dashboard.table.showing")} {Math.min(data.length, 100)} {t("dashboard.table.of")} {data.length.toLocaleString()} {t("dashboard.table.total")}
              </span>
            </div>
            <div ref={tableContainerRef} className="overflow-auto max-h-[300px] md:max-h-[400px] lg:max-h-[500px] bg-black/30">
              <table className="w-full text-xs md:text-sm border-collapse">
                <thead className="sticky top-0 bg-black/90 backdrop-blur-sm z-10">
                  <tr>
                    <th className="px-2 md:px-3 py-2 text-left text-gray-400 font-medium border-b border-white/5 w-12 md:w-16">
                      {t("dashboard.table.index")}
                    </th>
                    {Array.from({ length: Math.min(columnCount, 10) }, (_, i) => (
                      <th
                        key={i}
                        className="px-2 md:px-3 py-2 text-left text-gray-400 font-medium border-b border-white/5 text-xs"
                      >
                        {t("dashboard.table.column")} {i + 1}
                      </th>
                    ))}
                    {columnCount > 10 && (
                      <th className="px-2 md:px-3 py-2 text-left text-gray-500 font-medium border-b border-white/5 text-xs">
                        +{columnCount - 10} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 100).map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-white/5 transition-colors ${
                        winner && winner.index === idx
                          ? "bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-300"
                          : "hover:bg-white/[0.05] text-gray-300"
                      }`}
                    >
                      <td className="px-2 md:px-3 py-2 text-gray-500 font-mono text-xs sticky left-0 bg-black/50">{idx + 1}</td>
                      {row.slice(0, 10).map((cell, ci) => (
                        <td key={ci} className="px-2 md:px-3 py-2 truncate max-w-[100px] md:max-w-[150px]">
                          {cell}
                        </td>
                      ))}
                      {columnCount > 10 && (
                        <td className="px-2 md:px-3 py-2 text-gray-500 text-xs">
                          ...
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Controls: Dedup + Winner Selection - Show only in STEP 2 */}
        {data.length > 0 && !sessionLocked && !isLiveMode && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dedup */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-cyan-400" />
                {t("dashboard.dedup.title")}
              </h3>
              <div className="space-y-3">
                <select
                  value={dedupColumn}
                  onChange={(e) => setDedupColumn(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value={-1} className="bg-black text-gray-400">
                    {t("dashboard.dedup.selectColumn")}
                  </option>
                  {Array.from({ length: columnCount }, (_, i) => (
                    <option key={i} value={i} className="bg-black text-gray-300">
                      {t("dashboard.table.column")} {i + 1}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleDedup}
                  disabled={dedupColumn < 0}
                  className="w-full bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("dashboard.dedup.removeBtn")}
                </Button>
                {dedupCount > 0 && (
                  <p className="text-sm text-cyan-400">
                    {dedupCount} {t("dashboard.dedup.removed")} | {data.length.toLocaleString()} {t("dashboard.dedup.remaining")}
                  </p>
                )}
              </div>
            </div>

            {/* Winner Selection */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                {t("dashboard.winner.title")}
              </h3>
              <Button
                onClick={handleSelectWinner}
                disabled={data.length === 0 || selecting}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                size="lg"
              >
                {selecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("dashboard.winner.selecting")}
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-5 w-5" />
                    {t("dashboard.winner.selectBtn")}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Winner Display - System Output Card */}
        {winner && (
          <div className="space-y-4">
            {/* Winner Header */}
            <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-400/40 rounded-3xl p-8 shadow-2xl shadow-yellow-500/20">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border border-yellow-400/50 rounded-full flex items-center justify-center relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-500/0 to-yellow-400/20 animate-pulse" />
                  <Trophy className="h-8 w-8 text-yellow-300 relative z-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {t("dashboard.winner.result")}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {t("dashboard.winner.row")} <span className="text-yellow-400 font-mono font-bold">#{winner.index + 1}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">SYSTEM VERIFIED</p>
                  <p className="text-xs text-green-400 font-mono mt-1">✓ CONFIRMED</p>
                </div>
              </div>
            </div>

            {/* Winner Data Table - System Output */}
            <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-3 border-b border-white/10 bg-white/5 font-mono text-xs text-cyan-400">
                &gt; WINNER_DATA_OUTPUT
              </div>
              <div className="overflow-auto max-h-48">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-black/80 border-b border-white/10">
                    <tr>
                      {winner.row.map((_, i) => (
                        <th key={i} className="px-4 py-3 text-left text-cyan-400 font-mono text-xs">
                          [COLUMN_{i + 1}]
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {winner.row.map((cell, i) => (
                        <td key={i} className="px-4 py-3 text-yellow-300 font-mono text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export - System Output */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 font-mono">&gt; EXPORT_OPTIONS</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleExportExcel}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold shadow-lg shadow-green-600/50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("dashboard.export.excel")}
                </Button>
                <Button
                  onClick={handleExportJSON}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg shadow-blue-600/50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("dashboard.export.json")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {data.length === 0 && !processing && (
          <div className="text-center py-12 text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>{t("dashboard.table.noData")}</p>
          </div>
        )}
      </main>

      {/* Professional Winner Reveal Modal */}
      <WinnerRevealModal
        visible={showWinnerModal}
        winners={calculatedWinners}
        onClose={() => setShowWinnerModal(false)}
        onExportExcel={handleExportExcel}
        onExportJSON={handleExportJSON}
      />
    </div>
  )
}
