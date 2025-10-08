/**
 * Sosyal Medya API Entegrasyonları
 * 
 * Sadece 3 platform: Facebook, Instagram, Twitter
 */

import axios from 'axios'

// ============================================================================
// TWITTER/X API v2
// ============================================================================

export interface TwitterMetrics {
  username: string
  followers: number
  following: number
  tweets: number
  verified: boolean
}

/**
 * Twitter kullanıcı bilgilerini çeker
 * Docs: https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference
 */
export async function getTwitterMetrics(username: string): Promise<TwitterMetrics | null> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    console.warn('Twitter Bearer Token bulunamadı')
    return null
  }

  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        params: {
          'user.fields': 'public_metrics,verified',
        },
      }
    )

    const user = response.data.data
    return {
      username: user.username,
      followers: user.public_metrics.followers_count,
      following: user.public_metrics.following_count,
      tweets: user.public_metrics.tweet_count,
      verified: user.verified,
    }
  } catch (error) {
    console.error('Twitter API error:', error)
    return null
  }
}

// YouTube API kaldırıldı - Gerek yok

// ============================================================================
// INSTAGRAM GRAPH API
// ============================================================================

export interface InstagramMetrics {
  username: string
  followers: number
  follows: number
  mediaCount: number
}

/**
 * Instagram Business Account bilgilerini çeker
 * Docs: https://developers.facebook.com/docs/instagram-api
 * Not: Business account ve Facebook App gerektirir
 */
export async function getInstagramMetrics(businessAccountId: string): Promise<InstagramMetrics | null> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!accessToken) {
    console.warn('Instagram Access Token bulunamadı')
    return null
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${businessAccountId}`,
      {
        params: {
          fields: 'username,followers_count,follows_count,media_count',
          access_token: accessToken,
        },
      }
    )

    return {
      username: response.data.username,
      followers: response.data.followers_count,
      follows: response.data.follows_count,
      mediaCount: response.data.media_count,
    }
  } catch (error) {
    console.error('Instagram API error:', error)
    return null
  }
}

// ============================================================================
// FACEBOOK GRAPH API
// ============================================================================

export interface FacebookMetrics {
  name: string
  likes: number
  followers: number
  engagement: number
}

/**
 * Facebook sayfa bilgilerini çeker
 * Docs: https://developers.facebook.com/docs/graph-api/reference/page
 */
export async function getFacebookMetrics(pageId: string): Promise<FacebookMetrics | null> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

  if (!accessToken) {
    console.warn('Facebook Access Token bulunamadı')
    return null
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      {
        params: {
          fields: 'name,fan_count,followers_count,engagement',
          access_token: accessToken,
        },
      }
    )

    return {
      name: response.data.name,
      likes: response.data.fan_count,
      followers: response.data.followers_count,
      engagement: response.data.engagement?.count || 0,
    }
  } catch (error) {
    console.error('Facebook API error:', error)
    return null
  }
}

// LinkedIn API kaldırıldı - Manuel kontrol yeterli

// PageSpeed API kaldırıldı - Web sitesi için statik alan takibi kullanılacak

// ============================================================================
// TÜM PLATFORMLARI TOPLU GÜNCELLEME
// ============================================================================

export interface CompetitorSocialMedia {
  twitter?: string      // Username
  instagram?: string    // Business Account ID
  facebook?: string     // Page ID
}

/**
 * Bir STK için sosyal medya metriklerini toplar (Sadece 3 platform)
 */
export async function collectAllSocialMediaMetrics(
  accounts: CompetitorSocialMedia
) {
  const results: any = {}

  if (accounts.twitter) {
    results.twitter = await getTwitterMetrics(accounts.twitter)
  }

  if (accounts.instagram) {
    results.instagram = await getInstagramMetrics(accounts.instagram)
  }

  if (accounts.facebook) {
    results.facebook = await getFacebookMetrics(accounts.facebook)
  }

  return results
}

/**
 * Tüm competitor'lar için verileri güncelle ve database'e kaydet
 * Sadece Facebook, Instagram, Twitter
 */
export async function updateAllCompetitorData() {
  const { prisma } = await import('./db')

  console.log('🔄 Sosyal medya verileri güncelleniyor (3 platform)...')

  // TÜMSİAD - Hesap username/ID'leri buraya eklenecek
  const tumMetrics = await collectAllSocialMediaMetrics({
    twitter: 'tumsiad',
    // instagram: 'business_account_id',
    // facebook: 'page_id',
  })

  // MÜSİAD Denizli - Doğrulanmış hesaplar
  const musMetrics = await collectAllSocialMediaMetrics({
    twitter: 'MUSIADDenizli',
    // instagram: 'business_account_id',  
    // facebook: 'page_id',
  })

  // ASKON Denizli
  const askMetrics = await collectAllSocialMediaMetrics({
    // twitter: 'askon_username',
    // instagram: 'business_account_id',
    // facebook: 'page_id',
  })

  console.log('✅ Veriler toplandı')
  console.log('📱 TÜMSİAD:', tumMetrics)
  console.log('📱 MÜSİAD:', musMetrics)
  console.log('📱 ASKON:', askMetrics)

  return {
    tumsiad: tumMetrics,
    musiad: musMetrics,
    askon: askMetrics,
  }
}
