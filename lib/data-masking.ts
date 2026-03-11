// Data masking utilities for privacy protection
// Supports different masking strategies for sensitive data fields

export type MaskType = 'phone' | 'email' | 'name' | 'default';

export interface MaskConfig {
  [columnName: string]: MaskType;
}

/**
 * Masks a phone number (shows last 4 digits)
 * Example: +998 91 123 45 67 -> +998 91 *** ** 67
 */
export function maskPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '***';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '***';
  const last4 = cleaned.slice(-4);
  return `*** *** ${last4}`;
}

/**
 * Masks an email address (shows domain only)
 * Example: john.doe@example.com -> ***@example.com
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return '***@***.***';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***.***';
  return `***@${parts[1]}`;
}

/**
 * Masks a name (shows first letter and last letter)
 * Example: John Doe -> J*** D***
 */
export function maskName(name: string): string {
  if (!name || typeof name !== 'string') return '***';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(part.length - 1);
    })
    .join(' ');
}

/**
 * Generic default masking (shows partial data)
 * Example: 123456789 -> 1234****
 */
export function maskDefault(value: string): string {
  if (!value || typeof value !== 'string') return '***';
  if (value.length <= 4) return '*'.repeat(value.length);
  const showChars = Math.ceil(value.length / 2);
  return value.substring(0, showChars) + '*'.repeat(value.length - showChars);
}

/**
 * Apply masking to a value based on mask type
 */
export function applyMask(value: any, maskType: MaskType): string {
  const stringValue = String(value || '');

  switch (maskType) {
    case 'phone':
      return maskPhone(stringValue);
    case 'email':
      return maskEmail(stringValue);
    case 'name':
      return maskName(stringValue);
    case 'default':
    default:
      return maskDefault(stringValue);
  }
}

/**
 * Mask participant data based on configuration
 */
export function maskParticipant(
  participant: Record<string, any>,
  maskConfig: MaskConfig
): Record<string, any> {
  const masked: Record<string, any> = {};

  for (const [key, value] of Object.entries(participant)) {
    const maskType = maskConfig[key] || 'default';
    masked[key] = applyMask(value, maskType as MaskType);
  }

  return masked;
}

/**
 * Detect common field types and suggest masking strategy
 */
export function detectMaskType(columnName: string): MaskType {
  const lowerName = columnName.toLowerCase();

  if (
    lowerName.includes('phone') ||
    lowerName.includes('tel') ||
    lowerName.includes('mobile')
  ) {
    return 'phone';
  }

  if (lowerName.includes('email') || lowerName.includes('mail')) {
    return 'email';
  }

  if (
    lowerName.includes('name') ||
    lowerName.includes('surname') ||
    lowerName.includes('firstname') ||
    lowerName.includes('lastname')
  ) {
    return 'name';
  }

  return 'default';
}

/**
 * Generate mask configuration automatically from columns
 */
export function generateMaskConfig(columns: string[]): MaskConfig {
  const config: MaskConfig = {};

  for (const column of columns) {
    config[column] = detectMaskType(column);
  }

  return config;
}
