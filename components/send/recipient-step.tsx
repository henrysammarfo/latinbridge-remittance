"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, Plus, User } from "lucide-react"
import type { SendMoneyData } from "./send-money-flow"

const savedRecipients = [
  { id: "1", name: "Maria Garcia", email: "maria@example.com", phone: "+52 555 1234", country: "Mexico" },
  { id: "2", name: "Carlos Rodriguez", email: "carlos@example.com", phone: "+55 11 9876", country: "Brazil" },
  { id: "3", name: "Ana Silva", email: "ana@example.com", phone: "+54 11 5432", country: "Argentina" },
]

interface RecipientStepProps {
  data: SendMoneyData
  updateData: (updates: Partial<SendMoneyData>) => void
  onNext: () => void
}

export function RecipientStep({ data, updateData, onNext }: RecipientStepProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(data.recipient?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewRecipient, setShowNewRecipient] = useState(false)
  const [newRecipient, setNewRecipient] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  })

  const filteredRecipients = savedRecipients.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleNext = () => {
    if (showNewRecipient) {
      updateData({
        recipient: {
          id: "new",
          ...newRecipient,
        },
      })
    } else {
      const recipient = savedRecipients.find((r) => r.id === selectedRecipient)
      if (recipient) {
        updateData({ recipient })
      }
    }
    onNext()
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Select Recipient</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showNewRecipient ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <RadioGroup value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <div className="space-y-3">
                {filteredRecipients.map((recipient) => (
                  <label
                    key={recipient.id}
                    className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                  >
                    <RadioGroupItem value={recipient.id} />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {recipient.email} • {recipient.phone}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{recipient.country}</div>
                  </label>
                ))}
              </div>
            </RadioGroup>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowNewRecipient(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Recipient
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newRecipient.phone}
                onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={newRecipient.country}
                onChange={(e) => setNewRecipient({ ...newRecipient, country: e.target.value })}
                placeholder="Mexico"
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowNewRecipient(false)}>
              Back to Saved Recipients
            </Button>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleNext} disabled={!showNewRecipient && !selectedRecipient} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
