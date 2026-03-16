import { MODES } from '../App.jsx'

function Header({ mode, screen, onBackToMenu }) {
  const modeLabel = MODES.find(m => m.value === mode)?.label ?? `${mode}s`

  return (
    <header className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/5">

      {/* Logo */}
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-2.5 group"
        aria-label="Go to home"
      >
        <div className="w-7 h-7 rounded-lg bg-brand/15 border border-brand/25 flex items-center justify-center transition-all duration-200 group-hover:bg-brand/25">
          <span className="text-brand font-mono font-bold text-sm leading-none">T</span>
        </div>
        <span className="text-txt-bright font-sans font-medium tracking-tight text-lg group-hover:text-brand transition-colors duration-200">
          typeflow
        </span>
      </button>

      {/* Centre — mode label during test */}
      {screen === 'test' && (
        <div className="hidden sm:flex items-center gap-2.5 bg-bg-surface border border-white/8 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-correct animate-pulse-soft" />
          <span className="text-txt-sub text-sm font-mono">{modeLabel}</span>
        </div>
      )}

      {/* Right side */}
      <nav className="flex items-center gap-1">
        {screen === 'test' && (
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 rounded-lg text-txt-untyped text-xs font-mono hover:text-txt-muted hover:bg-bg-hover transition-all duration-150 mr-1"
            title="Back to menu (Esc)"
          >
            esc
          </button>
        )}
        <a
          href="https://github.com/a1zen77/typeflow"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg text-txt-muted text-sm font-mono hover:text-txt-base hover:bg-bg-hover transition-all duration-150"
        >
          github
        </a>
      </nav>

    </header>
  )
}

export default Header