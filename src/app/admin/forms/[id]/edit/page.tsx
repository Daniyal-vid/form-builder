'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FormBuilder  from '@/components/FormBuilder'
import { FormData } from '@/lib/validations/forms'
import { useParams } from 'next/navigation'


export default function EditFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [initialData, setInitialData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams<{ id: string }>();
  // const id = params.id;

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`)
        if (!response.ok) {
          throw new Error('Form not found')
        }
        const form = await response.json()
        setInitialData({
          title: form.title,
          description: form.description,
          fields: form.fields,
          settings: form.settings,
        })
      } catch (error) {
        console.error('Error fetching form:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [params.id, router])

  const handleSave = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update form')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating form:', error)
      alert('Failed to update form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading form...</div>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Form not found</div>
      </div>
    )
  }

  return (
    <div className="container">
      
      
      <FormBuilder 
        initialData={initialData}
        onSave={handleSave} 
        isLoading={isLoading} 
      />
    </div>
  )
}