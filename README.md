# TÜMSİAD Denizli - Stratejik Yönetim Platformu

TÜMSİAD Denizli şubesi için geliştirilmiş modern, interaktif stratejik analiz ve yönetim dashboard'u.

## 🎯 Özellikler

### Ana Modüller

- **Ana Dashboard**: Özet metrikler, KPI kartları, trend grafikleri
- **Karşılaştırmalı Analiz**: TÜMSİAD vs MÜSİAD vs ASKON detaylı karşılaştırma ve SWOT analizi
- **Dijital Varlık Takibi**: Web sitesi ve sosyal medya performans analizi
- **Üye Yönetimi**: Üye veritabanı, sektör dağılımı ve büyüme takibi
- **Etkinlik Yönetimi**: Etkinlik planlama, katılım takibi ve performans analizi
- **İletişim Stratejisi**: Kampanya yönetimi, içerik takvimi ve medya takibi
- **Bölgesel Etki**: Denizli ilçe bazlı üye dağılımı ve rekabet analizi
- **Hedefler & KPI**: Stratejik hedef belirleme ve performans göstergesi takibi
- **Raporlama**: Otomatik ve özel rapor oluşturma sistemi

## 🚀 Teknoloji Stack

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Recharts** - İnteraktif grafik ve chart'lar
- **Lucide Icons** - Modern icon set

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma ORM** - Type-safe database ORM
- **SQLite** - Development database
- **Zod** - Runtime type validation

### Özellikler
- ✅ Responsive tasarım (mobil, tablet, desktop)
- ✅ Modern ve profesyonel UI/UX
- ✅ Server-side rendering (SSR)
- ✅ Type-safe development
- ✅ Real-time data updates
- 🔄 Dark/Light mode (yakında)
- 🔄 PDF/Excel export (yakında)
- 🔄 Authentication & Authorization (yakında)

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
\`\`\`bash
git clone [repository-url]
cd tumsiad
\`\`\`

2. **Bağımlılıkları yükleyin**
\`\`\`bash
npm install
\`\`\`

3. **Environment variables ayarlayın**
\`\`\`bash
cp .env.example .env
\`\`\`

`.env` dosyasını düzenleyin:
\`\`\`
DATABASE_URL="file:./dev.db"
\`\`\`

4. **Veritabanını oluşturun**
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. **Seed data ekleyin (opsiyonel)**
\`\`\`bash
npx tsx lib/seed.ts
\`\`\`

6. **Development sunucusunu başlatın**
\`\`\`bash
npm run dev
\`\`\`

Tarayıcınızda `http://localhost:3000` adresini açın.

## 🗂️ Proje Yapısı

\`\`\`
tumsiad/
├── app/
│   ├── (dashboard)/          # Dashboard layout ve sayfalar
│   │   ├── dashboard/
│   │   │   ├── page.tsx      # Ana dashboard
│   │   │   ├── analiz/       # Karşılaştırmalı analiz
│   │   │   ├── dijital-varlik/
│   │   │   ├── uyeler/
│   │   │   ├── etkinlikler/
│   │   │   ├── iletisim/
│   │   │   ├── bolgesel/
│   │   │   ├── hedefler/
│   │   │   └── raporlar/
│   │   └── layout.tsx
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (redirect)
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard/            # Dashboard özel componentler
│   ├── charts/               # Chart componentleri
│   └── layout/               # Layout componentleri
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── utils.ts              # Utility fonksiyonlar
│   └── seed.ts               # Database seed script
├── prisma/
│   └── schema.prisma         # Database schema
├── types/
│   └── index.ts              # TypeScript type definitions
└── package.json
\`\`\`

## 📊 Veritabanı Modeli

### Ana Tablolar

- **Users** - Kullanıcılar ve authentication
- **Members** - Üye bilgileri ve profilleri
- **Events** - Etkinlikler
- **EventParticipants** - Etkinlik katılımcıları
- **Competitors** - Rakip STK bilgileri
- **DigitalMetrics** - Dijital varlık metrikleri
- **SocialMediaStats** - Sosyal medya istatistikleri
- **Goals** - Stratejik hedefler
- **KPIs** - Performans göstergeleri
- **Reports** - Raporlar
- **Activities** - Aktivite logları
- **Campaigns** - İletişim kampanyaları

## 🛠️ Geliştirme

### Önemli Komutlar

\`\`\`bash
# Development sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint

# Prisma Studio (database GUI)
npx prisma studio

# Database migration
npx prisma migrate dev

# Type checking
npx tsc --noEmit
\`\`\`

### Component Ekleme

shadcn/ui component eklemek için:

\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

## 📝 Yapılacaklar

- [ ] Authentication sistemi (NextAuth.js)
- [ ] Role-based access control
- [ ] Dark/Light mode toggle
- [ ] PDF/Excel export özellikleri
- [ ] Real-time notifications
- [ ] Web scraper geliştirme (rakip analiz)
- [ ] Email integration
- [ ] Advanced filtering ve search
- [ ] Data visualization improvements
- [ ] Mobile app (React Native)
- [ ] AI/ML integration (tahmin modelleri)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (\`git checkout -b feature/amazing-feature\`)
3. Değişikliklerinizi commit edin (\`git commit -m 'Add amazing feature'\`)
4. Branch'inizi push edin (\`git push origin feature/amazing-feature\`)
5. Pull Request açın

## 📄 Lisans

Bu proje TÜMSİAD Denizli için özel olarak geliştirilmiştir.

## 📞 İletişim

TÜMSİAD Denizli  
Web: [tumsiad.org.tr](https://tumsiad.org.tr)  
E-posta: info@tumsiad.org.tr

---

**Not**: Bu proje aktif geliştirme aşamasındadır. Öneriler ve geri bildirimler için lütfen issue açın.