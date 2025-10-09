-- TÜMSİAD Dashboard - Quick Production Seed
-- Vercel SQL Console'da çalıştırın

-- 1. TÜMSİAD Competitor
INSERT INTO "Competitor" (id, name, "shortName", website, "memberCount", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'TÜMSİAD',
  'TÜMSİAD',
  'https://www.tumsiad.org',
  150,
  NOW(),
  NOW()
) RETURNING id;

-- Yukarıdaki komuttan dönen ID'yi kopyalayın ve aşağıda kullanın
-- Örnek: '123e4567-e89b-12d3-a456-426614174000'

-- 2. TÜMSİAD Digital Metric (ID'yi değiştirin)
INSERT INTO "DigitalMetric" (id, "competitorId", "metricType", value, "overallScore", date, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'TUMSIAD-ID-BURAYA',  -- Yukarıdaki ID'yi buraya
  'SEO',
  70,
  70,
  NOW(),
  NOW(),
  NOW()
);

-- 3. TÜMSİAD Social Media Stats (ID'yi değiştirin)
INSERT INTO "SocialMediaStat" (id, "competitorId", platform, followers, date, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'TUMSIAD-ID-BURAYA', 'INSTAGRAM', 2800, NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'TUMSIAD-ID-BURAYA', 'TWITTER', 1200, NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'TUMSIAD-ID-BURAYA', 'FACEBOOK', 4500, NOW(), NOW(), NOW());

-- 4. MÜSİAD Competitor
INSERT INTO "Competitor" (id, name, "shortName", website, "memberCount", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'MÜSİAD',
  'MÜSİAD',
  'https://www.musiad.org.tr',
  12000,
  NOW(),
  NOW()
) RETURNING id;

-- MÜSİAD için yukarıdaki adımları tekrarlayın (metricType, social media)

-- 5. ASKON Competitor
INSERT INTO "Competitor" (id, name, "shortName", website, "memberCount", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'ASKON',
  'ASKON',
  'https://www.askon.org.tr',
  8000,
  NOW(),
  NOW()
) RETURNING id;

-- 6. Örnek Üyeler
INSERT INTO "Member" (
  id, "firstName", "lastName", email, phone, company, position, 
  sector, city, district, status, "membershipDate", experience,
  "createdAt", "updatedAt"
)
VALUES 
  (
    gen_random_uuid(),
    'Ahmet',
    'Yılmaz',
    'ahmet.yilmaz@example.com',
    '0532 111 22 33',
    'Yılmaz Tekstil A.Ş.',
    'Genel Müdür',
    'Tekstil',
    'Denizli',
    'Pamukkale',
    'ACTIVE',
    '2023-01-15',
    15,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Mehmet',
    'Kaya',
    'mehmet.kaya@example.com',
    '0532 222 33 44',
    'Kaya İnşaat Ltd.',
    'Yönetim Kurulu Başkanı',
    'İnşaat',
    'Denizli',
    'Merkezefendi',
    'ACTIVE',
    '2023-03-20',
    20,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Ayşe',
    'Demir',
    'ayse.demir@example.com',
    '0532 333 44 55',
    'Demir Teknoloji A.Ş.',
    'CEO',
    'Teknoloji',
    'Denizli',
    'Pamukkale',
    'ACTIVE',
    '2023-05-10',
    12,
    NOW(),
    NOW()
  );

-- 7. Örnek Etkinlikler
INSERT INTO "Event" (
  id, title, description, type, "startDate", "endDate",
  location, city, capacity, cost, status,
  "createdAt", "updatedAt"
)
VALUES 
  (
    gen_random_uuid(),
    'Dijital Dönüşüm Semineri',
    'İşletmelerde dijital dönüşüm stratejileri',
    'SEMINAR',
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '15 days' + INTERVAL '3 hours',
    'TÜMSİAD Konferans Salonu',
    'Denizli',
    50,
    0,
    'PLANNED',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'İhracat Stratejileri Workshop',
    'Uluslararası pazarlara açılma stratejileri',
    'WORKSHOP',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days' + INTERVAL '6 hours',
    'TÜMSİAD Eğitim Merkezi',
    'Denizli',
    30,
    500,
    'COMPLETED',
    NOW(),
    NOW()
  );

-- Kontrol
SELECT COUNT(*) as "Üye Sayısı" FROM "Member";
SELECT COUNT(*) as "Etkinlik Sayısı" FROM "Event";
SELECT COUNT(*) as "Competitor Sayısı" FROM "Competitor";

