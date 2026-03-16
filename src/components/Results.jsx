import WpmChart from './WpmChart.jsx'

function Results({ data, onRetry, onChangeMode }) {
  const { wpm, accuracy, errors, snapshots, duration, isNewPB } = data

  const durationLabel = {
    15:  '15 seconds',
    30:  '30 seconds',
    60:  '1 minute',
    120: '2 minutes',
  }[duration] ?? `${duration}s`

  return (
    <div className="animate-fade-up w-full max-w-2xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div className="text-center space-y-1">
        {isNewPB && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse-soft" />
            new personal best
          </div>
        )}
        <h2 className="text-txt-bright font-sans font-medium text-3xl tracking-tight">
          {wpm} <span className="text-txt-muted text-xl">wpm</span>
        </h2>
        <p className="text-txt-muted font-mono text-sm">{durationLabel} test</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="wpm"      value={wpm}           />
        <StatCard label="accuracy" value={`${accuracy}%`} highlight={accuracy >= 95} />
        <StatCard label="errors"   value={errors}         warn={errors > 10} />
      </div>

      {/* WPM chart */}
      <div className="bg-bg-surface border border-white/5 rounded-2xl p-5">
        <p className="text-txt-untyped text-xs font-mono uppercase tracking-widest mb-4">
          wpm over time
        </p>
        <WpmChart snapshots={snapshots} />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl
            bg-brand/90 hover:bg-brand text-white font-sans font-medium text-sm
            shadow-[0_0_24px_rgba(124,106,247,0.2)] hover:shadow-[0_0_32px_rgba(124,106,247,0.35)]
            transition-all duration-200 active:scale-[0.98]
          "
        >
          try again
          <span className="font-mono text-white/60">↺</span>
        </button>

        <button
          onClick={onChangeMode}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl
            border border-white/10 text-txt-base font-sans font-medium text-sm
            hover:bg-bg-card hover:border-white/20
            transition-all duration-200 active:scale-[0.98]
          "
        >
          change mode
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-txt-untyped text-xs font-mono">
        tab + enter to retry quickly
      </p>

    </div>
  )
}

function StatCard({ label, value, highlight, warn }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-bg-surface border border-white/5 rounded-xl py-5">
      <span className={`text-3xl font-mono font-medium tabular-nums
        ${highlight ? 'text-accent-correct' :
          warn      ? 'text-accent-error'   :
                      'text-txt-bright'     }
      `}>
        {value}
      </span>
      <span className="text-[11px] font-mono text-txt-untyped uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}

export default Results