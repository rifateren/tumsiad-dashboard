import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, period, userId } = body

    let reportData = {}
    let reportTitle = ''
    let reportContent = ''

    switch (type) {
      case 'monthly':
        reportTitle = `${period} Aylık Rapor`
        reportData = await generateMonthlyReport(period)
        break
      
      case 'quarterly':
        reportTitle = `${period} Çeyrek Rapor`
        reportData = await generateQuarterlyReport(period)
        break
      
      case 'yearly':
        reportTitle = `${period} Yıllık Rapor`
        reportData = await generateYearlyReport(period)
        break
      
      default:
        return NextResponse.json({ error: 'Geçersiz rapor türü' }, { status: 400 })
    }

    reportContent = JSON.stringify(reportData)

    // Raporu veritabanına kaydet
    const report = await prisma.report.create({
      data: {
        title: reportTitle,
        type: type.toUpperCase(),
        content: reportContent,
        generatedBy: userId,
        period: period
      }
    })

    return NextResponse.json({
      id: report.id,
      title: reportTitle,
      data: reportData,
      generatedAt: report.generatedAt
    })
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

async function generateMonthlyReport(period: string) {
  const [members, events, competitors] = await Promise.all([
    prisma.member.count(),
    prisma.event.count({
      where: {
        startDate: {
          gte: new Date(period + '-01'),
          lt: new Date(new Date(period + '-01').setMonth(new Date(period + '-01').getMonth() + 1))
        }
      }
    }),
    prisma.competitor.findMany({
      include: {
        digitalMetrics: {
          orderBy: { date: 'desc' },
          take: 1
        },
        socialMediaStats: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    })
  ])

  return {
    period,
    members: { total: members },
    events: { total: events },
    competitors: competitors.map(comp => ({
      name: comp.name,
      digitalScore: comp.digitalMetrics[0]?.overallScore || 0,
      socialMedia: comp.socialMediaStats.reduce((acc, stat) => {
        acc[stat.platform] = stat.followers
        return acc
      }, {})
    }))
  }
}

async function generateQuarterlyReport(period: string) {
  const [year, quarter] = period.split('-Q')
  const startDate = new Date(`${year}-${(parseInt(quarter) - 1) * 3 + 1}-01`)
  const endDate = new Date(`${year}-${parseInt(quarter) * 3 + 1}-01`)

  const [members, events, competitors] = await Promise.all([
    prisma.member.count({
      where: {
        membershipDate: {
          gte: startDate,
          lt: endDate
        }
      }
    }),
    prisma.event.count({
      where: {
        startDate: {
          gte: startDate,
          lt: endDate
        }
      }
    }),
    prisma.competitor.findMany()
  ])

  return {
    period,
    members: { new: members },
    events: { total: events },
    competitors: competitors.length
  }
}

async function generateYearlyReport(period: string) {
  const year = parseInt(period)
  const startDate = new Date(`${year}-01-01`)
  const endDate = new Date(`${year + 1}-01-01`)

  const [members, events, competitors, growth] = await Promise.all([
    prisma.member.count({
      where: {
        membershipDate: {
          gte: startDate,
          lt: endDate
        }
      }
    }),
    prisma.event.count({
      where: {
        startDate: {
          gte: startDate,
          lt: endDate
        }
      }
    }),
    prisma.competitor.count(),
    prisma.member.count({
      where: {
        membershipDate: {
          gte: new Date(`${year - 1}-01-01`),
          lt: startDate
        }
      }
    })
  ])

  return {
    period,
    members: { 
      new: members,
      growth: growth > 0 ? ((members - growth) / growth * 100).toFixed(1) : 0
    },
    events: { total: events },
    competitors: competitors,
    summary: {
      totalMembers: members,
      totalEvents: events,
      memberGrowth: growth > 0 ? ((members - growth) / growth * 100).toFixed(1) : 0
    }
  }
}
