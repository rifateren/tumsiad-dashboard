import { PrismaClient } from '@prisma/client'

const productionUrl = "postgresql://postgres.mvqkqjqkqjqkqjqk:Vercel123!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"

const prisma = new PrismaClient({
  datasourceUrl: productionUrl
})

async function main() {
  try {
    console.log('📱 Production database\'e sosyal medya verileri ekleniyor...')
    
    // Competitor'ları bul
    const competitors = await prisma.competitor.findMany()
    console.log(`📊 ${competitors.length} competitor bulundu`)

    for (const comp of competitors) {
      console.log(`\n🏢 ${comp.name} (${comp.shortName}):`)
      
      // Mevcut sosyal medya verilerini kontrol et
      const existingStats = await prisma.socialMediaStat.findMany({
        where: { competitorId: comp.id }
      })
      
      if (existingStats.length > 0) {
        console.log(`   ✅ ${existingStats.length} sosyal medya kaydı zaten mevcut`)
        continue
      }

      // Sosyal medya verilerini ekle
      let socialData = []
      
      if (comp.shortName === 'TÜMSİAD') {
        socialData = [
          {
            competitorId: comp.id,
            platform: 'INSTAGRAM',
            followers: 2800,
            posts: 45,
            engagement: 4.2,
          },
          {
            competitorId: comp.id,
            platform: 'FACEBOOK',
            followers: 3200,
            posts: 38,
            engagement: 3.8,
          },
          {
            competitorId: comp.id,
            platform: 'TWITTER',
            followers: 1500,
            posts: 25,
            engagement: 2.5,
          }
        ]
      } else if (comp.shortName === 'MÜSİAD') {
        socialData = [
          {
            competitorId: comp.id,
            platform: 'INSTAGRAM',
            followers: 8650,
            posts: 120,
            engagement: 5.2,
          },
          {
            competitorId: comp.id,
            platform: 'FACEBOOK',
            followers: 12400,
            posts: 95,
            engagement: 4.8,
          },
          {
            competitorId: comp.id,
            platform: 'TWITTER',
            followers: 5700,
            posts: 78,
            engagement: 3.2,
          }
        ]
      } else if (comp.shortName === 'ASKON') {
        socialData = [
          {
            competitorId: comp.id,
            platform: 'INSTAGRAM',
            followers: 1367,
            posts: 35,
            engagement: 3.5,
          },
          {
            competitorId: comp.id,
            platform: 'FACEBOOK',
            followers: 4800,
            posts: 42,
            engagement: 4.1,
          },
          {
            competitorId: comp.id,
            platform: 'TWITTER',
            followers: 2200,
            posts: 28,
            engagement: 2.8,
          }
        ]
      }

      if (socialData.length > 0) {
        await prisma.socialMediaStat.createMany({
          data: socialData
        })
        console.log(`   ✅ ${socialData.length} sosyal medya kaydı eklendi`)
      }
    }

    // Dijital metrikleri ekle
    console.log('\n💻 Dijital metrikler ekleniyor...')
    
    for (const comp of competitors) {
      const existingMetrics = await prisma.digitalMetric.findMany({
        where: { competitorId: comp.id }
      })
      
      if (existingMetrics.length > 0) {
        console.log(`   ✅ ${comp.shortName} dijital metrikleri zaten mevcut`)
        continue
      }

      let digitalData = []
      
      if (comp.shortName === 'TÜMSİAD') {
        digitalData = [
          {
            competitorId: comp.id,
            seoScore: 75,
            pageSpeed: 85,
            mobileScore: 80,
            contentScore: 70,
            overallScore: 77.5,
          }
        ]
      } else if (comp.shortName === 'MÜSİAD') {
        digitalData = [
          {
            competitorId: comp.id,
            seoScore: 88,
            pageSpeed: 92,
            mobileScore: 90,
            contentScore: 85,
            overallScore: 88.75,
          }
        ]
      } else if (comp.shortName === 'ASKON') {
        digitalData = [
          {
            competitorId: comp.id,
            seoScore: 82,
            pageSpeed: 78,
            mobileScore: 85,
            contentScore: 80,
            overallScore: 81.25,
          }
        ]
      }

      if (digitalData.length > 0) {
        await prisma.digitalMetric.createMany({
          data: digitalData
        })
        console.log(`   ✅ ${comp.shortName} dijital metrikleri eklendi`)
      }
    }

    console.log('\n🎉 Tüm veriler başarıyla production database\'e eklendi!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
