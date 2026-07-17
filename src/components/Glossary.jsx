import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, staggerStyle } from '../utils/animations'

export default function Glossary() {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [headerRef, headerInView] = useInView()
  const [gridRef, gridInView] = useInView()

  const terms = [
    { term: "SR", plain: "Strike Rate", desc: "Measures how quickly a batter scores runs. A strike rate of 150 means the batter scores 150 runs per 100 balls." },
    { term: "Economy", plain: "Economy Rate", desc: "Average runs a bowler gives per over. Lower economy usually means tighter bowling." },
    { term: "Powerplay", plain: "Field Restriction Overs", desc: "The first overs where only a limited number of fielders are allowed outside the circle, encouraging aggressive batting." },
    { term: "Death Overs", plain: "Final Overs", desc: "The last phase of an innings where teams usually attack aggressively to maximize scoring." },
    { term: "Dot Ball %", plain: "Dot Ball Percentage", desc: "Percentage of deliveries where no runs are scored. Important for measuring bowling pressure." },
    { term: "Net Run Rate", plain: "NRR", desc: "A tournament ranking metric comparing how quickly a team scores versus how quickly they concede runs." },
    { term: "Required Run Rate", plain: "RRR", desc: "The number of runs needed per over for the chasing team to win." },
    { term: "Run Rate", plain: "Scoring Speed", desc: "Average runs scored per over during an innings." },
    { term: "Maiden Over", plain: "Maiden Over", desc: "An over where the bowler concedes no runs off the bat." },
    { term: "Yorker", plain: "Full-Length Delivery", desc: "A ball aimed at the batter’s feet, difficult to hit and commonly used in death overs." },
    { term: "Googly", plain: "Deceptive Spin Ball", desc: "A delivery from a leg-spinner that spins opposite to what the batter expects." },
    { term: "Doosra", plain: "Reverse Off-Spin", desc: "A variation bowled by an off-spinner that turns the opposite way." },
    { term: "All-Rounder", plain: "Dual-Skill Player", desc: "A player who contributes effectively with both batting and bowling." },
    { term: "Anchor", plain: "Stabilizing Batter", desc: "A batter who focuses on building the innings steadily while others attack." },
    { term: "Finisher", plain: "End-Game Batter", desc: "A batter known for scoring quickly in the final overs of an innings." },
    { term: "Duck", plain: "Zero Runs", desc: "When a batter gets out without scoring any runs." },
    { term: "Golden Duck", plain: "First-Ball Dismissal", desc: "When a batter gets out on the very first ball faced." },
    { term: "Partnership", plain: "Batting Combination", desc: "The number of runs scored by two batters before one gets out." },
    { term: "Slog Overs", plain: "High-Attack Phase", desc: "The final overs where batters try to maximize boundaries and scoring speed." },
    { term: "Reverse Swing", plain: "Late Ball Movement", desc: "A bowling phenomenon where an older ball swings unexpectedly at high speed." },
    { term: "Chinaman", plain: "Left-Arm Wrist Spin", desc: "A rare style of spin bowling delivered by a left-arm wrist spinner." },
    { term: "Impact Player", plain: "Tactical Substitute", desc: "An IPL rule allowing teams to substitute a player during the match for strategic advantage." },
    { term: "Middle Overs", plain: "Game Control Phase", desc: "The overs between powerplay and death overs where teams build or stabilize innings." },
    { term: "Boundary %", plain: "Boundary Frequency", desc: "Percentage of runs scored through fours and sixes." },
    { term: "Wagon Wheel", plain: "Shot Direction Map", desc: "A visual showing where a batter scores runs around the ground." }
  ]

  return (
    <section
      id="section-glossary"
      className="scroll-mt-20 rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-left relative overflow-hidden"
      style={{ animation: 'bts-fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      <div ref={headerRef} className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-white" style={staggerStyle(headerInView, 0)}>Stat Glossary</h2>
        <div
          className="h-px flex-grow"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
            animation: headerInView ? 'bts-drawLine 1s ease-out 0.2s both' : 'none',
          }}
        />
      </div>

      <dl ref={gridRef} className="grid gap-4 sm:grid-cols-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {terms.map((t, i) => {
          // Limit stagger delay for large dataset to avoid waiting too long
          const animDelay = Math.min(i * 35, 400)
          return (
            <div
              key={t.term}
              className="group rounded-2xl bg-black/20 border border-white/5 p-4 transition-all duration-300 hover:bg-black/30 hover:-translate-y-0.5"
              style={{
                opacity: gridInView ? 1 : 0,
                animation: gridInView ? `bts-staggerFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${animDelay}ms both` : 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
            >
              <dt className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-black group-hover-text-theme-accent transition-colors" style={{ color: 'var(--accent)' }}>
                  {t.term}
                </span>
                <span className="text-sm font-bold text-white">
                  {t.plain}
                </span>
              </dt>
              <dd className="mt-1.5 text-xs leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                {t.desc}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}