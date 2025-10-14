'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LineChart } from '@/components/charts/line-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { StatCard } from '@/components/dashboard/stat-card'
import { Users, TrendingUp, UserPlus, Activity, Search, Filter, Edit, Trash2, Eye, Download, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { MemberForm } from '@/components/forms/member-form'
import { MemberEditForm } from '@/components/forms/member-edit-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToastHelpers } from '@/components/ui/toast'

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

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  sector?: string
  district?: string
  address?: string
  experience?: number
  status: string
  membershipDate: string
  createdAt: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [memberStats, setMemberStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    growthRate: 0,
    activeRate: 0,
  })
  const [sectorData, setSectorData] = useState<Array<{ sector: string; count: number; percentage: number }>>([])
  const [monthlyGrowth, setMonthlyGrowth] = useState<Array<{ month: string; toplam: number; aktif: number; yeni: number }>>([])
  const [loading, setLoading] = useState(true)
  const [memberFormOpen, setMemberFormOpen] = useState(false)
  const [memberEditFormOpen, setMemberEditFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const toast = useToastHelpers()

  // Fetch members data
  const fetchMembers = async () => {
    try {
      const [membersResponse, statsResponse] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/analytics/member-stats')
      ])

      console.log('Members API response:', membersResponse.status)
      console.log('Stats API response:', statsResponse.status)

      if (membersResponse.ok && statsResponse.ok) {
        const [membersData, statsData] = await Promise.all([
          membersResponse.json(),
          statsResponse.json()
        ])

        console.log('Members data:', membersData)
        console.log('Stats data:', statsData)

        const membersList = membersData.members || []
        setMembers(membersList)
        
        setMemberStats({
          total: statsData.totalMembers || 0,
          active: statsData.activeMembers || 0,
          inactive: statsData.inactiveMembers || 0,
          newThisMonth: statsData.monthlyGrowth?.slice(-1)[0]?.count || 0,
          growthRate: 12.5,
          activeRate: statsData.totalMembers > 0 ? Math.round((statsData.activeMembers / statsData.totalMembers) * 100) : 0,
        })

        // Sektör dağılımını hesapla
        const sectorCounts: { [key: string]: number } = {}
        membersList.forEach((member: Member) => {
          const sector = member.sector || 'Diğer'
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1
        })

        const totalMembers = membersList.length
        const sectorArray = Object.entries(sectorCounts)
          .map(([sector, count]) => ({
            sector,
            count,
            percentage: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)

        setSectorData(sectorArray)

        // Aylık büyüme verilerini hesapla (statsData'dan)
        if (statsData.monthlyGrowth && statsData.monthlyGrowth.length > 0) {
          const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
          const growthData = statsData.monthlyGrowth.slice(-6).map((item: any, index: number) => {
            const monthIndex = new Date(item.month).getMonth()
            return {
              month: months[monthIndex] || item.month,
              toplam: item.count || 0,
              aktif: Math.round((item.count || 0) * 0.85), // %85 aktif varsayımı
              yeni: index === statsData.monthlyGrowth.length - 1 ? (statsData.monthlyGrowth[index]?.count || 0) - (statsData.monthlyGrowth[index - 1]?.count || 0) : 0
            }
          })
          setMonthlyGrowth(growthData)
        }
      } else {
        console.error('API error - Members:', membersResponse.status, 'Stats:', statsResponse.status)
        toast.error('API hatası: Veriler yüklenemedi')
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      toast.error('Üye verileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleMemberAdded = () => {
    fetchMembers()
    toast.success('Üye başarıyla eklendi!')
  }

  const handleMemberUpdated = () => {
    fetchMembers()
    toast.success('Üye başarıyla güncellendi!')
  }

  const handleDeleteMember = async () => {
    if (!selectedMember) return

    try {
      const response = await fetch(`/api/members/${selectedMember.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchMembers()
        toast.success('Üye başarıyla silindi!')
      } else {
        throw new Error('Üye silinirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      toast.error('Üye silinemedi')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedMember(null)
    }
  }

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  console.log('Members state:', members.length)
  console.log('Filtered members:', filteredMembers.length)
  console.log('Search term:', searchTerm)
  console.log('Loading:', loading)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('/api/export/members-excel', '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Excel İndir
          </Button>
          <Button
            variant="outline"
            onClick={fetchMembers}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          <Button onClick={() => setMemberFormOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Yeni Üye Ekle
          </Button>
        </div>
      </div>

      <MemberForm 
        open={memberFormOpen} 
        onOpenChange={setMemberFormOpen}
        onSuccess={handleMemberAdded}
      />

      <MemberEditForm 
        open={memberEditFormOpen} 
        onOpenChange={setMemberEditFormOpen}
        member={selectedMember}
        onSuccess={handleMemberUpdated}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Üyeyi Sil"
        description={`${selectedMember?.firstName} ${selectedMember?.lastName} adlı üyeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        variant="destructive"
        onConfirm={handleDeleteMember}
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
                 data={[
                   { month: 'May', toplam: 6, aktif: 5, yeni: 1 },
                   { month: 'Haz', toplam: 8, aktif: 7, yeni: 2 },
                   { month: 'Tem', toplam: 11, aktif: 9, yeni: 3 },
                   { month: 'Ağu', toplam: 7, aktif: 6, yeni: 1 },
                   { month: 'Eyl', toplam: 9, aktif: 8, yeni: 2 },
                   { month: 'Eki', toplam: 6, aktif: 5, yeni: 1 }
                 ]}
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
                 data={[
                   { sector: 'HİZMET', count: 10 },
                   { sector: 'İNŞAAT', count: 6 },
                   { sector: 'SANAYİ', count: 5 },
                   { sector: 'İMALAT', count: 4 },
                   { sector: 'ELEKTRİK', count: 4 },
                   { sector: 'OTOMOTİV', count: 3 },
                   { sector: 'TEKSTİL', count: 2 },
                   { sector: 'GIDA', count: 2 }
                 ]}
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
                   {[
                     { sector: 'HİZMET', count: 10, percentage: 21 },
                     { sector: 'İNŞAAT', count: 6, percentage: 13 },
                     { sector: 'SANAYİ', count: 5, percentage: 11 },
                     { sector: 'İMALAT', count: 4, percentage: 9 },
                     { sector: 'ELEKTRİK', count: 4, percentage: 9 },
                     { sector: 'OTOMOTİV', count: 3, percentage: 6 },
                     { sector: 'TEKSTİL', count: 2, percentage: 4 },
                     { sector: 'GIDA', count: 2, percentage: 4 }
                   ].map((sector) => (
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
                <Input 
                  placeholder="Üye ara..." 
                  className="pl-9 w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                <TableHead>E-posta</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Sektör</TableHead>
                <TableHead>Üyelik Tarihi</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.company || '-'}</TableCell>
                  <TableCell>{member.sector || '-'}</TableCell>
                  <TableCell>
                    {new Date(member.membershipDate).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      member.status === 'ACTIVE' ? 'default' : 
                      member.status === 'INACTIVE' ? 'secondary' :
                      member.status === 'SUSPENDED' ? 'destructive' : 'outline'
                    }>
                      {member.status === 'ACTIVE' ? 'Aktif' : 
                       member.status === 'INACTIVE' ? 'Pasif' :
                       member.status === 'SUSPENDED' ? 'Askıda' : 'İstifa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMember(member)
                          setMemberEditFormOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMember(member)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz üye bulunmuyor'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Farklı bir arama terimi deneyin' : 'İlk üyenizi eklemek için yukarıdaki butonu kullanın'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setMemberFormOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  İlk Üyeyi Ekle
                </Button>
              )}
            </div>
          )}
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
