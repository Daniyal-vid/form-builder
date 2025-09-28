'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus } from 'lucide-react'
import { Field, fieldTypes } from '@/lib/validations/forms'

interface FieldEditorProps {
  field: Field
  onSave: (field: Field) => void
  onClose: () => void
}

export function FieldEditor({ field, onSave, onClose }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<Field>(field)

  const handleSave = () => {
    onSave(editedField)
  }

  const addOption = () => {
    setEditedField(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }))
  }

  const updateOption = (index: number, value: string) => {
    setEditedField(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt)
    }))
  }

  const removeOption = (index: number) => {
    setEditedField(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }))
  }

  const needsOptions = ['select', 'radio', 'checkbox'].includes(editedField.type)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type">Field Type</Label>
                <Select
                  value={editedField.type}
                  onValueChange={(value: typeof fieldTypes[number]) =>
                    setEditedField(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="label">Label *</Label>
                <Input
                  id="label"
                  value={editedField.label}
                  onChange={(e) => setEditedField(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={editedField.placeholder || ''}
                  onChange={(e) => setEditedField(prev => ({ ...prev, placeholder: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="helpText">Help Text</Label>
                <Textarea
                  id="helpText"
                  value={editedField.helpText || ''}
                  onChange={(e) => setEditedField(prev => ({ ...prev, helpText: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={editedField.required}
                  onCheckedChange={(checked) =>
                    setEditedField(prev => ({ ...prev, required: checked as boolean }))
                  }
                />
                <Label htmlFor="required">Required field</Label>
              </div>
            </CardContent>
          </Card>

          {/* Options for select, radio, checkbox */}
          {needsOptions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {editedField.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Validation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(editedField.type === 'text' || editedField.type === 'textarea') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minLength">Minimum Length</Label>
                      <Input
                        id="minLength"
                        type="number"
                        value={editedField.validation?.minLength || ''}
                        onChange={(e) =>
                          setEditedField(prev => ({
                            ...prev,
                            validation: {
                              ...prev.validation,
                              minLength: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxLength">Maximum Length</Label>
                      <Input
                        id="maxLength"
                        type="number"
                        value={editedField.validation?.maxLength || ''}
                        onChange={(e) =>
                          setEditedField(prev => ({
                            ...prev,
                            validation: {
                              ...prev.validation,
                              maxLength: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {editedField.type === 'number' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min">Minimum Value</Label>
                    <Input
                      id="min"
                      type="number"
                      value={editedField.validation?.min || ''}
                      onChange={(e) =>
                        setEditedField(prev => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            min: e.target.value ? parseInt(e.target.value) : undefined
                          }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="max">Maximum Value</Label>
                    <Input
                      id="max"
                      type="number"
                      value={editedField.validation?.max || ''}
                      onChange={(e) =>
                        setEditedField(prev => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            max: e.target.value ? parseInt(e.target.value) : undefined
                          }
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="pattern">Custom Pattern (RegEx)</Label>
                <Input
                  id="pattern"
                  value={editedField.validation?.pattern || ''}
                  onChange={(e) =>
                    setEditedField(prev => ({
                      ...prev,
                      validation: {
                        ...prev.validation,
                        pattern: e.target.value || undefined
                      }
                    }))
                  }
                  placeholder="e.g., ^[A-Za-z]+$"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}