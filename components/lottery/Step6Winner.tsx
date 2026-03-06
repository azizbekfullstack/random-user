'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, RotateCcw, Download, Share2 } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';

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
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; color: string; delay: number; offsetX: number; duration: number }>
  >([]);
  const [fireworks, setFireworks] = useState<
    Array<{ id: number; left: number; top: number }>
  >([]);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWindowHeight(typeof window !== 'undefined' ? window.innerHeight : 1000);
    
    const confettiArray = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32', '#9370DB'][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 1,
      offsetX: Math.random() * 300 - 150,
      duration: 4 + Math.random() * 2,
    }));
    setConfetti(confettiArray);

    const fireworksArray = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    setFireworks(fireworksArray);
  }, []);

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

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏆';
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-4 h-4 rounded-full"
          style={{
            backgroundColor: item.color,
            left: `${item.x}%`,
            top: -20,
          }}
          animate={{
            y: windowHeight + 50,
            rotate: 360 * 5,
            x: [0, item.offsetX, item.offsetX * 0.7],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Fireworks effect */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworks.map((item) => (
          <motion.div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: item.id * 0.3,
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-2xl border-4 border-white">
                <Trophy className="w-20 h-20 text-white" />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-yellow-300 -z-10"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-8xl font-bold text-white mb-6 drop-shadow-2xl"
          >
            🎉 TABRIKLAYMIZ! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl text-white/95 font-semibold"
          >
            G'oliblar aniqlandi!
          </motion.p>
        </motion.div>

        {/* Winners Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-10 mb-10"
        >
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-gray-200">
            <h2 className="text-4xl font-bold flex items-center gap-4">
              <Sparkles className="w-10 h-10 text-yellow-500" />
              G'oliblar ro'yxati
            </h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg font-semibold"
              >
                <Download className="w-5 h-5" />
                CSV yuklash
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg font-semibold"
              >
                <Share2 className="w-5 h-5" />
                Ulashish
              </motion.button>
            </div>
          </div>

          {/* Winners List */}
          <div className="space-y-6">
            {winners.map((winner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.15, type: 'spring' }}
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
                    transition={{ delay: 0.7 + index * 0.15, type: 'spring' }}
                    className="flex-shrink-0"
                  >
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white">
                      <span className="text-6xl">{getMedalEmoji(index)}</span>
                    </div>
                  </motion.div>

                  {/* Winner Info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="inline-block px-4 py-2 bg-white rounded-lg shadow-md font-bold text-lg text-gray-700">
                        {index + 1}-o'rin
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {selectedColumns.map((column) => (
                        <div key={column} className="bg-white/50 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1 font-semibold">
                            {column}
                          </p>
                          <p className="text-xl font-bold text-gray-900 truncate">
                            {winner[column] || '-'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="flex items-center gap-4 px-12 py-6 bg-white text-orange-600 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-2xl font-bold"
          >
            <RotateCcw className="w-8 h-8" />
            Yangi loterеya boshlash
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl"
          >
            <p className="text-gray-700 text-center text-lg">
              ✨ Jami <strong className="text-blue-600">{winners.length}</strong> ta g'olib tanlandi
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
