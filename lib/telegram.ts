const CHANNEL_ID = "-1003365018216"

/**
 * Send OTP code to the designated Telegram channel via Bot API
 * Client-side direct call (as per user preference)
 */
export async function sendOTPToChannel(
  botToken: string,
  otp: string
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  const message = [
    "--- Winner Selection System ---",
    "",
    `OTP Code: ${otp}`,
    "",
    `Generated: ${new Date().toLocaleString()}`,
    "This code expires on page refresh.",
    "-------------------------------",
  ].join("\n")

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const data = await response.json()
    return data.ok === true
  } catch {
    return false
  }
}
