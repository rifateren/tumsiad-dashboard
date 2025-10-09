# TÜMSİAD Dashboard API Documentation

## Genel Bilgiler

- **Base URL**: `https://tumsiad-dashboard.vercel.app/api`
- **Authentication**: Şu anda authentication yok, gelecekte JWT token kullanılacak
- **Rate Limiting**: 100 request/15 dakika (API), 5 request/15 dakika (Auth)
- **Response Format**: JSON

## Rate Limiting

API endpoint'leri rate limiting ile korunmaktadır:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Error Responses

Tüm error response'lar şu formatta döner:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Üyeler (Members)

#### GET /api/members
Tüm üyeleri listeler.

**Query Parameters:**
- `page` (optional): Sayfa numarası (default: 1)
- `limit` (optional): Sayfa başına kayıt sayısı (default: 10)
- `search` (optional): Arama terimi

**Response:**
```json
{
  "members": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "position": "string",
      "sector": "string",
      "status": "ACTIVE|INACTIVE|SUSPENDED|RESIGNED",
      "membershipDate": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### POST /api/members
Yeni üye ekler.

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (optional, Turkish format)",
  "company": "string (optional)",
  "position": "string (optional)",
  "sector": "string (optional)",
  "address": "string (optional)",
  "city": "string (default: Denizli)",
  "district": "string (optional)",
  "experience": "number (optional, 0-50)"
}
```

#### GET /api/members/[id]
Belirli bir üyeyi getirir.

#### PUT /api/members/[id]
Üye bilgilerini günceller.

#### DELETE /api/members/[id]
Üyeyi siler.

### Etkinlikler (Events)

#### GET /api/events
Tüm etkinlikleri listeler.

**Query Parameters:**
- `page`, `limit`, `search` (same as members)
- `type` (optional): Etkinlik türü filtresi
- `status` (optional): Durum filtresi

**Response:**
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "type": "CONFERENCE|SEMINAR|WORKSHOP|NETWORKING|TRAINING|SOCIAL_RESPONSIBILITY|MEETING|OTHER",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-01T00:00:00.000Z",
      "location": "string",
      "address": "string",
      "city": "string",
      "capacity": "number",
      "cost": "number",
      "status": "PLANNED|ONGOING|COMPLETED|CANCELLED",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### POST /api/events
Yeni etkinlik ekler.

**Request Body:**
```json
{
  "title": "string (required, 5-100 chars)",
  "description": "string (optional, max 1000 chars)",
  "type": "string (required, enum)",
  "startDate": "string (required, ISO date)",
  "endDate": "string (optional, ISO date)",
  "location": "string (optional)",
  "address": "string (optional)",
  "city": "string (default: Denizli)",
  "capacity": "number (optional, 1-10000)",
  "cost": "number (optional, 0-100000)"
}
```

### Analitik (Analytics)

#### GET /api/analytics/stats
Genel dashboard istatistikleri.

**Response:**
```json
{
  "totalMembers": 150,
  "activeMembers": 140,
  "totalEvents": 25,
  "upcomingEvents": 3,
  "memberGrowth": 12.5,
  "eventAttendance": 85.2
}
```

#### GET /api/analytics/member-stats
Detaylı üye istatistikleri.

**Response:**
```json
{
  "totalMembers": 150,
  "activeMembers": 140,
  "inactiveMembers": 10,
  "cityDistribution": [
    { "city": "Denizli", "count": 120 },
    { "city": "Pamukkale", "count": 30 }
  ],
  "sectorDistribution": [
    { "sector": "Tekstil", "count": 50 },
    { "sector": "Teknoloji", "count": 40 }
  ],
  "monthlyGrowth": [
    { "month": "2024-01", "count": 5 },
    { "month": "2024-02", "count": 8 }
  ],
  "avgExperience": 12
}
```

#### GET /api/analytics/event-stats
Detaylı etkinlik istatistikleri.

**Response:**
```json
{
  "totalEvents": 25,
  "thisYearEvents": 15,
  "eventTypeDistribution": [
    { "type": "SEMINAR", "count": 10 },
    { "type": "WORKSHOP", "count": 8 }
  ],
  "statusDistribution": [
    { "status": "COMPLETED", "count": 20 },
    { "status": "PLANNED", "count": 5 }
  ],
  "monthlyEvents": [
    { "month": "2024-01", "count": 3 },
    { "month": "2024-02", "count": 5 }
  ],
  "totalParticipants": 450,
  "avgParticipantsPerEvent": 18
}
```

#### GET /api/analytics/event-frequency
Aylık etkinlik sıklığı karşılaştırması.

**Response:**
```json
{
  "data": [
    {
      "month": "Ocak 2024",
      "TÜMSİAD": 3,
      "MÜSİAD": 5,
      "ASKON": 4
    }
  ]
}
```

### Rakip Analizi (Competitors)

#### GET /api/competitors
Tüm rakip STK'ları listeler.

#### GET /api/competitors/comparison
Rakip karşılaştırma verilerini getirir.

**Response:**
```json
{
  "competitors": [
    {
      "id": "string",
      "name": "TÜMSİAD",
      "shortName": "TÜMSİAD",
      "digitalScore": 70,
      "socialMedia": {
        "INSTAGRAM": 2800,
        "TWITTER": 1200,
        "FACEBOOK": 4500
      },
      "memberCount": 150,
      "website": "https://example.com"
    }
  ]
}
```

### AI Chat

#### POST /api/ai-update
AI chat üzerinden veri güncelleme.

**Request Body:**
```json
{
  "competitor": "TÜMSİAD|MÜSİAD|ASKON",
  "platform": "INSTAGRAM|TWITTER|FACEBOOK",
  "value": "number",
  "type": "social_media|digital_metric|event_count",
  "metric": "SEO|SPEED|MOBILE|CONTENT (for digital_metric)",
  "month": "string (for event_count)"
}
```

#### POST /api/scrape-url
URL'den sosyal medya verilerini çeker.

**Request Body:**
```json
{
  "url": "string (required, valid URL)"
}
```

### Raporlar (Reports)

#### GET /api/reports
Tüm raporları listeler.

**Query Parameters:**
- `type` (optional): Rapor türü (MONTHLY, QUARTERLY, YEARLY)
- `limit` (optional): Sayfa başına kayıt sayısı
- `offset` (optional): Offset değeri

#### POST /api/reports/generate
Yeni rapor oluşturur.

**Request Body:**
```json
{
  "type": "monthly|quarterly|yearly",
  "period": "string (e.g., 2024-01)",
  "userId": "string"
}
```

#### GET /api/reports/[id]
Belirli bir raporu getirir.

#### DELETE /api/reports/[id]
Raporu siler.

### PDF Generation

#### POST /api/generate-pdf
PDF raporu oluşturur.

**Request Body:**
```json
{
  "html": "string (HTML content)"
}
```

## Validation Rules

### Üye (Member) Validation
- `firstName`: 2-50 karakter
- `lastName`: 2-50 karakter  
- `email`: Geçerli email formatı, max 100 karakter
- `phone`: Türk telefon formatı (0532 123 45 67)
- `company`: Max 100 karakter
- `position`: Max 100 karakter
- `sector`: Max 50 karakter
- `address`: Max 200 karakter
- `experience`: 0-50 arası sayı

### Etkinlik (Event) Validation
- `title`: 5-100 karakter
- `description`: Max 1000 karakter
- `type`: Enum değerlerinden biri
- `startDate`: Geçerli tarih
- `endDate`: startDate'den sonra
- `capacity`: 1-10000 arası
- `cost`: 0-100000 arası

## Error Codes

- `VALIDATION_ERROR`: Form validation hatası
- `NOT_FOUND`: Kayıt bulunamadı
- `RATE_LIMIT_EXCEEDED`: Rate limit aşıldı
- `INTERNAL_ERROR`: Sunucu hatası
- `UNAUTHORIZED`: Yetkisiz erişim
- `FORBIDDEN`: Erişim engellendi

## Examples

### Üye Ekleme
```bash
curl -X POST https://tumsiad-dashboard.vercel.app/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "phone": "0532 123 45 67",
    "company": "ABC Şirketi",
    "sector": "Tekstil"
  }'
```

### Etkinlik Listeleme
```bash
curl https://tumsiad-dashboard.vercel.app/api/events?page=1&limit=5
```

### AI Chat ile Veri Güncelleme
```bash
curl -X POST https://tumsiad-dashboard.vercel.app/api/ai-update \
  -H "Content-Type: application/json" \
  -d '{
    "competitor": "MÜSİAD",
    "platform": "INSTAGRAM", 
    "value": 8650,
    "type": "social_media"
  }'
```
