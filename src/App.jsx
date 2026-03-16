import { useState, useCallback, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import TypingArea from './components/TypingArea.jsx'
import StatsBar from './components/StatsBar.jsx'
import Results from './components/Results.jsx'
import { useTypingEngine } from './hooks/useTypingEngine.js'
import { useTimer } from './hooks/useTimer.js'
import { usePersonalBest } from './hooks/usePersonalBest.js'
import { calcWPM, calcAccuracy } from './utils/wpmCalc.js'

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
  const elapsedRef              = useRef(0)
  const snapshotIntervalRef     = useRef(null)
  const engineRef               = useRef(null)
  const timerRef                = useRef(null)

  const { getPB, checkAndSave } = usePersonalBest()

  // Timer expire handler
  const handleTimerExpire = useCallback(() => {
    clearInterval(snapshotIntervalRef.current)
    const snapshots  = timerRef.current.getWpmSnapshots()
    const finalWpm   = calcWPM(engineRef.current.correctChars, mode)
    const finalAcc   = calcAccuracy(engineRef.current.correctChars, engineRef.current.totalTyped)
    const isNewPB    = checkAndSave(mode, finalWpm)
    setResult({
      wpm:      finalWpm,
      accuracy: finalAcc,
      errors:   engineRef.current.incorrectChars,
      snapshots,
      duration: mode,
      isNewPB,
    })
    setScreen(SCREENS.RESULT)
  }, [mode, checkAndSave])

  const timer = useTimer(mode, handleTimerExpire)
  timerRef.current = timer

  // First keypress starts the timer
  const handleFirstKeyPress = useCallback(() => {
    elapsedRef.current = 0
    timerRef.current.start()
    snapshotIntervalRef.current = setInterval(() => {
      elapsedRef.current += 5
      if (engineRef.current) {
        const wpm = calcWPM(engineRef.current.correctChars, elapsedRef.current)
        timerRef.current.addWpmSnapshot(wpm)
      }
    }, 5000)
  }, [])

  const engine = useTypingEngine(handleFirstKeyPress)
  engineRef.current = engine

  // Live stats
  const elapsed = mode - timer.timeLeft
  const liveWpm = calcWPM(engine.correctChars, elapsed > 0 ? elapsed : 1)
  const liveAcc = calcAccuracy(engine.correctChars, engine.totalTyped)

  const handleSelectMode = useCallback((duration) => {
    setMode(duration)
    timerRef.current.reset()
  }, [])

  const handleStartTest = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    elapsedRef.current = 0
    setScreen(SCREENS.TEST)
  }, [])

  const handleRetry = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    elapsedRef.current = 0
    setResult(null)
    setScreen(SCREENS.TEST)
  }, [])

  const handleBackToMenu = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    setResult(null)
    setScreen(SCREENS.SELECT)
  }, [])

  const handleKeyPressWrapped = useCallback((key) => {
    if (key === 'Escape') {
      engineRef.current.reset()
      timerRef.current.reset()
      clearInterval(snapshotIntervalRef.current)
      elapsedRef.current = 0
      return
    }
    engineRef.current.handleKeyPress(key)
  }, [])

  // Tab + Enter to retry from results screen
  useEffect(() => {
    if (screen !== SCREENS.RESULT) return
    let tabPressed = false

    const handleKey = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        tabPressed = true
        return
      }
      if (e.key === 'Enter' && tabPressed) {
        handleRetry()
      }
      tabPressed = false
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen, handleRetry])

  // Cleanup
  useEffect(() => {
    return () => clearInterval(snapshotIntervalRef.current)
  }, [])

  return (
    <div className="relative min-h-screen bg-bg-base bg-grid vignette">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header mode={mode} screen={screen} onBackToMenu={handleBackToMenu} />

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6 sm:py-12">

          {screen === SCREENS.SELECT && (
            <ModeSelector
              key={screen} 
              modes={MODES}
              selected={mode}
              onSelect={handleSelectMode}
              onStart={handleStartTest}
            />
          )}

          {screen === SCREENS.TEST && (
            <div className="animate-fade-up w-full max-w-3xl px-2 sm:px-0">
              <StatsBar
                wpm={liveWpm}
                accuracy={liveAcc}
                errors={engine.incorrectChars}
                timeLeft={timer.timeLeft}
                isRunning={timer.isRunning}
                duration={mode}
              />
              <TypingArea
                words={engine.words}
                charState={engine.charState}
                currentWord={engine.currentWord}
                currentChar={engine.currentChar}
                isFinished={timer.timeLeft === 0}
                onKeyPress={handleKeyPressWrapped}
              />
            </div>
          )}

          {screen === SCREENS.RESULT && resultData && (
            <Results
              data={resultData}
              onRetry={handleRetry}
              onChangeMode={handleBackToMenu}
            />
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