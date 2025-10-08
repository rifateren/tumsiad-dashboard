import { 
  User, Member, Event, EventParticipant, EventFeedback,
  Competitor, DigitalMetric, SocialMediaStat,
  Goal, KPI, Report, Activity, Campaign,
  UserRole, MemberStatus, EventType, EventStatus,
  ParticipationStatus, SocialPlatform, GoalCategory,
  Priority, GoalStatus, KPIFrequency, ReportType,
  CampaignType, CampaignStatus
} from '@prisma/client'

// Re-export Prisma types
export type {
  User, Member, Event, EventParticipant, EventFeedback,
  Competitor, DigitalMetric, SocialMediaStat,
  Goal, KPI, Report, Activity, Campaign,
  UserRole, MemberStatus, EventType, EventStatus,
  ParticipationStatus, SocialPlatform, GoalCategory,
  Priority, GoalStatus, KPIFrequency, ReportType,
  CampaignType, CampaignStatus
}

// Dashboard Statistics
export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  totalEvents: number
  upcomingEvents: number
  memberGrowthRate: number
  eventParticipationRate: number
  digitalScore: number
}

// Comparative Analysis
export interface CompetitorComparison {
  name: string
  digitalScore: number
  memberCount?: number
  eventCount?: number
  socialMediaReach: number
  websiteScore: number
}

// Chart Data Types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MultiSeriesChartData {
  date: string
  [key: string]: string | number
}

// Sector Distribution
export interface SectorDistribution {
  sector: string
  count: number
  percentage: number
}

// Event Analytics
export interface EventAnalytics {
  eventId: string
  title: string
  participantCount: number
  attendanceRate: number
  averageRating?: number
  roi?: number
}

// Goal Progress
export interface GoalProgress {
  goalId: string
  title: string
  progress: number
  status: GoalStatus
  daysRemaining?: number
}

// Regional Data
export interface RegionalData {
  district: string
  memberCount: number
  eventCount: number
  activeRate: number
  coordinates?: {
    lat: number
    lng: number
  }
}

// Social Media Analytics
export interface SocialMediaAnalytics {
  platform: SocialPlatform
  followers: number
  growthRate: number
  engagement: number
  postsPerWeek: number
}

// Navigation Item
export interface NavItem {
  title: string
  href: string
  icon?: string
  description?: string
  children?: NavItem[]
}
