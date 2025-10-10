import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Standart sektör listesi
const STANDARD_SECTORS = [
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

// Sektör eşleştirme haritası
const SECTOR_MAPPING: { [key: string]: string } = {
  'İNŞAAT': 'İNŞAAT',
  'SANAYİ': 'SANAYİ',
  'ELEKTRİK - ELEKTRONİK': 'ELEKTRİK - ELEKTRONİK',
  'HİZMET': 'HİZMET',
  'İMALAT': 'İMALAT',
  'OTOMOTİV': 'OTOMOTİV',
  'TEKSTİL': 'TEKSTİL',
  'GIDA': 'GIDA',
  'ENERJİ': 'ENERJİ',
  'ENDÜSTRİYEL SANAYİ - ENERJİ': 'ENERJİ',
  'DÜĞÜN DAVET - OTOMOTİV': 'OTOMOTİV',
  'HİZMET - GAYRİMENKUL': 'HİZMET - GAYRIMENKUL',
  'TELEKOMİNİKASYON': 'TELEKOMÜNİKASYON',
  'ENDÜSTRİYEL SANAYİ': 'ENDÜSTRİYEL SANAYİ',
  'MOBİLYA': 'MOBİLYA',
  'GERİ DÖNÜŞÜM': 'GERİ DÖNÜŞÜM',
  'TEK SEKTÖR': 'TEK SEKTÖR',
  'GİYİM': 'GİYİM',
  'TİCARET': 'TİCARET',
  'ÜRETİM': 'İMALAT',
  'YEMEK': 'YEMEK'
}

async function main() {
  console.log('🔄 Sektörler standartlaştırılıyor...')

  try {
    const members = await prisma.member.findMany()

    let updatedCount = 0

    for (const member of members) {
      if (member.sector && member.sector.trim() !== '') {
        const currentSector = member.sector.trim()
        const standardSector = SECTOR_MAPPING[currentSector] || currentSector

        if (currentSector !== standardSector) {
          await prisma.member.update({
            where: { id: member.id },
            data: { sector: standardSector }
          })
          console.log(`✅ ${member.firstName} ${member.lastName}: "${currentSector}" → "${standardSector}"`)
          updatedCount++
        }
      } else {
        // Sektör bilgisi olmayan üyelere varsayılan sektör ata
        await prisma.member.update({
          where: { id: member.id },
          data: { sector: 'HİZMET' }
        })
        console.log(`➕ ${member.firstName} ${member.lastName}: Sektör bilgisi eklendi (HİZMET)`)
        updatedCount++
      }
    }

    console.log(`\n🎉 ${updatedCount} üyenin sektör bilgisi güncellendi!`)

    // Güncellenmiş sektör dağılımını göster
    const updatedMembers = await prisma.member.findMany({
      select: { sector: true }
    })

    const sectorGroups: { [key: string]: number } = {}
    updatedMembers.forEach(member => {
      if (member.sector) {
        sectorGroups[member.sector] = (sectorGroups[member.sector] || 0) + 1
      }
    })

    console.log('\n📊 Güncellenmiş Sektör Dağılımı:')
    Object.entries(sectorGroups)
      .sort(([,a], [,b]) => b - a)
      .forEach(([sector, count]) => {
        console.log(`  ${sector}: ${count} üye`)
      })

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
