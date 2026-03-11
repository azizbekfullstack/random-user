'use client';

export type MaskType = 'phone' | 'name' | 'email' | 'custom' | 'display';

export interface ColumnConfig {
  name: string;
  displayMode: 'display' | 'masked' | 'hidden';
  maskType?: MaskType;
}

/**
 * Phone masking: +998 93 873 ** **
 * Shows: country code (998) + area code (2 digits) + exchange (3 digits) + hide last 4
 */
function maskPhone(value: string): string {
  if (!value) return '';
  // Remove spaces and special chars temporarily
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length < 8) return value;
  // Format: +998 93 873 ** **
  const countryCode = cleaned.slice(0, 3);
  const areaCode = cleaned.slice(3, 5);
  const exchange = cleaned.slice(5, 8);
  return `+${countryCode} ${areaCode} ${exchange} ** **`;
}

/**
 * Name masking: Az****** (first 2 chars + asterisks)
 */
function maskName(value: string): string {
  if (!value || value.length < 3) return value;
  const firstTwo = value.slice(0, 2);
  const asterisks = '*'.repeat(Math.max(4, value.length - 2));
  return firstTwo + asterisks;
}

/**
 * Email masking: u***@example.com (first char + asterisks + domain)
 */
function maskEmail(value: string): string {
  if (!value || !value.includes('@')) return value;
  const [localPart, domain] = value.split('@');
  if (localPart.length < 1) return value;
  const firstChar = localPart[0];
  const asterisks = '*'.repeat(Math.max(3, localPart.length - 1));
  return `${firstChar}${asterisks}@${domain}`;
}

/**
 * Generic masking fallback: show first char + asterisks
 */
function maskCustom(value: string): string {
  if (!value || value.length < 2) return value;
  const firstChar = value[0];
  const asterisks = '*'.repeat(Math.max(3, value.length - 1));
  return firstChar + asterisks;
}

/**
 * Apply masking based on type
 */
export function maskValue(value: string | number, maskType: MaskType): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value).trim();

  switch (maskType) {
    case 'phone':
      return maskPhone(stringValue);
    case 'name':
      return maskName(stringValue);
    case 'email':
      return maskEmail(stringValue);
    case 'custom':
      return maskCustom(stringValue);
    case 'display':
    default:
      return stringValue;
  }
}

/**
 * Format participant data for display based on column config
 */
export function formatParticipantForDisplay(
  participant: Record<string, any>,
  columnConfigs: ColumnConfig[],
  showMasked: boolean = true
): Record<string, string> {
  const formatted: Record<string, string> = {};

  for (const config of columnConfigs) {
    const value = participant[config.name];

    if (config.displayMode === 'hidden') {
      continue; // Skip hidden columns
    }

    if (config.displayMode === 'masked' && showMasked) {
      // Apply masking
      formatted[config.name] = maskValue(value, config.maskType || 'custom');
    } else {
      // Show full value
      formatted[config.name] = value !== null && value !== undefined ? String(value) : '';
    }
  }

  return formatted;
}

/**
 * Get all visible column names
 */
export function getVisibleColumns(columnConfigs: ColumnConfig[]): string[] {
  return columnConfigs
    .filter((c) => c.displayMode !== 'hidden')
    .map((c) => c.name);
}

/**
 * Detect mask type from column name
 */
export function detectMaskType(columnName: string): MaskType {
  const lower = columnName.toLowerCase();
  if (lower.includes('phone') || lower.includes('tel') || lower.includes('mobile')) {
    return 'phone';
  }
  if (lower.includes('name') || lower.includes('participant') || lower.includes('person')) {
    return 'name';
  }
  if (lower.includes('email') || lower.includes('mail') || lower.includes('@')) {
    return 'email';
  }
  return 'custom';
}

/**
 * Auto-configure columns with smart detection
 */
export function autoConfigureColumns(columnNames: string[]): ColumnConfig[] {
  return columnNames.map((name) => ({
    name,
    displayMode: 'display' as const,
    maskType: detectMaskType(name),
  }));
}

