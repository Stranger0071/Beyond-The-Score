import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const matches = parseCsv(readFileSync('src/matches_wc.csv', 'utf8'))
console.log('Keys of matches_wc row:', Object.keys(matches[0]).filter(k => k.trim().length > 0))

// Let's print the first row in full detail
for (const [key, val] of Object.entries(matches[0])) {
  if (val) {
    console.log(`${key}: ${val}`)
  }
}
