import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { StudioEnvironment } from '../shared/StudioEnvironment'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone, ShieldCheck, Star, Wrench, Droplets, CheckCircle2 } from 'lucide-react'
import type { Group } from 'three'
import type { PageData } from '../../PageData'
import { PerfShell, usePrefersReducedMotion } from '../shared/PerfShell'

gsap.registerPlugin(ScrollTrigger)

const NAVY = '#0A1F33'
const TEAL = '#0E7C86'
const COPPER = '#C77B3B'
const CREAM = '#F4F1EA'
const AQUA = '#2ED9C3'

const DISPLAY_FONT = "'Fraunces Variable', serif"
const BODY_FONT = "'InterVariable', system-ui, sans-serif"

// ─── 3D Hero Scene ────────────────────────────────────────────────────────

function WrenchPipeRig() {
  const group = useRef<Group>(null)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.15
    const targetX = pointer.y * 0.25
    const targetZ = -pointer.x * 0.25
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04
  })

  return (
    <group ref={group}>
      {/* Copper pipe */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 3.2, 48]} />
        <meshPhysicalMaterial color={COPPER} metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Pipe fitting collar */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.5, 48]} />
        <meshPhysicalMaterial color={COPPER} metalness={0.9} roughness={0.18} />
      </mesh>
      {/* Chrome wrench jaw — torus suggesting the wrench head clamped on the fitting */}
      <mesh rotation={[Math.PI / 2, 0.3, 0]} position={[0, 0.1, 0.1]}>
        <torusGeometry args={[1.15, 0.22, 32, 64, Math.PI * 1.35]} />
        <meshPhysicalMaterial color="#e8ecef" metalness={1} roughness={0.1} />
      </mesh>
      {/* Wrench handle */}
      <mesh rotation={[0, 0, -0.6]} position={[1.6, -1.2, 0.3]}>
        <cylinderGeometry args={[0.16, 0.2, 2.4, 32]} />
        <meshPhysicalMaterial color="#e8ecef" metalness={1} roughness={0.12} />
      </mesh>
      {/* Water droplets */}
      {[[-1.4, 0.9, 0.6, 0.18], [1.1, 1.3, -0.4, 0.12], [-0.6, -1.1, 0.8, 0.1]].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[s, 24, 24]} />
          <meshPhysicalMaterial
            color={TEAL}
            metalness={0.1}
            roughness={0.05}
            transmission={0.85}
            thickness={0.5}
            ior={1.33}
          />
        </mesh>
      ))}
    </group>
  )
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 5, 5]} intensity={1.2} color={AQUA} />
      <spotLight position={[-5, -3, 4]} intensity={0.6} color={COPPER} />
      <StudioEnvironment tint={AQUA} wallColor="#0d1e26" />
      <WrenchPipeRig />
    </Canvas>
  )
}

// ─── Scroll-reveal helper (GSAP) ──────────────────────────────────────────

function useStagger(selector: string, deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const items = ref.current.querySelectorAll(selector)
    if (!items.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        }
      )
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps])

  return ref
}

export default function Cinematic({ data }: { data: PageData }) {
  const servicesRef = useStagger('.svc-card', [data.services.length])
  const testimonialsRef = useStagger('.testimonial-card', [data.testimonials.length])
  const badgeStripRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [hasPhone] = useState(() => Boolean(data.phone))

  useEffect(() => {
    if (reducedMotion || !badgeStripRef.current) return
    const el = badgeStripRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      )
    })
    return () => ctx.revert()
  }, [reducedMotion])

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
            {hasPhone ? data.phone : 'Call Us'}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative">
        <PerfShell
          minHeight="90vh"
          placeholder={
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY}, ${TEAL})` }} />
          }
        >
          <HeroScene />
        </PerfShell>
        <div className="absolute inset-0 flex items-center pointer-events-none" style={{ zIndex: 2 }}>
          <div className="max-w-4xl mx-auto px-6 text-center w-full">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-8 border pointer-events-auto"
              style={{ background: 'rgba(244,241,234,0.08)', borderColor: 'rgba(46,217,195,0.4)', color: AQUA }}
            >
              <Droplets size={14} />
              {data.tagline}
            </div>
            <h1
              style={{ fontFamily: DISPLAY_FONT, fontWeight: 600, color: CREAM }}
              className="text-4xl md:text-6xl leading-tight mb-6"
            >
              {data.hero.headline}
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(244,241,234,0.75)' }}>
              {data.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
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
            </div>
          </div>
        </div>
      </div>

      {/* Trust badge strip */}
      <div className="overflow-hidden py-6 border-y" style={{ borderColor: 'rgba(199,123,59,0.25)', background: 'rgba(14,124,134,0.08)' }}>
        <div ref={badgeStripRef} className="flex gap-10 px-6 justify-center flex-wrap max-w-5xl mx-auto">
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
      </div>

      {/* Services */}
      {data.services.length > 0 && (
        <section id="services" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-3xl text-center mb-3">
              What We Do
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: TEAL }}>
              Professional plumbing services for {data.city}, {data.state}
            </p>
            <div ref={servicesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.services.map((s, i) => (
                <div
                  key={i}
                  className="svc-card rounded-2xl p-6 border transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(244,241,234,0.04)', borderColor: 'rgba(199,123,59,0.2)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'rgba(199,123,59,0.15)' }}
                  >
                    <Wrench size={18} style={{ color: COPPER }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.9)' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {data.benefits.length > 0 && (
        <section className="py-16 px-6 border-y" style={{ background: 'rgba(14,124,134,0.1)', borderColor: 'rgba(46,217,195,0.15)' }}>
          <div className="max-w-4xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-3xl text-center mb-10">
              Why {data.city} Trusts Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: AQUA }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.85)' }}>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {data.process_steps.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-3xl text-center mb-12">
              How It Works
            </h2>
            <div className="space-y-6">
              {data.process_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${COPPER}, ${TEAL})`, color: NAVY }}
                  >
                    {i + 1}
                  </div>
                  <div className="pt-2 text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.85)' }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="py-16 px-6 border-y" style={{ background: 'rgba(199,123,59,0.06)', borderColor: 'rgba(199,123,59,0.2)' }}>
          <div className="max-w-4xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-3xl text-center mb-10">
              What Neighbors Say
            </h2>
            <div ref={testimonialsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {data.testimonials.map((t, i) => (
                <div
                  key={i}
                  className="testimonial-card rounded-2xl p-5 border"
                  style={{ background: 'rgba(244,241,234,0.04)', borderColor: 'rgba(244,241,234,0.1)' }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={AQUA} color={AQUA} />)}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(244,241,234,0.8)' }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 style={{ fontFamily: DISPLAY_FONT, fontWeight: 600 }} className="text-3xl text-center mb-10">
              Common Questions
            </h2>
            <div className="space-y-4">
              {data.faq.map((f, i) => (
                <div key={i} className="rounded-xl p-5 border" style={{ background: 'rgba(244,241,234,0.04)', borderColor: 'rgba(14,124,134,0.3)' }}>
                  <p className="font-semibold text-sm mb-2" style={{ color: AQUA }}>{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,241,234,0.7)' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 px-6" style={{ background: `linear-gradient(120deg, ${TEAL}, ${NAVY})` }}>
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
      </section>

      <footer className="py-8 px-6 text-center text-xs border-t" style={{ borderColor: 'rgba(244,241,234,0.1)', color: 'rgba(244,241,234,0.5)' }}>
        © {data.business_name} · {data.city}, {data.state}
      </footer>
    </div>
  )
}
