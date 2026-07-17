import playersData from './players.json'
import { findPlayerByName, excelDateToDisplay, getAgeFromExcelDate, formatBattingHand } from '../utils/playerLookup'
import { getTeamMeta } from '../utils/teamMeta'

const registryByName = new Map(playersData.map((p) => [p.name, enrichProfile(p)]))

function enrichProfile(p) {
  return {
    ...p,
    dobDisplay: excelDateToDisplay(p.dobSerial),
    age: getAgeFromExcelDate(p.dobSerial),
    battingLabel: formatBattingHand(p.battingHand),
    initials: p.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  }
}

function findBatterInMatch(name, match) {
  for (const inn of match.innings) {
    const b = inn.topBatters?.find((x) => x.name === name)
    if (b) return { ...b, team: inn.battingTeam, role: 'Batter' }
    const bw = inn.topBowlers?.find((x) => x.name === name)
    if (bw) return { ...bw, team: inn.bowlingTeam, role: 'Bowler' }
  }
  return null
}

function getTeamPlayerNames(match, teamName) {
  const names = new Set()
  for (const inn of match.innings) {
    if (inn.battingTeam === teamName) inn.topBatters?.forEach((b) => names.add(b.name))
    if (inn.bowlingTeam === teamName) inn.topBowlers?.forEach((b) => names.add(b.name))
  }
  if (match.playerOfMatch && match.winner === teamName) names.add(match.playerOfMatch)
  return [...names]
}

function buildPlayerCard(name, teamName, isPoM, match) {
  const profile = findPlayerByName(registryByName, name)
  const team = getTeamMeta(teamName)
  const batting = findBatterInMatch(name, match)

  let fanTakeaway = profile
    ? `${profile.country} · ${profile.battingLabel}${profile.bowlingSkill ? ` · ${profile.bowlingSkill}` : ''}`
    : 'Player in this match.'

  if (isPoM) fanTakeaway = `Player of the Match — ${fanTakeaway}`
  if (batting?.runs != null) {
    fanTakeaway += ` In this game: ${batting.runs} off ${batting.balls} (SR ${batting.strikeRate}).`
  } else if (batting?.wickets != null) {
    fanTakeaway += ` In this game: ${batting.wickets} wkts, economy ${batting.economy}.`
  }

  return { name, isPoM, profile, team, matchStats: batting, fanTakeaway }
}

export function getMatchPlayers(match) {
  if (!match?.innings) return null
  const pomName = match.playerOfMatch
  const team1Names = getTeamPlayerNames(match, match.team1.name)
  const team2Names = getTeamPlayerNames(match, match.team2.name)

  const sortNames = (arr) =>
    [...arr].sort((a, b) => {
      if (a === pomName) return -1
      if (b === pomName) return 1
      return a.localeCompare(b)
    })

  return {
    playerOfMatch: pomName ? buildPlayerCard(pomName, match.winner, true, match) : null,
    team1: sortNames(team1Names).map((n) => buildPlayerCard(n, match.team1.name, n === pomName, match)),
    team2: sortNames(team2Names).map((n) => buildPlayerCard(n, match.team2.name, n === pomName, match)),
  }
}
