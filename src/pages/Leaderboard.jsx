import { useState, useEffect } from 'react'
import { useScores } from '../hooks/useScores.js'

const DURATIONS = [
  { label: '15s',  value: 15  },
  { label: '30s',  value: 30  },
  { label: '1min', value: 60  },
  { label: '2min', value: 120 },
]

function Leaderboard({ user, profile, onBack }) {
  const [activeDuration, setActiveDuration] = useState(60)
  const [activeTab,      setActiveTab]      = useState('global') // 'global' | 'personal'

  const {
    leaderboard,
    personalScores,
    isLoading,
    error,
    fetchLeaderboard,
    fetchPersonalScores,
  } = useScores()

  // Fetch leaderboard when duration changes
  useEffect(() => {
    fetchLeaderboard(activeDuration)
  }, [activeDuration, fetchLeaderboard])

  // Fetch personal scores when switching to personal tab
  useEffect(() => {
    if (activeTab === 'personal' && user) {
      fetchPersonalScores(user.id)
    }
  }, [activeTab, user, fetchPersonalScores])

  return (
    <div className="animate-fade-up w-full max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-txt-bright font-sans font-medium text-2xl tracking-tight">
            leaderboard
          </h1>
          <p className="text-txt-muted font-mono text-sm mt-0.5">
            top scores globally
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-white/10 text-txt-muted font-mono text-sm hover:text-txt-base hover:border-white/20 transition-all duration-150"
        >
          ← back
        </button>
      </div>

      {/* Tabs — global vs personal */}
      <div className="flex items-center gap-1 bg-bg-surface border border-white/8 rounded-xl p-1 w-fit">
        <TabBtn label="global"   active={activeTab === 'global'}   onClick={() => setActiveTab('global')}   />
        <TabBtn label="my scores" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
      </div>

      {/* Duration filter — only on global tab */}
      {activeTab === 'global' && (
        <div className="flex gap-2 flex-wrap">
          {DURATIONS.map(d => (
            <button
              key={d.value}
              onClick={() => setActiveDuration(d.value)}
              className={`
                px-5 py-2 rounded-lg border font-mono text-sm transition-all duration-200
                ${activeDuration === d.value
                  ? 'bg-brand/10 border-brand/40 text-brand'
                  : 'bg-bg-surface border-white/8 text-txt-muted hover:border-white/15 hover:text-txt-base'
                }
              `}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {activeTab === 'global' && (
        <GlobalLeaderboard
          data={leaderboard}
          isLoading={isLoading}
          error={error}
          currentUserId={user?.id}
          currentUsername={profile?.username}
        />
      )}

      {activeTab === 'personal' && (
        <PersonalScores
          data={personalScores}
          isLoading={isLoading}
          user={user}
          isLoggedIn={!!user}
        />
      )}

    </div>
  )
}

// ── Global leaderboard table ─────────────────────────────────────

function GlobalLeaderboard({ data, isLoading, error, currentUserId, currentUsername }) {
  if (isLoading) return <LoadingState />
  if (error)     return <ErrorState message={error} />
  if (data.length === 0) return (
    <EmptyState message="no scores yet for this duration — be the first!" />
  )

  return (
    <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[48px_1fr_80px_80px_80px] gap-2 px-5 py-3 border-b border-white/5">
        {['rank', 'player', 'wpm', 'acc', 'errors'].map(h => (
          <span key={h} className="text-txt-untyped font-mono text-[10px] uppercase tracking-widest">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {data.map((score, i) => {
        const isCurrentUser = score.profiles?.username === currentUsername
        return (
          <div
            key={score.id}
            className={`
              grid grid-cols-[48px_1fr_80px_80px_80px] gap-2 px-5 py-3.5
              border-b border-white/5 last:border-0 transition-colors duration-150
              ${isCurrentUser ? 'bg-brand/5 border-brand/10' : 'hover:bg-bg-card'}
            `}
          >
            {/* Rank */}
            <span className={`font-mono text-sm tabular-nums
              ${i === 0 ? 'text-accent-gold font-medium' :
                i === 1 ? 'text-txt-base' :
                i === 2 ? 'text-accent-error/70' :
                          'text-txt-untyped'}
            `}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>

            {/* Username */}
            <span className={`font-mono text-sm truncate
              ${isCurrentUser ? 'text-brand font-medium' : 'text-txt-base'}
            `}>
              {score.profiles?.username ?? 'unknown'}
              {isCurrentUser && (
                <span className="text-brand/50 text-xs ml-2">you</span>
              )}
            </span>

            {/* WPM */}
            <span className="font-mono text-sm text-txt-bright tabular-nums">
              {score.wpm}
            </span>

            {/* Accuracy */}
            <span className={`font-mono text-sm tabular-nums
              ${score.accuracy >= 95 ? 'text-accent-correct' : 'text-txt-base'}
            `}>
              {score.accuracy}%
            </span>

            {/* Errors */}
            <span className={`font-mono text-sm tabular-nums
              ${score.errors > 10 ? 'text-accent-error' : 'text-txt-muted'}
            `}>
              {score.errors}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Personal score history ───────────────────────────────────────

function PersonalScores({ data, isLoading, isLoggedIn }) {
  if (!isLoggedIn) return (
    <EmptyState message="sign in to see your score history" />
  )
  if (isLoading) return <LoadingState />
  if (data.length === 0) return (
    <EmptyState message="no scores yet — complete a test and save your score!" />
  )

  const durationLabel = { 15: '15s', 30: '30s', 60: '1min', 120: '2min' }

  return (
    <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-2 px-5 py-3 border-b border-white/5">
        {['mode', 'wpm', 'acc', 'errors', 'date'].map(h => (
          <span key={h} className="text-txt-untyped font-mono text-[10px] uppercase tracking-widest">
            {h}
          </span>
        ))}
      </div>

      {data.map(score => (
        <div
          key={score.id}
          className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-2 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-bg-card transition-colors duration-150"
        >
          <span className="font-mono text-sm text-txt-base">
            {durationLabel[score.duration] ?? score.duration}
          </span>
          <span className="font-mono text-sm text-txt-bright tabular-nums">{score.wpm}</span>
          <span className={`font-mono text-sm tabular-nums ${score.accuracy >= 95 ? 'text-accent-correct' : 'text-txt-base'}`}>
            {score.accuracy}%
          </span>
          <span className={`font-mono text-sm tabular-nums ${score.errors > 10 ? 'text-accent-error' : 'text-txt-muted'}`}>
            {score.errors}
          </span>
          <span className="font-mono text-xs text-txt-untyped">
            {new Date(score.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Shared UI components ─────────────────────────────────────────

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-lg font-mono text-sm transition-all duration-200
        ${active ? 'bg-brand/15 text-brand' : 'text-txt-muted hover:text-txt-base'}
      `}
    >
      {label}
    </button>
  )
}

function LoadingState() {
  return (
    <div className="text-center py-16 text-txt-muted font-mono text-sm animate-pulse-soft">
      loading...
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="text-center py-16 text-accent-error font-mono text-sm">
      {message}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-16 text-txt-untyped font-mono text-sm">
      {message}
    </div>
  )
}

export default Leaderboard