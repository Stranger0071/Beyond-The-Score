import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const text = readFileSync('src/IPL.csv', 'utf8')
const rows = parseCsv(text)
console.log('rows', rows.length)
console.log('headers sample', Object.keys(rows[0]))
const ids = new Set(rows.map((r) => r.match_id))
console.log('unique matches', ids.size)
const seasons = new Set(rows.map((r) => r.year))
console.log('years', [...seasons].sort())
const sample = rows.filter((r) => r.match_id === rows[0].match_id)
console.log('balls in first match', sample.length)
