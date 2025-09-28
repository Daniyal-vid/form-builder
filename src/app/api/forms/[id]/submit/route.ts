import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { submissionSchema } from '@/lib/validations/forms'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = submissionSchema.parse(body)

    // Find form by ID
    const form = await prisma.form.findUnique({
      where: { id: params.id },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (form.status !== 'ACTIVE') {
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

    // Convert the submitted data using field labels
    Object.entries(validatedData).forEach(([fieldId, value]) => {
      const fieldLabel = fieldMap[fieldId] || fieldId
      readableData[fieldLabel] = value
    })

    // Get client IP and user agent for metadata
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const submission = await prisma.submission.create({
      data: {
        data: readableData, // Store readable data
        metadata: {
          ip,
          userAgent,
          timestamp: new Date().toISOString(),
          rawData: validatedData, // keep original for reference
        },
        formId: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      submission,
      settings: form.settings
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}