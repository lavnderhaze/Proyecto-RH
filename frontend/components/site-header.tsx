"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/": "Inicio",
  "/colaboradores": "Colaboradores",
  "/formatos": "Generar Formato",
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] ?? "Pagina"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              {pageTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
