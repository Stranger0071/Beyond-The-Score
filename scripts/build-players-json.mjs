import readXlsxFile from 'read-excel-file/node'
import { writeFileSync } from 'fs'

const sheets = await readXlsxFile('src/Players.xlsx')
const rows = sheets[0]?.data || []
const [, ...dataRows] = rows

const players = dataRows.map((row) => {
  let dobSerial = null
  if (row[1] instanceof Date) {
    dobSerial = Math.round(row[1].getTime() / (86400 * 1000) + 25569)
  } else if (typeof row[1] === 'number') {
    dobSerial = row[1]
  }

  return {
    name: row[0] || '',
    dobSerial,
    battingHand: row[2] != null ? String(row[2]) : '',
    bowlingSkill: row[3] != null ? String(row[3]) : '',
    country: row[4] != null ? String(row[4]) : '',
  }
})

writeFileSync('src/data/players.json', JSON.stringify(players, null, 2))
console.log(`Wrote ${players.length} players to src/data/players.json`)
