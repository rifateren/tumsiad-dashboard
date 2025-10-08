import { NextResponse } from 'next/server'
import { runScraper } from '@/lib/scraper'

/**
 * Manuel scraper trigger endpoint
 * Production'da authentication ve authorization eklenmelidir
 */
export async function POST() {
  try {
    console.log('🚀 Starting manual scraper run...')
    
    const scores = await runScraper()
    
    return NextResponse.json({
      success: true,
      message: 'Scraper completed successfully',
      scores,
    })
  } catch (error) {
    console.error('Error running scraper:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to run scraper',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Scraper endpoint - Use POST to trigger',
    info: 'This endpoint runs the web scraper to update competitor metrics',
  })
}
