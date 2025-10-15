'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Users, 
  Target, 
  FileText, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

// TÜMSİAD Görev Tanımları ve Organizasyon Yapısı
const organizationalUnits = [
  {
    id: 1,
    name: 'Genel Başkanlık',
    description: 'TÜMSİAD Denizli Şubesi genel yönetimi ve stratejik kararlar',
    head: 'Genel Başkan',
    responsibilities: [
      'Genel kurul kararlarını uygulamak',
      'Şube faaliyetlerini koordine etmek',
      'Üst düzey protokol ilişkileri yürütmek',
      'Stratejik planlama ve hedef belirleme',
      'Bütçe onayı ve mali kontrol'
    ],
    members: ['Genel Başkan', 'Genel Başkan Yardımcısı'],
    status: 'active',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Yönetim Kurulu',
    description: 'Şube yönetimi ve karar alma organı',
    head: 'Yönetim Kurulu Başkanı',
    responsibilities: [
      'Aylık yönetim kurulu toplantıları',
      'Üye başvurularını değerlendirmek',
      'Etkinlik planlaması ve onayı',
      'Mali durum takibi',
      'Komisyon raporlarını değerlendirmek'
    ],
    members: ['7 Yönetim Kurulu Üyesi', 'Genel Sekreter', 'Mali İşler Sorumlusu'],
    status: 'active',
    priority: 'high'
  },
  {
    id: 3,
    name: 'Genel Sekreterlik',
    description: 'Şube sekretarya hizmetleri ve günlük işlemler',
    head: 'Genel Sekreter',
    responsibilities: [
      'Yazışma ve evrak takibi',
      'Toplantı tutanakları tutmak',
      'Üye kayıt ve güncellemeleri',
      'Arşiv yönetimi',
      'İletişim koordinasyonu'
    ],
    members: ['Genel Sekreter', 'Sekreterya Asistanı'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 4,
    name: 'Mali İşler Birimi',
    description: 'Mali işlemler, bütçe ve muhasebe yönetimi',
    head: 'Mali İşler Sorumlusu',
    responsibilities: [
      'Bütçe hazırlığı ve takibi',
      'Gelir-gider kayıtları',
      'Üyelik aidat takibi',
      'Mali raporlama',
      'Denetim koordinasyonu'
    ],
    members: ['Mali İşler Sorumlusu', 'Muhasebe Uzmanı'],
    status: 'active',
    priority: 'high'
  },
  {
    id: 5,
    name: 'Üye İşleri Komisyonu',
    description: 'Üye başvuruları, değerlendirme ve takip işlemleri',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Yeni üye başvurularını değerlendirmek',
      'Üye kriterlerini gözden geçirmek',
      'Üye memnuniyeti araştırmaları',
      'Üye kayıt güncellemeleri',
      'Üye iletişim kampanyaları'
    ],
    members: ['5 Komisyon Üyesi', 'Üye İşleri Uzmanı'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 6,
    name: 'Etkinlik ve Organizasyon Komisyonu',
    description: 'Şube etkinlikleri, toplantılar ve organizasyonlar',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Aylık etkinlik planlaması',
      'Toplantı organizasyonu',
      'Konferans ve seminer düzenleme',
      'Sosyal etkinlik koordinasyonu',
      'Sponsorluk ilişkileri'
    ],
    members: ['4 Komisyon Üyesi', 'Etkinlik Koordinatörü'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 7,
    name: 'İletişim ve Medya Komisyonu',
    description: 'Dijital iletişim, sosyal medya ve basın ilişkileri',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Sosyal medya yönetimi',
      'Web sitesi güncellemeleri',
      'Basın bülteni hazırlama',
      'Dijital içerik üretimi',
      'Medya ilişkileri'
    ],
    members: ['3 Komisyon Üyesi', 'İletişim Uzmanı'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 8,
    name: 'Eğitim ve Gelişim Komisyonu',
    description: 'Üye eğitimleri, seminerler ve kapasite geliştirme',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Eğitim ihtiyaç analizi',
      'Seminer ve workshop organizasyonu',
      'Eğitmen koordinasyonu',
      'Sertifika programları',
      'Mentorluk sistemi'
    ],
    members: ['4 Komisyon Üyesi', 'Eğitim Koordinatörü'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 9,
    name: 'Dış İlişkiler Komisyonu',
    description: 'Kamu kurumları, diğer STK\'lar ve iş dünyası ilişkileri',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Kamu kurumları ile ilişkiler',
      'Diğer STK\'larla işbirliği',
      'İş dünyası temsilciliği',
      'Protokol organizasyonları',
      'Uluslararası ilişkiler'
    ],
    members: ['3 Komisyon Üyesi', 'Dış İlişkiler Uzmanı'],
    status: 'active',
    priority: 'high'
  },
  {
    id: 10,
    name: 'Proje ve Ar-Ge Komisyonu',
    description: 'Proje geliştirme, araştırma ve inovasyon faaliyetleri',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Proje fırsatlarını takip etmek',
      'Proje önerileri hazırlamak',
      'Araştırma raporları',
      'İnovasyon programları',
      'Fon başvuruları'
    ],
    members: ['4 Komisyon Üyesi', 'Proje Uzmanı'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 11,
    name: 'Denetim Komisyonu',
    description: 'Mali ve idari denetim, uyumluluk kontrolü',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Mali denetim yapmak',
      'İç kontrol sistemi',
      'Uyumluluk raporları',
      'Risk değerlendirmesi',
      'Öneri ve iyileştirmeler'
    ],
    members: ['3 Komisyon Üyesi', 'Denetim Uzmanı'],
    status: 'active',
    priority: 'high'
  },
  {
    id: 12,
    name: 'Kadın Girişimciler Komisyonu',
    description: 'Kadın üyelerin özel ihtiyaçları ve girişimcilik destekleri',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Kadın girişimci destek programları',
      'Mentorluk ve koçluk',
      'Ağ oluşturma etkinlikleri',
      'Eğitim ve seminerler',
      'Başarı hikayeleri paylaşımı'
    ],
    members: ['5 Komisyon Üyesi', 'Kadın Girişimci Koordinatörü'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 13,
    name: 'Genç Girişimciler Komisyonu',
    description: 'Genç üyelerin gelişimi ve gençlik projeleri',
    head: 'Komisyon Başkanı',
    responsibilities: [
      'Genç girişimci mentorluk programı',
      'Startup destekleri',
      'Teknoloji ve inovasyon etkinlikleri',
      'Kariyer gelişim programları',
      'Gençlik projeleri'
    ],
    members: ['4 Komisyon Üyesi', 'Genç Girişimci Koordinatörü'],
    status: 'active',
    priority: 'medium'
  },
  {
    id: 14,
    name: 'Sektörel Komisyonlar',
    description: 'Sektör bazlı özel komisyonlar ve çalışma grupları',
    head: 'Koordinatör',
    responsibilities: [
      'Tekstil Sektör Komisyonu',
      'Gıda Sektör Komisyonu',
      'Teknoloji Sektör Komisyonu',
      'İnşaat Sektör Komisyonu',
      'Hizmet Sektör Komisyonu'
    ],
    members: ['Her sektörden 3-5 temsilci'],
    status: 'active',
    priority: 'medium'
  }
]

export default function BirimlerPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'inactive': return 'Pasif'
      case 'pending': return 'Beklemede'
      default: return 'Bilinmiyor'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek Öncelik'
      case 'medium': return 'Orta Öncelik'
      case 'low': return 'Düşük Öncelik'
      default: return 'Öncelik Belirtilmemiş'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Birimler ve Görev Tanımları
          </h1>
          <p className="text-muted-foreground mt-2">
            TÜMSİAD Denizli Şubesi organizasyon yapısı ve görev dağılımları
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Birim</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationalUnits.length}</div>
            <p className="text-xs text-muted-foreground">
              Organizasyon birimi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Birim</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizationalUnits.filter(unit => unit.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Faal durumda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yüksek Öncelik</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizationalUnits.filter(unit => unit.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Kritik birimler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görev</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizationalUnits.reduce((total, unit) => total + unit.responsibilities.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Görev tanımı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organizational Units Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizationalUnits.map((unit) => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {unit.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(unit.status)}>
                    {getStatusText(unit.status)}
                  </Badge>
                  <Badge className={getPriorityColor(unit.priority)}>
                    {getPriorityText(unit.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Head */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Başkan:</span>
                <span className="text-sm">{unit.head}</span>
              </div>

              {/* Members */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Üyeler:</span>
                </div>
                <div className="ml-6 space-y-1">
                  {unit.members.map((member, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {member}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Responsibilities */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Görevler:</span>
                </div>
                <div className="ml-6 space-y-1">
                  {unit.responsibilities.slice(0, 3).map((responsibility, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {responsibility}
                    </div>
                  ))}
                  {unit.responsibilities.length > 3 && (
                    <div className="text-sm text-muted-foreground italic">
                      +{unit.responsibilities.length - 3} görev daha...
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Action Button */}
              <Button variant="outline" className="w-full" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Detaylı Görev Tanımı
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization Chart Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Organizasyon Yapısı Hakkında
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Yönetim Hiyerarşisi</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Genel Başkanlık (En üst yönetim)</li>
                <li>• Yönetim Kurulu (Karar alma organı)</li>
                <li>• Genel Sekreterlik (İcra organı)</li>
                <li>• Komisyonlar (Uzmanlık alanları)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Çalışma Prensibi</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Aylık komisyon toplantıları</li>
                <li>• Üç aylık raporlama sistemi</li>
                <li>• Yıllık genel kurul değerlendirmesi</li>
                <li>• Sürekli gelişim ve iyileştirme</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
