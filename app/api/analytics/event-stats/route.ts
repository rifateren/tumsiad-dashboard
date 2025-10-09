import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Toplam etkinlik sayısı
    const totalEvents = await prisma.event.count()
    
    // Bu yılki etkinlikler
    const thisYear = new Date().getFullYear()
    const thisYearEvents = await prisma.event.count({
      where: {
        startDate: {
          gte: new Date(`${thisYear}-01-01`),
          lt: new Date(`${thisYear + 1}-01-01`)
        }
      }
    })
    
    // Etkinlik türü bazında dağılım
    const eventTypeDistribution = await prisma.event.groupBy({
      by: ['type'],
      _count: true,
      orderBy: { _count: { type: 'desc' } }
    })
    
    // Durum bazında dağılım
    const statusDistribution = await prisma.event.groupBy({
      by: ['status'],
      _count: true
    })
    
    // Aylık etkinlik sayısı (son 12 ay)
    const monthlyEvents = await prisma.event.groupBy({
      by: ['startDate'],
      _count: true,
      where: {
        startDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      }
    })
    
    // Toplam katılımcı sayısı
    const totalParticipants = await prisma.eventParticipant.count()
    
    // Ortalama katılımcı sayısı
    const avgParticipants = await prisma.eventParticipant.groupBy({
      by: ['eventId'],
      _count: true
    })
    
    const avgParticipantsPerEvent = avgParticipants.length > 0 
      ? avgParticipants.reduce((sum, item) => sum + item._count, 0) / avgParticipants.length
      : 0

    return NextResponse.json({
      totalEvents,
      thisYearEvents,
      eventTypeDistribution: eventTypeDistribution.map(item => ({
        type: item.type,
        count: item._count
      })),
      statusDistribution: statusDistribution.map(item => ({
        status: item.status,
        count: item._count
      })),
      monthlyEvents: monthlyEvents.map(item => ({
        month: item.startDate.toISOString().slice(0, 7),
        count: item._count
      })),
      totalParticipants,
      avgParticipantsPerEvent: Math.round(avgParticipantsPerEvent)
    })
  } catch (error) {
    console.error('Etkinlik istatistikleri hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
