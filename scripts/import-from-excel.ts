import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 Excel dosyasından üyeler import ediliyor...')

  try {
    // Excel dosyasını oku
    const filePath = path.join(process.cwd(), 'FİRMA LİSTESİ LOGOLU.xlsx')
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Excel dosyası bulunamadı: ' + filePath)
    }

    console.log('📂 Dosya okunuyor:', filePath)
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log(`✅ ${data.length} satır okundu`)
    console.log('📋 İlk satır örneği:', JSON.stringify(data[0], null, 2))

    // Mevcut üyeleri temizle (opsiyonel)
    console.log('\n🗑️  Mevcut üyeler temizleniyor...')
    await prisma.member.deleteMany()

    let successCount = 0
    let errorCount = 0

    // Her satırı işle
    for (const row of data as any[]) {
      try {
        // Excel sütun isimlerini map et
        const fullName = row['FİRMA YETKİLİSİ'] || row['1. sütun'] || ''
        const nameParts = fullName.trim().split(' ')
        const firstName = nameParts[0] || 'Bilinmiyor'
        const lastName = nameParts.slice(1).join(' ') || ''

        // Email unique olmalı - duplicate varsa sayı ekle
        let email = row['MAİL'] || row['Email'] || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@tumsiad.org`
        email = email.trim().split(/\s+/)[0] // İlk email'i al (birden fazla varsa)
        
        // Telefon string'e çevir
        let phone = row['İRTİBAT TEL'] || row['Telefon'] || ''
        phone = phone.toString().trim()

        const member = {
          firstName,
          lastName,
          email: email || `uye${successCount + 1}@tumsiad.org`,
          phone,
          company: row['FİRMA'] || row['Firma'] || '',
          position: 'Yetkili',
          sector: row['SEKTÖRLER'] || row['Sektör'] || '',
          address: row['GENEL AÇIKLAMA'] || '',
          city: 'Denizli',
          district: 'Merkez',
          status: 'ACTIVE',
          membershipDate: new Date(),
        }

        // Boş kayıtları atla
        if (!member.firstName && !member.lastName && !member.company) {
          continue
        }

        await prisma.member.create({
          data: member
        })

        successCount++
        console.log(`✅ ${successCount}. üye eklendi: ${member.firstName} ${member.lastName} - ${member.company}`)

      } catch (error) {
        errorCount++
        console.error(`❌ Hata (satır ${successCount + errorCount}):`, error)
      }
    }

    console.log('\n✅ IMPORT TAMAMLANDI!')
    console.log(`📊 Özet:`)
    console.log(`   - Başarılı: ${successCount} üye`)
    console.log(`   - Hatalı: ${errorCount} satır`)
    console.log(`   - Toplam: ${data.length} satır`)

  } catch (error) {
    console.error('\n❌ Import hatası:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()

