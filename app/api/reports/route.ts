import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Tüm raporları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = type ? { type: type.toUpperCase() } : {}

    const reports = await prisma.report.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    const total = await prisma.report.count({ where })

    return NextResponse.json({
      reports: reports.map(report => ({
        id: report.id,
        title: report.title,
        type: report.type,
        period: report.period,
        generatedAt: report.generatedAt,
        generatedBy: report.user?.name || 'Bilinmiyor'
      })),
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Raporlar getirme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Yeni rapor oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const report = await prisma.report.create({
      data: body
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
