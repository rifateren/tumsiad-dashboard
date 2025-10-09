import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  console.log('🌱 Production database seed başlıyor...')

  // Temizlik
  console.log('🗑️  Eski veriler temizleniyor...')
  await prisma.competitorEventCount.deleteMany()
  await prisma.socialMediaStat.deleteMany()
  await prisma.digitalMetric.deleteMany()
  await prisma.competitor.deleteMany()
  await prisma.eventParticipant.deleteMany()
  await prisma.event.deleteMany()
  await prisma.member.deleteMany()

  // TÜMSİAD Competitor
  console.log('📊 TÜMSİAD verileri ekleniyor...')
  const tumsiad = await prisma.competitor.create({
    data: {
      name: 'TÜMSİAD',
      shortName: 'TÜMSİAD',
      website: 'https://www.tumsiad.org',
      memberCount: 150,
      foundedYear: 1971,
    }
  })

  // TÜMSİAD Digital Metrics
  await prisma.digitalMetric.create({
    data: {
      competitorId: tumsiad.id,
      metricType: 'SEO',
      value: 70,
      overallScore: 70,
      date: new Date(),
    }
  })

  // TÜMSİAD Social Media
  await prisma.socialMediaStat.createMany({
    data: [
      {
        competitorId: tumsiad.id,
        platform: 'INSTAGRAM',
        followers: 2800,
        date: new Date(),
      },
      {
        competitorId: tumsiad.id,
        platform: 'TWITTER',
        followers: 1200,
        date: new Date(),
      },
      {
        competitorId: tumsiad.id,
        platform: 'FACEBOOK',
        followers: 4500,
        date: new Date(),
      }
    ]
  })

  // MÜSİAD
  console.log('📊 MÜSİAD verileri ekleniyor...')
  const musiad = await prisma.competitor.create({
    data: {
      name: 'MÜSİAD',
      shortName: 'MÜSİAD',
      website: 'https://www.musiad.org.tr',
      memberCount: 12000,
      foundedYear: 1990,
    }
  })

  await prisma.digitalMetric.create({
    data: {
      competitorId: musiad.id,
      metricType: 'SEO',
      value: 81,
      overallScore: 81,
      date: new Date(),
    }
  })

  await prisma.socialMediaStat.createMany({
    data: [
      {
        competitorId: musiad.id,
        platform: 'INSTAGRAM',
        followers: 8650,
        date: new Date(),
      },
      {
        competitorId: musiad.id,
        platform: 'TWITTER',
        followers: 5200,
        date: new Date(),
      },
      {
        competitorId: musiad.id,
        platform: 'FACEBOOK',
        followers: 12500,
        date: new Date(),
      }
    ]
  })

  // ASKON
  console.log('📊 ASKON verileri ekleniyor...')
  const askon = await prisma.competitor.create({
    data: {
      name: 'ASKON',
      shortName: 'ASKON',
      website: 'https://www.askon.org.tr',
      memberCount: 8000,
      foundedYear: 2003,
    }
  })

  await prisma.digitalMetric.create({
    data: {
      competitorId: askon.id,
      metricType: 'SEO',
      value: 75,
      overallScore: 75,
      date: new Date(),
    }
  })

  await prisma.socialMediaStat.createMany({
    data: [
      {
        competitorId: askon.id,
        platform: 'INSTAGRAM',
        followers: 6200,
        date: new Date(),
      },
      {
        competitorId: askon.id,
        platform: 'TWITTER',
        followers: 3800,
        date: new Date(),
      },
      {
        competitorId: askon.id,
        platform: 'FACEBOOK',
        followers: 8900,
        date: new Date(),
      }
    ]
  })

  // Örnek üyeler ekle
  console.log('👥 Örnek üyeler ekleniyor...')
  await prisma.member.createMany({
    data: [
      {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '0532 111 22 33',
        company: 'Yılmaz Tekstil A.Ş.',
        position: 'Genel Müdür',
        sector: 'Tekstil',
        city: 'Denizli',
        district: 'Pamukkale',
        status: 'ACTIVE',
        membershipDate: new Date('2023-01-15'),
        experience: 15,
      },
      {
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'mehmet.kaya@example.com',
        phone: '0532 222 33 44',
        company: 'Kaya İnşaat Ltd.',
        position: 'Yönetim Kurulu Başkanı',
        sector: 'İnşaat',
        city: 'Denizli',
        district: 'Merkezefendi',
        status: 'ACTIVE',
        membershipDate: new Date('2023-03-20'),
        experience: 20,
      },
      {
        firstName: 'Ayşe',
        lastName: 'Demir',
        email: 'ayse.demir@example.com',
        phone: '0532 333 44 55',
        company: 'Demir Teknoloji A.Ş.',
        position: 'CEO',
        sector: 'Teknoloji',
        city: 'Denizli',
        district: 'Pamukkale',
        status: 'ACTIVE',
        membershipDate: new Date('2023-05-10'),
        experience: 12,
      }
    ]
  })

  // Örnek etkinlikler ekle
  console.log('📅 Örnek etkinlikler ekleniyor...')
  await prisma.event.createMany({
    data: [
      {
        title: 'Dijital Dönüşüm Semineri',
        description: 'İşletmelerde dijital dönüşüm stratejileri',
        type: 'SEMINAR',
        startDate: new Date('2024-11-15T14:00:00'),
        endDate: new Date('2024-11-15T17:00:00'),
        location: 'TÜMSİAD Konferans Salonu',
        city: 'Denizli',
        capacity: 50,
        cost: 0,
        status: 'PLANNED',
      },
      {
        title: 'İhracat Stratejileri Workshop',
        description: 'Uluslararası pazarlara açılma stratejileri',
        type: 'WORKSHOP',
        startDate: new Date('2024-10-20T10:00:00'),
        endDate: new Date('2024-10-20T16:00:00'),
        location: 'TÜMSİAD Eğitim Merkezi',
        city: 'Denizli',
        capacity: 30,
        cost: 500,
        status: 'COMPLETED',
      }
    ]
  })

  console.log('✅ Production database seed tamamlandı!')
  console.log('📊 Özet:')
  console.log('   - 3 Competitor (TÜMSİAD, MÜSİAD, ASKON)')
  console.log('   - 3 Üye')
  console.log('   - 2 Etkinlik')
  console.log('   - Dijital metrikler ve sosyal medya istatistikleri')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

