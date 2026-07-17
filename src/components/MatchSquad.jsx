import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, staggerStyle } from '../utils/animations'

export default function MatchSquad({ squad, match }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [headerRef, headerInView] = useInView()
  const [ref, inView] = useInView()

  if (!squad) return null

  const hasPlayers = squad.team1.length > 0 || squad.team2.length > 0
  if (!hasPlayers) return null

  return (
    <section id="section-squad" className="scroll-mt-20 text-left space-y-6">
      <div ref={headerRef} style={{ animation: headerInView ? 'bts-fadeUp 0.6s ease-out both' : 'none' }}>
        <h2 className="text-xl font-extrabold tracking-tight text-white">Match Squads</h2>
        <p className="mt-1 text-sm text-slate-500">
          Players who batted or bowled in this match
        </p>
      </div>
      <div ref={ref} className="grid gap-6 lg:grid-cols-2">
        <TeamSquad team={match.team1} players={squad.team1} inView={inView} index={0} />
        <TeamSquad team={match.team2} players={squad.team2} inView={inView} index={1} />
      </div>
    </section>
  )
}

function TeamSquad({ team, players, inView, index }) {
  return (
    <div
      className="rounded-3xl border border-white/[0.06] bg-slate-900/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/10"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 150}ms both` : 'none',
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg transition-transform hover:scale-105"
          style={{
            backgroundColor: team.color,
            boxShadow: `0 8px 24px -6px ${team.color}66`,
            color: ['SRH', 'CSK'].includes(team.short) ? '#05070a' : '#fff',
          }}
        >
          {team.short}
        </span>
        <div>
          <h3 className="font-extrabold text-white text-base leading-tight">{team.name}</h3>
          <p className="text-xs font-semibold text-slate-500">{players.length} players with season data</p>
        </div>
      </div>
      {players.length === 0 ? (
        <p className="text-sm text-slate-500 italic py-4">No squad players linked for this season in the dataset.</p>
      ) : (
        <ul className="space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {players.map((p, idx) => (
            <PlayerRow key={p.name} player={p} index={idx} inView={inView} />
          ))}
        </ul>
      )}
    </div>
  )
}

function PlayerRow({ player, index, inView }) {
  const p = player.profile
  // Stagger slightly, cap at 10 items for animation delay to prevent long waits
  const animDelay = Math.min(index * 40, 400)
  return (
    <li
      className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:translate-x-1 border ${
        player.isPoM
          ? 'border-amber-500/35 bg-amber-500/10 hover:border-amber-500/50 shadow-md shadow-amber-500/5'
          : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/30'
      }`}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `bts-staggerFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${animDelay}ms both` : 'none',
      }}
    >
      <SquadRowHeader player={player} />
      <SquadRowStats player={player} profile={p} />
    </li>
  )
}

function SquadRowHeader({ player }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="font-bold text-white transition-colors duration-300 hover:text-theme-accent cursor-default">{player.name}</span>
      {player.isPoM && (
        <span
          className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300 border border-amber-500/25"
          style={{ animation: 'bts-vsPulse 2s ease-in-out infinite' }}
        >
          Player of Match
        </span>
      )}
    </div>
  )
}

function SquadRowStats({ player, profile }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      {profile ? (
        <>
          <span className="font-semibold text-slate-600">{profile.country}</span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span>{profile.battingLabel}</span>
          {profile.bowlingSkill && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>{profile.bowlingSkill}</span>
            </>
          )}
        </>
      ) : (
        <span className="italic text-slate-700">Profile unavailable</span>
      )}
      {player.matchStats && (
        <>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span className="font-bold px-2 py-0.5 rounded border" style={{
            color: 'var(--accent)',
            backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
            borderColor: 'rgba(var(--accent-rgb), 0.1)'
          }}>
            {player.matchStats.runs != null
              ? `${player.matchStats.runs} (${player.matchStats.balls}) SR ${player.matchStats.strikeRate ?? (player.matchStats.balls ? ((player.matchStats.runs / player.matchStats.balls) * 100).toFixed(1) : '—')}`
              : `${player.matchStats.wickets} wkts · Econ ${player.matchStats.economy}`}
          </span>
        </>
      )}
    </div>
  )
}
