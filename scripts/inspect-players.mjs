import readXlsxFile from 'read-excel-file/node'
import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const sheets = await readXlsxFile('src/Players.xlsx')
const rows = sheets[0]?.data || []
const [, ...dataRows] = rows
const csv = parseCsv(readFileSync('src/matches.csv', 'utf8'))
const poms = [...new Set(csv.map((r) => r.player_of_match).filter(Boolean))]

const names = dataRows.map((r) => r[0])
let matched = 0
let unmatched = []

for (const pom of poms.slice(0, 50)) {
  if (names.includes(pom)) matched++
  else unmatched.push(pom)
}

console.log('Players:', dataRows.length, 'Unique PoM:', poms.length)
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
