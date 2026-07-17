import XLSX from 'xlsx'
import { writeFileSync } from 'fs'

const wb = XLSX.readFile('src/Players.xlsx')
const rows = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1, { defval: '' })

const players = rows.map((row) => ({
  name: row.Player_Name,
  dobSerial: row.DOB || null,
  battingHand: row.Batting_Hand || '',
  bowlingSkill: row.Bowling_Skill || '',
  country: row.Country || '',
}))

writeFileSync('src/data/players.json', JSON.stringify(players, null, 2))
console.log(`Wrote ${players.length} players to src/data/players.json`)
