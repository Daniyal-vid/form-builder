"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardActions() {
  return (
    <div className="flex items-center gap-4">
      <Button size="lg" className="shadow-lg" asChild>
        <Link href="/forms/create">
          <Plus className="w-5 h-5 mr-2" />
          Create New Form
        </Link>
      </Button>
      <Button
        onClick={() => signOut()}
        className="w-full md:w-auto bg-slate-100 text-black"
        variant="outline"
      >
        Logout
      </Button>
    </div>
  )
}
