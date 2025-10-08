import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const competitorId = searchParams.get('competitorId')

    if (!competitorId) {
      return NextResponse.json(
        { error: 'Competitor ID is required' },
        { status: 400 }
      )
    }

    // Digital metrics
    const digitalMetrics = await prisma.digitalMetric.findFirst({
      where: { competitorId },
      orderBy: { date: 'desc' },
    })

    // Social media stats
    const socialMediaStats = await prisma.socialMediaStat.findMany({
      where: { competitorId },
      orderBy: { date: 'desc' },
      take: 5, // Son 5 platform
    })

    // Geçmiş veriler (trend için)
    const historicalMetrics = await prisma.digitalMetric.findMany({
      where: { competitorId },
      orderBy: { date: 'desc' },
      take: 6, // Son 6 ay
    })

    const historicalSocial = await prisma.socialMediaStat.findMany({
      where: { competitorId },
      orderBy: { date: 'desc' },
      take: 30, // Son 30 veri
    })

    return NextResponse.json({
      current: digitalMetrics,
      socialMedia: socialMediaStats,
      historical: {
        digital: historicalMetrics,
        social: historicalSocial,
      },
    })
  } catch (error) {
    console.error('Error fetching digital metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch digital metrics' },
      { status: 500 }
    )
  }
}
