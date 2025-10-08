import { StatCard } from '@/components/dashboard/stat-card'
import { LineChart } from '@/components/charts/line-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { Users, Calendar, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - gerçek verilerle değiştirilecek
const memberGrowthData = [
  { month: 'Ocak', uye: 45 },
  { month: 'Şubat', uye: 52 },
  { month: 'Mart', uye: 58 },
  { month: 'Nisan', uye: 65 },
  { month: 'Mayıs', uye: 72 },
  { month: 'Haziran', uye: 78 },
]

const sectorData = [
  { sector: 'Tekstil', count: 25 },
  { sector: 'Gıda', count: 18 },
  { sector: 'Teknoloji', count: 15 },
  { sector: 'İnşaat', count: 12 },
  { sector: 'Turizm', count: 8 },
]

const recentEvents = [
  {
    id: 1,
    title: 'İhracat Stratejileri Semineri',
    date: '15 Ekim 2024',
    attendees: 45,
    status: 'completed'
  },
  {
    id: 2,
    title: 'Networking Kahvaltısı',
    date: '20 Ekim 2024',
    attendees: 32,
    status: 'completed'
  },
  {
    id: 3,
    title: 'Dijital Dönüşüm Workshop',
    date: '25 Ekim 2024',
    attendees: 28,
    status: 'upcoming'
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ana Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          TÜMSİAD Denizli şubesi performans ve analitik özeti
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Üye"
          value="78"
          change={8.2}
          icon={Users}
        />
        <StatCard
          title="Aktif Üye"
          value="65"
          change={5.1}
          icon={TrendingUp}
          description="Toplam üyelerin %83'ü"
        />
        <StatCard
          title="Bu Ay Etkinlik"
          value="5"
          change={25}
          icon={Calendar}
        />
        <StatCard
          title="Dijital Skor"
          value="72/100"
          change={12}
          icon={Award}
          description="Rakiplere göre"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <LineChart
          title="Üye Büyüme Trendi"
          description="Son 6 aylık üye sayısı değişimi"
          data={memberGrowthData}
          dataKey="uye"
          xAxisKey="month"
        />
        <BarChart
          title="Sektör Dağılımı"
          description="Üyelerin sektörel dağılımı"
          data={sectorData}
          dataKey="count"
          xAxisKey="sector"
        />
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Son Etkinlikler</CardTitle>
          <CardDescription>En son gerçekleştirilen ve yaklaşan etkinlikler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{event.attendees} kişi</p>
                    <p className="text-xs text-muted-foreground">Katılımcı</p>
                  </div>
                  <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                    {event.status === 'completed' ? 'Tamamlandı' : 'Yaklaşan'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı Aksiyonlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Yeni Üye Ekle</p>
                <p className="text-xs text-muted-foreground">Üye kaydı oluştur</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Etkinlik Planla</p>
                <p className="text-xs text-muted-foreground">Yeni etkinlik oluştur</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Rapor Oluştur</p>
                <p className="text-xs text-muted-foreground">Özet rapor hazırla</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Hedef Belirle</p>
                <p className="text-xs text-muted-foreground">Yeni hedef ekle</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
