'use client'

import { useState, useEffect } from 'react'
import { FormRenderer } from '@/components/FormRenderer'
import { FormData, SubmissionData } from '@/lib/validations/forms'
import { useParams } from 'next/navigation'


export default function PublicFormPage() {
  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [thankYouMessage, setThankYouMessage] = useState('')
    const params = useParams<{ shareId: string }>();
  // const id = params.id;


  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/share/${params.shareId}`)
        if (!response.ok) {
          throw new Error('Form not found')
        }
        const formData = await response.json()
        setForm({
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          settings: formData.settings,
        })
      } catch (error) {
        console.error('Error fetching form:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [params.shareId])

  const handleSubmit = async (data: SubmissionData) => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/forms/share/${params.shareId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()
      setThankYouMessage(result.settings?.thankYouMessage || 'Thank you for your submission!')
      setSubmitted(true)
      
      if (result.settings?.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.settings.redirectUrl
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading form...</div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist or is no longer available.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-green-800 mb-4">Submission Successful!</h1>
            <p className="text-green-700">{thankYouMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <FormRenderer 
        form={form} 
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  )
}