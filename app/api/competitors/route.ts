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
          orderBy: {
            date: 'desc',
          },
        },
      },
    })

    return NextResponse.json(competitors)
  } catch (error) {
    console.error('Error fetching competitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitors' },
      { status: 500 }
    )
  }
}
