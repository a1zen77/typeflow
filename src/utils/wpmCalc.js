export function calcWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctChars / 5;
  return Math.round(words / minutes);
}

export function calcAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

/**
 * Calculate typing consistency as a percentage.
 * Based on the standard deviation of WPM snapshots.
 * Higher % = more consistent speed throughout the test.
 *
 * @param {number[]} snapshots - WPM values taken every 5 seconds
 * @returns {number} consistency 0-100
 */
export function calcConsistency(snapshots) {
  if (!snapshots || snapshots.length < 2) return 100

  const mean = snapshots.reduce((a, b) => a + b, 0) / snapshots.length
  const variance = snapshots.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / snapshots.length
  const stdDev = Math.sqrt(variance)

  // Convert to a 0-100 score — lower deviation = higher consistency
  const consistency = Math.max(0, Math.round(100 - (stdDev / mean) * 100))
  return consistency
}