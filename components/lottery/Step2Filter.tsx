'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Filter, Check } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';

interface Step2FilterProps {
  participants: Participant[];
  columns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Filter({
  participants,
  columns,
  selectedColumns,
  onColumnsChange,
  onNext,
  onBack,
}: Step2FilterProps) {
  const { t } = useTranslation();

  const toggleColumn = (column: string) => {
    const newSelected = selectedColumns.includes(column)
      ? selectedColumns.filter((c) => c !== column)
      : [...selectedColumns, column];
    onColumnsChange(newSelected);
  };

  const selectAll = () => {
    onColumnsChange(columns);
  };

  const clearAll = () => {
    onColumnsChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      onNext();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-4 py-8 bg-background overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Filter className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('dashboard.dedup.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.dedup.selectColumn')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('dashboard.table.showing')}</p>
              <p className="text-xl font-bold text-accent">
                {selectedColumns.length} / {columns.length}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={selectAll}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                {t('system.start')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className="px-4 py-2 bg-secondary text-foreground border border-border rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-all"
              >
                {t('system.cancel')}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Columns Grid - Compact Checkboxes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-4 mb-4"
        >
          <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            {t('dashboard.lottery.review.columns')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {columns.map((column, index) => {
              const isSelected = selectedColumns.includes(column);
              return (
                <motion.button
                  key={column}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleColumn(column)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                    isSelected
                      ? 'bg-accent/10 border-accent text-foreground'
                      : 'bg-secondary border-border text-foreground/70 hover:border-accent/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-accent border-accent' : 'border-border'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-accent-foreground" />}
                  </div>
                  <span className="truncate">{column}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Preview Table - Compact */}
        {selectedColumns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-4 mb-4 flex flex-col"
          >
            <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {t('dashboard.table.title')}
            </p>
            <div className="overflow-x-auto max-h-64 overflow-y-auto border border-border/50 rounded">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary">
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 text-left text-muted-foreground font-semibold">#</th>
                    {selectedColumns.map((col) => (
                      <th key={col} className="px-2 py-2 text-left text-muted-foreground font-semibold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.slice(0, 10).map((participant, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="px-2 py-2 text-muted-foreground">{idx + 1}</td>
                      {selectedColumns.map((col) => (
                        <td key={col} className="px-2 py-2 text-foreground truncate">
                          {participant[col]?.toString().substring(0, 20) || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {participants.length > 10 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {t('dashboard.table.showing')} 10 {t('system.of')} {participants.length}
              </p>
            )}
          </motion.div>
        )}

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
            disabled={selectedColumns.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-bold hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('system.continue')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
