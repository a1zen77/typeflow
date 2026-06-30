import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useScores() {

  const [leaderboard, setLeaderboard] = useState([])
  const [personalScores, setPersonalScores] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Save a score to Supabase after a test
  const saveScore = useCallback(async (userId, { wpm, accuracy, errors, duration }) => {
    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id:  userId,
        wpm,
        accuracy,
        errors,
        duration,
        mode: 'words',
      })
      .select()
      .single()

    if (error) console.error('Failed to save score:', error.message)
    return { data, error }
  }, [])

  // Fetch top 20 scores for a given duration
  const fetchLeaderboard = useCallback(async (duration) => {
    setIsLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('scores')
      .select(`
        id,
        wpm,
        accuracy,
        errors,
        duration,
        created_at,
        profiles (username)
      `)
      .eq('duration', duration)
      .order('wpm', { ascending: false })
      .limit(20)

    if (error) {
      setError(error.message)
    } else {
      setLeaderboard(data ?? [])
    }

    setIsLoading(false)
  }, [])

  // Fetch personal score history for the logged in user
  const fetchPersonalScores = useCallback(async (userId) => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error) setPersonalScores(data ?? [])
    setIsLoading(false)
  }, [])

  // Get user's best score for a duration
  const fetchPersonalBest = useCallback(async (userId, duration) => {
    const { data, error } = await supabase
      .from('scores')
      .select('wpm')
      .eq('user_id', userId)
      .eq('duration', duration)
      .order('wpm', { ascending: false })
      .limit(1)
      .single()

    if (error) return null
    return data?.wpm ?? null
  }, [])

  return {
    leaderboard,
    personalScores,
    isLoading,
    error,
    saveScore,
    fetchLeaderboard,
    fetchPersonalScores,
    fetchPersonalBest,
  }
}