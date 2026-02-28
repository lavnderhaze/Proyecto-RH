"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  FileText,
  Building2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Colaboradores",
    href: "/colaboradores",
    icon: Users,
  },
  {
    title: "Generar Formato",
    href: "/formatos",
    icon: FileText,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm">RH Formatos</span>
            <span className="text-xs text-sidebar-foreground/60">
              Recursos Humanos
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegacion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="px-2 py-1">
          <p className="text-xs text-sidebar-foreground/50">
            Proyecto RH v1.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
