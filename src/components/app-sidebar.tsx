"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavScreens } from "@/components/nav-screens"
import { AccountComponent } from "@/components/account-component"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

const navMain = [
  {
    title: "Playground",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      { title: "History", url: "#" },
      { title: "Starred", url: "#" },
      { title: "Settings", url: "#" },
    ],
  },
  {
    title: "Models",
    url: "#",
    icon: Bot,
    items: [
      { title: "Genesis", url: "#" },
      { title: "Explorer", url: "#" },
      { title: "Quantum", url: "#" },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "Introduction", url: "#" },
      { title: "Get Started", url: "#" },
      { title: "Tutorials", url: "#" },
      { title: "Changelog", url: "#" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      { title: "General", url: "#" },
      { title: "Team", url: "#" },
      { title: "Billing", url: "#" },
      { title: "Limits", url: "#" },
    ],
  },
]

type AppSidebarProps = {
  user: {
    name: string
    email: string
    role: "USER" | "ADMIN"
  } | null,
  initialsName: string
}

export function AppSidebar({ user, initialsName }: AppSidebarProps) {

  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
        <AccountComponent
          account={user ? {
            name: user.name,
            email: user.email,
            initialsName: initialsName,
          } : null}
        />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={navMain} /> */}
        <NavScreens role={user?.role ?? ""}/>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
