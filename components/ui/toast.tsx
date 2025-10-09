"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { Alert } from "./alert"
import { X } from "lucide-react"

interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

type ToastAction = 
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string }

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.toast]
    case "REMOVE_TOAST":
      return state.filter(toast => toast.id !== action.id)
    default:
      return state
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({ type: "ADD_TOAST", toast: { ...toast, id } })
  }

  const removeToast = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", id })
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]
  removeToast: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast
  onRemove: (id: string) => void 
}) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration || 5000)
      
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  const variants = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  }

  return (
    <div className={`
      border rounded-lg p-4 shadow-lg min-w-80 max-w-md animate-in slide-in-from-right
      ${variants[toast.type]}
    `}>
      <div className="flex items-start">
        <div className="flex-1">
          {toast.title && (
            <h3 className="font-medium mb-1">{toast.title}</h3>
          )}
          <div className="text-sm">{toast.message}</div>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-3 flex-shrink-0 hover:opacity-70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Convenience functions
export function useToastHelpers() {
  const { addToast } = useToast()
  
  return {
    success: (message: string, title?: string) => 
      addToast({ type: "success", message, title }),
    error: (message: string, title?: string) => 
      addToast({ type: "error", message, title }),
    warning: (message: string, title?: string) => 
      addToast({ type: "warning", message, title }),
    info: (message: string, title?: string) => 
      addToast({ type: "info", message, title })
  }
}
