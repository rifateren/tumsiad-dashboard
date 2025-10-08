import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { 
  getTwitterMetrics,
  getInstagramMetrics,
  getFacebookMetrics
} from '@/lib/social-media-api'

/**
 * Sosyal medya metriklerini güncelleme endpoint'i
 * 
 * Kullanım:
 * POST /api/social-media/update
 * Body: { competitor: 'TÜMSİAD' | 'MÜSİAD' | 'ASKON' }
 */
export async function POST(request: Request) {
  try {
    const { competitor } = await request.json()

    if (!competitor) {
      return NextResponse.json(
        { error: 'Competitor parametresi gerekli' },
        { status: 400 }
      )
    }

    // Competitor'ı bul
    const competitorData = await prisma.competitor.findUnique({
      where: { shortName: competitor },
    })

    if (!competitorData) {
      return NextResponse.json(
        { error: 'Competitor bulunamadı' },
        { status: 404 }
      )
    }

    const results: any = {
      competitor: competitor,
      updated: new Date().toISOString(),
      data: {},
    }

    // Twitter/X hesaplarını güncelle
    const twitterAccounts: Record<string, string> = {
      'TÜMSİAD': 'tumsiad',
      'MÜSİAD': 'MUSIADDenizli',
      'ASKON': 'askon',
    }

    if (twitterAccounts[competitor]) {
      const twitterData = await getTwitterMetrics(twitterAccounts[competitor])
      if (twitterData) {
        results.data.twitter = twitterData

        // Database'e kaydet
        await prisma.socialMediaStat.create({
          data: {
            competitorId: competitorData.id,
            platform: 'TWITTER',
            followers: twitterData.followers,
            posts: twitterData.tweets,
            engagement: 2.5, // Ortalama engagement
            reach: Math.round(twitterData.followers * 0.1),
            likes: 0,
            comments: 0,
            shares: 0,
          },
        })

        console.log(`✅ ${competitor} Twitter verileri güncellendi`)
      }
    }

    // Instagram hesaplarını güncelle
    const instagramAccounts: Record<string, string> = {
      // Business Account ID'leri buraya eklenecek (API key gerekli)
      // 'TÜMSİAD': '...',
      // 'MÜSİAD': '...',
      // 'ASKON': '...',
    }

    if (instagramAccounts[competitor]) {
      const instagramData = await getInstagramMetrics(instagramAccounts[competitor])
      if (instagramData) {
        results.data.instagram = instagramData

        await prisma.socialMediaStat.create({
          data: {
            competitorId: competitorData.id,
            platform: 'INSTAGRAM',
            followers: instagramData.followers,
            posts: instagramData.mediaCount,
            engagement: 4.0,
            reach: Math.round(instagramData.followers * 0.1),
            likes: 0,
            comments: 0,
            shares: 0,
          },
        })

        console.log(`✅ ${competitor} Instagram verileri güncellendi`)
      }
    }

    // Facebook sayfalarını güncelle
    const facebookPages: Record<string, string> = {
      // Page ID'leri buraya eklenecek (API key gerekli)
      // 'TÜMSİAD': '...',
      // 'MÜSİAD': '...',
      // 'ASKON': '...',
    }

    if (facebookPages[competitor]) {
      const facebookData = await getFacebookMetrics(facebookPages[competitor])
      if (facebookData) {
        results.data.facebook = facebookData

        await prisma.socialMediaStat.create({
          data: {
            competitorId: competitorData.id,
            platform: 'FACEBOOK',
            followers: facebookData.followers,
            posts: 30,
            engagement: 3.5,
            reach: Math.round(facebookData.followers * 0.1),
            likes: facebookData.likes,
            comments: 0,
            shares: 0,
          },
        })

        console.log(`✅ ${competitor} Facebook verileri güncellendi`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${competitor} verileri başarıyla güncellendi`,
      ...results,
    })

  } catch (error) {
    console.error('API update error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Güncelleme sırasında hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * API durumunu ve yapılandırmayı kontrol et
 */
export async function GET() {
  const apiStatus = {
    twitter: !!process.env.TWITTER_BEARER_TOKEN,
    instagram: !!process.env.INSTAGRAM_ACCESS_TOKEN,
    facebook: !!process.env.FACEBOOK_ACCESS_TOKEN,
  }

  const enabledApis = Object.entries(apiStatus)
    .filter(([_, enabled]) => enabled)
    .map(([api]) => api)

  return NextResponse.json({
    message: 'Sosyal Medya API Durumu (3 Platform)',
    apis: apiStatus,
    enabled: enabledApis,
    total: enabledApis.length,
    info: 'API key\'leri .env dosyasına ekleyin. Manuel güncelleme için AI Chat kullanabilirsiniz.',
  })
}
