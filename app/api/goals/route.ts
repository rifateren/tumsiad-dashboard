import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        kpis: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      goals,
      total: goals.length 
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const goal = await prisma.goal.create({
      data: body
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

