import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const matches = parseCsv(readFileSync('src/matches_wc.csv', 'utf8'))
const players = parseCsv(readFileSync('src/players.csv', 'utf8'))
const teams = parseCsv(readFileSync('src/teams.csv', 'utf8'))

console.log('Unique team1Ids in matches_wc:', new Set(matches.map(m => m.team1Id)).size)
console.log('Unique team2Ids in matches_wc:', new Set(matches.map(m => m.team2Id)).size)

// Let's see some player teamId and nationality mappings
const teamToNat = new Map()
for (const p of players) {
  if (p.teamId) {
    if (!teamToNat.has(p.teamId)) teamToNat.set(p.teamId, new Set())
    teamToNat.get(p.teamId).add(p.nationality)
  }
}

console.log('Sample teamId mappings from players.csv:')
let count = 0
for (const [teamId, nats] of teamToNat) {
  console.log(`TeamId: ${teamId} -> Nationalities: ${[...nats].join(', ')}`)
  count++
  if (count > 20) break
}
