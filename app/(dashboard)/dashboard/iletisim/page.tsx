import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/dashboard/stat-card'
import { LineChart } from '@/components/charts/line-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { MessageSquare, Send, TrendingUp, Users, Plus, Calendar } from 'lucide-react'

// Mock data
const campaignStats = {
  active: 3,
  totalReach: 125000,
  engagement: 3.8,
  planned: 5,
}

const campaignPerformance = [
  { week: 'Hf 1', erisim: 25000, etkilesim: 950 },
  { week: 'Hf 2', erisim: 28000, etkilesim: 1120 },
  { week: 'Hf 3', erisim: 32000, etkilesim: 1280 },
  { week: 'Hf 4', erisim: 30000, etkilesim: 1200 },
]

const contentTypes = [
  { type: 'Haber', count: 24 },
  { type: 'Etkinlik Duyurusu', count: 18 },
  { type: 'Başarı Hikayesi', count: 12 },
  { type: 'Röportaj', count: 8 },
  { type: 'İnfografik', count: 6 },
]

const activeCampaigns = [
  {
    id: 1,
    title: 'Dijital Dönüşüm Farkındalık Kampanyası',
    type: 'awareness',
    status: 'active',
    startDate: '01 Ekim 2024',
    endDate: '31 Ekim 2024',
    reach: 45000,
    engagement: 4.2,
    budget: 15000,
    progress: 65,
  },
  {
    id: 2,
    title: 'Üye Kazanım Kampanyası',
    type: 'membership',
    status: 'active',
    startDate: '15 Ekim 2024',
    endDate: '15 Kasım 2024',
    reach: 32000,
    engagement: 3.8,
    budget: 10000,
    progress: 45,
  },
  {
    id: 3,
    title: 'Yıl Sonu Etkinlik Tanıtımı',
    type: 'event',
    status: 'scheduled',
    startDate: '01 Kasım 2024',
    endDate: '30 Kasım 2024',
    reach: 0,
    engagement: 0,
    budget: 12000,
    progress: 0,
  },
]

const contentCalendar = [
  {
    id: 1,
    title: 'İhracat Teşvikleri Basın Bülteni',
    type: 'press-release',
    date: '25 Ekim 2024',
    platform: 'Medya',
    status: 'scheduled',
  },
  {
    id: 2,
    title: 'Üye Başarı Hikayesi - Yılmaz Tekstil',
    type: 'story',
    date: '26 Ekim 2024',
    platform: 'LinkedIn',
    status: 'scheduled',
  },
  {
    id: 3,
    title: 'Networking Etkinliği Fotoğrafları',
    type: 'photos',
    date: '27 Ekim 2024',
    platform: 'Instagram',
    status: 'scheduled',
  },
]

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İletişim Stratejisi</h1>
          <p className="text-muted-foreground mt-2">
            Kampanya yönetimi ve içerik planlama
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kampanya
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Aktif Kampanya"
          value={campaignStats.active}
          icon={MessageSquare}
        />
        <StatCard
          title="Toplam Erişim"
          value={`${campaignStats.totalReach / 1000}K`}
          change={15.3}
          icon={Users}
        />
        <StatCard
          title="Etkileşim Oranı"
          value={`${campaignStats.engagement}%`}
          change={8.7}
          icon={TrendingUp}
        />
        <StatCard
          title="Planlanan"
          value={campaignStats.planned}
          icon={Calendar}
          description="Önümüzdeki ay"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Kampanyalar</TabsTrigger>
          <TabsTrigger value="calendar">İçerik Takvimi</TabsTrigger>
          <TabsTrigger value="analytics">Analitikler</TabsTrigger>
        </TabsList>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{campaign.title}</h3>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status === 'active' ? 'Aktif' : 'Planlandı'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {campaign.startDate} - {campaign.endDate}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Detaylar</Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Erişim</p>
                        <p className="text-2xl font-bold">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Etkileşim</p>
                        <p className="text-2xl font-bold">{campaign.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bütçe</p>
                        <p className="text-2xl font-bold">₺{campaign.budget.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Kampanya İlerlemesi</span>
                        <span className="font-medium">{campaign.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Calendar */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Önümüzdeki Hafta İçerik Planı</CardTitle>
              <CardDescription>Planlanmış içerik ve yayınlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentCalendar.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{item.date}</span>
                        <Badge variant="outline" className="text-xs">{item.platform}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.status === 'scheduled' ? 'Planlandı' : 'Yayınlandı'}</Badge>
                      <Button variant="ghost" size="sm">Düzenle</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bu Hafta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Toplam İçerik</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Yayınlanan</span>
                    <span className="font-semibold text-green-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Planlanan</span>
                    <span className="font-semibold text-blue-600">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gelecek Hafta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Planlanan İçerik</span>
                    <span className="font-semibold">9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taslak</span>
                    <span className="font-semibold text-orange-600">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Onay Bekleyen</span>
                    <span className="font-semibold text-yellow-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <LineChart
              title="Kampanya Performansı"
              description="Son 4 hafta erişim ve etkileşim"
              data={campaignPerformance}
              dataKey="erisim"
              xAxisKey="week"
              lines={[
                { key: 'erisim', name: 'Erişim', color: 'hsl(var(--primary))' },
                { key: 'etkilesim', name: 'Etkileşim', color: '#10b981' },
              ]}
            />
            <BarChart
              title="İçerik Türü Dağılımı"
              description="Bu yıl yayınlanan içerik türleri"
              data={contentTypes}
              dataKey="count"
              xAxisKey="type"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">En Başarılı Kampanya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Üye Kazanım Kampanyası</p>
                  <p className="text-sm text-muted-foreground">Eylül 2024</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Erişim:</span>
                      <span className="font-medium">68K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="font-medium text-green-600">+185%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Medya Değeri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">₺245K</p>
                  <p className="text-sm text-muted-foreground">
                    Tahmini reklam değeri
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +24% geçen aya göre
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sentiment Analizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pozitif</span>
                    <span className="font-medium text-green-600">72%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nötr</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Negatif</span>
                    <span className="font-medium text-red-600">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>İletişim Stratejisi Önerileri</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>LinkedIn içerikleri yüksek etkileşim alıyor, önceliklendirilmeli</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>Başarı hikayesi içerik formatı genişletilmeli</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 mt-0.5">!</span>
                  <span>Video içerik üretimi artırılmalı (YouTube stratejisi)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Influencer/üye işbirlikleri kampanya erişimini artırıyor</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
