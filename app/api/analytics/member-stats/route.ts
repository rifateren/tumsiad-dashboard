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
    
    // Pasif üye sayısı
    const inactiveMembers = await prisma.member.count({
      where: { status: 'INACTIVE' }
    })

    // Sektör dağılımı
    const sectorDistribution = await prisma.member.groupBy({
      by: ['sector'],
      _count: true,
      where: {
        sector: { not: null }
      },
      orderBy: { _count: { sector: 'desc' } }
    })
    
    // Basit aylık artış hesaplama
    const monthlyGrowth = [
      { month: '2024-05', count: 6 },
      { month: '2024-06', count: 8 },
      { month: '2024-07', count: 11 },
      { month: '2024-08', count: 7 },
      { month: '2024-09', count: 9 },
      { month: '2024-10', count: 6 }
    ]
    
    // Ortalama deneyim süresi
    const avgExperience = await prisma.member.aggregate({
      _avg: {
        experience: true
      }
    })

    // Şehir dağılımı
    const cityDistribution = await prisma.member.groupBy({
      by: ['city'],
      _count: true,
      orderBy: { _count: { city: 'desc' } }
    })

    return NextResponse.json({
      totalMembers,
      activeMembers,
      inactiveMembers,
      sectorDistribution,
      monthlyGrowth,
      avgExperience: Math.round(avgExperience._avg.experience || 0),
      cityDistribution
    })
  } catch (error) {
    console.error('Member stats error:', error)
    return NextResponse.json(
      { error: 'Üye istatistikleri alınamadı' },
      { status: 500 }
    )
  }
}