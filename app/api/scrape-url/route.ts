import { NextResponse } from 'next/server'
import { scrapeFromUrl } from '@/lib/website-monitor'

/**
 * Sosyal medya link'inden takipçi sayısını çeker
 * 
 * Kullanım:
 * POST /api/scrape-url
 * Body: { url: "https://www.instagram.com/musiaddenizli/" }
 */
export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL gerekli' },
        { status: 400 }
      )
    }

    console.log(`🔍 Scraping: ${url}`)

    const result = await scrapeFromUrl(url)

    if ('error' in result) {
      // Hata olsa bile platform ve STK bilgisini döndür
      const { platform, stk } = require('@/lib/website-monitor').parseUrlInfo(url)
      
      return NextResponse.json({
        success: false,
        error: result.error,
        platform,
        stk,
        url,
      })
    }

    return NextResponse.json({
      success: true,
      platform: result.platform,
      stk: result.stk,
      followers: result.followers,
      url: result.url,
    })

  } catch (error) {
    console.error('Scrape URL error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Link işlenirken hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'URL Scraping endpoint',
    usage: 'POST ile sosyal medya link\'i gönderin',
    examples: [
      'https://www.instagram.com/musiaddenizli/',
      'https://twitter.com/MUSIADDenizli',
      'https://www.facebook.com/AskonDenizli20/',
    ],
  })
}
