import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, useCountUp, staggerStyle } from '../utils/animations'
import { getTournament } from '../data/loadMatches'

function AnimatedValue({ value, inView }) {
  const numericVal = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value
  const isNumeric = !isNaN(numericVal) && typeof numericVal === 'number'
  const count = useCountUp(isNumeric ? numericVal : 0, 1600, inView)

  if (!isNumeric) return <>{value}</>
  return <>{count.toLocaleString()}</>
}

export default function DatasetStats({ stats }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [ref, inView] = useInView()
  const [cardsRef, cardsInView] = useInView()

  const cards = [
    { label: 'Total Matches', value: stats.total, hint: `Since ${getTournament() === 'wc' ? '1975' : '2008'}`, icon: '🏏', accent: 'theme' },
    { label: 'Toss Win Impact', value: `${stats.tossWinPct}%`, hint: 'Advantage', icon: '🪙', accent: 'amber' },
    { label: 'Defense Success', value: `${stats.runWinPct}%`, hint: 'Wins by runs', icon: '🛡️', accent: 'sky' },
    { label: 'Chase Success', value: `${stats.chaseWinPct}%`, hint: 'Wins by wkts', icon: '🎯', accent: 'violet' },
    { label: getTournament() === 'wc' ? 'WC Span' : 'IPL Span', value: stats.yearRange || stats.seasons, hint: 'Timeline', icon: '📅', accent: 'rose' },
    { label: 'Balls Processed', value: stats.totalBalls?.toLocaleString() ?? '—', hint: 'Big data', icon: '⚡', accent: 'cyan' },
  ]

  const accentColors = {
    theme:   { text: 'text-theme-accent', bg: 'bg-theme-accent-5', border: 'border-theme-accent-20', glow: 'var(--accent-glow)' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/15', glow: 'rgba(16,185,129,0.15)' },
    amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/8',   border: 'border-amber-500/15',   glow: 'rgba(245,158,11,0.15)' },
    sky:     { text: 'text-sky-400',     bg: 'bg-sky-500/8',     border: 'border-sky-500/15',     glow: 'rgba(14,165,233,0.15)' },
    violet:  { text: 'text-violet-400',  bg: 'bg-violet-500/8',  border: 'border-violet-500/15',  glow: 'rgba(139,92,246,0.15)' },
    rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/8',    border: 'border-rose-500/15',    glow: 'rgba(244,63,94,0.15)' },
    cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/8',    border: 'border-cyan-500/15',    glow: 'rgba(6,182,212,0.15)' },
  }

  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
      style={{ animation: 'bts-fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      {/* Ambient background effect */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full blur-[80px]"
        style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)' }} />

      <div ref={ref} className="relative mb-10">
        <div
          className="flex items-center gap-4"
          style={staggerStyle(inView, 0)}
        >
          <h2 className="text-xl font-extrabold tracking-tight text-white">Dataset Intelligence</h2>
          <div
            className="h-px flex-grow"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
              animation: inView ? 'bts-drawLine 1s ease-out 0.3s both' : 'none',
            }}
          />
        </div>
        <p
          className="mt-2 text-sm font-medium text-slate-500"
          style={staggerStyle(inView, 1, { baseDelay: 100 })}
        >
          {getTournament() === 'wc' ? 'World Cup' : 'IPL'} aggregates from ball-by-ball processing ({stats.yearRange || '2008–2025'})
        </p>
      </div>

      <div ref={cardsRef} className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c, i) => {
          const colors = accentColors[c.accent]
          return (
            <div
              key={c.label}
              className={`group relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
              style={{
                ...staggerStyle(cardsInView, i, { animation: 'bts-popIn', baseDelay: 0, stagger: 80 }),
                '--glow-color': colors.glow,
              }}
            >
              {/* Card hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 30px ${colors.glow}` }}
              />
              <div className="relative">
                <span className="mb-3 block text-lg">{c.icon}</span>
                <p className={`text-2xl font-black tabular-nums tracking-tight ${colors.text} transition-transform duration-300 group-hover:scale-105`}>
                  <AnimatedValue value={c.value} inView={cardsInView} />
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{c.label}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-700 italic">{c.hint}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
