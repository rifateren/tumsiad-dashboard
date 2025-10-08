/**
 * Web Sitesi İzleme ve Değişiklik Takibi
 * 
 * Belirlenen DOM elementlerini periyodik olarak kontrol eder
 * API kullanmadan basit değişiklik tespiti yapar
 * 
 * Sosyal medya link'lerinden takipçi sayısını çeker
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from './db'

// ============================================================================
// SOSYAL MEDYA LINK'LERINDEN VERİ ÇEKME (Public Scraping)
// ============================================================================

/**
 * Instagram link'inden takipçi sayısını çeker
 * Public data - Login gerektirmez
 */
export async function scrapeInstagramFollowers(url: string): Promise<number | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    })

    const html = response.data
    
    // Yöntem 1: JSON-LD içinden (en güvenilir)
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)
    if (jsonLdMatch) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1])
        if (jsonData.interactionStatistic) {
          const followStat = jsonData.interactionStatistic.find((stat: any) => 
            stat.interactionType === 'http://schema.org/FollowAction'
          )
          if (followStat?.userInteractionCount) {
            return parseInt(followStat.userInteractionCount)
          }
        }
      } catch (e) {}
    }

    // Yöntem 2: Meta tags
    const $ = cheerio.load(html)
    const metaContent = $('meta[property="og:description"]').attr('content')
    if (metaContent) {
      const match = metaContent.match(/([\d,\.]+[KMB]?)\s*(?:Followers?|Takipçi)/i)
      if (match) {
        return parseFollowerCount(match[1])
      }
    }

    // Yöntem 3: Shared data içinden
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/)
    if (sharedDataMatch) {
      try {
        const sharedData = JSON.parse(sharedDataMatch[1])
        const user = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user
        if (user?.edge_followed_by?.count) {
          return user.edge_followed_by.count
        }
      } catch (e) {}
    }

    // Yöntem 4: JSON içinden direkt arama
    const metaMatch = html.match(/"edge_followed_by":\s*{\s*"count"\s*:\s*(\d+)/)
    if (metaMatch) {
      return parseInt(metaMatch[1])
    }

    const followersMatch = html.match(/"followers_count"\s*:\s*(\d+)/)
    if (followersMatch) {
      return parseInt(followersMatch[1])
    }

    console.log('Instagram: Tüm yöntemler başarısız. HTML snippet:', html.substring(0, 500))
    return null
  } catch (error) {
    console.error('Instagram scrape error:', error)
    return null
  }
}

/**
 * Twitter link'inden takipçi sayısını çeker
 */
export async function scrapeTwitterFollowers(url: string): Promise<number | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    })

    const html = response.data
    const $ = cheerio.load(html)
    
    // Yöntem 1: Meta tags
    const metaDescription = $('meta[property="og:description"]').attr('content') || 
                           $('meta[name="description"]').attr('content')
    
    if (metaDescription) {
      const match = metaDescription.match(/([\d,\.]+[KMB]?)\s*(?:Followers?|Takipçi)/i)
      if (match) {
        return parseFollowerCount(match[1])
      }
    }

    // Yöntem 2: Title tag
    const title = $('title').text()
    const titleMatch = title.match(/([\d,\.]+[KMB]?)\s*(?:Followers?|Takipçi)/i)
    if (titleMatch) {
      return parseFollowerCount(titleMatch[1])
    }

    // Yöntem 3: JSON içinden
    const jsonMatch = html.match(/"followers_count"\s*:\s*(\d+)/)
    if (jsonMatch) {
      return parseInt(jsonMatch[1])
    }

    // Yöntem 4: Any text match
    const textMatch = html.match(/([\d,\.]+[KMB]?)\s*Followers?/i)
    if (textMatch) {
      return parseFollowerCount(textMatch[1])
    }

    console.log('Twitter: Tüm yöntemler başarısız. Title:', title)
    return null
  } catch (error) {
    console.error('Twitter scrape error:', error)
    return null
  }
}

/**
 * Facebook link'inden beğeni sayısını çeker
 */
export async function scrapeFacebookFollowers(url: string): Promise<number | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    })

    const html = response.data
    const $ = cheerio.load(html)
    
    // Yöntem 1: Meta tags
    const metaDescription = $('meta[property="og:description"]').attr('content') || 
                           $('meta[name="description"]').attr('content')
    
    if (metaDescription) {
      const match = metaDescription.match(/([\d,\.]+[KMB]?)\s*(?:people\s+like|likes?|followers?|beğen|takipçi)/i)
      if (match) {
        return parseFollowerCount(match[1])
      }
    }

    // Yöntem 2: Title
    const title = $('title').text()
    const titleMatch = title.match(/([\d,\.]+[KMB]?)\s*(?:likes?|followers?|beğen)/i)
    if (titleMatch) {
      return parseFollowerCount(titleMatch[1])
    }

    // Yöntem 3: JSON-LD
    const jsonLd = $('script[type="application/ld+json"]').html()
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd)
        if (data.interactionStatistic) {
          const likeStat = data.interactionStatistic.find((stat: any) => 
            stat.interactionType?.includes('LikeAction')
          )
          if (likeStat?.userInteractionCount) {
            return parseInt(likeStat.userInteractionCount)
          }
        }
      } catch (e) {}
    }

    // Yöntem 4: JSON içinden
    const jsonMatch = html.match(/"followerCount"\s*:\s*(\d+)/)
    if (jsonMatch) {
      return parseInt(jsonMatch[1])
    }

    console.log('Facebook: Tüm yöntemler başarısız. Title:', title)
    return null
  } catch (error) {
    console.error('Facebook scrape error:', error)
    return null
  }
}

/**
 * K, M, B formatını sayıya çevir
 * Örnek: "8.5K" → 8500, "1.2M" → 1200000, "1,624" → 1624, "1.624" → 1624
 */
function parseFollowerCount(str: string): number {
  // K, M, B var mı kontrol et
  const hasMultiplier = /[KMB]/i.test(str)
  
  if (hasMultiplier) {
    // "8.5K" formatı için
    const num = parseFloat(str.replace(/[^\d.]/g, ''))
    
    if (str.toUpperCase().includes('K')) return Math.round(num * 1000)
    if (str.toUpperCase().includes('M')) return Math.round(num * 1000000)
    if (str.toUpperCase().includes('B')) return Math.round(num * 1000000000)
  }
  
  // Normal sayı (1,624 veya 1.624 veya 1624 formatları)
  // Önce tüm virgül ve noktaları kaldır, sonra sayıya çevir
  const cleaned = str.replace(/[^\d]/g, '') // Sadece rakamları al
  return parseInt(cleaned) || 0
}

/**
 * URL'den platform ve STK bilgisini çıkar
 */
export function parseUrlInfo(url: string): { 
  platform: 'instagram' | 'twitter' | 'facebook' | null
  stk: string | null
} {
  const lower = url.toLowerCase()
  
  let platform: 'instagram' | 'twitter' | 'facebook' | null = null
  let stk: string | null = null

  // Platform tespit
  if (lower.includes('instagram.com')) {
    platform = 'instagram'
  } else if (lower.includes('twitter.com') || lower.includes('x.com')) {
    platform = 'twitter'
  } else if (lower.includes('facebook.com')) {
    platform = 'facebook'
  }

  // STK tespit (username'den)
  if (lower.includes('musiad')) {
    stk = 'MÜSİAD'
  } else if (lower.includes('tumsiad')) {
    stk = 'TÜMSİAD'
  } else if (lower.includes('askon')) {
    stk = 'ASKON'
  }

  return { platform, stk }
}

/**
 * Link'ten otomatik veri çek
 */
export async function scrapeFromUrl(url: string) {
  const { platform, stk } = parseUrlInfo(url)

  if (!platform) {
    return { error: 'Platform tespit edilemedi. Instagram, Twitter veya Facebook linki mi?' }
  }

  let followers: number | null = null

  if (platform === 'instagram') {
    followers = await scrapeInstagramFollowers(url)
  } else if (platform === 'twitter') {
    followers = await scrapeTwitterFollowers(url)
  } else if (platform === 'facebook') {
    followers = await scrapeFacebookFollowers(url)
  }

  if (!followers) {
    return { error: 'Takipçi sayısı çekilemedi. Sayıyı manuel girebilir misiniz?' }
  }

  return {
    platform,
    stk,
    followers,
    url,
  }
}

export interface WebsiteCheckpoint {
  url: string
  selector: string  // CSS selector
  description: string
  lastValue?: string
  lastChecked?: Date
}

// Her STK için kontrol edilecek alanlar
export const websiteCheckpoints: Record<string, WebsiteCheckpoint[]> = {
  'TÜMSİAD': [
    {
      url: 'https://www.tumsiad.org.tr',
      selector: 'title',
      description: 'Sayfa başlığı',
    },
    {
      url: 'https://www.tumsiad.org.tr',
      selector: 'meta[name="description"]',
      description: 'Meta açıklama',
    },
    {
      url: 'https://www.tumsiad.org.tr',
      selector: '.news-section',  // Örnek selector
      description: 'Haber bölümü içeriği',
    },
  ],
  'MÜSİAD': [
    {
      url: 'https://www.musiaddenizli.org/',
      selector: 'title',
      description: 'Sayfa başlığı',
    },
    {
      url: 'https://www.musiaddenizli.org/',
      selector: '.member-count',  // Örnek
      description: 'Üye sayısı göstergesi',
    },
  ],
  'ASKON': [
    {
      url: 'https://www.askon.org.tr',
      selector: 'title',
      description: 'Sayfa başlığı',
    },
  ],
}

/**
 * Web sitesinin belirli alanlarını kontrol et
 */
export async function checkWebsiteChanges(competitorName: string): Promise<any> {
  const checkpoints = websiteCheckpoints[competitorName]
  
  if (!checkpoints) {
    return { error: 'Competitor bulunamadı' }
  }

  const results = []

  try {
    for (const checkpoint of checkpoints) {
      const response = await axios.get(checkpoint.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TÜMSİAD-Dashboard-Monitor/1.0',
        },
      })

      const html = response.data
      
      // Basit pattern matching (gerçek scraping için Cheerio/Puppeteer gerekir)
      const titleMatch = html.match(/<title>(.*?)<\/title>/)
      const title = titleMatch ? titleMatch[1] : 'Bulunamadı'

      results.push({
        checkpoint: checkpoint.description,
        selector: checkpoint.selector,
        found: !!titleMatch,
        value: title,
        changed: checkpoint.lastValue && checkpoint.lastValue !== title,
      })
    }

    return {
      competitor: competitorName,
      url: checkpoints[0].url,
      timestamp: new Date().toISOString(),
      checks: results,
      hasChanges: results.some(r => r.changed),
    }

  } catch (error) {
    console.error(`Website check error for ${competitorName}:`, error)
    return {
      error: 'Web sitesi kontrol edilemedi',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Web sitesi temel metriklerini manuel değerlendirme ile güncelle
 */
export async function updateWebsiteMetricsManual(
  competitorId: string,
  metrics: {
    seoScore: number
    pageSpeed: number
    mobileScore: number
    contentScore: number
  }
) {
  const overallScore = Math.round(
    (metrics.seoScore + metrics.pageSpeed + metrics.mobileScore + metrics.contentScore) / 4
  )

  await prisma.digitalMetric.create({
    data: {
      competitorId,
      ...metrics,
      overallScore,
    },
  })

  return { success: true, overallScore }
}
