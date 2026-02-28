import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RH Formatos - Recursos Humanos",
  description:
    "Sistema de generacion de formatos de Recursos Humanos para colaboradores",
}

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <div className="flex-1 overflow-auto p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
