// import { auth } from '../../../auth'
// import { redirect } from 'next/navigation'
// import { prisma } from '@/lib/prisma'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Plus, Eye, Edit, Trash2, BarChart } from 'lucide-react'

// export default async function DashboardPage() {
//   const session = await auth()
//   if (!session?.user?.id) {
//     redirect('/auth/login')
//   }

//   const forms = await prisma.form.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: 'desc' },
//     include: {
//       _count: {
//         select: { submissions: true }
//       }
//     }
//   })

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">My Forms</h1>
//         <Button asChild>
//           <Link href="/forms/create">
//             <Plus className="w-4 h-4 mr-2" />
//             Create New Form
//           </Link>
//         </Button>
//       </div>

//       {forms.length === 0 ? (
//         <Card>
//           <CardContent className="text-center py-12">
//             <h3 className="text-lg font-medium mb-2">No forms yet</h3>
//             <p className="text-gray-600 mb-4">
//               Create your first form to start collecting responses
//             </p>
//             <Button asChild>
//               <Link href="/forms/create">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Create Your First Form
//               </Link>
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {forms.map((form:any) => (
//             <Card key={form.id}>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span className="truncate">{form.title}</span>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     form.status === 'ACTIVE' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {form.status}
//                   </span>
//                 </CardTitle>
//                 {form.description && (
//                   <p className="text-sm text-gray-600 line-clamp-2">
//                     {form.description}
//                   </p>
//                 )}
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Submissions: {form._count.submissions}</span>
//                     <span>Fields: {(form.fields as any[]).length}</span>
//                   </div>
                  
//                   <div className="text-xs text-gray-500 font-mono">
//                     Share URL: /f/{form.shareId}
//                   </div>
                  
//                   <div className="flex gap-2 flex-wrap">
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/f/${form.shareId}`} target="_blank">
//                         <Eye className="w-4 h-4" />
//                       </Link>
//                     </Button>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/admin/forms/${form.id}/edit`}>
//                         <Edit className="w-4 h-4" />
//                       </Link>
//                     </Button>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/admin/forms/${form.id}/submissions`}>
//                         <BarChart className="w-4 h-4" />
//                       </Link>
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Edit, BarChart, FileText, Users, TrendingUp, Clock } from "lucide-react"
import { requireAuth } from "@/lib/auth-guard"

export default async function DashboardPage() {
  // const session = await auth()
  const session = await requireAuth()
  // if (!session?.user?.id) {
  //   redirect("/auth/login")
  // }

  const forms = await prisma.form.findMany({
    where: { userId: session.user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  })

  const totalForms = forms.length
  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const activeForms = forms.filter((form) => form.status === "ACTIVE").length

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative">
          <div className="container mx-auto px-6 py-3 bg-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-balance">Welcome back</h1>
                <p className="text-lg text-muted-foreground text-pretty">
                  Manage your forms and track their performance
                </p>
              </div>
              <Button size="lg" className="shadow-lg" asChild>
                <Link href="/forms/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Form
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
                  <p className="text-3xl font-bold">{totalForms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-2/10">
                  <Users className="w-6 h-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <p className="text-3xl font-bold">{totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-3/10">
                  <TrendingUp className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Forms</p>
                  <p className="text-3xl font-bold">{activeForms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {forms.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-balance">No forms yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-pretty">
                Create your first form to start collecting responses and insights from your audience
              </p>
              <Button size="lg" className="shadow-lg" asChild>
                <Link href="/forms/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Forms</h2>
              <p className="text-sm text-muted-foreground">
                {forms.length} form{forms.length !== 1 ? "s" : ""} total
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {forms.map((form: any) => (
                <Card
                  key={form.id}
                  className="group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {form.title}
                      </CardTitle>
                      <div
                        className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
                          form.status === "ACTIVE"
                            ? "bg-chart-3/10 text-chart-3 border border-chart-3/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {form.status}
                      </div>
                    </div>
                    {form.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{form.description}</p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{form._count.submissions}</p>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{(form.fields as any[]).length}</p>
                          <p className="text-xs text-muted-foreground">Fields</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Share URL</p>
                      </div>
                      <p className="text-xs font-mono text-foreground/80 break-all">/f/{form.shareId}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary/20 bg-transparent"
                        asChild
                      >
                        <Link href={`/f/${form.shareId}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-chart-2/10 hover:text-chart-2 hover:border-chart-2/20 bg-transparent"
                        asChild
                      >
                        <Link href={`/admin/forms/${form.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-chart-3/10 hover:text-chart-3 hover:border-chart-3/20 bg-transparent"
                        asChild
                      >
                        <Link href={`/admin/forms/${form.id}/submissions`}>
                          <BarChart className="w-4 h-4 mr-2" />
                          Stats
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
