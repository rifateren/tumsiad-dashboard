import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Tek etkinlik getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: (await params).id },
      include: {
        participants: {
          include: {
            member: true
          }
        },
        feedbacks: true
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Etkinlik getirme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Etkinlik güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const event = await prisma.event.update({
      where: { id: (await params).id },
      data: body
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Etkinlik güncelleme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Etkinlik sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: (await params).id }
    })

    return NextResponse.json({ message: 'Etkinlik silindi' })
  } catch (error) {
    console.error('Etkinlik silme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
