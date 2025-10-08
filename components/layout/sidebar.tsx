"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  BarChart3, 
  Globe, 
  Users, 
  Calendar, 
  MessageSquare, 
  MapPin, 
  Target,
  FileText,
  Settings
} from 'lucide-react'

const navigation = [
  {
    name: 'Ana Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Karşılaştırmalı Analiz',
    href: '/dashboard/analiz',
    icon: BarChart3,
  },
  {
    name: 'Dijital Varlık',
    href: '/dashboard/dijital-varlik',
    icon: Globe,
  },
  {
    name: 'Üye Yönetimi',
    href: '/dashboard/uyeler',
    icon: Users,
  },
  {
    name: 'Etkinlikler',
    href: '/dashboard/etkinlikler',
    icon: Calendar,
  },
  {
    name: 'İletişim Stratejisi',
    href: '/dashboard/iletisim',
    icon: MessageSquare,
  },
  {
    name: 'Bölgesel Etki',
    href: '/dashboard/bolgesel',
    icon: MapPin,
  },
  {
    name: 'Hedefler & KPI',
    href: '/dashboard/hedefler',
    icon: Target,
  },
  {
    name: 'Raporlar',
    href: '/dashboard/raporlar',
    icon: FileText,
  },
  {
    name: 'Ayarlar',
    href: '/dashboard/ayarlar',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 z-50 border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">TÜMSİAD</h1>
            <p className="text-xs text-muted-foreground">Denizli</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 TÜMSİAD Denizli
        </div>
      </div>
    </div>
  )
}
