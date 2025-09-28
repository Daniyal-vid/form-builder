import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { shareId: params.shareId },
      select: {
        id: true,
        title: true,
        description: true,
        fields: true,
        settings: true,
        status: true,
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (form.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Form is not available' }, { status: 400 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching public form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}