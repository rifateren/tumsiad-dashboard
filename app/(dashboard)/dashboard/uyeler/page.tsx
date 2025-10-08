'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LineChart } from '@/components/charts/line-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { StatCard } from '@/components/dashboard/stat-card'
import { Users, TrendingUp, UserPlus, Activity, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { MemberForm } from '@/components/forms/member-form'

// Mock data
const memberStats = {
  total: 78,
  active: 65,
  inactive: 13,
  newThisMonth: 6,
  growthRate: 8.2,
  activeRate: 83.3,
}

const memberGrowth = [
  { month: 'Ocak', toplam: 45, aktif: 38, yeni: 3 },
  { month: 'Şubat', toplam: 52, aktif: 43, yeni: 7 },
  { month: 'Mart', toplam: 58, aktif: 48, yeni: 6 },
  { month: 'Nisan', toplam: 65, aktif: 54, yeni: 7 },
  { month: 'Mayıs', toplam: 72, aktif: 60, yeni: 7 },
  { month: 'Haziran', toplam: 78, aktif: 65, yeni: 6 },
]

const sectorDistribution = [
  { sector: 'Tekstil', count: 25, percentage: 32.1 },
  { sector: 'Gıda', count: 18, percentage: 23.1 },
  { sector: 'Teknoloji', count: 15, percentage: 19.2 },
  { sector: 'İnşaat', count: 12, percentage: 15.4 },
  { sector: 'Turizm', count: 8, percentage: 10.3 },
]

const recentMembers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    company: 'Yılmaz Tekstil A.Ş.',
    sector: 'Tekstil',
    joinDate: '15 Ekim 2024',
    status: 'active',
    attendance: 85,
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    company: 'Kaya İnşaat Ltd.',
    sector: 'İnşaat',
    joinDate: '12 Ekim 2024',
    status: 'active',
    attendance: 92,
  },
  {
    id: 3,
    name: 'Ayşe Demir',
    company: 'Demir Teknoloji A.Ş.',
    sector: 'Teknoloji',
    joinDate: '08 Ekim 2024',
    status: 'active',
    attendance: 78,
  },
  {
    id: 4,
    name: 'Fatma Şahin',
    company: 'Şahin Gıda San. Tic.',
    sector: 'Gıda',
    joinDate: '05 Ekim 2024',
    status: 'active',
    attendance: 88,
  },
  {
    id: 5,
    name: 'Ali Çelik',
    company: 'Çelik Turizm Ltd.',
    sector: 'Turizm',
    joinDate: '01 Ekim 2024',
    status: 'active',
    attendance: 75,
  },
]

export default function MembersPage() {
  const [memberFormOpen, setMemberFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleMemberAdded = () => {
    setRefreshKey(prev => prev + 1)
    alert('Üye başarıyla eklendi!')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Üye Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Üye veritabanı ve analitik takip sistemi
          </p>
        </div>
        <Button onClick={() => setMemberFormOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Yeni Üye Ekle
        </Button>
      </div>

      <MemberForm 
        open={memberFormOpen} 
        onOpenChange={setMemberFormOpen}
        onSuccess={handleMemberAdded}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Üye"
          value={memberStats.total}
          change={memberStats.growthRate}
          icon={Users}
        />
        <StatCard
          title="Aktif Üye"
          value={memberStats.active}
          icon={Activity}
          description={`Toplam üyelerin %${memberStats.activeRate}`}
        />
        <StatCard
          title="Bu Ay Yeni Üye"
          value={memberStats.newThisMonth}
          change={20}
          icon={UserPlus}
        />
        <StatCard
          title="Pasif Üye"
          value={memberStats.inactive}
          icon={Users}
          description="Aktivasyon gerekli"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <LineChart
          title="Üye Büyüme Trendi"
          description="Son 6 aylık üye artışı ve aktivite"
          data={memberGrowth}
          dataKey="toplam"
          xAxisKey="month"
          lines={[
            { key: 'toplam', name: 'Toplam', color: 'hsl(var(--primary))' },
            { key: 'aktif', name: 'Aktif', color: '#10b981' },
            { key: 'yeni', name: 'Yeni', color: '#f59e0b' },
          ]}
        />
        <BarChart
          title="Sektör Dağılımı"
          description="Üyelerin sektörel analizi"
          data={sectorDistribution}
          dataKey="count"
          xAxisKey="sector"
        />
      </div>

      {/* Sector Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detaylı Sektör Analizi</CardTitle>
          <CardDescription>Üyelerin sektörlere göre dağılımı ve yüzdeleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectorDistribution.map((sector) => (
              <div key={sector.sector} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{sector.sector}</span>
                  <span className="text-muted-foreground">
                    {sector.count} üye ({sector.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${sector.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Son Katılan Üyeler</CardTitle>
              <CardDescription>En yeni üye kayıtları ve detayları</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Ara..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Üye Adı</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Sektör</TableHead>
                <TableHead>Katılım Tarihi</TableHead>
                <TableHead>Katılım Oranı</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.company}</TableCell>
                  <TableCell>{member.sector}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${member.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {member.attendance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status === 'active' ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Üye Katılım Analizi</CardTitle>
            <CardDescription>Etkinliklere katılım durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div>
                  <p className="font-medium">Yüksek Katılım</p>
                  <p className="text-sm text-muted-foreground">%80 ve üzeri</p>
                </div>
                <div className="text-2xl font-bold">42 üye</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div>
                  <p className="font-medium">Orta Katılım</p>
                  <p className="text-sm text-muted-foreground">%50 - %80</p>
                </div>
                <div className="text-2xl font-bold">23 üye</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div>
                  <p className="font-medium">Düşük Katılım</p>
                  <p className="text-sm text-muted-foreground">%50'nin altı</p>
                </div>
                <div className="text-2xl font-bold">13 üye</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Üye Büyüme Hedefi</CardTitle>
            <CardDescription>2024 yıl sonu hedefi: 100 üye</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">İlerleme</span>
                  <span className="text-sm text-muted-foreground">78/100 üye</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '78%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-2xl font-bold">22</p>
                  <p className="text-sm text-muted-foreground">Hedefe kalan</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5</p>
                  <p className="text-sm text-muted-foreground">Aylık ortalama</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Hedefe ulaşmak için aylık ortalama <span className="font-semibold text-foreground">3.7 yeni üye</span> kazanılması gerekiyor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
