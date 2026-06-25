import { useState, useCallback, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import TypingArea from './components/TypingArea.jsx'
import StatsBar from './components/StatsBar.jsx'
import QuoteStatsBar from './components/QuoteStatsBar.jsx'
import Results from './components/Results.jsx'
import { useTypingEngine } from './hooks/useTypingEngine.js'
import { useTimer } from './hooks/useTimer.js'
import { usePersonalBest } from './hooks/usePersonalBest.js'
import { useQuote } from './hooks/useQuote.js'
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
  const [screen, setScreen]           = useState(SCREENS.SELECT)
  const [mode, setMode]               = useState(60)
  const [resultData, setResult]       = useState(null)
  const [testOptions, setTestOptions] = useState({ punctuation: false, numbers: false })
  const [testMode, setTestMode]       = useState('words') // 'words' | 'quote'

  const elapsedRef          = useRef(0)
  const snapshotIntervalRef = useRef(null)
  const elapsedIntervalRef  = useRef(null)
  const engineRef           = useRef(null)
  const timerRef            = useRef(null)

  const [elapsedTime, setElapsedTime] = useState(0)

  const { getPB, checkAndSave }                = usePersonalBest()
  const { quote, isLoading, error, fetchQuote } = useQuote()

  // Split quote into words array when quote loads
  const quoteWords = quote
    ? quote.content.split(' ').filter(w => w.length > 0)
    : null

  // ── Timer expire (words mode only) ──────────────────────────────
  const handleTimerExpire = useCallback(() => {
    clearInterval(snapshotIntervalRef.current)
    clearInterval(elapsedIntervalRef.current)
    const snapshots = timerRef.current.getWpmSnapshots()
    const finalWpm  = calcWPM(engineRef.current.correctChars, mode)
    const finalAcc  = calcAccuracy(engineRef.current.correctChars, engineRef.current.totalTyped)
    const isNewPB   = checkAndSave(mode, finalWpm)
    setResult({
      wpm:       finalWpm,
      accuracy:  finalAcc,
      errors:    engineRef.current.incorrectChars,
      snapshots,
      duration:  mode,
      isNewPB,
      quoteMode: false,
    })
    setScreen(SCREENS.RESULT)
  }, [mode, checkAndSave])

  const timer = useTimer(mode, handleTimerExpire)
  timerRef.current = timer

  // ── First keypress ───────────────────────────────────────────────
  const handleFirstKeyPress = useCallback(() => {
    elapsedRef.current = 0
    setElapsedTime(0)

    if (testMode === 'words') {
      timerRef.current.start()
      snapshotIntervalRef.current = setInterval(() => {
        elapsedRef.current += 5
        if (engineRef.current) {
          const wpm = calcWPM(engineRef.current.correctChars, elapsedRef.current)
          timerRef.current.addWpmSnapshot(wpm)
        }
      }, 5000)
    }

    // Track elapsed time for quote mode
    elapsedIntervalRef.current = setInterval(() => {
      elapsedRef.current += 1
      setElapsedTime(elapsedRef.current)
    }, 1000)

  }, [testMode])

  // Fixed words for quote mode, null for words mode
  const fixedWords = testMode === 'quote' ? quoteWords : null
  const engine     = useTypingEngine(handleFirstKeyPress, testOptions, fixedWords)
  engineRef.current = engine

  // ── Quote completion detection ───────────────────────────────────
  useEffect(() => {
    if (testMode !== 'quote') return
    if (!engine.isFinished) return

    clearInterval(elapsedIntervalRef.current)
    clearInterval(snapshotIntervalRef.current)

    const finalWpm = calcWPM(engine.correctChars, elapsedRef.current > 0 ? elapsedRef.current : 1)
    const finalAcc = calcAccuracy(engine.correctChars, engine.totalTyped)

    setResult({
      wpm:       finalWpm,
      accuracy:  finalAcc,
      errors:    engine.incorrectChars,
      snapshots: [],
      duration:  null,
      isNewPB:   false,
      quoteMode: true,
      author:    quote?.author ?? '',
    })
    setScreen(SCREENS.RESULT)
  }, [engine.isFinished, testMode, quote])

  // ── Live stats ───────────────────────────────────────────────────
  const elapsed = testMode === 'words'
    ? mode - timer.timeLeft
    : elapsedTime
  const liveWpm = calcWPM(engine.correctChars, elapsed > 0 ? elapsed : 1)
  const liveAcc = calcAccuracy(engine.correctChars, engine.totalTyped)

  // Quote progress percentage
  const quoteProgress = quoteWords
    ? Math.round((engine.currentWord / quoteWords.length) * 100)
    : 0

  // ── Handlers ────────────────────────────────────────────────────
  const handleSelectMode = useCallback((duration) => {
    setMode(duration)
    timerRef.current.reset()
  }, [])

  const handleTestModeChange = useCallback((newMode) => {
    setTestMode(newMode)
    timerRef.current.reset()
    setElapsedTime(0)
    elapsedRef.current = 0
  }, [])

  const handleStartTest = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    clearInterval(elapsedIntervalRef.current)
    elapsedRef.current = 0
    setElapsedTime(0)
    setScreen(SCREENS.TEST)
  }, [])

  const handleRetry = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    clearInterval(elapsedIntervalRef.current)
    elapsedRef.current = 0
    setElapsedTime(0)
    setResult(null)
    if (testMode === 'quote') fetchQuote()
    setScreen(SCREENS.TEST)
  }, [testMode, fetchQuote])

  const handleBackToMenu = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    clearInterval(elapsedIntervalRef.current)
    setResult(null)
    setElapsedTime(0)
    setScreen(SCREENS.SELECT)
  }, [])

  const handleKeyPressWrapped = useCallback((key) => {
    if (key === 'Escape') {
      engineRef.current.reset()
      timerRef.current.reset()
      clearInterval(snapshotIntervalRef.current)
      clearInterval(elapsedIntervalRef.current)
      elapsedRef.current = 0
      setElapsedTime(0)
      return
    }
    engineRef.current.handleKeyPress(key)
  }, [])

  useEffect(() => {
    if (screen !== SCREENS.RESULT) return
    let tabPressed = false
    const handleKey = (e) => {
      if (e.key === 'Escape') { handleBackToMenu(); return }
      if (e.key === 'Tab') { e.preventDefault(); tabPressed = true; return }
      if (e.key === 'Enter' && tabPressed) handleRetry()
      tabPressed = false
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen, handleRetry, handleBackToMenu])

  useEffect(() => {
    return () => {
      clearInterval(snapshotIntervalRef.current)
      clearInterval(elapsedIntervalRef.current)
    }
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
              options={testOptions}
              onOptionsChange={setTestOptions}
              testMode={testMode}
              onTestModeChange={handleTestModeChange}
            />
          )}

          {screen === SCREENS.TEST && (
            <div className="animate-fade-up w-full max-w-3xl px-2 sm:px-0">

              {testMode === 'words' ? (
                <StatsBar
                  wpm={liveWpm}
                  accuracy={liveAcc}
                  errors={engine.incorrectChars}
                  timeLeft={timer.timeLeft}
                  isRunning={timer.isRunning}
                  duration={mode}
                />
              ) : (
                <QuoteStatsBar
                  wpm={liveWpm}
                  accuracy={liveAcc}
                  errors={engine.incorrectChars}
                  isRunning={engine.hasStarted}
                  progress={quoteProgress}
                  elapsedTime={elapsedTime}
                />
              )}

              {/* Quote loading / error states */}
              {testMode === 'quote' && isLoading && (
                <div className="text-center text-txt-muted font-mono text-sm py-16 animate-pulse-soft">
                  loading quote...
                </div>
              )}

              {testMode === 'quote' && error && (
                <div className="flex flex-col items-center gap-4 py-16">
                  <p className="text-accent-error font-mono text-sm">{error}</p>
                  <button
                    onClick={fetchQuote}
                    className="px-4 py-2 rounded-lg border border-white/10 text-txt-base font-mono text-sm hover:bg-bg-card transition-all"
                  >
                    try again
                  </button>
                </div>
              )}

              {(!isLoading && !error) && (
                <TypingArea
                  words={engine.words}
                  charState={engine.charState}
                  currentWord={engine.currentWord}
                  currentChar={engine.currentChar}
                  isFinished={testMode === 'words' ? timer.timeLeft === 0 : engine.isFinished}
                  onKeyPress={handleKeyPressWrapped}
                />
              )}

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

        <footer className="text-center py-6 text-txt-muted text-sm font-mono">
          typeflow &mdash; built with react + vite
        </footer>
      </div>
    </div>
  )
}

export default App