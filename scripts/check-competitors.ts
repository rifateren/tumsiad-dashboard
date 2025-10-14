import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Competitor verilerini kontrol ediliyor...')
    
    const competitors = await prisma.competitor.findMany()
    
    console.log(`📊 Toplam ${competitors.length} competitor bulundu:`)
    
    competitors.forEach((comp, index) => {
      console.log(`${index + 1}. ${comp.name} (${comp.shortName})`)
      console.log(`   ID: ${comp.id}`)
      console.log(`   Created: ${comp.createdAt}`)
      console.log('')
    })

    // ASKON özel kontrol
    const askon = await prisma.competitor.findFirst({
      where: {
        OR: [
          { shortName: 'ASKON' },
          { shortName: 'askon' },
          { name: { contains: 'ASKON' } }
        ]
      }
    })

    if (askon) {
      console.log('✅ ASKON bulundu:')
      console.log(`   Name: ${askon.name}`)
      console.log(`   Short Name: ${askon.shortName}`)
      console.log(`   ID: ${askon.id}`)
    } else {
      console.log('❌ ASKON bulunamadı!')
    }

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
