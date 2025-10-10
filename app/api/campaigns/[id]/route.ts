import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Kampanya bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Campaign fetch error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Campaign update error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.campaign.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Kampanya silindi' })
  } catch (error) {
    console.error('Campaign delete error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

