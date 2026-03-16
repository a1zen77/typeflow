import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import ModeSelector from './components/ModeSelector.jsx'

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
  const [screen, setScreen]     = useState(SCREENS.SELECT)
  const [mode, setMode]         = useState(60)
  const [resultData, setResult] = useState(null)

  const handleSelectMode  = useCallback((duration) => setMode(duration), [])
  const handleStartTest   = useCallback(() => setScreen(SCREENS.TEST), [])
  const handleTestComplete = useCallback((data) => {
    setResult(data)
    setScreen(SCREENS.RESULT)
  }, [])
  const handleRetry       = useCallback(() => { setResult(null); setScreen(SCREENS.TEST) }, [])
  const handleBackToMenu  = useCallback(() => { setResult(null); setScreen(SCREENS.SELECT) }, [])

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
              <div className="text-txt-muted text-center typing-font text-lg">
                Typing test — coming in Phase 2
              </div>
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