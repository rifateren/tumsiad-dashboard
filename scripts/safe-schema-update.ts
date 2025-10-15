import { PrismaClient } from '@prisma/client'

// Prisma Postgres URL'i
const productionUrl = "postgres://edbe6ca7f456d817f6f39a9f96ae4dc0ea1e467e4468098762531fdf405b1d63:sk_PsAZDf4_0SN5i8yka45i9@db.prisma.io:5432/postgres?sslmode=require"

const prisma = new PrismaClient({
  datasourceUrl: productionUrl
})

async function main() {
  try {
    console.log('🔍 Production database schema kontrolü başlıyor...')
    
    // Mevcut tabloları kontrol et
    console.log('\n📊 Mevcut veriler:')
    
    const competitorCount = await prisma.competitor.count()
    const socialMediaCount = await prisma.socialMediaStat.count()
    const digitalMetricCount = await prisma.digitalMetric.count()
    const memberCount = await prisma.member.count()
    
    console.log(`   - ${competitorCount} Competitor`)
    console.log(`   - ${socialMediaCount} Sosyal Medya Kaydı`)
    console.log(`   - ${digitalMetricCount} Dijital Metrik`)
    console.log(`   - ${memberCount} Üye`)
    
    // Member tablosunda notes alanı var mı kontrol et
    console.log('\n🔍 Member tablosu alanları kontrol ediliyor...')
    
    try {
      // Test query - notes alanı varsa çalışır
      await prisma.member.findFirst({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          notes: true
        }
      })
      console.log('   ✅ Member tablosunda notes alanı mevcut')
    } catch (error: any) {
      if (error.message.includes('notes')) {
        console.log('   ❌ Member tablosunda notes alanı eksik')
        console.log('   📝 Bu alan eklenmesi gerekiyor')
      } else {
        console.log('   ⚠️ Beklenmeyen hata:', error.message)
      }
    }
    
    // Eksik alanları ekle (güvenli şekilde)
    console.log('\n🛠️ Eksik alanları ekleme işlemi...')
    
    // SQL ile notes alanını ekle (eğer yoksa)
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Member" 
        ADD COLUMN IF NOT EXISTS "notes" TEXT;
      `
      console.log('   ✅ Member.notes alanı eklendi (eğer yoksa)')
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('   ℹ️ Member.notes alanı zaten mevcut')
      } else {
        console.log('   ⚠️ Notes alanı eklenirken hata:', error.message)
      }
    }
    
    console.log('\n🎉 Güvenli schema güncelleme tamamlandı!')
    console.log('\n📊 Güncel veri durumu:')
    
    const finalCompetitorCount = await prisma.competitor.count()
    const finalSocialMediaCount = await prisma.socialMediaStat.count()
    const finalDigitalMetricCount = await prisma.digitalMetric.count()
    const finalMemberCount = await prisma.member.count()
    
    console.log(`   - ${finalCompetitorCount} Competitor`)
    console.log(`   - ${finalSocialMediaCount} Sosyal Medya Kaydı`)
    console.log(`   - ${finalDigitalMetricCount} Dijital Metrik`)
    console.log(`   - ${finalMemberCount} Üye`)

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
