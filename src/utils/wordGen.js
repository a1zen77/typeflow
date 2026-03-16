import WORDS from '../data/words.js';

export function generateWords(count = 80) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * WORDS.length);
    result.push(WORDS[idx]);
  }
  return result;
}

export function buildCharState(words) {
  return words.map(word =>
    word.split('').map(char => ({ char, status: 'untyped' }))
  );
}