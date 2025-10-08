# Sosyal Medya API Kurulum Rehberi

Dashboard'da gerçek zamanlı sosyal medya verilerini kullanmak için API entegrasyonları kurulumu.

## 🎯 Genel Bakış

Platform'unuz artık şu API'leri destekliyor:
- ✅ Twitter/X API v2
- ✅ YouTube Data API v3
- ✅ Instagram Graph API
- ✅ Facebook Graph API
- ✅ LinkedIn API
- ✅ Google PageSpeed Insights API

## 🔑 API Key Alma Rehberi

### 1. YouTube Data API v3 (ÖNERİLEN - ÜCRETSIZ)

YouTube en kolay ve ücretsiz API'dir.

#### Adımlar:
1. **Google Cloud Console'a gidin**
   - https://console.cloud.google.com/

2. **Yeni proje oluşturun**
   - "New Project" → "TÜMSİAD Dashboard"

3. **YouTube Data API v3'ü aktif edin**
   - "APIs & Services" → "Enable APIs and Services"
   - "YouTube Data API v3" arayın ve Enable edin

4. **API Key oluşturun**
   - "Credentials" → "Create Credentials" → "API Key"
   - Key'inizi kopyalayın

5. **.env dosyasına ekleyin**
   ```bash
   YOUTUBE_API_KEY="AIzaSy..."
   ```

**Limitler:** Günlük 10,000 quota (yeterli)

---

### 2. Twitter/X API v2 (ÜCRETSIZ TIER)

#### Adımlar:
1. **Developer Portal'a gidin**
   - https://developer.twitter.com/

2. **Hesap oluşturun**
   - "Sign up" ile developer hesabı açın
   - Kullanım amacınızı belirtin

3. **App oluşturun**
   - "Create App" → App adı verin
   - User authentication ayarlarını yapın

4. **Keys alın**
   - "Keys and tokens" sekmesinden:
     - API Key
     - API Secret  
     - Bearer Token

5. **.env dosyasına ekleyin**
   ```bash
   TWITTER_API_KEY="your-api-key"
   TWITTER_API_SECRET="your-api-secret"
   TWITTER_BEARER_TOKEN="your-bearer-token"
   ```

**Limitler:** Aylık 500,000 tweet okuma (Free tier)

---

### 3. Google PageSpeed Insights API (ÜCRETSIZ)

#### Adımlar:
1. **Google Cloud Console** (YouTube ile aynı proje)

2. **PageSpeed Insights API'yi aktif edin**
   - "APIs & Services" → "PageSpeed Insights API"
   - Enable edin

3. **Aynı API Key'i kullanın**
   ```bash
   PAGESPEED_API_KEY="AIzaSy..."  # YouTube key'i ile aynı olabilir
   ```

**Limitler:** Günlük 25,000 istek

---

### 4. Facebook Graph API (ORTA SEVİYE)

Facebook ve Instagram aynı API'yi kullanır.

#### Adımlar:
1. **Facebook Developers'a gidin**
   - https://developers.facebook.com/

2. **Uygulama oluşturun**
   - "My Apps" → "Create App"
   - Tip: "Business"

3. **Facebook Login ekleyin**
   - "Add Product" → "Facebook Login"

4. **Sayfa Access Token alın**
   - Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Sayfa seçin → "Get Token" → "Get Page Access Token"
   - Permissions: pages_read_engagement, pages_show_list

5. **.env dosyasına ekleyin**
   ```bash
   FACEBOOK_ACCESS_TOKEN="your-page-access-token"
   FACEBOOK_PAGE_ID="your-page-id"
   ```

**Limitler:** Standart rate limits

---

### 5. Instagram Graph API (ORTA SEVİYE)

Instagram için **Business Account** gerekir.

#### Ön Gereksinimler:
- Instagram Business hesabı
- Facebook sayfası (Instagram'a bağlı)
- Facebook App (yukarıda oluşturdunuz)

#### Adımlar:
1. **Instagram'ı Business'a çevirin**
   - Instagram app → Settings → Account Type → Switch to Professional Account

2. **Facebook sayfasına bağlayın**
   - Instagram → Settings → Account → Linked Accounts → Facebook

3. **Business Account ID bulun**
   - Graph API Explorer'da: `me?fields=instagram_business_account`

4. **.env dosyasına ekleyin**
   ```bash
   INSTAGRAM_ACCESS_TOKEN="your-facebook-page-token"
   INSTAGRAM_BUSINESS_ACCOUNT_ID="your-instagram-business-id"
   ```

---

### 6. LinkedIn API (ZORDUR - İZİN GEREKİR)

LinkedIn API en katı onay sürecine sahiptir.

#### Adımlar:
1. **LinkedIn Developers**
   - https://www.linkedin.com/developers/

2. **App oluştur**
   - "Create App"
   - Şirket sayfası seçin

3. **Verification**
   - LinkedIn tarafından manuel onay gerekir
   - İş e-postası ve şirket doğrulaması

4. **Access Token**
   - OAuth 2.0 flow ile token alın

**Not:** LinkedIn API erişimi zor, manuel kontrol önerilir.

---

## 🚀 Kurulum ve Test

### 1. API Key'leri Ekleyin

`.env` dosyasını düzenleyin (eğer yoksa `.env.example`'ı kopyalayın):

```bash
cp .env.example .env
# Sonra .env dosyasını düzenleyin
```

### 2. API Durumunu Kontrol Edin

```bash
# Hangi API'lerin aktif olduğunu görün
curl http://localhost:3000/api/social-media/update
```

Yanıt:
```json
{
  "message": "Sosyal Medya API Durumu",
  "apis": {
    "twitter": true,   // ✅ Aktif
    "youtube": true,   // ✅ Aktif
    "instagram": false // ❌ Key yok
  }
}
```

### 3. Manuel Güncelleme Tetikle

```bash
# TÜMSİAD verilerini güncelle
curl -X POST http://localhost:3000/api/social-media/update \
  -H "Content-Type: application/json" \
  -d '{"competitor": "TÜMSİAD"}'

# MÜSİAD verilerini güncelle
curl -X POST http://localhost:3000/api/social-media/update \
  -H "Content-Type: application/json" \
  -d '{"competitor": "MÜSİAD"}'
```

### 4. Otomatik Güncelleme (Cron Job)

Production'da günlük otomatik güncelleme için:

**Vercel Cron (Önerilen):**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/social-media/update-all",
    "schedule": "0 2 * * *"  // Her gün saat 02:00
  }]
}
```

**Node-Cron:**
```typescript
// lib/cron.ts
import cron from 'node-cron'

// Her gün saat 02:00
cron.schedule('0 2 * * *', async () => {
  await fetch('http://localhost:3000/api/social-media/update', {
    method: 'POST',
    body: JSON.stringify({ competitor: 'TÜMSİAD' })
  })
})
```

## 📊 Hangi API'leri Kullanmalısınız?

### Hızlı Başlangıç (30 dakika):
1. ✅ **YouTube API** - En kolay, ücretsiz
2. ✅ **PageSpeed API** - Ücretsiz, kolay
3. ✅ **Twitter API** - Free tier yeterli

### Orta Seviye (2 saat):
4. ⚠️ **Facebook API** - App kurulumu gerekli
5. ⚠️ **Instagram API** - Business hesap + Facebook App

### İleri Seviye (zor):
6. 🔴 **LinkedIn API** - Onay süreci, alternatif: manuel

## 🔧 Test Etme

### YouTube API Test:
```typescript
// lib/test-youtube.ts
import { getYouTubeMetrics } from './social-media-api'

async function test() {
  const data = await getYouTubeMetrics('UC_x5XG1OV2P6uZZ5FSM9Ttw') // Google Developers
  console.log(data)
}

test()
```

```bash
npx tsx lib/test-youtube.ts
```

### Twitter API Test:
```typescript
// lib/test-twitter.ts
import { getTwitterMetrics } from './social-media-api'

async function test() {
  const data = await getTwitterMetrics('elonmusk')
  console.log(data)
}

test()
```

## ⚠️ Önemli Notlar

### Rate Limits
Her API'nin limitleri var:
- YouTube: 10,000 quota/gün
- Twitter: 500,000 tweet okuma/ay (Free)
- PageSpeed: 25,000 istek/gün
- Facebook/Instagram: Standart limits

### Güvenlik
- ❌ `.env` dosyasını GitHub'a commit ETMEYİN
- ✅ `.gitignore`'da olduğundan emin olun
- ✅ Production'da environment variables kullanın

### Maliyetler
- **Ücretsiz:** YouTube, PageSpeed, Twitter (limited)
- **Ücretli:** Twitter (Pro: $100/ay), LinkedIn (Enterprise)

## 🎯 Önerilen Yaklaşım

### Faz 1: Hızlı Başlangıç (Bugün)
```bash
1. YouTube API key alın (15 dk)
2. PageSpeed API key alın (5 dk)  
3. .env dosyasına ekleyin
4. Test edin
```

### Faz 2: Genişletme (Hafta içi)
```bash
1. Twitter API başvurusu
2. Facebook App oluşturma
3. Tüm competitor'lar için güncelleme
```

### Faz 3: Otomasyon (Sonraki hafta)
```bash
1. Cron job kurulumu
2. Günlük otomatik güncelleme
3. Error handling ve logging
```

## 📞 Yardım

API kurulumunda sorun yaşarsanız:
- YouTube: [Hızlı başlangıç](https://developers.google.com/youtube/v3/getting-started)
- Twitter: [Developer portal](https://developer.twitter.com/en/portal/dashboard)
- Facebook: [App dashboard](https://developers.facebook.com/apps/)

---

**Hazırlayan:** TÜMSİAD Dashboard AI Assistant  
**Tarih:** 8 Ekim 2024  
**Durum:** API altyapısı hazır, key'ler eklendikçe aktif olacak
