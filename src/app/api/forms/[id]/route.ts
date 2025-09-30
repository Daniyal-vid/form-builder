// import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '../../../../../auth'
// import { prisma } from '@/lib/prisma'
// import { formSchema } from '@/lib/validations/forms'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: any } }
// ) {
//   try {
//     const form = await prisma.form.findUnique({
//       where: { id: params.id },
//       include: {
//         _count: {
//           select: { submissions: true }
//         }
//       }
//     })

//     if (!form) {
//       return NextResponse.json({ error: 'Form not found' }, { status: 404 })
//     }

//     return NextResponse.json(form)
//   } catch (error) {
//     console.error('Error fetching form:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch form' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth()
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await request.json()
//     const validatedData = formSchema.parse(body)

//     const form = await prisma.form.findFirst({
//       where: {
//         id: params.id,
//         userId: session.user.id,
//       },
//     })

//     if (!form) {
//       return NextResponse.json({ error: 'Form not found' }, { status: 404 })
//     }

//     const updatedForm = await prisma.form.update({
//       where: { id: params.id },
//       data: {
//         title: validatedData.title,
//         description: validatedData.description,
//         fields: validatedData.fields,
//         settings: validatedData.settings,
//       },
//     })

//     return NextResponse.json(updatedForm)
//   } catch (error) {
//     console.error('Error updating form:', error)
//     return NextResponse.json(
//       { error: 'Failed to update form' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth()
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const form = await prisma.form.findFirst({
//       where: {
//         id: params.id,
//         userId: session.user.id,
//       },
//     })

//     if (!form) {
//       return NextResponse.json({ error: 'Form not found' }, { status: 404 })
//     }

//     await prisma.form.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error deleting form:', error)
//     return NextResponse.json(
//       { error: 'Failed to delete form' },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { prisma } from '@/lib/prisma'
import { formSchema } from '@/lib/validations/forms'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = formSchema.parse(body)

    const form = await prisma.form.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        fields: validatedData.fields,
        settings: validatedData.settings,
      },
    })

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await prisma.form.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    await prisma.form.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    )
  }
}