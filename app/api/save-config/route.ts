import { NextResponse } from 'next/server'
import { createOrUpdateConfiguration } from '@/lib/models/Configuration'

export async function POST(request: Request) {
  try {
    const configData = await request.json()
    const { result, configKey } = await createOrUpdateConfiguration(configData)

    return NextResponse.json({
      success: true,
      configKey,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
