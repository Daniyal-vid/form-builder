import { auth } from '../../../../../../auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SubmissionsClient } from '@/components/SubmissionsClient'
import { requireAuth } from '@/lib/auth-guard'

export default async function SubmissionsPage({ params }: { params: { id: string } }) {
const session = await requireAuth()
  // if (!session?.user?.id) {
  //   redirect('/auth/login')
  // }
  

  const form = await prisma.form.findFirst({
    where: {
      id: params.id,
      userId: session.user!.id,
    },
    include: {
      submissions: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!form) {
    redirect('/dashboard')
  }

  return <SubmissionsClient form={form} />
}