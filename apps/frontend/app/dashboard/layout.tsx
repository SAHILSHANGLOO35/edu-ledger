"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context" // ✅ removed AuthProvider import
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { StarField } from "@/components/star-field"
import { Separator } from "@/components/ui/separator"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/signin")
    }
  }, [token, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!token) return null

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <StarField />
        <div className="space-grid pointer-events-none absolute inset-0" />
        <AppSidebar />
        <SidebarInset className="relative">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-sm">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex-1" />
          </header>
          <main className="relative z-10 flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>
}
