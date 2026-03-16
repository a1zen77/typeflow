import { useEffect } from 'react'
import { getPersonalBest } from '../utils/storage.js'

function ModeSelector({ modes, selected, onSelect, onStart }) {

  // Start test immediately if user just starts typing
  useEffect(() => {
    const handleKey = (e) => {
      const isLetter = e.key.length === 1 && e.key.match(/[a-z]/i)
      if (isLetter && !e.ctrlKey && !e.metaKey) {
        onStart()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onStart])

  return (
    <div className="animate-fade-up flex flex-col items-center gap-10 w-full max-w-xl">

      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-txt-bright font-sans font-medium text-4xl sm:text-5xl tracking-tight">
          test your speed.
        </h1>
        <p className="text-txt-muted text-base font-mono">
          choose a duration and start typing
        </p>
      </div>

      {/* Mode buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {modes.map(m => {
          const pb       = getPersonalBest(m.value)
          const isActive = selected === m.value

          return (
            <button
              key={m.value}
              onClick={() => onSelect(m.value)}
              className={`
                relative flex flex-col items-center gap-2 px-7 py-4 rounded-xl
                border font-mono transition-all duration-200 min-w-[88px]
                ${isActive
                  ? 'bg-brand/10 border-brand/50 text-brand shadow-[0_0_20px_rgba(124,106,247,0.15)]'
                  : 'bg-bg-surface border-white/8 text-txt-muted hover:bg-bg-card hover:border-white/15 hover:text-txt-base'
                }
              `}
              aria-pressed={isActive}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand animate-pulse-soft" />
              )}

              <span className="text-xl font-medium">{m.label}</span>

              {/* Personal best */}
              <div className="flex flex-col items-center gap-0.5">
                {pb !== null ? (
                  <>
                    <span className={`text-xs font-mono ${isActive ? 'text-brand/60' : 'text-txt-untyped'}`}>
                      best
                    </span>
                    <span className={`text-sm font-mono font-medium ${isActive ? 'text-brand/80' : 'text-txt-muted'}`}>
                      {pb} wpm
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-mono text-txt-untyped">
                    no record
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="
          group flex items-center gap-3 px-8 py-3.5 rounded-xl
          bg-brand/90 hover:bg-brand text-white font-sans font-medium text-base
          shadow-[0_0_30px_rgba(124,106,247,0.25)] hover:shadow-[0_0_40px_rgba(124,106,247,0.4)]
          transition-all duration-200 active:scale-[0.98]
        "
      >
        start test
        <span className="text-white/60 font-mono text-sm group-hover:text-white/90 transition-colors">
          →
        </span>
      </button>

      {/* Keyboard hints */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-txt-sub text-xs font-mono">
          or just start typing to begin immediately
        </p>
        <div className="flex items-center gap-2 text-txt-sub text-xs font-mono">
          <KbdHint keys={['tab', 'enter']} label="retry" />
          <span className="text-txt-muted/50">·</span>
          <KbdHint keys={['esc']} label="reset" />
        </div>
      </div>

    </div>
  )
}

function KbdHint({ keys, label }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((k, i) => (
        <span key={k} className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/20 text-txt-sub text-[10px] font-mono">
            {k}
          </kbd>
          {i < keys.length - 1 && <span className="text-txt-muted/60">+</span>}
        </span>
      ))}
      <span className="text-txt-sub ml-1">{label}</span>
    </span>
  )
}

export default ModeSelector