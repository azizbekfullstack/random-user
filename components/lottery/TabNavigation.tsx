'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { BarChart3, Settings, ArrowRight } from 'lucide-react';

type TabType = 'results' | 'parameters' | 'next';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  participantCount?: number;
  winnerCount?: number;
  drawDuration?: number;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
  participantCount = 0,
  winnerCount = 0,
  drawDuration = 30,
}: TabNavigationProps) {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'results' as const,
      label: t('dashboard.results.inline'),
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'parameters' as const,
      label: t('dashboard.liveDraw.drawConfiguration'),
      icon: Settings,
      badge: `${participantCount} / ${winnerCount}`,
    },
    {
      id: 'next' as const,
      label: t('system.continue'),
      icon: ArrowRight,
      badge: null,
    },
  ];

  return (
    <div className="w-full bg-card border-b border-border">
      <div className="flex gap-1 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium relative overflow-hidden ${
                isActive
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/30'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    isActive
                      ? 'bg-accent-foreground/20 text-accent-foreground'
                      : 'bg-background/50'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-foreground"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
