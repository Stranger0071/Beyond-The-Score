// Main App Component - Cricket analytics dashboard for IPL and World Cup data
// Features: Tournament selection, match browsing, detailed scorecards, analytics, and player spotlights

import { useEffect, useMemo, useState } from 'react'
import {
  getMatches,
  getDatasetStats,
  loadMatchFull,
  seasons,
  enrichDatasetStats,
  getTournament,
  switchTournament
} from './data/loadMatches'
import { getMatchPlayers } from './data/loadPlayers'
import { glossary } from './data/glossary'
import Header from './components/Header'
import MatchScorecard from './components/MatchScorecard'
import MatchAnalytics from './components/MatchAnalytics'
import InsightCards from './components/InsightCards'
import KeyMoments from './components/KeyMoments'
import PlayerSpotlight from './components/PlayerSpotlight'
import MatchSquad from './components/MatchSquad'
import DatasetStats from './components/DatasetStats'
import Glossary from './components/Glossary'
import NavBar from './components/NavBar'
import HeadToHead from './components/HeadToHead'
import VenueStats from './components/VenueStats'
import MatchNarration from './components/MatchNarration'
import MatchesView from './components/MatchesView'

/**
 * HomeView Component - Landing page with feature overview and tournament introduction
 * Displays:
 * - Hero section with call-to-action buttons
 * - 6 feature cards highlighting key functionality
 * - Tournament dataset cards (IPL and World Cup)
 * - Data source and credibility note
 */
function HomeView({ stats, onNavigate }) {
  // Feature cards shown on landing page - each navigates to a specific section
  const homeFeatures = [
    { number: '01', title: 'Scorecards', desc: 'Follow the innings ball by ball, then linger over the partnerships and the wickets that changed it.', tab: 'section-scorecard' },
    { number: '02', title: 'The numbers behind it', desc: 'Rates, phases, wickets and momentum -- enough detail to test a hunch.', tab: 'section-analytics' },
    { number: '03', title: 'Match notes', desc: 'A plain-language recap of the turning points, for when the score alone is not the full story.', tab: 'section-narration' },
    { number: '04', title: 'Old rivalries', desc: 'See how a batter and bowler have actually fared against each other over time.', tab: 'section-h2h' },
    { number: '05', title: 'Ground truth', desc: 'Look at how the venue has played: chase, defend, toss and everything around them.', tab: 'section-venue' },
    { number: '06', title: 'Players worth a look', desc: 'A closer view of the people who made the match move.', tab: 'section-performers' },
  ]

  // Tournament metadata for display on landing
  const tournaments = [
    { code: 'IPL', name: 'Indian Premier League', range: '2008–2025', desc: 'T20 franchise cricket' },
    { code: 'ODI', name: 'ICC ODI World Cup', range: '1975–2023', desc: '50-over internationals' },
  ]

  return (
    <div className="home-notes mx-auto max-w-5xl space-y-12">
      {/* Hero Section */}
      <div className="home-hero relative border border-white/[0.06] bg-white/[0.025] p-8 sm:p-12 lg:p-16">

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">A cricket data notebook</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-4">
            Beyond The
            <br />
            <span style={{ color: 'var(--accent)' }}>Score</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
            The score tells you what happened. The balls, match-ups and little swings in momentum help explain why.
            Start anywhere in <strong>{stats.total}+ matches</strong> from {stats.yearRange}.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('section-matches')}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-[#05070a] transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Explore Matches <span>→</span>
            </button>
            <button
              onClick={() => onNavigate('section-overview')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/[0.08] cursor-pointer"
            >
              View Overview
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="mb-8 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--accent)' }}>Start with a question</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What are you curious about?</h2>
          <p className="text-sm text-slate-500 mt-1">There is no right order. Follow the bit of the match that stays with you.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeFeatures.map((f, i) => (
            <button
              key={i}
              onClick={() => onNavigate(f.tab)}
              className="home-feature group relative border border-white/[0.06] bg-white/[0.02] p-6 text-left transition-colors hover:bg-white/[0.05] hover:border-white/[0.12] cursor-pointer"
            >
              <span className="mb-5 block font-mono text-[11px] tracking-wider" style={{ color: 'var(--accent)' }}>{f.number}</span>
              <h3 className="text-sm font-extrabold text-white mb-1">{f.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Explore <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Section */}
      <div>
        <div className="mb-6 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--accent)' }}>Datasets</p>
          <h2 className="text-2xl font-extrabold text-white">The two competitions in this notebook</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tournaments.map((t, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
              <span className="w-9 text-xs font-bold tracking-wide" style={{ color: 'var(--accent)' }}>{t.code}</span>
              <div>
                <p className="text-sm font-extrabold text-white">{t.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t.range} · {t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A note on the data keeps the landing page grounded in the cricket. */}
      <div className="home-editor-note border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold" style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>DATA</div>
          <div>
            <p className="text-sm font-extrabold text-white">A note on the data</p>
            <p className="text-[10px] text-slate-500">Built from scorecards and ball-by-ball records</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          This is a place to browse, compare and occasionally disagree with the numbers. The records are detailed, but
          cricket is not always tidy: a dropped chance, a quiet over or a good match-up may matter more than a single stat.
        </p>
      </div>
    </div>
  )
}

/**
 * SettingsView Component - User preferences and customization panel
 * Allows users to configure:
 * - Dark/Light mode toggle
 * - 7 accent color themes
 * - Compact mode for denser layouts
 * - Auto-play animation controls
 */
function SettingsView({
  theme,
  onThemeChange,
  compactMode,
  onCompactModeChange,
  autoPlay,
  onAutoPlayChange,
  darkMode,
  onDarkModeChange
}) {
  // Available color themes with their hex values and descriptions
  const themes = [
    { id: 'emerald', label: 'Emerald Green', color: '#10b981', desc: 'Default' },
    { id: 'sapphire', label: 'Sapphire Blue', color: '#3b82f6', desc: 'Cool' },
    { id: 'ruby', label: 'Ruby Red', color: '#ef4444', desc: 'Bold' },
    { id: 'amber', label: 'Amber Orange', color: '#f59e0b', desc: 'Warm' },
    { id: 'amethyst', label: 'Amethyst Purple', color: '#a855f7', desc: 'Royal' },
    { id: 'cyan', label: 'Cyan Teal', color: '#06b6d4', desc: 'Fresh' },
    { id: 'rose', label: 'Rose Pink', color: '#f43f5e', desc: 'Vivid' },
  ]

  return (
    <div className="mx-auto max-w-4xl overflow-hidden border-y border-white/[0.08] bg-white/[0.025] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-8 sm:py-10"
      style={{ animation: 'bts-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {/* Header */}
      <div className="mb-10 border-b border-white/5 pb-6 text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
            ⚙️
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">System Settings</h2>
            <p className="text-sm font-medium text-slate-500">Customize your dashboard experience</p>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-left">
        {/* ── Appearance Mode ── */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Appearance</label>
            <p className="text-[11px] text-slate-600 mt-0.5">Choose dashboard display mode</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onDarkModeChange(false)}
              className={`flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-center transition-all duration-300 cursor-pointer ${
                !darkMode
                  ? 'border-white/20 bg-white/[0.06] text-theme-accent shadow-lg'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
              style={!darkMode ? { borderColor: 'rgba(var(--accent-rgb), 0.3)', background: 'rgba(var(--accent-rgb), 0.05)' } : undefined}
            >
              <span className="text-base">☀️</span>
              <span className="text-xs font-bold">Light Mode</span>
            </button>
            <button
              onClick={() => onDarkModeChange(true)}
              className={`flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-center transition-all duration-300 cursor-pointer ${
                darkMode
                  ? 'border-white/20 bg-white/[0.06] text-theme-accent shadow-lg'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
              style={darkMode ? { borderColor: 'rgba(var(--accent-rgb), 0.3)', background: 'rgba(var(--accent-rgb), 0.05)' } : undefined}
            >
              <span className="text-base">🌙</span>
              <span className="text-xs font-bold">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* ── Theme Selection ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Color Theme</label>
              <p className="text-[11px] text-slate-600 mt-0.5">Applied across all components</p>
            </div>
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 cursor-pointer ${
                  theme === t.id
                    ? 'border-white/20 bg-white/[0.06] text-white shadow-lg'
                    : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
                style={theme === t.id ? { borderColor: t.color + '50', boxShadow: `0 0 20px ${t.color}15` } : undefined}
              >
                <div className="relative">
                  <div className="h-5 w-5 rounded-full border border-white/10 transition-transform duration-300"
                    style={{
                      backgroundColor: t.color,
                      transform: theme === t.id ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: theme === t.id ? `0 0 12px ${t.color}60` : 'none'
                    }} />
                  {theme === t.id && (
                    <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-white flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold block">{t.label}</span>
                  <span className="text-[10px] text-slate-600">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Toggle Settings ── */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Preferences</label>
          <div className="space-y-3">
            <ToggleRow
              label="Compact Mode"
              desc="Reduce spacing and card padding for denser views"
              icon="CM"
              checked={compactMode}
              onChange={onCompactModeChange}
            />
            <ToggleRow
              label="Auto-Play Counters"
              desc="Automatically animate stat counters when cards scroll into view"
              icon="CT"
              checked={autoPlay}
              onChange={onAutoPlayChange}
            />
          </div>
        </div>

        {/* ── About ── */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
              style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}>
              📊
            </div>
            <div>
              <p className="text-xs font-bold text-white">Beyond The Score v4.1</p>
              <p className="text-[10px] text-slate-500">Cricket analytics dashboard · Built with React + Vite</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ToggleRow Component - Reusable toggle switch component for settings
 * Used for binary preferences like Compact Mode and Auto-Play
 */
function ToggleRow({ label, desc, icon, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        <div>
          <p className="text-xs font-bold text-white">{label}</p>
          <p className="text-[10px] text-slate-600 max-w-[240px]">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 rounded-full transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: checked ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
          boxShadow: checked ? `0 0 12px rgba(var(--accent-rgb), 0.3)` : 'none',
        }}
      >
        <div
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300"
          style={{ left: checked ? '24px' : '4px' }}
        />
      </button>
    </div>
  )
}

/**
 * TournamentView Component - Tournament selection and switching interface
 * Allows users to switch between IPL and World Cup datasets
 * Displays tournament info, match counts, and season ranges
 */
function TournamentView({ tournament, onTournamentChange, stats }) {
  // Tournament definitions with styling, metadata, and descriptions
  const tournaments = [
    {
      id: 'ipl',
      name: 'Indian Premier League',
      shortName: 'IPL',
      icon: '🏏',
      range: '2008–2025',
      desc: 'The biggest T20 cricket league in the world featuring franchise teams from Indian cities.',
      color: '#3b82f6',
      gradient: 'from-blue-600/20 to-indigo-600/10',
    },
    {
      id: 'wc',
      name: 'ICC ODI World Cup',
      shortName: 'World Cup',
      icon: '🏆',
      range: '1975–2023',
      desc: 'The pinnacle of international cricket — 50-over showdowns between national teams since 1975.',
      color: '#f59e0b',
      gradient: 'from-amber-600/20 to-orange-600/10',
    },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8"
      style={{ animation: 'bts-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {/* Header */}
      <div className="text-left border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
            🏆
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Tournament Selector</h2>
            <p className="text-sm font-medium text-slate-500">Switch between cricket tournament datasets</p>
          </div>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {tournaments.map((t, idx) => {
          const isActive = tournament === t.id
          return (
            <button
              key={t.id}
              onClick={() => onTournamentChange(t.id)}
              className={`group relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-left transition-all duration-500 cursor-pointer ${
                isActive
                  ? 'border-white/15 bg-gradient-to-br shadow-2xl scale-[1.02]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 hover:scale-[1.01]'
              } ${isActive ? t.gradient : ''}`}
              style={{
                animation: `bts-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 150}ms both`,
                ...(isActive ? { borderColor: t.color + '30', boxShadow: `0 20px 60px ${t.color}15` } : {}),
              }}
            >
              {/* Glow */}
              {isActive && (
                <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-[80px]"
                  style={{ backgroundColor: t.color, opacity: 0.12 }} />
              )}

              <div className="relative">
                {/* Active badge */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: t.color, boxShadow: `0 4px 12px ${t.color}40` }}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Active
                  </div>
                )}

                <span className="text-4xl block mb-4">{t.icon}</span>
                <h3 className="text-lg font-extrabold text-white mb-1">{t.name}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3"
                  style={{ color: isActive ? t.color : '#64748b' }}>
                  {t.range}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">{t.desc}</p>

                {/* Stats row */}
                {isActive && (
                  <div className="flex gap-4 border-t border-white/5 pt-4 mt-4">
                    <div>
                      <p className="text-lg font-black text-white">{stats.total}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Matches</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{stats.seasons}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Seasons</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{stats.tossWinPct}%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Toss Win</p>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Info note */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-start gap-3">
        <span className="text-lg mt-0.5">💡</span>
        <div>
          <p className="text-xs font-bold text-white mb-1">About Older World Cup Data</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Some older World Cup matches (pre-2010) may have limited ball-by-ball data. The scorecard will display
            available match results, margins, and toss info even when detailed innings data is unavailable.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * EmptyMatchFallback Component - Fallback UI when detailed ball-by-ball data is unavailable
 * Shows available match information: winner, margin, toss, venue
 * Used for older World Cup matches with limited historical data
 */
function EmptyMatchFallback({ match }) {
  return (
    <div className="rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center"
      style={{ animation: 'bts-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      <div className="mx-auto max-w-md">
        <span className="text-5xl block mb-4">📋</span>
        <h3 className="text-xl font-extrabold text-white mb-2">Limited Data Available</h3>
        <p className="text-sm text-slate-400 mb-6">
          Ball-by-ball data is not available for this match. Here's what we know:
        </p>

        {/* Result summary */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-left space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Winner</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--accent)' }}>{match.winner}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Result</span>
            <span className="text-sm font-bold text-white">{match.margin}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Toss</span>
            <span className="text-sm font-bold text-white">{match.tossWinner} · {match.tossDecision}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Venue</span>
            <span className="text-sm font-bold text-white">{match.venue}</span>
          </div>
          {match.competition && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Competition</span>
              <span className="text-sm font-bold text-white">{match.competition}</span>
            </div>
          )}
          {match.stage && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Stage</span>
              <span className="text-sm font-bold text-white">{match.stage}</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-600">
          Detailed analytics, scorecards, and player stats are available for matches with ball-by-ball coverage.
        </p>
      </div>
    </div>
  )
}

/**
 * Main App Component - Root container managing all application state and views
 * State Management:
 * - tournament: Current tournament (IPL or World Cup)
 * - darkMode, theme, compactMode, autoPlay: User preferences
 * - season: Selected season filter
 * - matchId: Currently viewed match
 * - match: Full match data (loaded asynchronously)
 * - activeTab: Current view section
 * 
 * Renders:
 * - Navigation sidebar
 * - Header with match/season selectors
 * - Various view components based on activeTab
 */
function App() {
  // ── State: User Preferences ──
  const [tournament, setTournamentState] = useState(() => getTournament())
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('bts_dark_mode')
      return stored === null ? true : stored === 'true'
    }
    return true
  })
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('bts_theme') || 'emerald'
    }
    return 'emerald'
  })
  const [compactMode, setCompactMode] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('bts_compact') === 'true'
    }
    return false
  })
  const [autoPlay, setAutoPlay] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const v = localStorage.getItem('bts_autoplay')
      return v === null ? true : v === 'true'
    }
    return true
  })

  // ── State: Data Selection ──
  const [season, setSeason] = useState('all')
  const filtered = useMemo(() => getMatches(season), [season, tournament])
  // Currently selected match ID from filtered list
  const [matchId, setMatchId] = useState(filtered[0]?.id)
  // Full match data loaded asynchronously
  const [match, setMatch] = useState(null)
  // Loading state for async match data fetch
  const [loading, setLoading] = useState(true)
  // Dataset statistics (total matches, seasons, toss win %)
  const [stats, setStats] = useState(() => getDatasetStats())
  // ── State: Navigation ──
  // Currently active view section (home, scorecard, analytics, etc.)
  const [activeTab, setActiveTab] = useState('section-home')

  // ── Derived State ──
  // Available seasons for current tournament
  const seasonsList = useMemo(() => [...seasons], [tournament])

  // Current match metadata from filtered list (summary info)
  const indexEntry = filtered.find((m) => m.id === matchId) ?? filtered[0]

  // Determines if analytics and advanced views should be available
  // Some older matches lack detailed ball-by-ball data
  const hasDetailedData = match && match.innings && match.innings.length > 0 && match.innings.some(inn => inn.balls > 0)

  // ── Effects: Persist and Apply User Settings ──
  // Sync dark mode preference to DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('mode-light')
    } else {
      document.body.classList.add('mode-light')
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bts_dark_mode', String(darkMode))
    }
  }, [darkMode])

  // Sync color theme to DOM and localStorage
  useEffect(() => {
    // Remove previous theme class
    document.body.classList.forEach((cls) => {
      if (cls.startsWith('theme-')) {
        document.body.classList.remove(cls)
      }
    })
    document.body.classList.add(`theme-${theme}`)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bts_theme', theme)
    }
  }, [theme])

  // Persist compact mode
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bts_compact', String(compactMode))
    }
  }, [compactMode])

  // Persist autoplay
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bts_autoplay', String(autoPlay))
    }
  }, [autoPlay])

  // Enrich dataset statistics with additional computed data when tournament changes
  useEffect(() => {
    enrichDatasetStats().then((extra) => setStats((s) => ({ ...s, ...extra })))
  }, [tournament])

  // ── Effects: Data Fetching ──
  // Load full match data when selected match changes
  useEffect(() => {
    if (!indexEntry) {
      setMatch(null)
      setLoading(false)
      return
    }
    setLoading(true)
    loadMatchFull(indexEntry.id, indexEntry.year)
      .then((full) => setMatch(full))
      .finally(() => setLoading(false))
  }, [indexEntry?.id, indexEntry?.year, tournament])

  // Extract player lineup from current match (memoized to prevent recalculations)
  const squad = useMemo(() => (match ? getMatchPlayers(match) : null), [match])

  // ── Event Handlers ──
  // Update filtered matches when season selection changes
  const handleSeasonChange = (value) => {
    setSeason(value)
    const next = getMatches(value)
    if (next.length) setMatchId(next[0].id)
  }

  // Switch between IPL and World Cup tournaments, reset filters
  const handleTournamentChange = (type) => {
    switchTournament(type)
    setTournamentState(type)
    setSeason('all')
    const next = getMatches('all')
    if (next.length) {
      setMatchId(next[0].id)
    }
    setStats(getDatasetStats())
  }

  // Update browser tab title based on current tournament
  useEffect(() => {
    const titleText = tournament === 'ipl' ? 'Beyond The Score · IPL Insights' : 'Beyond The Score · World Cup Insights'
    document.title = titleText
  }, [tournament])

  if (!indexEntry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f14] text-white">
        No matches found.
      </div>
    )
  }

  // ── Render Logic ──
  // Tabs that require detailed ball-by-ball data to function
  const detailTabs = ['section-analytics', 'section-performers', 'section-squad', 'section-h2h', 'section-venue']
  // Show fallback UI if user tries to view a detail tab without data
  const needsDetailAndMissing = !hasDetailedData && detailTabs.includes(activeTab) && !loading && match

  // Hide header on special views (settings, tournament picker, home)
  const hideHeader = activeTab === 'section-settings' || activeTab === 'section-tournament' || activeTab === 'section-home'

  return (
    // Main layout: sidebar navigation + main content area
    <div className="flex min-h-screen bg-[#05070a] text-white">
      {/* Navigation sidebar */}
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Main content area */}
      <div className="bts-main-content flex-1 min-w-0 px-4 pb-10 pt-6 sm:px-6 lg:pt-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header with match/season selector (hidden on certain views) */}
          {!hideHeader && (
            <Header
              tournament={tournament}
              match={match ?? indexEntry}
              matches={filtered}
              season={season}
              seasons={seasonsList}
              yearRange={stats.yearRange}
              onMatchChange={setMatchId}
              onSeasonChange={handleSeasonChange}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
          {/* View: Landing/Home */}
          {activeTab === 'section-home' && (
            <HomeView stats={stats} onNavigate={setActiveTab} />
          )}
          {/* View: Dataset Overview Statistics */}
          {activeTab === 'section-overview' && <DatasetStats stats={stats} />}

          {/* View: Tournament Selector */}
          {activeTab === 'section-tournament' && (
            <div className="min-h-[400px]">
              <TournamentView
                tournament={tournament}
                onTournamentChange={handleTournamentChange}
                stats={stats}
              />
            </div>
          )}

          {/* View: Matches List/Browse */}
          {activeTab === 'section-matches' && (
            <div className="min-h-[400px]">
              <MatchesView
                matches={filtered}
                onSelectMatch={setMatchId}
                onTabChange={setActiveTab}
                tournament={tournament}
              />
            </div>
          )}

          {/* Loading indicator for async match data */}
          {loading && activeTab !== 'section-settings' && activeTab !== 'section-tournament' && activeTab !== 'section-home' && (
            <p className="rounded-xl border border-white/10 bg-white/5 py-12 text-center text-slate-400">
              Loading ball-by-ball data…
            </p>
          )}

          {/* Views: Match Detail Sections (scorecard, analytics, player stats, etc.) */}
          {!loading && match && !['section-home', 'section-overview', 'section-tournament', 'section-matches', 'section-settings'].includes(activeTab) && (
            <div className="min-h-[400px]">
              {/* Show fallback UI if required data is missing */}
              {needsDetailAndMissing && <EmptyMatchFallback match={match} />}
              {/* Match Summary & Detailed Play-by-Play */}
              {activeTab === 'section-narration' && (hasDetailedData ? <MatchNarration match={match} /> : <EmptyMatchFallback match={match} />)}
              {activeTab === 'section-scorecard' && <MatchScorecard match={match} />}
              {/* Analytics Views - Rates, Phases, Momentum */}
              {activeTab === 'section-analytics' && hasDetailedData && <MatchAnalytics match={match} />}
              {/* Player Performance Highlights */}
              {activeTab === 'section-performers' && hasDetailedData && <PlayerSpotlight playerOfMatch={squad?.playerOfMatch} />}
              {/* Match Squad & Player Lineups */}
              {activeTab === 'section-squad' && hasDetailedData && <MatchSquad squad={squad} match={match} />}
              {/* Head-to-Head Batter vs Bowler Stats */}
              {activeTab === 'section-h2h' && hasDetailedData && <HeadToHead match={match} />}
              {/* Venue/Ground Statistics & Trends */}
              {activeTab === 'section-venue' && hasDetailedData && <VenueStats match={match} />}
              {/* Key Match Moments & Turning Points */}
              {activeTab === 'section-insights' && <InsightCards insights={match.insights} />}
              {activeTab === 'section-timeline' && <KeyMoments moments={match.keyMoments} />}
              {/* Glossary: Cricket Terms & Definitions */}
              {activeTab === 'section-glossary' && <Glossary terms={glossary} />}
            </div>
          )}

          {/* View: User Settings & Preferences */}
          {activeTab === 'section-settings' && (
            <SettingsView
              theme={theme}
              onThemeChange={setTheme}
              compactMode={compactMode}
              onCompactModeChange={setCompactMode}
              autoPlay={autoPlay}
              onAutoPlayChange={setAutoPlay}
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
            />
          )}

          <footer className="border-t border-white/10 pt-6 text-center text-xs text-slate-500">
            Beyond The Score · {stats.total} matches ({stats.yearRange})
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
