import { useState, useCallback, useEffect } from 'react'

const QUOTE_API = 'https://api.quotable.io/random?minLength=80&maxLength=180'

export function useQuote() {
  const [quote,     setQuote]     = useState(null)   // { content, author }
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  const fetchQuote = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res  = await fetch(QUOTE_API)
      if (!res.ok) throw new Error('Failed to fetch quote')
      const data = await res.json()
      setQuote({ content: data.content, author: data.author })
    } catch (err) {
      setError('Could not load a quote. Check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on first mount
  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  return { quote, isLoading, error, fetchQuote }
}