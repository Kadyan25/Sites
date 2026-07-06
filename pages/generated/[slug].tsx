import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import LandingPage, { type PageData } from '@/components/LandingPage'
import pagesData from '@/data/pages.json'

interface Props {
  content: PageData | null
}

export default function SitePage({ content }: Props) {
  if (!content) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 mb-2">Page unavailable</h1>
          <p className="text-slate-400 text-sm">This page is no longer active.</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>{`${content.business_name} — ${content.city}`}</title>
        <meta name="description" content={content.hero.subheadline} />
      </Head>
      <LandingPage data={content} />
    </>
  )
}

// Static, no backend: every page's content lives in data/pages.json, committed
// to this repo. Vercel builds one static HTML file per slug at build time —
// updating a lead's page means committing new JSON here, nothing else.
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(pagesData as Record<string, PageData>)
  return { paths: slugs.map(slug => ({ params: { slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string
  const content = (pagesData as Record<string, PageData>)[slug]
  if (!content || !content.published) return { notFound: true }
  return { props: { content } }
}
