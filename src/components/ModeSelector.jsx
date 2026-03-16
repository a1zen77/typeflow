import { getPersonalBest } from '../utils/storage.js'

function ModeSelector({ modes, selected, onSelect, onStart }) {
  return (
    <div className="animate-fade-up flex flex-col items-center gap-10 w-full max-w-xl">
      <div className="text-center space-y-3">
        <h1 className="text-txt-bright font-sans font-medium text-4xl sm:text-5xl tracking-tight">
          test your speed.
        </h1>
        <p className="text-txt-muted text-base font-mono">
          choose a duration and start typing
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {modes.map(m => {
          const pb = getPersonalBest(m.value)
          const isActive = selected === m.value
          return (
            <button
              key={m.value}
              onClick={() => onSelect(m.value)}
              className={`
                relative flex flex-col items-center gap-1.5 px-7 py-4 rounded-xl
                border font-mono transition-all duration-200
                ${isActive
                  ? 'bg-brand/10 border-brand/50 text-brand shadow-[0_0_20px_rgba(124,106,247,0.15)]'
                  : 'bg-bg-surface border-white/8 text-txt-muted hover:bg-bg-card hover:border-white/15 hover:text-txt-base'
                }
              `}
              aria-pressed={isActive}
            >
              <span className="text-xl font-medium">{m.label}</span>
              {pb !== null
                ? <span className={`text-xs ${isActive ? 'text-brand/70' : 'text-txt-untyped'}`}>pb {pb}</span>
                : <span className="text-xs text-txt-untyped opacity-0 select-none">—</span>
              }
            </button>
          )
        })}
      </div>

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
        <span className="text-white/60 font-mono text-sm group-hover:text-white/90 transition-colors">→</span>
      </button>

      <p className="text-txt-untyped text-xs font-mono">
        or just start typing to begin immediately
      </p>
    </div>
  )
}

export default ModeSelector