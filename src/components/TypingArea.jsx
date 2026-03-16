import { useEffect, useRef } from 'react'

function TypingArea({ words, charState, currentWord, currentChar, isFinished, onKeyPress }) {
  const containerRef   = useRef(null)
  const currentWordRef = useRef(null)
  const lastLineRef    = useRef(0)

  useEffect(() => {
    if (isFinished) return
    const handleKey = (e) => {
      if (e.key === ' ') e.preventDefault()
      onKeyPress(e.key)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFinished, onKeyPress])

  // Scroll when the current word moves to a new line
  useEffect(() => {
    if (!currentWordRef.current || !containerRef.current) return

    const container  = containerRef.current
    const wordEl     = currentWordRef.current
    const lineTop    = wordEl.offsetTop

    // Only scroll when we've moved to a new line
    if (lineTop !== lastLineRef.current) {
      lastLineRef.current = lineTop

      // Scroll so the current line sits in the upper third of the container
      container.scrollTo({
        top: Math.max(0, lineTop - container.clientHeight * 0.28),
        behavior: 'smooth',
      })
    }
  }, [currentWord])

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full overflow-y-auto relative"
        style={{
          height: '13rem',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)',
          scrollbarWidth: 'none',
        }}
      >
        {/* Hide scrollbar in webkit */}
        <style>{`.typing-scroll::-webkit-scrollbar { display: none; }`}</style>

        <div className="typing-font py-6 px-1 leading-relaxed">
          {words.map((word, wIdx) => (
            <span
              key={wIdx}
              ref={wIdx === currentWord ? currentWordRef : null}
              className={`
                inline-block mr-[0.6em] mb-2 transition-opacity duration-150
                ${wIdx < currentWord - 10 ? 'opacity-30' : 'opacity-100'}
              `}
            >
              {charState[wIdx].map((charObj, cIdx) => {
                const isCursor   = wIdx === currentWord && cIdx === currentChar
                const colorClass =
                  charObj.status === 'correct'  ? 'text-accent-correct' :
                  charObj.status === 'incorrect' ? 'text-accent-error'   :
                  wIdx === currentWord           ? 'text-txt-base'       :
                  wIdx < currentWord             ? 'text-txt-muted'      :
                                                   'text-txt-untyped'

                return (
                  <span key={cIdx} className={`relative ${colorClass} transition-colors duration-75`}>
                    {isCursor && (
                      <span
                        className="absolute -left-px top-[0.1em] bottom-[0.05em] w-[2px] bg-brand animate-blink rounded-full"
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
        <p className="mt-5 text-center text-txt-sub text-xs font-mono tracking-wide">
          start typing &nbsp;·&nbsp; esc to reset
        </p>
      )}
    </div>
  )
}

export default TypingArea