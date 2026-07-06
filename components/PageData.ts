export interface PageData {
  template_variant: 'A' | 'B' | 'C'
  template_id?: string
  business_name: string
  phone: string
  city: string
  state: string
  category: string
  tagline: string
  hero: { headline: string; subheadline: string; cta: string }
  services: string[]
  benefits: string[]
  process_steps: string[]
  testimonials: string[]
  faq: Array<{ q: string; a: string }>
  published: boolean
}
