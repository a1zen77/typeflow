import { useState, useCallback, useRef } from 'react'
import { generateWords, buildCharState } from '../utils/wordGen.js'

const WORD_COUNT = 80

export function useTypingEngine(onFirstKeyPress) {
  const [words, setWords]           = useState(() => generateWords(WORD_COUNT))
  const [charState, setCharState]   = useState(() => buildCharState(generateWords(WORD_COUNT)))
  const [currentWord, setCurrentWord] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [hasStarted, setHasStarted]   = useState(false)
  const [isFinished, setIsFinished]   = useState(false)
  const [correctChars, setCorrectChars]     = useState(0)
  const [incorrectChars, setIncorrectChars] = useState(0)
  const [totalTyped, setTotalTyped]         = useState(0)

  const reset = useCallback(() => {
    const newWords = generateWords(WORD_COUNT)
    setWords(newWords)
    setCharState(buildCharState(newWords))
    setCurrentWord(0)
    setCurrentChar(0)
    setHasStarted(false)
    setIsFinished(false)
    setCorrectChars(0)
    setIncorrectChars(0)
    setTotalTyped(0)
  }, [])

  const handleKeyPress = useCallback((key) => {
    if (isFinished) return

    // Fire callback on very first keypress
    if (!hasStarted) {
      setHasStarted(true)
      if (onFirstKeyPress) onFirstKeyPress()
    }

    // Backspace — go back one char in current word only
    if (key === 'Backspace') {
      if (currentChar === 0) return
      const newState = charState.map(w => [...w])
      newState[currentWord][currentChar - 1] = {
        ...newState[currentWord][currentChar - 1],
        status: 'untyped'
      }
      setCharState(newState)
      setCurrentChar(c => c - 1)
      return
    }

    // Space — advance to next word
    if (key === ' ') {
      if (currentWord >= words.length - 1) {
        setIsFinished(true)
        return
      }
      setCurrentWord(w => w + 1)
      setCurrentChar(0)
      return
    }

    // Ignore non-character keys
    if (key.length !== 1) return

    const wordLen = words[currentWord].length

    // Don't go past end of word
    if (currentChar >= wordLen) return

    const isCorrect = key === words[currentWord][currentChar]

    // Update char state
    const newState = charState.map(w => [...w])
    newState[currentWord][currentChar] = {
      ...newState[currentWord][currentChar],
      status: isCorrect ? 'correct' : 'incorrect'
    }
    setCharState(newState)

    // Update stats
    if (isCorrect) setCorrectChars(n => n + 1)
    else setIncorrectChars(n => n + 1)
    setTotalTyped(n => n + 1)

    setCurrentChar(c => c + 1)
  }, [isFinished, hasStarted, charState, currentWord, currentChar, words, onFirstKeyPress])

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