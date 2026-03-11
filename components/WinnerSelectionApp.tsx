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
import { RotateCcw } from 'lucide-react';

type TabType = 'results' | 'settings' | 'next';

export default function WinnerSelectionApp() {
  const { t } = useTranslation();

  // Data state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [selectionState, setSelectionState] = useState<WinnerSelectionState | null>(null);

  // UI state
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [spinDuration] = useState(30);

  // Event Handlers
  const handleFileLoad = (newParticipants: Participant[], columns: string[]) => {
    setParticipants(newParticipants);
    const configs = autoConfigureColumns(columns);
    setColumnConfigs(configs);
    setSelectionState(initializeSelectionState(newParticipants));
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
    const updatedState = updateSelectionState(selectionState, selection);
    setSelectionState(updatedState);
    setIsSpinning(false);
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
  };

  const remainingWinners =
    selectionState && selectionState.availableParticipants.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {t('winnerSelection.title')}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {participants.length > 0
                ? `${participants.length} participants`
                : 'Upload a file to start'}
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

            {/* Center: Spinner */}
            <div className="flex-1 flex items-center justify-center py-4">
              {selectionState && (
                <VerticalSlotMachineSpinner
                  virtualParticipants={selectionState.currentSelection?.virtualParticipants || selectionState.availableParticipants.slice(0, 100)}
                  winnerIndex={selectionState.currentSelection?.virtualIndices[0] || 0}
                  isSpinning={isSpinning}
                  duration={spinDuration}
                  onSpinComplete={handleSpinComplete}
                  columnName={columnConfigs[0]?.name}
                />
              )}
            </div>

            {/* Bottom: Tabs and Controls */}
            <div className="border-t border-border/30 pt-4 space-y-3">
              {/* Tab Navigation */}
              <div className="flex gap-2 border-b border-border/30">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-3 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'results'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('winnerSelection.tabs.results')}
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'settings'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('winnerSelection.tabs.settings')}
                </button>
                {remainingWinners && (
                  <button
                    onClick={() => setActiveTab('next')}
                    className={`px-3 py-2 text-xs font-semibold transition-colors ${
                      activeTab === 'next'
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('winnerSelection.tabs.next')}
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="min-h-64 pb-4">
                {activeTab === 'results' && (
                  <ResultsPanel
                    winners={selectionState?.selectedWinners || []}
                    columnConfigs={columnConfigs}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsPanel
                    columnConfigs={columnConfigs}
                    onConfigChange={handleConfigChange}
                  />
                )}

                {activeTab === 'next' && (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectionState?.availableParticipants.length || 0} participants remaining
                      </p>
                      <button
                        onClick={handleStartSpin}
                        disabled={isSpinning || !remainingWinners}
                        className="px-6 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {isSpinning
                          ? t('winnerSelection.spinner.spinning')
                          : t('winnerSelection.spinner.selectNextBtn')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
