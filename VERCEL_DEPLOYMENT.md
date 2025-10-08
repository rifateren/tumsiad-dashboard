# 🚀 Vercel Deployment Rehberi (Adım Adım)

TÜMSİAD Dashboard'u Vercel'de yayına almak için izlenecek adımlar.

## ✅ Ön Hazırlık (5 dakika)

### 1. GitHub Repository Oluşturun

```bash
# Projeyi Git ile başlatın (eğer yapmadıysanız)
git init

# .gitignore kontrolü (zaten hazır)
# Database dosyası commit edilmeyecek (*.db ignore'da)
```

### 2. İlk Commit

```bash
# Tüm dosyaları ekle
git add .

# Commit
git commit -m "feat: TÜMSİAD Dashboard - Initial commit"

# Branch oluştur
git branch -M main
```

### 3. GitHub'a Push

```bash
# GitHub'da yeni repo oluşturun (private önerilir)
# Sonra:

git remote add origin https://github.com/KULLANICI_ADI/tumsiad-dashboard.git
git push -u origin main
```

---

## 🌐 Vercel Deployment (10 dakika)

### Adım 1: Vercel Hesabı

```
1. https://vercel.com/ adresine gidin
2. "Sign Up" → GitHub ile giriş yapın
3. Ücretsiz (Hobby) plan yeterli
```

### Adım 2: Projeyi Import Edin

```
1. Vercel Dashboard'da "Add New" → "Project"
2. GitHub repository'nizi seçin (tumsiad-dashboard)
3. "Import" tıklayın
```

### Adım 3: Build Ayarları (Otomatik)

Vercel otomatik algılar:
```
Framework Preset: Next.js ✓
Build Command: npm run build ✓
Output Directory: .next ✓
Install Command: npm install ✓
```

**ŞİMDİLİK DEPLOY ETMEYİN!** Önce database ekleyelim.

### Adım 4: Vercel Postgres Ekleyin

```
1. Vercel Dashboard → Projenizin sayfası
2. "Storage" sekmesi
3. "Create Database"
4. "Postgres" seçin
5. Database adı: tumsiad-db
6. Region: Frankfurt (fra1) - Türkiye'ye en yakın
7. "Create" tıklayın (30 saniye sürer)
```

**Otomatik olarak şunlar olur:**
- ✅ DATABASE_URL eklenir
- ✅ POSTGRES_URL eklenir
- ✅ POSTGRES_PRISMA_URL eklenir
- ✅ Environment variables set edilir

### Adım 5: İlk Deploy

```
1. "Deployments" sekmesi
2. "Redeploy" tıklayın
   (Environment variables eklendiği için yeniden deploy gerekli)
3. 2-3 dakika bekleyin
```

### Adım 6: Migration Çalıştırın

Deploy bittikten sonra:

**Seçenek A: Vercel CLI (Önerilen)**

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Login
vercel login

# Projenize bağlanın
vercel link

# Production DB'ye migrate
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy

# Seed data
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx tsx lib/seed.ts
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx tsx lib/real-data-import.ts
```

**Seçenek B: Vercel Dashboard'dan**

```
1. Settings → Environment Variables
2. DATABASE_URL'i kopyalayın
3. Local terminal'de:

DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx tsx lib/seed.ts
DATABASE_URL="postgresql://..." npx tsx lib/real-data-import.ts
```

### Adım 7: Test Edin!

```
1. Vercel size deployment URL verir:
   https://tumsiad-dashboard.vercel.app

2. Tarayıcıda açın
3. Dashboard'u görmelisiniz!
```

---

## 🔧 İlk Migration (Local'de)

Vercel'e deploy'dan ÖNCE migration oluşturun:

```bash
# 1. PostgreSQL için migration oluştur
npx prisma migrate dev --name init

# Bu şunları yapar:
# - prisma/migrations/ klasörü oluşturur
# - SQL migration dosyaları
# - Git'e commit edin
```

---

## 📝 Environment Variables (Vercel'de Otomatik)

Vercel Postgres eklediğinizde otomatik:

```bash
DATABASE_URL="postgresql://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_URL="postgresql://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgresql://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true"
```

---

## 🎯 Deployment Checklist

- [x] ✅ Prisma schema PostgreSQL'e çevrildi
- [x] ✅ Build script güncellendi
- [x] ✅ postinstall script eklendi
- [x] ✅ vercel.json oluşturuldu
- [x] ✅ .gitignore hazır
- [ ] Git repository oluşturun
- [ ] GitHub'a push yapın
- [ ] Vercel'e import edin
- [ ] Vercel Postgres ekleyin
- [ ] Migration çalıştırın
- [ ] Seed data yükleyin
- [ ] Test edin

---

## 🚨 Olası Sorunlar ve Çözümleri

### Problem: "Module not found: prisma"

**Çözüm:**
```json
// package.json'da prisma dependencies'de olmalı (✓ zaten var)
"prisma": "^6.17.0",
"@prisma/client": "^6.17.0"
```

### Problem: "Database migration failed"

**Çözüm:**
```bash
# Local'de önce migration oluşturun
npx prisma migrate dev --name init

# Git'e ekleyin
git add prisma/migrations
git commit -m "Add migrations"
git push
```

### Problem: "Build timeout"

**Çözüm:**
```bash
# Build süresini artırın (Vercel Dashboard)
Settings → General → Build & Development Settings
→ Build Timeout: 5 minutes
```

---

## 🎊 Deployment Sonrası

### Domain Ayarları:

```
Vercel Dashboard:
→ Settings → Domains
→ "tumsiad.org.tr" ekleyebilirsiniz
→ DNS kayıtlarını güncelleyin
```

### Analytics:

```bash
# Vercel Analytics (ücretsiz)
npm i @vercel/analytics

# app/layout.tsx'e ekleyin (opsiyonel)
```

---

## 💰 Maliyet

**Vercel Hobby Plan (Ücretsiz):**
- ✅ Unlimited deployments
- ✅ Vercel Postgres: 256 MB (sizin için yeterli)
- ✅ Bandwidth: 100 GB/ay
- ✅ Custom domain

**Hiç ücret ödemenize gerek yok!** 🎉

---

## 📞 Yardım

Her adımda takılırsanız söyleyin, birlikte çözeriz! 

**Şimdi GitHub repository oluşturmaya başlayalım mı?** 🚀
