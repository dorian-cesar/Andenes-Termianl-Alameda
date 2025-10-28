"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bus,
  Calendar,
  History,
  Shield,
  Bell,
} from "lucide-react";

const navItems = [
  {
    title: "Resumen",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Aforo",
    icon: Bus,
    href: "/dashboard/aforo",
  },
  {
    title: "Salidas/Llegadas",
    icon: Calendar,
    href: "/dashboard/salidas-llegadas",
  },
  {
    title: "Historial",
    icon: History,
    href: "/dashboard/historial",
  },
  {
    title: "Barreras",
    icon: Shield,
    href: "/dashboard/barreras",
  },
  {
    title: "Alertas",
    icon: Bell,
    href: "/dashboard/alertas",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b shadow-sm sticky top-16 z-40">
      <div className="flex items-center gap-1 px-6 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px hover:scale-105",
                isActive
                  ? "border-primary text-primary shadow-[0_0_15px_rgba(251,146,60,0.3)]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
