'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Bir Hata Oluştu</CardTitle>
          <CardDescription>
            Sayfa yüklenirken bir sorun meydana geldi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {error.message || 'Bilinmeyen bir hata oluştu'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => reset()} className="flex-1">
              Tekrar Dene
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
