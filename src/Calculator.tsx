import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useWaitlist } from './waitlist';

type Freq = 'once' | 'daily' | 'weekly' | 'monthly';

const FREQS: { id: Freq; label: string; days: number; unit: string }[] = [
  { id: 'once', label: 'Just this once', days: 0, unit: '' },
  { id: 'daily', label: 'Daily', days: 1, unit: 'day' },
  { id: 'weekly', label: 'Weekly', days: 7, unit: 'week' },
  { id: 'monthly', label: 'Monthly', days: 30, unit: 'month' },
];

const RENT_MIN = 100_000;
const RENT_MAX = 5_000_000;
const RENT_STEP = 10_000;
const CHIPS = [
  { label: '₦250k', value: 250_000 },
  { label: '₦400k', value: 400_000 },
  { label: '₦800k', value: 800_000 },
  { label: '₦1.2m', value: 1_200_000 },
];

const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-NG');
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

function saveRange(freq: Freq, rent: number) {
  // Sensible slider bounds per rhythm so the handle is never stuck at an extreme.
  switch (freq) {
    case 'daily':
      return { min: 500, max: Math.max(1_000, Math.round(rent / 7)), step: 500 };
    case 'weekly':
      return { min: 1_000, max: Math.max(5_000, Math.round(rent / 2)), step: 1_000 };
    case 'monthly':
      return { min: 5_000, max: rent, step: 1_000 };
    default:
      return { min: rent, max: rent, step: 1_000 };
  }
}

function analogy(perDay: number) {
  if (perDay <= 1_500) return 'a bottle of Coke and some chin-chin';
  if (perDay <= 3_500) return 'a plate of rice and stew';
  if (perDay <= 8_000) return 'a plate of jollof with chicken';
  if (perDay <= 15_000) return 'a Saturday night out with friends';
  return 'a weekend shopping run';
}

function addDays(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function Calculator() {
  const { open } = useWaitlist();
  const [rent, setRent] = useState(1_970_000);
  const [freq, setFreq] = useState<Freq>('monthly');
  const [save, setSave] = useState(191_000);

  const range = saveRange(freq, rent);
  const amount = freq === 'once' ? rent : clamp(save, range.min, range.max);

  const result = useMemo(() => {
    const f = FREQS.find((x) => x.id === freq)!;
    const drops = freq === 'once' ? 1 : Math.ceil(rent / amount);
    const totalDays = freq === 'once' ? 0 : drops * f.days;
    const readyBy = addDays(new Date(), totalDays);
    const perDay = f.days ? amount / f.days : 0;
    const months = freq === 'monthly' ? drops : Math.round(totalDays / 30);
    let headline: string;
    if (freq === 'once') headline = 'Today';
    else if (months > 24) {
      const y = Math.floor(months / 12);
      const m = months % 12;
      headline = m ? `${plural(y, 'year')} ${plural(m, 'month')}` : plural(y, 'year');
    } else if (freq === 'monthly') headline = plural(drops, 'month');
    else if (freq === 'weekly') headline = totalDays > 70 ? plural(months, 'month') : plural(drops, 'week');
    else headline = totalDays > 60 ? plural(months, 'month') : plural(drops, 'day');
    return { drops, readyBy, perDay, headline };
  }, [rent, amount, freq]);

  // "Watch your rent fill up": the canister fills one drop at a time whenever the plan changes.
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const steps = Math.min(result.drops, 24);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setFill(100);
      return;
    }
    let k = 0;
    setFill(0);
    const id = window.setInterval(() => {
      k += 1;
      setFill(Math.round((k / steps) * 100));
      if (k >= steps) window.clearInterval(id);
    }, Math.min(350, Math.max(45, 1400 / steps)));
    return () => window.clearInterval(id);
  }, [result.drops, rent]);

  const pct = (v: number, lo: number, hi: number) => (hi === lo ? 100 : ((v - lo) / (hi - lo)) * 100);
  const rentPct = pct(rent, RENT_MIN, RENT_MAX);
  const savePct = pct(amount, range.min, range.max);

  const onFreq = (f: Freq) => {
    setFreq(f);
    const r = saveRange(f, rent);
    // Keep the same total-time feel when switching rhythm.
    if (f === 'daily') setSave(clamp(Math.round(rent / 300 / 500) * 500, r.min, r.max));
    if (f === 'weekly') setSave(clamp(Math.round(rent / 44 / 1000) * 1000, r.min, r.max));
    if (f === 'monthly') setSave(clamp(Math.round(rent / 11 / 1000) * 1000, r.min, r.max));
  };

  const readyLabel = result.readyBy.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  return (
    <div className="calc-shell reveal">
      <div className="calc-grid">
        <div className="calc-panel">
          <div className="calc-group">
            <div className="calc-label-row">
              <label htmlFor="rent" className="calc-label">
                MY RENT IS
              </label>
              <output className="calc-value" htmlFor="rent">
                {naira(rent)}
              </output>
            </div>
            <input
              id="rent"
              className="slider"
              type="range"
              min={RENT_MIN}
              max={RENT_MAX}
              step={RENT_STEP}
              value={rent}
              style={{ '--fill': `${rentPct}%` } as CSSProperties}
              onChange={(e) => setRent(Number(e.target.value))}
              aria-valuetext={naira(rent)}
            />
            <div className="chips">
              {CHIPS.map((c) => (
                <button
                  key={c.value}
                  className={`chip ${rent === c.value ? 'is-active' : ''}`}
                  onClick={() => setRent(c.value)}
                  type="button"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`calc-group ${freq === 'once' ? 'is-disabled' : ''}`}>
            <div className="calc-label-row">
              <label htmlFor="save" className="calc-label">
                I'LL SAVE
              </label>
              <span className="calc-value-wrap">
                <output className="calc-value" htmlFor="save">
                  {naira(amount)}
                </output>
                {freq !== 'once' && <span className="calc-per">/ {FREQS.find((f) => f.id === freq)!.unit}</span>}
              </span>
            </div>
            <input
              id="save"
              className="slider"
              type="range"
              min={range.min}
              max={range.max}
              step={range.step}
              value={amount}
              disabled={freq === 'once'}
              style={{ '--fill': `${savePct}%` } as CSSProperties}
              onChange={(e) => setSave(Number(e.target.value))}
              aria-valuetext={naira(amount)}
            />
          </div>

          <div className="calc-group">
            <span className="calc-label" id="freq-label">
              HOW OFTEN
            </span>
            <div className="segmented" role="radiogroup" aria-labelledby="freq-label">
              {FREQS.map((f) => (
                <button
                  key={f.id}
                  role="radio"
                  aria-checked={freq === f.id}
                  className={`segment ${freq === f.id ? 'is-active' : ''}`}
                  onClick={() => onFreq(f.id)}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="calc-panel calc-result" aria-live="polite">
          <span className="calc-label">YOUR RENT, SORTED BY</span>
          <div className="result-hero">
            <div className="canister" aria-hidden="true">
              <div className="canister-fill" style={{ height: `${Math.max(6, fill)}%` }}>
                <svg className="canister-wave" viewBox="0 0 152 12" preserveAspectRatio="none">
                  <path d="M0 6 Q 9.5 0 19 6 T 38 6 T 57 6 T 76 6 T 95 6 T 114 6 T 133 6 T 152 6 V12 H0Z" />
                </svg>
              </div>
              <span className="canister-pct">{fill}%</span>
            </div>
            <div className="result-copy">
              <p className="result-time">{result.headline}</p>
              <p className="result-sub">
                {freq === 'once' ? (
                  <>
                    One drop of <b>{naira(rent)}</b> and your rent is locked in.
                  </>
                ) : (
                  <>
                    You'll have your <b>{naira(rent)}</b> ready by <b>{readyLabel}</b>.
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="mini-grid">
            <div className="mini-card">
              <span>EACH DROP</span>
              <b>{naira(amount)}</b>
            </div>
            <div className="mini-card">
              <span>NUMBER OF DROPS</span>
              <b>{plural(result.drops, 'payment')}</b>
            </div>
          </div>
          <div className="tip">
            <span className="tip-emoji" aria-hidden="true">
              🍛
            </span>
            <p>
              {freq === 'once' ? (
                <>No drip-feeding needed. Lock it once and forget about rent day.</>
              ) : (
                <>
                  That's about <b>{naira(result.perDay)} a day</b> — {analogy(result.perDay)} a day.
                </>
              )}
            </p>
          </div>
          <button className="btn btn-primary btn-ring btn-block" onClick={open} type="button">
            Join waitlist
          </button>
        </div>
      </div>
    </div>
  );
}
