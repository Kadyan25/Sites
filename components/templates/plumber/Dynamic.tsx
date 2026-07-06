import { motion, useReducedMotion } from 'framer-motion'
import { Phone, ShieldCheck, Star, Wrench, Droplets, CheckCircle2 } from 'lucide-react'
import type { PageData } from '../../PageData'

const NAVY = '#0A1F33'
const TEAL = '#0E7C86'
const COPPER = '#C77B3B'
const CREAM = '#F4F1EA'
const AQUA = '#2ED9C3'

const DISPLAY_FONT = "'Fraunces Variable', serif"
const BODY_FONT = "'InterVariable', system-ui, sans-serif"

// ─── Hero: concentric ripple rings (CSS/SVG + Framer Motion) ─────────────

function RippleHero() {
  const reduceMotion = useReducedMotion()
  const rings = [120, 190, 260, 330]

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle at 50% 45%, ${TEAL} 0%, ${NAVY} 70%)` }}>
      <svg viewBox="0 0 700 700" className="absolute" style={{ width: 'min(120vw, 900px)', height: 'auto', opacity: 0.55 }}>
        {rings.map((r, i) => (
          <motion.circle
            key={r}
            cx={350}
            cy={350}
            r={r}
            fill="none"
            stroke={i % 2 === 0 ? AQUA : COPPER}
            strokeWidth={1.5}
            initial={{ opacity: 0.15, scale: 0.9 }}
            animate={
              reduceMotion
                ? { opacity: 0.35 }
                : { opacity: [0.15, 0.4, 0.15], scale: [0.9, 1.05, 0.9] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }
            }
          />
        ))}
      </svg>
    </div>
  )
}

export default function Dynamic({ data }: { data: PageData }) {
  const reduceMotion = useReducedMotion()
  const viewportOnce = { once: true, amount: 0.25 }

  return (
    <div style={{ fontFamily: BODY_FONT, background: NAVY, color: CREAM }} className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(10,31,51,0.85)', borderColor: 'rgba(244,241,234,0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-lg tracking-tight">
            {data.business_name}
          </span>
          <a
            href={`tel:${data.phone}`}
            className="flex items-center gap-2 font-semibold text-sm px-5 py-2 rounded-full transition-colors"
            style={{ background: AQUA, color: NAVY }}
          >
            <Phone size={15} strokeWidth={2.5} />
            {data.phone || 'Call Us'}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative" style={{ minHeight: '80vh' }}>
        <RippleHero />
        <div className="relative flex items-center justify-center" style={{ minHeight: '80vh', zIndex: 1 }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-8 border"
              style={{ background: 'rgba(244,241,234,0.08)', borderColor: 'rgba(46,217,195,0.4)', color: AQUA }}
            >
              <Droplets size={14} />
              {data.tagline}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600, color: CREAM }}
              className="text-4xl md:text-6xl leading-tight mb-6"
            >
              {data.hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'rgba(244,241,234,0.75)' }}
            >
              {data.hero.subheadline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href={`tel:${data.phone}`}
                className="font-bold px-8 py-4 rounded-full text-base transition-transform hover:scale-105 shadow-lg"
                style={{ background: AQUA, color: NAVY }}
              >
                {data.hero.cta}
              </a>
              <a
                href="#services"
                className="border font-semibold px-8 py-4 rounded-full text-base transition-colors hover:bg-white/10"
                style={{ borderColor: 'rgba(244,241,234,0.35)', color: CREAM }}
              >
                Our Services
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust badge strip */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7 }}
        className="py-6 border-y"
        style={{ borderColor: 'rgba(199,123,59,0.25)', background: 'rgba(14,124,134,0.08)' }}
      >
        <div className="flex gap-10 px-6 justify-center flex-wrap max-w-5xl mx-auto">
          {[
            { icon: ShieldCheck, label: 'Licensed & Insured' },
            { icon: Wrench, label: 'Same-Day Service' },
            { icon: Star, label: '5-Star Rated' },
            { icon: CheckCircle2, label: 'Upfront Pricing' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium whitespace-nowrap" style={{ color: CREAM }}>
              <Icon size={18} style={{ color: COPPER }} />
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      {data.services.length > 0 && (
        <section id="services" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }}
              className="text-3xl text-center mb-3"
            >
              What We Do
            </motion.h2>
            <p className="text-center text-sm mb-12" style={{ color: TEAL }}>
              Professional plumbing services for {data.city}, {data.state}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.services.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="rounded-2xl p-6 border"
                  style={{ background: 'rgba(244,241,234,0.04)', borderColor: 'rgba(199,123,59,0.2)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(199,123,59,0.15)' }}>
                    <Wrench size={18} style={{ color: COPPER }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.9)' }}>{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {data.benefits.length > 0 && (
        <section className="py-16 px-6 border-y" style={{ background: 'rgba(14,124,134,0.1)', borderColor: 'rgba(46,217,195,0.15)' }}>
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }}
              className="text-3xl text-center mb-10"
            >
              Why {data.city} Trusts Us
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={20} style={{ color: AQUA }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.85)' }}>{b}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {data.process_steps.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }}
              className="text-3xl text-center mb-12"
            >
              How It Works
            </motion.h2>
            <div className="space-y-6">
              {data.process_steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.06 }}
                  className="flex items-start gap-5"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${COPPER}, ${TEAL})`, color: NAVY }}
                  >
                    {i + 1}
                  </div>
                  <div className="pt-2 text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.85)' }}>{step}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="py-16 px-6 border-y" style={{ background: 'rgba(199,123,59,0.06)', borderColor: 'rgba(199,123,59,0.2)' }}>
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }}
              className="text-3xl text-center mb-10"
            >
              What Neighbors Say
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {data.testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  className="rounded-2xl p-5 border"
                  style={{ background: 'rgba(244,241,234,0.04)', borderColor: 'rgba(244,241,234,0.1)' }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={AQUA} color={AQUA} />)}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(244,241,234,0.8)' }}>{t}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }}
              className="text-3xl text-center mb-10"
            >
              Common Questions
            </motion.h2>
            <div className="space-y-4">
              {data.faq.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                  className="rounded-xl p-5 border"
                  style={{ background: 'rgba(244,241,234,0.04)', borderColor: 'rgba(14,124,134,0.3)' }}
                >
                  <p className="font-semibold text-sm mb-2" style={{ color: AQUA }}>{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.7)' }}>{f.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6 }}
        className="py-16 px-6"
        style={{ background: `linear-gradient(120deg, ${TEAL}, ${NAVY})` }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-3xl mb-4">
            Ready for Reliable Plumbing?
          </h2>
          <p className="mb-8 text-sm" style={{ color: 'rgba(244,241,234,0.75)' }}>
            Serving {data.city}, {data.state} — call us today
          </p>
          <a
            href={`tel:${data.phone}`}
            className="font-bold px-10 py-4 rounded-full inline-block transition-transform hover:scale-105"
            style={{ background: AQUA, color: NAVY }}
          >
            {data.hero.cta}
          </a>
        </div>
      </motion.section>

      <footer className="py-8 px-6 text-center text-xs border-t" style={{ borderColor: 'rgba(244,241,234,0.1)', color: 'rgba(244,241,234,0.5)' }}>
        © {data.business_name} · {data.city}, {data.state}
      </footer>
    </div>
  )
}
