function SaveScorePrompt({ wpm, onSignInClick, onSkip, onSave, isSaving, isSaved }) {
  if (isSaved) {
    return (
      <div className="w-full bg-accent-correct/8 border border-accent-correct/20 rounded-2xl p-4 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-correct" />
        <span className="text-accent-correct font-mono text-sm">score saved to leaderboard</span>
      </div>
    )
  }

  return (
    <div className="w-full bg-bg-surface border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <p className="text-txt-base font-sans font-medium text-sm">
          save your score to the leaderboard
        </p>
        <p className="text-txt-muted font-mono text-xs mt-0.5">
          sign in to save <span className="text-brand">{wpm} wpm</span> and compete globally
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSkip}
          className="px-4 py-2 rounded-lg text-txt-muted font-mono text-xs hover:text-txt-base transition-colors"
        >
          skip
        </button>
        <button
          onClick={onSignInClick}
          className="px-5 py-2 rounded-lg bg-brand/90 hover:bg-brand text-white font-mono text-sm transition-all duration-200 active:scale-[0.98]"
        >
          sign in
        </button>
      </div>
    </div>
  )
}

export default SaveScorePrompt