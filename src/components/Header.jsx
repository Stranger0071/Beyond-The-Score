export default function Header({ tournament, match, matches, season, seasons, yearRange, onMatchChange, onSeasonChange, activeTab, onTabChange }) {
  const isWc = tournament === 'wc'

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)', opacity: 0.9 }}>
            Live Intelligence
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Beyond <span style={{ color: 'var(--accent)' }}>The Score</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-400">
          {isWc ? 'ICC World Cup Analytics' : 'IPL Data Analytics'} · {yearRange || '2008–2025'} · {matches.length} matches
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="group relative">
          <select
            value={season}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="appearance-none rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 pr-10 text-sm font-semibold text-white transition-all hover:bg-white/10 focus:outline-none cursor-pointer"
            style={{ '--focus-color': 'rgba(var(--accent-rgb), 0.5)' }}
            aria-label="Filter by season"
          >
            <option value="all" className="bts-option">
              All seasons
            </option>
            {seasons.map((s) => (
              <option key={s} value={s} className="bts-option">
                {isWc ? `WC ${s}` : `IPL ${s}`}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-theme-accent">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {activeTab !== 'section-matches' && (
          <button
            onClick={() => onTabChange('section-matches')}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-white/5 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{
              borderColor: 'rgba(var(--accent-rgb), 0.3)',
              backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
              color: 'var(--text-primary)'
            }}
          >
            <span>📅</span> Browse Matches
          </button>
        )}
      </div>
    </header>
  )
}
