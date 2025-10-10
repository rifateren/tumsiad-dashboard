import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'desc' }
    })

    // CSV format
    const headers = ['Başlık', 'Tür', 'Başlangıç', 'Bitiş', 'Konum', 'Şehir', 'Kapasite', 'Maliyet', 'Durum']
    const rows = events.map(e => [
      e.title,
      e.type,
      new Date(e.startDate).toLocaleString('tr-TR'),
      e.endDate ? new Date(e.endDate).toLocaleString('tr-TR') : '',
      e.location || '',
      e.city,
      e.capacity?.toString() || '',
      e.cost?.toString() || '',
      e.status
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tumsiad-etkinlikler-${new Date().toISOString().slice(0, 10)}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export başarısız' }, { status: 500 })
  }
}

