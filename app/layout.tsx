import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/auth-context";
import { WebSocketProvider } from "@/contexts/websocket-context";
import { AuthenticatedToaster } from "@/components/authenticated-toaster";
import "./globals.css";
import info from "@/config/info.json";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Control de Andenes - ${info.terminal}`,
  description: "Sistema de control y gestión de andenes para terminal de buses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <WebSocketProvider>
            {children}
            <AuthenticatedToaster />
          </WebSocketProvider>
        </AuthProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
