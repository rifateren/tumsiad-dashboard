import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🏢 Competitor verilerini oluşturuluyor...')

    // TÜMSİAD
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

    // MÜSİAD
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

    // ASKON
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

    console.log('✅ Competitor verileri oluşturuldu:')
    console.log(`   ${tumsiad.name} (${tumsiad.shortName})`)
    console.log(`   ${musiad.name} (${musiad.shortName})`)
    console.log(`   ${askon.name} (${askon.shortName})`)

    // Sosyal medya istatistikleri ekle
    console.log('\n📱 Sosyal medya istatistikleri ekleniyor...')

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

    // Dijital metrikler ekle
    console.log('\n💻 Dijital metrikler ekleniyor...')

    await prisma.digitalMetric.createMany({
      data: [
        {
          competitorId: tumsiad.id,
          seoScore: 72,
          pageSpeed: 78,
          mobileScore: 80,
          contentScore: 75,
          overallScore: 76,
        },
        {
          competitorId: musiad.id,
          seoScore: 85,
          pageSpeed: 88,
          mobileScore: 82,
          contentScore: 87,
          overallScore: 86,
        },
        {
          competitorId: askon.id,
          seoScore: 78,
          pageSpeed: 82,
          mobileScore: 79,
          contentScore: 73,
          overallScore: 78,
        }
      ]
    })

    console.log('\n🎉 Tüm veriler başarıyla oluşturuldu!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
