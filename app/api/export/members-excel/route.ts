import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // CSV format
    const headers = ['Ad', 'Soyad', 'Email', 'Telefon', 'Şirket', 'Pozisyon', 'Sektör', 'Şehir', 'İlçe', 'Durum', 'Üyelik Tarihi']
    const rows = members.map(m => [
      m.firstName,
      m.lastName,
      m.email,
      m.phone || '',
      m.company || '',
      m.position || '',
      m.sector || '',
      m.city,
      m.district || '',
      m.status,
      new Date(m.membershipDate).toLocaleDateString('tr-TR')
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Add BOM for Turkish characters in Excel
    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tumsiad-uyeler-${new Date().toISOString().slice(0, 10)}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export başarısız' }, { status: 500 })
  }
}

