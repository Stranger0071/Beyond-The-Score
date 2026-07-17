import { getTeamMeta } from './teamMeta'

function marginText(row) {
  const runs = Number(row.win_by_runs) || 0
  const wickets = Number(row.win_by_wickets) || 0
  if (runs > 0) return `${runs} runs`
  if (wickets > 0) return `${wickets} wickets`
  if (row.result === 'tie') return 'Super Over'
  return '—'
}

function venueWinRate(team, venue, allRows) {
  const atVenue = allRows.filter((r) => r.venue === venue)
  if (atVenue.length === 0) return null
  const wins = atVenue.filter((r) => r.winner === team).length
  return Math.round((wins / atVenue.length) * 100)
}

function tossWinRate(allRows) {
  const withToss = allRows.filter((r) => r.toss_winner && r.winner)
  if (withToss.length === 0) return 0
  const tossWins = withToss.filter((r) => r.toss_winner === r.winner).length
  return Math.round((tossWins / withToss.length) * 100)
}

function teamSeasonRecord(team, season, allRows) {
  const seasonRows = allRows.filter(
    (r) => String(r.season) === String(season) && (r.team1 === team || r.team2 === team),
  )
  const wins = seasonRows.filter((r) => r.winner === team).length
  return {
    played: seasonRows.length,
    wins,
    winPct: seasonRows.length ? Math.round((wins / seasonRows.length) * 100) : 0,
  }
}

export function enrichMatch(row, allRows) {
  const team1 = { ...getTeamMeta(row.team1), isWinner: row.winner === row.team1 }
  const team2 = { ...getTeamMeta(row.team2), isWinner: row.winner === row.team2 }
  const margin = marginText(row)
  const tossWonMatch = row.toss_winner === row.winner
  const winnerVenuePct = venueWinRate(row.winner, row.venue, allRows)
  const loser = row.winner === row.team1 ? row.team2 : row.team1
  const winnerRecord = teamSeasonRecord(row.winner, row.season, allRows)
  const globalTossPct = tossWinRate(allRows)

  const insights = [
    {
      type: 'highlight',
      title: `${row.winner} take the points`,
      body: `${row.winner} beat ${loser} by ${margin} at ${row.venue}. ${row.player_of_match || 'The star performer'} earned Player of the Match.`,
      stat: margin,
      sentiment: 'positive',
    },
  ]

  if (tossWonMatch) {
    insights.push({
      type: 'tip',
      title: 'Toss advantage showed up again',
      body: `${row.toss_winner} won the toss, chose to ${row.toss_decision}, and went on to win. Across this dataset, the toss winner wins about ${globalTossPct}% of matches.`,
      stat: 'Toss → Win',
      sentiment: 'info',
    })
  } else {
    insights.push({
      type: 'warning',
      title: 'Winner overcame the toss',
      body: `${row.winner} won despite losing the toss to ${row.toss_winner}, who chose to ${row.toss_decision}.`,
      stat: 'Against toss',
      sentiment: 'neutral',
    })
  }

  if (Number(row.win_by_runs) >= 40) {
    insights.push({
      type: 'highlight',
      title: 'Dominant margin — batting control',
      body: `A ${row.win_by_runs}-run win usually means the winner posted a total the opponent could not chase down.`,
      stat: `${row.win_by_runs} runs`,
      sentiment: 'positive',
    })
  } else if (Number(row.win_by_wickets) >= 7) {
    insights.push({
      type: 'highlight',
      title: 'Clinical chase',
      body: `Winning with ${row.win_by_wickets} wickets in hand signals a comfortable chase with overs to spare.`,
      stat: `${row.win_by_wickets} wkts left`,
      sentiment: 'positive',
    })
  } else if (winnerVenuePct != null) {
    insights.push({
      type: 'tip',
      title: `${row.winner} at this venue (dataset)`,
      body: `In this dataset, ${row.winner} win about ${winnerVenuePct}% of matches at ${row.venue}. Season ${row.season}: ${winnerRecord.wins}/${winnerRecord.played} (${winnerRecord.winPct}%).`,
      stat: `${winnerVenuePct}% venue`,
      sentiment: 'info',
    })
  }

  const keyMoments = [
    {
      over: 'Toss',
      event: 'Toss',
      player: row.toss_winner,
      detail: `Chose to ${row.toss_decision}`,
    },
    {
      over: 'Result',
      event: row.result === 'tie' ? 'Tie' : 'Win',
      player: row.winner,
      detail: `Won by ${margin}`,
    },
  ]

  if (row.player_of_match) {
    keyMoments.push({
      over: 'PoM',
      event: 'Milestone',
      player: row.player_of_match,
      detail: 'Player of the Match',
    })
  }

  if (row.dl_applied === '1') {
    keyMoments.push({
      over: 'DLS',
      event: 'Note',
      player: '—',
      detail: 'Duckworth-Lewis method applied',
    })
  }

  return {
    id: String(row.id),
    season: Number(row.season),
    city: row.city,
    date: row.date,
    team1,
    team2,
    tossWinner: row.toss_winner,
    tossDecision: row.toss_decision,
    result: row.result,
    dlApplied: row.dl_applied === '1',
    winner: row.winner,
    margin,
    winByRuns: Number(row.win_by_runs) || 0,
    winByWickets: Number(row.win_by_wickets) || 0,
    playerOfMatch: row.player_of_match,
    venue: row.venue,
    umpires: [row.umpire1, row.umpire2, row.umpire3].filter(Boolean),
    insights,
    keyMoments,
    competition: `IPL ${row.season}`,
    status: 'Result',
  }
}
