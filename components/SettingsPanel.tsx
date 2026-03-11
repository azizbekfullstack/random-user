'use client';

import { ColumnConfig, MaskType } from '@/lib/data-masking';
import { useTranslation } from '@/lib/i18n';
import { Eye, EyeOff, EyeOff as Hidden } from 'lucide-react';

interface SettingsPanelProps {
  columnConfigs: ColumnConfig[];
  onConfigChange: (configs: ColumnConfig[]) => void;
}

export default function SettingsPanel({ columnConfigs, onConfigChange }: SettingsPanelProps) {
  const { t } = useTranslation();

  const handleDisplayModeChange = (columnName: string, mode: 'display' | 'masked' | 'hidden') => {
    const updated = columnConfigs.map((config) =>
      config.name === columnName ? { ...config, displayMode: mode } : config
    );
    onConfigChange(updated);
  };

  const handleMaskTypeChange = (columnName: string, maskType: MaskType) => {
    const updated = columnConfigs.map((config) =>
      config.name === columnName ? { ...config, maskType } : config
    );
    onConfigChange(updated);
  };

  return (
    <div className="space-y-3 max-h-72 overflow-y-auto">
      {columnConfigs.map((config) => (
        <div key={config.name} className="p-3 rounded-lg border border-border/50 bg-secondary/30">
          {/* Column Name */}
          <div className="mb-2">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">
              {config.name}
            </p>
          </div>

          {/* Display Mode Buttons */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => handleDisplayModeChange(config.name, 'display')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                config.displayMode === 'display'
                  ? 'bg-accent text-accent-foreground'
                  : 'border border-border/50 text-muted-foreground hover:border-border'
              }`}
              title={t('winnerSelection.tooltips.displayMode')}
            >
              <Eye className="w-3 h-3" />
              {t('winnerSelection.settings.displayLabel')}
            </button>

            <button
              onClick={() => handleDisplayModeChange(config.name, 'masked')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                config.displayMode === 'masked'
                  ? 'bg-accent text-accent-foreground'
                  : 'border border-border/50 text-muted-foreground hover:border-border'
              }`}
              title={t('winnerSelection.tooltips.masking')}
            >
              <EyeOff className="w-3 h-3" />
              {t('winnerSelection.settings.maskedLabel')}
            </button>

            <button
              onClick={() => handleDisplayModeChange(config.name, 'hidden')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                config.displayMode === 'hidden'
                  ? 'bg-destructive/20 text-destructive'
                  : 'border border-border/50 text-muted-foreground hover:border-border'
              }`}
              title={t('winnerSelection.tooltips.hidden')}
            >
              <Hidden className="w-3 h-3" />
              {t('winnerSelection.settings.hiddenLabel')}
            </button>
          </div>

          {/* Mask Type Selector (only for masked mode) */}
          {config.displayMode === 'masked' && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                {t('winnerSelection.settings.maskType')}:
              </label>
              <select
                value={config.maskType || 'custom'}
                onChange={(e) => handleMaskTypeChange(config.name, e.target.value as MaskType)}
                className="text-xs px-2 py-1 rounded border border-border/50 bg-background text-foreground"
              >
                <option value="phone">Phone</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          )}
        </div>
      ))}

      {/* Preview Note */}
      <div className="p-3 rounded-lg border border-border/30 bg-secondary/20">
        <p className="text-xs text-muted-foreground text-center">
          {t('winnerSelection.settings.preview')}
        </p>
      </div>
    </div>
  );
}
