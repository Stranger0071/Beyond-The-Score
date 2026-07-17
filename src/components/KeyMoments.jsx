import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, staggerStyle } from '../utils/animations'

const eventColors = {
  Wicket: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5',
  Six: '',
  Milestone: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5',
  Win: '',
  Toss: 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-sky-500/5',
  Tie: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/5',
  Note: 'bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-slate-500/5',
}

const eventIcons = {
  Wicket: '🔴',
  Six: '🏏',
  Milestone: '👑',
  Win: '🏆',
  Toss: '🪙',
  Tie: '🤝',
  Note: '📝',
}

export default function KeyMoments({ moments }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [headerRef, headerInView] = useInView()
  const [listRef, listInView] = useInView()

  return (
    <section
      id="section-timeline"
      className="scroll-mt-20 rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-left relative overflow-hidden"
      style={{ animation: 'bts-fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      <div ref={headerRef} className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-white" style={staggerStyle(headerInView, 0)}>Match Timeline</h2>
        <div
          className="h-px flex-grow"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
            animation: headerInView ? 'bts-drawLine 1s ease-out 0.2s both' : 'none',
          }}
        />
      </div>

      <div ref={listRef} className="relative pl-1">
        {/* Animated timeline connecting line */}
        <div
          className="absolute left-[4.2rem] top-2 bottom-2 w-0.5"
          style={{
            height: listInView ? '100%' : '0%',
            transition: 'height 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
            background: 'linear-gradient(to bottom, rgba(var(--accent-rgb), 0.3), #1e293b, transparent)'
          }}
        />

        <ol className="space-y-6 relative z-10">
          {moments.map((m, i) => (
            <li
              key={i}
              className="flex gap-4 group"
              style={staggerStyle(listInView, i, { animation: 'bts-staggerFadeUp', stagger: 70 })}
            >
              {/* Over Indicator */}
              <span className="w-14 shrink-0 text-sm font-mono font-black mt-0.5 text-right pr-2" style={{ color: 'var(--accent)' }}>
                {m.over}
              </span>

              {/* Event Block */}
              <div className="min-w-0 flex-1 border-l border-white/10 pl-5 relative">
                {/* Timeline node dot indicator */}
                <div className="absolute -left-[5px] top-2.5 h-2 w-2 rounded-full bg-slate-900 border-2 border-slate-700 transition-all duration-300 group-hover:scale-125 group-hover-border-theme-accent" />

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black uppercase tracking-wider border shadow-md ${
                      eventColors[m.event] || 'bg-slate-600/10 text-slate-300 border-slate-600/20'
                    }`}
                    style={m.event === 'Six' || m.event === 'Win' ? {
                      backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                      color: 'var(--accent)',
                      borderColor: 'rgba(var(--accent-rgb), 0.2)',
                      boxShadow: '0 0 5px var(--accent-glow)'
                    } : undefined}
                  >
                    <span>{eventIcons[m.event] || '⚫'}</span>
                    {m.event}
                  </span>
                  <span className="font-extrabold text-white transition-colors duration-300 group-hover-text-theme-accent">{m.player}</span>
                </div>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {m.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
