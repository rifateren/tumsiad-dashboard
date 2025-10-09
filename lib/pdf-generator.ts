// PDF generation utilities for reports

export interface ReportData {
  title: string
  period: string
  generatedAt: string
  generatedBy: string
  summary: {
    totalMembers: number
    totalEvents: number
    memberGrowth: number
    avgEventAttendance: number
  }
  members: {
    total: number
    active: number
    inactive: number
    cityDistribution: Array<{ city: string; count: number }>
    sectorDistribution: Array<{ sector: string; count: number }>
  }
  events: {
    total: number
    thisYear: number
    typeDistribution: Array<{ type: string; count: number }>
    statusDistribution: Array<{ status: string; count: number }>
  }
  competitors: Array<{
    name: string
    digitalScore: number
    socialMedia: Record<string, number>
  }>
}

export function generateReportPDF(data: ReportData): string {
  // HTML template for PDF generation
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section h2 {
          color: #2563eb;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #374151;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .summary-card .value {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          margin: 0;
        }
        .summary-card .change {
          font-size: 14px;
          margin-top: 5px;
        }
        .summary-card .positive {
          color: #059669;
        }
        .summary-card .negative {
          color: #dc2626;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .data-table th,
        .data-table td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        .data-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .data-table tr:nth-child(even) {
          background: #f9fafb;
        }
        .competitor-card {
          display: inline-block;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 10px 10px 0;
          width: 200px;
          vertical-align: top;
        }
        .competitor-card h4 {
          margin: 0 0 10px 0;
          color: #2563eb;
        }
        .score {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
          margin: 5px 0;
        }
        .social-stats {
          font-size: 12px;
          color: #6b7280;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TÜMSİAD Denizli</h1>
        <p>${data.title}</p>
        <p>Dönem: ${data.period}</p>
        <p>Oluşturulma Tarihi: ${new Date(data.generatedAt).toLocaleDateString('tr-TR')}</p>
        <p>Oluşturan: ${data.generatedBy}</p>
      </div>

      <div class="section">
        <h2>📊 Özet Bilgiler</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Toplam Üye</h3>
            <p class="value">${data.summary.totalMembers}</p>
          </div>
          <div class="summary-card">
            <h3>Toplam Etkinlik</h3>
            <p class="value">${data.summary.totalEvents}</p>
          </div>
          <div class="summary-card">
            <h3>Üye Artışı</h3>
            <p class="value">%${data.summary.memberGrowth}</p>
            <p class="change ${data.summary.memberGrowth >= 0 ? 'positive' : 'negative'}">
              ${data.summary.memberGrowth >= 0 ? '↗' : '↘'} Önceki döneme göre
            </p>
          </div>
          <div class="summary-card">
            <h3>Ort. Katılım</h3>
            <p class="value">${data.summary.avgEventAttendance}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>👥 Üye İstatistikleri</h2>
        <table class="data-table">
          <tr>
            <th>Kategori</th>
            <th>Sayı</th>
            <th>Yüzde</th>
          </tr>
          <tr>
            <td>Aktif Üyeler</td>
            <td>${data.members.active}</td>
            <td>%${Math.round((data.members.active / data.members.total) * 100)}</td>
          </tr>
          <tr>
            <td>Pasif Üyeler</td>
            <td>${data.members.inactive}</td>
            <td>%${Math.round((data.members.inactive / data.members.total) * 100)}</td>
          </tr>
        </table>

        <h3>Şehir Dağılımı</h3>
        <table class="data-table">
          <tr>
            <th>Şehir</th>
            <th>Üye Sayısı</th>
          </tr>
          ${data.members.cityDistribution.map(item => `
            <tr>
              <td>${item.city}</td>
              <td>${item.count}</td>
            </tr>
          `).join('')}
        </table>

        <h3>Sektör Dağılımı</h3>
        <table class="data-table">
          <tr>
            <th>Sektör</th>
            <th>Üye Sayısı</th>
          </tr>
          ${data.members.sectorDistribution.map(item => `
            <tr>
              <td>${item.sector}</td>
              <td>${item.count}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="section">
        <h2>🎯 Etkinlik İstatistikleri</h2>
        <table class="data-table">
          <tr>
            <th>Kategori</th>
            <th>Sayı</th>
          </tr>
          <tr>
            <td>Bu Yılki Etkinlikler</td>
            <td>${data.events.thisYear}</td>
          </tr>
          <tr>
            <td>Toplam Etkinlik</td>
            <td>${data.events.total}</td>
          </tr>
        </table>

        <h3>Etkinlik Türü Dağılımı</h3>
        <table class="data-table">
          <tr>
            <th>Tür</th>
            <th>Sayı</th>
          </tr>
          ${data.events.typeDistribution.map(item => `
            <tr>
              <td>${item.type}</td>
              <td>${item.count}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="section">
        <h2>🏆 Rakip Analizi</h2>
        ${data.competitors.map(comp => `
          <div class="competitor-card">
            <h4>${comp.name}</h4>
            <div class="score">${comp.digitalScore}/100</div>
            <div class="social-stats">
              ${Object.entries(comp.socialMedia).map(([platform, count]) => `
                <div>${platform}: ${count.toLocaleString()}</div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <p>Bu rapor TÜMSİAD Denizli Stratejik Yönetim Platformu tarafından otomatik olarak oluşturulmuştur.</p>
        <p>© ${new Date().getFullYear()} TÜMSİAD Denizli - Tüm hakları saklıdır.</p>
      </div>
    </body>
    </html>
  `

  return html
}

// Export function for generating PDF blob
export async function generatePDFBlob(html: string): Promise<Blob> {
  // In a real implementation, you would use a PDF generation library like:
  // - Puppeteer
  // - jsPDF
  // - html2pdf
  // - wkhtmltopdf
  
  // For now, return a mock blob
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html })
  })
  
  if (!response.ok) {
    throw new Error('PDF oluşturulamadı')
  }
  
  return response.blob()
}
