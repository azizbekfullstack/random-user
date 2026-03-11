'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { Participant } from '@/lib/lottery-types';
import WinnerSpinner from './WinnerSpinner';
import ResultsInline from './ResultsInline';
import TabNavigation from './TabNavigation';
import { Play, RotateCcw } from 'lucide-react';

type TabType = 'results' | 'parameters' | 'next';

interface LiveDrawStageProps {
  participants: Participant[];
  winnerCount: number;
  selectedColumns: string[];
  onComplete?: (winners: Participant[]) => void;
  onRestart?: () => void;
  spinDuration?: number; // in seconds
}

export default function LiveDrawStage({
  participants,
  winnerCount,
  selectedColumns,
  onComplete,
  onRestart,
  spinDuration = 30,
}: LiveDrawStageProps) {
  const { t } = useTranslation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('parameters');

  const handleStartSpin = () => {
    setIsSpinning(true);
    setActiveTab('results');
  };

  const handleSpinComplete = (selectedWinners: Participant[]) => {
    setWinners(selectedWinners);
    setIsSpinning(false);
    onComplete?.(selectedWinners);
  };

  const handleRestart = () => {
    setIsSpinning(false);
    setWinners([]);
    setActiveTab('parameters');
    onRestart?.();
  };

  const handleExport = () => {
    const data = winners.map((winner, index) => ({
      '#': index + 1,
      ...Object.fromEntries(
        selectedColumns.map((col) => [col, winner[col] || ''])
      ),
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winners-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('dashboard.liveDraw.title')}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboard.liveDraw.subtitle')}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex gap-3">
              <div className="bg-secondary rounded-lg px-4 py-2">
                <div className="text-xs text-muted-foreground">
                  {t('dashboard.lottery.review.participants')}
                </div>
                <div className="text-lg font-bold text-accent">
                  {participants.length}
                </div>
              </div>
              <div className="bg-secondary rounded-lg px-4 py-2">
                <div className="text-xs text-muted-foreground">
                  {t('dashboard.lottery.review.winners')}
                </div>
                <div className="text-lg font-bold text-accent">
                  {winnerCount}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            participantCount={participants.length}
            winnerCount={winnerCount}
            drawDuration={spinDuration}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Spinner View */}
        {isSpinning && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center"
          >
            <WinnerSpinner
              participants={participants}
              winnerCount={winnerCount}
              onComplete={handleSpinComplete}
              duration={spinDuration}
            />
          </motion.div>
        )}

        {/* Results Tab - Inline Winners Display */}
        {activeTab === 'results' && winners.length > 0 && !isSpinning && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ResultsInline
              winners={winners}
              selectedColumns={selectedColumns}
              onExport={handleExport}
            />
          </motion.div>
        )}

        {/* Parameters Tab - Draw Configuration */}
        {activeTab === 'parameters' && !isSpinning && (
          <motion.div
            key="parameters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Draw Config Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                  {t('dashboard.lottery.review.participants')}
                </div>
                <div className="text-3xl font-bold text-accent">
                  {participants.length}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {t('upload.participant_count')}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                  {t('dashboard.lottery.review.winners')}
                </div>
                <div className="text-3xl font-bold text-accent">
                  {winnerCount}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {((winnerCount / participants.length) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                  {t('dashboard.liveDraw.timerLabel')}
                </div>
                <div className="text-3xl font-bold text-accent">
                  {spinDuration}s
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {t('dashboard.animation.analyzing')}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                  {t('dashboard.lottery.review.columns')}
                </div>
                <div className="text-3xl font-bold text-accent">
                  {selectedColumns.length}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {t('system.details')}
                </div>
              </div>
            </div>

            {/* Selected Columns */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                {t('dashboard.lottery.review.selectedColumns')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedColumns.map((col) => (
                  <div
                    key={col}
                    className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs font-medium text-foreground"
                  >
                    {col}
                  </div>
                ))}
              </div>
            </div>

            {/* Start Spin Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartSpin}
              className="w-full py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {t('dashboard.liveDraw.startBtn')}
            </motion.button>
          </motion.div>
        )}

        {/* Next Tab - Post-Draw Actions */}
        {activeTab === 'next' && winners.length > 0 && !isSpinning && (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {winners.length} {t('dashboard.lottery.review.winners')} {t('winner.selected')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('dashboard.liveDraw.subtitle')}
              </p>

              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {t('result.export')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className="px-6 py-2.5 bg-secondary border border-border text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('result.restart')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State - Initial View */}
        {!isSpinning && winners.length === 0 && activeTab === 'parameters' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🎲</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t('dashboard.liveDraw.startBtn')}
              </h3>
              <p className="text-muted-foreground">
                {spinDuration}s {t('dashboard.animation.analyzing')}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer - When spinning */}
      {isSpinning && (
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('dashboard.liveDraw.spinningMessage')}
          </p>
        </div>
      )}
    </div>
  );
}
