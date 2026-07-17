import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const TEAM_COLORS = {
  'Chennai Super Kings': '#FDB913',
  'Delhi Capitals': '#0078BC',
  'Delhi Daredevils': '#0078BC',
  'Kings XI Punjab': '#ED1B24',
  'Punjab Kings': '#ED1B24',
  'Kolkata Knight Riders': '#3A225D',
  'Mumbai Indians': '#004BA0',
  'Rajasthan Royals': '#254AA5',
  'Royal Challengers Bangalore': '#EC1C24',
  'Royal Challengers Bengaluru': '#EC1C24',
  'Sunrisers Hyderabad': '#F77207',
  'Gujarat Lions': '#E15454',
  'Gujarat Titans': '#1C2C5C',
  'Rising Pune Supergiant': '#697E97',
  'Rising Pune Supergiants': '#697E97',
  'Lucknow Super Giants': '#A72056',
}

function teamShort(name) {
  if (!name) return 'TBD'
  const map = {
    'Chennai Super Kings': 'CSK',
    'Delhi Capitals': 'DC',
    'Delhi Daredevils': 'DD',
    'Kings XI Punjab': 'KXIP',
    'Punjab Kings': 'PBKS',
    'Kolkata Knight Riders': 'KKR',
    'Mumbai Indians': 'MI',
    'Rajasthan Royals': 'RR',
    'Royal Challengers Bangalore': 'RCB',
    'Royal Challengers Bengaluru': 'RCB',
    'Sunrisers Hyderabad': 'SRH',
    'Gujarat Lions': 'GL',
    'Gujarat Titans': 'GT',
    'Rising Pune Supergiant': 'RPS',
    'Rising Pune Supergiants': 'RPS',
    'Lucknow Super Giants': 'LSG',
  }
  return map[name] ?? name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase()
}

function teamMeta(name) {
  if (!name) return { name: 'Unknown', short: 'UNK', color: '#475569' }
  return {
    name,
    short: teamShort(name),
    color: TEAM_COLORS[name] ?? '#475569',
  }
}

function isValid(b) {
  const v = String(b.valid_ball).toLowerCase()
  return v === '1' || v === 'true'
}

function hasWicket(b) {
  const k = (b.wicket_kind || '').trim()
  return k && k.toLowerCase() !== 'na'
}

function aggPlayerStats(balls) {
  const batters = new Map()
  const bowlers = new Map()

  for (const b of balls) {
    const batter = b.batter
    const bowler = b.bowler
    if (batter) {
      if (!batters.has(batter)) batters.set(batter, { name: batter, runs: 0, balls: 0, fours: 0, sixes: 0 })
      const bt = batters.get(batter)
      if (isValid(b)) {
        bt.balls++
        bt.runs += Number(b.runs_batter) || 0
        if (Number(b.runs_batter) === 4) bt.fours++
        if (Number(b.runs_batter) === 6) bt.sixes++
      }
    }
    if (bowler && isValid(b)) {
      if (!bowlers.has(bowler)) bowlers.set(bowler, { name: bowler, runs: 0, balls: 0, wickets: 0 })
      const bw = bowlers.get(bowler)
      bw.balls++
      const conceded = Number(b.runs_bowler)
      bw.runs += Number.isFinite(conceded) ? conceded : Number(b.runs_total) || 0
      if (hasWicket(b) && b.bowler === bowler) bw.wickets++
    }
  }

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

  return { topBatters, topBowlers }
}

function aggInnings(balls) {
  let legalBalls = 0
  let runs = 0
  let dots = 0
  let fours = 0
  let sixes = 0
  let extras = 0
  let wickets = 0
  let wides = 0
  let noballs = 0
  let legbyes = 0
  let byes = 0
  let ppRuns = 0
  let ppBalls = 0
  let ppDots = 0
  let midRuns = 0
  let midBalls = 0
  let deathRuns = 0
  let deathBalls = 0
  let deathDots = 0

  for (const b of balls) {
    const total = Number(b.runs_total) || 0
    const batterRuns = Number(b.runs_batter) || 0
    const extra = Number(b.runs_extras) || 0
    const over = Number(b.over)
    const valid = isValid(b)

    if (hasWicket(b)) wickets++
    extras += extra

    const et = (b.extra_type || '').toLowerCase()
    if (et.includes('wide')) wides += extra
    else if (et.includes('noball')) noballs += extra
    else if (et.includes('legbye')) legbyes += extra
    else if (et.includes('bye')) byes += extra

    if (valid) {
      legalBalls++
      runs += total
      if (total === 0) dots++
      if (batterRuns === 4) fours++
      if (batterRuns === 6) sixes++

      if (over < 6) {
        ppRuns += total
        ppBalls++
        if (total === 0) ppDots++
      } else if (over >= 15) {
        deathRuns += total
        deathBalls++
        if (total === 0) deathDots++
      } else {
        midRuns += total
        midBalls++
      }
    }
  }

  const last = balls[balls.length - 1]
  const finalRuns = Number(last?.team_runs) || runs
  const finalWickets = Number(last?.team_wicket) ?? wickets
  const finalBalls = Number(last?.team_balls) || legalBalls
  const overs = finalBalls > 0 ? (finalBalls / 6).toFixed(1) : '0.0'
  const runRate = finalBalls > 0 ? ((finalRuns / finalBalls) * 6).toFixed(2) : '0.00'
  const boundaries = fours + sixes

  const phase = (r, bl, d) => ({
    runs: r,
    balls: bl,
    runRate: bl > 0 ? +((r / bl) * 6).toFixed(2) : 0,
    dotPct: bl > 0 ? Math.round((d / bl) * 100) : 0,
  })

  const players = aggPlayerStats(balls)

  return {
    battingTeam: balls[0].batting_team,
    bowlingTeam: balls[0].bowling_team,
    topBatters: players.topBatters,
    topBowlers: players.topBowlers,
    runs: finalRuns,
    wickets: finalWickets,
    balls: finalBalls,
    overs,
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
  }
}

function parseMargin(winOutcome) {
  if (!winOutcome || winOutcome === 'NA') return '—'
  return winOutcome
}

function formatScore(team) {
  const runs = Number(team?.runs)
  const wickets = Number(team?.wickets)
  if (!Number.isFinite(runs) || !Number.isFinite(wickets) || (runs === 0 && wickets === 0)) return ''
  return `${runs}/${wickets} (${team.overs} ov)`
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
    body: `${match.team1.name} scored ${match.team1.runs}/${match.team1.wickets} and ${match.team2.name} replied with ${match.team2.runs}/${match.team2.wickets}. ${match.playerOfMatch || 'The star'} was Player of the Match.`,
    stat: match.margin,
    sentiment: 'positive',
  })

  if (i1 && i2) {
    const higherDot = i1.dotBallPct > i2.dotBallPct ? i2.battingTeam : i1.battingTeam
    const higherDotPct = Math.max(i1.dotBallPct, i2.dotBallPct)
    insights.push({
      type: 'tip',
      title: 'Dot-ball pressure told a story',
      body: `${higherDot} faced ${higherDotPct}% dot balls — fewer scoring opportunities usually means a harder innings in T20 cricket.`,
      stat: `${higherDotPct}% dots`,
      sentiment: 'info',
    })

    const bestDeath = i1.death.runRate >= i2.death.runRate ? i1 : i2
    insights.push({
      type: 'warning',
      title: 'Death overs defined the tempo',
      body: `${bestDeath.battingTeam} scored at ${bestDeath.death.runRate} runs per over in overs 16–20, ${bestDeath.death.dotPct}% dots in that phase.`,
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
      body: `${match.tossWinner} won the toss, chose to ${match.tossDecision}, and won. Dataset average: toss winner wins ~${tossPct}% of IPL games.`,
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

  if (match.playerOfMatch) {
    moments.push({
      over: 'PoM',
      event: 'Milestone',
      player: match.playerOfMatch,
      detail: 'Player of the Match',
    })
  }

  return moments
}

console.log('Reading IPL.csv...')
const rows = parseCsv(readFileSync('src/IPL.csv', 'utf8'))
console.log(`Parsed ${rows.length} balls`)

const byMatch = new Map()
for (const row of rows) {
  const id = row.match_id
  if (!byMatch.has(id)) byMatch.set(id, [])
  byMatch.get(id).push(row)
}

const matches = []

for (const [matchId, balls] of byMatch) {
  const meta = balls[0]
  const inningsMap = new Map()
  for (const b of balls) {
    const inn = b.innings
    if (!inningsMap.has(inn)) inningsMap.set(inn, [])
    inningsMap.get(inn).push(b)
  }

  const inningsNums = [...inningsMap.keys()].sort((a, b) => Number(a) - Number(b))
  const innings = inningsNums.map((n) => ({
    innings: Number(n),
    ...aggInnings(inningsMap.get(n)),
  }))

  const teams = [...new Set(balls.map((b) => b.batting_team).filter(Boolean))]
  const t1Name = innings[0]?.battingTeam ?? teams[0] ?? 'Team 1'
  const t2Name = innings[1]?.battingTeam ?? teams.find((t) => t !== t1Name) ?? teams[1] ?? 'Team 2'

  const winner = meta.match_won_by
  const team1 = {
    ...teamMeta(t1Name),
    runs: innings[0]?.runs ?? 0,
    wickets: innings[0]?.wickets ?? 0,
    overs: innings[0]?.overs ?? '0.0',
    isWinner: winner === t1Name,
  }
  const team2 = {
    ...teamMeta(t2Name),
    runs: innings[1]?.runs ?? 0,
    wickets: innings[1]?.wickets ?? 0,
    overs: innings[1]?.overs ?? '0.0',
    isWinner: winner === t2Name,
  }

  const year = Number(meta.year)
  const matchStats = {
    totalRuns: innings.reduce((s, i) => s + i.runs, 0),
    totalWickets: innings.reduce((s, i) => s + i.wickets, 0),
    avgDotPct:
      innings.length > 0
        ? Math.round(innings.reduce((s, i) => s + i.dotBallPct, 0) / innings.length)
        : 0,
    avgBoundaryPct:
      innings.length > 0
        ? Math.round(innings.reduce((s, i) => s + i.boundaryPct, 0) / innings.length)
        : 0,
    totalFours: innings.reduce((s, i) => s + i.fours, 0),
    totalSixes: innings.reduce((s, i) => s + i.sixes, 0),
    totalExtras: innings.reduce((s, i) => s + i.extras, 0),
  }

  matches.push({
    id: String(matchId),
    matchId: String(matchId),
    date: meta.date,
    year,
    season: year,
    seasonLabel: meta.season,
    city: meta.city,
    venue: meta.venue,
    stage: meta.stage !== 'Unknown' ? meta.stage : null,
    team1,
    team2,
    innings,
    matchStats,
    winner,
    margin: parseMargin(meta.win_outcome),
    winOutcome: meta.win_outcome,
    tossWinner: meta.toss_winner,
    tossDecision: meta.toss_decision,
    playerOfMatch: meta.player_of_match !== 'NA' ? meta.player_of_match : '',
    result: meta.result_type !== 'NA' ? meta.result_type : 'normal',
    method: meta.method !== 'NA' ? meta.method : null,
    competition: `IPL ${year}`,
    status: 'Result',
    dlApplied: meta.method === 'D/L',
  })
}

matches.sort((a, b) => b.year - a.year || Number(b.id) - Number(a.id))

for (const m of matches) {
  m.insights = buildInsights(m, matches)
  m.keyMoments = buildKeyMoments(m)
}

const index = matches.map((m) => ({
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

mkdirSync('src/data/ipl-by-year', { recursive: true })

const byYear = new Map()
for (const m of matches) {
  if (!byYear.has(m.year)) byYear.set(m.year, [])
  byYear.get(m.year).push(m)
}

for (const [year, yearMatches] of byYear) {
  writeFileSync(`src/data/ipl-by-year/${year}.json`, JSON.stringify(yearMatches))
}

writeFileSync('src/data/ipl-index.json', JSON.stringify(index))

const sizeMb = (
  [...byYear.values()].reduce((s, arr) => s + Buffer.byteLength(JSON.stringify(arr)), 0) /
  1024 /
  1024
).toFixed(2)
console.log(`Wrote ${matches.length} matches (${sizeMb} MB) across ${byYear.size} year files`)
