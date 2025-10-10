import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Geçersiz ID listesi' }, { status: 400 })
    }

    const result = await prisma.member.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return NextResponse.json({ 
      message: `${result.count} üye silindi`,
      count: result.count 
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

