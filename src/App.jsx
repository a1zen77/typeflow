import { useState, useCallback, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import TypingArea from './components/TypingArea.jsx'
import StatsBar from './components/StatsBar.jsx'
import Results from './components/Results.jsx'
import AuthModal from './components/AuthModal.jsx'
import ToastContainer from './components/ToastContainer.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import { useTypingEngine } from './hooks/useTypingEngine.js'
import { useTimer } from './hooks/useTimer.js'
import { usePersonalBest } from './hooks/usePersonalBest.js'
import { useAuth } from './hooks/useAuth.js'
import { useScores } from './hooks/useScores.js'
import { useToast } from './hooks/useToast.js'
import { useTheme } from './hooks/useTheme.js'
import { calcWPM, calcAccuracy } from './utils/wpmCalc.js'

export const MODES = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1min', value: 60 },
  { label: '2min', value: 120 },
]

const SCREENS = {
  SELECT:      'select',
  TEST:        'test',
  RESULT:      'result',
  LEADERBOARD: 'leaderboard',
}

function App() {
  const [screen, setScreen]               = useState(SCREENS.SELECT)
  const [mode, setMode]                   = useState(60)
  const [resultData, setResult]           = useState(null)
  const [testOptions, setTestOptions]     = useState({ punctuation: false, numbers: false })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSaving, setIsSaving]           = useState(false)
  const [isSaved, setIsSaved]             = useState(false)

  const elapsedRef          = useRef(0)
  const snapshotIntervalRef = useRef(null)
  const engineRef           = useRef(null)
  const timerRef            = useRef(null)

  const { checkAndSave }                           = usePersonalBest()
  const { user, profile, signUp, signIn, signOut } = useAuth()
  const { saveScore }                              = useScores()
  const { toasts, toast, removeToast }             = useToast()
  const { themeName, setTheme, btnText }           = useTheme()

  const handleTimerExpire = useCallback(() => {
    clearInterval(snapshotIntervalRef.current)
    const snapshots = timerRef.current.getWpmSnapshots()
    const finalWpm  = calcWPM(engineRef.current.correctChars, mode)
    const finalAcc  = calcAccuracy(engineRef.current.correctChars, engineRef.current.totalTyped)
    const isNewPB   = checkAndSave(mode, finalWpm)
    setIsSaved(false)
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

  const engine = useTypingEngine(handleFirstKeyPress, testOptions)
  engineRef.current = engine

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
    setIsSaved(false)
    setScreen(SCREENS.TEST)
  }, [])

  const handleBackToMenu = useCallback(() => {
    engineRef.current.reset()
    timerRef.current.reset()
    clearInterval(snapshotIntervalRef.current)
    setResult(null)
    setIsSaved(false)
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

  // Save score to Supabase
  const handleSaveScore = useCallback(async () => {
    if (!user || !resultData || isSaved) return
    setIsSaving(true)
    const { error } = await saveScore(user.id, {
      wpm:      resultData.wpm,
      accuracy: resultData.accuracy,
      errors:   resultData.errors,
      duration: resultData.duration,
    })
    setIsSaving(false)
    if (error) {
      toast.error('failed to save score — try again')
    } else {
      setIsSaved(true)
      toast.success('score saved to leaderboard!')
    }
  }, [user, resultData, isSaved, saveScore, toast])

  // Auto save when logged in
  useEffect(() => {
    if (user && resultData && screen === SCREENS.RESULT && !isSaved) {
      handleSaveScore()
    }
  }, [screen, resultData, user])

  // Sign in toast
  const handleSignIn = useCallback(async (email, password) => {
    const { data, error } = await signIn(email, password)
    if (!error) {
      toast.success('signed in successfully')
      setShowAuthModal(false)
    }
    return { data, error }
  }, [signIn, toast])

  // Sign up toast
  const handleSignUp = useCallback(async (email, password, username) => {
    const { data, error } = await signUp(email, password, username)
    if (!error) toast.info('account created — check your email!')
    return { data, error }
  }, [signUp, toast])

  // Sign out toast
  const handleSignOut = useCallback(async () => {
    await signOut()
    toast.info('signed out')
  }, [signOut, toast])

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
    return () => clearInterval(snapshotIntervalRef.current)
  }, [])

  return (
    <div className="relative min-h-screen bg-bg-base bg-grid vignette">
      <div className="relative z-10 flex flex-col min-h-screen">

        <Header
          mode={mode}
          screen={screen}
          onBackToMenu={handleBackToMenu}
          user={user}
          profile={profile}
          onSignInClick={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          onLeaderboardClick={() => setScreen(SCREENS.LEADERBOARD)}
          themeName={themeName}
          onThemeChange={setTheme}
        />

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
              btnText={btnText}
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
              user={user}
              onSignInClick={() => setShowAuthModal(true)}
              onSaveScore={handleSaveScore}
              isSaving={isSaving}
              isSaved={isSaved}
              btnText={btnText}
            />
          )}

          {screen === SCREENS.LEADERBOARD && (
            <Leaderboard
              user={user}
              profile={profile}
              onBack={handleBackToMenu}
            />
          )}

        </main>

        <footer className="text-center py-6 text-txt-muted text-sm font-mono">
          typeflow &mdash; built with react + vite
        </footer>
      </div>

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          onClose={() => setShowAuthModal(false)}
          btnText={btnText}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

    </div>
  )
}

export default App