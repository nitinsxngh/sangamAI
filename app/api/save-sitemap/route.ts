import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()

    const sitemapData = await request.json()
    const result = await db.collection('sitemaps').insertOne(sitemapData)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    )
  }
}
