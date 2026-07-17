import iplIndex from './ipl-index.json'
import wcIndex from './wc-index.json'

let activeTournament = typeof localStorage !== 'undefined' ? localStorage.getItem('bts_tournament') || 'ipl' : 'ipl';
const yearCache = new Map()

export function setTournament(type) {
  if (type !== 'ipl' && type !== 'wc') return
  activeTournament = type
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('bts_tournament', type)
  }
}

export function getTournament() {
  return activeTournament
}

export function getActiveIndex() {
  return activeTournament === 'ipl' ? iplIndex : wcIndex
}

function matchTime(match) {
  const parsed = Date.parse(match.date)
  return Number.isNaN(parsed) ? 0 : parsed
}

function sortMatchesByDateDesc(a, b) {
  return matchTime(b) - matchTime(a) || Number(b.id) - Number(a.id)
}

function uniqueMatches(matches) {
  const seen = new Set()
  return matches.filter((match) => {
    if (seen.has(match.id)) return false
    seen.add(match.id)
    return true
  })
}

// Export mutable arrays so external modules keep the same reference
export let allMatches = []
export let seasons = []

export function switchTournament(type) {
  setTournament(type)
  const idx = getActiveIndex()
  const sorted = uniqueMatches([...idx]).sort(sortMatchesByDateDesc)
  
  // Update in place
  allMatches.length = 0
  allMatches.push(...sorted)
  
  const sList = [...new Set(sorted.map((m) => m.year))].sort((a, b) => b - a)
  seasons.length = 0
  seasons.push(...sList)
}

// Initialize on load
switchTournament(activeTournament)

export function getMatches(seasonFilter = 'all') {
  if (seasonFilter === 'all') return allMatches
  return allMatches.filter((m) => m.year === Number(seasonFilter))
}

export async function loadMatchFull(id, year) {
  const t = getTournament()
  const cacheKey = `${t}_${year}`
  if (!yearCache.has(cacheKey)) {
    let data
    if (t === 'ipl') {
      data = await import(`./ipl-by-year/${year}.json`)
    } else {
      data = await import(`./wc-by-year/${year}.json`)
    }
    yearCache.set(cacheKey, data.default)
  }
  return yearCache.get(cacheKey).find((m) => m.id === String(id)) ?? null
}

export function getDatasetStats() {
  const total = allMatches.length
  const tossWins = allMatches.filter((m) => m.tossWinner === m.winner).length
  
  return {
    total,
    tossWinPct: total > 0 ? Math.round((tossWins / total) * 100) : 0,
    runWinPct: 0,
    chaseWinPct: 0,
    seasons: seasons.length,
    yearRange: seasons.length > 0 ? `${Math.min(...seasons)}–${Math.max(...seasons)}` : '—',
    totalBalls: null,
  }
}

export async function enrichDatasetStats() {
  const t = getTournament()
  let totalBalls = 0
  let runWins = 0
  let chaseWins = 0
  
  for (const year of seasons) {
    let data
    if (t === 'ipl') {
      data = await import(`./ipl-by-year/${year}.json`)
    } else {
      data = await import(`./wc-by-year/${year}.json`)
    }
    for (const m of data.default) {
      totalBalls += m.innings.reduce((s, inn) => s + inn.balls, 0)
      if (/runs/i.test(m.winOutcome || '')) runWins++
      if (/wicket/i.test(m.winOutcome || '')) chaseWins++
    }
  }
  return {
    totalBalls,
    runWinPct: allMatches.length > 0 ? Math.round((runWins / allMatches.length) * 100) : 0,
    chaseWinPct: allMatches.length > 0 ? Math.round((chaseWins / allMatches.length) * 100) : 0
  }
}
