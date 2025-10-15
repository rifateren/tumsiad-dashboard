import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Database bağlantısı test ediliyor...')
    
    // Basit bir query test et
    const memberCount = await prisma.member.count()
    console.log(`✅ Database bağlantısı başarılı!`)
    console.log(`📊 Toplam üye sayısı: ${memberCount}`)
    
    // İlk 5 üyeyi getir
    const members = await prisma.member.findMany({
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        membershipDate: true
      }
    })
    
    console.log('\n📋 İlk 5 üye:')
    members.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.firstName} ${member.lastName} (${member.email}) - ${member.status}`)
    })
    
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
