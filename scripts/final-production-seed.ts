import { PrismaClient } from '@prisma/client'

// Prisma Postgres URL'i
const productionUrl = "postgres://edbe6ca7f456d817f6f39a9f96ae4dc0ea1e467e4468098762531fdf405b1d63:sk_PsAZDf4_0SN5i8yka45i9@db.prisma.io:5432/postgres?sslmode=require"

const prisma = new PrismaClient({
  datasourceUrl: productionUrl
})

async function main() {
  try {
    console.log('🚀 Final production database seeding başlıyor...')
    
    // 1. Competitor'ları oluştur
    console.log('\n📊 Competitor\'lar oluşturuluyor...')
    
    const tumsiad = await prisma.competitor.upsert({
      where: { shortName: 'TÜMSİAD' },
      update: {},
      create: {
        name: 'Tüm Sanayici ve İş Adamları Derneği',
        shortName: 'TÜMSİAD',
        website: 'https://tumsiad.org.tr',
        description: 'Tüm Sanayici ve İş Adamları Derneği',
      }
    })

    const musiad = await prisma.competitor.upsert({
      where: { shortName: 'MÜSİAD' },
      update: {},
      create: {
        name: 'Müstakil Sanayici ve İşadamları Derneği',
        shortName: 'MÜSİAD',
        website: 'https://musiad.org.tr',
        description: 'Müstakil Sanayici ve İşadamları Derneği',
      }
    })

    const askon = await prisma.competitor.upsert({
      where: { shortName: 'ASKON' },
      update: {},
      create: {
        name: 'Anadolu Aslanları İşadamları Derneği',
        shortName: 'ASKON',
        website: 'https://askon.org.tr',
        description: 'Anadolu Aslanları İşadamları Derneği',
      }
    })

    console.log('✅ Competitor\'lar oluşturuldu')

    // 2. Sosyal medya verilerini ekle
    console.log('\n📱 Sosyal medya verileri ekleniyor...')
    
    // TÜMSİAD sosyal medya
    await prisma.socialMediaStat.createMany({
      data: [
        {
          competitorId: tumsiad.id,
          platform: 'INSTAGRAM',
          followers: 2800,
          posts: 45,
          engagement: 4.2,
        },
        {
          competitorId: tumsiad.id,
          platform: 'FACEBOOK',
          followers: 3200,
          posts: 38,
          engagement: 3.8,
        },
        {
          competitorId: tumsiad.id,
          platform: 'TWITTER',
          followers: 1500,
          posts: 25,
          engagement: 2.5,
        }
      ]
    })

    // MÜSİAD sosyal medya
    await prisma.socialMediaStat.createMany({
      data: [
        {
          competitorId: musiad.id,
          platform: 'INSTAGRAM',
          followers: 8650,
          posts: 120,
          engagement: 5.2,
        },
        {
          competitorId: musiad.id,
          platform: 'FACEBOOK',
          followers: 12400,
          posts: 95,
          engagement: 4.8,
        },
        {
          competitorId: musiad.id,
          platform: 'TWITTER',
          followers: 5700,
          posts: 78,
          engagement: 3.2,
        }
      ]
    })

    // ASKON sosyal medya
    await prisma.socialMediaStat.createMany({
      data: [
        {
          competitorId: askon.id,
          platform: 'INSTAGRAM',
          followers: 1367,
          posts: 35,
          engagement: 3.5,
        },
        {
          competitorId: askon.id,
          platform: 'FACEBOOK',
          followers: 4800,
          posts: 42,
          engagement: 4.1,
        },
        {
          competitorId: askon.id,
          platform: 'TWITTER',
          followers: 2200,
          posts: 28,
          engagement: 2.8,
        }
      ]
    })

    console.log('✅ Sosyal medya verileri eklendi')

    // 3. Dijital metrikleri ekle
    console.log('\n💻 Dijital metrikler ekleniyor...')
    
    await prisma.digitalMetric.createMany({
      data: [
        {
          competitorId: tumsiad.id,
          seoScore: 75,
          pageSpeed: 85,
          mobileScore: 80,
          contentScore: 70,
          overallScore: 77.5,
        },
        {
          competitorId: musiad.id,
          seoScore: 88,
          pageSpeed: 92,
          mobileScore: 90,
          contentScore: 85,
          overallScore: 88.75,
        },
        {
          competitorId: askon.id,
          seoScore: 82,
          pageSpeed: 78,
          mobileScore: 85,
          contentScore: 80,
          overallScore: 81.25,
        }
      ]
    })

    console.log('✅ Dijital metrikler eklendi')

    // 4. Mevcut üye sayısını kontrol et
    console.log('\n👥 Üye verileri kontrol ediliyor...')
    
    const existingMemberCount = await prisma.member.count()
    console.log(`   📊 Mevcut üye sayısı: ${existingMemberCount}`)
    
    if (existingMemberCount === 0) {
      console.log('   📝 Üye verisi yok, örnek üyeler ekleniyor...')
      
      const sampleMembers = [
        {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet.yilmaz@tumsiad.org.tr',
          phone: '0532 123 4567',
          company: 'Yılmaz İnşaat',
          position: 'Genel Müdür',
          sector: 'İNŞAAT',
          city: 'Denizli',
          district: 'Pamukkale',
          experience: 15,
          status: 'ACTIVE'
        },
        {
          firstName: 'Fatma',
          lastName: 'Demir',
          email: 'fatma.demir@tumsiad.org.tr',
          phone: '0533 987 6543',
          company: 'Demir Tekstil',
          position: 'Sahibi',
          sector: 'TEKSTİL',
          city: 'Denizli',
          district: 'Merkezefendi',
          experience: 20,
          status: 'ACTIVE'
        },
        {
          firstName: 'Mehmet',
          lastName: 'Kaya',
          email: 'mehmet.kaya@tumsiad.org.tr',
          phone: '0534 555 7777',
          company: 'Kaya Elektrik',
          position: 'Müdür',
          sector: 'ELEKTRİK',
          city: 'Denizli',
          district: 'Çivril',
          experience: 10,
          status: 'ACTIVE'
        }
      ]

      for (const memberData of sampleMembers) {
        await prisma.member.upsert({
          where: { email: memberData.email },
          update: {},
          create: memberData
        })
      }

      console.log('   ✅ Örnek üye verileri eklendi')
    } else {
      console.log('   ✅ Üye verileri zaten mevcut, ekleme yapılmadı')
    }

    console.log('\n🎉 TÜM VERİLER BAŞARIYLA PRODUCTION DATABASE\'E EKLENDİ!')
    console.log('\n📊 Özet:')
    console.log('   - 3 Competitor')
    console.log('   - 9 Sosyal Medya Kaydı')
    console.log('   - 3 Dijital Metrik')
    console.log('   - 3 Örnek Üye')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
