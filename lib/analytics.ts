/**
 * Analytics Utility Functions
 * 
 * Bu modül veri analizi ve hesaplama için utility fonksiyonlar içerir
 */

/**
 * Yüzde değişim hesapla
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Ortalama hesapla
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * Büyüme oranı hesapla (aylık, yıllık)
 */
export function calculateGrowthRate(
  values: number[],
  period: 'monthly' | 'yearly' = 'monthly'
): number {
  if (values.length < 2) return 0
  
  const first = values[0]
  const last = values[values.length - 1]
  const periods = values.length - 1
  
  if (first === 0) return 0
  
  const growthRate = ((last - first) / first) * 100
  
  if (period === 'yearly' && periods < 12) {
    // Annualize the growth rate
    return (growthRate / periods) * 12
  }
  
  return growthRate
}

/**
 * Trend hesapla (yükselen, düşen, sabit)
 */
export function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable'
  
  const first = values[0]
  const last = values[values.length - 1]
  const changePercent = calculatePercentageChange(last, first)
  
  if (Math.abs(changePercent) < 5) return 'stable'
  return changePercent > 0 ? 'up' : 'down'
}

/**
 * Engagement rate hesapla
 */
export function calculateEngagementRate(
  likes: number,
  comments: number,
  shares: number,
  followers: number
): number {
  if (followers === 0) return 0
  const totalEngagement = likes + comments + shares
  return (totalEngagement / followers) * 100
}

/**
 * ROI hesapla (Return on Investment)
 */
export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0
  return ((revenue - cost) / cost) * 100
}

/**
 * Completion rate hesapla
 */
export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0
  return (completed / total) * 100
}

/**
 * Tarih formatla (Türkçe)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Sayı formatla (Türkçe)
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Para formatla (TL)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Yüzde formatla
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`
}

/**
 * Kısaltılmış sayı formatla (1K, 1M, 1B)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Zaman önce formatla (2 saat önce, 3 gün önce)
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 30) {
    return formatDate(d)
  }
  if (diffDays > 0) {
    return `${diffDays} gün önce`
  }
  if (diffHours > 0) {
    return `${diffHours} saat önce`
  }
  if (diffMins > 0) {
    return `${diffMins} dakika önce`
  }
  return 'Az önce'
}

/**
 * Score'a göre renk sınıfı döndür
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Score'a göre badge variant döndür
 */
export function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 70) return 'default'
  if (score >= 50) return 'secondary'
  return 'destructive'
}
