'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormBuilder from '@/components/FormBuilder'
import { FormData } from '@/lib/validations/forms'
import { requireAuth } from '@/lib/auth-guard'

export default async function CreateFormPage() {
  await requireAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (formData: FormData) => {
    setIsLoading(true)
    try {
      console.log('Saving form data:', formData)
      
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create form')
      }

      const form = await response.json()
      console.log('Form created:', form)
      router.push(`/dashboard`)
    } catch (error ) {
      console.error('Error creating form:', error)
      alert(`Failed to create form: ${error as Error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return <FormBuilder onSave={handleSave} isLoading={isLoading} />
}