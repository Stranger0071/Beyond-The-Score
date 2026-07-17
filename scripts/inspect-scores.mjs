import { readFileSync } from 'fs'
import { parseCsv } from '../src/utils/csvParser.js'

const balls = parseCsv(readFileSync('src/overBallDetails.csv', 'utf8'))
const scores = new Set(balls.map(b => b.score))
console.log('Unique score values in overBallDetails.csv:', [...scores].slice(0, 100))

// Let's print counts for the most common ones
const counts = {}
for (const b of balls) {
  counts[b.score] = (counts[b.score] || 0) + 1
}
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
console.log('Most common score values:')
console.log(sorted.slice(0, 30))
