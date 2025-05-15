// /app/api/get-config-by-key/route.ts
import { NextResponse } from 'next/server'
import { getConfigurationByKey } from '@/lib/models/Configuration'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const configKey = searchParams.get('configKey')

    if (!configKey) {
      return NextResponse.json({ success: false, error: 'Missing configKey' }, { status: 400 })
    }

    const config = await getConfigurationByKey(configKey)

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
