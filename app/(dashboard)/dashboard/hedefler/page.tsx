import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/dashboard/stat-card'
import { Target, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'

// Mock data
const goalStats = {
  total: 12,
  inProgress: 8,
  completed: 3,
  onHold: 1,
  completionRate: 68,
}

const strategicGoals = [
  {
    id: 1,
    title: 'Üye Sayısını 100\'e Çıkarmak',
    category: 'membership',
    description: 'Yıl sonuna kadar toplam üye sayısını 100\'e ulaştırmak',
    targetValue: 100,
    currentValue: 78,
    unit: 'üye',
    priority: 'high',
    status: 'in-progress',
    startDate: '01 Ocak 2024',
    endDate: '31 Aralık 2024',
    progress: 78,
    daysRemaining: 84,
  },
  {
    id: 2,
    title: 'Dijital Varlık Skorunu 85\'e Yükseltmek',
    category: 'digital',
    description: 'Web sitesi ve sosyal medya performansını iyileştirmek',
    targetValue: 85,
    currentValue: 72,
    unit: 'puan',
    priority: 'high',
    status: 'in-progress',
    startDate: '01 Mart 2024',
    endDate: '31 Aralık 2024',
    progress: 84.7,
    daysRemaining: 84,
  },
  {
    id: 3,
    title: 'Aylık 8 Etkinlik Düzenlemek',
    category: 'events',
    description: 'Düzenli ve çeşitli etkinlik takvimi oluşturmak',
    targetValue: 8,
    currentValue: 6,
    unit: 'etkinlik/ay',
    priority: 'medium',
    status: 'in-progress',
    startDate: '01 Haziran 2024',
    endDate: '31 Aralık 2024',
    progress: 75,
    daysRemaining: 84,
  },
  {
    id: 4,
    title: 'Tüm İlçelerde Temsil',
    category: 'regional',
    description: 'Denizli\'nin 19 ilçesinde en az 1 üye sahibi olmak',
    targetValue: 19,
    currentValue: 13,
    unit: 'ilçe',
    priority: 'medium',
    status: 'in-progress',
    startDate: '01 Ocak 2024',
    endDate: '31 Aralık 2025',
    progress: 68.4,
    daysRemaining: 449,
  },
]

const kpis = [
  {
    id: 1,
    name: 'Aylık Yeni Üye Sayısı',
    targetValue: 4,
    currentValue: 3.5,
    unit: 'üye',
    frequency: 'monthly',
    trend: 'up',
    performance: 87.5,
  },
  {
    id: 2,
    name: 'Etkinlik Katılım Oranı',
    targetValue: 80,
    currentValue: 75,
    unit: '%',
    frequency: 'monthly',
    trend: 'up',
    performance: 93.75,
  },
  {
    id: 3,
    name: 'Sosyal Medya Büyüme',
    targetValue: 10,
    currentValue: 12.5,
    unit: '%',
    frequency: 'monthly',
    trend: 'up',
    performance: 125,
  },
  {
    id: 4,
    name: 'Üye Memnuniyet Skoru',
    targetValue: 4.5,
    currentValue: 4.3,
    unit: '/5',
    frequency: 'quarterly',
    trend: 'stable',
    performance: 95.6,
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'Yüksek'
    case 'medium':
      return 'Orta'
    case 'low':
      return 'Düşük'
    default:
      return priority
  }
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stratejik Hedefler & KPI</h1>
          <p className="text-muted-foreground mt-2">
            Hedef takibi ve performans göstergeleri
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Hedef
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Toplam Hedef"
          value={goalStats.total}
          icon={Target}
        />
        <StatCard
          title="Devam Eden"
          value={goalStats.inProgress}
          icon={TrendingUp}
        />
        <StatCard
          title="Tamamlanan"
          value={goalStats.completed}
          icon={CheckCircle}
        />
        <StatCard
          title="Beklemede"
          value={goalStats.onHold}
          icon={Clock}
        />
        <StatCard
          title="Tamamlanma Oranı"
          value={`${goalStats.completionRate}%`}
          icon={Target}
        />
      </div>

      {/* Strategic Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Stratejik Hedefler</CardTitle>
          <CardDescription>Uzun vadeli organizasyon hedefleri ve ilerleme durumu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {strategicGoals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{goal.title}</h4>
                      <Badge variant={getPriorityColor(goal.priority)}>
                        {getPriorityText(goal.priority)}
                      </Badge>
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                      <span>{goal.startDate} - {goal.endDate}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {goal.daysRemaining} gün kaldı
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Detaylar</Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Hedef</p>
                    <p className="text-xl font-bold">{goal.targetValue} {goal.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mevcut</p>
                    <p className="text-xl font-bold">{goal.currentValue} {goal.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kalan</p>
                    <p className="text-xl font-bold">{goal.targetValue - goal.currentValue} {goal.unit}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>İlerleme</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Göstergeleri (KPI)</CardTitle>
          <CardDescription>Temel performans metrikleri ve hedef karşılaştırması</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{kpi.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Güncelleme: {kpi.frequency === 'monthly' ? 'Aylık' : kpi.frequency === 'quarterly' ? 'Çeyreklik' : 'Haftalık'}
                    </p>
                  </div>
                  <Badge variant={kpi.performance >= 100 ? 'default' : kpi.performance >= 75 ? 'secondary' : 'outline'}>
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Hedef</p>
                    <p className="text-lg font-bold">{kpi.targetValue}{kpi.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mevcut</p>
                    <p className="text-lg font-bold">{kpi.currentValue}{kpi.unit}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Performans</span>
                    <span className={kpi.performance >= 100 ? 'text-green-600 font-medium' : ''}>
                      {kpi.performance.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(kpi.performance, 100)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SWOT Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Stratejik Analiz Matrisi (SWOT)</CardTitle>
          <CardDescription>Mevcut durumun genel değerlendirmesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border-2 border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-green-950/20">
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">Güçlü Yönler (Strengths)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Güçlü yerel ağ ve bağlantılar</li>
                <li>• Yüksek etkinlik katılım oranı</li>
                <li>• Deneyimli yönetim kadrosu</li>
                <li>• Tekstil sektöründe dominasyon</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/20">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">Zayıf Yönler (Weaknesses)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Dijital varlık eksikliği</li>
                <li>• Rakiplere göre düşük üye sayısı</li>
                <li>• Sınırlı medya görünürlüğü</li>
                <li>• Genç üye oranı düşük</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-blue-200 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">Fırsatlar (Opportunities)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Dijital dönüşüm projeleri</li>
                <li>• Genç girişimci programları</li>
                <li>• Online etkinlik formatları</li>
                <li>• Bölgesel işbirlikleri</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-orange-200 dark:border-orange-900 rounded-lg bg-orange-50 dark:bg-orange-950/20">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-3">Tehditler (Threats)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Rakip STK'ların dijital üstünlüğü</li>
                <li>• Ekonomik belirsizlikler</li>
                <li>• Genç nesil üye çekmede zorluk</li>
                <li>• Medya değişim trendleri</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
