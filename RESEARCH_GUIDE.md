# TÜMSİAD Rakip Analiz Veri Toplama Rehberi

## 📋 Toplanan Veriler Şu An MOCK DATA!

**ÖNEMLİ:** Database'deki tüm rakip analiz verileri şu an **test/örnek verilerdir**. Gerçek verilerle değiştirilmesi gerekiyor.

## 🎯 Hangi Veriler Toplanmalı?

### 1. Web Sitesi Metrikleri

#### TÜMSİAD
- **URL:** https://www.tumsiad.org.tr
- **Toplanacak:**
  - SEO Skoru (0-100)
  - Sayfa Hızı (0-100)
  - Mobil Uyumluluk (0-100)
  - İçerik Kalitesi (0-100)

#### MÜSİAD
- **URL:** https://www.musiad.org.tr
- Aynı metrikler

#### ASKON
- **URL:** https://www.askon.org.tr
- Aynı metrikler

### 2. Sosyal Medya Metrikleri

Her STK için 5 platform:

| Platform | TÜMSİAD | MÜSİAD | ASKON |
|----------|---------|--------|-------|
| **LinkedIn** | ? | ? | ? |
| Takipçi | ? | ? | ? |
| Son 30 gün gönderi | ? | ? | ? |
| Engagement rate | ? | ? | ? |
| **Twitter/X** | ? | ? | ? |
| Takipçi | ? | ? | ? |
| Son 30 gün tweet | ? | ? | ? |
| Engagement rate | ? | ? | ? |
| **Instagram** | ? | ? | ? |
| Takipçi | ? | ? | ? |
| Son 30 gün post | ? | ? | ? |
| Engagement rate | ? | ? | ? |
| **Facebook** | ? | ? | ? |
| Takipçi/Beğeni | ? | ? | ? |
| Son 30 gün post | ? | ? | ? |
| Engagement rate | ? | ? | ? |
| **YouTube** | ? | ? | ? |
| Abone | ? | ? | ? |
| Son 30 gün video | ? | ? | ? |
| Görüntülenme | ? | ? | ? |

### 3. Üye ve Etkinlik Verileri

| Metrik | TÜMSİAD Denizli | MÜSİAD | ASKON |
|--------|-----------------|--------|-------|
| Toplam Üye | **78** (gerçek) | ? | ? |
| Denizli Üye | **78** | ? | ? |
| Yıllık Etkinlik | ? | ? | ? |

## 🔍 Veri Toplama Yöntemleri

### Yöntem 1: Manuel Araştırma (En Hızlı)

#### Web Sitesi Analizi:
```bash
1. Google PageSpeed Insights'a gidin
   https://pagespeed.web.dev/

2. Her STK web sitesini test edin:
   - tumsiad.org.tr
   - musiad.org.tr
   - askon.org.tr

3. Skorları not edin:
   - Performance (Sayfa Hızı)
   - Accessibility
   - Best Practices
   - SEO
```

#### Sosyal Medya:
```bash
1. Her STK'nın sosyal medya hesaplarını ziyaret edin

2. Not edin:
   LinkedIn:
   - Takipçi sayısı (profil sayfasında)
   - Son 30 gündeki gönderi sayısı (timeline'ı sayın)
   - Ortalama beğeni/yorum (10 gönderiyi ortala)

   Twitter:
   - Takipçi sayısı
   - Son 30 günde atılan tweet
   - Ortalama RT + Like

   Instagram:
   - Takipçi
   - Son 30 gün post
   - Ortalama like + comment

   Facebook:
   - Sayfa beğeni
   - Son 30 gün paylaşım
   - Ortalama engagement

   YouTube:
   - Abone sayısı
   - Son 30 gün video
   - Toplam görüntülenme
```

### Yöntem 2: API Kullanımı (Otomatik)

#### Gerekli API Key'ler:
```bash
# LinkedIn API
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Twitter API v2
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_BEARER_TOKEN=

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=

# Facebook Graph API
FACEBOOK_ACCESS_TOKEN=

# YouTube Data API
YOUTUBE_API_KEY=
```

#### Kurulum:
```bash
# Gerekli paketler
npm install puppeteer cheerio axios

# API key'leri .env dosyasına ekleyin
```

### Yöntem 3: Web Scraping (Yarı-Otomatik)

```typescript
// lib/scraper.ts dosyası hazır
// Puppeteer ile otomatik veri toplama

// Kullanım:
npx tsx lib/scraper.ts
```

## 📊 Verileri Database'e Aktarma

### Adım 1: Verileri Topla

Manuel veya otomatik yöntemle verileri toplayın.

### Adım 2: Import Script'ini Düzenle

```bash
# lib/real-data-import.ts dosyasını açın
# realData objesi içindeki değerleri güncelleyin
```

### Adım 3: Import Et

```bash
# Eski test verilerini temizleyip yeni verileri ekle
npx tsx lib/real-data-import.ts
```

### Adım 4: Doğrula

```bash
# Prisma Studio ile kontrol edin
npx prisma studio

# Veya API'den çekin
curl http://localhost:3000/api/competitors/comparison
```

## 🎯 Tavsiye Edilen Yaklaşım

### Hızlı Başlangıç (1-2 saat):
1. ✅ **Google PageSpeed Insights** ile web skorları
2. ✅ **Manuel sosyal medya kontrolü** (her platform 10 dakika)
3. ✅ **lib/real-data-import.ts** ile import

### Uzun Vadeli Çözüm:
1. 🔄 **API key'leri alın** (LinkedIn, Twitter, vb.)
2. 🔄 **Otomatik scraper kurun**
3. 🔄 **Günlük cron job** ile veri güncelleme
4. 🔄 **Trend analizi** için geçmiş verileri sakla

## 📅 Veri Güncelleme Sıklığı

| Metrik | Önerilen Sıklık | Neden |
|--------|-----------------|-------|
| Web Sitesi Skorları | Haftalık | Çok sık değişmez |
| Sosyal Medya Takipçi | Günlük | Sürekli büyür |
| Gönderi Sayısı | Günlük | Aktif hesaplar günlük paylaşır |
| Engagement Oranı | Haftalık | Ortalaması alınır |
| Üye Sayıları | Aylık | Yavaş değişir |

## 🚨 Önemli Notlar

1. **Etik Scraping:** 
   - robots.txt'e uyun
   - Rate limiting kullanın
   - API TOS'u kontrol edin

2. **KVKK Uyumu:**
   - Kişisel veri toplamayın
   - Sadece public veriler

3. **Veri Doğruluğu:**
   - İki kaynaktan doğrulayın
   - Anormal değerleri kontrol edin

## 📞 Yardım

Bu verileri toplamanızda yardımcı olmamı ister misiniz?
- Manuel araştırma için template
- API entegrasyonu
- Web scraper implementasyonu

Hangisini tercih edersiniz?
