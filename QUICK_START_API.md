# 🚀 Sosyal Medya API Kurulumu

Sadece 3 platform: Twitter, Instagram, Facebook

## Twitter API (En Kolay - ÖNERİLEN)

### 1. Twitter Developer Portal
https://developer.twitter.com/en/portal/dashboard

### 2. Developer Hesabı Oluştur
```
1. "Sign up" ile developer hesabı açın
2. Email doğrulama yapın
3. Kullanım amacı: "Analytics and monitoring for business association"
4. Onay bekleyin (genelde hemen)
```

### 3. Proje ve App Oluştur
```
1. "Create Project" → Ad: "TÜMSİAD Dashboard"
2. Use case: "Making a bot"
3. "Create App" → Ad: "tumsiad-analytics"
4. Environment: "Development"
```

### 4. Bearer Token Al
```
1. App dashboard'ınızda "Keys and tokens" sekmesine gidin
2. "Bearer Token" altında "Generate" tıklayın
3. Token'ı kopyalayın (güvenli yerde saklayın!)
   Örnek: AAAAAAAAAAAAA...
```

### 5. .env Dosyasına Ekle
```bash
TWITTER_BEARER_TOKEN="AAAAAAAAAAAAA..."
```

### 6. Test Et
```bash
# Sunucuyu yeniden başlatın
npm run dev

# AI Chat'ten test:
# Karşılaştırma sayfasında sağ alttaki AI ikonuna tıklayın
# Yazın: "MÜSİAD Twitter 4500"
```

✅ **Tebrikler!** Twitter API entegrasyonu hazır.

---

## Instagram & Facebook API (1 Saat)

Instagram ve Facebook aynı API sistemini kullanır (Meta Graph API)

### 1. Facebook Developers
https://developers.facebook.com/

### 2. Uygulama Oluştur
```
1. "My Apps" → "Create App"
2. Tip: "Business"
3. Ad: "TÜMSİAD Analytics"
```

### 3. Instagram Business Hesabı Hazırla
```
1. Instagram'ı Business hesaba çevirin
2. Facebook sayfası oluşturun
3. Instagram'ı Facebook sayfasına bağlayın
```

### 4. Access Token Al
```
1. Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Uygulamanızı seçin
3. "Get Token" → "Get Page Access Token"
4. Permissions: pages_read_engagement, instagram_basic, instagram_manage_insights
```

### 5. .env'ye Ekle
```bash
FACEBOOK_ACCESS_TOKEN="EAABsb..."
INSTAGRAM_ACCESS_TOKEN="EAABsb..."  # Aynı token
INSTAGRAM_BUSINESS_ACCOUNT_ID="17841..." # Instagram ID
```

✅ Instagram & Facebook hazır!

---

## 🧪 Test Etme - AI Chat ile!

### 1. Dashboard'da AI Chat'i Açın
```
1. http://localhost:3000/dashboard/analiz adresine gidin
2. Sağ altta yuvarlak AI ikonu görünecek (✨)
3. İkona tıklayın
```

### 2. Komut Verin
```
Örnek komutlar:

"MÜSİAD Instagram 9000"
→ MÜSİAD'ın Instagram takipçi sayısını 9000 yapar

"TÜMSİAD Twitter 1500"  
→ TÜMSİAD'ın Twitter takipçisini 1500 yapar

"ASKON Facebook 5500"
→ ASKON'un Facebook beğenisini 5500 yapar
```

### 3. Başarı Mesajı
```
✅ MÜSİAD instagram takipçi sayısı 9000 olarak güncellendi!
📊 Sayfayı yenileyin veya "Yenile" butonuna tıklayın.
```

### 4. Dijital Varlık Sayfasında:
```
http://localhost:3000/dashboard/dijital-varlik

AI Chat'e yazın:
"SEO skoru 75"
"Sayfa hızı 80"
"Mobil skor 85"
```

---

## 🎯 Şu An Çalışan Özellikler

### Manuel Güncelleme (API olmadan):
✅ **AI Chat** - Sağ alttaki AI ikonu
- Komutla veri güncelleme
- "MÜSİAD Instagram 9000" → anında günceller
- "SEO skoru 75" → dijital metrikleri günceller

### API ile Otomatik (Key eklendikten sonra):
✅ **Twitter API**
- Takipçi sayısı otomatik çekilir
- Tweet sayısı
- Verified durumu

✅ **Instagram Graph API**
- Takipçi sayısı
- Post sayısı
- Engagement

✅ **Facebook Graph API**
- Sayfa beğenisi
- Takipçi
- Engagement

---

## 📅 Otomatik Güncelleme (İsteğe Bağlı)

### Vercel Cron (Production'da):
```json
// vercel.json
{
  "crons": [{
    "path": "/api/social-media/update-all",
    "schedule": "0 2 * * *"
  }]
}
```

### Node Cron (Local):
```bash
npm install node-cron
```

```typescript
// lib/cron.ts
import cron from 'node-cron'

// Her gün saat 02:00'de çalış
cron.schedule('0 2 * * *', async () => {
  await fetch('http://localhost:3000/api/social-media/update-all', {
    method: 'POST'
  })
})
```

---

## ⚠️ Önemli Notlar

1. **API Limitler:**
   - YouTube: 10,000/gün (yeterli)
   - Twitter: 500,000/ay (yeterli)
   - PageSpeed: 25,000/gün (yeterli)

2. **Güvenlik:**
   - `.env` dosyasını GitHub'a COMMIT ETMEYİN
   - Production'da Vercel/Railway environment variables kullanın

3. **Maliyet:**
   - YouTube: ✅ Ücretsiz
   - Twitter: ✅ Free tier yeterli
   - PageSpeed: ✅ Ücretsiz
   - Instagram/Facebook: ⚠️ Free ama kurulum karmaşık
   - LinkedIn: ❌ Onay gerekli

---

## 🎊 Tamamlama Süresi

- **Minimum (15 dk):** YouTube API → Temel analiz çalışır
- **Önerilen (45 dk):** YouTube + Twitter + PageSpeed → Güçlü analiz
- **Full (2-3 saat):** Tüm platformlar → Tam otomasyon

Başlamak için: **YouTube API** ile başlayın! 🚀
