import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import 'leaflet/dist/leaflet.css';
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pontos de Doação",
  description: "Encontre e cadastre pontos de doação de comida e roupas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) { 
  return (
    <html lang="pt-BR" className="">
      <head> 
        <link rel="icon" href="favicon.svg" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ToastProvider>
          {children}
          <Toaster className="absolute z-50" />
        </ToastProvider>
      </body>
    </html>
  )
}


import './globals.css'