import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, RotateCcw, Download, Share2 } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';
import { Confetti } from './Confetti';

interface Step6WinnerProps {
  winners: Participant[];
  selectedColumns: string[];
  onRestart: () => void;
}

export default function Step6Winner({
  winners,
  selectedColumns,
  onRestart,
}: Step6WinnerProps) {
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConfettiActive(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getMedalEmoji = (index: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || '🎖️';
  };

  const handleExport = () => {
    const data = winners.map((winner, index) => ({
      "O'rin": index + 1,
      ...winner,
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goliblar-${new Date().toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const text = winners
      .map((winner, index) => `${index + 1}-o'rin: ${winner[selectedColumns[0]] || 'N/A'}`)
      .join('\n');

    if (navigator.share) {
      navigator.share({
        title: 'Loteriya Natijalari',
        text: text,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Confetti active={confettiActive} />

      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-8 shadow-2xl"
          >
            <Trophy className="w-24 h-24 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-bold text-white mb-4 drop-shadow-2xl"
          >
            Yakuni Natijalar
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl text-blue-200"
          >
            Jami {winners.length} ta g'olib tanlandi
          </motion.p>
        </motion.div>

        {/* Winners List */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="space-y-6">
            {winners.map((winner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.12, type: 'spring' }}
                className={`rounded-3xl p-8 border-4 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-purple-300'
                }`}
              >
                <div className="flex items-center gap-8">
                  {/* Medal */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + index * 0.12, type: 'spring' }}
                    className="flex-shrink-0"
                  >
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white">
                      <span className="text-6xl">{getMedalEmoji(index)}</span>
                    </div>
                  </motion.div>

                  {/* Winner Info */}
                  <div className="flex-1">
                    <div className="mb-6">
                      <span className="inline-block px-6 py-3 bg-white rounded-lg shadow-md font-bold text-2xl text-gray-700">
                        {index + 1}-o'rin
                      </span>
                    </div>

                    {/* Winner Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedColumns.map((column) => (
                        <motion.div
                          key={column}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.12 }}
                          className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40"
                        >
                          <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                            {column}
                          </p>
                          <p className="text-lg font-bold text-gray-900 truncate">
                            {winner[column] || 'N/A'}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-6 flex-wrap max-w-4xl mx-auto mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest"
          >
            <Download className="w-6 h-6" />
            CSV Eksport
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest"
          >
            <Share2 className="w-6 h-6" />
            Ulashish
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest"
          >
            <RotateCcw className="w-6 h-6" />
            Qayta Boshlash
          </motion.button>
        </motion.div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-500/90 backdrop-blur-sm rounded-full shadow-xl border-2 border-white/30">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="w-4 h-4 bg-white rounded-full"
            />
            <span className="text-white text-xl font-bold uppercase tracking-wider">
              LIVE ЕФИР
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
