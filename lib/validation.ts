import { z } from "zod"

// Member validation schema
export const memberSchema = z.object({
  firstName: z.string()
    .min(2, "Ad en az 2 karakter olmalı")
    .max(50, "Ad en fazla 50 karakter olmalı"),
  lastName: z.string()
    .min(2, "Soyad en az 2 karakter olmalı")
    .max(50, "Soyad en fazla 50 karakter olmalı"),
  email: z.string()
    .email("Geçerli bir email adresi girin")
    .max(100, "Email en fazla 100 karakter olmalı"),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^(\+90|0)?[5][0-9]{9}$/.test(val), {
      message: "Geçerli bir telefon numarası girin (örn: 0532 123 45 67)"
    }),
  company: z.string()
    .max(100, "Şirket adı en fazla 100 karakter olmalı")
    .optional(),
  position: z.string()
    .max(100, "Pozisyon en fazla 100 karakter olmalı")
    .optional(),
  sector: z.string()
    .max(50, "Sektör en fazla 50 karakter olmalı")
    .optional(),
  address: z.string()
    .max(200, "Adres en fazla 200 karakter olmalı")
    .optional(),
  city: z.string()
    .min(2, "Şehir en az 2 karakter olmalı")
    .max(50, "Şehir en fazla 50 karakter olmalı"),
  district: z.string()
    .max(50, "İlçe en fazla 50 karakter olmalı")
    .optional(),
  birthDate: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Geçerli bir tarih girin"
    }),
  experience: z.number()
    .min(0, "Deneyim yılı negatif olamaz")
    .max(50, "Deneyim yılı en fazla 50 olabilir")
    .optional()
})

// Event validation schema
export const eventSchema = z.object({
  title: z.string()
    .min(5, "Etkinlik başlığı en az 5 karakter olmalı")
    .max(100, "Etkinlik başlığı en fazla 100 karakter olmalı"),
  description: z.string()
    .max(1000, "Açıklama en fazla 1000 karakter olmalı")
    .optional(),
  type: z.enum([
    "CONFERENCE",
    "SEMINAR", 
    "WORKSHOP",
    "NETWORKING",
    "TRAINING",
    "SOCIAL_RESPONSIBILITY",
    "MEETING",
    "OTHER"
  ], {
    errorMap: () => ({ message: "Geçerli bir etkinlik türü seçin" })
  }),
  startDate: z.string()
    .min(1, "Başlangıç tarihi gereklidir")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Geçerli bir başlangıç tarihi girin"
    }),
  endDate: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Geçerli bir bitiş tarihi girin"
    }),
  location: z.string()
    .max(100, "Konum en fazla 100 karakter olmalı")
    .optional(),
  address: z.string()
    .max(200, "Adres en fazla 200 karakter olmalı")
    .optional(),
  city: z.string()
    .min(2, "Şehir en az 2 karakter olmalı")
    .max(50, "Şehir en fazla 50 karakter olmalı"),
  capacity: z.number()
    .min(1, "Kapasite en az 1 olmalı")
    .max(10000, "Kapasite en fazla 10000 olabilir")
    .optional(),
  cost: z.number()
    .min(0, "Maliyet negatif olamaz")
    .max(100000, "Maliyet en fazla 100000 olabilir")
    .optional()
}).refine((data) => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: "Bitiş tarihi başlangıç tarihinden sonra olmalı",
  path: ["endDate"]
})

// Goal validation schema
export const goalSchema = z.object({
  title: z.string()
    .min(5, "Hedef başlığı en az 5 karakter olmalı")
    .max(100, "Hedef başlığı en fazla 100 karakter olmalı"),
  description: z.string()
    .max(500, "Açıklama en fazla 500 karakter olmalı")
    .optional(),
  category: z.enum([
    "MEMBERSHIP",
    "EVENTS", 
    "COMMUNICATION",
    "DIGITAL",
    "REGIONAL",
    "FINANCIAL",
    "OTHER"
  ], {
    errorMap: () => ({ message: "Geçerli bir kategori seçin" })
  }),
  targetValue: z.number()
    .min(0, "Hedef değer negatif olamaz")
    .max(1000000, "Hedef değer çok büyük")
    .optional(),
  currentValue: z.number()
    .min(0, "Mevcut değer negatif olamaz")
    .max(1000000, "Mevcut değer çok büyük")
    .optional(),
  unit: z.string()
    .max(20, "Birim en fazla 20 karakter olmalı")
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    errorMap: () => ({ message: "Geçerli bir öncelik seçin" })
  }),
  endDate: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Geçerli bir bitiş tarihi girin"
    })
})

// KPI validation schema
export const kpiSchema = z.object({
  name: z.string()
    .min(3, "KPI adı en az 3 karakter olmalı")
    .max(100, "KPI adı en fazla 100 karakter olmalı"),
  description: z.string()
    .max(300, "Açıklama en fazla 300 karakter olmalı")
    .optional(),
  targetValue: z.number()
    .min(0, "Hedef değer negatif olamaz")
    .max(1000000, "Hedef değer çok büyük"),
  currentValue: z.number()
    .min(0, "Mevcut değer negatif olamaz")
    .max(1000000, "Mevcut değer çok büyük")
    .optional(),
  unit: z.string()
    .min(1, "Birim gereklidir")
    .max(20, "Birim en fazla 20 karakter olmalı"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"], {
    errorMap: () => ({ message: "Geçerli bir frekans seçin" })
  }),
  goalId: z.string().optional()
})

// Campaign validation schema
export const campaignSchema = z.object({
  title: z.string()
    .min(5, "Kampanya başlığı en az 5 karakter olmalı")
    .max(100, "Kampanya başlığı en fazla 100 karakter olmalı"),
  description: z.string()
    .max(500, "Açıklama en fazla 500 karakter olmalı")
    .optional(),
  type: z.enum([
    "SOCIAL_MEDIA",
    "EMAIL",
    "PRESS_RELEASE", 
    "NEWSLETTER",
    "EVENT_PROMOTION",
    "AWARENESS",
    "OTHER"
  ], {
    errorMap: () => ({ message: "Geçerli bir kampanya türü seçin" })
  }),
  startDate: z.string()
    .min(1, "Başlangıç tarihi gereklidir")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Geçerli bir başlangıç tarihi girin"
    }),
  endDate: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Geçerli bir bitiş tarihi girin"
    }),
  budget: z.number()
    .min(0, "Bütçe negatif olamaz")
    .max(10000000, "Bütçe çok büyük")
    .optional(),
  reach: z.number()
    .min(0, "Erişim negatif olamaz")
    .max(100000000, "Erişim çok büyük")
    .optional(),
  engagement: z.number()
    .min(0, "Etkileşim negatif olamaz")
    .max(100, "Etkileşim en fazla %100 olabilir")
    .optional()
}).refine((data) => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: "Bitiş tarihi başlangıç tarihinden sonra olmalı",
  path: ["endDate"]
})

// Helper function to format validation errors
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  
  return errors
}

// Helper function to validate form data
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationErrors(error) }
    }
    throw error
  }
}
