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

/* ── Home / Landing View ── */
function HomeView({ stats, onNavigate }) {
  const features = [
    { icon: '🏏', title: 'Live Scorecards', desc: 'Ball-by-ball breakdowns with detailed batting, bowling, and partnership analysis for every match.', tab: 'section-scorecard' },
    { icon: '📊', title: 'Deep Analytics', desc: 'Run rates, wagon wheels, fall of wickets, phase analysis, and economy breakdowns across innings.', tab: 'section-analytics' },
    { icon: '✨', title: 'AI Match Summaries', desc: 'GPT-powered narrative recaps that capture the drama, turning points, and key storylines.', tab: 'section-narration' },
    { icon: '⚔️', title: 'Head-to-Head', desc: 'Detailed rivalry stats between batters and bowlers — matchups, strike rates, and dismissal patterns.', tab: 'section-h2h' },
    { icon: '🏟️', title: 'Venue Intelligence', desc: 'Ground-specific stats including pitch behavior, toss advantage, and historical winning patterns.', tab: 'section-venue' },
    { icon: '⭐', title: 'Player Spotlight', desc: 'Performance profiles, career highlights, and impact analysis for standout performers.', tab: 'section-performers' },
  ]

  const tournaments = [
    { icon: '🏏', name: 'Indian Premier League', range: '2008–2025', desc: 'T20 franchise cricket' },
    { icon: '🏆', name: 'ICC ODI World Cup', range: '1975–2023', desc: '50-over internationals' },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16" style={{ animation: 'bts-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-white/[0.025] p-8 sm:p-12 lg:p-16">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full blur-[120px]" style={{ backgroundColor: 'var(--accent)', opacity: 0.08 }} />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full blur-[100px]" style={{ backgroundColor: 'var(--accent)', opacity: 0.05 }} />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Cricket Analytics Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-4">
            Beyond The
            <br />
            <span style={{ color: 'var(--accent)', textShadow: '0 0 40px var(--accent-glow)' }}>Score</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
            Dive deeper than the numbers. Explore ball-by-ball analytics, AI-generated match narratives,
            head-to-head rivalries, and venue intelligence across <strong>{stats.total}+ matches</strong> spanning {stats.yearRange}.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('section-matches')}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-[#05070a] transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', boxShadow: '0 8px 30px rgba(var(--accent-rgb), 0.3)' }}
            >
              Explore Matches <span>→</span>
            </button>
            <button
              onClick={() => onNavigate('section-overview')}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] cursor-pointer"
            >
              View Overview
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="mb-8 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--accent)' }}>Features</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Everything You Need</h2>
          <p className="text-sm text-slate-500 mt-1">Comprehensive tools for serious cricket analysis</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => onNavigate(f.tab)}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-left transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] hover:scale-[1.02] cursor-pointer"
              style={{ animation: `bts-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` }}
            >
              <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="text-2xl block mb-3">{f.icon}</span>
              <h3 className="text-sm font-extrabold text-white mb-1">{f.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: 'var(--accent)' }}>
                Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Section */}
      <div>
        <div className="mb-6 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--accent)' }}>Datasets</p>
          <h2 className="text-2xl font-extrabold text-white">Supported Tournaments</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tournaments.map((t, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04]">
              <span className="text-3xl">{t.icon}</span>
              <div>
                <p className="text-sm font-extrabold text-white">{t.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t.range} · {t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-base" style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}>⚡</div>
          <div>
            <p className="text-sm font-extrabold text-white">Built With Modern Tech</p>
            <p className="text-[10px] text-slate-500">React + Vite · Tailwind CSS · CSV Data Pipeline</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Beyond The Score processes raw CSV data from comprehensive cricket databases, transforming ball-by-ball records
          into rich, interactive visualizations. All analysis runs client-side — no server needed. AI summaries are
          generated via the Gemini API for supported matches.
        </p>
      </div>
    </div>
  )
}

/* ── Settings View ── */
function SettingsView({
  theme,
  onThemeChange,
  animSpeed,
  onAnimSpeedChange,
  compactMode,
  onCompactModeChange,
  autoPlay,
  onAutoPlayChange,
  darkMode,
  onDarkModeChange
}) {
  const themes = [
    { id: 'emerald', label: 'Emerald Green', color: '#10b981', desc: 'Default' },
    { id: 'sapphire', label: 'Sapphire Blue', color: '#3b82f6', desc: 'Cool' },
    { id: 'ruby', label: 'Ruby Red', color: '#ef4444', desc: 'Bold' },
    { id: 'amber', label: 'Amber Orange', color: '#f59e0b', desc: 'Warm' },
    { id: 'amethyst', label: 'Amethyst Purple', color: '#a855f7', desc: 'Royal' },
    { id: 'cyan', label: 'Cyan Teal', color: '#06b6d4', desc: 'Fresh' },
    { id: 'rose', label: 'Rose Pink', color: '#f43f5e', desc: 'Vivid' },
  ]

  const animOptions = [
    { id: 'fast', label: 'Fast', desc: '0.5× duration', icon: '⚡' },
    { id: 'normal', label: 'Normal', desc: '1× duration', icon: '▶️' },
    { id: 'slow', label: 'Cinematic', desc: '1.8× duration', icon: '🎬' },
    { id: 'none', label: 'Disabled', desc: 'No animations', icon: '⏹️' },
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

        {/* ── Animation Style ── */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Animation Style</label>
            <p className="text-[11px] text-slate-600 mt-0.5">Control motion speed throughout the dashboard</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {animOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onAnimSpeedChange(opt.id)}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-300 cursor-pointer ${
                  animSpeed === opt.id
                    ? 'border-white/20 bg-white/[0.06] text-white'
                    : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
                style={animSpeed === opt.id ? { borderColor: `rgba(var(--accent-rgb), 0.3)`, background: `rgba(var(--accent-rgb), 0.05)` } : undefined}
              >
                <span className="text-xl mb-1">{opt.icon}</span>
                <span className="text-xs font-bold">{opt.label}</span>
                <span className="text-[10px] text-slate-600 mt-0.5">{opt.desc}</span>
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
              icon="📐"
              checked={compactMode}
              onChange={onCompactModeChange}
            />
            <ToggleRow
              label="Auto-Play Counters"
              desc="Automatically animate stat counters when cards scroll into view"
              icon="🔢"
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

/* ── Tournament Selector View ── */
function TournamentView({ tournament, onTournamentChange, stats }) {
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

/* ── Empty Match Fallback ── */
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

function App() {
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
  const [animSpeed, setAnimSpeed] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('bts_anim_speed') || 'normal'
    }
    return 'normal'
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

  const [season, setSeason] = useState('all')
  const filtered = useMemo(() => getMatches(season), [season, tournament])
  const [matchId, setMatchId] = useState(filtered[0]?.id)
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(() => getDatasetStats())
  const [activeTab, setActiveTab] = useState('section-home')

  const seasonsList = useMemo(() => [...seasons], [tournament])

  const indexEntry = filtered.find((m) => m.id === matchId) ?? filtered[0]

  // Check if match has detailed ball-by-ball data
  const hasDetailedData = match && match.innings && match.innings.length > 0 && match.innings.some(inn => inn.balls > 0)

  // Apply light/dark mode body class
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

  useEffect(() => {
    // Apply theme body class
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

  // Apply animation speed
  useEffect(() => {
    document.body.classList.forEach((cls) => {
      if (cls.startsWith('anim-')) {
        document.body.classList.remove(cls)
      }
    })
    document.body.classList.add(`anim-${animSpeed}`)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bts_anim_speed', animSpeed)
    }
  }, [animSpeed])

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

  useEffect(() => {
    enrichDatasetStats().then((extra) => setStats((s) => ({ ...s, ...extra })))
  }, [tournament])

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

  const squad = useMemo(() => (match ? getMatchPlayers(match) : null), [match])

  const handleSeasonChange = (value) => {
    setSeason(value)
    const next = getMatches(value)
    if (next.length) setMatchId(next[0].id)
  }

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

  // Update browser page title dynamically
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

  // Tabs that need detailed ball-by-ball data
  const detailTabs = ['section-analytics', 'section-performers', 'section-squad', 'section-h2h', 'section-venue']
  const needsDetailAndMissing = !hasDetailedData && detailTabs.includes(activeTab) && !loading && match

  const hideHeader = activeTab === 'section-settings' || activeTab === 'section-tournament' || activeTab === 'section-home'

  return (
    <div className="flex min-h-screen bg-[#05070a] text-white">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="bts-main-content flex-1 min-w-0 px-4 pb-10 pt-6 sm:px-6 lg:pt-8">
        <div className="mx-auto max-w-6xl space-y-12">
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
          {activeTab === 'section-home' && (
            <HomeView stats={stats} onNavigate={setActiveTab} />
          )}
          {activeTab === 'section-overview' && <DatasetStats stats={stats} />}

          {activeTab === 'section-tournament' && (
            <div className="min-h-[400px]">
              <TournamentView
                tournament={tournament}
                onTournamentChange={handleTournamentChange}
                stats={stats}
              />
            </div>
          )}

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

          {loading && activeTab !== 'section-settings' && activeTab !== 'section-tournament' && activeTab !== 'section-home' && (
            <p className="rounded-xl border border-white/10 bg-white/5 py-12 text-center text-slate-400">
              Loading ball-by-ball data…
            </p>
          )}

          {!loading && match && !['section-home', 'section-overview', 'section-tournament', 'section-matches', 'section-settings'].includes(activeTab) && (
            <div className="min-h-[400px]">
              {needsDetailAndMissing && <EmptyMatchFallback match={match} />}
              {activeTab === 'section-narration' && (hasDetailedData ? <MatchNarration match={match} /> : <EmptyMatchFallback match={match} />)}
              {activeTab === 'section-scorecard' && <MatchScorecard match={match} />}
              {activeTab === 'section-analytics' && hasDetailedData && <MatchAnalytics match={match} />}
              {activeTab === 'section-performers' && hasDetailedData && <PlayerSpotlight playerOfMatch={squad?.playerOfMatch} />}
              {activeTab === 'section-squad' && hasDetailedData && <MatchSquad squad={squad} match={match} />}
              {activeTab === 'section-h2h' && hasDetailedData && <HeadToHead match={match} />}
              {activeTab === 'section-venue' && hasDetailedData && <VenueStats match={match} />}
              {activeTab === 'section-insights' && <InsightCards insights={match.insights} />}
              {activeTab === 'section-timeline' && <KeyMoments moments={match.keyMoments} />}
              {activeTab === 'section-glossary' && <Glossary terms={glossary} />}
            </div>
          )}

          {activeTab === 'section-settings' && (
            <SettingsView
              theme={theme}
              onThemeChange={setTheme}
              animSpeed={animSpeed}
              onAnimSpeedChange={setAnimSpeed}
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
