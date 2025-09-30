import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { submissionSchema } from '@/lib/validations/forms'

export async function POST(
 request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
     const { shareId } = await params
    const body = await request.json()
    console.log('Raw submission data received:', body)
    
    const validatedData = submissionSchema.parse(body)

    // Find form by shareId
    const form = await prisma.form.findUnique({
      where: { shareId },
    })

    if (!form) {
      console.log('Form not found with shareId:', shareId)
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (form.status !== 'ACTIVE') {
      console.log('Form is not active:', form.status)
      return NextResponse.json({ error: 'Form is not active' }, { status: 400 })
    }

    // Convert field IDs to readable labels
    const formFields = form.fields as any[]
    const readableData: Record<string, any> = {}
    
    // Create a mapping from field ID to field label
    const fieldMap = formFields.reduce((map, field) => {
      map[field.id] = field.label
      return map
    }, {} as Record<string, string>)

    console.log('Field mapping:', fieldMap)

    // Convert the submitted data using field labels
    Object.entries(validatedData).forEach(([fieldId, value]) => {
      const fieldLabel = fieldMap[fieldId] || fieldId // fallback to ID if label not found
      readableData[fieldLabel] = value
    })

    console.log('Readable submission data:', readableData)

    // Get client IP and user agent for metadata
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    console.log('Creating submission for form:', form.id)

    const submission = await prisma.submission.create({
      data: {
        data: readableData, // Store readable data instead of raw field IDs
        metadata: {
          ip,
          userAgent,
          timestamp: new Date().toISOString(),
          rawData: validatedData, // optionally keep original data for debugging
        },
        formId: form.id,
      },
    })

    console.log('Submission created successfully:', submission.id)

    return NextResponse.json({
      success: true,
      submission,
      settings: form.settings
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json({
      error: 'Failed to submit form', details: (error as Error).message
    },
      { status: 500 }
    )
  }
}