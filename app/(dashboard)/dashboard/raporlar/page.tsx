"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToastHelpers } from "@/components/ui/toast"
import { 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Plus,
  RefreshCw,
  Filter
} from "lucide-react"
import { generateReportPDF, generatePDFBlob, type ReportData } from "@/lib/pdf-generator"

interface Report {
  id: string
  title: string
  type: string
  period: string
  generatedAt: string
  generatedBy: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const toast = useToastHelpers()

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Raporlar yüklenirken hata:', error)
      toast.error('Raporlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const generateReport = async (type: string) => {
    setGenerating(true)
    try {
      // Generate report data
      const [membersResponse, eventsResponse, competitorsResponse] = await Promise.all([
        fetch('/api/analytics/member-stats'),
        fetch('/api/analytics/event-stats'),
        fetch('/api/competitors/comparison')
      ])

      const [membersData, eventsData, competitorsData] = await Promise.all([
        membersResponse.json(),
        eventsResponse.json(),
        competitorsResponse.json()
      ])

      // Create report data structure
      const reportData: ReportData = {
        title: `${type === 'monthly' ? 'Aylık' : type === 'quarterly' ? 'Çeyrek' : 'Yıllık'} Rapor`,
        period: new Date().toLocaleDateString('tr-TR'),
        generatedAt: new Date().toISOString(),
        generatedBy: 'Sistem',
        summary: {
          totalMembers: membersData.totalMembers,
          totalEvents: eventsData.totalEvents,
          memberGrowth: 12.5, // This would be calculated from historical data
          avgEventAttendance: eventsData.avgParticipantsPerEvent
        },
        members: {
          total: membersData.totalMembers,
          active: membersData.activeMembers,
          inactive: membersData.inactiveMembers,
          cityDistribution: membersData.cityDistribution,
          sectorDistribution: membersData.sectorDistribution
        },
        events: {
          total: eventsData.totalEvents,
          thisYear: eventsData.thisYearEvents,
          typeDistribution: eventsData.eventTypeDistribution,
          statusDistribution: eventsData.statusDistribution
        },
        competitors: competitorsData.competitors?.map((comp: any) => ({
          name: comp.name,
          digitalScore: comp.digitalScore || 0,
          socialMedia: comp.socialMedia || {}
        })) || []
      }

      // Save report to database
      const saveResponse = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          period: new Date().toISOString().slice(0, 7),
          userId: 'system'
        })
      })

      if (!saveResponse.ok) {
        throw new Error('Rapor kaydedilemedi')
      }

      // Generate PDF
      const html = generateReportPDF(reportData)
      const pdfBlob = await generatePDFBlob(html)
      
      // Download PDF
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tumsiad-${type}-rapor-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Rapor başarıyla oluşturuldu!')
      fetchReports() // Refresh reports list
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error)
      toast.error('Rapor oluşturulamadı')
    } finally {
      setGenerating(false)
    }
  }

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`)
      if (response.ok) {
        const report = await response.json()
        
        // Generate PDF from saved report
        const reportData: ReportData = {
          title: report.title,
          period: report.period,
          generatedAt: report.generatedAt,
          generatedBy: report.generatedBy,
          summary: report.data.summary,
          members: report.data.members,
          events: report.data.events,
          competitors: report.data.competitors
        }

        const html = generateReportPDF(reportData)
        const pdfBlob = await generatePDFBlob(html)
        
        // Download PDF
        const url = URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `tumsiad-rapor-${report.period}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success('Rapor indirildi!')
      }
    } catch (error) {
      console.error('Rapor indirme hatası:', error)
      toast.error('Rapor indirilemedi')
    }
  }

  const columns = [
    {
      key: 'title' as keyof Report,
      title: 'Başlık',
      sortable: true
    },
    {
      key: 'type' as keyof Report,
      title: 'Tür',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'MONTHLY' ? 'default' : value === 'QUARTERLY' ? 'secondary' : 'outline'}>
          {value === 'MONTHLY' ? 'Aylık' : value === 'QUARTERLY' ? 'Çeyrek' : 'Yıllık'}
        </Badge>
      )
    },
    {
      key: 'period' as keyof Report,
      title: 'Dönem',
      sortable: true
    },
    {
      key: 'generatedAt' as keyof Report,
      title: 'Oluşturulma Tarihi',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'generatedBy' as keyof Report,
      title: 'Oluşturan',
      sortable: true
    },
    {
      key: 'actions' as keyof Report,
      title: 'İşlemler',
      render: (_: any, report: Report) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => downloadReport(report.id)}
        >
          <Download className="h-4 w-4 mr-2" />
          İndir
        </Button>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raporlar</h1>
          <p className="text-muted-foreground">
            Stratejik analiz raporları ve performans ölçümleri
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={fetchReports}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hızlı Rapor Oluştur</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => generateReport('monthly')}
            disabled={generating}
            className="h-20 flex flex-col items-center justify-center"
          >
            <Calendar className="h-6 w-6 mb-2" />
            Aylık Rapor
            {generating && <LoadingSpinner size="sm" className="mt-2" />}
          </Button>
          <Button
            onClick={() => generateReport('quarterly')}
            disabled={generating}
            variant="secondary"
            className="h-20 flex flex-col items-center justify-center"
          >
            <FileText className="h-6 w-6 mb-2" />
            Çeyrek Rapor
            {generating && <LoadingSpinner size="sm" className="mt-2" />}
          </Button>
          <Button
            onClick={() => generateReport('yearly')}
            disabled={generating}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <User className="h-6 w-6 mb-2" />
            Yıllık Rapor
            {generating && <LoadingSpinner size="sm" className="mt-2" />}
          </Button>
        </div>
      </Card>

      {/* Reports Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Rapor Geçmişi</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </div>

        {reports.length > 0 ? (
          <DataTable
            data={reports}
            columns={columns}
            searchable={true}
            searchPlaceholder="Rapor ara..."
            pageSize={10}
          />
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Henüz rapor oluşturulmamış</h3>
            <p className="text-muted-foreground mb-4">
              İlk raporunuzu oluşturmak için yukarıdaki butonları kullanın
            </p>
            <Button onClick={() => generateReport('monthly')} disabled={generating}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Rapor Oluştur
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}