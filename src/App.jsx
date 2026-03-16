import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import TypingArea from './components/TypingArea.jsx'
import { useTypingEngine } from './hooks/useTypingEngine.js'

export const MODES = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1min', value: 60 },
  { label: '2min', value: 120 },
]

const SCREENS = {
  SELECT: 'select',
  TEST:   'test',
  RESULT: 'result',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.SELECT)
  const [mode, setMode]     = useState(60)

  const handleFirstKeyPress = useCallback(() => {
    // Will wire up to timer in Phase 3
  }, [])

  const {
    words, charState, currentWord, currentChar,
    hasStarted, isFinished, correctChars, totalTyped,
    handleKeyPress, reset,
  } = useTypingEngine(handleFirstKeyPress)

  const handleSelectMode  = useCallback((duration) => setMode(duration), [])
  const handleStartTest   = useCallback(() => { reset(); setScreen(SCREENS.TEST) }, [reset])
  const handleBackToMenu  = useCallback(() => { reset(); setScreen(SCREENS.SELECT) }, [reset])

  // ESC key to reset
  const handleKeyPressWrapped = useCallback((key) => {
    if (key === 'Escape') { reset(); return }
    handleKeyPress(key)
  }, [handleKeyPress, reset])

  return (
    <div className="relative min-h-screen bg-bg-base bg-grid vignette">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header mode={mode} screen={screen} onBackToMenu={handleBackToMenu} />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {screen === SCREENS.SELECT && (
            <ModeSelector
              modes={MODES}
              selected={mode}
              onSelect={handleSelectMode}
              onStart={handleStartTest}
            />
          )}

          {screen === SCREENS.TEST && (
            <div className="animate-fade-up w-full max-w-3xl">
              <TypingArea
                words={words}
                charState={charState}
                currentWord={currentWord}
                currentChar={currentChar}
                isFinished={isFinished}
                onKeyPress={handleKeyPressWrapped}
              />
            </div>
          )}

          {screen === SCREENS.RESULT && (
            <div className="animate-fade-up w-full max-w-3xl">
              <div className="text-txt-muted text-center typing-font text-lg">
                Results — coming in Phase 4
              </div>
            </div>
          )}
        </main>

        <footer className="text-center py-6 text-txt-untyped text-sm font-mono">
          typeflow &mdash; built with react + vite
        </footer>
      </div>
    </div>
  )
}

export default App