import { NextResponse } from 'next/server'
import { checkWebsiteChanges } from '@/lib/website-monitor'

/**
 * Web sitesi değişiklik kontrolü endpoint'i
 * 
 * Kullanım:
 * GET /api/website-check?competitor=TÜMSİAD
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const competitor = searchParams.get('competitor')

    if (!competitor) {
      return NextResponse.json(
        { error: 'Competitor parametresi gerekli' },
        { status: 400 }
      )
    }

    const results = await checkWebsiteChanges(competitor)

    return NextResponse.json(results)

  } catch (error) {
    console.error('Website check error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Website kontrolü başarısız',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
