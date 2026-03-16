import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(duration, onExpire) {
  const [timeLeft, setTimeLeft]     = useState(duration)
  const [isRunning, setIsRunning]   = useState(false)
  const intervalRef                 = useRef(null)
  const wpmSnapshotsRef             = useRef([])

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
  }, [isRunning])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setTimeLeft(duration)
    wpmSnapshotsRef.current = []
  }, [stop, duration])

  // Main countdown effect
  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          if (onExpire) onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning, onExpire])

  // Reset timeLeft when duration prop changes
  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  const addWpmSnapshot = useCallback((wpm) => {
    wpmSnapshotsRef.current.push(wpm)
  }, [])

  const getWpmSnapshots = useCallback(() => {
    return [...wpmSnapshotsRef.current]
  }, [])

  return {
    timeLeft,
    isRunning,
    start,
    stop,
    reset,
    addWpmSnapshot,
    getWpmSnapshots,
  }
}