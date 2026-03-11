'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { Participant } from '@/lib/lottery-types';
import { maskParticipant, generateMaskConfig } from '@/lib/data-masking';
import { Copy, Eye, EyeOff } from 'lucide-react';

interface ResultsInlineProps {
  winners: Participant[];
  selectedColumns: string[];
  onExport?: () => void;
}

export default function ResultsInline({
  winners,
  selectedColumns,
  onExport,
}: ResultsInlineProps) {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showMasked, setShowMasked] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const maskConfig = generateMaskConfig(selectedColumns);

  const handleCopy = (winner: Participant, index: number) => {
    const text = selectedColumns
      .map((col) => `${col}: ${winner[col]}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getMaskedDisplay = (winner: Participant) => {
    const masked = maskParticipant(winner, maskConfig);
    return selectedColumns
      .slice(0, 2)
      .map((col) => masked[col])
      .join(' • ');
  };

  const getFullDisplay = (winner: Participant) => {
    return selectedColumns
      .slice(0, 2)
      .map((col) => winner[col])
      .join(' • ');
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {t('dashboard.results.inline')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {winners.length} {t('dashboard.lottery.review.winners')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMasked(!showMasked)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            {showMasked ? (
              <>
                <Eye className="w-4 h-4" />
                {t('dashboard.results.masked')}
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                {t('dashboard.results.fullData')}
              </>
            )}
          </motion.button>

          {onExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="inline-flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:shadow-lg transition-all"
            >
              <Copy className="w-4 h-4" />
              {t('result.export')}
            </motion.button>
          )}
        </div>
      </div>

      {/* Winners Grid - Horizontal Scrollable */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-min">
          {winners.map((winner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              {/* Winner Card */}
              <div className="bg-card border-2 border-border rounded-lg p-4 min-w-max hover:border-accent transition-all cursor-pointer">
                {/* Medal Badge */}
                <div className="text-sm font-bold text-accent mb-2">
                  #{index + 1}
                </div>

                {/* Main Display */}
                <div className="text-sm font-medium text-foreground mb-3 min-h-12">
                  {showMasked ? getMaskedDisplay(winner) : getFullDisplay(winner)}
                </div>

                {/* Metadata */}
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{selectedColumns.length} {t('dashboard.lottery.review.columns')}</span>
                </div>

                {/* Copy Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(winner, index)}
                  className="absolute top-2 right-2 p-1.5 bg-secondary rounded hover:bg-accent hover:text-accent-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copiedIndex === index ? (
                    <span className="text-xs font-medium">✓</span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </motion.button>
              </div>

              {/* Tooltip on Hover */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
                  >
                    <div className="bg-foreground text-background rounded-lg p-3 shadow-lg max-w-xs">
                      <div className="space-y-2">
                        {selectedColumns.map((col) => (
                          <div key={col} className="text-xs">
                            <div className="font-semibold opacity-75">{col}</div>
                            <div className="font-mono text-xs break-all">
                              {showMasked
                                ? maskParticipant(winner, maskConfig)[col]
                                : winner[col]?.toString().substring(0, 40) || '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details View - Click Card to Expand */}
      <motion.div
        className="bg-card border border-border rounded-lg p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h4 className="text-sm font-semibold text-foreground mb-3">
          {t('dashboard.results.viewDetails')}
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          {winners.map((winner, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-secondary rounded">
              <span className="font-bold text-accent">#{index + 1}</span>
              <div className="flex-1">
                {selectedColumns.map((col, colIdx) => (
                  <span key={col}>
                    {showMasked
                      ? maskParticipant(winner, maskConfig)[col]
                      : winner[col]?.toString().substring(0, 30) || '-'}
                    {colIdx < selectedColumns.length - 1 && ' • '}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy(winner, index)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                {copiedIndex === index ? (
                  <span className="text-xs font-medium">✓</span>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
