'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, X, Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToastHelpers } from '@/components/ui/toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatWidgetProps {
  pageContext: 'analiz' | 'dijital-varlik'
}

export function ChatWidget({ pageContext }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: pageContext === 'analiz' 
        ? 'Merhaba! 👋 Veri güncellemek için:\n\n📱 SOSYAL MEDYA:\n• "MÜSİAD Instagram 8650"\n• "ASKON Facebook 4800"\n\n📅 ETKİNLİK SAYISI:\n• "MÜSİAD Haziran 8 etkinlik"\n• "ASKON Ekim 6 etkinlik"\n\n🔗 Veya link verin (bazen çalışır)\n\n💡 Manuel giriş en doğrusudur!'
        : 'Merhaba! 👋 Dijital metrikler için:\n\n✍️ KOMUT YAZIN:\n• "SEO skoru 75"\n• "Sayfa hızı 80"\n• "Instagram 2800"\n\n💡 Manuel değerlendirme en doğrusudur!',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToastHelpers()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const parseCommand = (command: string) => {
    const lower = command.toLowerCase()
    
    // URL tespit et
    const urlMatch = command.match(/(https?:\/\/[^\s]+)/)
    const isUrl = !!urlMatch
    const url = urlMatch ? urlMatch[1] : null
    
    // STK ismi tespit et - Basit includes (en güvenilir)
    let stk = null
    const upperCommand = command.toUpperCase()
    
    // MÜSİAD - Direkt string kontrolü
    if (command.includes('MÜSİAD') || command.includes('MÜSIAD') || 
        command.includes('müsiad') || command.includes('musiad') ||
        command.includes('Müsiad') || command.includes('MUSİAD') ||
        upperCommand.includes('MUSIAD')) {
      stk = 'MÜSİAD'
    }
    // TÜMSİAD
    else if (command.includes('TÜMSİAD') || command.includes('TUMSIAD') ||
             command.includes('tümsiad') || command.includes('tumsiad') ||
             command.includes('Tümsiad') || command.includes('TUMSİAD') ||
             upperCommand.includes('TUMSIAD')) {
      stk = 'TÜMSİAD'
    }
    // ASKON
    else if (upperCommand.includes('ASKON')) {
      stk = 'ASKON'
    }

    // Platform tespit et
    const platform = /instagram|insta/i.test(command) ? 'instagram' :
                     /twitter|x\.com/i.test(command) ? 'twitter' :
                     /facebook|fb/i.test(command) ? 'facebook' : null

    // Metrik tipi tespit et
    const metric = /seo/i.test(command) ? 'seo' :
                   /h[ıi]z|speed|performance/i.test(command) ? 'pageSpeed' :
                   /mobil|mobile/i.test(command) ? 'mobile' :
                   /[iı][çc]erik|content/i.test(command) ? 'content' : null

    // Sayı tespit et - tüm sayıları bul
    const numbers = command.match(/\d+/g)
    const value = numbers && numbers.length > 0 ? parseInt(numbers[numbers.length - 1]) : null

    console.log('🔍 Debug:', { 
      original: command,
      upperCommand,
      stk, 
      platform, 
      metric, 
      value,
      'İçinde MÜSİAD var mı': command.includes('MÜSİAD'),
      'İçinde müsiad var mı': command.includes('müsiad'),
      'UPPER MUSIAD var mı': upperCommand.includes('MUSIAD')
    })

    return { stk, platform, metric, value, command, isUrl, url }
  }

  const handleSend = async () => {
    if (!input.trim() || processing) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setProcessing(true)

    try {
      const parsed = parseCommand(input)
      console.log('🔍 Parse sonucu:', parsed) // Debug için
      let response = ''
      let updateSuccess = false

      // URL verilmişse otomatik scrape et
      if (parsed.isUrl && parsed.url) {
        response = `🔍 Link analiz ediliyor...\n${parsed.url}\n\n`
        
        try {
          const scrapeResponse = await fetch('/api/scrape-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: parsed.url }),
          })

          const scrapeData = await scrapeResponse.json()

          if (scrapeData.success) {
            response += `✅ ${scrapeData.platform.toUpperCase()} hesabı tespit edildi!\n\n`
            response += `📊 Takipçi sayısı: ${scrapeData.followers.toLocaleString()}\n`
            
            if (scrapeData.stk) {
              response += `🏢 STK: ${scrapeData.stk}\n\n`
              response += `🔄 Database'e kaydediliyor...\n\n`

              // Database'e kaydet
              const updateResponse = await fetch('/api/ai-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  competitor: scrapeData.stk,
                  platform: scrapeData.platform,
                  value: scrapeData.followers,
                  type: 'social_media',
                }),
              })

              const updateData = await updateResponse.json()
              updateSuccess = updateData.success

              if (updateSuccess) {
                response += `✅ ${scrapeData.stk} ${scrapeData.platform} verileri güncellendi!\n📊 Sayfayı yenileyin.`
              } else {
                response += `❌ Güncelleme başarısız: ${updateData.error}`
              }
            } else {
              response += `⚠️ STK tespit edilemedi. Link'te musiad, tumsiad veya askon kelimesi olmalı.\n\n`
              response += `Manuel güncelleme için: "${scrapeData.platform} ${scrapeData.followers}" yazabilirsiniz.`
            }
          } else {
            response += `❌ Link'ten otomatik çekemedim (${scrapeData.error})\n\n`
            
            // Platform ve STK tespit edilmişse rehberlik et
            if (scrapeData.platform && scrapeData.stk) {
              response += `📝 Kolay çözüm:\n\n`
              response += `1. Link'i tarayıcınızda açın\n`
              response += `2. Takipçi sayısını görün\n`
              response += `3. Bana yazın: "${scrapeData.stk} ${scrapeData.platform} [sayı]"\n\n`
              response += `Örnek: "${scrapeData.stk} ${scrapeData.platform} 12000"\n\n`
              response += `⚡ Facebook/Twitter bazen bot koruması kullanır, manuel giriş en doğrusu!`
            } else {
              response += `💡 Manuel güncelleme yapabilirsiniz:\n\n`
              response += `Örnek:\n• "MÜSİAD Instagram 8650"\n• "ASKON Facebook 4800"\n• "TÜMSİAD Twitter 1200"`
            }
          }
        } catch (error) {
          response += `❌ Link işlenirken hata oluştu. Manuel komut deneyin.`
        }

      // Etkinlik sayısı güncelleme
      } else if (parsed.stk && parsed.month && parsed.value && parsed.isEventCommand) {
        response = `🔄 ${parsed.stk} ${parsed.month} ayı etkinlik sayısını ${parsed.value} olarak güncelliyorum...\n\n`
        
        const updateResponse = await fetch('/api/ai-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            competitor: parsed.stk,
            month: parsed.month,
            value: parsed.value,
            type: 'event_count',
          }),
        })

        const data = await updateResponse.json()
        updateSuccess = data.success

        if (updateSuccess) {
          response += `✅ ${parsed.stk} ${parsed.month} ayı etkinlik sayısı güncellendi!\n\n📊 Sayfayı yenileyin.`
          toast.success(`${parsed.stk} etkinlik sayısı güncellendi!`)
        } else {
          response += `❌ Güncelleme başarısız: ${data.error}`
          toast.error('Etkinlik sayısı güncellenemedi')
        }

      // Normal komut işleme - Sosyal medya
      } else if (parsed.stk && parsed.platform && parsed.value) {
        // Sosyal medya güncellemesi
        response = `🔄 ${parsed.stk} ${parsed.platform} takipçi sayısını ${parsed.value} olarak güncelliyorum...\n\n`
        
        // API'ye güncelleme isteği gönder
        const updateResponse = await fetch('/api/ai-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            competitor: parsed.stk,
            platform: parsed.platform,
            value: parsed.value,
            type: 'social_media',
          }),
        })

        const data = await updateResponse.json()
        updateSuccess = data.success

        if (updateSuccess) {
          response += `✅ ${parsed.stk} ${parsed.platform} takipçi sayısı ${parsed.value} olarak güncellendi!\n\n📊 Sayfayı yenileyin veya "Yenile" butonuna tıklayın.`
          toast.success(`${parsed.stk} ${parsed.platform} güncellendi!`)
        } else {
          response += `❌ Güncelleme başarısız: ${data.error}`
          toast.error('Sosyal medya güncellenemedi')
        }

      } else if (parsed.metric && parsed.value) {
        // Web sitesi metrikleri güncellemesi
        response = `🔄 ${parsed.metric} skorunu ${parsed.value} olarak güncelliyorum...\n\n`
        
        const updateResponse = await fetch('/api/ai-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            competitor: 'TÜMSİAD',
            metric: parsed.metric,
            value: parsed.value,
            type: 'digital_metric',
          }),
        })

        const data = await updateResponse.json()
        updateSuccess = data.success

        if (updateSuccess) {
          response += `✅ ${parsed.metric} skoru ${parsed.value} olarak güncellendi!`
          toast.success(`${parsed.metric} skoru güncellendi!`)
        } else {
          response += `❌ Güncelleme başarısız: ${data.error}`
          toast.error('Metrik güncellenemedi')
        }

      } else {
        // Komut anlaşılamadı
        console.log('❌ Komut parse edilemedi:', {
          stk: parsed.stk,
          platform: parsed.platform,
          metric: parsed.metric,
          value: parsed.value,
          isUrl: parsed.isUrl
        })
        
        response = '❓ Komutu anlayamadım.\n\n'
        response += `Gördüklerim:\n`
        response += `STK: ${parsed.stk || 'bulunamadı'}\n`
        response += `Platform: ${parsed.platform || 'bulunamadı'}\n`
        response += `Sayı: ${parsed.value || 'bulunamadı'}\n\n`
        response += 'Doğru formatlar:\n\n'
        if (pageContext === 'analiz') {
          response += '📱 Sosyal Medya:\n'
          response += '• "MÜSİAD Instagram 9000"\n'
          response += '• "ASKON Facebook 5500"\n\n'
          response += '📅 Etkinlik:\n'
          response += '• "MÜSİAD Haziran 8 etkinlik"\n'
          response += '• "ASKON Ekim 6 etkinlik"'
        } else {
          response += '• "SEO skoru 75"\n'
          response += '• "Sayfa hızı 80"\n'
          response += '• "Instagram 2800"'
        }
      }

      // Asistan mesajını ekle
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // Başarılıysa sayfayı yenile
      if (updateSuccess) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }

    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">AI Asistan</h3>
                <p className="text-xs opacity-90">Veri güncelleme</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('tr-TR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">👤</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Link veya komut yazın..."
                disabled={processing}
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={processing || !input.trim()}
              >
                {processing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {pageContext === 'analiz' 
                ? '🔗 Link: instagram.com/musiaddenizli veya ✍️ "MÜSİAD Instagram 9000"'
                : '✍️ Örnek: "SEO skoru 75" veya 🔗 Link'}
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
