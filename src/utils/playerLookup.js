/** Normalize names for fuzzy matching (initials vs full names). */
export function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function findPlayerByName(registryByName, query) {
  if (!query) return null
  const exact = registryByName.get(query)
  if (exact) return exact

  const norm = normalizeName(query)
  for (const [key, player] of registryByName) {
    if (normalizeName(key) === norm) return player
  }

  const last = norm.split(' ').pop()
  for (const [key, player] of registryByName) {
    const keyNorm = normalizeName(key)
    if (keyNorm.endsWith(` ${last}`) || keyNorm === last) return player
  }

  return null
}

export function excelDateToDisplay(serial) {
  if (!serial || Number.isNaN(Number(serial))) return null
  const utc = (Number(serial) - 25569) * 86400 * 1000
  const d = new Date(utc)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getAgeFromExcelDate(serial) {
  if (!serial) return null
  const utc = (Number(serial) - 25569) * 86400 * 1000
  const dob = new Date(utc)
  if (Number.isNaN(dob.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export function formatBattingHand(hand) {
  return hand ? hand.replace(/_/g, ' ') : '—'
}
