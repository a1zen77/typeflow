import { MODES } from '../App.jsx'

function Header({ mode, screen, onBackToMenu }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-2 group"
        aria-label="Go to home"
      >
        <div className="w-7 h-7 rounded-md bg-brand/20 border border-brand/30 flex items-center justify-center">
          <span className="text-brand font-mono font-bold text-sm leading-none">T</span>
        </div>
        <span className="text-txt-bright font-sans font-medium tracking-tight text-lg group-hover:text-brand transition-colors duration-200">
          typeflow
        </span>
      </button>

      {screen === 'test' && (
        <div className="hidden sm:flex items-center gap-2 text-txt-sub text-sm font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-correct animate-pulse-soft" />
          {MODES.find(m => m.value === mode)?.label ?? mode + 's'}
        </div>
      )}

      <nav className="flex items-center gap-1">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-md text-txt-muted text-sm font-mono hover:text-txt-base hover:bg-bg-hover transition-all duration-150"
        >
          github
        </a>
      </nav>
    </header>
  )
}

export default Header