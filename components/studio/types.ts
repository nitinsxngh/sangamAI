export type Role = 'user' | 'assistant'

export interface Message {
  role: Role
  content: string
}

export interface SitemapData {
  filename: string
  url_count: number
  sitemap_url: string
  scrape_filename?: string
  scrape_url?: string
  scraped_url_count?: number
  failed_url_count?: number
  generated_at: string
}