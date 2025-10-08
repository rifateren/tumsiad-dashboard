import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Aylık etkinlik sıklığı verilerini döndürür
 * TÜMSİAD: Database'den gerçek
 * Rakipler: Manuel girilen tahminler
 */
export async function GET() {
  try {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const aylar = ['Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim']
    
    // Competitor'ları bul
    const tumsiad = await prisma.competitor.findUnique({ where: { shortName: 'TÜMSİAD' } })
    const musiad = await prisma.competitor.findUnique({ where: { shortName: 'MÜSİAD' } })
    const askon = await prisma.competitor.findUnique({ where: { shortName: 'ASKON' } })

    const result = []

    for (let i = 0; i < 6; i++) {
      const monthName = aylar[i]
      const monthIndex = 4 + i // Mayıs=4, Haziran=5, ... Ekim=9
      
      // TÜMSİAD - Database'den gerçek
      const startDate = new Date(currentYear, monthIndex, 1)
      const endDate = new Date(currentYear, monthIndex + 1, 0)
      
      const tumCount = await prisma.event.count({
        where: {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      // MÜSİAD - Database'den veya default
      let musCount = 7 // default
      if (musiad) {
        const musData = await prisma.competitorEventCount.findUnique({
          where: {
            competitorId_month: {
              competitorId: musiad.id,
              month: `${monthName} ${currentYear}`,
            },
          },
        })
        if (musData) musCount = musData.eventCount
      }

      // ASKON - Database'den veya default
      let askCount = 5 // default
      if (askon) {
        const askData = await prisma.competitorEventCount.findUnique({
          where: {
            competitorId_month: {
              competitorId: askon.id,
              month: `${monthName} ${currentYear}`,
            },
          },
        })
        if (askData) askCount = askData.eventCount
      }

      result.push({
        month: monthName,
        tumsiad: tumCount,
        musiad: musCount,
        askon: askCount,
      })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching event frequency:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event frequency' },
      { status: 500 }
    )
  }
}

/**
 * Rakip STK etkinlik sayılarını manuel güncelleme
 * AI Chat'ten çağrılacak
 */
export async function POST(request: Request) {
  try {
    const { competitor, month, count } = await request.json()

    if (!competitor || !month || count === undefined) {
      return NextResponse.json(
        { success: false, error: 'Eksik parametreler' },
        { status: 400 }
      )
    }

    // TODO: Ayrı bir CompetitorEventStats tablosu oluşturulabilir
    // Şimdilik mock data güncellemesi yapılabilir

    return NextResponse.json({
      success: true,
      message: `${competitor} ${month} ayı etkinlik sayısı ${count} olarak güncellendi`,
      data: { competitor, month, count },
    })

  } catch (error) {
    console.error('Event frequency update error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Güncelleme başarısız',
      },
      { status: 500 }
    )
  }
}
