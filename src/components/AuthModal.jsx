import { useState } from 'react'

function AuthModal({ onSignUp, onSignIn, onClose, btnText }) {
  const [tab,      setTab]      = useState('signin') // 'signin' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    if (tab === 'signup') {
      if (!username.trim()) {
        setError('Username is required')
        setLoading(false)
        return
      }
      if (username.length < 3) {
        setError('Username must be at least 3 characters')
        setLoading(false)
        return
      }
      const { error } = await onSignUp(email, password, username.trim())
      if (error) {
        setError(error.message)
      } else {
        onClose()  // ← email verification disabled, close modal directly
      }
    } else {
      const { error } = await onSignIn(email, password)
      if (error) setError(error.message)
      else onClose()
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-sm bg-bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-up">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-txt-bright font-sans font-medium text-lg">
              {success ? 'check your email' : tab === 'signin' ? 'sign in' : 'create account'}
            </h2>
            <button
              onClick={onClose}
              className="text-txt-muted hover:text-txt-base transition-colors font-mono text-sm"
            >
              ✕
            </button>
          </div>

          {success ? (
            <div className="space-y-4">
              <p className="text-txt-sub font-mono text-sm leading-relaxed">
                we sent a verification link to <span className="text-txt-base">{email}</span>.
                click the link to activate your account then sign in.
              </p>
              <button
                onClick={() => { setSuccess(false); setTab('signin') }}
                style={{ color: btnText, backgroundColor: 'var(--brand)' }}
                className="w-full py-2.5 rounded-xl font-sans font-medium text-sm transition-all duration-200"
              >
                go to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-1 bg-bg-card rounded-lg p-1 mb-5">
                <TabBtn label="sign in" active={tab === 'signin'} onClick={() => { setTab('signin'); setError(null) }} />
                <TabBtn label="sign up" active={tab === 'signup'} onClick={() => { setTab('signup'); setError(null) }} />
              </div>

              <div className="space-y-3" onKeyDown={handleKeyDown}>
                {tab === 'signup' && (
                  <Input label="username" type="text" value={username} onChange={setUsername} placeholder="yourname" autoFocus />
                )}
                <Input label="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoFocus={tab === 'signin'} />
                <Input label="password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

                {error && (
                  <p className="text-accent-error font-mono text-xs pt-1">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ color: btnText, backgroundColor: 'var(--brand)' }}
                  className="
                    w-full py-2.5 rounded-xl mt-2
                    font-sans font-medium text-sm
                    transition-all duration-200 active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading
                    ? 'please wait...'
                    : tab === 'signin' ? 'sign in' : 'create account'
                  }
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-1.5 rounded-md font-mono text-sm transition-all duration-200
        ${active ? 'bg-brand/15 text-brand' : 'text-txt-muted hover:text-txt-base'}
      `}
    >
      {label}
    </button>
  )
}

function Input({ label, type, value, onChange, placeholder, autoFocus }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-txt-untyped font-mono text-xs uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          w-full px-3 py-2.5 rounded-lg
          bg-bg-card border border-white/10
          text-txt-base font-mono text-sm
          placeholder:text-txt-untyped
          focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20
          transition-all duration-150
        "
      />
    </div>
  )
}

export default AuthModal