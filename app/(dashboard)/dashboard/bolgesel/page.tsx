import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/dashboard/stat-card'
import { BarChart } from '@/components/charts/bar-chart'
import { MapPin, Users, Building, TrendingUp, Target } from 'lucide-react'

// Mock data
const districtData = [
  { district: 'Merkez', members: 35, events: 18, active: 92 },
  { district: 'Pamukkale', members: 18, events: 8, active: 88 },
  { district: 'Merkezefendi', members: 15, events: 10, active: 85 },
  { district: 'Honaz', members: 6, events: 4, active: 75 },
  { district: 'Çivril', members: 4, events: 2, active: 70 },
]

const sectorByDistrict = [
  { district: 'Merkez', tekstil: 15, gida: 8, teknoloji: 7, insaat: 3, diger: 2 },
  { district: 'Pamukkale', tekstil: 8, gida: 5, teknoloji: 3, insaat: 2, diger: 0 },
  { district: 'Merkezefendi', tekstil: 6, gida: 4, teknoloji: 3, insaat: 2, diger: 0 },
  { district: 'Honaz', tekstil: 3, gida: 2, teknoloji: 0, insaat: 1, diger: 0 },
]

// Güncel gerçek veriler: TÜMSİAD=78, MÜSİAD=200+, ASKON=~95
// İlçe dağılımı oransal olarak hesaplanmış
const competitorPresence = [
  { ilce: 'Merkez', tumsiad: 35, musiad: 90, askon: 42 },       // %45 merkez
  { ilce: 'Pamukkale', tumsiad: 18, musiad: 50, askon: 24 },    // %23 pamukkale
  { ilce: 'Merkezefendi', tumsiad: 15, musiad: 40, askon: 20 }, // %19 merkezefendi
  { ilce: 'Honaz', tumsiad: 6, musiad: 12, askon: 6 },          // %8 honaz
  { ilce: 'Çivril', tumsiad: 4, musiad: 8, askon: 3 },          // %5 çivril
]

export default function RegionalPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bölgesel Etki Analizi</h1>
        <p className="text-muted-foreground mt-2">
          Denizli ilçe bazlı üye dağılımı ve rekabet analizi
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Kapsanan İlçe"
          value="13/19"
          icon={MapPin}
          description="Denizli toplam 19 ilçe"
        />
        <StatCard
          title="En Güçlü Bölge"
          value="Merkez"
          icon={Target}
          description="35 üye, %92 aktivite"
        />
        <StatCard
          title="Gelişim Potansiyeli"
          value="6 ilçe"
          icon={TrendingUp}
          description="Yeni şube fırsatları"
        />
        <StatCard
          title="Sektör Çeşitliliği"
          value="8 sektör"
          icon={Building}
          description="İlçeler arası dağılım"
        />
      </div>

      {/* District Map/Table */}
      <Card>
        <CardHeader>
          <CardTitle>İlçe Bazlı Üye Dağılımı</CardTitle>
          <CardDescription>Denizli ilçelerinde TÜMSİAD varlığı ve aktivite düzeyi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtData.map((district) => (
              <div key={district.district} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{district.district}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{district.members}</p>
                      <p className="text-xs text-muted-foreground">Üye</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{district.events}</p>
                      <p className="text-xs text-muted-foreground">Etkinlik</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{district.active}%</p>
                      <p className="text-xs text-muted-foreground">Aktif</p>
                    </div>
                    <Badge variant={district.active >= 85 ? 'default' : 'secondary'}>
                      {district.active >= 85 ? 'Güçlü' : 'Gelişmekte'}
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(district.members / 35) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Rakip STK Karşılaştırması (İlçe Bazlı)</CardTitle>
          <CardDescription>TÜMSİAD, MÜSİAD ve ASKON üye sayıları</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            title=""
            data={competitorPresence}
            dataKey="tumsiad"
            xAxisKey="ilce"
            bars={[
              { key: 'tumsiad', name: 'TÜMSİAD', color: 'hsl(var(--primary))' },
              { key: 'musiad', name: 'MÜSİAD', color: '#10b981' },
              { key: 'askon', name: 'ASKON', color: '#f59e0b' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Sector Distribution by District */}
      <Card>
        <CardHeader>
          <CardTitle>İlçe Bazlı Sektör Dağılımı</CardTitle>
          <CardDescription>Her ilçedeki sektörel çeşitlilik</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            title=""
            data={sectorByDistrict}
            dataKey="tekstil"
            xAxisKey="district"
            bars={[
              { key: 'tekstil', name: 'Tekstil', color: '#3b82f6' },
              { key: 'gida', name: 'Gıda', color: '#10b981' },
              { key: 'teknoloji', name: 'Teknoloji', color: '#8b5cf6' },
              { key: 'insaat', name: 'İnşaat', color: '#f59e0b' },
              { key: 'diger', name: 'Diğer', color: '#94a3b8' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Güçlü Yönler</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Merkez ilçede güçlü varlık ve yüksek aktivite oranı</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Pamukkale ve Merkezefendi'de dengeli büyüme</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Tekstil sektöründe bölgesel dominasyon</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gelişim Alanları</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 mt-0.5">→</span>
                <span>Honaz, Çivril ve diğer ilçelerde üye sayısı artırılmalı</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 mt-0.5">→</span>
                <span>MÜSİAD'a göre tüm ilçelerde geride kalınıyor</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 mt-0.5">→</span>
                <span>Sektör çeşitliliği artırılmalı (özellikle teknoloji)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Bölgesel Strateji Önerileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
              <h4 className="font-semibold mb-2">Öncelikli Bölgeler</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Honaz ve Çivril</strong> ilçelerinde organize sanayi bölgeleri hedeflenmeli. 
                Bu bölgelerde düzenli networking etkinlikleri ile görünürlük artırılabilir.
              </p>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded">
              <h4 className="font-semibold mb-2">Sektörel Hedefleme</h4>
              <p className="text-sm text-muted-foreground">
                Teknoloji ve hizmet sektörü firmalarına özel outreach programı başlatılmalı. 
                Genç girişimci odaklı etkinlikler düzenlenebilir.
              </p>
            </div>

            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded">
              <h4 className="font-semibold mb-2">Rakip Analizi (Gerçek Veriler)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>MÜSİAD Denizli 200+ üyeyle</strong> bölgede en güçlü STK. TÜMSİAD'ın 78 üyesi var. 
                Farklılaşma için: Daha küçük, özelleştirilmiş networking etkinlikleri ve sektör odaklı yaklaşım tercih edilebilir.
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded">
              <h4 className="font-semibold mb-2">Yerel İşbirlikleri</h4>
              <p className="text-sm text-muted-foreground">
                İlçe bazlı ticaret odaları ve belediyelerle stratejik işbirlikleri kurulmalı. 
                Yerel ekonomik forumlar ve fuarlara aktif katılım sağlanmalı.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
