import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 Sektör analizi yapılıyor...')

  try {
    const members = await prisma.member.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        sector: true
      }
    })

    console.log(`\n📋 Toplam ${members.length} üye bulundu`)

    // Sektörleri grupla
    const sectorGroups: { [key: string]: number } = {}
    const membersWithoutSector: any[] = []

    members.forEach(member => {
      if (!member.sector || member.sector.trim() === '') {
        membersWithoutSector.push(member)
      } else {
        const sector = member.sector.trim()
        sectorGroups[sector] = (sectorGroups[sector] || 0) + 1
      }
    })

    console.log('\n🏭 Sektör Dağılımı:')
    Object.entries(sectorGroups)
      .sort(([,a], [,b]) => b - a)
      .forEach(([sector, count]) => {
        console.log(`  ${sector}: ${count} üye`)
      })

    console.log(`\n❌ Sektör bilgisi olmayan üyeler (${membersWithoutSector.length}):`)
    membersWithoutSector.forEach(member => {
      console.log(`  - ${member.firstName} ${member.lastName}`)
    })

    // Standart sektör listesi öner
    const allSectors = Object.keys(sectorGroups)
    const standardSectors = [
      'ENERJİ',
      'İNŞAAT', 
      'SANAYİ',
      'ELEKTRİK - ELEKTRONİK',
      'OTOMOTİV',
      'TEKSTİL',
      'GIDA',
      'HİZMET',
      'ENDÜSTRİYEL SANAYİ',
      'TELEKOMÜNİKASYON',
      'MOBİLYA',
      'YEMEK',
      'ÖĞRETİM',
      'TİCARET',
      'İMALAT',
      'GİYİM',
      'HİZMET - GAYRIMENKUL',
      'TEK SEKTÖR',
      'GERİ DÖNÜŞÜM',
      'DÜĞÜN DAVET'
    ]

    console.log('\n🎯 Önerilen Standart Sektör Listesi:')
    standardSectors.forEach(sector => {
      console.log(`  - ${sector}`)
    })

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
