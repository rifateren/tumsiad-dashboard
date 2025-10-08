import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * AI Chat'ten gelen komutları işler ve database'i günceller
 * 
 * Kullanım:
 * POST /api/ai-update
 * Body: {
 *   type: 'social_media' | 'digital_metric' | 'event_count',
 *   competitor: 'TÜMSİAD' | 'MÜSİAD' | 'ASKON',
 *   platform?: 'twitter' | 'instagram' | 'facebook',
 *   metric?: 'seo' | 'pageSpeed' | 'mobile' | 'content',
 *   month?: string (e.g., 'Haziran'),
 *   value: number
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, competitor, platform, metric, month, value } = body

    if (!type || !competitor || !value) {
      return NextResponse.json(
        { success: false, error: 'Eksik parametreler' },
        { status: 400 }
      )
    }

    // Competitor'ı bul
    const competitorData = await prisma.competitor.findUnique({
      where: { shortName: competitor },
    })

    if (!competitorData) {
      return NextResponse.json(
        { success: false, error: 'Competitor bulunamadı' },
        { status: 404 }
      )
    }

    if (type === 'social_media' && platform) {
      // Sosyal medya güncellemesi
      const platformUpper = platform.toUpperCase() as 'TWITTER' | 'INSTAGRAM' | 'FACEBOOK'
      
      // Önceki kaydı bul ve güncelle, yoksa yeni oluştur
      const existing = await prisma.socialMediaStat.findFirst({
        where: {
          competitorId: competitorData.id,
          platform: platformUpper,
        },
        orderBy: {
          date: 'desc',
        },
      })

      const newStat = await prisma.socialMediaStat.create({
        data: {
          competitorId: competitorData.id,
          platform: platformUpper,
          followers: value,
          posts: existing?.posts || 30,
          engagement: existing?.engagement || 3.5,
          reach: Math.round(value * 0.1),
          likes: Math.round(value * 0.05),
          comments: Math.round(value * 0.01),
          shares: Math.round(value * 0.005),
        },
      })

      return NextResponse.json({
        success: true,
        message: `${competitor} ${platform} güncellendi`,
        data: newStat,
      })

    } else if (type === 'digital_metric' && metric) {
      // Dijital metrik güncellemesi
      const existing = await prisma.digitalMetric.findFirst({
        where: {
          competitorId: competitorData.id,
        },
        orderBy: {
          date: 'desc',
        },
      })

      const updates: any = {
        competitorId: competitorData.id,
        seoScore: existing?.seoScore || 70,
        pageSpeed: existing?.pageSpeed || 70,
        mobileScore: existing?.mobileScore || 75,
        contentScore: existing?.contentScore || 65,
      }

      // İlgili metriği güncelle
      if (metric === 'seo') updates.seoScore = value
      else if (metric === 'pageSpeed') updates.pageSpeed = value
      else if (metric === 'mobile') updates.mobileScore = value
      else if (metric === 'content') updates.contentScore = value

      // Overall score hesapla
      updates.overallScore = Math.round(
        (updates.seoScore + updates.pageSpeed + updates.mobileScore + updates.contentScore) / 4
      )

      const newMetric = await prisma.digitalMetric.create({
        data: updates,
      })

      return NextResponse.json({
        success: true,
        message: `${competitor} ${metric} güncellendi`,
        data: newMetric,
        overallScore: updates.overallScore,
      })

    } else if (type === 'event_count' && month) {
      // Etkinlik sayısı güncellemesi
      const year = new Date().getFullYear()
      const monthYear = `${month} ${year}`

      // Upsert (varsa güncelle, yoksa oluştur)
      const eventCount = await prisma.competitorEventCount.upsert({
        where: {
          competitorId_month: {
            competitorId: competitorData.id,
            month: monthYear,
          },
        },
        update: {
          eventCount: value,
        },
        create: {
          competitorId: competitorData.id,
          month: monthYear,
          eventCount: value,
        },
      })

      return NextResponse.json({
        success: true,
        message: `${competitor} ${month} ayı etkinlik sayısı güncellendi`,
        data: eventCount,
      })

    } else {
      return NextResponse.json(
        { success: false, error: 'Geçersiz güncelleme tipi' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('AI update error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Güncelleme başarısız',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Desteklenen komutları listele
 */
export async function GET() {
  return NextResponse.json({
    message: 'AI Chat API - Veri güncelleme endpoint\'i',
    supportedCommands: {
      socialMedia: [
        'MÜSİAD Instagram 9000',
        'TÜMSİAD Twitter 1500',
        'ASKON Facebook 5500',
      ],
      digitalMetrics: [
        'SEO skoru 75',
        'Sayfa hızı 80',
        'Mobil skor 85',
        'İçerik skoru 70',
      ],
    },
    platforms: ['twitter', 'instagram', 'facebook'],
    competitors: ['TÜMSİAD', 'MÜSİAD', 'ASKON'],
  })
}
