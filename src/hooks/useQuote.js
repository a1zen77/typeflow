import { useState, useCallback } from 'react'
import QUOTES from '../data/quotes.js'

/**
 * Returns a random quote from the local quotes bank.
 * No API call needed — works offline, never breaks.
 */
export function useQuote() {
  const getRandomQuote = () => {
    const idx = Math.floor(Math.random() * QUOTES.length)
    return QUOTES[idx]
  }

  const [quote, setQuote]       = useState(() => getRandomQuote())
  const [isLoading]             = useState(false)  // always false now
  const [error]                 = useState(null)   // always null now

  const fetchQuote = useCallback(() => {
    setQuote(getRandomQuote())
  }, [])

  return { quote, isLoading, error, fetchQuote }
}