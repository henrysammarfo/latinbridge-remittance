import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  )
}
