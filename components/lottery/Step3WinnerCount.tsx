import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Trophy, Users, Minus, Plus } from 'lucide-react';

interface Step3WinnerCountProps {
  participantCount: number;
  winnerCount: number;
  onWinnerCountChange: (count: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3WinnerCount({
  participantCount,
  winnerCount,
  onWinnerCountChange,
  onNext,
  onBack,
}: Step3WinnerCountProps) {
  const presetCounts = [1, 3, 5, 10, 20];

  const increment = () => {
    if (winnerCount < participantCount) {
      onWinnerCountChange(winnerCount + 1);
    }
  };

  const decrement = () => {
    if (winnerCount > 1) {
      onWinnerCountChange(winnerCount - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl p-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-2xl"
          >
            <Trophy className="w-14 h-14 text-white" />
          </motion.div>
          <h1 className="text-5xl mb-4">G'oliblar soni</h1>
          <p className="text-xl text-gray-600">Nechta g'olib tanlansin?</p>
        </div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-6 mb-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={decrement}
              disabled={winnerCount <= 1}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-8 h-8" />
            </motion.button>

            <motion.div
              key={winnerCount}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl">
                <span className="text-7xl font-bold text-white">{winnerCount}</span>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-3xl bg-blue-400 -z-10"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={increment}
              disabled={winnerCount >= participantCount}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {presetCounts
              .filter((count) => count <= participantCount)
              .map((preset, index) => (
                <motion.button
                  key={preset}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onWinnerCountChange(preset)}
                  className={`px-8 py-4 rounded-xl transition-all duration-300 font-semibold text-lg ${
                    winnerCount === preset
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-110'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md'
                  }`}
                >
                  {preset}
                </motion.button>
              ))}
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 flex items-center gap-4 border-2 border-blue-100"
          >
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-lg mb-1">Jami ishtirokchilar</p>
              <p className="text-4xl font-bold text-gray-900">{participantCount}</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-gray-600 text-lg mb-1">G'oliblar foizi</p>
              <p className="text-4xl font-bold text-blue-600">
                {((winnerCount / participantCount) * 100).toFixed(1)}%
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-between items-center gap-4"
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
          >
            Keyingisi
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
