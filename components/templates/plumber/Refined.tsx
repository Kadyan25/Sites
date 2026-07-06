import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Phone, ShieldCheck, Star, Wrench, CheckCircle2 } from 'lucide-react'
import type { PageData } from '../../PageData'

const NAVY = '#0A1F33'
const TEAL = '#0E7C86'
const COPPER = '#C77B3B'
const CREAM = '#F4F1EA'
const AQUA = '#2ED9C3'

const DISPLAY_FONT = "'Fraunces Variable', serif"
const BODY_FONT = "'InterVariable', system-ui, sans-serif"

/** Fades a section up into view once, via IntersectionObserver + CSS class toggle. Skips animation under prefers-reduced-motion. */
function useFadeUpOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return { ref, className: visible ? 'refined-fade-in' : 'refined-fade-pending' }
}

function FadeSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, className: fadeClass } = useFadeUpOnScroll<HTMLDivElement>()
  return (
    <div ref={ref} className={`${fadeClass} ${className}`}>
      {children}
    </div>
  )
}

export default function Refined({ data }: { data: PageData }) {
  return (
    <div style={{ fontFamily: BODY_FONT, background: NAVY, color: CREAM }} className="min-h-screen">
      <style>{`
        @keyframes refined-breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        .refined-glow {
          animation: refined-breathe 10s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .refined-glow { animation: none; }
        }
        .refined-fade-pending {
          opacity: 0;
          transform: translateY(18px);
        }
        .refined-fade-in {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
      `}</style>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(10,31,51,0.92)', borderColor: 'rgba(244,241,234,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-lg tracking-tight">
            {data.business_name}
          </span>
          <a
            href={`tel:${data.phone}`}
            className="flex items-center gap-2 font-medium text-sm px-5 py-2 rounded-full border transition-colors"
            style={{ borderColor: AQUA, color: AQUA }}
          >
            <Phone size={14} strokeWidth={2} />
            {data.phone || 'Call Us'}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '70vh' }}>
        <div
          className="absolute inset-0 refined-glow"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(14,124,134,0.55) 0%, transparent 55%),
                         radial-gradient(ellipse at 75% 70%, rgba(199,123,59,0.3) 0%, transparent 50%),
                         linear-gradient(180deg, ${NAVY} 0%, #081726 100%)`,
          }}
        />
        <div className="relative flex items-center" style={{ minHeight: '70vh', zIndex: 1 }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] mb-6" style={{ color: TEAL }}>
              {data.tagline}
            </p>
            <h1
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 500, color: CREAM }}
              className="text-4xl md:text-5xl leading-tight mb-6"
            >
              {data.hero.headline}
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(244,241,234,0.7)' }}>
              {data.hero.subheadline}
            </p>
            <a
              href={`tel:${data.phone}`}
              className="font-semibold px-8 py-3.5 rounded-full inline-block text-sm transition-colors"
              style={{ background: AQUA, color: NAVY }}
            >
              {data.hero.cta}
            </a>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="py-6 border-y" style={{ borderColor: 'rgba(199,123,59,0.2)' }}>
        <div className="flex gap-10 px-6 justify-center flex-wrap max-w-5xl mx-auto">
          {[
            { icon: ShieldCheck, label: 'Licensed & Insured' },
            { icon: Wrench, label: 'Same-Day Service' },
            { icon: Star, label: '5-Star Rated' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium whitespace-nowrap" style={{ color: 'rgba(244,241,234,0.8)' }}>
              <Icon size={16} style={{ color: COPPER }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      {data.services.length > 0 && (
        <FadeSection className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-3xl text-center mb-3">
              What We Do
            </h2>
            <p className="text-center text-sm mb-14" style={{ color: TEAL }}>
              Professional plumbing services for {data.city}, {data.state}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(244,241,234,0.08)' }}>
              {data.services.map((s, i) => (
                <div key={i} className="p-8" style={{ background: NAVY }}>
                  <p className="text-xs font-medium mb-3" style={{ color: COPPER }}>{String(i + 1).padStart(2, '0')}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.85)' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      )}

      {/* Benefits */}
      {data.benefits.length > 0 && (
        <FadeSection className="py-24 px-6 border-y" >
          <div className="max-w-3xl mx-auto" style={{ borderColor: 'rgba(46,217,195,0.1)' }}>
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-3xl text-center mb-14">
              Why {data.city} Trusts Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {data.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} style={{ color: AQUA }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.8)' }}>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      )}

      {/* Process */}
      {data.process_steps.length > 0 && (
        <FadeSection className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-3xl text-center mb-14">
              How It Works
            </h2>
            <div className="space-y-8">
              {data.process_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-6 pb-8 border-b" style={{ borderColor: 'rgba(244,241,234,0.08)' }}>
                  <span style={{ fontFamily: DISPLAY_FONT, color: COPPER }} className="text-2xl font-medium flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.8)' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      )}

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <FadeSection className="py-24 px-6 border-y" >
          <div className="max-w-4xl mx-auto" style={{ borderColor: 'rgba(199,123,59,0.15)' }}>
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-3xl text-center mb-14">
              What Neighbors Say
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {data.testimonials.map((t, i) => (
                <div key={i}>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={AQUA} color={AQUA} />)}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(244,241,234,0.75)' }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      )}

      {/* FAQ */}
      {data.faq.length > 0 && (
        <FadeSection className="py-24 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-3xl text-center mb-14">
              Common Questions
            </h2>
            <div className="space-y-0">
              {data.faq.map((f, i) => (
                <div key={i} className="py-6 border-b" style={{ borderColor: 'rgba(244,241,234,0.08)' }}>
                  <p className="font-medium text-sm mb-2" style={{ color: AQUA }}>{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.65)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      )}

      {/* CTA Banner */}
      <section className="py-20 px-6 text-center" style={{ background: '#081726' }}>
        <div className="max-w-xl mx-auto">
          <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 500 }} className="text-3xl mb-4">
            Ready for Reliable Plumbing?
          </h2>
          <p className="mb-8 text-sm" style={{ color: 'rgba(244,241,234,0.6)' }}>
            Serving {data.city}, {data.state} — call us today
          </p>
          <a
            href={`tel:${data.phone}`}
            className="font-semibold px-8 py-3.5 rounded-full inline-block text-sm transition-colors"
            style={{ background: AQUA, color: NAVY }}
          >
            {data.hero.cta}
          </a>
        </div>
      </section>

      <footer className="py-8 px-6 text-center text-xs border-t" style={{ borderColor: 'rgba(244,241,234,0.08)', color: 'rgba(244,241,234,0.45)' }}>
        © {data.business_name} · {data.city}, {data.state}
      </footer>
    </div>
  )
}
