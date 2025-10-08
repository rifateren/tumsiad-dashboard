import { NextResponse } from 'next/server'

/**
 * Tüm competitor'ların sosyal medya verilerini günceller
 * Cron job olarak çalıştırılabilir
 * 
 * Kullanım:
 * POST /api/social-media/update-all
 */
export async function POST() {
  try {
    const competitors = ['TÜMSİAD', 'MÜSİAD', 'ASKON']
    const results = []

    for (const competitor of competitors) {
      console.log(`🔄 ${competitor} güncelleniyor...`)
      
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/social-media/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ competitor }),
      })

      const data = await response.json()
      results.push({
        competitor,
        success: data.success,
        data: data.data,
      })

      console.log(`${data.success ? '✅' : '❌'} ${competitor}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Tüm competitor verileri güncellendi',
      results,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Toplu güncelleme hatası:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Toplu güncelleme başarısız',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Cron job durumunu kontrol et
 */
export async function GET() {
  return NextResponse.json({
    message: 'Toplu güncelleme endpoint\'i',
    usage: 'POST request ile tüm competitor\'ları günceller',
    competitors: ['TÜMSİAD', 'MÜSİAD', 'ASKON'],
    info: 'Cron job veya manuel tetikleme için kullanılır',
  })
}
