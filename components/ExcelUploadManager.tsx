'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface ExcelUploadManagerProps {
  onFileLoad: (participants: Participant[], columns: string[]) => void;
}

export default function ExcelUploadManager({ onFileLoad }: ExcelUploadManagerProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseExcelFile = (file: File) => {
    try {
      setLoading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            throw new Error(t('winnerSelection.errors.noFile'));
          }

          // Parse Excel/CSV file
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];

          if (!sheetName) {
            throw new Error(t('winnerSelection.errors.emptyFile'));
          }

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

          if (jsonData.length === 0) {
            throw new Error(t('winnerSelection.errors.noParticipants'));
          }

          // Extract columns from first row
          const columns = Object.keys(jsonData[0]).filter((col) => col.trim() !== '');

          if (columns.length === 0) {
            throw new Error(t('winnerSelection.errors.selectColumns'));
          }

          // Convert to Participant type (handle any column names)
          const participants: Participant[] = jsonData.map((row, idx) => {
            const participant: Participant = { _id: `${idx}-${Date.now()}` };
            for (const col of columns) {
              participant[col] = row[col] ?? '';
            }
            return participant;
          });

          setFileName(file.name);
          setRowCount(participants.length);
          onFileLoad(participants, columns);

          setLoading(false);
        } catch (err: any) {
          setError(err.message || t('winnerSelection.errors.parseError'));
          setLoading(false);
        }
      };

      reader.readAsBinaryString(file);
    } catch (err: any) {
      setError(err.message || t('winnerSelection.errors.parseError'));
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ];

      if (!validTypes.includes(file.type)) {
        setError(t('winnerSelection.errors.invalidFormat'));
        return;
      }

      parseExcelFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect({
        target: { files: e.dataTransfer.files },
      } as any);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative border-2 border-dashed border-accent/30 rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors bg-secondary/20 hover:bg-secondary/30"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
        />

        {loading ? (
          <div className="space-y-2">
            <div className="animate-pulse">
              <Upload className="w-8 h-8 mx-auto text-accent/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('winnerSelection.upload.loading')}
            </p>
          </div>
        ) : fileName && rowCount > 0 ? (
          <div className="space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {fileName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {rowCount} {t('winnerSelection.upload.button').toLowerCase()} loaded
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-accent/50" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t('winnerSelection.upload.button')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('winnerSelection.upload.dragDrop')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('winnerSelection.upload.formats')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-destructive font-semibold">Error</p>
            <p className="text-xs text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
