import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Sosyal medya verilerini kontrol ediliyor...')
    
    // Tüm competitor'ları listele
    const competitors = await prisma.competitor.findMany()
    console.log(`📊 ${competitors.length} competitor bulundu:`)
    
    for (const comp of competitors) {
      console.log(`\n🏢 ${comp.name} (${comp.shortName}):`)
      
      // Sosyal medya verilerini getir
      const socialStats = await prisma.socialMediaStat.findMany({
        where: { competitorId: comp.id },
        orderBy: { date: 'desc' }
      })
      
      console.log(`   📱 ${socialStats.length} sosyal medya kaydı:`)
      
      socialStats.forEach(stat => {
        console.log(`      ${stat.platform}: ${stat.followers} takipçi, ${stat.posts} post, %${stat.engagement} etkileşim`)
      })
    }

    // ASKON özel kontrol
    const askon = await prisma.competitor.findFirst({
      where: { shortName: 'ASKON' }
    })

    if (askon) {
      console.log(`\n🔍 ASKON Detayları:`)
      console.log(`   ID: ${askon.id}`)
      
      const askonStats = await prisma.socialMediaStat.findMany({
        where: { competitorId: askon.id },
        orderBy: { date: 'desc' }
      })
      
      console.log(`   📊 ${askonStats.length} sosyal medya kaydı:`)
      askonStats.forEach(stat => {
        console.log(`      ${stat.platform}: ${stat.followers} takipçi (${stat.date.toISOString()})`)
      })
    }

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
