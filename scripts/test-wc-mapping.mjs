import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const players = parseCsv(readFileSync('src/players.csv', 'utf8'))
const matches = parseCsv(readFileSync('src/matches_wc.csv', 'utf8'))
const teams = parseCsv(readFileSync('src/teams.csv', 'utf8'))

const playerToTeam = new Map() // playerId -> player details
const teamPlayers = new Map() // teamId -> array of players
for (const p of players) {
  playerToTeam.set(p.id, p)
  if (p.teamId) {
    if (!teamPlayers.has(p.teamId)) teamPlayers.set(p.teamId, [])
    teamPlayers.get(p.teamId).push(p)
  }
}

// Find team from teams.csv for a given matches_wc teamId
function getTeamMetaForWcTeam(wcTeamId) {
  if (!wcTeamId || wcTeamId === '0') return null
  
  // First, check if wcTeamId directly exists as a team ID in teams.csv
  const directMatch = teams.find(t => t.id === wcTeamId)
  if (directMatch) {
    return {
      id: directMatch.id,
      fullName: directMatch.fullName,
      shortName: directMatch.shortName,
      abbreviation: directMatch.abbreviation
    }
  }

  const plList = teamPlayers.get(wcTeamId) || []
  if (!plList.length) return null
  const plIds = new Set(plList.map(p => p.id))
  
  // Try to match via captainId or wicketKeeperId in teams.csv
  const matchedTeams = teams.filter(t => plIds.has(t.captainId) || plIds.has(t.wicketKeeperId))
  if (matchedTeams.length > 0) {
    return {
      id: matchedTeams[0].id,
      fullName: matchedTeams[0].fullName,
      shortName: matchedTeams[0].shortName,
      abbreviation: matchedTeams[0].abbreviation
    }
  }

  // Fallback: match by player nationality
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
      'Bermudian': 'Bermuda',
      'Nepalese': 'Nepal',
      'Omani': 'Oman',
      'Namibian': 'Namibia',
      'USA': 'United States of America',
      'Trinidadian': 'West Indies',
      'Barbados': 'West Indies',
      'Guyanan': 'West Indies'
    }
    const countryName = natMap[maxNat]
    if (countryName) {
      const matchByName = teams.find(t => t.fullName.toLowerCase() === countryName.toLowerCase())
      if (matchByName) {
        return {
          id: matchByName.id,
          fullName: matchByName.fullName,
          shortName: matchByName.shortName,
          abbreviation: matchByName.abbreviation
        }
      }
    }
  }
  
  return null
}

const allWcTeamIds = new Set([
  ...matches.map(m => m.team1Id),
  ...matches.map(m => m.team2Id)
].filter(Boolean))

let unmappedCount = 0
for (const wcId of allWcTeamIds) {
  const meta = getTeamMetaForWcTeam(wcId)
  if (!meta) {
    unmappedCount++
    if (unmappedCount <= 10) {
      console.log(`Unmapped wc teamId: ${wcId}`)
    }
  }
}

console.log(`Total unique wc teamIds: ${allWcTeamIds.size}`)
console.log(`Unmapped wc teamIds: ${unmappedCount}`)
