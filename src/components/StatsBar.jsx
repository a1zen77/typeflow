function StatsBar({ wpm, accuracy, errors, timeLeft, isRunning, duration }) {
  const pct = Math.round((timeLeft / duration) * 100)

  return (
    <div className="w-full mb-8">

      {/* Stats row */}
      <div className="flex items-center justify-between mb-4">

        {/* WPM */}
        <div className="flex flex-col items-center gap-0.5 min-w-[72px]">
          <span className="text-3xl font-mono font-medium text-txt-bright tabular-nums">
            {isRunning ? wpm : '—'}
          </span>
          <span className="text-[11px] font-mono text-txt-untyped uppercase tracking-widest">
            wpm
          </span>
        </div>

        {/* Timer — center */}
        <div className="flex flex-col items-center gap-0.5">
          <span
            className={`text-5xl font-mono font-medium tabular-nums transition-colors duration-300
              ${timeLeft <= 5  ? 'text-accent-error'  :
                timeLeft <= 10 ? 'text-accent-gold'   :
                                 'text-txt-bright'    }
            `}
          >
            {timeLeft}
          </span>
          <span className="text-[11px] font-mono text-txt-untyped uppercase tracking-widest">
            seconds
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-0.5 min-w-[72px]">
          <span className="text-3xl font-mono font-medium text-txt-bright tabular-nums">
            {isRunning ? `${accuracy}%` : '—'}
          </span>
          <span className="text-[11px] font-mono text-txt-untyped uppercase tracking-widest">
            acc
          </span>
        </div>

      </div>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

    </div>
  )
}

export default StatsBar