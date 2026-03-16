function StatsBar({ wpm, accuracy, errors, timeLeft, isRunning, duration }) {
  const pct      = Math.round((timeLeft / duration) * 100)
  const isLow    = timeLeft <= 5
  const isWarn   = timeLeft <= 10 && timeLeft > 5

  return (
    <div className="w-full mb-10">

      <div className="flex items-center justify-between mb-5 px-1">

        {/* WPM */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          <span className="text-3xl font-mono font-medium text-txt-bright tabular-nums transition-all duration-300">
            {isRunning ? wpm : '—'}
          </span>
          <span className="text-[10px] font-mono text-txt-untyped uppercase tracking-[0.15em]">
            wpm
          </span>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-1">
          <span
            className={`
              text-6xl font-mono font-medium tabular-nums transition-colors duration-500
              ${isLow  ? 'text-accent-error animate-pulse-soft' :
                isWarn ? 'text-accent-gold'                     :
                         'text-txt-bright'                      }
            `}
          >
            {timeLeft}
          </span>
          <span className="text-[10px] font-mono text-txt-untyped uppercase tracking-[0.15em]">
            seconds
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          <span className="text-3xl font-mono font-medium text-txt-bright tabular-nums transition-all duration-300">
            {isRunning ? `${accuracy}%` : '—'}
          </span>
          <span className="text-[10px] font-mono text-txt-untyped uppercase tracking-[0.15em]">
            acc
          </span>
        </div>

      </div>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-bg-card rounded-full overflow-hidden">
        <div
          className={`
            h-full rounded-full transition-all duration-1000 ease-linear
            ${isLow  ? 'bg-accent-error' :
              isWarn ? 'bg-accent-gold'  :
                       'bg-brand'        }
          `}
          style={{ width: `${pct}%` }}
        />
      </div>

    </div>
  )
}

export default StatsBar