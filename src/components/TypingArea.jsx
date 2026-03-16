import { useEffect, useRef } from 'react'

// How many lines to show at once
const VISIBLE_LINES = 3

function TypingArea({ words, charState, currentWord, currentChar, isFinished, onKeyPress }) {
  const containerRef = useRef(null)

  // Capture all keypresses when not finished
  useEffect(() => {
    if (isFinished) return

    const handleKey = (e) => {
      // Prevent spacebar from scrolling the page
      if (e.key === ' ') e.preventDefault()
      onKeyPress(e.key)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFinished, onKeyPress])

  return (
    <div
      ref={containerRef}
      className="w-full select-none outline-none"
      aria-label="Typing area"
    >
      <div className="relative overflow-hidden" style={{ height: `${VISIBLE_LINES * 3.2}rem` }}>
        <div className="typing-font">
          {words.map((word, wIdx) => (
            <span key={wIdx} className="inline-block mr-[0.6em] mb-1">
              {charState[wIdx].map((charObj, cIdx) => {
                const isCursor = wIdx === currentWord && cIdx === currentChar
                const colorClass =
                  charObj.status === 'correct'   ? 'text-accent-correct' :
                  charObj.status === 'incorrect'  ? 'text-accent-error'   :
                  wIdx === currentWord            ? 'text-txt-base'       :
                  wIdx < currentWord              ? 'text-txt-muted'      :
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

      {/* Hint text */}
      {!isFinished && (
        <p className="mt-6 text-center text-txt-untyped text-xs font-mono">
          start typing — esc to reset
        </p>
      )}
    </div>
  )
}

export default TypingArea