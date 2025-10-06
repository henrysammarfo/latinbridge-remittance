import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Web3Provider } from "@/components/providers/Web3Provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "LatinBridge - Cross-Border Remittance Platform",
  description:
    "Send money across Latin America with 0.5% fees. Multi-currency wallet, savings accounts, and microloans.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Web3Provider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <ErrorBoundary>
              <Suspense fallback={null}>{children}</Suspense>
            </ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
