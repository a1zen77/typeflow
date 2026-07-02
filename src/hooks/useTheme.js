import { useState, useEffect, useCallback } from 'react'
import { THEMES, DEFAULT_THEME } from '../utils/themes.js'

const STORAGE_KEY = 'typeflow_theme'

export function useTheme() {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME
  })

  // Apply CSS variables to :root whenever theme changes
  const applyTheme = useCallback((name) => {
    const theme = THEMES[name]
    if (!theme) return
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [])

  useEffect(() => {
    applyTheme(themeName)
  }, [themeName, applyTheme])

  const setTheme = useCallback((name) => {
    if (!THEMES[name]) return
    setThemeName(name)
    localStorage.setItem(STORAGE_KEY, name)
    applyTheme(name)
  }, [applyTheme])

  return {
    themeName,
    theme: THEMES[themeName],
    setTheme,
  }
}