import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Tek rapor getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({
      id: report.id,
      title: report.title,
      type: report.type,
      content: JSON.parse(report.content),
      period: report.period,
      generatedAt: report.generatedAt,
      generatedBy: report.user?.name || 'Bilinmiyor'
    })
  } catch (error) {
    console.error('Rapor getirme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Rapor sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.report.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Rapor silindi' })
  } catch (error) {
    console.error('Rapor silme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
