import { useState, useEffect, useRef } from 'react'

/* ── Shared CSS Keyframes (injected once globally) ── */
const STYLE_ID = 'bts-global-keyframes'

export function injectGlobalKeyframes() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes bts-fadeUp {
      from { opacity: 0; transform: translateY(24px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes bts-fadeDown {
      from { opacity: 0; transform: translateY(-20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes bts-fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes bts-scaleIn {
      from { opacity: 0; transform: scale(0.5) rotate(-6deg); }
      to   { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes bts-slideLeft {
      from { opacity: 0; transform: translateX(-50px) scale(0.95); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes bts-slideRight {
      from { opacity: 0; transform: translateX(50px) scale(0.95); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes bts-barGrow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes bts-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes bts-popIn {
      0%   { opacity: 0; transform: scale(0.3) translateY(16px); }
      60%  { transform: scale(1.06) translateY(-3px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes bts-drawLine {
      from { width: 0; }
      to   { width: 100%; }
    }
    @keyframes bts-float {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-5px); }
    }
    @keyframes bts-countPop {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes bts-pulseGlow {
      0%, 100% { box-shadow: 0 0 15px 0px var(--glow-color, rgba(16,185,129,0.15)); }
      50%      { box-shadow: 0 0 35px 6px var(--glow-color, rgba(16,185,129,0.3)); }
    }
    @keyframes bts-vsPulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50%      { transform: scale(1.12); opacity: 1; }
    }
    @keyframes bts-borderTrace {
      from { background-position: 0% 50%; }
      to   { background-position: 200% 50%; }
    }
    @keyframes bts-staggerFadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes bts-slideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes bts-slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes bts-expandWidth {
      from { width: 0%; }
      to   { width: var(--target-width, 50%); }
    }
    @keyframes bts-glow {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes bts-typewriter {
      from { max-height: 0; opacity: 0; }
      to   { max-height: 2000px; opacity: 1; }
    }
    @keyframes bts-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}

/* ── Intersection Observer hook (triggers once) ── */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.1, ...options }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

/* ── Animated count-up hook ── */
export function useCountUp(end, duration = 1400, trigger = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) { setVal(0); return }
    if (end === 0) { setVal(0); return }
    let start = 0
    const step = Math.max(1, Math.ceil(end / (duration / 16)))
    const id = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(id) }
      else setVal(start)
    }, 16)
    return () => clearInterval(id)
  }, [end, duration, trigger])
  return val
}

/* ── Helper: staggered animation style ── */
export function staggerStyle(inView, index, {
  animation = 'bts-fadeUp',
  duration = '0.55s',
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  baseDelay = 0,
  stagger = 80,
} = {}) {
  const delay = baseDelay + index * stagger
  return {
    opacity: inView ? 1 : 0,
    animation: inView
      ? `${animation} ${duration} ${easing} ${delay}ms both`
      : 'none',
  }
}

/* ── Animated wrapper component ── */
export function AnimatedSection({ children, className = '', delay = 0, animation = 'bts-fadeUp' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView
          ? `${animation} 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`
          : 'none',
      }}
    >
      {children}
    </div>
  )
}
