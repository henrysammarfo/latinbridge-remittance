"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error caught by boundary:", error, errorInfo)
  }

  componentDidMount() {
    // Handle unhandled promise rejections globally
    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", this.handleUnhandledRejection)
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("unhandledrejection", this.handleUnhandledRejection)
    }
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error("[v0] Unhandled promise rejection:", event.reason)

    // Prevent the error from breaking the app
    event.preventDefault()

    // Check if it's a wallet-related error that we can safely ignore
    const errorMessage = event.reason?.message || String(event.reason)
    if (errorMessage.includes("Talisman") || errorMessage.includes("wallet") || errorMessage.includes("extension")) {
      console.warn("[v0] Wallet extension error suppressed:", errorMessage)
      return
    }

    // For other errors, update state to show error UI
    this.setState({ hasError: true, error: event.reason })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>We encountered an unexpected error. Please try refreshing the page.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.reload()
                }}
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
