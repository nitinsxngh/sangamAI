import clientPromise from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

export interface Configuration {
  configKey?: string
  sitemapId: string
  websiteName: string
  selectedColor: string
  scrapeFilename?: string
  createdAt: Date
  updatedAt: Date
}

export async function createOrUpdateConfiguration(config: {
  sitemapId: string
  websiteName: string
  selectedColor: string
  scrapeFilename?: string
}) {
  const client = await clientPromise
  const db = client.db()

  const existing = await db.collection<Configuration>('configurations').findOne({
    sitemapId: config.sitemapId,
  })

  const configKey = existing?.configKey || uuidv4()

  const result = await db.collection('configurations').updateOne(
    { sitemapId: config.sitemapId },
    {
      $set: {
        ...config,
        configKey,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  )

  return { result, configKey }
}

export async function getConfiguration(sitemapId: string): Promise<Configuration | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection<Configuration>('configurations').findOne({ sitemapId })
}

export async function getConfigurationByKey(configKey: string): Promise<Configuration | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection<Configuration>('configurations').findOne({ configKey })
}
