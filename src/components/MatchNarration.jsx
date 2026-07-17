import { useState, useEffect } from 'react'
import { injectGlobalKeyframes, useInView, staggerStyle } from '../utils/animations'

// Gemini API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""

export default function MatchNarration({ match }) {
  const [reportType, setReportType] = useState('normal')
  const [normalNarration, setNormalNarration] = useState('')
  const [comprehensiveNarration, setComprehensiveNarration] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [pendingRetry, setPendingRetry] = useState(null)
  const [prevMatchId, setPrevMatchId] = useState(match.id)

  useEffect(() => { injectGlobalKeyframes() }, [])

  const [headerRef, headerInView] = useInView()
  const [cardRef, cardInView] = useInView()

  // Immediately clear stale content during render when match changes (before paint)
  if (match.id !== prevMatchId) {
    setPrevMatchId(match.id)
    setNormalNarration('')
    setComprehensiveNarration('')
    setReportType('normal')
    setLoading(true)
    setError('')
  }

  // Construct match context for the AI
  const matchContext = `
    Match: ${match.team1.name} vs ${match.team2.name} (${match.year} season)
    Venue: ${match.venue}
    Toss: ${match.tossWinner} won and chose to ${match.tossDecision}
    First Innings: ${match.team1.runs}/${match.team1.wickets} in ${match.team1.overs} overs
    Second Innings: ${match.team2.runs}/${match.team2.wickets} in ${match.team2.overs} overs
    Result: ${match.winner} won by ${match.margin}
    Player of the Match: ${match.playerOfMatch}
  `

  // Handle countdown timer — auto-retry when it reaches 0
  useEffect(() => {
    if (countdown <= 0) {
      if (pendingRetry) {
        setError('')
        const retryType = pendingRetry
        setPendingRetry(null)
        generateNarration(retryType)
      }
      return
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const generateNarration = async (type) => {
    if (!GEMINI_API_KEY) return
    setLoading(true)
    setError('')
    try {
      const isComp = type === 'comprehensive'
      const prompt = isComp
        ? `You are an expert cricket analyst and sports commentator. Write a highly detailed, comprehensive match report summarizing this match. 
           Please organize your report into the following sections with clear, bold headers and emojis:
           
           🏟️ VENUE & PITCH CONDITIONS:
           Analyze the venue (${match.venue}) and pitch behavior (spin, pace, bounce, boundary sizes) during this match, and how the toss decision played into this. Include realistic simulated weather details (temperature, humidity, and the crucial dew factor for evening matches) and how they influenced the gameplay (e.g., grip on the ball, swing).
           
           🏏 INNINGS BREAKDOWN & TURNING POINTS:
           A chronological analysis of the key phases of both innings, highlighting pivotal partnerships, critical bowling spells, and momentum-shifting moments.
           
           🎯 TACTICAL REVIEW & MOTM:
           Evaluate the captaincy decisions, tactical execution, and how the Player of the Match (${match.playerOfMatch}) carried their team to victory.
           
           Make it sound highly professional, expert-level, and dramatic. Use clean formatting with double line breaks between sections. Here are the match details:\n${matchContext}`
        : `You are an expert cricket commentator. Write a short, engaging, and highly concise narration (1 paragraph, max 5-6 sentences) summarizing this match. Make it sound professional, dramatic, and focusing on the overall result and key players. Here are the details:\n${matchContext}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      )

      if (response.status === 429) {
        setCountdown(60)
        throw new Error("Quota exceeded")
      }

      const data = await response.json()

      if (data.error?.code === 429 || data.error?.status === "RESOURCE_EXHAUSTED" || (data.error?.message && /quota|exhausted|429/i.test(data.error.message))) {
        setCountdown(60)
        throw new Error("Quota exceeded")
      }

      if (data.error) throw new Error(data.error.message || 'Failed to generate narration')

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        if (isComp) {
          setComprehensiveNarration(text)
        } else {
          setNormalNarration(text)
        }
      }
    } catch (err) {
      if (err.message === "Quota exceeded" || /quota|exhausted|429/i.test(err.message)) {
        setCountdown(60)
        setPendingRetry(type)
        setError("Gemini API Quota Limit Reached! Auto-retrying when the countdown completes.")
      } else {
        setError(err.message || 'An error occurred while generating the summary.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Trigger API call when match changes
  useEffect(() => {
    if (countdown > 0) {
      setPendingRetry('normal')
      setError("Gemini API Quota Limit Reached! Auto-retrying when the countdown completes.")
      setLoading(false)
      return
    }

    if (GEMINI_API_KEY) {
      generateNarration('normal')
    } else {
      setError("Please add your Gemini API Key in src/components/MatchNarration.jsx (line 4)")
      setLoading(false)
    }
  }, [match.id])

  const handleTypeChange = (type) => {
    setReportType(type)
    if (type === 'comprehensive' && !comprehensiveNarration && !loading) {
      generateNarration('comprehensive')
    } else if (type === 'normal' && !normalNarration && !loading) {
      generateNarration('normal')
    }
  }

  const currentContent = reportType === 'comprehensive' ? comprehensiveNarration : normalNarration

  return (
    <section className="space-y-8">
      <div ref={headerRef} className="flex items-center gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2" style={staggerStyle(headerInView, 0)}>
          <span className="inline-block animate-bounce">✨</span> AI Match Narration
        </h2>
        <div
          className="h-px flex-grow bg-white/5"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
            animation: headerInView ? 'bts-drawLine 1s ease-out 0.2s both' : 'none',
          }}
        />
      </div>

      <div
        ref={cardRef}
        className="overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-white/[0.025] p-8 sm:p-10 shadow-2xl backdrop-blur-xl"
        style={{
          opacity: cardInView ? 1 : 0,
          animation: cardInView ? 'bts-fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
        }}
      >
        <div className="space-y-6">

          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-white/5 pb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                AI Match Commentary
              </p>
              <h3 className="text-lg font-bold text-white mt-1">
                {match.team1.short} vs {match.team2.short}
              </h3>
            </div>

            {/* Toggle Pills */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/5 w-fit shrink-0 shadow-inner">
              <button
                onClick={() => handleTypeChange('normal')}
                disabled={loading || countdown > 0}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${reportType === 'normal'
                    ? 'text-[#05070a] font-black shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                  } ${(loading || countdown > 0) ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                style={reportType === 'normal' ? {
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 10px 15px -3px rgba(var(--accent-rgb), 0.2)'
                } : undefined}
              >
                Quick Summary
              </button>
              <button
                onClick={() => handleTypeChange('comprehensive')}
                disabled={loading || countdown > 0}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${reportType === 'comprehensive'
                    ? 'text-[#05070a] font-black shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                  } ${(loading || countdown > 0) ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                style={reportType === 'comprehensive' ? {
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 10px 15px -3px rgba(var(--accent-rgb), 0.2)'
                } : undefined}
              >
                Comprehensive Report
              </button>
            </div>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 animate-pulse">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--accent)' }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Generating {reportType === 'comprehensive' ? 'Comprehensive Report' : 'Quick Summary'}...
              </p>
            </div>
          ) : countdown > 0 ? (
            /* Rate Limit Countdown Card */
            <div className="flex flex-col items-center justify-center py-12 px-6 rounded-3xl border border-amber-500/10 bg-amber-500/[0.03] text-center space-y-4 max-w-xl mx-auto shadow-xl backdrop-blur-md">
              <span className="text-4xl animate-bounce">⏳</span>
              <div>
                <h4 className="text-base font-black text-amber-400 uppercase tracking-widest">Gemini API Quota Exceeded</h4>
                <p className="mt-2 text-sm text-slate-300 font-medium">
                  The Google AI Studio free-tier rate limit has been temporarily reached.
                </p>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  Auto-retrying in <span className="font-extrabold text-sm px-1 rounded border" style={{
                    color: 'var(--accent)',
                    backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                    borderColor: 'rgba(var(--accent-rgb), 0.1)'
                  }}>{countdown}s</span> — sit tight!
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden max-w-xs mt-2 ring-1 ring-white/10">
                <div
                  className="h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(countdown / 60) * 100}%`,
                    background: `linear-gradient(to right, var(--accent-hover), var(--accent))`
                  }}
                />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <p className="text-sm font-bold text-red-400">{error}</p>
            </div>
          ) : currentContent ? (
            <div
              className="relative p-2"
              style={{
                animation: 'bts-typewriter 1s ease-out both',
              }}
            >
              <span className="absolute -left-4 -top-4 text-6xl text-white/5 font-serif select-none">"</span>
              <div className="text-slate-300 font-medium relative z-10 whitespace-pre-line leading-relaxed text-sm sm:text-base space-y-4">
                {currentContent}
              </div>
              <span className="absolute -bottom-8 right-0 text-6xl text-white/5 font-serif rotate-180 select-none">"</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
