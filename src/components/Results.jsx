import { useState } from 'react'
import WpmChart from './WpmChart.jsx'
import SaveScorePrompt from './SaveScorePrompt.jsx'
import { getPersonalBest } from '../utils/storage.js'

function Results({ data, onRetry, onChangeMode, user, onSignInClick, onSaveScore, isSaving, isSaved, btnText }) {
  const { wpm, accuracy, errors, snapshots, duration, isNewPB } = data
  const [showSavePrompt, setShowSavePrompt] = useState(!user)

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
        <StatCard label="accuracy" value={`${accuracy}%`} highlight={accuracy >= 95} warn={accuracy < 80} />
        <StatCard label="errors"   value={errors} warn={errors > 10} />
      </div>

      {/* WPM chart */}
      <div className="bg-bg-surface border border-white/5 rounded-2xl p-5">
        <p className="text-txt-untyped text-xs font-mono uppercase tracking-widest mb-4">
          wpm over time
        </p>
        <WpmChart snapshots={snapshots} />
      </div>

      {/* Save to leaderboard — logged in users */}
      {user && !isSaved && (
        <div className="w-full bg-bg-surface border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-txt-base font-sans font-medium text-sm">
              save to leaderboard
            </p>
            <p className="text-txt-muted font-mono text-xs mt-0.5">
              submit <span className="text-brand">{wpm} wpm</span> to the global leaderboard
            </p>
          </div>
          <button
            onClick={onSaveScore}
            disabled={isSaving}
            style={{ color: btnText, backgroundColor: 'var(--brand)' }}
            className="
              px-5 py-2 rounded-lg font-mono text-sm
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSaving ? 'saving...' : 'save score'}
          </button>
        </div>
      )}

      {/* Save prompt — logged out users */}
      {!user && showSavePrompt && (
        <SaveScorePrompt
          wpm={wpm}
          onSignInClick={onSignInClick}
          onSkip={() => setShowSavePrompt(false)}
          btnText={btnText}
        />
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          style={{ color: btnText, backgroundColor: 'var(--brand)' }}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl
            font-sans font-medium text-sm
            transition-all duration-200 active:scale-[0.98]
          "
        >
          try again
          <span style={{ color: btnText, opacity: 0.6 }} className="font-mono">↺</span>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="flex items-center justify-center gap-3 text-txt-sub text-xs font-mono">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/20 text-txt-sub text-[10px]">tab</kbd>
          <span className="mx-1 text-txt-muted/60">+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/20 text-txt-sub text-[10px]">enter</kbd>
          <span className="ml-1.5 text-txt-sub">retry</span>
        </span>
        <span className="text-txt-muted/40">·</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-white/20 text-txt-sub text-[10px]">esc</kbd>
          <span className="ml-1.5 text-txt-sub">back to menu</span>
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