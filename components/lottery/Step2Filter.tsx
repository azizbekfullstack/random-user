'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Filter } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';

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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga qaytish
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl">
            <Filter className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-5xl mb-2">Ustunlarni filterlash</h1>
            <p className="text-xl text-gray-600">
              Ko'rsatiladigan ustunlarni tanlang
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b-2 border-gray-100">
          <div>
            <h2 className="text-3xl mb-2">Mavjud ustunlar</h2>
            <p className="text-gray-500 text-lg">
              <span className="font-semibold text-blue-600">{selectedColumns.length}</span> /{' '}
              {columns.length} ustun tanlangan
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={selectAll}
              className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-semibold shadow-md"
            >
              Barchasini tanlash
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold shadow-md"
            >
              Tozalash
            </motion.button>
          </div>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {columns.map((column, index) => {
            const isSelected = selectedColumns.includes(column);
            return (
              <motion.button
                key={column}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleColumn(column)}
                className={`flex items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent shadow-xl scale-105'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <Eye className="w-6 h-6" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span className="truncate font-semibold text-left flex-1">{column}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Preview Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t-2 border-gray-100 pt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Ko'rikma jadval</h3>
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
              {participants.length} ishtirokchi
            </div>
          </div>

          {selectedColumns.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border-2 border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">#</th>
                    {selectedColumns.map((column) => (
                      <th key={column} className="px-6 py-4 text-left whitespace-nowrap font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.slice(0, 5).map((participant, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-500">{index + 1}</td>
                      {selectedColumns.map((column) => (
                        <td key={column} className="px-6 py-4 whitespace-nowrap">
                          {participant[column] || '-'}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <EyeOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                Kamida bitta ustunni tanlang
              </p>
            </div>
          )}

          {participants.length > 5 && selectedColumns.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-4 text-gray-500"
            >
              ... va yana <strong>{participants.length - 5}</strong> ishtirokchi
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </button>

        <button
          onClick={onNext}
          disabled={selectedColumns.length === 0}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg font-semibold"
        >
          Keyingisi
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
