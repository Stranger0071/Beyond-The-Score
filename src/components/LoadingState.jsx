import { useState, useEffect } from 'react'

/**
 * LoadingState Component
 * Displays a premium animated loading indicator with rotating engagement phrases
 * to keep users hooked during page loads and AI narration generation.
 *
 * @param {string} [title] - Optional section title (e.g. "Generating Commentary...")
 * @param {string[]} [phrases] - Array of messages to rotate through
 * @param {string} [variant] - 'card' | 'inline' | 'hero'
 */
export default function LoadingState({
  title = 'Retrieving Data...',
  phrases = [
    'Retrieving ball-by-ball telemetry & match stats...',
    'Analyzing innings run-rates & phase transitions...',
    'Calculating partnership momentum & turning points...',
    'Processing boundary frequencies & dot-ball pressure...',
    'Generating AI commentary & tactical takeaways...',
  ],
  variant = 'card',
}) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (!phrases || phrases.length <= 1) return

    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        setFade(true)
      }, 300)
    }, 2200)

    return () => clearInterval(interval)
  }, [phrases])

  const currentPhrase = phrases[currentPhraseIndex] || 'Loading match data...'

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 py-4 px-2">
        <div className="relative flex h-6 w-6 items-center justify-center shrink-0">
          <div className="absolute h-full w-full rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <div className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent)' }} />
        </div>
        <p className="text-xs font-semibold text-slate-300 transition-opacity duration-300">
          {currentPhrase}
        </p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl transition-all"
      style={{ animation: 'bts-fadeUp 0.5s ease-out both' }}
    >
      {/* Glow background effect */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full blur-[90px] opacity-20"
        style={{ backgroundColor: 'var(--accent)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Animated Cricket Loader Icon Ring */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          {/* Rotating gradient border */}
          <div
            className="absolute inset-0 rounded-full border-3 border-transparent border-t-emerald-400 border-r-teal-500 animate-spin"
            style={{
              borderColor: 'transparent',
              borderTopColor: 'var(--accent)',
              borderRightColor: 'rgba(var(--accent-rgb), 0.4)',
            }}
          />
          {/* Center icon */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-xl animate-pulse"
            style={{ boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.3)' }}
          >
            🏏
          </div>
        </div>

        {/* Title & Rotating Phrase */}
        <div className="space-y-2 max-w-md">
          {title && (
            <h4
              className="text-xs font-black uppercase tracking-[0.25em]"
              style={{ color: 'var(--accent)' }}
            >
              {title}
            </h4>
          )}
          <p
            className={`text-sm sm:text-base font-semibold text-slate-200 transition-all duration-300 ease-in-out min-h-[1.5rem] ${
              fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            }`}
          >
            {currentPhrase}
          </p>
        </div>

        {/* Animated Progress Bar Indicator */}
        <div className="w-full max-w-xs bg-white/5 rounded-full h-1 overflow-hidden ring-1 ring-white/10 mt-2">
          <div
            className="h-full rounded-full animate-pulse"
            style={{
              width: '60%',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              animation: 'bts-loader-slide 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  )
}
