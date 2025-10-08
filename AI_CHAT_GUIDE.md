# 🤖 AI Chat Asistan Kullanım Rehberi

Dashboard'unuzda sağ altta bulunan **AI Chat** ile verilerinizi güncelleyebilirsiniz!

## ✨ Özellikler

- 🔗 **Link ile otomatik çekme** - Instagram/Twitter/Facebook linki yapıştırın!
- 🚀 **Anında güncelleme** - API key'e gerek yok
- 💬 **Doğal dil anlama** - Basit komutlar yeterli
- 🎯 **Akıllı parsing** - STK, platform ve sayıyı otomatik tespit eder
- ✅ **Database'e kayıt** - Güncellemeler kalıcı
- 🔄 **Otomatik refresh** - Başarılı güncellemeden sonra sayfa yenilenir

## 📍 Nerede Bulunur?

AI Chat **2 sayfada** kullanılabilir:

1. **Karşılaştırmalı Analiz** (`/dashboard/analiz`)
   - Rakip STK verilerini güncelleyin
   
2. **Dijital Varlık** (`/dashboard/dijital-varlik`)
   - Web sitesi ve sosyal medya metriklerini güncelleyin

Sağ alt köşedeki **yuvarlak ✨ ikonuna** tıklayın.

## 💬 Kullanım Örnekleri

### Karşılaştırma Analizi Sayfasında

#### 1. Link ile Otomatik Çekme (ÖNERİLEN):

```
Sadece link'i yapıştırın, AI geri kalanını halleder!

"https://www.instagram.com/musiaddenizli/"
→ AI otomatik takipçi sayısını çeker ve MÜSİAD için günceller

"https://twitter.com/MUSIADDenizli"
→ AI Twitter'dan takipçi çeker

"https://www.facebook.com/AskonDenizli20/"
→ AI Facebook'tan beğeni sayısını çeker
```

**AI Yanıtı:**
```
🔍 Link analiz ediliyor...
https://www.instagram.com/musiaddenizli/

✅ INSTAGRAM hesabı tespit edildi!

📊 Takipçi sayısı: 8,650
🏢 STK: MÜSİAD

🔄 Database'e kaydediliyor...

✅ MÜSİAD instagram verileri güncellendi!
📊 Sayfayı yenileyin.
```

#### 2. Manuel Komut (Alternatif):

```
"MÜSİAD Instagram 9000"
→ MÜSİAD'ın Instagram takipçisini 9000 yapar

"TÜMSİAD Twitter 1500"
→ TÜMSİAD'ın Twitter takipçisini 1500 yapar

"ASKON Facebook 5500"
→ ASKON'un Facebook beğenisini 5500 yapar
```

#### Desteklenen Formatlar:
- `"STK_ADI PLATFORM SAYI"`
- `"musiad instagram 8500"` (küçük harf ok)
- `"TÜMSİAD Twitter 1200 takipçi"` (ekstra kelimeler ok)
- `"MÜSİAD fb 12000"` (fb = facebook)

#### Desteklenen STK'lar:
- TÜMSİAD / Tümsiad / tumsiad
- MÜSİAD / Müsiad / musiad
- ASKON / askon

#### Desteklenen Platformlar:
- Twitter / twitter / X
- Instagram / instagram / insta
- Facebook / facebook / fb

### Dijital Varlık Sayfasında

#### Web Sitesi Metrikleri Güncelleme:

```
"SEO skoru 75"
→ TÜMSİAD'ın SEO skorunu 75 yapar

"Sayfa hızı 80"
→ Sayfa hızı skorunu 80 yapar

"Mobil skor 85"
→ Mobil uyumluluk skorunu 85 yapar

"İçerik skoru 70"
→ İçerik kalitesi skorunu 70 yapar
```

#### Sosyal Medya (TÜMSİAD için):

```
"Instagram 2800"
→ TÜMSİAD Instagram takipçisi 2800

"Twitter 1500 takipçi"
→ TÜMSİAD Twitter takipçisi 1500
```

## 🎬 Örnek Kullanım

### Senaryo 1: MÜSİAD Instagram Takipçi Güncelleme

```
1. /dashboard/analiz sayfasına gidin
2. Sağ altta ✨ ikonuna tıklayın
3. Chat açılır, hoş geldiniz mesajı görürsünüz
4. Yazın: "MÜSİAD Instagram 9500"
5. Enter'a basın
6. AI şunu yazar:
   "🔄 MÜSİAD instagram takipçi sayısını 9500 olarak güncelliyorum...
   
   ✅ MÜSİAD instagram takipçi sayısı 9500 olarak güncellendi!
   📊 Sayfayı yenileyin veya 'Yenile' butonuna tıklayın."
   
7. Sayfa otomatik yenilenecek (2 saniye sonra)
8. Güncel rakamları göreceksiniz!
```

### Senaryo 2: TÜMSİAD SEO Skoru Güncelleme

```
1. /dashboard/dijital-varlik sayfasına gidin
2. ✨ AI Chat'i açın
3. Yazın: "SEO skoru 72"
4. AI güncellemeyi yapar
5. Sayfa yenilenir
6. "SEO Skoru" kartında 72/100 görürsünüz
7. Overall dijital skor otomatik hesaplanır
```

## 🧠 AI Nasıl Çalışıyor?

### Komut Parsing:

AI chat sizin komutunuzu analiz eder:

```javascript
Komut: "MÜSİAD Instagram 9000"

Parsing:
- STK: "MÜSİAD" ✓
- Platform: "Instagram" ✓  
- Değer: 9000 ✓

API Çağrısı:
POST /api/ai-update
{
  type: 'social_media',
  competitor: 'MÜSİAD',
  platform: 'instagram',
  value: 9000
}

Database Güncelleme:
✓ SocialMediaStat tablosuna yeni kayıt
✓ competitorId: MÜSİAD
✓ platform: INSTAGRAM
✓ followers: 9000
✓ Otomatik engagement hesaplama
```

### Anlaşılamayan Komut:

Eğer AI komutu anlayamazsa:

```
❓ Komutu anlayamadım. Lütfen şu formatta yazın:

• "MÜSİAD Instagram 9000"
• "TÜMSİAD Twitter 1500"
• "ASKON Facebook 5500"
```

## ✅ Avantajlar

1. **API'ye Gerek Yok**
   - Hiçbir API key almaya gerek yok
   - Limit yok, maliyet yok
   - Anında çalışır

2. **Manuel Kontrol**
   - Sosyal medya hesaplarını siz kontrol edersiniz
   - Doğru sayıları kendiniz girersiniz
   - Daha güvenilir (API hataları yok)

3. **Hızlı Güncelleme**
   - 10 saniyede güncelleme
   - Form doldurmaya gerek yok
   - Doğal dil kullanın

4. **Akıllı**
   - Küçük/büyük harf fark etmez
   - Ekstra kelimeler ok ("9000 takipçi")
   - Türkçe karakterler desteklenir

## 🔄 Güncellenecek Veriler

### Otomatik Hesaplananlar:

Sadece takipçi sayısını verirseniz, AI bunları otomatik hesaplar:
- **Reach:** Takipçi x 0.1
- **Likes:** Takipçi x 0.05
- **Comments:** Takipçi x 0.01
- **Shares:** Takipçi x 0.005

Dijital metrikler güncellendiğinde:
- **Overall Score:** 4 metriğin ortalaması otomatik hesaplanır

## 📊 Kullanım Senaryoları

### Haftalık Rakip Analizi:

```
Pazartesi sabahı:
1. MÜSİAD'ın Instagram'ını kontrol et
2. AI Chat: "MÜSİAD Instagram 8650"
3. ASKON'un Facebook'unu kontrol et  
4. AI Chat: "ASKON Facebook 4950"
5. Dashboard güncellendi!
```

### Web Sitesi Değerlendirmesi:

```
Her ay:
1. PageSpeed Insights ile test et: tumsiad.org.tr
2. AI Chat'e skorları gir:
   "SEO skoru 70"
   "Sayfa hızı 75"
   "Mobil skor 78"
3. Dijital skor otomatik hesaplanır
```

## ❓ SSS

**S: Her güncelleme kalıcı mı?**
C: Evet, database'e kaydedilir.

**S: Yanlış sayı girdim, nasıl düzeltirim?**
C: Yeni komutla tekrar güncelleyin. Yeni kayıt oluşturur.

**S: Hangi sayfadan hangi verileri güncellerim?**
C: 
- Karşılaştırma Analizi → Tüm STK'lar, tüm platformlar
- Dijital Varlık → TÜMSİAD'ın metrikleri

**S: API eklersem AI Chat'e gerek var mı?**
C: Her ikisini de kullanabilirsiniz:
- API: Otomatik günlük güncelleme
- AI Chat: Manuel düzeltme ve özel güncellemeler

**S: Komut geçmişi tutuluyor mu?**
C: Hayır, her oturumda sıfırlanır (gelecekte eklenebilir).

## 🎯 En İyi Pratikler

1. **Doğru Sayıları Girin**
   - Sosyal medya hesaplarını manuel kontrol edin
   - Yuvarlama yapmayın (gerçek sayıyı girin)

2. **Düzenli Güncelleyin**
   - Haftalık sosyal medya kontrolü
   - Aylık web sitesi metrikleri

3. **Tutarlı Olun**
   - Aynı kişi güncelleme yapmalı
   - Aynı metodolojiyi kullanın

4. **Kayıt Tutun**
   - Güncellemelerinizi not edin
   - Değişim trendlerini takip edin

---

**🎊 AI Chat ile veri yönetimi artık çok kolay!** 

API key almadan hemen kullanabilirsiniz. 🚀
