import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const players = parseCsv(readFileSync('src/players.csv', 'utf8'))
const matches = parseCsv(readFileSync('src/matches_wc.csv', 'utf8'))
const teams = parseCsv(readFileSync('src/teams.csv', 'utf8'))

// Find players for teamId 2808
console.log('Players for teamId 2808:')
console.log(players.filter(p => p.teamId === '2808').slice(0, 5))

// Find players for teamId 2809
console.log('Players for teamId 2809:')
console.log(players.filter(p => p.teamId === '2809').slice(0, 5))

// Let's see if we can find how teamId 2808 and 2809 relate to teams.csv
// In teams.csv: id, fullName, shortName, abbreviation, wicketKeeperId, captainId
// Let's search if any player of 2808 is a captain or keeper in teams.csv
const playerIds2808 = new Set(players.filter(p => p.teamId === '2808').map(p => p.id))
const playerIds2809 = new Set(players.filter(p => p.teamId === '2809').map(p => p.id))

console.log('Matching teams for 2808 in teams.csv:')
console.log(teams.filter(t => playerIds2808.has(t.captainId) || playerIds2808.has(t.wicketKeeperId)))

console.log('Matching teams for 2809 in teams.csv:')
console.log(teams.filter(t => playerIds2809.has(t.captainId) || playerIds2809.has(t.wicketKeeperId)))
