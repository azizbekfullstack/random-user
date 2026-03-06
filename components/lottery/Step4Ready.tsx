import { motion } from 'framer-motion';
import { ArrowLeft, Users, Trophy, CheckCircle2, Play } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();

  const getSummaryText = () => {
    const template = t('lottery.review.summary');
    return template
      .replace('{participants}', `${participantCount}`)
      .replace('{winners}', `${winnerCount}`);
  };

  return (
    <div className="w-full flex flex-col bg-black/90">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6"
          >
            <h2 className="text-2xl font-bold text-center text-white">
              {t('lottery.review.title')}
            </h2>
          </motion.div>

          {/* Stats Grid - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2 mb-4"
          >
            {/* Participants */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
              <Users className="w-4 h-4 text-blue-300 mx-auto mb-1" />
              <p className="text-gray-300 text-xs text-center">{t('lottery.review.participants')}</p>
              <p className="text-2xl font-bold text-white text-center">{participantCount}</p>
            </motion.div>

            {/* Winners */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
              <Trophy className="w-4 h-4 text-purple-300 mx-auto mb-1" />
              <p className="text-gray-300 text-xs text-center">{t('lottery.review.winners')}</p>
              <p className="text-2xl font-bold text-white text-center">{winnerCount}</p>
            </motion.div>

            {/* Columns */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
              <p className="text-gray-300 text-xs text-center">{t('lottery.review.columns')}</p>
              <p className="text-2xl font-bold text-white text-center">{selectedColumns.length}</p>
            </motion.div>
          </motion.div>

          {/* Columns List - Compact */}
          {selectedColumns.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3 mb-3"
            >
              <p className="text-gray-300 text-xs mb-2">{t('lottery.review.selectedColumns')}</p>
              <div className="flex flex-wrap gap-1">
                {selectedColumns.map((col) => (
                  <span key={col} className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-white text-xs">
                    {col}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-4"
          >
            <p className="text-gray-200 text-sm">{getSummaryText()}</p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2 justify-center"
          >
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('lottery.review.back')}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="inline-flex items-center gap-1 px-6 py-2 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-bold text-sm"
            >
              <Play className="w-3.5 h-3.5" />
              {t('lottery.review.start')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
