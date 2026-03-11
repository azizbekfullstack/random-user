'use client';

import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';

interface Step1UploadProps {
  onNext: (participants: Participant[], columns: string[]) => void;
}

export default function Step1Upload({ onNext }: Step1UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError(t('dashboard.upload.formats'));
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          setError(t('dashboard.table.noData'));
          return;
        }

        const columns = Object.keys(json[0] as any);
        onNext(json as Participant[], columns);
      } catch (err) {
        setError(t('system.error'));
      }
    };

    reader.onerror = () => {
      setError(t('system.error'));
    };

    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.parentElement?.querySelector('button')?.click();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-3"
          >
            <FileSpreadsheet className="w-8 h-8 text-accent-foreground" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('dashboard.upload.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.upload.subtitle')}
          </p>
        </motion.div>

        {/* Upload Area - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`bg-card border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
            isDragging
              ? 'border-accent bg-card scale-105 shadow-lg shadow-accent/20'
              : 'border-border hover:border-accent hover:shadow-lg hover:shadow-accent/10'
          }`}
        >
          <div className="text-center">
            <motion.div
              animate={{
                y: isDragging ? -4 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4"
            >
              <Upload className="w-8 h-8 text-accent" />
            </motion.div>

            <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">
              {t('upload.drag_file')}
            </h2>
            <p className="text-sm text-foreground/70 mb-4">
              {t('dashboard.upload.subtitle')}
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                onKeyDown={handleKeyDown}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.currentTarget.parentElement?.querySelector('input')?.click()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 text-sm"
              >
                <Upload className="w-4 h-4" />
                {t('upload.selectFile')}
              </motion.button>
            </label>

            <p className="text-xs text-muted-foreground mt-3">
              {t('dashboard.upload.formats')}
            </p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive rounded-lg p-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive text-sm mb-0.5">{t('system.error')}</h3>
              <p className="text-destructive/80 text-xs">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Info Box - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-4 space-y-2"
        >
          <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide">
            {t('dashboard.upload.formats')}
          </h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold flex-shrink-0 mt-0.5">✓</span>
              <span>{t('upload.participant_count')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold flex-shrink-0 mt-0.5">✓</span>
              <span>.xlsx, .xls, .csv</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold flex-shrink-0 mt-0.5">✓</span>
              <span>Max 1M+</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
