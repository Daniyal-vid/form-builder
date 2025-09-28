'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Eye, Copy } from 'lucide-react'
import { useState } from 'react'

interface SubmissionsClientProps {
  form: {
    id: string
    title: string
    shareId: string
    submissions: {
      id: string
      data: any
      metadata: any
      createdAt: Date
    }[]
  }
}

export function SubmissionsClient({ form }: SubmissionsClientProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const exportToCSV = () => {
    if (form.submissions.length === 0) return

    // Get all unique field names from all submissions
    const allFields = new Set<string>()
    form.submissions.forEach(submission => {
      Object.keys(submission.data as Record<string, any>).forEach(field => {
        allFields.add(field)
      })
    })

    const fieldNames = Array.from(allFields)
    
    // Create CSV header
    const header = ['Submission ID', 'Submitted At', ...fieldNames].join(',')
    
    // Create CSV rows
    const rows = form.submissions.map(submission => {
      const data = submission.data as Record<string, any>
      const row = [
        submission.id,
        new Date(submission.createdAt).toLocaleString(),
        ...fieldNames.map(field => {
          const value = data[field]
          // Handle arrays (for checkbox fields)
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`
          }
          // Escape quotes in strings
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        })
      ]
      return row.join(',')
    })

    const csvContent = [header, ...rows].join('\n')
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_')}_submissions.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const copyFormLink = async () => {
    try {
      const url = `${window.location.origin}/f/${form.shareId}`
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">{form.title} - Submissions</h1>
            <p className="text-gray-600">Total submissions: {form.submissions.length}</p>
          </div>
          
          <div className="flex gap-2">
            {form.submissions.length > 0 && (
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
            
            <Button onClick={copyFormLink} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </Button>
            
            <Button asChild>
              <Link href={`/f/${form.shareId}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Form
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {form.submissions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
            <p className="text-gray-600 mb-4">
              Share your form to start collecting responses
            </p>
            <div className="space-x-2">
              <Button asChild>
                <Link href={`/f/${form.shareId}`} target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  View Form
                </Link>
              </Button>
              <Button variant="outline" onClick={copyFormLink}>
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {form.submissions.map((submission, index) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Submission #{form.submissions.length - index}</span>
                  <div className="text-sm font-normal text-gray-600">
                    {new Date(submission.createdAt).toLocaleString()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(submission.data as Record<string, any>).map(([fieldLabel, value]) => (
                    <div key={fieldLabel} className="space-y-1">
                      <div className="font-medium text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                        {fieldLabel}
                      </div>
                      <div className="text-gray-900 p-2 border rounded">
                        {Array.isArray(value) ? (
                          <div className="space-y-1">
                            {value.map((item, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : value === null || value === undefined ? (
                          <span className="text-gray-400 italic">No response</span>
                        ) : (
                          String(value)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Show metadata if available */}
                {submission.metadata && (
                  <details className="mt-4">
                    <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
                    <div className="mt-2 text-xs text-gray-400 space-y-1">
                      <div>IP: {(submission.metadata as any).ip}</div>
                      <div>User Agent: {(submission.metadata as any).userAgent}</div>
                      <div>Submission ID: {submission.id}</div>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}