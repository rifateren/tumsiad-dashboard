import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"

interface AlertProps {
  type?: "success" | "error" | "warning" | "info"
  title?: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export function Alert({ 
  type = "info", 
  title, 
  children, 
  onClose, 
  className 
}: AlertProps) {
  const variants = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  }

  const Icon = icons[type]

  return (
    <div className={cn(
      "border rounded-lg p-4",
      variants[type],
      className
    )}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function AlertSuccess({ title, children, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="success" title={title} onClose={onClose}>{children}</Alert>
}

export function AlertError({ title, children, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="error" title={title} onClose={onClose}>{children}</Alert>
}

export function AlertWarning({ title, children, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="warning" title={title} onClose={onClose}>{children}</Alert>
}

export function AlertInfo({ title, children, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="info" title={title} onClose={onClose}>{children}</Alert>
}
