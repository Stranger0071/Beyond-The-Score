import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, useCountUp, staggerStyle } from '../utils/animations'

export default function MatchScorecard({ match }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [headerRef, headerInView] = useInView()
  const [teamsRef, teamsInView] = useInView()
  const [statsRef, statsInView] = useInView()

  const hasInnings = match.innings && match.innings.length > 0 && match.innings.some(inn => inn.balls > 0)

  return (
    <section id="section-scorecard" className="relative scroll-mt-20 space-y-0">
      {/* Main card */}
      <div
        className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        style={{ animation: 'bts-fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px]"
          style={{ backgroundColor: match.team1.color, opacity: 0.08 }}
        />
        <div
          className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full blur-[100px]"
          style={{ backgroundColor: match.team2.color, opacity: 0.08 }}
        />

        {/* Match info header */}
        <div
          ref={headerRef}
          className="relative mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-slate-500"
          style={staggerStyle(headerInView, 0, { baseDelay: 100 })}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent-glow)',
                animation: 'bts-glow 2s ease-in-out infinite',
              }}
            />
            {match.competition}
          </span>
          <span
            className="rounded-full bg-white/5 px-3 py-1 border border-white/5"
            style={staggerStyle(headerInView, 1, { animation: 'bts-slideInRight', baseDelay: 200 })}
          >
            {match.city} · {match.date}
            {match.stage ? ` · ${match.stage}` : ''}
          </span>
        </div>

        {/* Teams face-off */}
        <div ref={teamsRef} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-12">
          <TeamBlock team={match.team1} inView={teamsInView} side="left" />
          <ResultBlock match={match} inView={teamsInView} />
          <TeamBlock team={match.team2} align="left" inView={teamsInView} side="right" />
        </div>

        {/* Venue */}
        <p
          className="mt-8 text-center text-xs font-medium text-slate-500"
          style={staggerStyle(teamsInView, 5, { baseDelay: 500 })}
        >
          {match.venue}
        </p>

        {/* No data notice for old matches */}
        {!hasInnings && (
          <div
            className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center"
            style={staggerStyle(teamsInView, 6, { baseDelay: 600 })}
          >
            <p className="text-[11px] font-bold text-slate-500">
              ⚠️ Ball-by-ball data unavailable for this match — showing result summary only
            </p>
          </div>
        )}

        {/* Bottom stat cards */}
        <div ref={statsRef} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Toss" value={match.tossWinner} sub={`chose to ${match.tossDecision}`} index={0} inView={statsInView} />
          <StatCard label="Margin" value={match.margin} sub={match.result === 'tie' ? 'Super Over' : 'Victory'} index={1} inView={statsInView} />
          <StatCard label="Player of Match" value={match.playerOfMatch || '—'} sub="Standout performance" index={2} inView={statsInView} />
          <StatCard
            label="Ball Control"
            value={hasInnings ? `${match.matchStats?.avgDotPct ?? '—'}%` : 'N/A'}
            sub={hasInnings ? 'Average dot balls' : 'No ball data'}
            index={3}
            inView={statsInView}
          />
        </div>
      </div>
    </section>
  )
}

function TeamBlock({ team, align = 'right', inView, side }) {
  const alignCls = align === 'right' ? 'items-end text-right' : 'items-start text-left'
  const isDark = ['SRH', 'CSK'].includes(team.short)
  const runs = useCountUp(team.runs || 0, 1200, inView)
  const hasRuns = team.runs > 0 || team.wickets > 0

  return (
    <div
      className={`flex flex-col gap-3 ${alignCls}`}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView
          ? `${side === 'left' ? 'bts-slideLeft' : 'bts-slideRight'} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both`
          : 'none',
      }}
    >
      <div className="relative">
        {/* Glow behind badge */}
        <div
          className="absolute inset-[-4px] rounded-[1.2rem] opacity-50"
          style={{
            background: `radial-gradient(circle, ${team.color}35 0%, transparent 70%)`,
            filter: 'blur(6px)',
            animation: inView ? 'bts-pulseGlow 3.5s ease-in-out infinite' : 'none',
            '--glow-color': `${team.color}25`,
          }}
        />
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black shadow-2xl transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20 sm:text-2xl"
          style={{
            backgroundColor: team.color,
            color: isDark ? '#05070a' : '#fff',
            boxShadow: `0 16px 48px -8px ${team.color}44, inset 0 1px 0 rgba(255,255,255,0.12)`,
          }}
        >
          {team.short}
        </div>
        {team.isWinner && (
          <div
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg"
            style={{
              backgroundColor: 'var(--accent)',
              animation: inView ? 'bts-scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 600ms both' : 'none',
              boxShadow: `0 0 12px rgba(var(--accent-rgb), 0.5)`,
            }}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">{team.name}</span>
        {hasRuns ? (
          <>
            <p className="mt-1 text-3xl font-black tabular-nums tracking-tight text-white sm:text-5xl">
              <span style={{ color: team.isWinner ? team.color : '#fff' }}>{runs}</span>
              <span className="text-xl text-slate-500 sm:text-2xl">/{team.wickets}</span>
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{team.overs} <span className="text-[10px] uppercase">Overs</span></p>
          </>
        ) : (
          <p className="mt-1 text-sm font-semibold text-slate-500 italic">Score unavailable</p>
        )}
      </div>
    </div>
  )
}

function ResultBlock({ match, inView }) {
  return (
    <div
      className="px-4 text-center"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? 'bts-scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 400ms both' : 'none',
      }}
    >
      <div
        className="mb-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border"
        style={{
          backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
          color: 'var(--accent)',
          borderColor: 'rgba(var(--accent-rgb), 0.2)',
          animation: inView ? 'bts-pulseGlow 3s ease-in-out infinite' : 'none',
          '--glow-color': 'var(--accent-glow)',
        }}
      >
        Final Result
      </div>
      <p className="text-lg font-black tracking-tight text-white sm:text-xl">{match.winner}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{match.margin}</p>
    </div>
  )
}

function StatCard({ label, value, sub, index, inView }) {
  return (
    <div
      className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-lg"
      style={{
        ...staggerStyle(inView, index, { animation: 'bts-popIn', baseDelay: 100, stagger: 100 }),
        '--tw-shadow-color': 'rgba(var(--accent-rgb), 0.05)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 truncate text-sm font-extrabold text-white transition-colors duration-300 group-hover:text-theme-accent" title={String(value)}>
        {value}
      </p>
      <p className="mt-1 text-[10px] font-medium text-slate-600">{sub}</p>
      {/* Bottom accent line */}
      <div
        className="mt-3 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.4)' }}
      />
    </div>
  )
}
