import { useState, useCallback } from 'react'
import { loadPersonalBests, savePersonalBest } from '../utils/storage.js'

export function usePersonalBest() {
  const [pbs, setPbs] = useState(() => loadPersonalBests())

  const checkAndSave = useCallback((duration, wpm) => {
    const isNewPB = savePersonalBest(duration, wpm)
    if (isNewPB) {
      setPbs(loadPersonalBests())
    }
    return isNewPB
  }, [])

  const getPB = useCallback((duration) => {
    return pbs[duration] ?? null
  }, [pbs])

  return { getPB, checkAndSave }
}