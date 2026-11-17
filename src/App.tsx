import { useEffect, useState } from 'react';
import Calculator from './Calculator';
import { WaitlistProvider, useWaitlist } from './waitlist';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.setAttribute('data-in', ''));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const Logo = () => (
  <a href="#top" className="logo" aria-label="Nolypay home">
    <img src="img/logo.png" alt="" width={36} height={36} />
    <span>Nolypay</span>
  </a>
);

const Partner = ({ glow = false }: { glow?: boolean }) => (
  <div className={`partner ${glow ? 'partner-glow' : ''}`}>
    <span>IN PARTNERSHIP WITH</span>
    <span className="partner-bank">
      <img src="img/providus.png" alt="" width={13} height={12} />
      PROVIDUS BANK PLC
    </span>
  </div>
);

function WaitlistButton({ variant = 'primary', ring = true, className = '' }: { variant?: 'primary' | 'light'; ring?: boolean; className?: string }) {
  const { open } = useWaitlist();
  const btn = (
    <button type="button" className={`btn btn-lg btn-${variant} ${ring ? 'btn-ring' : ''} ${className}`} onClick={open}>
      Join waitlist
    </button>
  );
  return ring ? <div className={`dash-frame dash-${variant}`}>{btn}</div> : btn;
}

function SectionHead({ title, sub, dark = false }: { title: React.ReactNode; sub: React.ReactNode; dark?: boolean }) {
  return (
    <header className={`section-head reveal ${dark ? 'on-dark' : ''}`}>
      <h2>{title}</h2>
      <p>{sub}</p>
    </header>
  );
}

function Hero() {
  const { open } = useWaitlist();
  return (
    <section className="hero-wrap" id="top">
      <div className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <nav className="nav">
          <Logo />
          <button type="button" className="btn btn-primary btn-nav" onClick={open}>
            Join waitlist
          </button>
        </nav>
        <div className="hero-copy">
          <Partner />
          <h1>Rent, sorted long before your landlord asks</h1>
          <p>Your rent money is for rent. Nothing else. Join Nolypay to start managing your rent payment strictly</p>
          <WaitlistButton />
        </div>
        <img className="hero-phone" src="img/hero-phone.png" alt="Nolypay app home screen showing ₦300,000 in total rent savings" width={937} height={663} />
        <div className="hero-floor" aria-hidden="true" />
        <ul className="hero-badges">
          {[
            { icon: 'icon-shield', t: 'Bank-Grade Security', d: 'Your data and money are protected' },
            { icon: 'icon-flash', t: 'Fast and Reliable', d: 'Quick, seamless and dependable' },
            { icon: 'icon-bell', t: 'Stay Informed', d: 'Stay in-charge as your rent day ticks' },
          ].map((b) => (
            <li key={b.t} className="glass">
              <img src={`img/${b.icon}.png`} alt="" width={40} height={40} />
              <div>
                <strong>{b.t}</strong>
                <span>{b.d}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Versus() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          title={
            <>
              Rent, sorted long before
              <br />
              your landlord asks
            </>
          }
          sub="Your rent money is for rent. Nothing else. Sign up to join Nolypay to start managing your rent payment strictly"
        />
        <div className="versus reveal">
          <img src="img/vs-without.png" alt="Without Nolypay: a stressed tenant reads a landlord's message demanding overdue rent by Friday" width={620} height={660} />
          <img src="img/vs-with.png" alt="With Nolypay: a relaxed tenant, ₦400,000 of ₦400,000 rent secured" width={620} height={660} />
          <span className="vs-badge" aria-hidden="true">
            VS
          </span>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ img, w, h, title, body, tone, className = '' }: { img: string; w: number; h: number; title: string; body: React.ReactNode; tone: string; className?: string }) {
  return (
    <article className={`feature reveal tone-${tone} ${className}`}>
      <div className="feature-art">
        <img src={`img/${img}.png`} alt="" width={w} height={h} loading="lazy" />
      </div>
      <div className="feature-copy">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <SectionHead
          title={
            <>
              Everything a rent plan
              <br />
              should have
            </>
          }
          sub={
            <>
              Built to make saving for rent feel effortless and spending
              <br className="br-desk" /> it by mistake, impossible
            </>
          }
        />
        <div className="feature-row feature-row-2">
          <FeatureCard
            img="feat-wallet"
            w={656}
            h={420}
            tone="gray"
            title="Locked Rent Wallet"
            body={
              <>
                Your rent money stays untouchable until rent day. Need it back?
                <br className="br-desk" /> Unlock it with a 24-hour cool-off that keeps impulse spending out
              </>
            }
            className="feature-wide"
          />
          <FeatureCard img="feat-landlord" w={564} h={420} tone="teal" title="Pay landlord directly" body="When your plan completes, funds go straight to your landlord's account. Link them to share live progress." />
        </div>
        <div className="feature-row feature-row-3">
          <FeatureCard img="feat-frequency" w={400} h={348} tone="lime" title="Peace of mind, your way" body="Built to give you peace of mind, saving on your own terms" />
          <FeatureCard img="feat-calc" w={400} h={372} tone="lilac" title="Smart auto-calculate" body="Get an estimate of how much to save and how long it'll take to reach your rent target." />
          <FeatureCard img="feat-activity" w={400} h={372} tone="sky" title="Every activity tracked" body="Credits, debits, fees, all activities tracked so you always know exactly where you stand." />
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', t: 'Create a Plan', d: 'Enter your rent amount, due date, and property. Verify with your BVN or NIN.' },
  { n: '02', t: 'Fund your way', d: 'Daily, monthly, or anytime. NolyPay auto-calculates the exact amount to hit your target on time.' },
  { n: '03', t: 'Watch it grow, locked', d: "Funds sit in a locked Rent Wallet, so you can't accidentally spend the money meant for rent." },
  { n: '04', t: 'Pay your landlord on time', d: "On due date, NolyPay pays straight into your landlord's account. Clean payment, clear conscience." },
];

function Steps() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.step');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="section" id="how-it-works">
      <div className="container steps-container">
        <h2 className="steps-title reveal">Four steps to a stress-free rent day</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`step reveal ${active === i ? 'is-active' : ''}`} data-i={i}>
              <div className="step-copy">
                <span className="step-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              <div className="step-art">
                <img src={`img/step-${i + 1}.png`} alt="" width={636} height={524} loading="lazy" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section className="section section-dark" id="calculator">
      <div className="container">
        <SectionHead
          dark
          title={
            <>
              How fast can you be
              <br />
              rent-ready?
            </>
          }
          sub={
            <>
              Drag the sliders, pick your rhythm, and watch your rent fill up.
              <br className="br-desk" /> No sign-up needed, just see what a plan could look like for you.
            </>
          }
        />
        <Calculator />
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          title={
            <>
              Everything a rent plan
              <br />
              should have
            </>
          }
          sub={
            <>
              Built to make saving for rent feel effortless and spending
              <br className="br-desk" /> it by mistake, impossible
            </>
          }
        />
        <div className="story">
          <div className="story-phone reveal">
            <img src="img/empty-state-phone.png" alt="Nolypay home screen with no rent plans yet" width={608} height={661} loading="lazy" />
          </div>
          <div className="story-col">
            <div className="story-quote reveal">
              <p>
                Made for smart tenants like you, NolyPay lets you pay rent without loans, just discipline by locking your money away for rent alone and tailoring the plan to your income and lifestyle, in one focused app built to erase annual
                rent stress and let you wake up on rent day with zero pressure.
              </p>
            </div>
            <div className="story-sun reveal">
              <img src="img/sunflower.png" alt="" width={608} height={307} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add real, attributable quotes here. The carousel arrows enable themselves once there is more than one.
const TESTIMONIALS = [
  {
    quote: "For the first time ever, I don't feel like rent day is coming anymore. NolyPay helps me stay ready ahead.",
    name: 'Chioma A.',
    role: 'Business owner',
    stars: 5,
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const canPrev = i > 0;
  const canNext = i < TESTIMONIALS.length - 1;
  return (
    <section className="section section-flush">
      <div className="container">
        <SectionHead
          title={
            <>
              What our early users
              <br />
              are saying about us
            </>
          }
          sub="Your rent money is for rent. Nothing else. Sign up to join Nolypay to start managing your rent payment strictly"
        />
      </div>
      <div className="testimonial reveal">
        <div className="testimonial-art">
          <img src="img/testimonial-art.png" alt="" width={600} height={684} loading="lazy" />
        </div>
        <div className="testimonial-body">
          <figure key={i} className="testimonial-quote">
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              <div className="stars" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: t.stars }).map((_, k) => (
                  <img key={k} src="img/star.png" alt="" width={40} height={40} />
                ))}
              </div>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </figcaption>
          </figure>
          <div className="carousel-nav">
            <button type="button" className="round-btn" onClick={() => setI(i - 1)} disabled={!canPrev} aria-label="Previous testimonial">
              <img src="img/arrow-right.png" alt="" width={32} height={32} className="flip" />
            </button>
            <button type="button" className="round-btn" onClick={() => setI(i + 1)} disabled={!canNext} aria-label="Next testimonial">
              <img src="img/arrow-right.png" alt="" width={32} height={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: 'What is Nolypay?', a: 'NolyPay is a rent planning platform that helps tenants prepare gradually for rent and pay their landlords on time without stress through licensed banking partner.' },
  { q: 'Who holds my money?', a: 'Your funds sit securely with our licensed banking partner. We handle the rent planning; they handle the regulated banking.' },
  { q: 'Is NolyPay safe to use?', a: 'Yes. NolyPay uses bank-grade security measures, and customer funds are held by our licensed banking partner, not by NolyPay.' },
  { q: 'What happens if NolyPay stops operating?', a: 'Customer funds remain with our licensed banking partner. NolyPay does not hold customer funds directly.' },
  { q: 'Is NolyPay a loan app?', a: 'No. NolyPay does not lend money. NolyPay helps you fund your rent gradually with your own money so that you can pay your landlord on time.' },
  { q: 'Can I withdraw my money before my rent is due?', a: 'Yes, you can. However, to help you stay consistent and rent-day ready, withdrawal is subject to the applicable terms, fees, and your lock-up preference.' },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const cols = [FAQS.slice(0, 3), FAQS.slice(3)];
  return (
    <section className="section" id="faq">
      <div className="container">
        <SectionHead title="Frequently asked questions" sub="Your rent money is for rent. Nothing else. Sign up to join Nolypay to start managing your rent payment strictly" />
        <div className="faq-grid">
          {cols.map((col, c) => (
            <div className="faq-col" key={c}>
              {col.map((f, k) => {
                const idx = c * 3 + k;
                const isOpen = open === idx;
                return (
                  <div className={`faq-card reveal ${isOpen ? 'is-open' : ''}`} key={f.q}>
                    <span className="faq-n">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="faq-content">
                      <h3>
                        <button type="button" aria-expanded={isOpen} aria-controls={`faq-${idx}`} onClick={() => setOpen(isOpen ? null : idx)}>
                          {f.q}
                          <span className="faq-toggle" aria-hidden="true" />
                        </button>
                      </h3>
                      <p id={`faq-${idx}`}>{f.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="faq-contact">
          Looking for something else? <a href="mailto:hello@nolypay.com">hello@nolypay.com</a>
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="cta-wrap">
      <div className="cta">
        <header className="cta-head reveal">
          <h2>When rent season comes, be the calm one in the room</h2>
          <p>Join the waitlist of smart tenants like you. Plan your next rent with NolyPay and skip the panic.</p>
          <WaitlistButton variant="light" />
        </header>
        <div className="cta-photo reveal">
          <img src="img/cta-photo.png" alt="A tenant relaxing on his sofa while Nolypay shows ₦50,000 added to his Main apartment plan" width={1240} height={615} loading="lazy" />
        </div>
        <ul className="trust">
          {[
            { icon: 'icon-bank', t: 'Powered by a bank', d: 'A licensed deposit money bank holds your rent funds not a wallet floating in the cloud.' },
            { icon: 'icon-verified', t: 'Verified with BVN & NIN', d: 'Proper KYC keeps your account and your money, genuinely yours, in line with regulations.' },
            { icon: 'icon-lock', t: 'Locked, encrypted, yours', d: 'Funds are encrypted and locked, usable only to pay your rent, or to withdraw to your own bank account' },
          ].map((x) => (
            <li key={x.t} className="reveal">
              <strong>
                <img src={`img/${x.icon}.png`} alt="" width={24} height={24} />
                {x.t}
              </strong>
              <span>{x.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  const { open } = useWaitlist();
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo />
          <p>Plan your rent. Pay with ease. The calmest way to save toward rent and pay your landlord on time.</p>
          <Partner glow />
        </div>
        <nav className="footer-links" aria-label="Footer">
          <div>
            <h4>Product</h4>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#calculator">
              Calculator <span className="badge-new">New</span>
            </a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy policy</a>
            <a href="#">Terms &amp; Conditions</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#faq">FAQ</a>
            <a href="mailto:hello@nolypay.com">hello@nolypay.com</a>
            <a href="#">WhatsApp</a>
            <a href="#">Call us</a>
          </div>
          <div>
            <h4>Get the app</h4>
            <button type="button" className="link-btn" onClick={open}>
              Join waitlist
            </button>
            <span className="muted-link">App store (coming soon)</span>
            <span className="muted-link">Google play (coming soon)</span>
          </div>
        </nav>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 NolyPay Technologies Ltd. All rights reserved.</p>
          <div className="socials">
            {[
              ['twitter', 'X (Twitter)'],
              ['linkedin', 'LinkedIn'],
              ['facebook', 'Facebook'],
              ['github', 'GitHub'],
            ].map(([k, label]) => (
              <a key={k} href="#" aria-label={label}>
                <img src={`img/social-${k}.png`} alt="" width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Page() {
  useReveal();
  return (
    <>
      <Hero />
      <main>
        <Versus />
        <Features />
        <Steps />
        <CalculatorSection />
        <Story />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <WaitlistProvider>
      <Page />
    </WaitlistProvider>
  );
}
