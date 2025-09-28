import { NextRequest, NextResponse } from 'next/server'
import { auth } from './../../../../auth'
import { prisma } from '@/lib/prisma'
import { formSchema } from '@/lib/validations/forms'
import { nanoid } from 'nanoid'
//This file is to create and add form to the databsase
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = formSchema.parse(body)

    const form = await prisma.form.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        shareId: nanoid(10),
        fields: validatedData.fields,
        settings: validatedData.settings,
        userId: session.user.id,
      },
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}