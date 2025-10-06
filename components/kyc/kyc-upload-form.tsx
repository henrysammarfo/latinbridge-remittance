"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle2, X, Loader2 } from "lucide-react"

interface Tier {
  id: string
  name: string
  requirements: string[]
}

interface KYCUploadFormProps {
  tier: Tier
  onSubmit: (files: Record<string, File>) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

interface UploadedFileData {
  file: File
  name: string
  size: string
  type: string
}

export function KYCUploadForm({ tier, onSubmit, onCancel, isSubmitting = false }: KYCUploadFormProps) {
  const [documentType, setDocumentType] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileData>>({})

  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFiles({
        ...uploadedFiles,
        [type]: {
          file,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: file.type,
        },
      })
    }
  }

  const removeFile = (type: string) => {
    const newFiles = { ...uploadedFiles }
    delete newFiles[type]
    setUploadedFiles(newFiles)
  }

  const isFormComplete = () => {
    if (tier.id === "tier2") {
      return uploadedFiles["id"] && uploadedFiles["address"] && uploadedFiles["selfie"]
    }
    if (tier.id === "tier3") {
      return uploadedFiles["enhanced"] && uploadedFiles["funds"] && uploadedFiles["video"]
    }
    return false
  }

  const handleSubmit = async () => {
    const files: Record<string, File> = {}
    for (const [key, data] of Object.entries(uploadedFiles)) {
      files[key] = data.file
    }
    await onSubmit(files)
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>{tier.name} Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-2">Required Documents</h3>
          <ul className="space-y-1">
            {tier.requirements.map((req, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {tier.id === "tier2" && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id-type">Government ID Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="id-type">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="national-id">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Government ID</Label>
                {uploadedFiles["id"] ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{uploadedFiles["id"].name}</div>
                        <div className="text-xs text-muted-foreground">{uploadedFiles["id"].size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile("id")} disabled={isSubmitting}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (max. 10MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload("id", e)}
                      accept="image/*,.pdf"
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Upload Proof of Address</Label>
                {uploadedFiles["address"] ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{uploadedFiles["address"].name}</div>
                        <div className="text-xs text-muted-foreground">{uploadedFiles["address"].size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile("address")} disabled={isSubmitting}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground mt-1">Utility bill, bank statement (max. 10MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload("address", e)}
                      accept="image/*,.pdf"
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Upload Selfie</Label>
                {uploadedFiles["selfie"] ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{uploadedFiles["selfie"].name}</div>
                        <div className="text-xs text-muted-foreground">{uploadedFiles["selfie"].size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile("selfie")} disabled={isSubmitting}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground mt-1">Clear photo holding your ID (max. 10MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload("selfie", e)}
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>
            </div>
          </>
        )}

        {tier.id === "tier3" && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Enhanced Due Diligence Documents</Label>
                {uploadedFiles["enhanced"] ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{uploadedFiles["enhanced"].name}</div>
                        <div className="text-xs text-muted-foreground">{uploadedFiles["enhanced"].size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile("enhanced")} disabled={isSubmitting}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload("enhanced", e)}
                      accept="image/*,.pdf"
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Source of Funds Documentation</Label>
                {uploadedFiles["funds"] ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{uploadedFiles["funds"].name}</div>
                        <div className="text-xs text-muted-foreground">{uploadedFiles["funds"].size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile("funds")} disabled={isSubmitting}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload("funds", e)}
                      accept="image/*,.pdf"
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Video Verification</Label>
                {uploadedFiles["video"] ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{uploadedFiles["video"].name}</div>
                        <div className="text-xs text-muted-foreground">{uploadedFiles["video"].size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile("video")} disabled={isSubmitting}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground mt-1">Video of you holding your ID (max. 50MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload("video", e)}
                      accept="video/*"
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormComplete() || isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
