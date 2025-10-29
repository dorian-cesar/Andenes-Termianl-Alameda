"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bus,
  Calendar,
  History,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickStats = [
    {
      label: "Andenes Ocupados",
      value: "12/20",
      icon: Bus,
      color: "text-primary",
    },
    {
      label: "Próximas Salidas",
      value: "8",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      label: "Buses Hoy",
      value: "156",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Tiempo Promedio",
      value: "45min",
      icon: Clock,
      color: "text-yellow-500",
    },
  ];

  const quickLinks = [
    {
      title: "Aforo Actual",
      description: "Ver estado de todos los andenes",
      icon: Bus,
      href: "/dashboard/aforo",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "Salidas",
      description: "Próximos viajes programados",
      icon: Calendar,
      href: "/dashboard/salidas-llegadas",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      title: "Historial",
      description: "Registro de estadía y costos",
      icon: History,
      href: "/dashboard/historial",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
      title: "Control de Barreras",
      description: "Gestión manual de accesos",
      icon: Shield,
      href: "/dashboard/barreras",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />
      <main className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-balance">
              Bienvenido, {user.name}
            </h2>
            <p className="text-muted-foreground">
              Panel de control de andenes en tiempo real
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="transition-all duration-300 hover:shadow-lg animate-slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <Icon className={`w-10 h-10 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Acceso Rápido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Card
                      className={`hover:scale-101 transition-all duration-300 hover:shadow-xl cursor-pointer border-2 animate-scale-in ${link.color}`}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Icon className="w-8 h-8" />
                          <div>
                            <CardTitle className="text-lg">
                              {link.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
