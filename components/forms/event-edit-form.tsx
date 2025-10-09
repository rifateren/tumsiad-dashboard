"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { eventSchema, validateFormData } from '@/lib/validation'
import { useToastHelpers } from '@/components/ui/toast'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Event {
  id: string
  title: string
  description?: string
  type: string
  startDate: string
  endDate?: string
  location?: string
  address?: string
  city: string
  capacity?: number
  cost?: number
  status: string
}

interface EventEditFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  onSuccess?: () => void
}

const eventTypes = [
  { value: 'CONFERENCE', label: 'Konferans' },
  { value: 'SEMINAR', label: 'Seminer' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'TRAINING', label: 'Eğitim' },
  { value: 'SOCIAL_RESPONSIBILITY', label: 'Sosyal Sorumluluk' },
  { value: 'MEETING', label: 'Toplantı' },
  { value: 'OTHER', label: 'Diğer' },
]

const eventStatuses = [
  { value: 'PLANNED', label: 'Planlanan' },
  { value: 'ONGOING', label: 'Devam Eden' },
  { value: 'COMPLETED', label: 'Tamamlanan' },
  { value: 'CANCELLED', label: 'İptal' },
]

export function EventEditForm({ open, onOpenChange, event, onSuccess }: EventEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toast = useToastHelpers()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SEMINAR',
    startDate: '',
    endDate: '',
    location: '',
    address: '',
    capacity: '',
    cost: '',
    status: 'PLANNED',
  })

  // Form'u event verisiyle doldur
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        type: event.type || 'SEMINAR',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        location: event.location || '',
        address: event.address || '',
        capacity: event.capacity?.toString() || '',
        cost: event.cost?.toString() || '',
        status: event.status || 'PLANNED',
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    
    setLoading(true)
    setErrors({})

    // Validate form data
    const validation = validateFormData(eventSchema, {
      ...formData,
      city: 'Denizli',
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined
    })

    if (!validation.success) {
      setErrors(validation.errors)
      setLoading(false)
      toast.error('Lütfen form hatalarını düzeltin')
      return
    }

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Etkinlik güncellenirken bir hata oluştu')
      }

      toast.success('Etkinlik başarıyla güncellendi!')
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error(error instanceof Error ? error.message : 'Etkinlik güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Etkinlik Düzenle</DialogTitle>
          <DialogDescription>
            {event.title} etkinliğini düzenleyin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Etkinlik Başlığı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? 'border-red-500' : ''}
              required
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Etkinlik Türü <span className="text-destructive">*</span>
              </Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                {eventStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Başlangıç Tarihi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className={errors.startDate ? 'border-red-500' : ''}
                required
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Konum</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasite</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10000"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Maliyet (TL)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Güncelleniyor...
                </>
              ) : (
                'Güncelle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
