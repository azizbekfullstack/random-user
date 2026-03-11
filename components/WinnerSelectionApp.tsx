'use client';

import { useState } from 'react';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import { ColumnConfig, autoConfigureColumns } from '@/lib/data-masking';
import {
  selectNextWinner,
  initializeSelectionState,
  updateSelectionState,
  WinnerSelectionState,
} from '@/lib/winner-selection-engine';
import ExcelUploadManager from '@/components/ExcelUploadManager';
import VerticalSlotMachineSpinner from '@/components/VerticalSlotMachineSpinner';
import ResultsPanel from '@/components/ResultsPanel';
import SettingsPanel from '@/components/SettingsPanel';
import CelebrationEffect from '@/components/CelebrationEffect';
import { RotateCcw, Check } from 'lucide-react';

type TabType = 'results' | 'settings' | 'next';

interface PendingPosition {
  participant: Participant;
  position: number;
  showCelebration: boolean;
}

export default function WinnerSelectionApp() {
  const { t } = useTranslation();

  // Data state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [selectionState, setSelectionState] = useState<WinnerSelectionState | null>(null);
  const [selectedNameColumn, setSelectedNameColumn] = useState<string>('');

  // UI state
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [spinDuration] = useState(30);
  const [pendingPosition, setPendingPosition] = useState<PendingPosition | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Event Handlers
  const handleFileLoad = (newParticipants: Participant[], columns: string[], selectedColumn?: string) => {
    setParticipants(newParticipants);
    const configs = autoConfigureColumns(columns);
    setColumnConfigs(configs);
    setSelectionState(initializeSelectionState(newParticipants));
    setSelectedNameColumn(selectedColumn || columns[0] || '');
  };

  const handleStartSpin = () => {
    if (!selectionState || selectionState.availableParticipants.length === 0) {
      return;
    }

    setIsSpinning(true);
    setActiveTab('results');
  };

  const handleSpinComplete = () => {
    if (!selectionState) return;

    // Get next winner from available participants
    const selection = selectNextWinner(selectionState.availableParticipants);
    
    // Show pending position for confirmation
    setPendingPosition({
      participant: selection.winner,
      position: selectionState.selectedWinners.length + 1,
      showCelebration: false,
    });
    
    setIsSpinning(false);
  };

  const handleConfirmPosition = () => {
    if (!pendingPosition || !selectionState) return;

    // Update selection state with confirmed position
    const selection = selectNextWinner(selectionState.availableParticipants);
    const updatedState = updateSelectionState(selectionState, selection);
    
    setSelectionState(updatedState);
    
    // Show celebration effect
    setShowCelebration(true);
    setPendingPosition({
      ...pendingPosition,
      showCelebration: true,
    });
    
    setTimeout(() => {
      setShowCelebration(false);
      setPendingPosition(null);
    }, 2000);
  };

  const handleRejectPosition = () => {
    setPendingPosition(null);
  };

  const handleConfigChange = (newConfigs: ColumnConfig[]) => {
    setColumnConfigs(newConfigs);
  };

  const handleRestart = () => {
    setParticipants([]);
    setColumnConfigs([]);
    setSelectionState(null);
    setIsSpinning(false);
    setActiveTab('results');
    setPendingPosition(null);
    setShowCelebration(false);
  };

  const remainingPositions =
    selectionState && selectionState.availableParticipants.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {t('winnerSelection.title')}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {participants.length > 0
                  ? `${participants.length} ishtirokchi | ${selectionState?.selectedWinners.length || 0} ta o'rin aniqlandi`
                  : 'Fayl yuklang'}
              </p>
            </div>
            
            {/* Draw Progress Counter */}
            {participants.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Qolgan</p>
                  <p className="text-xl font-bold text-accent">
                    {selectionState?.availableParticipants.length || 0}
                  </p>
                </div>
                {participants.length > 0 && (
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restart
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {participants.length === 0 ? (
          // Upload Section
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <ExcelUploadManager onFileLoad={handleFileLoad} />
            </div>
          </div>
        ) : (
          // Main Layout: Top Upload, Center Spinner, Bottom Tabs
          <div className="flex-1 flex flex-col gap-4 p-4 max-w-6xl mx-auto w-full">
            {/* Top: Upload Section */}
            <div className="border-b border-border/30 pb-4">
              <ExcelUploadManager onFileLoad={handleFileLoad} />
            </div>

            {/* Center: Spinner with Professional Broadcast Stage */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
              {showCelebration && <CelebrationEffect />}
              
              {/* Stage Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />
              
              {/* Spotlight Effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
              </div>
              
              {/* Spinner Container */}
              <div className="relative z-10">
                {selectionState && (
                  <VerticalSlotMachineSpinner
                    virtualParticipants={selectionState.currentSelection?.virtualParticipants || selectionState.availableParticipants.slice(0, 100)}
                    winnerIndex={selectionState.currentSelection?.virtualIndices[0] || 0}
                    isSpinning={isSpinning}
                    duration={spinDuration}
                    onSpinComplete={handleSpinComplete}
                    columnName={selectedNameColumn}
                  />
                )}
              </div>
              
              {/* Status Indicator */}
              {isSpinning && (
                <div className="absolute bottom-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Tanlash jarayoni...
                </div>
              )}
            </div>

            {/* Pending Position Confirmation - Announcement Style */}
            {pendingPosition && (
              <div className="border-t border-accent/50 bg-gradient-to-r from-accent/10 to-accent/5 p-6">
                <div className="max-w-2xl mx-auto">
                  {/* Position Badge */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">{pendingPosition.position}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {pendingPosition.position}-o'rin aniqlandi
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {pendingPosition.participant[selectedNameColumn] || 'Noma\'lum'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={handleRejectPosition}
                      className="px-6 py-2 rounded-lg border border-border text-muted-foreground font-semibold text-sm hover:text-foreground transition-colors"
                    >
                      Qayta o'tish
                    </button>
                    <button
                      onClick={handleConfirmPosition}
                      className="px-6 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Tasdiqlash
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom: Tabs and Controls */}
            {!pendingPosition && (
              <div className="border-t border-border/30 pt-4 space-y-3">
                {/* Tab Navigation - Enhanced */}
                <div className="flex gap-2 border-b border-border/30 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('results')}
                    className={`px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeTab === 'results'
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    G'oliblar ({selectionState?.selectedWinners.length || 0})
                  </button>
                  {remainingPositions && (
                    <button
                      onClick={() => setActiveTab('next')}
                      className={`px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                        activeTab === 'next'
                          ? 'text-accent border-b-2 border-accent'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {`${(selectionState?.selectedWinners.length || 0) + 1}-o'rin`}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeTab === 'settings'
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('winnerSelection.tabs.settings')}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-64 pb-4">
                  {activeTab === 'results' && (
                    <ResultsPanel
                      positions={selectionState?.selectedWinners || []}
                      columnConfigs={columnConfigs}
                      selectedNameColumn={selectedNameColumn}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsPanel
                      columnConfigs={columnConfigs}
                      onConfigChange={handleConfigChange}
                    />
                  )}

                  {activeTab === 'next' && (
                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                      {/* Remaining Counter */}
                      <div className="text-center space-y-2">
                        <div className="inline-block px-6 py-3 rounded-lg bg-accent/10 border border-accent/30">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Qolgan ishtirokchilar</p>
                          <p className="text-3xl font-bold text-accent mt-1">
                            {selectionState?.availableParticipants.length || 0}
                          </p>
                        </div>
                      </div>

                      {/* Next Position to Draw */}
                      <div className="text-center space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                            Keyingi
                          </p>
                          <p className="text-5xl font-bold text-accent">
                            {(selectionState?.selectedWinners.length || 0) + 1}-o'rin
                          </p>
                        </div>
                        
                        <button
                          onClick={handleStartSpin}
                          disabled={isSpinning || !remainingPositions}
                          className="px-8 py-4 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          {isSpinning
                            ? 'Tanlash jarayoni...'
                            : `${(selectionState?.selectedWinners.length || 0) + 1}-o'ranni aniqlash`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
