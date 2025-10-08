"use client"

import { useState } from 'react'
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

interface EventFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function EventForm({ open, onOpenChange, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SEMINAR',
    startDate: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    capacity: '',
    cost: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Tarih ve saat birleştir
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = formData.endTime
        ? new Date(`${formData.startDate}T${formData.endTime}`)
        : null

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime?.toISOString(),
          location: formData.location,
          address: formData.address,
          city: 'Denizli',
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          cost: formData.cost ? parseFloat(formData.cost) : 0,
          status: 'PLANNED',
        }),
      })

      if (!response.ok) {
        throw new Error('Etkinlik eklenirken bir hata oluştu')
      }

      // Form'u temizle
      setFormData({
        title: '',
        description: '',
        type: 'SEMINAR',
        startDate: '',
        startTime: '',
        endTime: '',
        location: '',
        address: '',
        capacity: '',
        cost: '',
      })

      // Success callback
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Etkinlik eklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
          <DialogDescription>
            Etkinlik bilgilerini girin. Zorunlu alanları doldurun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Etkinlik Adı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Tarih <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">
                Başlangıç <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Bitiş</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Mekan</Label>
              <Input
                id="location"
                placeholder="Örn: TÜMSİAD Konferans Salonu"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasite</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                placeholder="Maksimum katılımcı sayısı"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Ücret (TL)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
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
              {loading ? 'Kaydediliyor...' : 'Etkinlik Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
