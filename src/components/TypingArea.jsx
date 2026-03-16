import { useEffect, useRef } from 'react'

function TypingArea({ words, charState, currentWord, currentChar, isFinished, onKeyPress }) {
  const containerRef    = useRef(null)
  const currentWordRef  = useRef(null)

  // Capture keypresses
  useEffect(() => {
    if (isFinished) return
    const handleKey = (e) => {
      if (e.key === ' ') e.preventDefault()
      onKeyPress(e.key)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFinished, onKeyPress])

  // Auto-scroll so current word is always visible
  useEffect(() => {
    if (!currentWordRef.current || !containerRef.current) return

    const container = containerRef.current
    const wordEl    = currentWordRef.current

    const wordTop      = wordEl.offsetTop
    const wordBottom   = wordTop + wordEl.offsetHeight
    const containerH   = container.clientHeight
    const scrollTop    = container.scrollTop

    // If the word is below the visible area, scroll down
    if (wordBottom > scrollTop + containerH - 40) {
      container.scrollTo({
        top: wordTop - containerH / 2,
        behavior: 'smooth',
      })
    }

    // If the word is above the visible area, scroll up
    if (wordTop < scrollTop + 40) {
      container.scrollTo({
        top: wordTop - containerH / 2,
        behavior: 'smooth',
      })
    }
  }, [currentWord])

  return (
    <div className="w-full">
      {/* Scrollable word container — shows ~4 lines, scrolls automatically */}
      <div
        ref={containerRef}
        className="w-full overflow-y-auto relative"
        style={{
          height: '12rem',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 80%, transparent 100%)',
        }}
      >
        <div className="typing-font py-4 px-1">
          {words.map((word, wIdx) => (
            <span
              key={wIdx}
              ref={wIdx === currentWord ? currentWordRef : null}
              className="inline-block mr-[0.6em] mb-2"
            >
              {charState[wIdx].map((charObj, cIdx) => {
                const isCursor = wIdx === currentWord && cIdx === currentChar
                const colorClass =
                  charObj.status === 'correct'  ? 'text-accent-correct' :
                  charObj.status === 'incorrect' ? 'text-accent-error'   :
                  wIdx === currentWord           ? 'text-txt-base'       :
                  wIdx < currentWord             ? 'text-txt-muted'      :
                                                   'text-txt-untyped'

                return (
                  <span key={cIdx} className={`relative ${colorClass}`}>
                    {isCursor && (
                      <span
                        className="absolute -left-px top-[0.1em] bottom-[0.05em] w-[2px] bg-brand animate-blink"
                        aria-hidden="true"
                      />
                    )}
                    {charObj.char}
                  </span>
                )
              })}
            </span>
          ))}
        </div>
      </div>

      {!isFinished && (
        <p className="mt-4 text-center text-txt-untyped text-xs font-mono">
          start typing — esc to reset
        </p>
      )}
    </div>
  )
}

export default TypingArea