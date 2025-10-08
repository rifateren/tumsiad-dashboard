# TÜMSİAD Deployment Guide

Bu dokümanda projenin production ortamına nasıl deploy edileceği anlatılmaktadır.

## 🚀 Deployment Seçenekleri

### 1. Vercel (Önerilen)

Next.js'in geliştiricisi Vercel, en kolay ve optimize deployment çözümü sunar.

#### Adımlar:

1. **Vercel hesabı oluşturun**
   - [vercel.com](https://vercel.com) adresinden ücretsiz hesap oluşturun
   - GitHub hesabınızı bağlayın

2. **Projeyi import edin**
   ```bash
   # GitHub'a push yapın
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [your-repo-url]
   git push -u origin main
   ```

3. **Vercel'de import yapın**
   - Vercel dashboard'dan "New Project"
   - GitHub repository'nizi seçin
   - Framework Preset: Next.js (otomatik algılanır)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables ekleyin**
   ```
   DATABASE_URL=file:./dev.db
   # Production için PostgreSQL önerilir:
   # DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

5. **Deploy edin**
   - "Deploy" butonuna tıklayın
   - Her push'ta otomatik deploy olur

#### Database için:

Vercel'de SQLite çalışmaz (read-only filesystem). Production için:

**Seçenek A: Vercel Postgres**
```bash
# Vercel CLI ile
npm i -g vercel
vercel link
vercel postgres create
```

**Seçenek B: Supabase**
- [supabase.com](https://supabase.com) ücretsiz PostgreSQL
- Connection string'i DATABASE_URL olarak ekleyin

**Seçenek C: Railway**
- [railway.app](https://railway.app) ücretsiz PostgreSQL
- Deploy edip connection string alın

### 2. Railway

Full-stack deployment için Railway kullanabilirsiniz.

#### Adımlar:

1. **Railway hesabı oluşturun**
   - [railway.app](https://railway.app)
   - GitHub ile giriş yapın

2. **Yeni proje oluşturun**
   - "New Project" → "Deploy from GitHub repo"
   - Repository'nizi seçin

3. **Environment Variables**
   ```
   DATABASE_URL=postgresql://...  (Railway otomatik sağlar)
   NODE_ENV=production
   ```

4. **Build ayarları**
   - Build Command: `npm run build`
   - Start Command: `npm start`

5. **Domain ayarlayın**
   - Railway otomatik domain verir
   - Custom domain ekleyebilirsiniz

### 3. Digital Ocean App Platform

#### Adımlar:

1. **Digital Ocean hesabı**
   - [digitalocean.com/products/app-platform](https://www.digitalocean.com/products/app-platform)

2. **App oluşturun**
   - "Create App" → GitHub'dan import
   - Repository ve branch seçin

3. **Build ayarları**
   ```
   Build Command: npm run build
   Run Command: npm start
   ```

4. **Database ekleyin**
   - PostgreSQL database ekleyin
   - Otomatik olarak DATABASE_URL set edilir

5. **Deploy**
   - Her commit'te otomatik deploy

## 📊 Database Migration

Production'a geçerken:

### SQLite'dan PostgreSQL'e geçiş:

1. **Prisma schema'yı güncelleyin**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Migration oluşturun**
```bash
npx prisma migrate dev --name init
```

3. **Production'da migrate edin**
```bash
npx prisma migrate deploy
```

4. **Seed data ekleyin**
```bash
npx tsx lib/seed.ts
```

## 🔒 Güvenlik

Production'da mutlaka ekleyin:

### 1. Environment Variables
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### 2. CORS ve Rate Limiting

`middleware.ts` oluşturun:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Rate limiting logic
  // CORS headers
  return NextResponse.next()
}
```

### 3. API Route Protection

API route'larına authentication ekleyin

## ⚡ Performance

### 1. Cache Stratejisi
```typescript
// app/layout.tsx
export const revalidate = 3600 // 1 saat
```

### 2. Image Optimization
```typescript
import Image from 'next/image'
// next/image otomatik optimize eder
```

### 3. Database Connection Pooling

PostgreSQL için:
```
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=10"
```

## 📦 Build Optimizasyonu

### Package.json scripts:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p $PORT",
    "postinstall": "prisma generate"
  }
}
```

### Next.js Config:
```javascript
// next.config.js
module.exports = {
  output: 'standalone', // Optimize build
  compress: true,
  images: {
    domains: ['your-cdn.com'],
  },
}
```

## 🔍 Monitoring

### Vercel Analytics
```bash
npm i @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Tracking (Sentry)
```bash
npm i @sentry/nextjs
```

## 🔄 CI/CD

### GitHub Actions örneği:

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## ✅ Pre-Deploy Checklist

- [ ] Environment variables yapılandırıldı
- [ ] Database connection test edildi
- [ ] Build başarıyla tamamlanıyor
- [ ] Production database'e migrate edildi
- [ ] Seed data eklendi (gerekiyorsa)
- [ ] SSL/HTTPS aktif
- [ ] Custom domain ayarlandı
- [ ] Error tracking kuruldu
- [ ] Backup stratejisi belirlendi
- [ ] Monitoring aktif

## 🆘 Troubleshooting

### Build hatası:
```bash
# Önce local'de test edin
npm run build
npm start
```

### Database connection hatası:
```bash
# Connection string'i test edin
npx prisma db push
```

### Module not found:
```bash
# node_modules'ı temizleyin
rm -rf node_modules
rm package-lock.json
npm install
```

## 📞 Destek

Deployment sorunları için:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma Docs: [prisma.io/docs](https://www.prisma.io/docs)
