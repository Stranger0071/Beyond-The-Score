/**
 * errorUtils.js - Graceful error formatting and safe API response handling
 *
 * Prevents raw JavaScript exceptions, JSON parse errors (e.g., "Unexpected token 'T'"),
 * HTML error snippets, and low-level network errors from being exposed to end users.
 */

/**
 * Normalizes any error object or error string into a clean, human-readable user message.
 *
 * @param {Error|string|unknown} err - The caught error or error message
 * @param {string} [fallback] - Optional custom fallback message
 * @returns {string} User-friendly error message
 */
export function formatErrorMessage(err, fallback = 'An unexpected error occurred. Please try again.') {
  if (!err) return fallback

  const rawMessage = typeof err === 'string' ? err : err.message || String(err)

  // Rate limit / Quota exceeded
  if (/quota|exhausted|429|rate limit|too many requests/i.test(rawMessage)) {
    return 'Gemini API Quota Limit Reached! Auto-retrying when the countdown completes.'
  }

  // Raw JSON parse or HTML response errors (e.g., Unexpected token 'T', "The page c"... is not valid JSON)
  if (
    /unexpected token|is not valid json|syntaxerror|<!doctype|<html|the page/i.test(rawMessage)
  ) {
    return 'Narration backend server is offline or unreachable. Please ensure the server is running (start with `npm run dev` or `npm run server`).'
  }

  // Network / Connection errors
  if (/failed to fetch|networkerror|load failed|fetch failed|econnrefused/i.test(rawMessage)) {
    return 'Network connection issue. Unable to connect to the narration server (ensure `npm run dev` is running).'
  }

  // Return the error message if it's already a clean user-facing string, otherwise use fallback
  if (rawMessage && !/TypeError|ReferenceError|EvalError|InternalError/i.test(rawMessage)) {
    return rawMessage
  }

  return fallback
}

/**
 * Safely parses response JSON body without throwing raw SyntaxError on HTML or invalid responses.
 *
 * @param {Response} response - Fetch API Response object
 * @returns {Promise<{ ok: boolean, status: number, data: any, rawText: string }>}
 */
export async function safeFetchJson(response) {
  const status = response.status
  let data = null
  let rawText = ''

  try {
    rawText = await response.text()
    if (rawText) {
      data = JSON.parse(rawText)
    }
  } catch {
    // Body was not valid JSON (e.g. HTML 404 / 500 error page from server or proxy)
    data = null
  }

  return {
    ok: response.ok,
    status,
    data,
    rawText,
  }
}
