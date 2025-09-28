'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FormSettingsProps {
  settings?: {
    thankYouMessage?: string
    redirectUrl?: string
    allowMultipleSubmissions?: boolean
  }
  onSave: (settings: any) => void
  onClose: () => void
}

export function FormSettings({ settings, onSave, onClose }: FormSettingsProps) {
  const [formSettings, setFormSettings] = useState({
    thankYouMessage: settings?.thankYouMessage || 'Thank you for your submission!',
    redirectUrl: settings?.redirectUrl || '',
    allowMultipleSubmissions: settings?.allowMultipleSubmissions || false,
  })

  const handleSave = () => {
    onSave(formSettings)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="thankYouMessage">Thank You Message</Label>
            <Textarea
              id="thankYouMessage"
              value={formSettings.thankYouMessage}
              onChange={(e) => setFormSettings(prev => ({ ...prev, thankYouMessage: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="redirectUrl">Redirect URL (optional)</Label>
            <Input
              id="redirectUrl"
              type="url"
              value={formSettings.redirectUrl}
              onChange={(e) => setFormSettings(prev => ({ ...prev, redirectUrl: e.target.value }))}
              placeholder="https://example.com/thank-you"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowMultipleSubmissions"
              checked={formSettings.allowMultipleSubmissions}
              onCheckedChange={(checked) =>
                setFormSettings(prev => ({ ...prev, allowMultipleSubmissions: checked as boolean }))
              }
            />
            <Label htmlFor="allowMultipleSubmissions">Allow multiple submissions</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}