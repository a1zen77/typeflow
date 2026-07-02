import { useEffect, useState } from 'react'

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleRemove = () => {
    setVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const styles = {
    success: {
      border:  'border-accent-correct/30',
      dot:     'bg-accent-correct',
      text:    'text-accent-correct',
    },
    error: {
      border:  'border-accent-error/30',
      dot:     'bg-accent-error',
      text:    'text-accent-error',
    },
    info: {
      border:  'border-brand/30',
      dot:     'bg-brand',
      text:    'text-brand',
    },
  }

  const s = styles[toast.type] ?? styles.info

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3
        px-4 py-3 rounded-xl
        bg-bg-surface border ${s.border}
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        transition-all duration-300 ease-out
        ${visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3'
        }
      `}
      style={{ minWidth: '220px', maxWidth: '320px' }}
    >
      {/* Dot indicator */}
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />

      {/* Message */}
      <span className="text-txt-base font-mono text-sm flex-1">
        {toast.message}
      </span>

      {/* Dismiss button */}
      <button
        onClick={handleRemove}
        className="text-txt-untyped hover:text-txt-muted transition-colors text-xs ml-1 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  )
}

export default ToastContainer