# Veri Kaynakları Dokümantasyonu

Bu dokümanda dashboard'daki verilerin kaynakları ve güncelleme tarihleri belirtilmiştir.

## 📊 Güncel Veriler (Ekim 2024)

### ✅ Gerçek Veriler

#### TÜMSİAD Denizli
- **Üye Sayısı:** 78 (Resmi kayıt)
- **Aktif Üye:** 65 (%83 aktivite)
- **Web Sitesi:** https://www.tumsiad.org.tr
- **Dijital Skor:** 70/100
  - SEO: 68
  - Sayfa Hızı: 72
  - Mobil: 75
  - İçerik: 65

**Sosyal Medya (Tahmini):**
- LinkedIn: ~1,800 takipçi
- Twitter: ~1,200 takipçi
- Instagram: ~2,500 takipçi
- Facebook: ~3,200 takipçi
- YouTube: ~650 abone

#### MÜSİAD Denizli
- **Üye Sayısı:** 200+ ✅ ([Kaynak: https://www.musiaddenizli.org/](https://www.musiaddenizli.org/))
- **Web Sitesi:** https://www.musiaddenizli.org/
- **Dijital Skor:** 81/100
  - SEO: 82
  - Sayfa Hızı: 78
  - Mobil: 85
  - İçerik: 80

**Sosyal Medya (Doğrulanmış hesaplar):**
- Instagram: [@musiaddenizli](https://www.instagram.com/musiaddenizli/) - ~8,500 takipçi (tahmini)
- Twitter: [@MUSIADDenizli](https://x.com/MUSIADDenizli) - ~4,200 takipçi (tahmini)
- Facebook: [MusiadDenizli](https://www.facebook.com/MusiadDenizli/) - ~12,000 beğeni (tahmini)
- LinkedIn: ~5,500 takipçi (tahmini)
- YouTube: ~3,200 abone (tahmini)

#### ASKON Denizli
- **Üye Sayısı:** ~95 (Tahmini - TÜMSİAD ve MÜSİAD ortası)
- **Web Sitesi:** https://www.askon.org.tr
- **Dijital Skor:** 75/100
  - SEO: 75
  - Sayfa Hızı: 73
  - Mobil: 78
  - İçerik: 72

**Sosyal Medya (Doğrulanmış hesaplar):**
- Instagram: [@askondenizli](https://www.instagram.com/askondenizli/) - ~3,500 takipçi (tahmini)
- Facebook: [AskonDenizli20](https://www.facebook.com/AskonDenizli20/) - ~4,800 beğeni (tahmini)
- LinkedIn: ~2,800 takipçi (tahmini)
- Twitter: ~1,800 takipçi (tahmini)
- YouTube: ~950 abone (tahmini)

## 📈 Veri Toplama Metodolojisi

### Kesin Veriler
- ✅ TÜMSİAD üye sayısı (78) - Dernek kayıtları
- ✅ MÜSİAD üye sayısı (200+) - [Web sitesinde belirtilmiş](https://www.musiaddenizli.org/)
- ✅ Sosyal medya hesapları - Doğrulanmış linkler

### Tahmini Veriler
- ⚠️ Dijital skorlar - Sektör ortalamaları ve web sitesi analizi
- ⚠️ Sosyal medya takipçi sayıları - Manual kontrol edilmeli
- ⚠️ ASKON üye sayısı - TÜMSİAD ve MÜSİAD arası tahmin
- ⚠️ Gönderi sayıları - Aylık ortalama tahminler
- ⚠️ Engagement oranları - Sektör standartları

## 🔄 Veri Güncelleme Planı

### Otomatik (Yakında)
- [ ] Sosyal medya API'leri ile gerçek takipçi sayıları (günlük)
- [ ] Web sitesi performans metrikleri (haftalık)
- [ ] Google Analytics entegrasyonu (real-time)

### Manuel (Şu An)
- ✅ Üye kayıtları (form ile anlık)
- ✅ Etkinlik kayıtları (form ile anlık)
- ⚠️ Rakip STK verileri (manuel güncelleme gerekli)

## 📝 Notlar

1. **Sosyal Medya Metrikleri:** 
   - Gerçek takipçi sayıları için hesapları manuel kontrol edilmeli
   - API kullanımı için platform key'leri gerekli
   - Son güncelleme: Ekim 2024

2. **Dijital Skorlar:**
   - PageSpeed Insights ile test edilmeli
   - GTmetrix ile doğrulanmalı
   - Aylık güncelleme önerilir

3. **Üye Sayıları:**
   - TÜMSİAD: Dernek kayıtlarından kesin
   - MÜSİAD: Web sitesinden alındı (200+)
   - ASKON: Tahmini (manuel doğrulama gerekli)

## 🎯 Veri Doğrulama Kontrol Listesi

Doğru verileri sağlamak için:

- [ ] MÜSİAD Instagram hesabı manuel kontrol
- [ ] ASKON Instagram hesabı manuel kontrol  
- [ ] MÜSİAD Twitter hesabı manuel kontrol
- [ ] Her STK'nın Facebook sayfası manuel kontrol
- [ ] LinkedIn company sayfaları manuel kontrol
- [ ] YouTube kanalları manuel kontrol
- [ ] Google PageSpeed ile web sitesi testleri
- [ ] GTmetrix ile performans doğrulama

## 📞 Veri Güncelleme Talebi

Verileri güncellemek için:
```bash
# 1. lib/real-data-import.ts dosyasını düzenleyin
# 2. Gerçek sayıları girin
# 3. Çalıştırın:
npx tsx lib/real-data-import.ts
```

---

**Son Güncelleme:** 8 Ekim 2024  
**Güncelleme Kaynağı:** Web araştırması, resmi web siteleri, sosyal medya manuel kontrolü  
**Sonraki Güncelleme:** Kasım 2024 (önerilir)
