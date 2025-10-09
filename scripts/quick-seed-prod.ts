// Quick production seed - bypasses Prisma Client cache issues
import { PrismaClient } from '@prisma/client'

const productionUrl = process.env.PRODUCTION_DATABASE_URL || "postgres://edbe6ca7f456d817f6f39a9f96ae4dc0ea1e467e4468098762531fdf405b1d63:sk_PsAZDf4_0SN5i8yka45i9@db.prisma.io:5432/postgres?sslmode=require"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: productionUrl
    }
  }
})

async function main() {
  console.log('🌱 Quick production seed başlıyor...')
  console.log('🔗 URL:', productionUrl.substring(0, 50) + '...')

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database bağlantısı başarılı!')

    // Temizlik
    console.log('\n🗑️  Eski veriler temizleniyor...')
    await prisma.competitorEventCount.deleteMany()
    await prisma.socialMediaStat.deleteMany()
    await prisma.digitalMetric.deleteMany()
    await prisma.competitor.deleteMany()
    await prisma.eventParticipant.deleteMany()
    await prisma.event.deleteMany()
    await prisma.member.deleteMany()
    console.log('✅ Temizlik tamamlandı')

    // TÜMSİAD
    console.log('\n📊 TÜMSİAD ekleniyor...')
    const tumsiad = await prisma.competitor.create({
      data: {
        name: 'TÜMSİAD',
        shortName: 'TÜMSİAD',
        website: 'https://www.tumsiad.org',
        description: 'Tüm Sanayici ve İş Adamları Derneği - 150 üye',
      }
    })

    await prisma.digitalMetric.create({
      data: {
        competitorId: tumsiad.id,
        seoScore: 70,
        pageSpeed: 75,
        mobileScore: 68,
        contentScore: 72,
        overallScore: 70,
      }
    })

    await prisma.socialMediaStat.createMany({
      data: [
        { competitorId: tumsiad.id, platform: 'INSTAGRAM', followers: 2800 },
        { competitorId: tumsiad.id, platform: 'TWITTER', followers: 1200 },
        { competitorId: tumsiad.id, platform: 'FACEBOOK', followers: 4500 }
      ]
    })

    // MÜSİAD
    console.log('📊 MÜSİAD ekleniyor...')
    const musiad = await prisma.competitor.create({
      data: {
        name: 'MÜSİAD',
        shortName: 'MÜSİAD',
        website: 'https://www.musiad.org.tr',
        description: 'Müstakil Sanayici ve İşadamları Derneği - 12000 üye',
      }
    })

    await prisma.digitalMetric.create({
      data: {
        competitorId: musiad.id,
        seoScore: 81,
        pageSpeed: 85,
        mobileScore: 80,
        contentScore: 82,
        overallScore: 81,
      }
    })

    await prisma.socialMediaStat.createMany({
      data: [
        { competitorId: musiad.id, platform: 'INSTAGRAM', followers: 8650 },
        { competitorId: musiad.id, platform: 'TWITTER', followers: 5200 },
        { competitorId: musiad.id, platform: 'FACEBOOK', followers: 12500 }
      ]
    })

    // ASKON
    console.log('📊 ASKON ekleniyor...')
    const askon = await prisma.competitor.create({
      data: {
        name: 'ASKON',
        shortName: 'ASKON',
        website: 'https://www.askon.org.tr',
        description: 'Anadolu Aslanları İşadamları Derneği - 8000 üye',
      }
    })

    await prisma.digitalMetric.create({
      data: {
        competitorId: askon.id,
        seoScore: 75,
        pageSpeed: 78,
        mobileScore: 73,
        contentScore: 76,
        overallScore: 75,
      }
    })

    await prisma.socialMediaStat.createMany({
      data: [
        { competitorId: askon.id, platform: 'INSTAGRAM', followers: 6200 },
        { competitorId: askon.id, platform: 'TWITTER', followers: 3800 },
        { competitorId: askon.id, platform: 'FACEBOOK', followers: 8900 }
      ]
    })

    // Üyeler
    console.log('\n👥 Üyeler ekleniyor...')
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
        },
        {
          firstName: 'Fatma',
          lastName: 'Şahin',
          email: 'fatma.sahin@example.com',
          phone: '0532 444 55 66',
          company: 'Şahin Gıda San. Tic.',
          position: 'Genel Müdür',
          sector: 'Gıda',
          city: 'Denizli',
          district: 'Merkez',
          status: 'ACTIVE',
          membershipDate: new Date('2023-07-01'),
          experience: 18,
        },
        {
          firstName: 'Ali',
          lastName: 'Çelik',
          email: 'ali.celik@example.com',
          phone: '0532 555 66 77',
          company: 'Çelik Turizm Ltd.',
          position: 'Yönetim Kurulu Üyesi',
          sector: 'Turizm',
          city: 'Denizli',
          district: 'Pamukkale',
          status: 'ACTIVE',
          membershipDate: new Date('2023-09-15'),
          experience: 10,
        }
      ]
    })

    // Etkinlikler
    console.log('📅 Etkinlikler ekleniyor...')
    await prisma.event.createMany({
      data: [
        {
          title: 'Dijital Dönüşüm Semineri',
          description: 'İşletmelerde dijital dönüşüm stratejileri ve uygulamaları',
          type: 'SEMINAR',
          startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 gün sonra
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
          location: 'TÜMSİAD Konferans Salonu',
          city: 'Denizli',
          capacity: 50,
          cost: 0,
          status: 'PLANNED',
        },
        {
          title: 'İhracat Stratejileri Workshop',
          description: 'Uluslararası pazarlara açılma ve ihracat stratejileri',
          type: 'WORKSHOP',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 gün önce
          endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
          location: 'TÜMSİAD Eğitim Merkezi',
          city: 'Denizli',
          capacity: 30,
          cost: 500,
          status: 'COMPLETED',
        },
        {
          title: 'Networking Kahvaltısı',
          description: 'Üyeler arası networking ve iş geliştirme fırsatları',
          type: 'NETWORKING',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          location: 'Hilton Garden Inn',
          city: 'Denizli',
          capacity: 40,
          cost: 150,
          status: 'PLANNED',
        }
      ]
    })

    console.log('\n✅ PRODUCTION DATABASE SEED TAMAMLANDI!')
    console.log('\n📊 Özet:')
    console.log('   - 3 Competitor (TÜMSİAD, MÜSİAD, ASKON)')
    console.log('   - 9 Digital Metrics')
    console.log('   - 9 Social Media Stats')
    console.log('   - 5 Members')
    console.log('   - 3 Events')

  } catch (error) {
    console.error('\n❌ Seed hatası:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()

