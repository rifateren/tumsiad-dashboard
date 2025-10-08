import { prisma } from './db'
import { Prisma } from '@prisma/client'

async function main() {
  console.log('🌱 Seeding database...')

  // Create Competitors
  const competitors = await Promise.all([
    prisma.competitor.upsert({
      where: { shortName: 'TÜMSİAD' },
      update: {},
      create: {
        name: 'Tüm Sanayici ve İş Adamları Derneği',
        shortName: 'TÜMSİAD',
        website: 'https://www.tumsiad.org',
        description: 'Türkiye genelinde faaliyet gösteren iş dünyası sivil toplum kuruluşu',
      },
    }),
    prisma.competitor.upsert({
      where: { shortName: 'MÜSİAD' },
      update: {},
      create: {
        name: 'Müstakil Sanayici ve İşadamları Derneği',
        shortName: 'MÜSİAD',
        website: 'https://www.musiad.org.tr',
        description: 'Türkiye\'nin en büyük iş dünyası STK\'larından biri',
      },
    }),
    prisma.competitor.upsert({
      where: { shortName: 'ASKON' },
      update: {},
      create: {
        name: 'Anadolu Aslanları İşadamları Derneği',
        shortName: 'ASKON',
        website: 'https://www.askon.org.tr',
        description: 'Anadolu merkezli iş dünyası sivil toplum kuruluşu',
      },
    }),
  ])

  console.log('✅ Competitors created')

  // Create sample members
  const members = await Promise.all([
    prisma.member.create({
      data: {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '+90 532 123 4567',
        company: 'Yılmaz Tekstil A.Ş.',
        position: 'Genel Müdür',
        sector: 'Tekstil',
        city: 'Denizli',
        district: 'Merkez',
        status: 'ACTIVE',
        membershipDate: new Date('2022-01-15'),
      },
    }),
    prisma.member.create({
      data: {
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'mehmet.kaya@example.com',
        phone: '+90 532 234 5678',
        company: 'Kaya İnşaat Ltd.',
        position: 'Yönetim Kurulu Başkanı',
        sector: 'İnşaat',
        city: 'Denizli',
        district: 'Pamukkale',
        status: 'ACTIVE',
        membershipDate: new Date('2022-03-20'),
      },
    }),
    prisma.member.create({
      data: {
        firstName: 'Ayşe',
        lastName: 'Demir',
        email: 'ayse.demir@example.com',
        phone: '+90 532 345 6789',
        company: 'Demir Teknoloji A.Ş.',
        position: 'CEO',
        sector: 'Teknoloji',
        city: 'Denizli',
        district: 'Merkez',
        status: 'ACTIVE',
        membershipDate: new Date('2023-06-10'),
      },
    }),
  ])

  console.log('✅ Members created')

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'İhracat Stratejileri Semineri',
        description: 'Deneyimli ihracatçılardan ihracat süreçleri ve stratejileri hakkında bilgi edinme',
        type: 'SEMINAR',
        startDate: new Date('2024-10-15T14:00:00'),
        endDate: new Date('2024-10-15T17:00:00'),
        location: 'TÜMSİAD Konferans Salonu',
        address: 'Çamlık Mahallesi, Denizli',
        city: 'Denizli',
        capacity: 50,
        status: 'COMPLETED',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Networking Kahvaltısı',
        description: 'Üyeler arası tanışma ve iş fırsatları değerlendirme kahvaltısı',
        type: 'NETWORKING',
        startDate: new Date('2024-11-05T09:00:00'),
        endDate: new Date('2024-11-05T11:00:00'),
        location: 'Hilton Garden Inn',
        address: 'Servergazi Mahallesi, Denizli',
        city: 'Denizli',
        capacity: 40,
        status: 'PLANNED',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Dijital Dönüşüm Workshop',
        description: 'İşletmelerde dijital dönüşüm stratejileri ve uygulamaları',
        type: 'WORKSHOP',
        startDate: new Date('2024-11-15T14:00:00'),
        endDate: new Date('2024-11-15T18:00:00'),
        location: 'TÜMSİAD Eğitim Merkezi',
        address: 'Çamlık Mahallesi, Denizli',
        city: 'Denizli',
        capacity: 30,
        status: 'PLANNED',
      },
    }),
  ])

  console.log('✅ Events created')

  // Create sample goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Üye Sayısını 100\'e Çıkarmak',
        description: 'Yıl sonuna kadar toplam üye sayısını 100\'e ulaştırmak',
        category: 'MEMBERSHIP',
        targetValue: 100,
        currentValue: 78,
        unit: 'üye',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Dijital Varlık Skorunu 85\'e Yükseltmek',
        description: 'Web sitesi ve sosyal medya performansını iyileştirmek',
        category: 'DIGITAL',
        targetValue: 85,
        currentValue: 72,
        unit: 'puan',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-12-31'),
      },
    }),
  ])

  console.log('✅ Goals created')

  // Create sample KPIs
  const kpis = await Promise.all([
    prisma.kPI.create({
      data: {
        goalId: goals[0].id,
        name: 'Aylık Yeni Üye Sayısı',
        description: 'Her ay kazanılan yeni üye sayısı',
        targetValue: 4,
        currentValue: 3.5,
        unit: 'üye',
        frequency: 'MONTHLY',
      },
    }),
    prisma.kPI.create({
      data: {
        goalId: goals[1].id,
        name: 'Sosyal Medya Büyüme',
        description: 'Aylık takipçi artış oranı',
        targetValue: 10,
        currentValue: 12.5,
        unit: '%',
        frequency: 'MONTHLY',
      },
    }),
  ])

  console.log('✅ KPIs created')

  // Create sample campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        title: 'Dijital Dönüşüm Farkındalık Kampanyası',
        description: 'KOBİ\'lerde dijital dönüşüm farkındalığı artırma',
        type: 'AWARENESS',
        status: 'ACTIVE',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-31'),
        budget: 15000,
        reach: 45000,
        engagement: 4.2,
      },
    }),
  ])

  console.log('✅ Campaigns created')

  // Create digital metrics for competitors
  const today = new Date()
  for (const competitor of competitors) {
    await prisma.digitalMetric.create({
      data: {
        competitorId: competitor.id,
        date: today,
        seoScore: competitor.shortName === 'TÜMSİAD' ? 68 : competitor.shortName === 'MÜSİAD' ? 85 : 72,
        pageSpeed: competitor.shortName === 'TÜMSİAD' ? 75 : competitor.shortName === 'MÜSİAD' ? 82 : 70,
        mobileScore: competitor.shortName === 'TÜMSİAD' ? 78 : competitor.shortName === 'MÜSİAD' ? 88 : 75,
        contentScore: competitor.shortName === 'TÜMSİAD' ? 65 : competitor.shortName === 'MÜSİAD' ? 80 : 68,
        overallScore: competitor.shortName === 'TÜMSİAD' ? 72 : competitor.shortName === 'MÜSİAD' ? 85 : 71,
      },
    })

    // Create social media stats
    const platforms: Array<'TWITTER' | 'LINKEDIN' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE'> = ['TWITTER', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE']
    for (const platform of platforms) {
      const baseFollowers = competitor.shortName === 'TÜMSİAD' ? 2000 : competitor.shortName === 'MÜSİAD' ? 10000 : 3000
      await prisma.socialMediaStat.create({
        data: {
          competitorId: competitor.id,
          platform,
          date: today,
          followers: baseFollowers + Math.floor(Math.random() * 5000),
          posts: Math.floor(Math.random() * 50) + 10,
          engagement: Math.random() * 5 + 1,
          reach: Math.floor(Math.random() * 50000) + 10000,
        },
      })
    }
  }

  console.log('✅ Digital metrics and social media stats created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
