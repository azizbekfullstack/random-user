'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Trophy, Users, Minus, Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Step3WinnerCountProps {
  participantCount: number;
  winnerCount: number;
  onWinnerCountChange: (count: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3WinnerCount({
  participantCount,
  winnerCount,
  onWinnerCountChange,
  onNext,
  onBack,
}: Step3WinnerCountProps) {
  const { t } = useTranslation();
  const presetCounts = [1, 3, 5, 10, 20];

  const increment = () => {
    if (winnerCount < participantCount) {
      onWinnerCountChange(winnerCount + 1);
    }
  };

  const decrement = () => {
    if (winnerCount > 1) {
      onWinnerCountChange(winnerCount - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      onNext();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-4 py-8 bg-background overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-3"
          >
            <Trophy className="w-6 h-6 text-accent-foreground" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('draw.winner_count')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('draw.draw_name')}
          </p>
        </motion.div>

        {/* Counter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6 mb-4"
        >
          {/* Increment/Decrement Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={decrement}
              disabled={winnerCount <= 1}
              className="w-12 h-12 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-6 h-6" />
            </motion.button>

            <motion.div
              key={winnerCount}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-lg bg-accent/10 border-2 border-accent flex items-center justify-center"
            >
              <span className="text-4xl font-bold text-accent">{winnerCount}</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={increment}
              disabled={winnerCount >= participantCount}
              className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {presetCounts
              .filter((count) => count <= participantCount)
              .map((preset, index) => (
                <motion.button
                  key={preset}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => onWinnerCountChange(preset)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold ${
                    winnerCount === preset
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                      : 'bg-secondary text-foreground border border-border hover:border-accent/50'
                  }`}
                >
                  {preset}
                </motion.button>
              ))}
          </div>
        </motion.div>

        {/* Info Card - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-accent/10 border border-accent rounded-lg p-4 flex items-center gap-3"
        >
          <Users className="w-5 h-5 text-accent flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('dashboard.lottery.review.participants')}</p>
            <p className="text-lg font-bold text-foreground">{participantCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('winner.selected')}</p>
            <p className="text-lg font-bold text-accent">
              {((winnerCount / participantCount) * 100).toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 justify-center mt-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-foreground border border-border rounded-lg hover:bg-secondary/80 transition-all font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('dashboard.lottery.review.back')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            onKeyDown={handleKeyDown}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-bold hover:shadow-lg transition-all text-sm"
          >
            {t('system.continue')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
