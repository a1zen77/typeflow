import { useState, useCallback } from 'react'
import { generateWords, buildCharState } from '../utils/wordGen.js'

const WORD_COUNT = 80

export function useTypingEngine(onFirstKeyPress, options = {}, fixedWords = null) {
  const getInitialState = () => {
    const w = fixedWords ?? generateWords(WORD_COUNT, options)
    return { words: w, charState: buildCharState(w) }
  }

  const [{ words, charState }, setWordState] = useState(getInitialState)
  const [currentWord,    setCurrentWord]    = useState(0)
  const [currentChar,    setCurrentChar]    = useState(0)
  const [hasStarted,     setHasStarted]     = useState(false)
  const [isFinished,     setIsFinished]     = useState(false)
  const [correctChars,   setCorrectChars]   = useState(0)
  const [incorrectChars, setIncorrectChars] = useState(0)
  const [totalTyped,     setTotalTyped]     = useState(0)

  // When fixedWords changes (new quote fetched), reset with new words
  useEffect(() => {
    if (fixedWords) {
      setWordState({ words: fixedWords, charState: buildCharState(fixedWords) })
      setCurrentWord(0)
      setCurrentChar(0)
      setHasStarted(false)
      setIsFinished(false)
      setCorrectChars(0)
      setIncorrectChars(0)
      setTotalTyped(0)
    }
  }, [fixedWords])

  const reset = useCallback(() => {
    const w = fixedWords ?? generateWords(WORD_COUNT, options)
    setWordState({ words: w, charState: buildCharState(w) })
    setCurrentWord(0)
    setCurrentChar(0)
    setHasStarted(false)
    setIsFinished(false)
    setCorrectChars(0)
    setIncorrectChars(0)
    setTotalTyped(0)
  }, [fixedWords, options])

  const handleKeyPress = useCallback((key) => {
    if (isFinished) return

    if (!hasStarted) {
      setHasStarted(true)
      if (onFirstKeyPress) onFirstKeyPress()
    }

    if (key === 'Backspace') {
      if (currentChar === 0) return
      setWordState(prev => {
        const newState = prev.charState.map(w => [...w])
        newState[currentWord][currentChar - 1] = {
          ...newState[currentWord][currentChar - 1],
          status: 'untyped'
        }
        return { words: prev.words, charState: newState }
      })
      setCurrentChar(c => c - 1)
      return
    }

    if (key === ' ') {
      if (currentWord >= words.length - 1) {
        setIsFinished(true)
        if (onFirstKeyPress) {}  // test ends on last space
        return
      }
      setCurrentWord(w => w + 1)
      setCurrentChar(0)
      return
    }

    if (key.length !== 1) return

    const wordLen = words[currentWord].length
    if (currentChar >= wordLen) return

    const isCorrect = key === words[currentWord][currentChar]

    setWordState(prev => {
      const newState = prev.charState.map(w => [...w])
      newState[currentWord][currentChar] = {
        ...newState[currentWord][currentChar],
        status: isCorrect ? 'correct' : 'incorrect'
      }
      return { words: prev.words, charState: newState }
    })

    if (isCorrect) setCorrectChars(n => n + 1)
    else setIncorrectChars(n => n + 1)
    setTotalTyped(n => n + 1)
    setCurrentChar(c => c + 1)

  }, [isFinished, hasStarted, currentWord, currentChar, words, onFirstKeyPress])

  return {
    words,
    charState,
    currentWord,
    currentChar,
    hasStarted,
    isFinished,
    correctChars,
    incorrectChars,
    totalTyped,
    handleKeyPress,
    reset,
  }
}