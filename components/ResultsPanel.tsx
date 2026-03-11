'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import { formatParticipantForDisplay, ColumnConfig } from '@/lib/data-masking';
import { Copy, Check, Download, Medal } from 'lucide-react';

interface ResultsPanelProps {
  positions: Participant[];
  columnConfigs: ColumnConfig[];
}

const getMedalColor = (index: number): string => {
  switch (index) {
    case 0:
      return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30'; // Gold
    case 1:
      return 'from-slate-400/20 to-slate-500/10 border-slate-400/30'; // Silver
    case 2:
      return 'from-orange-600/20 to-orange-700/10 border-orange-600/30'; // Bronze
    default:
      return 'from-accent/10 to-accent/5 border-accent/20';
  }
};

const getMedalEmoji = (index: number): string => {
  switch (index) {
    case 0:
      return '🥇';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return '⭐';
  }
};

export default function ResultsPanel({ positions, columnConfigs }: ResultsPanelProps) {
  const { t } = useTranslation();
  const [showMasked, setShowMasked] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const visibleColumns = columnConfigs.filter((c) => c.displayMode !== 'hidden');

  const handleCopy = (position: Participant, index: number) => {
    const text = visibleColumns
      .map((col) => {
        const value = position[col.name] || '';
        return `${col.name}: ${value}`;
      })
      .join(' | ');

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportCSV = () => {
    if (positions.length === 0) return;

    // Header
    const header = ['Position', ...visibleColumns.map((c) => c.name)].join(',');

    // Rows
    const rows = positions.map((position, idx) => {
      const values = [
        `#${idx + 1}`,
        ...visibleColumns.map((col) => {
          const displayValue = formatParticipantForDisplay(
            { [col.name]: position[col.name] },
            [col],
            showMasked
          )[col.name];
          return `"${displayValue}"`;
        }),
      ];
      return values.join(',');
    });

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `positions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (positions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">
          {t('winnerSelection.results.noWinners')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowMasked(!showMasked)}
          className="text-xs px-3 py-1.5 rounded border border-accent/30 text-accent hover:bg-accent/10 transition-colors font-medium"
        >
          {showMasked ? t('winnerSelection.results.showFull') : t('winnerSelection.results.showMasked')}
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
      </div>

      {/* Position Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {positions.map((position, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
              type: 'spring',
              stiffness: 200,
            }}
            className={`relative overflow-hidden rounded-lg border bg-gradient-to-br ${getMedalColor(index)} p-4 hover:shadow-lg transition-all duration-300 group`}
          >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
            </div>

            {/* Medal badge */}
            <div className="absolute top-2 right-2 text-2xl">{getMedalEmoji(index)}</div>

            {/* Position number and label */}
            <div className="mb-3 pr-8">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t('winnerSelection.results.position')} #{index + 1}
              </p>
            </div>

            {/* Position data */}
            <div className="space-y-2.5 mb-3">
              {visibleColumns.slice(0, 2).map((col) => {
                const displayValue = formatParticipantForDisplay(
                  { [col.name]: position[col.name] },
                  [col],
                  showMasked
                )[col.name];

                return (
                  <div key={col.name}>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {col.name}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {displayValue || '—'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action button */}
            <button
              onClick={() => handleCopy(position, index)}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
            >
              {copiedIndex === index ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {t('winnerSelection.results.copied')}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {t('winnerSelection.results.copy')}
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

          {showMasked ? t('winnerSelection.results.showFull') : t('winnerSelection.results.showMasked')}
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
        >
          <Download className="w-3 h-3" />
          {t('winnerSelection.results.exportBtn')}
        </button>
      </div>

      {/* Winners List */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {winners.map((winner, index) => {
          const formatted = formatParticipantForDisplay(winner, columnConfigs, showMasked);

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              {/* Position Badge */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Winner Data */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {visibleColumns.slice(0, 2).map((col) => (
                    <div key={col.name}>
                      <p className="text-muted-foreground uppercase text-[10px] tracking-wide">
                        {col.name}
                      </p>
                      <p className="text-foreground font-semibold truncate">
                        {formatted[col.name]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(winner, index)}
                className="flex-shrink-0 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                title={t('winnerSelection.results.copy')}
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-center pt-2 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          {t('winnerSelection.results.winner')}: <span className="text-accent font-bold">{winners.length}</span>
        </p>
      </div>
    </div>
  );
}
