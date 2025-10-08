'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadarChart } from '@/components/charts/radar-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { LineChart } from '@/components/charts/line-chart'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ChatWidget } from '@/components/ai-chat/chat-widget'

interface CompetitorData {
  name: string
  shortName: string
  digitalScore: number
  seoScore: number
  pageSpeed: number
  mobileScore: number
  contentScore: number
  socialMedia: {
    avgFollowers: number
    avgEngagement: number
    platforms: any
  }
}

// Default fallback data
const defaultRadarData = [
  { category: 'Dijital Varlık', tumsiad: 70, musiad: 81, askon: 75 },
  { category: 'Üye Sayısı', tumsiad: 39, musiad: 100, askon: 48 },
  { category: 'Etkinlik Sıklığı', tumsiad: 78, musiad: 75, askon: 72 },
  { category: 'Medya Görünürlüğü', tumsiad: 60, musiad: 88, askon: 65 },
  { category: 'Bölgesel Yayılım', tumsiad: 55, musiad: 80, askon: 60 },
  { category: 'Sosyal Medya', tumsiad: 47, musiad: 88, askon: 60 },
]

const defaultSocialMediaComparison = [
  { platform: 'Twitter', tumsiad: 1200, musiad: 4200, askon: 1800 },
  { platform: 'Instagram', tumsiad: 2500, musiad: 8500, askon: 3500 },
  { platform: 'Facebook', tumsiad: 3200, musiad: 12000, askon: 4800 },
]

// Default fallback - API'den çekilecek
const defaultEventFrequency = [
  { month: 'Mayıs', tumsiad: 5, musiad: 9, askon: 7 },
  { month: 'Haziran', tumsiad: 7, musiad: 8, askon: 6 },
  { month: 'Temmuz', tumsiad: 6, musiad: 7, askon: 5 },
  { month: 'Ağustos', tumsiad: 4, musiad: 6, askon: 4 },
  { month: 'Eylül', tumsiad: 5, musiad: 8, askon: 6 },
  { month: 'Ekim', tumsiad: 3, musiad: 7, askon: 5 },
]

const swotAnalysis = {
  strengths: [
    'Güçlü yerel bağlantılar ve ağ',
    'Denizli\'de köklü organizasyon yapısı',
    'Etkinlik çeşitliliği',
    'Aktif üye katılımı',
  ],
  weaknesses: [
    'Dijital varlık geliştirilmeli',
    'Sosyal medya etkileşimi düşük',
    'Ulusal medya görünürlüğü sınırlı',
    'Genç üye sayısı artırılmalı',
  ],
  opportunities: [
    'Dijital dönüşüm projeleri',
    'Genç girişimci programları',
    'Sosyal medya kampanyaları',
    'Online etkinlik formatları',
    'Bölgesel şube işbirlikleri',
  ],
  threats: [
    'Rakip STK\'ların dijital üstünlüğü',
    'Genç nesil üye çekmede zorluk',
    'Medya değişim trendleri',
    'Ekonomik belirsizlikler',
  ],
}

export default function CompetitiveAnalysisPage() {
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([])
  const [loading, setLoading] = useState(true)
  const [radarData, setRadarData] = useState(defaultRadarData)
  const [socialMediaComparison, setSocialMediaComparison] = useState(defaultSocialMediaComparison)
  const [eventFrequency, setEventFrequency] = useState(defaultEventFrequency)

  useEffect(() => {
    async function fetchData() {
      try {
        // Competitor comparison
        const response = await fetch('/api/competitors/comparison')
        if (response.ok) {
          const data = await response.json()
          setCompetitorData(data)
          
          // Verileri organize et
          const tumsiad = data.find((c: CompetitorData) => c.shortName === 'TÜMSİAD')
          const musiad = data.find((c: CompetitorData) => c.shortName === 'MÜSİAD')
          const askon = data.find((c: CompetitorData) => c.shortName === 'ASKON')

          if (tumsiad && musiad && askon) {
            // Radar chart verilerini güncelle
            const memberScores = {
              tumsiad: (78 / 200) * 100, // 78 üye / max 200
              musiad: 100, // 200+ üye = max
              askon: (95 / 200) * 100, // 95 üye / max 200
            }

            const socialMediaScores = {
              tumsiad: (tumsiad.socialMedia.avgFollowers / 12000) * 100,
              musiad: (musiad.socialMedia.avgFollowers / 12000) * 100,
              askon: (askon.socialMedia.avgFollowers / 12000) * 100,
            }

            setRadarData([
              { 
                category: 'Dijital Varlık', 
                tumsiad: Math.round(tumsiad.digitalScore), 
                musiad: Math.round(musiad.digitalScore), 
                askon: Math.round(askon.digitalScore) 
              },
              { 
                category: 'Üye Sayısı', 
                tumsiad: Math.round(memberScores.tumsiad), 
                musiad: Math.round(memberScores.musiad), 
                askon: Math.round(memberScores.askon) 
              },
              { category: 'Etkinlik Sıklığı', tumsiad: 78, musiad: 75, askon: 72 },
              { category: 'Medya Görünürlüğü', tumsiad: 60, musiad: 88, askon: 65 },
              { category: 'Bölgesel Yayılım', tumsiad: 55, musiad: 80, askon: 60 },
              { 
                category: 'Sosyal Medya', 
                tumsiad: Math.round(socialMediaScores.tumsiad), 
                musiad: Math.round(socialMediaScores.musiad), 
                askon: Math.round(socialMediaScores.askon) 
              },
            ])

            // Sosyal medya karşılaştırma verilerini güncelle (Sadece 3 platform)
            const platforms = ['TWITTER', 'INSTAGRAM', 'FACEBOOK']
            const platformNames: Record<string, string> = {
              'TWITTER': 'Twitter',
              'INSTAGRAM': 'Instagram',
              'FACEBOOK': 'Facebook',
            }

            const socialComparison = platforms.map(platform => {
              const tumPlatform = tumsiad.socialMedia.platforms[platform.toLowerCase()]
              const musPlatform = musiad.socialMedia.platforms[platform.toLowerCase()]
              const askPlatform = askon.socialMedia.platforms[platform.toLowerCase()]

              return {
                platform: platformNames[platform],
                tumsiad: tumPlatform?.followers || 0,
                musiad: musPlatform?.followers || 0,
                askon: askPlatform?.followers || 0,
              }
            }).filter(item => item.tumsiad > 0 || item.musiad > 0 || item.askon > 0)

            setSocialMediaComparison(socialComparison)
          }
        }

        // Event frequency verilerini de çek
        const eventResponse = await fetch('/api/analytics/event-frequency')
        if (eventResponse.ok) {
          const eventData = await eventResponse.json()
          setEventFrequency(eventData)
        }

      } catch (error) {
        console.error('Veri yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Skorları hesapla
  const tumsiadData = competitorData.find(c => c.shortName === 'TÜMSİAD')
  const musiadData = competitorData.find(c => c.shortName === 'MÜSİAD')
  const askonData = competitorData.find(c => c.shortName === 'ASKON')

  return (
    <div className="space-y-6">
      {/* AI Chat Widget */}
      <ChatWidget pageContext="analiz" />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Karşılaştırmalı STK Analizi</h1>
        <p className="text-muted-foreground mt-2">
          TÜMSİAD, MÜSİAD ve ASKON performans karşılaştırması (Güncel Veriler)
        </p>
        <Badge variant="outline" className="mt-2">
          <TrendingUp className="h-3 w-3 mr-1" />
          AI Asistan ile güncellenebilir
        </Badge>
      </div>

      {/* Overall Scores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              TÜMSİAD
            </CardTitle>
            <CardDescription>Denizli Şubesi (78 üye)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{tumsiadData?.digitalScore.toFixed(1) || '70'}</span>
                <Badge variant="outline">Dijital Skor</Badge>
              </div>
              <Progress value={tumsiadData?.digitalScore || 70} className="h-2" />
              <p className="text-sm text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                SEO: {tumsiadData?.seoScore || 68}, Hız: {tumsiadData?.pageSpeed || 72}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              MÜSİAD
            </CardTitle>
            <CardDescription>Denizli (200+ üye)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{musiadData?.digitalScore.toFixed(1) || '81'}</span>
                <Badge variant="outline">Dijital Skor</Badge>
              </div>
              <Progress value={musiadData?.digitalScore || 81} className="h-2" />
              <p className="text-sm text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                SEO: {musiadData?.seoScore || 82}, Hız: {musiadData?.pageSpeed || 78}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              ASKON
            </CardTitle>
            <CardDescription>Denizli (~95 üye)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{askonData?.digitalScore.toFixed(1) || '75'}</span>
                <Badge variant="outline">Dijital Skor</Badge>
              </div>
              <Progress value={askonData?.digitalScore || 75} className="h-2" />
              <p className="text-sm text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                SEO: {askonData?.seoScore || 75}, Hız: {askonData?.pageSpeed || 73}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <RadarChart
        title="Genel Performans Karşılaştırması"
        description="Altı temel kategoride STK performans analizi"
        data={radarData}
      />

      {/* Social Media & Events Comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        <BarChart
          title="Sosyal Medya Takipçi Karşılaştırması"
          description="Platform bazlı takipçi sayıları"
          data={socialMediaComparison}
          dataKey="tumsiad"
          xAxisKey="platform"
          bars={[
            { key: 'tumsiad', name: 'TÜMSİAD', color: 'hsl(var(--primary))' },
            { key: 'musiad', name: 'MÜSİAD', color: '#10b981' },
            { key: 'askon', name: 'ASKON', color: '#f59e0b' },
          ]}
        />

        <div className="space-y-2">
          <LineChart
            title="Aylık Etkinlik Sıklığı"
            description="Son 6 aylık etkinlik sayısı karşılaştırması"
            data={eventFrequency}
            dataKey="tumsiad"
            xAxisKey="month"
            lines={[
              { key: 'tumsiad', name: 'TÜMSİAD', color: 'hsl(var(--primary))' },
              { key: 'musiad', name: 'MÜSİAD', color: '#10b981' },
              { key: 'askon', name: 'ASKON', color: '#f59e0b' },
            ]}
          />
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border-l-4 border-blue-500">
            📊 <strong>Veri Kaynağı:</strong><br/>
            • <strong>TÜMSİAD:</strong> Database'den gerçek etkinlik sayıları (otomatik)<br/>
            • <strong>MÜSİAD & ASKON:</strong> Manuel güncelleme gerekebilir<br/><br/>
            💡 <strong>Güncelleme:</strong> AI Chat'ten şöyle yazın: "MÜSİAD Haziran 8 etkinlik"
          </div>
        </div>
      </div>

      {/* SWOT Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>SWOT Analizi</CardTitle>
          <CardDescription>TÜMSİAD Denizli güçlü ve zayıf yönler, fırsatlar ve tehditler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Güçlü Yönler
              </h4>
              <ul className="space-y-2">
                {swotAnalysis.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="space-y-2">
              <h4 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Zayıf Yönler
              </h4>
              <ul className="space-y-2">
                {swotAnalysis.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Fırsatlar
              </h4>
              <ul className="space-y-2">
                {swotAnalysis.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Tehditler
              </h4>
              <ul className="space-y-2">
                {swotAnalysis.threats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-600 mt-0.5">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights - Gerçek Verilere Dayalı */}
      <Card>
        <CardHeader>
          <CardTitle>Temel İçgörüler ve Öneriler (Gerçek Veriler)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <h5 className="font-semibold mb-1">Dijital Varlık Geliştirme</h5>
              <p className="text-sm text-muted-foreground">
                MÜSİAD'ın dijital skoru {musiadData?.digitalScore.toFixed(0) || '81'}/100, TÜMSİAD {tumsiadData?.digitalScore.toFixed(0) || '70'}/100. 
                <strong className="text-foreground"> {((musiadData?.digitalScore || 81) - (tumsiadData?.digitalScore || 70)).toFixed(0)} puan fark</strong> var. 
                SEO optimizasyonu ({tumsiadData?.seoScore || 68} → 80+) ve sosyal medya stratejisi ile bu fark kapatılabilir.
              </p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <h5 className="font-semibold mb-1">Üye Sayısı Büyütme Potansiyeli</h5>
              <p className="text-sm text-muted-foreground">
                MÜSİAD Denizli <strong className="text-foreground">200+ üyeye</strong> sahipken TÜMSİAD <strong className="text-foreground">78 üyeyle</strong> çalışıyor. 
                ASKON'un ~95 üyesi var. Denizli'de <strong className="text-foreground">122+ üye kazanma potansiyeli</strong> mevcut.
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
              <h5 className="font-semibold mb-1">Sosyal Medya Takipçi Artışı</h5>
              <p className="text-sm text-muted-foreground">
                TÜMSİAD'ın toplam ~{Math.round((tumsiadData?.socialMedia.avgFollowers || 1870) * 5 / 1000)}K takipçisi var, 
                MÜSİAD'ın ~{Math.round((musiadData?.socialMedia.avgFollowers || 6680) * 5 / 1000)}K. 
                Özellikle Instagram ({tumsiadData?.socialMedia.platforms.instagram?.followers || 2500} → 8000+) 
                ve Facebook'ta ({tumsiadData?.socialMedia.platforms.facebook?.followers || 3200} → 10000+) büyüme fırsatı var.
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <h5 className="font-semibold mb-1">Etkinlik Performansı Güçlü</h5>
              <p className="text-sm text-muted-foreground">
                Etkinlik çeşitliliği ve katılım oranları rakiplerle rekabetçi seviyede. 
                Bu güçlü yön dijital kanallarda daha fazla vurgulanarak üye kazanımında kullanılabilir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
