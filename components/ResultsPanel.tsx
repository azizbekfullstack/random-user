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
        `${idx + 1}-o'rin`,
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
    a.download = `o_rinlar_${new Date().toISOString().split('T')[0]}.csv`;
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
      {/* Title */}
      <div className="pb-2 border-b border-border/30">
        <h3 className="text-sm font-bold text-foreground">G'oliblar</h3>
      </div>

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
                {index + 1}-o'rin
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
