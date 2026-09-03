import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TripProvider } from "@/lib/TripContext";
import { BottomNav } from "@/components/BottomNav";
import { PinGate } from "@/components/PinGate";

export const metadata: Metadata = {
  title: "Northern Trip",
  description: "Trip manager for the Northern Areas — track collections and expenses in real time.",
  applicationName: "Northern Trip",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Northern Trip",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 flex flex-col">
        <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-slate-950 relative overflow-x-hidden">
          <TripProvider>
            <PinGate>
              <div className="flex-1 pt-[env(safe-area-inset-top)] pb-[calc(64px+env(safe-area-inset-bottom))]">
                {children}
              </div>
              <BottomNav />
            </PinGate>
          </TripProvider>
        </div>
      </body>
    </html>
  );
}
