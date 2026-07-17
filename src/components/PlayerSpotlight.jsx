import { useEffect } from 'react'
import { formatBattingHand } from '../utils/playerLookup'
import { injectGlobalKeyframes, useInView, useCountUp, staggerStyle } from '../utils/animations'

export default function PlayerSpotlight({ playerOfMatch }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [ref, inView] = useInView()

  if (!playerOfMatch) return null

  const { profile, name } = playerOfMatch

  return (
    <section
      ref={ref}
      id="section-performers"
      className="scroll-mt-20 rounded-[2.5rem] border p-6 text-left sm:p-10 shadow-2xl relative overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? 'bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
        boxShadow: inView ? '0 20px 50px -12px rgba(var(--accent-rgb), 0.15)' : 'none',
        borderColor: 'rgba(var(--accent-rgb), 0.3)',
        background: 'linear-gradient(to bottom right, rgba(var(--accent-rgb), 0.1), rgba(var(--accent-rgb), 0.05), transparent)',
      }}
    >
      {/* Decorative Glow in background */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }} />

      <p
        className="text-xs font-black uppercase tracking-[0.25em]"
        style={{ ...staggerStyle(inView, 0), color: 'var(--accent)' }}
      >
        ✨ Player of the Match
      </p>

      <PlayerHeader name={name} profile={profile} inView={inView} />

      {profile && <ProfileGrid profile={profile} inView={inView} />}

      {playerOfMatch.matchStats && <MatchStatsBlock stats={playerOfMatch.matchStats} inView={inView} />}

      <p
        className="mt-6 text-sm leading-relaxed border-l-2 pl-4 italic"
        style={{ ...staggerStyle(inView, 4, { baseDelay: 500, animation: 'bts-fadeIn' }), borderColor: 'rgba(var(--accent-rgb), 0.3)', color: 'var(--text-secondary)' }}
      >
        {playerOfMatch.fanTakeaway}
      </p>
    </section>
  )
}

function PlayerHeader({ name, profile, inView }) {
  const initials = profile?.initials ?? name.slice(0, 2).toUpperCase()
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      {/* Animated initials circle */}
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-black border"
        style={{
          opacity: inView ? 1 : 0,
          animation: inView ? 'bts-scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both, bts-float 3s ease-in-out infinite' : 'none',
          boxShadow: '0 8px 24px rgba(var(--accent-rgb), 0.2)',
          backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
          borderColor: 'rgba(var(--accent-rgb), 0.3)',
          color: 'var(--accent)',
        }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1" style={staggerStyle(inView, 1, { baseDelay: 200 })}>
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">{name}</h2>
        {profile ? (
          <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">
            {profile.country} · {profile.battingLabel}
            {profile.bowlingSkill ? ` · ${profile.bowlingSkill}` : ''}
          </p>
        ) : (
          <p className="mt-1 text-sm text-[var(--text-muted)]">Player profile unavailable</p>
        )}
      </div>
    </div>
  )
}

function ProfileGrid({ profile, inView }) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Detail label="Date of birth" value={profile.dobDisplay ?? '—'} index={0} inView={inView} />
      <Detail label="Age" value={profile.age != null ? `${profile.age} yrs` : '—'} index={1} inView={inView} />
      <Detail label="Batting" value={formatBattingHand(profile.battingHand)} index={2} inView={inView} />
      <Detail label="Bowling" value={profile.bowlingSkill || '—'} index={3} inView={inView} />
    </dl>
  )
}

function MatchStatsBlock({ stats, inView }) {
  const runs = useCountUp(stats.runs || 0, 1400, inView)
  const wickets = useCountUp(stats.wickets || 0, 1400, inView)

  if (stats.runs != null) {
    return (
      <div
        className="mt-5 rounded-2xl p-4 border shadow-inner"
        style={{
          opacity: inView ? 1 : 0,
          animation: inView ? 'bts-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 400ms both' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(var(--accent-rgb), 0.15)',
        }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Match Contribution</p>
        <p className="mt-2 text-base font-extrabold text-[var(--text-primary)]">
          <span className="text-xl font-black" style={{ color: 'var(--accent)' }}>{runs}</span> runs · {stats.balls} balls · SR {stats.strikeRate ?? (stats.balls ? ((stats.runs / stats.balls) * 100).toFixed(1) : '—')}
          {stats.fours != null ? ` · ${stats.fours}×4 ${stats.sixes}×6` : ''}
        </p>
      </div>
    )
  }
  if (stats.wickets != null) {
    return (
      <div
        className="mt-5 rounded-2xl p-4 border shadow-inner"
        style={{
          opacity: inView ? 1 : 0,
          animation: inView ? 'bts-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 400ms both' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(var(--accent-rgb), 0.15)',
        }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Match Contribution</p>
        <p className="mt-2 text-base font-extrabold text-[var(--text-primary)]">
          <span className="text-xl font-black" style={{ color: 'var(--accent)' }}>{wickets}</span> wickets · {stats.balls} balls · Economy {stats.economy}
        </p>
      </div>
    )
  }
  return null
}

function Detail({ label, value, index, inView }) {
  return (
    <div
      className="rounded-xl p-4 border border-white/5 transition-colors duration-300 glass-panel"
      style={staggerStyle(inView, index, { animation: 'bts-popIn', baseDelay: 300, stagger: 60 })}
    >
      <dt className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-black text-[var(--text-primary)]">{value}</dd>
    </div>
  )
}
