import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Raw SQL ile status alanı düzeltiliyor...')
    
    // Önce mevcut status değerlerini kontrol et
    const statusCheck = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count 
      FROM "Member" 
      GROUP BY status
    `
    
    console.log('📊 Mevcut status değerleri:')
    console.log(statusCheck)
    
    // Status alanını string olarak güncelle
    await prisma.$executeRaw`
      UPDATE "Member" 
      SET status = CASE 
        WHEN status::text = 'ACTIVE' THEN 'ACTIVE'
        WHEN status::text = 'INACTIVE' THEN 'INACTIVE' 
        WHEN status::text = 'SUSPENDED' THEN 'SUSPENDED'
        WHEN status::text = 'RESIGNED' THEN 'RESIGNED'
        ELSE 'ACTIVE'
      END
    `
    
    console.log('✅ Status alanları güncellendi!')
    
    // Tekrar kontrol et
    const statusCheckAfter = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count 
      FROM "Member" 
      GROUP BY status
    `
    
    console.log('\n📊 Güncelleme sonrası:')
    console.log(statusCheckAfter)
    
    // Test query
    const testCount = await prisma.member.count()
    console.log(`\n✅ Test başarılı! Toplam üye sayısı: ${testCount}`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
