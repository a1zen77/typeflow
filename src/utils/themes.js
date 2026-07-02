export const THEMES = {
  midnight: {
    name:  'midnight',
    label: 'Midnight',
    preview: ['#0F0F14', '#7C6AF7', '#4ADE80'],
    vars: {
      '--bg-base':    '#0F0F14',
      '--bg-surface': '#16161E',
      '--bg-card':    '#1C1C27',
      '--bg-hover':   '#222232',

      '--txt-untyped': '#3D3D55',
      '--txt-muted':   '#5A5A7A',
      '--txt-sub':     '#8888AA',
      '--txt-base':    '#C8C8E0',
      '--txt-bright':  '#E8E8F8',

      '--accent-correct': '#4ADE80',
      '--accent-error':   '#F87171',
      '--accent-cursor':  '#7C6AF7',
      '--accent-gold':    '#FBBF24',
      '--brand':          '#7C6AF7',
      '--btn-text':       '#FFFFFF',

      '--grid-color': 'rgba(124, 106, 247, 0.03)',
    }
  },

  terminal: {
    name:    'terminal',
    label:   'Terminal',
    preview: ['#0A0A0A', '#00FF41', '#00CC33'],
    vars: {
      '--bg-base':    '#0A0A0A',
      '--bg-surface': '#0F0F0F',
      '--bg-card':    '#141414',
      '--bg-hover':   '#1A1A1A',

      '--txt-untyped': '#1A3D1A',
      '--txt-muted':   '#2D6E2D',
      '--txt-sub':     '#4CAF4C',
      '--txt-base':    '#80D880',
      '--txt-bright':  '#00FF41',

      '--accent-correct': '#00FF41',
      '--accent-error':   '#FF4444',
      '--accent-cursor':  '#00FF41',
      '--accent-gold':    '#FFD700',
      '--brand':          '#00FF41',   // ← brightened from #00CC33
      '--btn-text':       '#0A0A0A',   // ← black text on bright green button

      '--grid-color': 'rgba(0, 255, 65, 0.03)',
    }
  },

  sepia: {
    name:  'sepia',
    label: 'Sepia',
    preview: ['#F5ECD7', '#C8860A', '#8B6914'],
    vars: {
      '--bg-base':    '#F5ECD7',
      '--bg-surface': '#EDE0C4',
      '--bg-card':    '#E5D4B0',
      '--bg-hover':   '#DCC89C',

      '--txt-untyped': '#C4AA84',
      '--txt-muted':   '#A08050',
      '--txt-sub':     '#7A5C30',
      '--txt-base':    '#3D2B1F',
      '--txt-bright':  '#1A0F00',

      '--accent-correct': '#5A8A00',
      '--accent-error':   '#CC2200',
      '--accent-cursor':  '#C8860A',
      '--accent-gold':    '#C8860A',
      '--brand':          '#C8860A',
      '--btn-text':       '#FFFFFF',

      '--grid-color': 'rgba(200, 134, 10, 0.05)',
    }
  },

  ocean: {
    name:  'ocean',
    label: 'Ocean',
    preview: ['#0A1628', '#38BDF8', '#0EA5E9'],
    vars: {
      '--bg-base':    '#0A1628',
      '--bg-surface': '#0F1E38',
      '--bg-card':    '#162540',
      '--bg-hover':   '#1C2D4E',

      '--txt-untyped': '#1E3A5F',
      '--txt-muted':   '#2E5A8A',
      '--txt-sub':     '#5B8DB8',
      '--txt-base':    '#B8D4F0',
      '--txt-bright':  '#E8F4FF',

      '--accent-correct': '#34D399',
      '--accent-error':   '#F87171',
      '--accent-cursor':  '#38BDF8',
      '--accent-gold':    '#FBBF24',
      '--brand':          '#38BDF8',
      '--btn-text':       '#FFFFFF',

      '--grid-color': 'rgba(56, 189, 248, 0.03)',
    }
  },

  rose: {
    name:  'rose',
    label: 'Rose',
    preview: ['#1A1015', '#F472B6', '#EC4899'],
    vars: {
      '--bg-base':    '#1A1015',
      '--bg-surface': '#211520',
      '--bg-card':    '#2A1A28',
      '--bg-hover':   '#321F30',

      '--txt-untyped': '#4A2840',
      '--txt-muted':   '#7A4468',
      '--txt-sub':     '#B06090',
      '--txt-base':    '#F0D0E0',
      '--txt-bright':  '#FFF0F6',

      '--accent-correct': '#86EFAC',
      '--accent-error':   '#FCA5A5',
      '--accent-cursor':  '#F472B6',
      '--accent-gold':    '#FCD34D',
      '--brand':          '#F472B6',
      '--btn-text':       '#FFFFFF',

      '--grid-color': 'rgba(244, 114, 182, 0.04)',
    }
  },
}

export const DEFAULT_THEME = 'midnight'