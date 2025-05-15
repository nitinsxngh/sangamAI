import clientPromise from '@/lib/mongodb'

export interface Sitemap {
  filename: string
  url_count: number
  sitemap_url: string
  scrape_filename?: string
  scrape_url?: string
  scraped_url_count?: number
  failed_url_count?: number
  generated_at: string
  createdAt?: Date
  updatedAt?: Date
}

export async function createSitemap(sitemapData: Omit<Sitemap, 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise
  const db = client.db()

  return db.collection('sitemaps').insertOne({
    ...sitemapData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}
