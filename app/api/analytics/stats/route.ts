import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get member statistics
    const totalMembers = await prisma.member.count()
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE' },
    })

    // Get event statistics
    const totalEvents = await prisma.event.count()
    const upcomingEvents = await prisma.event.count({
      where: {
        startDate: {
          gte: new Date(),
        },
        status: { in: ['PLANNED', 'ONGOING'] },
      },
    })

    // Get goals statistics
    const totalGoals = await prisma.goal.count()
    const inProgressGoals = await prisma.goal.count({
      where: { status: 'IN_PROGRESS' },
    })
    const completedGoals = await prisma.goal.count({
      where: { status: 'COMPLETED' },
    })

    // Calculate completion rate
    const completionRate = totalGoals > 0 
      ? Math.round((completedGoals / totalGoals) * 100) 
      : 0

    const stats = {
      members: {
        total: totalMembers,
        active: activeMembers,
        activeRate: totalMembers > 0 
          ? Math.round((activeMembers / totalMembers) * 100) 
          : 0,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
      },
      goals: {
        total: totalGoals,
        inProgress: inProgressGoals,
        completed: completedGoals,
        completionRate,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
