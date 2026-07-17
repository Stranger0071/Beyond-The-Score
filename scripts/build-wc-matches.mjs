import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

console.log('Reading files...')
const players = parseCsv(readFileSync('src/players.csv', 'utf8'))
const matchesWc = parseCsv(readFileSync('src/matches_wc.csv', 'utf8'))
const teams = parseCsv(readFileSync('src/teams.csv', 'utf8'))
const venues = parseCsv(readFileSync('src/venues.csv', 'utf8'))
const innings = parseCsv(readFileSync('src/innings.csv', 'utf8'))
const overs = parseCsv(readFileSync('src/overHistory.csv', 'utf8'))
const balls = parseCsv(readFileSync('src/overBallDetails.csv', 'utf8'))

console.log('Building helper maps...')
const playerNames = new Map(players.map(p => [p.id, p.fullName]))
const venueMap = new Map(venues.map(v => [v.id, v]))

const teamPlayers = new Map()
for (const p of players) {
  if (p.teamId) {
    if (!teamPlayers.has(p.teamId)) teamPlayers.set(p.teamId, [])
    teamPlayers.get(p.teamId).push(p)
  }
}

function getWcTeamColor(name) {
  const map = {
    'India': '#004BA0',
    'Australia': '#EAB308',
    'England': '#3B82F6',
    'Pakistan': '#15803D',
    'New Zealand': '#1E293B',
    'South Africa': '#047857',
    'Sri Lanka': '#1D4ED8',
    'Bangladesh': '#047857',
    'West Indies': '#7C2D12',
    'Afghanistan': '#1D4ED8',
    'Zimbabwe': '#DC2626',
    'Ireland': '#16A34A',
    'Netherlands': '#EA580C',
    'Scotland': '#2563EB',
    'UAE': '#059669',
    'United Arab Emirates': '#059669',
    'USA': '#1E3A8A',
    'United States of America': '#1E3A8A',
    'Nepal': '#BE123C',
    'Oman': '#DC2626',
    'Papua New Guinea': '#111827',
    'Kenya': '#059669',
    'Canada': '#DC2626',
    'Bermuda': '#DC2626',
    'Namibia': '#1E3A8A',
    'East Africa': '#059669',
    'Hong Kong': '#DC2626'
  }
  return map[name] ?? '#475569'
}

function getWcTeamShort(name) {
  const map = {
    'India': 'IND',
    'Australia': 'AUS',
    'England': 'ENG',
    'Pakistan': 'PAK',
    'New Zealand': 'NZ',
    'South Africa': 'SA',
    'Sri Lanka': 'SL',
    'Bangladesh': 'BAN',
    'West Indies': 'WI',
    'Afghanistan': 'AFG',
    'Zimbabwe': 'ZIM',
    'Ireland': 'IRE',
    'Netherlands': 'NED',
    'Scotland': 'SCO',
    'United Arab Emirates': 'UAE',
    'United States of America': 'USA',
    'Nepal': 'NEP',
    'Oman': 'OMA',
    'Papua New Guinea': 'PNG',
    'Kenya': 'KEN',
    'Canada': 'CAN',
    'Bermuda': 'BER',
    'Namibia': 'NAM',
    'East Africa': 'EAF',
    'Hong Kong': 'HK'
  }
  return map[name] ?? name.slice(0, 3).toUpperCase()
}

function getTeamMetaForWcTeam(wcTeamId) {
  if (!wcTeamId || wcTeamId === '0') {
    return { name: 'Unknown', short: 'UNK', color: '#475569' }
  }
  
  const directMatch = teams.find(t => t.id === wcTeamId)
  if (directMatch) {
    return {
      name: directMatch.fullName,
      short: getWcTeamShort(directMatch.fullName),
      color: getWcTeamColor(directMatch.fullName)
    }
  }

  const plList = teamPlayers.get(wcTeamId) || []
  if (!plList.length) {
    return { name: 'Unknown', short: 'UNK', color: '#475569' }
  }
  
  const plIds = new Set(plList.map(p => p.id))
  const matchedTeams = teams.filter(t => plIds.has(t.captainId) || plIds.has(t.wicketKeeperId))
  if (matchedTeams.length > 0) {
    const fullName = matchedTeams[0].fullName
    return {
      name: fullName,
      short: getWcTeamShort(fullName),
      color: getWcTeamColor(fullName)
    }
  }

  const nationalities = plList.map(p => p.nationality).filter(Boolean)
  if (nationalities.length > 0) {
    const counts = {}
    let maxNat = null
    let maxCount = 0
    for (const nat of nationalities) {
      counts[nat] = (counts[nat] || 0) + 1
      if (counts[nat] > maxCount) {
        maxCount = counts[nat]
        maxNat = nat
      }
    }
    
    const natMap = {
      'Australian': 'Australia',
      'Pakistani': 'Pakistan',
      'Indian': 'India',
      'English': 'England',
      'Sri Lankan': 'Sri Lanka',
      'New Zealander': 'New Zealand',
      'West Indian': 'West Indies',
      'South African': 'South Africa',
      'Zimbabwean': 'Zimbabwe',
      'Kenyan': 'Kenya',
      'Canadian': 'Canada',
      'Dutch': 'Netherlands',
      'Scottish': 'Scotland',
      'Irish': 'Ireland',
      'Afghan': 'Afghanistan',
      'UAE': 'United Arab Emirates',
      'United Arab Emirates': 'United Arab Emirates',
      'Bermudian': 'Bermuda',
      'Nepalese': 'Nepal',
      'Omani': 'Oman',
      'Namibian': 'Namibia',
      'USA': 'United States of America',
      'United States of America': 'United States of America',
      'Trinidadian': 'West Indies',
      'Barbados': 'West Indies',
      'Guyanan': 'West Indies'
    }
    const countryName = natMap[maxNat]
    if (countryName) {
      const matchByName = teams.find(t => t.fullName.toLowerCase() === countryName.toLowerCase())
      if (matchByName) {
        return {
          name: matchByName.fullName,
          short: getWcTeamShort(matchByName.fullName),
          color: getWcTeamColor(matchByName.fullName)
        }
      }
    }
  }
  
  return { name: 'Unknown', short: 'UNK', color: '#475569' }
}

const inningsByMatch = new Map()
for (const inn of innings) {
  if (!inningsByMatch.has(inn.matchId)) inningsByMatch.set(inn.matchId, [])
  inningsByMatch.get(inn.matchId).push(inn)
}

const oversByInning = new Map()
for (const ov of overs) {
  if (!oversByInning.has(ov.inningId)) oversByInning.set(ov.inningId, [])
  oversByInning.get(ov.inningId).push(ov)
}

const ballsByOver = new Map()
for (const b of balls) {
  if (!ballsByOver.has(b.overHistoryId)) ballsByOver.set(b.overHistoryId, [])
  ballsByOver.get(b.overHistoryId).push(b)
}

function parseScore(score) {
  if (score === '.' || score === 'W' || !score) {
    return { runs_batter: 0, runs_extras: 0, runs_total: 0 }
  }
  
  const hasWd = score.includes('Wd')
  const hasLb = score.includes('Lb')
  const hasB = score.includes('B')
  const hasNb = score.includes('Nb')
  
  const leadNum = parseInt(score) || 0
  
  if (hasWd || hasLb || hasB) {
    return { runs_batter: 0, runs_extras: leadNum, runs_total: leadNum }
  } else if (hasNb) {
    return { runs_batter: Math.max(0, leadNum - 1), runs_extras: 1, runs_total: leadNum }
  } else {
    const runs = parseInt(score) || 0
    return { runs_batter: runs, runs_extras: 0, runs_total: runs }
  }
}

function aggInnings(inn, overList, oversLimit) {
  let legalBalls = 0
  let runs = 0
  let dots = 0
  let fours = 0
  let sixes = 0
  let wickets = 0
  let extras = 0
  let wides = 0
  let noballs = 0
  let legbyes = 0
  let byes = 0
  
  let ppRuns = 0, ppBalls = 0, ppDots = 0
  let midRuns = 0, midBalls = 0
  let deathRuns = 0, deathBalls = 0, deathDots = 0
  
  const batters = new Map()
  const bowlers = new Map()
  
  // Sort overs by ovNo
  overList.sort((a, b) => Number(a.ovNo) - Number(b.ovNo))
  
  const ppLimit = oversLimit === 60 ? 12 : 10
  const deathStart = oversLimit === 60 ? 50 : 40
  
  for (const ov of overList) {
    const ovNoZeroBased = Number(ov.ovNo) - 1
    const oBalls = ballsByOver.get(ov.id) || []
    
    // Sort balls by countingBall and nonCountingBall
    oBalls.sort((a, b) => Number(a.countingBall) - Number(b.countingBall) || Number(a.nonCountingBall) - Number(b.nonCountingBall))
    
    for (const b of oBalls) {
      const isWicket = b.score.includes('W')
      const isBoundary = b.boundary === 'TRUE'
      const parsed = parseScore(b.score)
      const bTotal = parsed.runs_total
      const bBatter = parsed.runs_batter
      const bExtras = parsed.runs_extras
      
      const isWide = b.score.includes('Wd')
      const isNoBall = b.score.includes('Nb')
      const isLegBye = b.score.includes('Lb')
      const isBye = b.score.includes('B') && !isNoBall
      
      if (isWicket) wickets++
      extras += bExtras
      if (isWide) wides += bExtras
      else if (isNoBall) noballs += bExtras
      else if (isLegBye) legbyes += bExtras
      else if (isBye) byes += bExtras
      
      const countsAsLegal = !isWide && !isNoBall
      
      if (countsAsLegal) {
        legalBalls++
        runs += bTotal
        if (bTotal === 0) dots++
        if (bBatter === 4 || (isBoundary && bBatter === 4)) fours++
        if (bBatter === 6 || (isBoundary && bBatter === 6)) sixes++
        
        if (ovNoZeroBased < ppLimit) {
          ppRuns += bTotal
          ppBalls++
          if (bTotal === 0) ppDots++
        } else if (ovNoZeroBased >= deathStart) {
          deathRuns += bTotal
          deathBalls++
          if (bTotal === 0) deathDots++
        } else {
          midRuns += bTotal
          midBalls++
        }
      } else {
        // Extra balls (wides/no-balls) still contribute to runs and bowler runs
        runs += bTotal
        if (ovNoZeroBased < ppLimit) {
          ppRuns += bTotal
        } else if (ovNoZeroBased >= deathStart) {
          deathRuns += bTotal
        } else {
          midRuns += bTotal
        }
      }
      
      // Batter stats
      const batterName = playerNames.get(b.facingBatsmanId) || 'Unknown'
      if (batterName && batterName !== 'Unknown') {
        if (!batters.has(batterName)) {
          batters.set(batterName, { name: batterName, runs: 0, balls: 0, fours: 0, sixes: 0 })
        }
        const bt = batters.get(batterName)
        if (countsAsLegal) {
          bt.balls++
        }
        bt.runs += bBatter
        if (bBatter === 4) bt.fours++
        if (bBatter === 6) bt.sixes++
      }
      
      // Bowler stats
      const bowlerName = playerNames.get(b.bowlerId) || 'Unknown'
      if (bowlerName && bowlerName !== 'Unknown') {
        if (!bowlers.has(bowlerName)) {
          bowlers.set(bowlerName, { name: bowlerName, runs: 0, balls: 0, wickets: 0 })
        }
        const bw = bowlers.get(bowlerName)
        if (countsAsLegal) {
          bw.balls++
        }
        // Bowler concedes batter runs + wides + no balls
        const bowlerConceded = bBatter + (isWide ? bExtras : 0) + (isNoBall ? bExtras : 0)
        bw.runs += bowlerConceded
        if (isWicket && b.score !== '1WdW' && b.score !== '2WdW' && !b.score.includes('RunOut')) {
          bw.wickets++
        }
      }
    }
  }
  
  const finalRuns = Number(inn.runs) || runs
  const finalWickets = Number(inn.wkts) || wickets
  const finalOvers = inn.overProgress || '0.0'
  const finalBalls = legalBalls
  const runRate = legalBalls > 0 ? ((finalRuns / legalBalls) * 6).toFixed(2) : '0.00'
  const boundaries = fours + sixes
  
  const phase = (r, bl, d) => ({
    runs: r,
    balls: bl,
    runRate: bl > 0 ? +((r / bl) * 6).toFixed(2) : 0,
    dotPct: bl > 0 ? Math.round((d / bl) * 100) : 0,
  })
  
  const topBatters = [...batters.values()]
    .map((b) => ({
      ...b,
      strikeRate: b.balls > 0 ? Math.round((b.runs / b.balls) * 100) : 0,
    }))
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 6)

  const topBowlers = [...bowlers.values()]
    .map((b) => ({
      ...b,
      economy: b.balls > 0 ? +((b.runs / b.balls) * 6).toFixed(2) : 0,
    }))
    .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy)
    .slice(0, 6)
    
  return {
    runs: finalRuns,
    wickets: finalWickets,
    balls: finalBalls,
    overs: finalOvers,
    runRate: +runRate,
    dotBalls: dots,
    dotBallPct: legalBalls > 0 ? Math.round((dots / legalBalls) * 100) : 0,
    fours,
    sixes,
    boundaries,
    boundaryPct: legalBalls > 0 ? Math.round((boundaries / legalBalls) * 100) : 0,
    extras,
    wides,
    noballs,
    legbyes,
    byes,
    powerplay: phase(ppRuns, ppBalls, ppDots),
    middle: phase(midRuns, midBalls, 0),
    death: phase(deathRuns, deathBalls, deathDots),
    topBatters,
    topBowlers
  }
}

function buildInsights(match, allMatches) {
  const inn = match.innings
  const insights = []
  const winner = match.winner
  const i1 = inn[0]
  const i2 = inn[1]

  insights.push({
    type: 'highlight',
    title: `${winner} won this contest`,
    body: `${match.team1.name} scored ${match.team1.runs}/${match.team1.wickets} and ${match.team2.name} replied with ${match.team2.runs}/${match.team2.wickets}.`,
    stat: match.margin,
    sentiment: 'positive',
  })

  if (i1 && i2) {
    const higherDot = i1.dotBallPct > i2.dotBallPct ? i2.battingTeam : i1.battingTeam
    const higherDotPct = Math.max(i1.dotBallPct, i2.dotBallPct)
    insights.push({
      type: 'tip',
      title: 'Dot-ball pressure told a story',
      body: `${higherDot} faced ${higherDotPct}% dot balls — fewer scoring opportunities pressure the batting side in ODI cricket.`,
      stat: `${higherDotPct}% dots`,
      sentiment: 'info',
    })

    const bestDeath = i1.death.runRate >= i2.death.runRate ? i1 : i2
    insights.push({
      type: 'warning',
      title: 'Death overs defined the tempo',
      body: `${bestDeath.battingTeam} scored at ${bestDeath.death.runRate} runs per over in the death overs, with ${bestDeath.death.dotPct}% dots in that phase.`,
      stat: `${bestDeath.death.runRate} RR`,
      sentiment: 'neutral',
    })
  }

  const tossWins = allMatches.filter((m) => m.tossWinner === m.winner).length
  const tossPct = Math.round((tossWins / allMatches.length) * 100)
  if (match.tossWinner === match.winner) {
    insights.push({
      type: 'tip',
      title: 'Toss winner took the match',
      body: `${match.tossWinner} won the toss, chose to ${match.tossDecision}, and won. Dataset average: toss winner wins ~${tossPct}% of games.`,
      stat: 'Toss → Win',
      sentiment: 'info',
    })
  }

  return insights.slice(0, 4)
}

function buildKeyMoments(match) {
  const moments = [
    {
      over: 'Toss',
      event: 'Toss',
      player: match.tossWinner,
      detail: `Chose to ${match.tossDecision}`,
    },
  ]

  for (const inn of match.innings) {
    moments.push({
      over: `Inn ${inn.innings}`,
      event: 'Innings',
      player: inn.battingTeam,
      detail: `${inn.runs}/${inn.wickets} (${inn.overs} ov) · RR ${inn.runRate} · ${inn.dotBallPct}% dots`,
    })
  }

  moments.push({
    over: 'Result',
    event: 'Win',
    player: match.winner,
    detail: match.margin,
  })

  return moments
}

function formatScore(team) {
  const runs = Number(team?.runs)
  const wickets = Number(team?.wickets)
  if (!Number.isFinite(runs) || !Number.isFinite(wickets) || (runs === 0 && wickets === 0)) return ''
  return `${runs}/${wickets} (${team.overs} ov)`
}

function parseWcMargin(statusText, winner, outcome) {
  if (!statusText) return outcome === 'N' ? 'No Result' : 'No Margin'
  const escapedWinner = winner.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return statusText
    .replace(new RegExp(`^${escapedWinner}\\s+(?:won|win)\\s+by\\s+`, 'i'), '')
    .replace(/^.+\s+(?:won|win)\s+by\s+/i, '')
    .replace(/^(?:won|win)\s+by\s+/i, '')
    .trim()
}

console.log('Building WC matches JSON...')
const wcMatches = []

for (const m of matchesWc) {
  const v = venueMap.get(m.venueId)
  const venueFullName = v ? `${v.fullName}, ${v.city}` : 'Unknown Venue'
  
  const team1 = getTeamMetaForWcTeam(m.team1Id)
  const team2 = getTeamMetaForWcTeam(m.team2Id)
  
  const mInnings = inningsByMatch.get(m.id) || []
  
  const inningsData = []
  for (const inn of mInnings) {
    const innNum = Number(inn.inningsNumber)
    const overList = oversByInning.get(inn.id) || []
    const agg = aggInnings(inn, overList, Number(m.oversLimit) || 50)
    
    inningsData.push({
      innings: innNum,
      battingTeam: innNum === 1 ? team1.name : team2.name,
      bowlingTeam: innNum === 1 ? team2.name : team1.name,
      ...agg
    })
  }
  
  // Sort innings by innings number
  inningsData.sort((a, b) => a.innings - b.innings)
  
  const winner = m.matchStatus_outcome === 'A' ? team1.name : (m.matchStatus_outcome === 'B' ? team2.name : 'No Result')
  const margin = parseWcMargin(m.matchStatus_text, winner, m.matchStatus_outcome)
  
  const team1Resolved = {
    ...team1,
    runs: inningsData[0]?.runs ?? 0,
    wickets: inningsData[0]?.wickets ?? 0,
    overs: inningsData[0]?.overs ?? '0.0',
    isWinner: winner === team1.name
  }
  
  const team2Resolved = {
    ...team2,
    runs: inningsData[1]?.runs ?? 0,
    wickets: inningsData[1]?.wickets ?? 0,
    overs: inningsData[1]?.overs ?? '0.0',
    isWinner: winner === team2.name
  }
  
  const year = Number(m.tournamentLabel.match(/\d{4}/)?.[0]) || 1975
  
  const matchStats = {
    totalRuns: inningsData.reduce((s, i) => s + i.runs, 0),
    totalWickets: inningsData.reduce((s, i) => s + i.wickets, 0),
    avgDotPct: inningsData.length > 0 ? Math.round(inningsData.reduce((s, i) => s + i.dotBallPct, 0) / inningsData.length) : 0,
    avgBoundaryPct: inningsData.length > 0 ? Math.round(inningsData.reduce((s, i) => s + i.boundaryPct, 0) / inningsData.length) : 0,
    totalFours: inningsData.reduce((s, i) => s + i.fours, 0),
    totalSixes: inningsData.reduce((s, i) => s + i.sixes, 0),
    totalExtras: inningsData.reduce((s, i) => s + i.extras, 0)
  }
  
  const tossDecision = m['toss.elected']?.toLowerCase().includes('field') ? 'field' : 'bat'
  
  wcMatches.push({
    id: String(m.id),
    matchId: String(m.id),
    date: m.matchDate,
    year,
    season: year,
    seasonLabel: m.tournamentLabel,
    city: v ? v.city : 'Unknown City',
    venue: venueFullName,
    stage: m.description || null,
    team1: team1Resolved,
    team2: team2Resolved,
    innings: inningsData,
    matchStats,
    winner,
    margin,
    winOutcome: margin,
    tossWinner: m['toss.winner'] || 'Unknown',
    tossDecision,
    playerOfMatch: 'TBD',
    result: m.matchStatus_outcome === 'N' ? 'no result' : 'normal',
    method: null,
    competition: m.tournamentLabel,
    status: 'Result',
    dlApplied: false
  })
}

wcMatches.sort((a, b) => b.year - a.year || Number(b.id) - Number(a.id))

for (const m of wcMatches) {
  m.insights = buildInsights(m, wcMatches)
  m.keyMoments = buildKeyMoments(m)
}

const index = wcMatches.map((m) => ({
  id: m.id,
  date: m.date,
  year: m.year,
  team1: m.team1.short,
  team2: m.team2.short,
  team1Name: m.team1.name,
  team2Name: m.team2.name,
  winner: m.winner,
  tossWinner: m.tossWinner,
  venue: m.venue,
  winOutcome: m.winOutcome,
  tossDecision: m.tossDecision,
  team1Score: formatScore(m.team1),
  team2Score: formatScore(m.team2),
}))

mkdirSync('src/data/wc-by-year', { recursive: true })

const byYear = new Map()
for (const m of wcMatches) {
  if (!byYear.has(m.year)) byYear.set(m.year, [])
  byYear.get(m.year).push(m)
}

for (const [year, yearMatches] of byYear) {
  writeFileSync(`src/data/wc-by-year/${year}.json`, JSON.stringify(yearMatches))
}

writeFileSync('src/data/wc-index.json', JSON.stringify(index))

const sizeMb = (
  [...byYear.values()].reduce((s, arr) => s + Buffer.byteLength(JSON.stringify(arr)), 0) /
  1024 /
  1024
).toFixed(2)
console.log(`Wrote ${wcMatches.length} WC matches (${sizeMb} MB) across ${byYear.size} year files`)
