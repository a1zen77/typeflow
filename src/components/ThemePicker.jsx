import { useState, useRef, useEffect } from 'react'
import { THEMES } from '../utils/themes.js'

function ThemePicker({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen]   = useState(false)
  const dropdownRef           = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div ref={dropdownRef} className="relative">

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-txt-muted text-sm font-mono hover:text-txt-base hover:bg-bg-hover transition-all duration-150"
        title="Change theme"
        aria-label="Theme picker"
      >
        {/* Mini colour preview of current theme */}
        <div className="flex gap-0.5">
          {THEMES[currentTheme]?.preview.map((color, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-white/10"
              style={{ background: color }}
            />
          ))}
        </div>
        <span className="hidden sm:block text-xs">theme</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="
          absolute right-0 top-full mt-2 w-48
          bg-bg-surface border border-white/10 rounded-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          overflow-hidden z-50 animate-fade-up
        ">
          <div className="px-3 py-2 border-b border-white/8">
            <span className="text-txt-untyped font-mono text-[10px] uppercase tracking-widest">
              choose theme
            </span>
          </div>

          {Object.values(THEMES).map(theme => {
            const isActive = theme.name === currentTheme
            return (
              <button
                key={theme.name}
                onClick={() => { onThemeChange(theme.name); setIsOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  transition-colors duration-150 text-left
                  ${isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-txt-base hover:bg-bg-card'
                  }
                `}
              >
                {/* Colour swatches */}
                <div className="flex gap-1">
                  {theme.preview.map((color, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border border-white/10 flex-shrink-0"
                      style={{ background: color }}
                    />
                  ))}
                </div>

                {/* Theme name */}
                <span className="font-mono text-sm flex-1">{theme.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ThemePicker