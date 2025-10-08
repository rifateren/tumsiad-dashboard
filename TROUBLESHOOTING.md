# 🔧 Sorun Giderme Rehberi

Dashboard kullanırken karşılaşabileceğiniz sorunlar ve çözümleri.

## 🤖 AI Chat Sorunları

### Problem: "Link'ten veri çekemiyorum"

**Neden Olur:**
- Facebook/Twitter/Instagram login duvarı koyabilir
- Bot koruması devreye girebilir
- Sayfa yapısı değişmiş olabilir

**Çözüm 1: Manuel Sayı Girme (EN KOLAY)**
```
AI Chat'e sadece sayıyı yazın:

Örnek:
Link: https://www.facebook.com/MusiadDenizli/
↓
Çekemedi
↓
Siz yazın: "MÜSİAD Facebook 12000"
✅ Güncellendi!

Veya daha basit:
"12000" yazın, AI anlar (önceki bağlamdan)
```

**Çözüm 2: Hesabı Manuel Kontrol**
```
1. Tarayıcınızda link'i açın
2. Takipçi sayısını görün: 8,650
3. AI Chat'e yazın: "MÜSİAD Instagram 8650"
```

**Çözüm 3: API Key Kullanma**
```
Twitter/Facebook/Instagram API key'leri ekleyin
→ API doğrudan resmi verilerden çeker
→ %100 güvenilir
```

### Problem: "Komutu anlayamadım"

**Nedenler:**
- Format yanlış
- STK adı eksik
- Platform adı eksik

**Doğru Formatlar:**
```
✅ "MÜSİAD Instagram 9000"
✅ "musiad instagram 9000" (küçük harf ok)
✅ "MÜSİAD Instagram 9000 takipçi" (ekstra kelime ok)
✅ "müsiad insta 9k" (kısaltmalar ok)

❌ "Instagram 9000" (STK yok)
❌ "MÜSİAD 9000" (platform yok)
❌ "9000" (kontekst yoksa anlaşılmaz)
```

### Problem: "Sayı yanlış geldi (1624 → 624)"

**Düzeltildi!**
- Virgüllü sayılar düzgün parse ediliyor
- "1,624" → 1624 ✓
- "1.624" → 1624 ✓
- "8.5K" → 8500 ✓

---

## 📊 Veri Güncelleme Sorunları

### Problem: "Güncelleme yaptım ama sayfa değişmedi"

**Çözüm:**
```
1. Sayfayı manuel yenileyin (F5)
2. Tarayıcı cache'ini temizleyin (Ctrl+Shift+R)
3. 2-3 saniye bekleyin (otomatik yenilenme için)
```

### Problem: "API durumu hep 'Pasif' gösteriyor"

**Neden:**
- .env dosyasında API key yok
- Sunucu yeniden başlatılmamış

**Çözüm:**
```bash
1. .env dosyasını kontrol edin
2. API key'leri ekleyin
3. Sunucuyu yeniden başlatın:
   Ctrl+C
   npm run dev
4. /dashboard/ayarlar'a gidin ve kontrol edin
```

---

## 🔐 API Sorunları

### Problem: "Twitter API çalışmıyor"

**Kontrol Listesi:**
- [ ] Bearer Token doğru mu? (AAAAAAA ile başlamalı)
- [ ] .env dosyasına eklendi mi?
- [ ] Sunucu yeniden başlatıldı mı?
- [ ] Twitter Developer hesabı onaylandı mı?

**Test:**
```bash
# Terminal'de test edin:
curl http://localhost:3000/api/social-media/update

# Yanıt:
{
  "apis": {
    "twitter": true  ← Bu true olmalı
  }
}
```

### Problem: "Instagram/Facebook API hatası"

**Neden:**
- Business hesap gerekli
- Access token süresi dolmuş
- Permissions yetersiz

**Çözüm:**
```
Instagram/Facebook için API kurulumu karmaşık.
→ AI Chat ile manuel güncelleme ÖNERİLİR
→ Haftalık manuel kontrol yeterli
```

---

## 🗄️ Database Sorunları

### Problem: "Üye/Etkinlik ekleyemiyorum"

**Kontrol:**
```bash
# Database dosyası var mı?
ls prisma/dev.db

# Yoksa:
npx prisma db push
npx tsx lib/seed.ts
```

### Problem: "Unique constraint error"

**Neden:**
- Aynı email'le üye zaten var
- Duplicate veri

**Çözüm:**
```
1. Farklı email deneyin
2. Veya Prisma Studio'da eski kaydı silin:
   npx prisma studio
```

---

## 💻 Genel Sorunlar

### Problem: "Sayfa yüklenmiyor / Hata veriyor"

**Çözüm:**
```bash
# 1. Sunucuyu yeniden başlatın
Ctrl+C
npm run dev

# 2. node_modules temizle
rm -rf node_modules
npm install

# 3. Database'i sıfırla
npx prisma db push --force-reset
npx tsx lib/seed.ts
```

### Problem: "Grafik görünmüyor"

**Neden:**
- Recharts yüklenmemiş
- Veri formatı yanlış

**Çözüm:**
```bash
npm install recharts
npm run dev
```

### Problem: "Dark mode çalışmıyor"

**Çözüm:**
```
Header'da güneş/ay ikonuna tıklayın
→ "Açık", "Koyu", "Sistem" seçenekleri çıkmalı
```

---

## 🚨 Acil Durum Çözümleri

### Tüm Sistemin Reset'i:

```bash
# 1. Database'i sıfırla
rm prisma/dev.db
npx prisma db push
npx tsx lib/seed.ts

# 2. Gerçek verileri tekrar yükle
npx tsx lib/real-data-import.ts

# 3. Sunucuyu başlat
npm run dev
```

### Build Hataları:

```bash
# 1. Cache temizle
rm -rf .next

# 2. Dependencies yeniden yükle
rm -rf node_modules
rm package-lock.json
npm install

# 3. Build dene
npm run build
```

---

## 📞 Yardım Alın

Sorun çözemediyseniz:

1. **Console loglarına bakın:**
   ```
   Tarayıcı: F12 → Console
   Server: Terminal'de npm run dev çıktısı
   ```

2. **Hata mesajını okuyun:**
   - 404: Endpoint bulunamadı
   - 500: Server hatası
   - 400: Eksik parametre

3. **Dokümantasyon:**
   - README.md - Genel bilgi
   - API_SETUP_GUIDE.md - API kurulumu
   - AI_CHAT_GUIDE.md - Chat kullanımı
   - USER_GUIDE.md - Kullanım rehberi

---

## ✅ Hızlı Kontrol Listesi

Dashboard çalışmıyor mu? Sırayla kontrol:

- [ ] Sunucu çalışıyor mu? (npm run dev)
- [ ] Database var mı? (prisma/dev.db)
- [ ] .env dosyası var mı?
- [ ] Port 3000 boş mu?
- [ ] node_modules yüklü mü?
- [ ] Tarayıcı güncel mi?
- [ ] Internet bağlantısı var mı? (dış API'ler için)

Hepsi ✅ ama sorun varsa: Sunucuyu restart edin!
