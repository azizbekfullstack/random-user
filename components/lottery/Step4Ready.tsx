import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Users, Trophy, Play, CheckCircle2 } from 'lucide-react';

interface Step4ReadyProps {
  participantCount: number;
  winnerCount: number;
  selectedColumns: string[];
  onStart: () => void;
  onBack: () => void;
}

export default function Step4Ready({
  participantCount,
  winnerCount,
  selectedColumns,
  onStart,
  onBack,
}: Step4ReadyProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
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
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-2xl p-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-8 relative shadow-2xl"
          >
            <Sparkles className="w-16 h-16 text-white" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full bg-green-400"
            />
          </motion.div>
          <h1 className="text-6xl mb-4">Tayyormisiz?</h1>
          <p className="text-2xl text-gray-600">
            G'olibni aniqlash uchun barcha ma'lumotlarni tekshiring
          </p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center border-2 border-blue-200 shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 mb-6 shadow-xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-600 mb-2 text-lg">Ishtirokchilar</p>
            <p className="text-5xl font-bold text-blue-600">{participantCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center border-2 border-purple-200 shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500 mb-6 shadow-xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-600 mb-2 text-lg">G'oliblar</p>
            <p className="text-5xl font-bold text-purple-600">{winnerCount}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 text-center border-2 border-amber-200 shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500 mb-6 shadow-xl">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-600 mb-2 text-lg">Ustunlar</p>
            <p className="text-5xl font-bold text-amber-600">{selectedColumns.length}</p>
          </div>
        </motion.div>

        {/* Selected Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-12 border-2 border-gray-200"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
            Tanlangan ustunlar:
          </h3>
          <div className="flex flex-wrap gap-3">
            {selectedColumns.map((column, index) => (
              <motion.span
                key={column}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="px-6 py-3 bg-white rounded-xl text-gray-700 shadow-md border-2 border-gray-200 font-semibold text-lg"
              >
                {column}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-10"
        >
          <p className="text-center text-blue-900 text-xl">
            <strong>{participantCount}</strong> ishtirokchi orasidan{' '}
            <strong className="text-purple-600">{winnerCount}</strong> ta g'olib tanlanadi
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="flex-1 max-w-md py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-4 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <Play className="w-8 h-8 relative z-10" />
            <span className="relative z-10 font-bold">BOSHLASH!</span>
          </motion.button>
        </motion.div>

        {/* Live Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-lg">
            ⚡ Loterеya jarayoni live rejimda boshlanadi
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
