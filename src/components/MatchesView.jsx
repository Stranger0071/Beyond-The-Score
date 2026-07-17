import { useState, useMemo, useEffect } from 'react'
import { injectGlobalKeyframes, useInView, staggerStyle } from '../utils/animations'

export default function MatchesView({ matches, onSelectMatch, onTabChange, tournament }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [headerRef, headerInView] = useInView()
  const [listRef, listInView] = useInView()
  const [search, setSearch] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [selectedOutcome, setSelectedOutcome] = useState('all')
  const [selectedToss, setSelectedToss] = useState('all')

  // Generate dynamic list of teams from current matches list
  const teamsList = useMemo(() => {
    const map = new Map()
    matches.forEach(m => {
      if (m.team1 && m.team1Name) map.set(m.team1, m.team1Name)
      if (m.team2 && m.team2Name) map.set(m.team2, m.team2Name)
    })
    return [...map.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [matches])

  // Filter matches based on search term, team, outcome, and toss
  const filteredMatches = useMemo(() => {
    let result = matches

    // 1. Team filter
    if (selectedTeam !== 'all') {
      result = result.filter(m => m.team1 === selectedTeam || m.team2 === selectedTeam)
      
      // 2. Outcome filter (only valid when team selected)
      if (selectedOutcome === 'won') {
        result = result.filter(m => {
          const isTeam1 = m.team1 === selectedTeam
          const isTeam2 = m.team2 === selectedTeam
          return (isTeam1 && m.winner === m.team1Name) || 
                 (isTeam2 && m.winner === m.team2Name) || 
                 m.winner === selectedTeam
        })
      } else if (selectedOutcome === 'lost') {
        result = result.filter(m => {
          const isTeam1 = m.team1 === selectedTeam
          const isTeam2 = m.team2 === selectedTeam
          const won = (isTeam1 && m.winner === m.team1Name) || 
                      (isTeam2 && m.winner === m.team2Name) || 
                      m.winner === selectedTeam
          return !won && m.winner && m.winner !== 'Unknown' && m.winner !== 'tied'
        })
      }

      // 3. Toss filter
      if (selectedToss === 'won') {
        result = result.filter(m => {
          const isTeam1 = m.team1 === selectedTeam
          const isTeam2 = m.team2 === selectedTeam
          return (isTeam1 && m.tossWinner === m.team1Name) || 
                 (isTeam2 && m.tossWinner === m.team2Name) || 
                 m.tossWinner === selectedTeam
        })
      } else if (selectedToss === 'lost') {
        result = result.filter(m => {
          const isTeam1 = m.team1 === selectedTeam
          const isTeam2 = m.team2 === selectedTeam
          const wonToss = (isTeam1 && m.tossWinner === m.team1Name) || 
                          (isTeam2 && m.tossWinner === m.team2Name) || 
                          m.tossWinner === selectedTeam
          return !wonToss && m.tossWinner
        })
      }
    }

    // 4. Search text filter
    const q = search.toLowerCase().trim()
    if (q) {
      result = result.filter(m => 
        m.team1Name?.toLowerCase().includes(q) ||
        m.team2Name?.toLowerCase().includes(q) ||
        m.team1?.toLowerCase().includes(q) ||
        m.team2?.toLowerCase().includes(q) ||
        m.venue?.toLowerCase().includes(q) ||
        m.winner?.toLowerCase().includes(q) ||
        m.year?.toString().includes(q) ||
        m.date?.includes(q)
      )
    }

    return result
  }, [matches, search, selectedTeam, selectedOutcome, selectedToss])

  const handleMatchClick = (id) => {
    onSelectMatch(id)
    onTabChange('section-scorecard')
    // Smooth scroll to top of details
    setTimeout(() => {
      const el = document.getElementById('navbar-top') || document.getElementById('section-scorecard')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const formatResultText = (match) => {
    const outcome = match.winOutcome && !/^[ABN]$/i.test(match.winOutcome) ? match.winOutcome : ''
    if (/\b(?:won|win)\s+by\b/i.test(outcome)) return outcome
    return outcome ? `${match.winner} won by ${outcome}` : `${match.winner} won`
  }

  const formatNoResultText = (match) => {
    if (match.winner === 'tied') return 'Match tied'
    return match.winOutcome || 'No result'
  }

  const isWc = tournament === 'wc'

  return (
    <section id="section-matches-view" className="scroll-mt-20 space-y-6 text-left">
      {/* Header & Search */}
      <div 
        ref={headerRef} 
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6"
        style={{ animation: headerInView ? 'bts-fadeUp 0.6s ease-out both' : 'none' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
              style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
              📅
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                {isWc ? 'World Cup Matches' : 'IPL Matches'}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Browse through all matches in the active season
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search teams, venues, or years..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-500 transition-all hover:bg-white/[0.04] focus:border-theme-accent focus:bg-slate-900/50 focus:outline-none focus:ring-1 focus:ring-theme-accent"
          />
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <svg className="h-4.5 w-4.5 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/10 p-1 text-[9px] font-black uppercase text-slate-400 hover:bg-white/20 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
        {/* Team Selector */}
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Filter by Team</label>
          <div className="group relative">
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value)
                setSelectedOutcome('all') // Reset sub-filters
                setSelectedToss('all')
              }}
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 pr-10 text-xs font-bold text-white transition-all hover:bg-slate-900 focus:border-theme-accent focus:outline-none cursor-pointer"
            >
              <option value="all" className="bts-option">All Teams</option>
              {teamsList.map(t => (
                <option key={t.id} value={t.id} className="bts-option">{t.name} ({t.id})</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-theme-accent transition-colors duration-200">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Outcome Selector (visible only when a team is selected) */}
        {selectedTeam !== 'all' && (
          <>
            <div className="flex flex-col gap-1.5 min-w-[140px]">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Match Outcome</label>
              <div className="group relative">
                <select
                  value={selectedOutcome}
                  onChange={(e) => setSelectedOutcome(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 pr-10 text-xs font-bold text-white transition-all hover:bg-slate-900 focus:border-theme-accent focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bts-option">All Results</option>
                  <option value="won" className="bts-option">Won Matches</option>
                  <option value="lost" className="bts-option">Lost Matches</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-theme-accent transition-colors duration-200">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[140px]">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Toss Outcome</label>
              <div className="group relative">
                <select
                  value={selectedToss}
                  onChange={(e) => setSelectedToss(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 pr-10 text-xs font-bold text-white transition-all hover:bg-slate-900 focus:border-theme-accent focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bts-option">All Tosses</option>
                  <option value="won" className="bts-option">Won Toss</option>
                  <option value="lost" className="bts-option">Lost Toss</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-theme-accent transition-colors duration-200">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Reset Button */}
        {(selectedTeam !== 'all' || search) && (
          <button
            onClick={() => {
              setSelectedTeam('all')
              setSelectedOutcome('all')
              setSelectedToss('all')
              setSearch('')
            }}
            className="sm:mt-5 ml-auto rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-black text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>


      {/* Matches Grid List */}
      {filteredMatches.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.06] bg-slate-900/20 py-20 text-center backdrop-blur-xl">
          <span className="text-4xl block mb-2">🔍</span>
          <p className="text-sm text-slate-400">No matches match your search terms.</p>
        </div>
      ) : (
        <div 
          ref={listRef} 
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {filteredMatches.map((m, idx) => {
            const animDelay = Math.min(idx * 30, 300)
            const hasOutcome = m.winner && !['Unknown', 'No Result', 'tied'].includes(m.winner)
            const hasScores = Boolean(m.team1Score || m.team2Score)
            return (
              <article
                key={m.id}
                onClick={() => handleMatchClick(m.id)}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-5 transition-all duration-300 hover:border-theme-accent-20 hover:-translate-y-1 hover:bg-black/30 hover:shadow-xl cursor-pointer"
                style={{
                  opacity: listInView ? 1 : 0,
                  animation: listInView ? `bts-staggerFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${animDelay}ms both` : 'none',
                }}
              >
                {/* Micro hover glow radial background */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at center, rgba(var(--accent-rgb), 0.08) 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top metadata line */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>{m.date}</span>
                    <span className="rounded bg-white/5 px-2 py-0.5 border border-white/5 text-slate-400">
                      {isWc ? `WC ${m.year}` : `IPL ${m.year}`}
                    </span>
                  </div>

                  {/* Versus Teams block */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-base leading-tight group-hover:text-theme-accent transition-colors duration-300">
                        {m.team1Name || m.team1}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {m.team1}
                      </span>
                    </div>
                    <div className="text-[10px] font-black text-slate-600 tracking-widest pl-1">VS</div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-base leading-tight group-hover:text-theme-accent transition-colors duration-300">
                        {m.team2Name || m.team2}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {m.team2}
                      </span>
                    </div>
                    {hasScores && (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.03] px-2.5 py-2">
                          <p className="font-black uppercase tracking-wider text-slate-500">{m.team1}</p>
                          <p className="mt-0.5 font-extrabold text-white">{m.team1Score || 'Score unavailable'}</p>
                        </div>
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.03] px-2.5 py-2">
                          <p className="font-black uppercase tracking-wider text-slate-500">{m.team2}</p>
                          <p className="mt-0.5 font-extrabold text-white">{m.team2Score || 'Score unavailable'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toss information */}
                  <div className="text-[11px] font-medium text-slate-400 border-t border-white/[0.04] pt-3">
                    {m.tossWinner && (
                      <p className="truncate">
                        🪙 Toss: <span className="text-white font-bold">{m.tossWinner}</span> ({m.tossDecision})
                      </p>
                    )}
                  </div>

                  {/* Winner Summary Banner */}
                  {hasOutcome ? (
                    <div 
                      className="rounded-lg px-3 py-2 text-xs font-bold flex items-center justify-between border transition-all duration-300"
                      style={{
                        backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                        borderColor: 'rgba(var(--accent-rgb), 0.1)',
                        color: 'var(--accent)'
                      }}
                    >
                      <span className="truncate max-w-[85%]">
                        🏆 {formatResultText(m)}
                      </span>
                      <span className="text-[9px] font-black opacity-80 uppercase tracking-widest">Score ➔</span>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-800/10 border border-slate-700/10 px-3 py-2 text-xs font-bold text-slate-500">
                      📝 {formatNoResultText(m)}
                    </div>
                  )}

                  {/* Venue info */}
                  <p className="text-[10px] text-slate-600 truncate pt-1">
                    🏟️ {m.venue}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
