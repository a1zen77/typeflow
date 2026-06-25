import WORDS, { CONTRACTIONS, NUMBERS } from '../data/words.js'

/**
 * Generate a random array of words for a typing test.
 * @param {number} count - how many words to generate
 * @param {object} options - { punctuation: bool, numbers: bool }
 */
export function generateWords(count = 80, options = {}) {
  const { punctuation = false, numbers = false } = options

  // Build the base word pool
  let pool = [...WORDS]

  // Add contractions into the pool if punctuation is on
  if (punctuation) {
    pool = [...pool, ...CONTRACTIONS]
  }

  // Generate raw word list
  const rawWords = []
  for (let i = 0; i < count; i++) {
    // Inject a number roughly every 8 words if numbers mode is on
    if (numbers && i > 0 && i % 8 === 0) {
      const num = NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
      rawWords.push(num)
      continue
    }
    const idx = Math.floor(Math.random() * pool.length)
    rawWords.push(pool[idx])
  }

  // Apply punctuation rules if enabled
  if (punctuation) {
    return applyPunctuation(rawWords)
  }

  return rawWords
}

/**
 * Apply natural-feeling punctuation to a word array.
 * - Commas after words every 3-5 words mid-sentence
 * - Periods after words every 6-10 words to end a sentence
 * - Never both on the same word
 * - Never on the last word
 */
function applyPunctuation(words) {
  const result = [...words]
  let nextComma  = randomBetween(3, 5)
  let nextPeriod = randomBetween(6, 10)

  for (let i = 0; i < result.length - 1; i++) {
    // Skip numbers and words that already have punctuation
    if (/\d/.test(result[i])) continue
    if (/[.,]$/.test(result[i]))  continue

    if (i === nextPeriod) {
      result[i] = result[i] + '.'
      // Reset both counters after a period
      nextComma  = i + randomBetween(3, 5)
      nextPeriod = i + randomBetween(6, 10)
    } else if (i === nextComma) {
      result[i] = result[i] + ','
      nextComma  = i + randomBetween(3, 5)
    }
  }

  return result
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Build the initial character state array for a word list.
 */
export function buildCharState(words) {
  return words.map(word =>
    word.split('').map(char => ({ char, status: 'untyped' }))
  )
}