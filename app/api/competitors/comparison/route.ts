import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const competitors = await prisma.competitor.findMany({
      include: {
        digitalMetrics: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
        socialMediaStats: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    })

    // Her competitor için analiz verileri oluştur
    const comparison = competitors.map(competitor => {
      const latestMetrics = competitor.digitalMetrics[0]
      const socialStats = competitor.socialMediaStats

      // Sosyal medya ortalamaları
      const avgFollowers = socialStats.length > 0
        ? Math.round(socialStats.reduce((sum, stat) => sum + stat.followers, 0) / socialStats.length)
        : 0

      const avgEngagement = socialStats.length > 0
        ? Number((socialStats.reduce((sum, stat) => sum + stat.engagement, 0) / socialStats.length).toFixed(2))
        : 0

      // Platform bazlı veriler
      const platformData = {
        twitter: socialStats.find(s => s.platform === 'TWITTER'),
        linkedin: socialStats.find(s => s.platform === 'LINKEDIN'),
        instagram: socialStats.find(s => s.platform === 'INSTAGRAM'),
        facebook: socialStats.find(s => s.platform === 'FACEBOOK'),
        youtube: socialStats.find(s => s.platform === 'YOUTUBE'),
      }

      return {
        id: competitor.id,
        name: competitor.name,
        shortName: competitor.shortName,
        website: competitor.website,
        digitalScore: latestMetrics?.overallScore || 0,
        seoScore: latestMetrics?.seoScore || 0,
        pageSpeed: latestMetrics?.pageSpeed || 0,
        mobileScore: latestMetrics?.mobileScore || 0,
        contentScore: latestMetrics?.contentScore || 0,
        socialMedia: {
          avgFollowers,
          avgEngagement,
          platforms: platformData,
        },
      }
    })

    return NextResponse.json(comparison)
  } catch (error) {
    console.error('Error fetching competitor comparison:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitor comparison' },
      { status: 500 }
    )
  }
}
