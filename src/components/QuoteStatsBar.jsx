function QuoteStatsBar({ wpm, accuracy, errors, isRunning, progress, elapsedTime }) {
  return (
    <div className="w-full mb-10">

      <div className="flex items-center justify-between mb-5 px-1">

        {/* WPM */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          <span className="text-3xl font-mono font-medium text-txt-bright tabular-nums">
            {isRunning ? wpm : '—'}
          </span>
          <span className="text-[10px] font-mono text-txt-untyped uppercase tracking-[0.15em]">
            wpm
          </span>
        </div>

        {/* Elapsed time — centre */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-mono font-medium tabular-nums text-txt-bright">
            {elapsedTime}
          </span>
          <span className="text-[10px] font-mono text-txt-untyped uppercase tracking-[0.15em]">
            seconds
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          <span className="text-3xl font-mono font-medium text-txt-bright tabular-nums">
            {isRunning ? `${accuracy}%` : '—'}
          </span>
          <span className="text-[10px] font-mono text-txt-untyped uppercase tracking-[0.15em]">
            acc
          </span>
        </div>

      </div>

      {/* Progress bar — fills as quote is completed */}
      <div className="w-full h-[2px] bg-bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>
  )
}

export default QuoteStatsBar