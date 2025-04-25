"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
  variant?: "default" | "destructive"
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (toastProps: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toastWithId: Toast = { id, ...toastProps }
    setToasts((prevToasts) => [...prevToasts, toastWithId])

    if (toastProps.duration) {
      setTimeout(() => {
        dismiss(id)
      }, toastProps.duration)
    }
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const contextValue: ToastContextType = {
    toasts,
    toast,
    dismiss,
  }

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function toast(options: Omit<Toast, "id">) {
  const { toast } = useToast()
  return toast(options)
}
