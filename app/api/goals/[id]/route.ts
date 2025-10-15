import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: (await params).id },
      include: { kpis: true }
    })

    if (!goal) {
      return NextResponse.json({ error: 'Hedef bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Goal fetch error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const goal = await prisma.goal.update({
      where: { id: (await params).id },
      data: body
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Goal update error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.goal.delete({
      where: { id: (await params).id }
    })

    return NextResponse.json({ message: 'Hedef silindi' })
  } catch (error) {
    console.error('Goal delete error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

