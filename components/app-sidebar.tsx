"use client";

import * as React from "react";
import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  PieChart,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Strategies",
      url: "/strategies",
      icon: PieChart,
    },
    {
      title: "Journal",
      url: "/journal",
      icon: BookOpen,
    },
    {
      title: "Assets",
      url: "/assets",
      icon: Wallet,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navItems = data.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Hodlr"
                  className="size-8 rounded-lg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Hodlr</span>
                  <span className="truncate text-xs">Portfolio Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
