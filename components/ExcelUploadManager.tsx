'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import { Upload, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

interface ExcelUploadManagerProps {
  onFileLoad: (participants: Participant[], columns: string[], selectedColumn?: string) => void;
}

export default function ExcelUploadManager({ onFileLoad }: ExcelUploadManagerProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
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
          const cols = Object.keys(jsonData[0]).filter((col) => col.trim() !== '');

          if (cols.length === 0) {
            throw new Error(t('winnerSelection.errors.selectColumns'));
          }

          // Convert to Participant type
          const parsedParticipants: Participant[] = jsonData.map((row, idx) => {
            const participant: Participant = { _id: `${idx}-${Date.now()}` };
            for (const col of cols) {
              participant[col] = row[col] ?? '';
            }
            return participant;
          });

          setFileName(file.name);
          setParticipants(parsedParticipants);
          setColumns(cols);
          setSelectedColumn(cols[0]); // Default to first column
          setShowPreview(true);
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

  const handleConfirmLoad = () => {
    if (participants.length > 0 && selectedColumn) {
      onFileLoad(participants, columns, selectedColumn);
      setShowPreview(false);
    }
  };

  const handleUploadNew = () => {
    setFileName(null);
    setParticipants([]);
    setColumns([]);
    setSelectedColumn(null);
    setShowPreview(false);
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-3">
      {!showPreview ? (
        <>
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
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-destructive font-semibold">Error</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* File Loaded Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs font-semibold text-green-700">{fileName}</p>
                <p className="text-xs text-green-600/80">
                  {participants.length} participants loaded
                </p>
              </div>
            </div>
            <button
              onClick={handleUploadNew}
              className="text-xs px-2 py-1 rounded border border-green-500/30 text-green-700 hover:bg-green-500/10 transition-colors"
            >
              Change
            </button>
          </div>

          {/* Column Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Ishtirokchi nomi ustuni
            </label>
            <div className="relative">
              <select
                value={selectedColumn || ''}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border border-border/50 bg-secondary text-foreground appearance-none cursor-pointer hover:border-accent/50 transition-colors focus:outline-none focus:border-accent"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Data Preview Table - Shows ALL participants with internal scrolling */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Ishtirokchilar ({participants.length})
            </p>
            <div className="h-80 overflow-y-auto rounded border border-border/30 bg-secondary/10">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary/40 border-b border-border/20">
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold text-muted-foreground">#</th>
                    {columns.map((col) => (
                      <th key={col} className="px-2 py-1 text-left font-semibold text-muted-foreground">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, idx) => (
                    <tr
                      key={participant._id}
                      className="border-b border-border/10 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-2 py-1 text-muted-foreground whitespace-nowrap">{idx + 1}</td>
                      {columns.map((col) => (
                        <td key={col} className="px-2 py-1 truncate text-foreground">
                          {participant[col] ? String(participant[col]).substring(0, 30) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-3 py-2 rounded-lg border border-border/50 text-muted-foreground font-semibold text-xs hover:text-foreground transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirmLoad}
              className="flex-1 px-3 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Confirm & Load
            </button>
          </div>
        </>
      )}
    </div>
  );
}

