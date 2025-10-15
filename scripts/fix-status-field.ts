import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Status alanı düzeltiliyor...')
    
    // Tüm üyeleri al ve status'larını kontrol et
    const members = await prisma.member.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true
      }
    })
    
    console.log(`📊 ${members.length} üye bulundu`)
    
    // Status değerlerini kontrol et ve düzelt
    for (const member of members) {
      let newStatus = member.status
      
      // Status değerini normalize et
      if (typeof member.status === 'string') {
        const status = member.status.toUpperCase()
        if (['ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED'].includes(status)) {
          newStatus = status
        } else {
          newStatus = 'ACTIVE' // Default
        }
      } else {
        newStatus = 'ACTIVE' // Default
      }
      
      // Eğer farklıysa güncelle
      if (newStatus !== member.status) {
        console.log(`   🔄 ${member.firstName} ${member.lastName}: ${member.status} -> ${newStatus}`)
        await prisma.member.update({
          where: { id: member.id },
          data: { status: newStatus }
        })
      }
    }
    
    console.log('✅ Status alanları düzeltildi!')
    
    // Test query
    const testMembers = await prisma.member.findMany({
      take: 3,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true
      }
    })
    
    console.log('\n📋 Test sonucu:')
    testMembers.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.firstName} ${member.lastName} - ${member.status}`)
    })
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
