'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Users, Trophy, CheckCircle2, Play } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Step4ReadyProps {
  participantCount: number;
  winnerCount: number;
  selectedColumns: string[];
  onStart: () => void;
  onBack: () => void;
}

export default function Step4Ready({
  participantCount,
  winnerCount,
  selectedColumns,
  onStart,
  onBack,
}: Step4ReadyProps) {
  const { t } = useTranslation();

  const getSummaryText = () => {
    const template = t('dashboard.lottery.review.summary');
    return template
      .replace('{participants}', `${participantCount}`)
      .replace('{winners}', `${winnerCount}`);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground">
            {t('dashboard.lottery.review.title')}
          </h2>
          <p className="text-center text-muted-foreground mt-2">
            {t('dashboard.lottery.review.subtitle')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {/* Participants */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <Users className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-muted-foreground text-xs uppercase tracking-wide">{t('dashboard.lottery.review.participants')}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{participantCount}</p>
          </motion.div>

          {/* Winners */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-muted-foreground text-xs uppercase tracking-wide">{t('dashboard.lottery.review.winners')}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{winnerCount}</p>
          </motion.div>

          {/* Columns */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-muted-foreground text-xs uppercase tracking-wide">{t('dashboard.lottery.review.columns')}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{selectedColumns.length}</p>
          </motion.div>
        </motion.div>

        {/* Columns List */}
        {selectedColumns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-4 mb-6"
          >
            <p className="text-foreground text-sm font-semibold mb-3">{t('dashboard.lottery.review.selectedColumns')}</p>
            <div className="flex flex-wrap gap-2">
              {selectedColumns.map((col) => (
                <span key={col} className="px-3 py-1.5 bg-secondary border border-border rounded text-foreground text-sm font-medium">
                  {col}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 px-4 py-6 bg-card border border-border rounded-lg"
        >
          <p className="text-foreground/90">{getSummaryText()}</p>
          <p className="text-muted-foreground text-sm mt-2">
            {t('dashboard.lottery.review.liveInfo')}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-foreground border border-border rounded-lg hover:bg-secondary/80 transition-all font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('dashboard.lottery.review.back')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-bold hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4" />
            {t('dashboard.lottery.review.start')}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
