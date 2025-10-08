import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/dashboard/stat-card'
import { FileText, Download, Calendar, TrendingUp, Plus, Filter } from 'lucide-react'

// Mock data
const reportStats = {
  total: 24,
  thisMonth: 4,
  automated: 18,
  custom: 6,
}

const recentReports = [
  {
    id: 1,
    title: 'Ekim 2024 Aylık Faaliyet Raporu',
    type: 'monthly',
    period: 'Ekim 2024',
    generatedDate: '01 Kasım 2024',
    generatedBy: 'Sistem',
    status: 'ready',
    pages: 12,
  },
  {
    id: 2,
    title: 'Q3 2024 Çeyreklik Stratejik Değerlendirme',
    type: 'quarterly',
    period: 'Q3 2024',
    generatedDate: '05 Ekim 2024',
    generatedBy: 'Ali Yılmaz',
    status: 'ready',
    pages: 28,
  },
  {
    id: 3,
    title: 'Dijital Varlık Performans Analizi',
    type: 'custom',
    period: 'Ocak-Ekim 2024',
    generatedDate: '15 Ekim 2024',
    generatedBy: 'Mehmet Kaya',
    status: 'ready',
    pages: 15,
  },
  {
    id: 4,
    title: 'Üye Memnuniyet Anketi Sonuçları',
    type: 'custom',
    period: 'Eylül 2024',
    generatedDate: '28 Eylül 2024',
    generatedBy: 'Ayşe Demir',
    status: 'ready',
    pages: 8,
  },
]

const scheduledReports = [
  {
    id: 1,
    title: 'Haftalık Özet Rapor',
    frequency: 'weekly',
    nextGeneration: '28 Ekim 2024',
    recipients: ['Yönetim Kurulu'],
  },
  {
    id: 2,
    title: 'Aylık Faaliyet Raporu',
    frequency: 'monthly',
    nextGeneration: '01 Kasım 2024',
    recipients: ['Yönetim Kurulu', 'Tüm Üyeler'],
  },
  {
    id: 3,
    title: 'Çeyreklik Stratejik Değerlendirme',
    frequency: 'quarterly',
    nextGeneration: '01 Ocak 2025',
    recipients: ['Yönetim Kurulu'],
  },
]

const reportTemplates = [
  {
    id: 1,
    name: 'Üye Analiz Raporu',
    description: 'Üye büyümesi, sektör dağılımı ve aktivite analizi',
    icon: '👥',
  },
  {
    id: 2,
    name: 'Etkinlik Performans Raporu',
    description: 'Etkinlik katılımı, memnuniyet ve ROI analizi',
    icon: '📅',
  },
  {
    id: 3,
    name: 'Dijital Varlık Raporu',
    description: 'Web sitesi ve sosyal medya performans metrikleri',
    icon: '🌐',
  },
  {
    id: 4,
    name: 'Rakip Karşılaştırma Raporu',
    description: 'TÜMSİAD vs MÜSİAD vs ASKON detaylı analiz',
    icon: '📊',
  },
  {
    id: 5,
    name: 'Bölgesel Analiz Raporu',
    description: 'İlçe bazlı üye dağılımı ve potansiyel analizi',
    icon: '🗺️',
  },
  {
    id: 6,
    name: 'Hedef İlerleme Raporu',
    description: 'Stratejik hedefler ve KPI performans takibi',
    icon: '🎯',
  },
]

const getReportTypeText = (type: string) => {
  switch (type) {
    case 'weekly':
      return 'Haftalık'
    case 'monthly':
      return 'Aylık'
    case 'quarterly':
      return 'Çeyreklik'
    case 'yearly':
      return 'Yıllık'
    case 'custom':
      return 'Özel'
    default:
      return type
  }
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
          <p className="text-muted-foreground mt-2">
            Otomatik ve özel rapor oluşturma sistemi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrele
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Rapor
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Rapor"
          value={reportStats.total}
          icon={FileText}
          description="Bu yıl oluşturulan"
        />
        <StatCard
          title="Bu Ay"
          value={reportStats.thisMonth}
          icon={Calendar}
        />
        <StatCard
          title="Otomatik"
          value={reportStats.automated}
          icon={TrendingUp}
        />
        <StatCard
          title="Özel Rapor"
          value={reportStats.custom}
          icon={FileText}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Son Raporlar</TabsTrigger>
          <TabsTrigger value="scheduled">Zamanlanmış</TabsTrigger>
          <TabsTrigger value="templates">Şablonlar</TabsTrigger>
        </TabsList>

        {/* Recent Reports */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oluşturulan Raporlar</CardTitle>
              <CardDescription>İndirmeye hazır rapor listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{report.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge variant="outline">{getReportTypeText(report.type)}</Badge>
                          <span>{report.period}</span>
                          <span>•</span>
                          <span>{report.pages} sayfa</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Oluşturan: {report.generatedBy} • {report.generatedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Hazır</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Otomatik Rapor Planı</CardTitle>
              <CardDescription>Düzenli olarak oluşturulan raporlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge variant="secondary">{getReportTypeText(report.frequency)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Sonraki oluşturma: <span className="font-medium">{report.nextGeneration}</span></p>
                        <p className="mt-1">
                          Alıcılar: {report.recipients.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Düzenle</Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rapor Ayarları</CardTitle>
              <CardDescription>Otomatik rapor oluşturma tercihleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">E-posta Bildirimleri</p>
                    <p className="text-sm text-muted-foreground">Rapor hazır olduğunda e-posta gönder</p>
                  </div>
                  <Badge variant="default">Aktif</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Otomatik Arşivleme</p>
                    <p className="text-sm text-muted-foreground">Eski raporları otomatik olarak arşivle</p>
                  </div>
                  <Badge variant="default">Aktif</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Cloud Backup</p>
                    <p className="text-sm text-muted-foreground">Raporları bulut depolamaya yedekle</p>
                  </div>
                  <Badge variant="secondary">Pasif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapor Şablonları</CardTitle>
              <CardDescription>Hızlı rapor oluşturma şablonları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="text-4xl">{template.icon}</div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Rapor Oluştur
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Özel Rapor Oluşturucu</CardTitle>
              <CardDescription>Kendi raporunuzu tasarlayın</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rapor Başlığı</label>
                    <input
                      type="text"
                      placeholder="Rapor başlığı girin..."
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dönem</label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>Bu Ay</option>
                      <option>Son 3 Ay</option>
                      <option>Son 6 Ay</option>
                      <option>Bu Yıl</option>
                      <option>Özel Tarih Aralığı</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">İçerik Modülleri</label>
                  <div className="grid gap-2 md:grid-cols-3">
                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Üye İstatistikleri</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Etkinlikler</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" />
                      <span className="text-sm">Dijital Varlık</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" />
                      <span className="text-sm">Rakip Analizi</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Hedefler & KPI</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" />
                      <span className="text-sm">Bölgesel Analiz</span>
                    </label>
                  </div>
                </div>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Rapor Oluştur
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
