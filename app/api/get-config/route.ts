import { NextResponse } from 'next/server'
import { getConfigurationByKey } from '@/lib/models/Configuration'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ success: false, error: 'Missing key' }, { status: 400 })
    }

    const config = await getConfigurationByKey(key)

    if (!config) {
      return NextResponse.json({ success: false, error: 'Config not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
