import { useMemo } from 'react'
import { allMatches } from '../data/loadMatches'
import { injectGlobalKeyframes, useInView, useCountUp, staggerStyle } from '../utils/animations'

const TEAM_ALIASES = {
  'Delhi Daredevils': 'Delhi Capitals',
  'Delhi Capitals': 'Delhi Capitals',
  'Kings XI Punjab': 'Punjab Kings',
  'Punjab Kings': 'Punjab Kings',
  'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
  'Royal Challengers Bengaluru': 'Royal Challengers Bengaluru',
  'Rising Pune Supergiant': 'Rising Pune Supergiants',
  'Rising Pune Supergiants': 'Rising Pune Supergiants',
}

function normalizeTeamName(name) {
  if (!name || name === 'NA') return ''
  const trimmed = name.trim()
  return TEAM_ALIASES[trimmed] || trimmed
}

export default function VenueStats({ match }) {
  const currentVenue = match.venue
  const t1Name = match.team1.name
  const t2Name = match.team2.name

  const stats = useMemo(() => {
    if (!allMatches || !allMatches.length) return null

    const normalizeVenue = (name) => {
      if (!name) return ''
      // Match by the first part of the venue name
      return name.split(',')[0].toLowerCase().replace(/[^a-z0-9]/g, '').trim()
    }

    const targetNorm = normalizeVenue(currentVenue)
    const atVenue = allMatches.filter((m) => {
      const mNorm = normalizeVenue(m.venue)
      return mNorm.includes(targetNorm) || targetNorm.includes(mNorm) || mNorm === targetNorm
    })

    const total = atVenue.length
    if (!total) return null

    const batFirstWins = atVenue.filter((m) => m.winOutcome === 'runs').length
    const chaseWins = atVenue.filter((m) => m.winOutcome === 'wickets').length
    const batFirstPct = total > 0 ? Math.round((batFirstWins / total) * 100) : 0
    const chasePct = total > 0 ? Math.round((chaseWins / total) * 100) : 0

    const tossWins = atVenue.filter((m) => m.tossWinner === m.winner).length
    const tossWinPct = total > 0 ? Math.round((tossWins / total) * 100) : 0

    const teamWins = {}
    for (const m of atVenue) {
      const normWinner = normalizeTeamName(m.winner)
      if (normWinner && normWinner !== 'No Result') {
        teamWins[normWinner] = (teamWins[normWinner] || 0) + 1
      }
    }

    const topTeams = Object.entries(teamWins)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, wins]) => ({
        name,
        wins,
        pct: total > 0 ? Math.round((wins / total) * 100) : 0,
      }))

    const getTeamWins = (name) => atVenue.filter(m => normalizeTeamName(m.winner) === normalizeTeamName(name)).length
    const t1Wins = getTeamWins(t1Name)
    const t2Wins = getTeamWins(t2Name)

    return {
      total,
      batFirstPct,
      chasePct,
      tossWinPct,
      topTeams,
      t1Wins,
      t1Pct: total > 0 ? Math.round((t1Wins / total) * 100) : 0,
      t2Wins,
      t2Pct: total > 0 ? Math.round((t2Wins / total) * 100) : 0
    }
  }, [currentVenue, t1Name, t2Name])

  // Refs for scroll triggers
  const [headerRef, headerInView] = useInView()
  const [tilesRef, tilesInView] = useInView()
  const [teamsRef, teamsInView] = useInView()
  const [leadersRef, leadersInView] = useInView()

  if (!stats) return (
    <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/20 p-12 text-center text-slate-500">
      <p className="text-lg font-black text-white/20">No Historical Data</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-widest opacity-50">Could not find matches played at "{currentVenue}"</p>
    </div>
  )

  return (
    <section className="space-y-8">
      <div ref={headerRef} className="flex items-center gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-white" style={staggerStyle(headerInView, 0)}>Venue Intelligence</h2>
        <div
          className="h-px flex-grow"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
            animation: headerInView ? 'bts-drawLine 1s ease-out 0.2s both' : 'none',
          }}
        />
        <div className="flex gap-2" style={staggerStyle(headerInView, 1, { animation: 'bts-slideInRight' })}>
          <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border"
            style={{
              backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
              color: 'var(--accent)',
              borderColor: 'rgba(var(--accent-rgb), 0.2)'
            }}>
            {stats.total} Matches
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stats Card */}
        <div
          ref={tilesRef}
          className="lg:col-span-2 overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl"
          style={{
            opacity: tilesInView ? 1 : 0,
            animation: tilesInView ? 'bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
          }}
        >
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Historical Venue Performance</p>
            <h3 className="mt-2 text-2xl font-black text-white">{currentVenue}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <MetricTile label="Bat 1st" value={stats.batFirstPct} color="accent" icon="🏏" inView={tilesInView} index={0} />
            <MetricTile label="Chase" value={stats.chasePct} color="sky" icon="🎯" inView={tilesInView} index={1} />
            <MetricTile label="Toss Advantage" value={stats.tossWinPct} color="amber" icon="🪙" inView={tilesInView} index={2} />
          </div>

          {/* Win Bar */}
          <div className="mt-12 space-y-4">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
              <span style={{ color: 'var(--accent)' }}>Bat First ({stats.batFirstPct}%)</span>
              <span className="text-sky-400">Chase ({stats.chasePct}%)</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
              <div
                className="h-full transition-all rounded-l-full"
                style={{
                  width: tilesInView ? `${stats.batFirstPct}%` : '0%',
                  background: 'linear-gradient(to right, var(--accent-hover), var(--accent))',
                  transformOrigin: 'left center',
                  animation: tilesInView ? 'bts-barGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both' : 'none',
                }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-sky-600 to-sky-400 transition-all rounded-r-full"
                style={{
                  width: tilesInView ? `${stats.chasePct}%` : '0%',
                  transformOrigin: 'right center',
                  animation: tilesInView ? 'bts-barGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both' : 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Team Track Record */}
        <div
          ref={teamsRef}
          className="rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl"
          style={{
            opacity: teamsInView ? 1 : 0,
            animation: teamsInView ? 'bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
          }}
        >
          <p className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Current Teams at Venue</p>
          <div className="space-y-8">
            <TeamVenueStat name={match.team1.short} color={match.team1.color} wins={stats.t1Wins} pct={stats.t1Pct} total={stats.total} inView={teamsInView} index={0} />
            <TeamVenueStat name={match.team2.short} color={match.team2.color} wins={stats.t2Wins} pct={stats.t2Pct} total={stats.total} inView={teamsInView} index={1} />
          </div>
        </div>
      </div>

      {/* Success Board */}
      {stats.topTeams.length > 0 && (
        <div
          ref={leadersRef}
          className="rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl"
          style={{
            opacity: leadersInView ? 1 : 0,
            animation: leadersInView ? 'bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
          }}
        >
          <p className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">All-Time Venue Leaders</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.topTeams.map((t, i) => (
              <div
                key={t.name}
                className="group flex items-center gap-4 rounded-2xl bg-white/[0.03] p-5 border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 hover:border-white/10"
                style={staggerStyle(leadersInView, i, { animation: 'bts-popIn', stagger: 80 })}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-slate-500 transition-all duration-300"
                  style={{
                    color: 'var(--icon-color, #64748b)',
                    backgroundColor: 'var(--icon-bg, rgba(255, 255, 255, 0.05))'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty('--icon-color', 'var(--accent)');
                    e.currentTarget.style.setProperty('--icon-bg', 'rgba(var(--accent-rgb), 0.1)');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--icon-color', '#64748b');
                    e.currentTarget.style.setProperty('--icon-bg', 'rgba(255, 255, 255, 0.05)');
                  }}
                >
                  #{i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">{t.name}</p>
                  <p className="text-[10px] font-bold text-slate-500">{t.wins} wins · {t.pct}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function MetricTile({ label, value, color, icon, inView, index }) {
  const count = useCountUp(value || 0, 1400, inView)
  const colors = {
    accent: '',
    sky: 'text-sky-400 bg-sky-500/5 border-sky-500/10',
    amber: 'text-amber-400 bg-amber-500/5 border-amber-500/10'
  }
  const isAccent = color === 'accent'
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.03] ${colors[color]}`}
      style={{
        ...staggerStyle(inView, index, { animation: 'bts-popIn', stagger: 100 }),
        ...(isAccent ? {
          color: 'var(--accent)',
          backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
          borderColor: 'rgba(var(--accent-rgb), 0.1)'
        } : {})
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</p>
      </div>
      <p className="text-3xl font-black tracking-tighter">
        {count}%
      </p>
    </div>
  )
}

function TeamVenueStat({ name, color, wins, pct, total, inView, index }) {
  const count = useCountUp(pct || 0, 1400, inView)
  return (
    <div className="group space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-lg font-black text-white transition-colors duration-300" style={{ color: inView ? '#fff' : '#fff' }}>{name}</p>
          <p className="text-[10px] font-bold text-slate-500">{wins} wins in {total} games</p>
        </div>
        <p className="text-xl font-black transition-transform duration-300 group-hover:scale-105" style={{ color }}>
          {count}%
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/5">
        <div
          className="h-full transition-all rounded-full group-hover:brightness-125"
          style={{
            width: inView ? `${pct}%` : '0%',
            backgroundColor: color,
            transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1) 200ms',
            boxShadow: `0 0 10px ${color}30`
          }}
        />
      </div>
    </div>
  )
}
