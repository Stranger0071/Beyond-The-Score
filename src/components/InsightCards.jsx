import { useEffect } from 'react'
import { injectGlobalKeyframes, useInView, staggerStyle } from '../utils/animations'

const styles = {
  warning: 'border-amber-500/20 bg-amber-500/[0.03] text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/[0.06]',
  tip: 'border-sky-500/20 bg-sky-500/[0.03] text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/[0.06]',
}

const glows = {
  warning: 'rgba(245, 158, 11, 0.15)',
  tip: 'rgba(14, 165, 233, 0.15)',
}

const icons = { highlight: '★', warning: '⚡', tip: '💡' }

export default function InsightCards({ insights }) {
  useEffect(() => { injectGlobalKeyframes() }, [])
  const [headerRef, headerInView] = useInView()
  const [gridRef, gridInView] = useInView()

  return (
    <section id="section-insights" className="scroll-mt-20 space-y-6">
      <div ref={headerRef} className="flex items-center gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-white" style={staggerStyle(headerInView, 0)}>Match Insights</h2>
        <div
          className="h-px flex-grow"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
            animation: headerInView ? 'bts-drawLine 1s ease-out 0.2s both' : 'none',
          }}
        />
      </div>
      <div ref={gridRef} className="grid gap-6 md:grid-cols-3">
        {insights.map((item, i) => (
          <InsightCard key={i} item={item} index={i} inView={gridInView} />
        ))}
      </div>
    </section>
  )
}

function InsightCard({ item, index, inView }) {
  const isHighlight = item.type === 'highlight'
  const style = isHighlight ? '' : (styles[item.type] || styles.tip)
  const glow = isHighlight ? 'rgba(var(--accent-rgb), 0.15)' : (glows[item.type] || glows.tip)
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${style}`}
      style={{
        ...staggerStyle(inView, index, { animation: 'bts-popIn', stagger: 100 }),
        boxShadow: inView ? `0 10px 30px -15px ${glow}` : 'none',
        ...(isHighlight ? {
          borderColor: 'rgba(var(--accent-rgb), 0.2)',
          backgroundColor: 'rgba(var(--accent-rgb), 0.03)',
          color: 'var(--accent)'
        } : {})
      }}
      onMouseEnter={(e) => {
        if (isHighlight) {
          e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.4)';
          e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (isHighlight) {
          e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.03)';
        }
      }}
    >
      {/* Inner Radial Hover Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true"
          style={isHighlight ? { color: 'var(--accent)' } : undefined}>
          {icons[item.type]}
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">
          {item.stat}
        </span>
      </div>
      <h3 className="relative z-10 text-sm font-black uppercase tracking-wider text-white transition-colors duration-300 group-hover:text-white">
        {item.title}
      </h3>
      <p className="relative z-10 mt-3 text-sm font-medium leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
        {item.body}
      </p>
    </article>
  )
}
