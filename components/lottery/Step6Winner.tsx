'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Download, RotateCcw } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';

interface Step6WinnerProps {
  winners: Participant[];
  selectedColumns: string[];
  onRestart: () => void;
}

export default function Step6Winner({
  winners,
  selectedColumns,
  onRestart,
}: Step6WinnerProps) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    a.download = `winners-${new Date().toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500/20 border-yellow-500';
    if (index === 1) return 'bg-gray-500/20 border-gray-500';
    if (index === 2) return 'bg-orange-500/20 border-orange-500';
    return 'bg-accent/20 border-accent';
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏆';
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">{t('system.loading')}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col px-4 py-8 bg-background overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent mb-3"
          >
            <Trophy className="w-7 h-7 text-accent-foreground" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('dashboard.animation.victoryMessage')}
          </h1>

          <p className="text-sm text-muted-foreground">
            {t('result.title')} - {winners.length} {t('dashboard.lottery.review.winners')}
          </p>
        </motion.div>

        {/* Winners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4"
        >
          {winners.map((winner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              className={`bg-card border-2 rounded-lg p-4 ${getMedalColor(index)}`}
            >
              {/* Medal Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-lg">{getMedalIcon(index)}</span>
                  </div>
                  <span className="font-bold text-foreground text-sm">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Winner Info */}
              <div className="space-y-2">
                {selectedColumns.slice(0, 2).map((column) => (
                  <div key={column}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      {column}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {winner[column]?.toString().substring(0, 30) || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-2 justify-center mt-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            <Download className="w-4 h-4" />
            {t('result.export')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-foreground border border-border rounded-lg font-semibold text-sm hover:bg-secondary/80 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            {t('result.restart')}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-2"
        >
          {winners.length} {t('dashboard.lottery.review.winners')} - {selectedColumns.length} {t('dashboard.lottery.review.columns')}
        </motion.div>
      </div>
    </div>
  );
}
