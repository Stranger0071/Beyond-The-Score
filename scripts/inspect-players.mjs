import XLSX from 'xlsx'
import { readFileSync } from 'fs'
import { parseCsv, parseCsvLine } from '../src/utils/csvParser.js'

const rows = XLSX.utils.sheet_to_json(XLSX.readFile('src/Players.xlsx').Sheets.Sheet1)
const csv = parseCsv(readFileSync('src/matches.csv', 'utf8'))
const poms = [...new Set(csv.map((r) => r.player_of_match).filter(Boolean))]

const names = rows.map((r) => r.Player_Name)
let matched = 0
let unmatched = []

for (const pom of poms.slice(0, 50)) {
  if (names.includes(pom)) matched++
  else unmatched.push(pom)
}

console.log('Players:', rows.length, 'Unique PoM:', poms.length)
console.log('Matched in first 50 PoM:', matched)
console.log('Unmatched samples:', unmatched.slice(0, 15))

function findPlayer(query) {
  const q = query.toLowerCase()
  const exact = names.find((n) => n.toLowerCase() === q)
  if (exact) return exact
  const parts = q.split(/\s+/)
  const last = parts[parts.length - 1]
  return names.find((n) => n.toLowerCase().includes(last) || last.includes(n.split(' ').pop().toLowerCase()))
}

for (const t of ['Yuvraj Singh', 'JJ Bumrah', 'SP Narine', 'V Kohli', 'MS Dhoni', 'BCJ Cutting']) {
  console.log(t, '->', findPlayer(t))
}
