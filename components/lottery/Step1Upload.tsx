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

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6"
          >
            <FileSpreadsheet className="w-10 h-10 text-accent-foreground" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t('dashboard.upload.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.upload.subtitle')}
          </p>
        </motion.div>

        {/* Upload Area */}
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
          className={`bg-card border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            isDragging
              ? 'border-accent bg-card scale-105 shadow-lg shadow-accent/20'
              : 'border-border hover:border-accent hover:shadow-lg hover:shadow-accent/10'
          }`}
        >
          <div className="text-center">
            <motion.div
              animate={{
                y: isDragging ? -8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-6"
            >
              <Upload className="w-12 h-12 text-accent" />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('upload.drag_file')}
            </h2>
            <p className="text-foreground/70 mb-8">
              {t('dashboard.upload.subtitle')}
            </p>

            <label className="inline-block mb-6">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.currentTarget.parentElement?.querySelector('input')?.click()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300"
              >
                <Upload className="w-5 h-5" />
                {t('upload.selectFile')}
              </motion.button>
            </label>

            <p className="text-sm text-muted-foreground">
              {t('dashboard.upload.formats')}
            </p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">{t('system.error')}</h3>
              <p className="text-destructive/80 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-card border border-border rounded-lg p-6 space-y-3"
        >
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
            {t('dashboard.upload.formats')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
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
              <span>Max 1M+ {t('upload.participant_count').toLowerCase()}</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
