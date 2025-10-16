import { PrismaClient } from '@prisma/client'

// Production PostgreSQL URL
const productionUrl = "postgres://edbe6ca7f456d817f6f39a9f96ae4dc0ea1e467e4468098762531fdf405b1d63:sk_PsAZDf4_0SN5i8yka45i9@db.prisma.io:5432/postgres?sslmode=require"

const prisma = new PrismaClient({
  datasourceUrl: productionUrl,
  __internal: {
    engine: {
      binaryTargets: ['native']
    }
  }
})

async function main() {
  try {
    console.log('🔧 Production database schema düzeltiliyor...')
    
    // 1. MemberStatus enum'unu oluştur (eğer yoksa)
    console.log('📋 MemberStatus enum kontrol ediliyor...')
    try {
      await prisma.$executeRaw`
        DO $$ BEGIN
          CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
      console.log('✅ MemberStatus enum hazır')
    } catch (error) {
      console.log('ℹ️ MemberStatus enum zaten mevcut')
    }
    
    // 2. Member tablosunda status alanını enum olarak güncelle
    console.log('🔄 Member.status alanı güncelleniyor...')
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Member" 
        ALTER COLUMN "status" TYPE "MemberStatus" 
        USING "status"::"MemberStatus";
      `
      console.log('✅ Member.status alanı enum olarak güncellendi')
    } catch (error) {
      console.log('⚠️ Status alanı güncellenirken hata:', error.message)
    }
    
    // 3. Notes alanını ekle (eğer yoksa)
    console.log('📝 Notes alanı kontrol ediliyor...')
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Member" 
        ADD COLUMN IF NOT EXISTS "notes" TEXT;
      `
      console.log('✅ Notes alanı eklendi (eğer yoksa)')
    } catch (error) {
      console.log('ℹ️ Notes alanı zaten mevcut')
    }
    
    // 4. Test: Yeni üye ekleme testi
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
    }
    
    // 5. Mevcut üye sayısını kontrol et
    const memberCount = await prisma.member.count()
    console.log(`📊 Mevcut üye sayısı: ${memberCount}`)
    
    console.log('🎉 Production schema düzeltme tamamlandı!')
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
