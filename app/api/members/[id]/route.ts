import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Tek üye getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: (await params).id },
      include: {
        participations: {
          include: {
            event: true
          }
        }
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error('Üye getirme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Üye güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const member = await prisma.member.update({
      where: { id: (await params).id },
      data: body
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Üye güncelleme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Üye sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.member.delete({
      where: { id: (await params).id }
    })

    return NextResponse.json({ message: 'Üye silindi' })
  } catch (error) {
    console.error('Üye silme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
