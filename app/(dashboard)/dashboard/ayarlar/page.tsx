'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, RefreshCw, CheckCircle, XCircle, Key } from 'lucide-react'

export default function SettingsPage() {
  const [apiStatus, setApiStatus] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    checkApiStatus()
  }, [])

  async function checkApiStatus() {
    try {
      const response = await fetch('/api/social-media/update')
      const data = await response.json()
      
      // Sadece 3 platformu göster
      const filteredApis = {
        twitter: data.apis?.twitter || false,
        instagram: data.apis?.instagram || false,
        facebook: data.apis?.facebook || false,
      }
      
      const enabledCount = Object.values(filteredApis).filter(Boolean).length
      
      setApiStatus({
        apis: filteredApis,
        enabled: Object.entries(filteredApis)
          .filter(([_, enabled]) => enabled)
          .map(([api]) => api),
        total: enabledCount,
      })
    } catch (error) {
      console.error('API status check error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateCompetitor(competitor: string) {
    setUpdating(competitor)
    try {
      const response = await fetch('/api/social-media/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ competitor }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`${competitor} verileri başarıyla güncellendi!\n\nGüncellenen:\n${Object.keys(data.data || {}).join(', ')}`)
      } else {
        alert(`Hata: ${data.error}`)
      }
    } catch (error) {
      alert('Güncelleme sırasında bir hata oluştu')
      console.error(error)
    } finally {
      setUpdating(null)
    }
  }

  async function updateAll() {
    setUpdating('all')
    try {
      const response = await fetch('/api/social-media/update-all', {
        method: 'POST',
      })

      const data = await response.json()
      
      if (data.success) {
        const successCount = data.results.filter((r: any) => r.success).length
        alert(`Toplu güncelleme tamamlandı!\n\n${successCount}/3 competitor başarıyla güncellendi`)
      } else {
        alert(`Hata: ${data.error}`)
      }
    } catch (error) {
      alert('Toplu güncelleme sırasında bir hata oluştu')
      console.error(error)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar & API Yönetimi</h1>
        <p className="text-muted-foreground mt-2">
          Sosyal medya API entegrasyonları ve sistem ayarları
        </p>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Durum Kontrolü
          </CardTitle>
          <CardDescription>
            Aktif API entegrasyonları ve yapılandırma durumu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Kontrol ediliyor...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(apiStatus.apis || {}).map(([api, enabled]: [string, any]) => (
                <div key={api} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {enabled ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium capitalize">{api} API</p>
                      <p className="text-xs text-muted-foreground">
                        {enabled ? 'Yapılandırılmış ve hazır' : 'API key eklenmemiş'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={enabled ? 'default' : 'secondary'}>
                    {enabled ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              ))}

              {apiStatus.enabled && apiStatus.enabled.length === 0 && (
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Henüz API key eklenmemiş. Lütfen .env dosyasına API key'lerinizi ekleyin.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Rehber: <code className="bg-muted px-2 py-1 rounded">API_SETUP_GUIDE.md</code>
                  </p>
                </div>
              )}

              {apiStatus.enabled && apiStatus.enabled.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">
                    ✅ {apiStatus.total} API aktif: {apiStatus.enabled.join(', ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bu API'ler ile otomatik veri toplama yapılabilir
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Manuel Veri Güncelleme
          </CardTitle>
          <CardDescription>
            Rakip STK verilerini API'lerden manuel olarak güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Button
                onClick={() => updateCompetitor('TÜMSİAD')}
                disabled={updating !== null}
                variant="outline"
                className="w-full"
              >
                {updating === 'TÜMSİAD' ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    TÜMSİAD Güncelle
                  </>
                )}
              </Button>

              <Button
                onClick={() => updateCompetitor('MÜSİAD')}
                disabled={updating !== null}
                variant="outline"
                className="w-full"
              >
                {updating === 'MÜSİAD' ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    MÜSİAD Güncelle
                  </>
                )}
              </Button>

              <Button
                onClick={() => updateCompetitor('ASKON')}
                disabled={updating !== null}
                variant="outline"
                className="w-full"
              >
                {updating === 'ASKON' ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    ASKON Güncelle
                  </>
                )}
              </Button>
            </div>

            <Button
              onClick={updateAll}
              disabled={updating !== null}
              className="w-full"
            >
              {updating === 'all' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Tümü Güncelleniyor...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Hepsini Güncelle
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>API Kurulum Rehberi</CardTitle>
          <CardDescription>
            Sosyal medya API'lerini nasıl kuracağınıza dair adım adım rehber
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded">
              <h4 className="font-semibold mb-2">✨ AI Chat ile Manuel Güncelleme (API Gerektirmez)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Karşılaştırma veya Dijital Varlık sayfasına gidin</li>
                <li>• Sağ alttaki AI ikonuna (✨) tıklayın</li>
                <li>• Komut verin: "MÜSİAD Instagram 9000"</li>
                <li>• <strong>Anında güncellenir!</strong> API'ye gerek yok</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded">
              <h4 className="font-semibold mb-2">1. Twitter API (30 dakika) - Önerilen</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• developer.twitter.com'da hesap açın</li>
                <li>• App oluşturun → Bearer Token alın</li>
                <li>• .env'ye ekleyin</li>
                <li>• <strong>Free tier:</strong> Aylık 500K tweet okuma</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded">
              <h4 className="font-semibold mb-2">2. Instagram & Facebook (1 saat)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• developers.facebook.com'da App oluşturun</li>
                <li>• Instagram Business hesabı bağlayın</li>
                <li>• Access Token alın ve .env'ye ekleyin</li>
                <li>• <strong>Dikkat:</strong> Business hesap gerekli</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20 rounded">
              <h4 className="font-semibold mb-2">📚 Detaylı Rehber</h4>
              <p className="text-sm text-muted-foreground">
                Adım adım kurulum için: <code className="bg-muted px-2 py-1 rounded">QUICK_START_API.md</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Veri Kaynakları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 border-b">
              <span>Üye Verileri</span>
              <Badge variant="default">Manuel Giriş</Badge>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Etkinlik Verileri</span>
              <Badge variant="default">Manuel Giriş</Badge>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Dijital Skorlar</span>
              <Badge variant="secondary">
                {apiStatus.apis?.pagespeed ? 'API Hazır' : 'Manuel Değerler'}
              </Badge>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Sosyal Medya</span>
              <Badge variant="secondary">
                {apiStatus.total > 0 ? `${apiStatus.total} API Aktif` : 'Manuel Değerler'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
