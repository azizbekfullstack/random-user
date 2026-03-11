'use client';

import { useState } from 'react';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import { formatParticipantForDisplay, ColumnConfig } from '@/lib/data-masking';
import { Copy, Check, Download } from 'lucide-react';

interface ResultsPanelProps {
  winners: Participant[];
  columnConfigs: ColumnConfig[];
}

export default function ResultsPanel({ winners, columnConfigs }: ResultsPanelProps) {
  const { t } = useTranslation();
  const [showMasked, setShowMasked] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const visibleColumns = columnConfigs.filter((c) => c.displayMode !== 'hidden');

  const handleCopy = (winner: Participant, index: number) => {
    const text = visibleColumns
      .map((col) => {
        const value = winner[col.name] || '';
        return `${col.name}: ${value}`;
      })
      .join(' | ');

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportCSV = () => {
    if (winners.length === 0) return;

    // Header
    const header = ['Position', ...visibleColumns.map((c) => c.name)].join(',');

    // Rows
    const rows = winners.map((winner, idx) => {
      const values = [
        idx + 1,
        ...visibleColumns.map((col) => {
          const displayValue = formatParticipantForDisplay(
            { [col.name]: winner[col.name] },
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
    a.download = `winners_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (winners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('winnerSelection.results.noWinners')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowMasked(!showMasked)}
          className="text-xs px-2 py-1 rounded border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
        >
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
