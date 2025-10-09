import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Toplam üye sayısı
    const totalMembers = await prisma.member.count()
    
    // Aktif üye sayısı
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE' }
    })
    
    // Şehir bazında dağılım
    const cityDistribution = await prisma.member.groupBy({
      by: ['city'],
      _count: true,
      orderBy: { _count: { city: 'desc' } }
    })
    
    // Sektör bazında dağılım
    const sectorDistribution = await prisma.member.groupBy({
      by: ['sector'],
      _count: true,
      where: {
        sector: { not: null }
      },
      orderBy: { _count: { sector: 'desc' } }
    })
    
    // Aylık üye artışı (son 12 ay)
    const monthlyGrowth = await prisma.member.groupBy({
      by: ['membershipDate'],
      _count: true,
      where: {
        membershipDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      }
    })
    
    // Ortalama deneyim süresi
    const avgExperience = await prisma.member.aggregate({
      _avg: {
        experience: true
      },
      where: {
        experience: { not: null }
      }
    })

    return NextResponse.json({
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      cityDistribution: cityDistribution.map(item => ({
        city: item.city,
        count: item._count
      })),
      sectorDistribution: sectorDistribution.map(item => ({
        sector: item.sector,
        count: item._count
      })),
      monthlyGrowth: monthlyGrowth.map(item => ({
        month: item.membershipDate.toISOString().slice(0, 7),
        count: item._count
      })),
      avgExperience: Math.round(avgExperience._avg.experience || 0)
    })
  } catch (error) {
    console.error('Üye istatistikleri hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
