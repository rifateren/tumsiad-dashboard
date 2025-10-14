import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📅 Üye tarihlerini çeşitlendiriliyor...')

  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📊 ${members.length} üye bulundu`)

    // Her üyeye farklı tarih ata (son 6 aya yay)
    const months = [
      '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10'
    ]

    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      const monthIndex = Math.floor(Math.random() * months.length)
      const day = Math.floor(Math.random() * 28) + 1
      const newDate = new Date(`${months[monthIndex]}-${day.toString().padStart(2, '0')}T10:00:00.000Z`)

      await prisma.member.update({
        where: { id: member.id },
        data: { 
          membershipDate: newDate,
          createdAt: newDate
        }
      })

      console.log(`✅ ${member.firstName} ${member.lastName}: ${newDate.toISOString().slice(0, 10)}`)
    }

    console.log('\n🎉 Tüm üye tarihleri güncellendi!')

    // Yeni dağılımı göster
    const monthlyStats = await prisma.member.groupBy({
      by: ['membershipDate'],
      _count: true,
      where: {
        membershipDate: {
          gte: new Date('2024-05-01')
        }
      },
      orderBy: {
        membershipDate: 'asc'
      }
    })

    console.log('\n📊 Yeni Aylık Dağılım:')
    monthlyStats.forEach(stat => {
      const month = stat.membershipDate.toISOString().slice(0, 7)
      console.log(`  ${month}: ${stat._count} üye`)
    })

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
