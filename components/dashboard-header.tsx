"use client";

import { useAuth } from "@/contexts/auth-context";
import { useWebSocket } from "@/contexts/websocket-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { isConnected, alerts } = useWebSocket();
  const router = useRouter();

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3 animate-slide-in-right">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl shadow-md bg-transparent">
            <img
              src="../../favicon.ico"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Terminal Alameda
            </h1>
            <p className="text-xs text-muted-foreground">Control de Andenes</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                isConnected
                  ? "bg-green-500 animate-pulse shadow-[0_0_10px_3px_rgba(34,197,94,0.7)]"
                  : "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]"
              )}
            />
            <span className="text-muted-foreground">
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover-scale cursor-pointer"
            onClick={() => router.push("/dashboard/alertas")}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-in"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover-scale cursor-pointer"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-primary font-medium capitalize">
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive cursor-pointer group hover:bg-destructive hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:text-white" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
