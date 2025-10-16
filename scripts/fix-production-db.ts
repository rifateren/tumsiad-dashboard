import { PrismaClient } from '@prisma/client'

// Production PostgreSQL URL
const productionUrl = "postgres://edbe6ca7f456d817f6f39a9f96ae4dc0ea1e467e4468098762531fdf405b1d63:sk_PsAZDf4_0SN5i8yka45i9@db.prisma.io:5432/postgres?sslmode=require"

const prisma = new PrismaClient({
  datasourceUrl: productionUrl
})

async function main() {
  try {
    console.log('🔧 Production database düzeltiliyor...')
    
    // 1. Mevcut üye sayısını kontrol et
    const memberCount = await prisma.member.count()
    console.log(`📊 Mevcut üye sayısı: ${memberCount}`)
    
    // 2. Test: Yeni üye ekleme testi
    console.log('🧪 Yeni üye ekleme testi...')
    try {
      const testMember = await prisma.member.create({
        data: {
          firstName: 'Test',
          lastName: 'Üye',
          email: `test-${Date.now()}@example.com`,
          phone: '0532 000 0000',
          company: 'Test Şirket',
          position: 'Test Pozisyon',
          sector: 'TEST',
          city: 'Denizli',
          district: 'Pamukkale',
          experience: 5,
          notes: 'Test notu',
          status: 'ACTIVE'
        }
      })
      
      console.log('✅ Test üye başarıyla eklendi:', testMember.id)
      
      // Test üyeyi sil
      await prisma.member.delete({
        where: { id: testMember.id }
      })
      console.log('🗑️ Test üye temizlendi')
      
    } catch (error) {
      console.error('❌ Test üye ekleme hatası:', error)
      
      // Hata detaylarını göster
      if (error.message.includes('MemberStatus')) {
        console.log('🔧 MemberStatus enum sorunu tespit edildi')
        console.log('💡 Bu sorun production deployment ile çözülecek')
      }
    }
    
    // 3. Competitor verilerini kontrol et
    const competitorCount = await prisma.competitor.count()
    console.log(`🏢 Competitor sayısı: ${competitorCount}`)
    
    // 4. Social media stats kontrol et
    const socialMediaCount = await prisma.socialMediaStat.count()
    console.log(`📱 Sosyal medya kayıt sayısı: ${socialMediaCount}`)
    
    console.log('🎉 Production database kontrolü tamamlandı!')
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
