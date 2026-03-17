'use client';

import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Participant } from '@/lib/lottery-types';

interface Step1UploadProps {
  onNext: (participants: Participant[], columns: string[]) => void;
}

export default function Step1Upload({ onNext }: Step1UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Faqat Excel fayllari (.xlsx, .xls) qabul qilinadi');
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
          setError('Excel fayl bo\'sh. Iltimos, ma\'lumot kiriting.');
          return;
        }

        const columns = Object.keys(json[0] as any);
        onNext(json as Participant[], columns);
      } catch (err) {
        setError('Faylni o\'qishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      }
    };

    reader.onerror = () => {
      setError('Faylni yuklashda xatolik yuz berdi.');
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl"
        >
          <FileSpreadsheet className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-5xl mb-4">Ishtirokchilar ro'yxati</h1>
        <p className="text-xl text-gray-600">
          Excel faylni yuklash orqali ishtirokchilarni tizimga kiriting
        </p>
      </div>

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
        className={`bg-white rounded-3xl shadow-2xl p-12 border-4 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105 shadow-3xl'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="text-center">
          <motion.div
            animate={{
              y: isDragging ? -10 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6"
          >
            <Upload className="w-14 h-14 text-blue-600" />
          </motion.div>

          <h2 className="text-3xl mb-3">Excel faylni yuklang</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Faylni bu yerga sudrab olib keling yoki quyidagi tugmani bosing
          </p>

          <label className="inline-block mb-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-2xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Upload className="w-6 h-6" />
              Fayl tanlash
            </motion.span>
          </label>

          <p className="text-sm text-gray-400">
            Qo'llab-quvvatlanadi: .xlsx, .xls formatlar
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Xatolik</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 text-gray-800 text-lg">📋 Excel fayl talablari:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Birinchi qator ustun nomlari bo'lishi kerak</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Har bir qatorda ishtirokchi ma'lumotlari</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Kamida bitta ishtirokchi bo'lishi shart</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Format: .xlsx yoki .xls</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4"
      >
        <p className="text-blue-800 text-center">
          <strong>Misol:</strong> Ism, Familiya, Email, Telefon ustunlari bo'lishi mumkin
        </p>
      </motion.div>
    </div>
  );
}
