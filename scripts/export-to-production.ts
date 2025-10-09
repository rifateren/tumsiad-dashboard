import { PrismaClient } from '@prisma/client'

// Local database (SQLite)
const localPrisma = new PrismaClient({
  datasourceUrl: 'file:./dev.db'
})

// Production database (PostgreSQL)
const productionPrisma = new PrismaClient({
  datasourceUrl: process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL
})

async function main() {
  console.log('🔄 Local database verilerini production\'a export ediliyor...')

  try {
    // 1. Local'den verileri çek
    console.log('📥 Local database\'den veriler okunuyor...')
    const [localCompetitors, localMembers, localEvents] = await Promise.all([
      localPrisma.competitor.findMany({
        include: {
          digitalMetrics: true,
          socialMediaStats: true,
          eventCounts: true
        }
      }),
      localPrisma.member.findMany(),
      localPrisma.event.findMany()
    ])

    console.log(`✅ Local'den okundu:`)
    console.log(`   - ${localCompetitors.length} Competitor`)
    console.log(`   - ${localMembers.length} Member`)
    console.log(`   - ${localEvents.length} Event`)

    // 2. Production'ı temizle
    console.log('\n🗑️  Production database temizleniyor...')
    await productionPrisma.competitorEventCount.deleteMany()
    await productionPrisma.socialMediaStat.deleteMany()
    await productionPrisma.digitalMetric.deleteMany()
    await productionPrisma.competitor.deleteMany()
    await productionPrisma.eventParticipant.deleteMany()
    await productionPrisma.event.deleteMany()
    await productionPrisma.member.deleteMany()

    // 3. Competitors'ı ekle
    console.log('\n📊 Competitors ekleniyor...')
    for (const competitor of localCompetitors) {
      const newCompetitor = await productionPrisma.competitor.create({
        data: {
          name: competitor.name,
          shortName: competitor.shortName,
          website: competitor.website,
          description: competitor.description,
        }
      })

      // Digital Metrics ekle
      for (const metric of competitor.digitalMetrics) {
        await productionPrisma.digitalMetric.create({
          data: {
            competitorId: newCompetitor.id,
            seoScore: metric.seoScore,
            pageSpeed: metric.pageSpeed,
            mobileScore: metric.mobileScore,
            contentScore: metric.contentScore,
            overallScore: metric.overallScore,
            date: metric.date,
          }
        })
      }

      // Social Media Stats ekle
      for (const stat of competitor.socialMediaStats) {
        await productionPrisma.socialMediaStat.create({
          data: {
            competitorId: newCompetitor.id,
            platform: stat.platform,
            followers: stat.followers,
            engagement: stat.engagement,
            posts: stat.posts,
            date: stat.date,
          }
        })
      }

      // Event Counts ekle
      for (const eventCount of competitor.eventCounts) {
        await productionPrisma.competitorEventCount.create({
          data: {
            competitorId: newCompetitor.id,
            month: eventCount.month,
            eventCount: eventCount.eventCount,
          }
        })
      }

      console.log(`   ✅ ${competitor.name} eklendi`)
    }

    // 4. Members ekle
    console.log('\n👥 Members ekleniyor...')
    for (const member of localMembers) {
      await productionPrisma.member.create({
        data: {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          company: member.company,
          position: member.position,
          sector: member.sector,
          address: member.address,
          city: member.city,
          district: member.district,
          birthDate: member.birthDate,
          experience: member.experience,
          status: member.status,
          membershipDate: member.membershipDate,
        }
      })
    }
    console.log(`   ✅ ${localMembers.length} member eklendi`)

    // 5. Events ekle
    console.log('\n📅 Events ekleniyor...')
    for (const event of localEvents) {
      await productionPrisma.event.create({
        data: {
          title: event.title,
          description: event.description,
          type: event.type,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          address: event.address,
          city: event.city,
          capacity: event.capacity,
          cost: event.cost,
          status: event.status,
        }
      })
    }
    console.log(`   ✅ ${localEvents.length} event eklendi`)

    console.log('\n✅ TÜM VERİLER BAŞARIYLA PRODUCTION\'A EXPORT EDİLDİ!')
    console.log('\n📊 Özet:')
    console.log(`   - ${localCompetitors.length} Competitor (+ metrikleri)`)
    console.log(`   - ${localMembers.length} Member`)
    console.log(`   - ${localEvents.length} Event`)

  } catch (error) {
    console.error('\n❌ Export hatası:', error)
    throw error
  } finally {
    await localPrisma.$disconnect()
    await productionPrisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

