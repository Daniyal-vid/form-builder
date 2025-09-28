'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormData, SubmissionData } from '@/lib/validations/forms'

interface FormRendererProps {
  form: FormData
  onSubmit: (data: SubmissionData) => Promise<void>
  isLoading?: boolean
}

export function FormRenderer({ form, onSubmit, isLoading }: FormRendererProps) {
  const [formData, setFormData] = useState<SubmissionData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: any, value: any) => {
    const errors: string[] = []

    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      errors.push(`${field.label} is required`)
    }

    if (value && field.validation) {
      const { min, max, minLength, maxLength, pattern } = field.validation

      if (field.type === 'number') {
        const numValue = parseFloat(value)
        if (min !== undefined && numValue < min) {
          errors.push(`${field.label} must be at least ${min}`)
        }
        if (max !== undefined && numValue > max) {
          errors.push(`${field.label} must be at most ${max}`)
        }
      }

      if ((field.type === 'text' || field.type === 'textarea') && typeof value === 'string') {
        if (minLength !== undefined && value.length < minLength) {
          errors.push(`${field.label} must be at least ${minLength} characters`)
        }
        if (maxLength !== undefined && value.length > maxLength) {
          errors.push(`${field.label} must be at most ${maxLength} characters`)
        }
      }

      if (pattern && typeof value === 'string') {
        const regex = new RegExp(pattern)
        if (!regex.test(value)) {
          errors.push(`${field.label} format is invalid`)
        }
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors.push(`${field.label} must be a valid email address`)
      }
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}

    // Validate all fields
    for (const field of form.fields) {
      const fieldErrors = validateField(field, formData[field.id])
      if (fieldErrors.length > 0) {
        newErrors[field.id] = fieldErrors[0]
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData)
    }
  }

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const renderField = (field: any) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {field.helpText && (
          <p className="text-sm text-gray-600">{field.helpText}</p>
        )}

        {field.type === 'text' && (
          <Input
            id={field.id}
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )}

        {field.type === 'email' && (
          <Input
            id={field.id}
            type="email"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )}

        {field.type === 'number' && (
          <Input
            id={field.id}
            type="number"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )}

        {field.type === 'textarea' && (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
            rows={4}
          />
        )}

        {field.type === 'select' && (
          <Select
            value={value}
            onValueChange={(val) => updateFieldValue(field.id, val)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === 'radio' && (
          <RadioGroup
            value={value}
            onValueChange={(val) => updateFieldValue(field.id, val)}
          >
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {field.type === 'checkbox' && (
          <div className="space-y-2">
            {field.options?.map((option: string, index: number) => {
              const currentValues = Array.isArray(value) ? value : []
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={currentValues.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFieldValue(field.id, [...currentValues, option])
                      } else {
                        updateFieldValue(field.id, currentValues.filter((v: string) => v !== option))
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              )
            })}
          </div>
        )}

        {field.type === 'date' && (
          <Input
            id={field.id}
            type="date"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        )}

        {field.type === 'file' && (
          <Input
            id={field.id}
            type="file"
            onChange={(e) => updateFieldValue(field.id, e.target.files?.[0])}
            className={error ? 'border-red-500' : ''}
          />
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map(renderField)}
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}