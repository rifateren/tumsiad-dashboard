'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/dashboard/stat-card'
import { BarChart } from '@/components/charts/bar-chart'
import { LineChart } from '@/components/charts/line-chart'
import { Calendar, Users, TrendingUp, Award, Clock, MapPin, Plus, Edit, Trash2, Search } from 'lucide-react'
import { EventForm } from '@/components/forms/event-form'
import { EventEditForm } from '@/components/forms/event-edit-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToastHelpers } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'

// Mock data
const eventStats = {
  total: 42,
  thisMonth: 5,
  upcoming: 3,
  avgAttendance: 35,
  satisfaction: 4.3,
}

const eventsByType = [
  { type: 'Konferans', count: 12 },
  { type: 'Seminer', count: 15 },
  { type: 'Networking', count: 8 },
  { type: 'Eğitim', count: 5 },
  { type: 'Sosyal Sorumluluk', count: 2 },
]

const attendanceTrend = [
  { month: 'Ocak', hedef: 30, gerceklesen: 28 },
  { month: 'Şubat', hedef: 30, gerceklesen: 32 },
  { month: 'Mart', hedef: 35, gerceklesen: 33 },
  { month: 'Nisan', hedef: 35, gerceklesen: 38 },
  { month: 'Mayıs', hedef: 40, gerceklesen: 35 },
  { month: 'Haziran', hedef: 40, gerceklesen: 42 },
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Dijital Dönüşüm Workshop',
    type: 'workshop',
    date: '25 Ekim 2024',
    time: '14:00',
    location: 'TÜMSİAD Konferans Salonu',
    capacity: 50,
    registered: 28,
    status: 'open',
  },
  {
    id: 2,
    title: 'İhracat Teşvikleri Semineri',
    type: 'seminar',
    date: '28 Ekim 2024',
    time: '10:00',
    location: 'Dedeman Otel',
    capacity: 80,
    registered: 65,
    status: 'open',
  },
  {
    id: 3,
    title: 'Networking Kahvaltısı',
    type: 'networking',
    date: '30 Ekim 2024',
    time: '09:00',
    location: 'Hilton Garden Inn',
    capacity: 40,
    registered: 38,
    status: 'almost-full',
  },
]

const recentEvents = [
  {
    id: 1,
    title: 'İhracat Stratejileri Semineri',
    date: '15 Ekim 2024',
    attendees: 45,
    capacity: 50,
    satisfaction: 4.5,
    roi: 'Yüksek',
  },
  {
    id: 2,
    title: 'Networking Kahvaltısı',
    date: '20 Ekim 2024',
    attendees: 32,
    capacity: 40,
    satisfaction: 4.2,
    roi: 'Orta',
  },
  {
    id: 3,
    title: 'E-Ticaret Eğitimi',
    date: '18 Ekim 2024',
    attendees: 28,
    capacity: 35,
    satisfaction: 4.7,
    roi: 'Yüksek',
  },
]

interface Event {
  id: string
  title: string
  description?: string
  type: string
  startDate: string
  endDate?: string
  location?: string
  address?: string
  city: string
  capacity?: number
  cost?: number
  status: string
  createdAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [eventStats, setEventStats] = useState({
    total: 0,
    thisMonth: 0,
    upcoming: 0,
    avgAttendance: 0,
    satisfaction: 0,
  })
  const [loading, setLoading] = useState(true)
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [eventEditFormOpen, setEventEditFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('upcoming')
  const toast = useToastHelpers()

  // Fetch events data
  const fetchEvents = async () => {
    try {
      const [eventsResponse, statsResponse] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/analytics/event-stats')
      ])

      if (eventsResponse.ok && statsResponse.ok) {
        const [eventsData, statsData] = await Promise.all([
          eventsResponse.json(),
          statsResponse.json()
        ])

        setEvents(eventsData.events || [])
        setEventStats({
          total: statsData.totalEvents,
          thisMonth: statsData.thisYearEvents,
          upcoming: 0, // This would be calculated from events
          avgAttendance: statsData.avgParticipantsPerEvent,
          satisfaction: 4.3, // This would come from feedback data
        })
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Etkinlik verileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleEventAdded = () => {
    fetchEvents()
    toast.success('Etkinlik başarıyla eklendi!')
  }

  const handleEventUpdated = () => {
    fetchEvents()
    toast.success('Etkinlik başarıyla güncellendi!')
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchEvents()
        toast.success('Etkinlik başarıyla silindi!')
      } else {
        throw new Error('Etkinlik silinirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Etkinlik silinemedi')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedEvent(null)
    }
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.startDate) > new Date() && event.status === 'PLANNED'
  )

  const pastEvents = filteredEvents.filter(event => 
    new Date(event.startDate) <= new Date() || event.status === 'COMPLETED'
  )

  const currentEvents = filteredEvents.filter(event => 
    event.status === 'ONGOING'
  )

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
          <h1 className="text-3xl font-bold tracking-tight">Etkinlik Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Etkinlik planlama, takip ve performans analizi
          </p>
        </div>
        <Button onClick={() => setEventFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </div>

      <EventForm 
        open={eventFormOpen} 
        onOpenChange={setEventFormOpen}
        onSuccess={handleEventAdded}
      />

      <EventEditForm 
        open={eventEditFormOpen} 
        onOpenChange={setEventEditFormOpen}
        event={selectedEvent}
        onSuccess={handleEventUpdated}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Etkinliği Sil"
        description={`${selectedEvent?.title} etkinliğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        variant="destructive"
        onConfirm={handleDeleteEvent}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Toplam Etkinlik"
          value={eventStats.total}
          icon={Calendar}
          description="Bu yıl gerçekleşen"
        />
        <StatCard
          title="Bu Ay"
          value={eventStats.thisMonth}
          change={25}
          icon={Calendar}
        />
        <StatCard
          title="Yaklaşan"
          value={eventStats.upcoming}
          icon={Clock}
        />
        <StatCard
          title="Ort. Katılım"
          value={eventStats.avgAttendance}
          change={12}
          icon={Users}
        />
        <StatCard
          title="Memnuniyet"
          value={`${eventStats.satisfaction}/5`}
          icon={Award}
          description="Ortalama puan"
        />
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Yaklaşan Etkinlikler</TabsTrigger>
          <TabsTrigger value="past">Geçmiş Etkinlikler</TabsTrigger>
          <TabsTrigger value="analytics">Analitikler</TabsTrigger>
        </TabsList>

        {/* Upcoming Events */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Etkinlik ara..." 
                className="pl-9 w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {upcomingEvents.length} etkinlik bulundu
            </div>
          </div>
          
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <Badge variant={
                          event.status === 'PLANNED' ? 'default' : 
                          event.status === 'ONGOING' ? 'secondary' : 'outline'
                        }>
                          {event.status === 'PLANNED' ? 'Planlanan' : 
                           event.status === 'ONGOING' ? 'Devam Eden' : event.status}
                        </Badge>
                        <Badge variant="outline">
                          {event.type === 'CONFERENCE' ? 'Konferans' :
                           event.type === 'SEMINAR' ? 'Seminer' :
                           event.type === 'WORKSHOP' ? 'Workshop' :
                           event.type === 'NETWORKING' ? 'Networking' :
                           event.type === 'TRAINING' ? 'Eğitim' :
                           event.type === 'SOCIAL_RESPONSIBILITY' ? 'Sosyal Sorumluluk' :
                           event.type === 'MEETING' ? 'Toplantı' : 'Diğer'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.startDate).toLocaleDateString('tr-TR')} - {new Date(event.startDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Kapasite: {event.capacity}</span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setEventEditFormOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {upcomingEvents.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Yaklaşan etkinlik bulunmuyor</h3>
                  <p className="text-muted-foreground mb-4">
                    Henüz planlanmış etkinlik bulunmuyor. Yeni bir etkinlik ekleyin.
                  </p>
                  <Button onClick={() => setEventFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Etkinlik Ekle
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Past Events */}
        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geçmiş Etkinlik Performansı</CardTitle>
              <CardDescription>Son gerçekleştirilen etkinlikler ve değerlendirmeleri</CardDescription>
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
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{event.attendees}/{event.capacity}</p>
                        <p className="text-xs text-muted-foreground">Katılım</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{event.satisfaction}/5</p>
                        <p className="text-xs text-muted-foreground">Memnuniyet</p>
                      </div>
                      <Badge variant={event.roi === 'Yüksek' ? 'default' : 'secondary'}>
                        ROI: {event.roi}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <BarChart
              title="Etkinlik Türü Dağılımı"
              description="Gerçekleştirilen etkinliklerin kategorilere göre dağılımı"
              data={eventsByType}
              dataKey="count"
              xAxisKey="type"
            />
            <LineChart
              title="Katılım Trendi"
              description="Hedef ve gerçekleşen katılımcı sayıları"
              data={attendanceTrend}
              dataKey="hedef"
              xAxisKey="month"
              lines={[
                { key: 'hedef', name: 'Hedef', color: '#94a3b8' },
                { key: 'gerceklesen', name: 'Gerçekleşen', color: 'hsl(var(--primary))' },
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">En Başarılı Etkinlik Türü</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">Eğitim</p>
                  <p className="text-sm text-muted-foreground">
                    Ortalama 4.6/5 memnuniyet puanı
                  </p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>%95 katılım oranı</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ortalama Etkinlik Maliyeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">₺12,500</p>
                  <p className="text-sm text-muted-foreground">
                    Kişi başı: ₺357
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mekan, ikram ve materyal dahil
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Etkinlik Sıklığı Hedefi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">6/8</p>
                  <p className="text-sm text-muted-foreground">
                    Aylık hedef: 8 etkinlik
                  </p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-primary" style={{ width: '75%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Etkinlik Önerileri ve İyileştirmeler</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Eğitim etkinlikleri yüksek memnuniyet alıyor, sayısı artırılabilir</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>Networking etkinliklerinde katılım kapasitesi artırılmalı</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 mt-0.5">!</span>
                  <span>Sosyal sorumluluk projelerinin sayısı ve görünürlüğü artırılmalı</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Online/hibrit etkinlik formatları denenebilir (maliyet düşürme)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
