'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                      : isCurrent
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-110'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : stepNumber}
                </motion.div>
                <span
                  className={`mt-2 text-sm text-center max-w-[100px] ${
                    isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 mb-8">
                  <div className="h-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
