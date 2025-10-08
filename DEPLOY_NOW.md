# 🚀 ŞİMDİ DEPLOY ET - Hızlı Rehber

5 dakika içinde canlıya alın!

## 📋 Adım Adım (Kopyala-Yapıştır)

### 1️⃣ GitHub'a Push (2 dakika)

```bash
# Terminal'de (projenizin klasöründe):

git init
git add .
git commit -m "TÜMSİAD Dashboard"
git branch -M main

# GitHub'da yeni repo oluşturun: tumsiad-dashboard
# Sonra connection string'i alıp:

git remote add origin https://github.com/KULLANICI_ADINIZ/tumsiad-dashboard.git
git push -u origin main
```

✅ Kodunuz GitHub'da!

---

### 2️⃣ Vercel'e Import (1 dakika)

```
1. https://vercel.com/ → GitHub ile Login
2. "Add New" → "Project"
3. "tumsiad-dashboard" repository'nizi seçin
4. "Import" tıklayın
5. ⚠️ DEPLOY BUTONA TIKLAMAYIN! Önce database ekleyin.
```

---

### 3️⃣ Vercel Postgres Ekle (1 dakika)

```
1. Projenizin sayfasında (Vercel'de)
2. Üst menüden "Storage" tıklayın
3. "Create Database" 
4. "Postgres" seçin
5. Region: Frankfurt (Türkiye'ye yakın)
6. "Create" → 30 saniye bekleyin
```

✅ Otomatik environment variables eklendi!

---

### 4️⃣ Deploy (1 dakika)

```
1. "Deployments" sekmesi
2. "Redeploy" tıklayın
3. 2-3 dakika bekleyin
4. ✅ Deploy başarılı!
```

**Deployment URL'niz:**
```
https://tumsiad-dashboard-xxxx.vercel.app
```

---

### 5️⃣ Database Migration (Terminal'den)

Deploy bittikten sonra database'i hazırlayın:

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Login
vercel login

# Projeye bağlanın
vercel link

# Environment variables'ı çekin
vercel env pull .env.production

# Migration (SQLite'dan farklı olabilir, düzeltilecek)
# Önce schema'yı PostgreSQL'e çevirin:
```

**prisma/schema.prisma'yı düzenleyin:**
```prisma
datasource db {
  provider = "postgresql"  // sqlite'dan değiştirin
  url      = env("DATABASE_URL")
}
```

**Sonra:**
```bash
# Migration oluştur
npx prisma migrate dev --name init

# Production'a uygula
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Seed data (production DB'ye)
npx tsx lib/seed.ts
npx tsx lib/real-data-import.ts
```

---

## 🎯 Alternatif: Basit Yol (Vercel Dashboard'dan)

### A) Database Connection String Kopyalayın:

```
Vercel Dashboard:
→ Storage → tumsiad-db
→ "Connection String" → ".env.local" → Kopyalayın
```

### B) Local'den Production DB'ye Bağlanın:

```bash
# Yeni bir .env.production dosyası oluşturun
# İçine Vercel'den kopyaladığınız DATABASE_URL'i yapıştırın

# Schema'yı PostgreSQL'e çevirin (geçici)
# prisma/schema.prisma → provider = "postgresql"

# Migration
DATABASE_URL="[vercel-connection-string]" npx prisma db push

# Seed
DATABASE_URL="[vercel-connection-string]" npx tsx lib/seed.ts
DATABASE_URL="[vercel-connection-string]" npx tsx lib/real-data-import.ts

# Schema'yı geri SQLite'a çevirin (local dev için)
# prisma/schema.prisma → provider = "sqlite"
```

---

## ✅ Deploy Başarılı mı Kontrol:

```
1. Vercel URL'nizi açın
2. Ana dashboard göreceksiniz
3. Veri yoksa → Seed çalıştırın (yukarıdaki adım)
4. AI Chat test edin
5. Üye ekleme formu test edin
```

---

## 🎊 Tamamdır!

**Artık canlı:**
```
https://tumsiad-dashboard.vercel.app

Herkesle paylaşabilirsiniz! 🌍
```

---

## 📱 Sonraki Adımlar (Opsiyonel):

1. **Custom Domain**
   - tumsiad.org.tr gibi
   
2. **Authentication**
   - NextAuth.js ekleyin
   
3. **Analytics**
   - Vercel Analytics

4. **Monitoring**
   - Sentry error tracking

---

**Hazırsanız başlayalım! GitHub repository linkinizi söyleyin veya birlikte oluşturalım.** 🚀
