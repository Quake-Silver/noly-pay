import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type WaitlistCtx = { open: () => void };
const Ctx = createContext<WaitlistCtx>({ open: () => {} });

export const useWaitlist = () => useContext(Ctx);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {isOpen && <WaitlistModal onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<Element | null>(null);

  const emailError = touched && !EMAIL_RE.test(email.trim()) ? 'Enter a valid email address' : '';

  useEffect(() => {
    lastFocused.current = document.activeElement;
    firstFieldRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const els = dialogRef.current.querySelectorAll<HTMLElement>('button, input, a[href]');
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      (lastFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!EMAIL_RE.test(email.trim())) return;
    setStatus('sending');
    // UI only for now: nothing is stored. Swap this timeout for a real request when storage is chosen.
    window.setTimeout(() => setStatus('done'), 700);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="waitlist-title" ref={dialogRef}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        {status === 'done' ? (
          <div className="modal-done">
            <div className="modal-done-badge" aria-hidden="true">✓</div>
            <h2 id="waitlist-title">You're on the list{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}.</h2>
            <p>We'll email <strong>{email.trim()}</strong> as soon as Nolypay opens up. Rent day is about to get a lot calmer.</p>
            <button className="btn btn-primary btn-block" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <img src="img/logo.png" alt="" width={36} height={36} className="modal-logo" />
            <h2 id="waitlist-title">Join the Nolypay waitlist</h2>
            <p className="modal-sub">Be first in line when we launch. No spam, just one email when it's your turn.</p>
            <label className="field">
              <span>Full name</span>
              <input
                ref={firstFieldRef}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adaeze Okafor"
              />
            </label>
            <label className={`field ${emailError ? 'has-error' : ''}`}>
              <span>Email address</span>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@example.com"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <small id="email-error" role="alert">
                  {emailError}
                </small>
              )}
            </label>
            <button className="btn btn-primary btn-block" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
