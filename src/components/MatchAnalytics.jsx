import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, useCountUp, staggerStyle } from '../utils/animations'

export default function MatchAnalytics({ match }) {
  const { matchStats, innings } = match
  useEffect(() => { injectGlobalKeyframes() }, [])

  if (!innings?.length) return null

  return (
    <section id="section-analytics" className="scroll-mt-20 space-y-10 text-left">
      <AnalyticsHeader year={match.year} competition={match.competition} />
      <MatchMetrics stats={matchStats} />
      <div className="grid gap-6 lg:grid-cols-2">
        {innings.map((inn, i) => (
          <InningsPanel key={inn.innings} inn={inn} index={i} />
        ))}
      </div>
    </section>
  )
}

function AnalyticsHeader({ year, competition }) {
  const [ref, inView] = useInView()
  const label = competition || `Season ${year}`
  return (
    <div ref={ref} className="flex items-end justify-between border-b border-white/5 pb-6">
      <div style={staggerStyle(inView, 0)}>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Advanced Analytics</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Ball-by-ball deep dive · {label}</p>
      </div>
      <div
        className="hidden h-px flex-grow mx-8 sm:block"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          width: inView ? '100%' : '0%',
          transition: 'width 1s ease-in-out 0.2s',
        }}
      />
      <div className="text-right" style={staggerStyle(inView, 2, { animation: 'bts-slideInRight' })}>
        <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border"
          style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)', borderColor: 'rgba(var(--accent-rgb), 0.2)' }}>
          Stat Engine v4.0
        </span>
      </div>
    </div>
  )
}

function MatchMetrics({ stats }) {
  const [ref, inView] = useInView()
  const items = [
    { label: 'Dot Ball %', value: stats.avgDotPct, unit: '%', hint: 'Precision' },
    { label: 'Boundary %', value: stats.avgBoundaryPct, unit: '%', hint: 'Aggression' },
    { label: 'Total Runs', value: stats.totalRuns, hint: 'Volume' },
    { label: 'Wickets', value: stats.totalWickets, hint: 'Impact' },
    { label: 'Max Sixes', value: stats.totalSixes, hint: 'Power' },
    { label: 'Extras', value: stats.totalExtras, hint: 'Discipline' },
  ]
  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item, idx) => (
        <MetricCard key={item.label} label={item.label} value={item.value} unit={item.unit} hint={item.hint} index={idx} inView={inView} />
      ))}
    </div>
  )
}

function MetricCard({ label, value, unit = '', hint, index, inView }) {
  const count = useCountUp(value || 0, 1400, inView)
  return (
    <div
      className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1"
      style={staggerStyle(inView, index, { animation: 'bts-popIn', stagger: 80 })}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-800 transition-colors duration-300" style={{ '--hover-bg': 'var(--accent)' }} />
      </div>
      <p className="mt-3 text-2xl font-black tracking-tight text-white transition-colors group-hover:text-theme-accent">
        {count}
        {unit && <span className="text-sm font-bold text-slate-500 ml-0.5">{unit}</span>}
      </p>
      <p className="mt-1 text-[10px] font-bold text-slate-600">{hint}</p>
    </div>
  )
}

function InningsPanel({ inn, index }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className="group overflow-hidden rounded-3xl border border-white/5 bg-slate-900/20 p-6 transition-all duration-300 hover:bg-slate-900/40 hover:border-white/10 sm:p-8"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 200}ms both` : 'none',
      }}
    >
      <InningsHeader inn={inn} index={index} inView={inView} />
      <div className="mt-6">
        <InningsStatsGrid inn={inn} inView={inView} />
      </div>
      <div className="mt-8 space-y-3">
        <PhaseRow title="Powerplay" range="1–6" phase={inn.powerplay} index={0} inView={inView} />
        <PhaseRow title="Middle Overs" range="7–15" phase={inn.middle} index={1} inView={inView} />
        <PhaseRow title="Death Overs" range="16–20" phase={inn.death} index={2} inView={inView} />
      </div>
      <TopPerformers inn={inn} inView={inView} />
    </div>
  )
}

function InningsHeader({ inn, index, inView }) {
  const runs = useCountUp(inn.runs || 0, 1200, inView)
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xs font-bold text-slate-400 transition-colors group-hover:text-theme-accent">
          0{index + 1}
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{inn.battingTeam}</h3>
          <p className="text-[10px] font-medium text-slate-600">First Innings</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-3xl font-black tabular-nums tracking-tight text-white">
          {runs}<span className="text-lg" style={{ color: 'var(--accent)' }}>/{inn.wickets}</span>
        </span>
        <p className="text-xs font-bold text-slate-500">{inn.overs} Overs</p>
      </div>
    </div>
  )
}

function InningsStatsGrid({ inn, inView }) {
  const stats = [
    { label: 'Run Rate', value: inn.runRate },
    { label: 'Dot Ball %', value: `${inn.dotBallPct}%`, highlight: true },
    { label: 'Boundary %', value: `${inn.boundaryPct}%` },
    { label: 'Total Dots', value: inn.dotBalls },
    { label: 'Boundaries', value: `${inn.fours + inn.sixes}` },
    { label: 'Strike Rate', value: ((inn.runs / inn.balls) * 100).toFixed(1) },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((s, idx) => (
        <MiniStat key={s.label} label={s.label} value={s.value} highlight={s.highlight} index={idx} inView={inView} />
      ))}
    </div>
  )
}

function MiniStat({ label, value, highlight, index, inView }) {
  return (
    <div
      className={`rounded-xl p-3 border transition-all duration-300 hover:scale-[1.02] ${
        highlight
          ? 'border-white/10 hover:border-white/20'
          : 'bg-white/[0.02] border-white/5 hover:border-white/10'
      }`}
      style={{
        ...staggerStyle(inView, index, { animation: 'bts-popIn', baseDelay: 100, stagger: 50 }),
        ...(highlight ? { backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderColor: 'rgba(var(--accent-rgb), 0.1)' } : {}),
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-black ${highlight ? '' : 'text-white'}`}
        style={highlight ? { color: 'var(--accent)' } : undefined}>{value}</p>
    </div>
  )
}

function PhaseRow({ title, range, phase, index, inView }) {
  if (!phase?.balls) return null
  const runs = useCountUp(phase.runs || 0, 1200, inView)
  return (
    <div
      className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
      style={staggerStyle(inView, index, { animation: 'bts-fadeUp', baseDelay: 200, stagger: 100 })}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
        <p className="text-[10px] font-medium text-slate-600">Overs {range}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-white">
          {runs}<span className="text-[10px] text-slate-500"> runs</span> · {phase.runRate}<span className="text-[10px] text-slate-500"> RR</span>
        </p>
        <p className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>{phase.dotPct}% Dots</p>
      </div>
    </div>
  )
}

function TopPerformers({ inn, inView }) {
  if (!inn.topBatters?.length && !inn.topBowlers?.length) return null
  return (
    <div className="mt-10 grid gap-6 border-t border-white/5 pt-8 sm:grid-cols-2">
      {inn.topBatters?.length > 0 && (
        <div style={staggerStyle(inView, 0, { animation: 'bts-slideInLeft', baseDelay: 300 })}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Elite Batters</p>
            <div className="h-px flex-grow bg-white/5 ml-4" />
          </div>
          <ul className="space-y-4">
            {inn.topBatters.slice(0, 3).map((b, idx) => {
              const runPct = Math.min(100, (b.runs / 120) * 100)
              return (
                <li key={b.name} className="flex flex-col gap-1.5 group">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-white transition-colors duration-300 group-hover:text-theme-accent">{b.name}</span>
                    <span className="font-black" style={{ color: 'var(--accent)' }}>{b.runs}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, var(--accent-hover), var(--accent))`,
                        width: inView ? `${runPct}%` : '0%',
                        transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${300 + idx * 100}ms`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>{b.balls} Balls</span>
                    <span>SR {b.strikeRate ?? ((b.runs / b.balls) * 100).toFixed(1)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {inn.topBowlers?.length > 0 && (
        <div style={staggerStyle(inView, 1, { animation: 'bts-slideInRight', baseDelay: 300 })}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Elite Bowlers</p>
            <div className="h-px flex-grow bg-white/5 ml-4" />
          </div>
          <ul className="space-y-4">
            {inn.topBowlers.slice(0, 3).map((b, idx) => {
              const wktPct = Math.min(100, (b.wickets / 6) * 100)
              return (
                <li key={b.name} className="flex flex-col gap-1.5 group">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-white transition-colors duration-300 group-hover:text-blue-400">{b.name}</span>
                    <span className="font-black text-blue-400">
                      {b.wickets}
                      <span className="text-[10px] text-slate-500 font-bold ml-1">wkts</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                      style={{
                        width: inView ? `${wktPct}%` : '0%',
                        transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${300 + idx * 100}ms`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>{Math.floor(b.balls / 6)}.{b.balls % 6} Overs</span>
                    <span>Econ {b.economy}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
