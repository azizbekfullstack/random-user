/**
 * Masking utilities for sensitive data
 */

export interface MaskingConfig {
  phone: boolean;
  fio: boolean;
  id: boolean;
}

export const DEFAULT_MASKING_CONFIG: MaskingConfig = {
  phone: true,
  fio: false,
  id: false,
};

/**
 * Masks a phone number showing only first 2 characters
 * Example: +998912345678 -> +9**********
 */
export function maskPhone(phone: string | undefined): string {
  if (!phone) return '';
  if (phone.length <= 2) return phone;
  const visible = phone.substring(0, 2);
  const masked = '*'.repeat(phone.length - 2);
  return `${visible}${masked}`;
}

/**
 * Masks a name/FIO showing only first 2 characters
 * Example: John Doe -> Jo*****
 */
export function maskFio(fio: string | undefined): string {
  if (!fio) return '';
  if (fio.length <= 2) return fio;
  const visible = fio.substring(0, 2);
  const masked = '*'.repeat(fio.length - 2);
  return `${visible}${masked}`;
}

/**
 * Masks an ID showing only first 4 characters
 * Example: 12345678 -> 1234****
 */
export function maskId(id: string | undefined): string {
  if (!id) return '';
  if (id.length <= 4) return id;
  const visible = id.substring(0, 4);
  const masked = '*'.repeat(id.length - 4);
  return `${visible}${masked}`;
}

/**
 * Applies masking to a participant object based on configuration
 */
export function applyMasking<T extends Record<string, any>>(
  participant: T,
  config: MaskingConfig,
  phoneField: string = 'phone',
  fioField: string = 'fio',
  idField: string = 'id'
): T {
  const masked = { ...participant };

  if (config.phone && phoneField in masked) {
    masked[phoneField] = maskPhone(masked[phoneField]);
  }
  if (config.fio && fioField in masked) {
    masked[fioField] = maskFio(masked[fioField]);
  }
  if (config.id && idField in masked) {
    masked[idField] = maskId(masked[idField]);
  }

  return masked;
}

/**
 * Applies masking to an array of participants
 */
export function applyMaskingToList<T extends Record<string, any>>(
  participants: T[],
  config: MaskingConfig,
  phoneField: string = 'phone',
  fioField: string = 'fio',
  idField: string = 'id'
): T[] {
  return participants.map((p) =>
    applyMasking(p, config, phoneField, fioField, idField)
  );
}
