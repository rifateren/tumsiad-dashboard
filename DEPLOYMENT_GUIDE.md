# TÜMSİAD Dashboard - Deployment Guide

## Vercel Deployment (Önerilen)

### 1. Gereksinimler

- GitHub hesabı
- Vercel hesabı
- Node.js 18+ (local development için)

### 2. GitHub Repository Oluşturma

```bash
# Local'de repository oluştur
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repository oluştur
# Sonra remote ekle
git remote add origin https://github.com/username/tumsiad-dashboard.git
git push -u origin main
```

### 3. Vercel'de Deploy

1. **Vercel'e giriş yap**: https://vercel.com
2. **"Add New Project"** tıklayın
3. **GitHub repository'yi seçin**
4. **Project ayarları**:
   - Framework: Next.js (otomatik algılanır)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 4. Database Setup

#### Prisma Postgres (Önerilen)

1. **Vercel Dashboard** → **Storage**
2. **"Create Database"** → **Prisma Postgres**
3. **Database ayarları**:
   - Name: `tumsiad-db`
   - Region: `Frankfurt (fra1)` (Türkiye'ye en yakın)
   - Plan: `Hobby` (ücretsiz)

#### Environment Variables

Vercel otomatik olarak şu environment variables'ları ekler:
- `DATABASE_URL`
- `DIRECT_URL`

### 5. Deploy Ayarları

#### vercel.json
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

#### package.json Scripts
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy"
  }
}
```

### 6. İlk Deploy

1. **"Deploy"** butonuna tıklayın
2. **Build loglarını** takip edin:
   ```
   ✓ Installing dependencies
   ✓ Running prisma generate
   ✓ Running prisma migrate deploy
   ✓ Building Next.js application
   ✓ Deploying to Vercel
   ```

### 7. Database Seed

Deploy başarılı olduktan sonra:

```bash
# Local'den production database'e seed
npx prisma db seed
```

## Alternatif Deployment Seçenekleri

### Railway

1. **Railway'e giriş**: https://railway.app
2. **"New Project"** → **"Deploy from GitHub repo"**
3. **Repository seçin**
4. **PostgreSQL database ekleyin**
5. **Environment variables ayarlayın**

### Netlify (Static Export)

```bash
# Static export için
npm run build
npm run export

# Netlify'de deploy
netlify deploy --prod --dir=out
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/tumsiad
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tumsiad
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment Variables

### Production
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
DIRECT_URL=postgresql://user:pass@host:5432/db

# Security
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Optional
NODE_ENV=production
```

### Development
```bash
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# Optional
NODE_ENV=development
```

## Database Migration

### Production Migration
```bash
# Vercel'de otomatik çalışır
npm run build

# Manuel migration
npx prisma migrate deploy
```

### Local Development
```bash
# Migration oluştur
npx prisma migrate dev --name migration-name

# Database reset
npx prisma migrate reset
```

## Monitoring ve Logs

### Vercel Analytics
- **Vercel Dashboard** → **Analytics**
- Performance metrikleri
- Error tracking

### Custom Monitoring
```javascript
// lib/monitoring.ts
export function trackEvent(event: string, data: any) {
  // Analytics service integration
  console.log('Event:', event, data)
}
```

## Backup ve Recovery

### Database Backup
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Vercel Backup
- Vercel otomatik backup yapar
- **Settings** → **General** → **Backups**

## Performance Optimization

### Build Optimization
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    formats: ['image/webp', 'image/avif']
  }
}
```

### Database Optimization
```sql
-- Indexes for better performance
CREATE INDEX idx_member_email ON "Member"(email);
CREATE INDEX idx_event_start_date ON "Event"("startDate");
CREATE INDEX idx_social_media_platform ON "SocialMediaStat"(platform);
```

## Troubleshooting

### Build Failures
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

### Environment Variables
```bash
# Check variables
vercel env ls

# Add variable
vercel env add DATABASE_URL
```

## Security Checklist

- [ ] Environment variables güvenli
- [ ] CORS headers ayarlandı
- [ ] Rate limiting aktif
- [ ] Security headers eklendi
- [ ] Input validation yapıldı
- [ ] SQL injection koruması
- [ ] XSS koruması
- [ ] HTTPS zorunlu

## Maintenance

### Regular Tasks
- Database backup
- Dependency updates
- Security patches
- Performance monitoring
- Error log review

### Updates
```bash
# Dependencies güncelle
npm update

# Major updates
npm install package@latest
```

## Support

- **Documentation**: Bu dosya
- **Issues**: GitHub Issues
- **Email**: support@tumsiad.org
- **Discord**: TÜMSİAD Community
