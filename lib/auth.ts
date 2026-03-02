import bcrypt from "bcryptjs"

/**
 * Generate today's access code: admin + DDMMYYYY
 */
export function generateAccessCode(): string {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, "0")
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const yyyy = String(now.getFullYear())
  return `admin${dd}${mm}${yyyy}`
}

/**
 * Validate a user-entered access code against today's code
 */
export function validateAccessCode(input: string): boolean {
  return input.trim().toLowerCase() === generateAccessCode().toLowerCase()
}

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateOTP(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const otp = (array[0] % 900000) + 100000
  return String(otp)
}

/**
 * Hash an OTP using bcryptjs
 */
export async function hashOTP(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(otp, salt)
}

/**
 * Verify an OTP against its hash
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash)
}
