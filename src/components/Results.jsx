import WpmChart from './WpmChart.jsx'
import { getPersonalBest } from '../utils/storage.js'

function Results({ data, onRetry, onChangeMode }) {
  const { wpm, accuracy, errors, snapshots, duration, isNewPB } = data

  const prevPB = isNewPB ? wpm : getPersonalBest(duration)

  const durationLabel = {
    15:  '15 seconds',
    30:  '30 seconds',
    60:  '1 minute',
    120: '2 minutes',
  }[duration] ?? `${duration}s`

  return (
    <div className="animate-fade-up w-full max-w-2xl mx-auto flex flex-col gap-8">

      {/* New PB banner */}
      {isNewPB && (
        <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-accent-gold/8 border border-accent-gold/25">
          <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse-soft" />
          <span className="text-accent-gold font-mono text-sm">
            new personal best for {durationLabel}!
          </span>
        </div>
      )}

      {/* Main WPM display */}
      <div className="text-center space-y-1">
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-txt-bright font-mono font-medium text-6xl tabular-nums">
            {wpm}
          </span>
          <span className="text-txt-muted font-mono text-2xl">wpm</span>
        </div>
        <p className="text-txt-muted font-mono text-sm">{durationLabel} test</p>

        {/* Previous PB comparison */}
        {prevPB !== null && !isNewPB && (
          <p className="text-txt-untyped font-mono text-xs mt-1">
            best: {prevPB} wpm
            {wpm >= prevPB - 3 && wpm < prevPB && (
              <span className="text-accent-gold/70 ml-2">so close!</span>
            )}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="wpm"      value={wpm} />
        <StatCard
          label="accuracy"
          value={`${accuracy}%`}
          highlight={accuracy >= 95}
          warn={accuracy < 80}
        />
        <StatCard
          label="errors"
          value={errors}
          warn={errors > 10}
        />
      </div>

      {/* WPM chart */}
      <div className="bg-bg-surface border border-white/5 rounded-2xl p-5">
        <p className="text-txt-untyped text-xs font-mono uppercase tracking-widest mb-4">
          wpm over time
        </p>
        <WpmChart snapshots={snapshots} />
      </div>

      {/* Actions */}
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

      {/* Keyboard hints */}
      <div className="flex items-center justify-center gap-3 text-txt-untyped text-xs font-mono">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/10 text-[10px]">tab</kbd>
          <span className="mx-1 text-txt-untyped/40">+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/10 text-[10px]">enter</kbd>
          <span className="ml-1.5 text-txt-untyped/50">retry</span>
        </span>
        <span className="text-txt-untyped/30">·</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/10 text-[10px]">esc</kbd>
          <span className="ml-1.5 text-txt-untyped/50">menu</span>
        </span>
      </div>

    </div>
  )
}

function StatCard({ label, value, highlight, warn }) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-bg-surface border border-white/5 rounded-xl py-5">
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