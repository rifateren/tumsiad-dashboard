# Production Database Seed Guide

## Hızlı Başlangıç

### 1. Database URL'ini Alın

Vercel Dashboard'da:
- **Storage** → **Database** → **".env.local"** sekmesi
- `DATABASE_URL` değerini kopyalayın

### 2. Local'de Seed Çalıştırın

```bash
# Windows PowerShell
$env:DATABASE_URL="your-production-url-here"
npx tsx scripts/seed-production.ts

# Mac/Linux
DATABASE_URL="your-production-url-here" npx tsx scripts/seed-production.ts
```

### 3. Veya Vercel'de SQL Console Kullanın

Vercel Dashboard → Storage → Database → "Data" → "Query"

```sql
-- Test üyesi ekle
INSERT INTO "Member" (
  id, "firstName", "lastName", email, city, 
  status, "membershipDate", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'Ahmet',
  'Yılmaz',
  'ahmet@tumsiad.org',
  'Denizli',
  'ACTIVE',
  NOW(),
  NOW(),
  NOW()
);

-- Test etkinlik ekle
INSERT INTO "Event" (
  id, title, type, "startDate", city,
  status, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'Dijital Dönüşüm Semineri',
  'SEMINAR',
  NOW() + INTERVAL '7 days',
  'Denizli',
  'PLANNED',
  NOW(),
  NOW()
);

-- TÜMSİAD competitor ekle
INSERT INTO "Competitor" (
  id, name, "shortName", website, "memberCount"
) VALUES (
  gen_random_uuid(),
  'TÜMSİAD',
  'TÜMSİAD',
  'https://www.tumsiad.org',
  150
);

-- Yukarıdaki INSERT'ten dönen ID'yi kullanarak:
-- (Önce SELECT * FROM "Competitor" ile ID'yi alın)

-- Digital metric ekle
INSERT INTO "DigitalMetric" (
  id, "competitorId", "metricType", value, "overallScore", date
) VALUES (
  gen_random_uuid(),
  'competitor-id-buraya',  -- Yukarıdaki Competitor ID'sini buraya
  'SEO',
  70,
  70,
  NOW()
);

-- Social media stats ekle
INSERT INTO "SocialMediaStat" (
  id, "competitorId", platform, followers, date
) VALUES 
  (gen_random_uuid(), 'competitor-id-buraya', 'INSTAGRAM', 2800, NOW()),
  (gen_random_uuid(), 'competitor-id-buraya', 'TWITTER', 1200, NOW()),
  (gen_random_uuid(), 'competitor-id-buraya', 'FACEBOOK', 4500, NOW());
```

## Hızlı Test

Dashboard'u yenileyin ve şunları kontrol edin:
- Ana sayfa istatistikleri görünüyor mu?
- Üyeler sayfasında üye var mı?
- Etkinlikler sayfasında etkinlik var mı?
- Analiz sayfasında rakip verileri var mı?

## Sorun Giderme

### "Cannot read properties of undefined"
- Database'de veri yok
- Yukarıdaki SQL komutlarını çalıştırın

### "Connection refused"
- DATABASE_URL yanlış
- Vercel'den doğru URL'i kopyalayın

### "Table doesn't exist"
- Migration çalışmamış
- Vercel'de otomatik çalışmalı, kontrol edin

