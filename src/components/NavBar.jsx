import { useState, useEffect, useRef } from 'react'
import {
  Award, BarChart3, BookOpen, CalendarDays, ClipboardList, Clock3, FileText,
  Home, LayoutDashboard, Lightbulb, MapPin, Menu, Settings2, Swords, Trophy,
  UsersRound,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Dashboard',
    items: [
      { id: 'section-home', label: 'Home', icon: Home },
      { id: 'section-overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'section-tournament', label: 'Tournaments', icon: Trophy },
      { id: 'section-matches', label: 'Matches', icon: CalendarDays },
    ],
  },
  {
    label: 'Match Analysis',
    items: [
      { id: 'section-narration', label: 'Match Summary', icon: FileText },
      { id: 'section-scorecard', label: 'Scorecard', icon: ClipboardList },
      { id: 'section-analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'section-performers', label: 'Performers', icon: Award },
      { id: 'section-squad', label: 'Squads', icon: UsersRound },
      { id: 'section-h2h', label: 'Head-to-Head', icon: Swords },
      { id: 'section-venue', label: 'Venue', icon: MapPin },
    ],
  },
  {
    label: 'More',
    items: [
      { id: 'section-insights', label: 'Insights', icon: Lightbulb },
      { id: 'section-timeline', label: 'Timeline', icon: Clock3 },
      { id: 'section-glossary', label: 'Glossary', icon: BookOpen },
      { id: 'section-settings', label: 'Settings', icon: Settings2 },
    ],
  },
]

export default function NavBar({ activeTab, onTabChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const sidebarRef = useRef(null)

  // Close mobile drawer on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [mobileOpen])

  // Sync collapsed state with CSS for main content margin
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '72px' : '240px')
  }, [collapsed])

  // Close mobile drawer on tab change
  const handleTabClick = (id) => {
    onTabChange(id)
    setMobileOpen(false)
  }

  const sidebarWidth = collapsed ? '72px' : '240px'

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a0f14]/90 text-white backdrop-blur-xl lg:hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer"
        aria-label="Toggle navigation"
      >
        <div className="flex flex-col gap-[5px]">
          <span className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </div>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm lg:hidden"
          style={{ animation: 'bts-fadeIn 0.2s ease both' }}
        />
      )}

      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`bts-sidebar fixed left-0 top-0 z-[55] flex h-full flex-col border-r border-white/[0.06] bg-[#060a10]/95 backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        style={{ width: sidebarWidth }}
      >
        {/* Logo & Hamburger Section */}
        <div className={`flex flex-shrink-0 border-b border-white/[0.06] ${collapsed ? 'flex-col items-center py-4 space-y-4' : 'flex-row items-center px-4 py-5 gap-3'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation"
          >
            <Menu className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleTabClick('section-home')}
            className={`group flex items-center transition-all duration-300 cursor-pointer ${collapsed ? 'justify-center' : 'gap-3 w-full'}`}
            title="Beyond The Score — Home"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.3)',
              }}
            >
              <img
                src="/bts-logo.png"
                alt="BTS Logo"
                className="h-8 w-8 object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <span
                className="absolute inset-0 items-center justify-center text-[11px] font-black tracking-wider text-white"
                style={{ display: 'none' }}
              >
                BTS
              </span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden transition-all duration-300 text-left">
                <p className="text-sm font-extrabold text-white tracking-tight leading-tight whitespace-nowrap">
                  Beyond The Score
                </p>
                <p className="text-[10px] font-medium text-slate-500 tracking-wide whitespace-nowrap">
                  Cricket Analytics
                </p>
              </div>
            )}
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-none">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
              {!collapsed && (
                <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  {group.label}
                </p>
              )}
              {collapsed && gi > 0 && (
                <div className="mx-auto mb-3 h-px w-8 bg-white/[0.06]" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id
                  const ItemIcon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`group relative flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-all duration-200 cursor-pointer motion-safe:hover:-translate-y-px active:translate-y-0 ${collapsed ? 'justify-center' : 'gap-3'
                        } ${isActive
                          ? 'bg-white/[0.08] text-white'
                          : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                        }`}
                      style={
                        isActive
                          ? {
                            color: 'var(--accent)',
                            boxShadow: `inset 0 0 20px rgba(var(--accent-rgb), 0.08), 0 0 20px rgba(var(--accent-rgb), 0.05)`,
                          }
                          : undefined
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                          style={{
                            backgroundColor: 'var(--accent)',
                            boxShadow: `0 0 8px rgba(var(--accent-rgb), 0.6)`,
                          }}
                        />
                      )}

                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200 motion-safe:group-hover:scale-110 ${isActive ? 'drop-shadow-[0_0_6px_rgba(var(--accent-rgb),0.65)]' : ''}`}>
                        <ItemIcon className="h-[18px] w-[18px]" />
                      </span>

                      {!collapsed && (
                        <span className="text-[12px] font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                      )}

                      {isActive && !collapsed && (
                        <div
                          className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: 'var(--accent)',
                            boxShadow: `0 0 8px rgba(var(--accent-rgb), 0.8)`,
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </nav>
    </>
  )
}

// Export sidebar width for layout coordination
export const SIDEBAR_WIDTH = '240px'
export const SIDEBAR_COLLAPSED_WIDTH = '72px'
