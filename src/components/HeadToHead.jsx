import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { allMatches, getTournament } from '../data/loadMatches'

const TEAM_ALIASES = {
  // Rebrands & Variations
  'Delhi Daredevils': 'Delhi Capitals',
  'Delhi Capitals': 'Delhi Capitals',
  'Kings XI Punjab': 'Punjab Kings',
  'Punjab Kings': 'Punjab Kings',
  'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
  'Royal Challengers Bengaluru': 'Royal Challengers Bengaluru',
  'Rising Pune Supergiant': 'Rising Pune Supergiants',
  'Rising Pune Supergiants': 'Rising Pune Supergiants',

  // Historical context (Optional: Some users count these together, some don't)
  // For most 'proper' derivations, we keep different franchises separate 
  // unless they are explicitly rebrands (like the ones above).
  // 'Deccan Chargers': 'Sunrisers Hyderabad', 
}

function normalize(name) {
  if (!name) return ''
  const trimmed = name.trim()
  return TEAM_ALIASES[trimmed] || trimmed
}

/* ── Animated counter hook ── */
function useCountUp(end, duration = 1600, trigger = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) { setVal(0); return }
    let start = 0
    const step = Math.ceil(end / (duration / 16))
    const id = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(id) }
      else setVal(start)
    }, 16)
    return () => clearInterval(id)
  }, [end, duration, trigger])
  return val
}

/* ── Intersection Observer hook ── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.15, ...options }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

/* ── CSS Keyframes (injected once) ── */
const STYLE_ID = 'h2h-keyframes'
function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes h2h-fadeUp {
      from { opacity: 0; transform: translateY(28px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes h2h-scaleIn {
      from { opacity: 0; transform: scale(0.5) rotate(-8deg); }
      to   { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes h2h-slideLeft {
      from { opacity: 0; transform: translateX(-60px) scale(0.92); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes h2h-slideRight {
      from { opacity: 0; transform: translateX(60px) scale(0.92); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes h2h-barGrow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes h2h-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes h2h-pulseGlow {
      0%, 100% { box-shadow: 0 0 20px 0px var(--glow-color, rgba(16,185,129,0.2)); }
      50%      { box-shadow: 0 0 40px 8px var(--glow-color, rgba(16,185,129,0.35)); }
    }
    @keyframes h2h-popIn {
      0%   { opacity: 0; transform: scale(0.3) translateY(20px); }
      60%  { transform: scale(1.08) translateY(-4px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes h2h-vsPulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50%      { transform: scale(1.15); opacity: 1; }
    }
    @keyframes h2h-drawLine {
      from { width: 0; }
      to   { width: 100%; }
    }
    @keyframes h2h-float {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-6px); }
    }
    @keyframes h2h-countPop {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.12); }
      100% { transform: scale(1); }
    }
    @keyframes h2h-borderTrace {
      from { background-position: 0% 50%; }
      to   { background-position: 200% 50%; }
    }
  `
  document.head.appendChild(style)
}

/* ── Team Badge with animated glow ── */
function TeamBadge({ short, color, delay, inView, side }) {
  const isDark = ['SRH', 'CSK'].includes(short)
  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        animation: inView
          ? `${side === 'left' ? 'h2h-slideLeft' : 'h2h-slideRight'} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both,
             h2h-float 4s ease-in-out ${delay + 700}ms infinite`
          : 'none',
      }}
      className="relative"
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-[-6px] rounded-[2rem] opacity-60"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          animation: inView ? 'h2h-pulseGlow 3s ease-in-out infinite' : 'none',
          '--glow-color': `${color}30`,
          filter: 'blur(8px)',
        }}
      />
      <div
        className="relative flex h-22 w-22 items-center justify-center rounded-3xl text-xl font-black shadow-2xl sm:h-28 sm:w-28 sm:text-2xl"
        style={{
          backgroundColor: color,
          color: isDark ? '#05070a' : '#fff',
          boxShadow: `0 24px 60px -12px ${color}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
      >
        {short}
      </div>
    </div>
  )
}

/* ── Animated Number Display ── */
function AnimatedNumber({ value, label, color, delay, inView }) {
  const count = useCountUp(value, 1200, inView)
  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `h2h-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both` : 'none',
      }}
      className="text-center"
    >
      <p
        className="text-5xl font-black tabular-nums tracking-tighter sm:text-7xl"
        style={{
          color: color || '#fff',
          textShadow: color ? `0 0 30px ${color}40` : 'none',
          animation: inView && count === value ? `h2h-countPop 0.4s ease-out ${delay + 1200}ms both` : 'none',
        }}
      >
        {count}
      </p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
    </div>
  )
}

/* ── Stat Chip ── */
function StatChip({ label, value, icon, delay, inView }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `h2h-popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both` : 'none',
      }}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[11px] font-bold text-slate-400">{label}</span>
      <span className="text-[11px] font-black text-white">{value}</span>
    </div>
  )
}

export default function HeadToHead({ match }) {
  const currentT1 = normalize(match.team1.name)
  const currentT2 = normalize(match.team2.name)

  const record = useMemo(() => {
    if (!currentT1 || !currentT2) return { total: 0, t1Wins: 0, t2Wins: 0, noResult: 0, last5: [] }

    // Filter matches involving both teams (or their aliases)
    const clashes = allMatches.filter((m) => {
      const m1 = normalize(m.team1Name)
      const m2 = normalize(m.team2Name)

      return (m1 === currentT1 && m2 === currentT2) ||
        (m1 === currentT2 && m2 === currentT1)
    })

    const t1Wins = clashes.filter((m) => normalize(m.winner) === currentT1).length
    const t2Wins = clashes.filter((m) => normalize(m.winner) === currentT2).length
    const noResult = clashes.length - t1Wins - t2Wins

    // Get last 5 meetings
    const last5 = clashes.slice(0, 5).map((m) => {
      const winNorm = normalize(m.winner)
      const won1 = winNorm === currentT1
      const won2 = winNorm === currentT2
      return {
        id: m.id,
        year: m.year,
        winner: winNorm,
        winnerShort: won1 ? match.team1.short : (won2 ? match.team2.short : 'NR'),
        isT1: won1,
        isT2: won2
      }
    })

    return { total: clashes.length, t1Wins, t2Wins, noResult, last5 }
  }, [currentT1, currentT2, match.team1.short, match.team2.short])

  // Inject keyframes on mount
  useEffect(() => { injectKeyframes() }, [])

  // Intersection observers for different sections
  const [heroRef, heroInView] = useInView()
  const [barRef, barInView] = useInView()
  const [timelineRef, timelineInView] = useInView()

  if (record.total === 0) return null

  const t1Pct = Math.round((record.t1Wins / record.total) * 100)
  const t2Pct = Math.round((record.t2Wins / record.total) * 100)
  const drawPct = 100 - t1Pct - t2Pct
  const leader = record.t1Wins > record.t2Wins ? 'team1' : record.t2Wins > record.t1Wins ? 'team2' : 'tied'

  return (
    <section id="section-h2h" className="scroll-mt-20 space-y-6">
      {/* Section Header */}
      <div
        className="flex items-center gap-4"
        style={{
          animation: 'h2h-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <h2 className="text-xl font-extrabold tracking-tight text-white">Head-to-Head Analytics</h2>
        <div
          className="h-px flex-grow"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
            animation: 'h2h-drawLine 1s ease-out 0.3s both',
          }}
        />
        <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
          All-time {getTournament() === 'wc' ? 'World Cup' : 'IPL'} record
        </span>
      </div>

      {/* Main Card */}
      <div
        className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
        style={{
          animation: 'h2h-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both',
        }}
      >
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/4 h-60 w-60 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: match.team1.color }}
        />
        <div
          className="pointer-events-none absolute -top-20 right-1/4 h-60 w-60 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: match.team2.color }}
        />

        {/* Top stats row */}
        <div className="relative mb-10 flex flex-wrap items-center justify-center gap-3" ref={heroRef}>
          <StatChip icon="⚔️" label="Total Clashes" value={record.total} delay={200} inView={heroInView} />
          {record.noResult > 0 && (
            <StatChip icon="☁️" label="No Result" value={record.noResult} delay={350} inView={heroInView} />
          )}
          <StatChip
            icon={leader === 'team1' ? '👑' : leader === 'team2' ? '👑' : '🤝'}
            label={leader === 'tied' ? 'Status' : 'Leads'}
            value={
              leader === 'team1'
                ? match.team1.short
                : leader === 'team2'
                  ? match.team2.short
                  : 'Tied'
            }
            delay={500}
            inView={heroInView}
          />
        </div>

        {/* ── Head-to-Head Face-off ── */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-16">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-5">
            <TeamBadge
              short={match.team1.short}
              color={match.team1.color}
              delay={300}
              inView={heroInView}
              side="left"
            />
            <AnimatedNumber
              value={record.t1Wins}
              label="Victories"
              color={match.team1.color}
              delay={600}
              inView={heroInView}
            />
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/10 bg-white/5 text-xs font-black uppercase text-slate-300 backdrop-blur-sm"
              style={{
                opacity: heroInView ? 1 : 0,
                animation: heroInView
                  ? `h2h-scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both,
                     h2h-vsPulse 3s ease-in-out 1.2s infinite`
                  : 'none',
              }}
            >
              {/* Spinning border accent */}
              <div
                className="absolute inset-[-2px] rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${match.team1.color}, transparent 30%, transparent 70%, ${match.team2.color})`,
                  opacity: 0.4,
                  animation: heroInView ? 'spin 8s linear infinite' : 'none',
                }}
              />
              <span className="relative z-10">VS</span>
            </div>
            <div
              className="h-16 w-px sm:h-24"
              style={{
                background: `linear-gradient(to bottom, ${match.team1.color}40, rgba(255,255,255,0.05), ${match.team2.color}40)`,
                opacity: heroInView ? 1 : 0,
                animation: heroInView ? 'h2h-fadeUp 0.8s ease-out 0.8s both' : 'none',
              }}
            />
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-5">
            <TeamBadge
              short={match.team2.short}
              color={match.team2.color}
              delay={400}
              inView={heroInView}
              side="right"
            />
            <AnimatedNumber
              value={record.t2Wins}
              label="Victories"
              color={match.team2.color}
              delay={700}
              inView={heroInView}
            />
          </div>
        </div>

        {/* ── Dynamic Win Ratio Bar ── */}
        <div className="mt-16 space-y-4" ref={barRef}>
          <div
            className="flex justify-between text-[11px] font-black uppercase tracking-widest"
            style={{
              opacity: barInView ? 1 : 0,
              animation: barInView ? 'h2h-fadeUp 0.5s ease-out both' : 'none',
            }}
          >
            <span style={{ color: match.team1.color }}>{t1Pct}%</span>
            <span className="text-slate-500">Dominance Ratio</span>
            <span style={{ color: match.team2.color }}>{t2Pct}%</span>
          </div>

          <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/[0.04]">
            {/* Team 1 bar */}
            <div
              className="absolute left-0 top-0 h-full rounded-l-full"
              style={{
                width: `${t1Pct}%`,
                background: `linear-gradient(90deg, ${match.team1.color}90, ${match.team1.color})`,
                transformOrigin: 'left center',
                animation: barInView ? 'h2h-barGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both' : 'none',
              }}
            >
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 rounded-l-full"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                  animation: barInView ? 'h2h-shimmer 2s ease-in-out 1.5s infinite' : 'none',
                }}
              />
            </div>

            {/* Team 2 bar */}
            <div
              className="absolute right-0 top-0 h-full rounded-r-full"
              style={{
                width: `${t2Pct}%`,
                background: `linear-gradient(90deg, ${match.team2.color}, ${match.team2.color}90)`,
                transformOrigin: 'right center',
                animation: barInView ? 'h2h-barGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both' : 'none',
              }}
            >
              <div
                className="absolute inset-0 rounded-r-full"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                  animation: barInView ? 'h2h-shimmer 2s ease-in-out 1.7s infinite' : 'none',
                }}
              />
            </div>

            {/* Draw portion (center gap acts as draw indicator) */}
            {drawPct > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500"
                style={{ left: `${t1Pct}%`, width: `${drawPct}%`, textAlign: 'center' }}
              >
                {drawPct > 5 && `${drawPct}%`}
              </div>
            )}
          </div>

          {/* Win bar labels */}
          <div
            className="flex justify-between text-[10px] font-bold text-slate-600"
            style={{
              opacity: barInView ? 1 : 0,
              animation: barInView ? 'h2h-fadeUp 0.5s ease-out 0.6s both' : 'none',
            }}
          >
            <span>{record.t1Wins} win{record.t1Wins !== 1 ? 's' : ''}</span>
            <span>{record.t2Wins} win{record.t2Wins !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* ── Timeline of Last 5 ── */}
        <div className="mt-16 border-t border-white/5 pt-10" ref={timelineRef}>
          <h3
            className="mb-10 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"
            style={{
              opacity: timelineInView ? 1 : 0,
              animation: timelineInView ? 'h2h-fadeUp 0.5s ease-out both' : 'none',
            }}
          >
            Recent Match History
          </h3>

          {/* Timeline connector line */}
          <div className="relative flex justify-center gap-5 sm:gap-8">
            {/* Connecting line behind the badges */}


            {record.last5.map((m, i) => {
              const teamColor = m.isT1 ? match.team1.color : (m.isT2 ? match.team2.color : '#475569')
              return (
                <div
                  key={m.id}
                  className="group relative z-10 flex flex-col items-center gap-3"
                  style={{
                    opacity: timelineInView ? 1 : 0,
                    animation: timelineInView
                      ? `h2h-popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${400 + i * 150}ms both`
                      : 'none',
                  }}
                >
                  <div
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-[10px] font-black transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg cursor-default sm:h-14 sm:w-14"
                    style={{
                      backgroundColor: `${teamColor}18`,
                      color: teamColor,
                      border: `1.5px solid ${teamColor}35`,
                      '--glow-color': `${teamColor}30`,
                    }}
                  >
                    {/* Winner indicator dot */}
                    {(m.isT1 || m.isT2) && (
                      <div
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-900"
                        style={{
                          backgroundColor: teamColor,
                          boxShadow: `0 0 8px ${teamColor}60`,
                        }}
                      />
                    )}
                    {m.winnerShort === 'NR' ? '—' : m.winnerShort}
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] font-bold text-slate-600">{m.year}</span>
                    <div
                      className="h-1 w-4 rounded-full"
                      style={{ backgroundColor: `${teamColor}30` }}
                    />
                  </div>

                  {/* Hover tooltip */}
                  <div
                    className="pointer-events-none absolute -top-12 scale-0 rounded-lg px-3 py-1.5 text-[9px] font-bold shadow-xl transition-transform duration-200 group-hover:scale-100"
                    style={{
                      backgroundColor: teamColor,
                      color: ['SRH', 'CSK'].includes(m.winnerShort) ? '#05070a' : '#fff',
                    }}
                  >
                    {m.winner || 'No Result'}
                    {/* Tooltip arrow */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                      style={{ borderTopColor: teamColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div
            className="mt-8 flex justify-center gap-6"
            style={{
              opacity: timelineInView ? 1 : 0,
              animation: timelineInView ? 'h2h-fadeUp 0.4s ease-out 1.2s both' : 'none',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: match.team1.color }} />
              <span className="text-[10px] font-bold text-slate-500">{match.team1.short}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: match.team2.color }} />
              <span className="text-[10px] font-bold text-slate-500">{match.team2.short}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
