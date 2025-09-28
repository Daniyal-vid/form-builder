import { NextRequest, NextResponse } from "next/server"
import { signupSchema } from "@/lib/validations/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    console.log("Signup attempt started")
    
    const body = await req.json()
    console.log("Request body:", body)
    
    // Validate input data
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      console.log("Validation error:", validation.error)
      return NextResponse.json({ 
        error: "Invalid input data",
        details: validation.error 
      }, { status: 400 })
    }
    
    const data = validation.data
    console.log("Validated data:", { ...data, password: "[HIDDEN]" })

    // Check if user already exists
    const existing = await prisma.user.findUnique({ 
      where: { email: data.email } 
    })
    
    if (existing) {
      console.log("User already exists with email:", data.email)
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Hash password
    console.log("Hashing password...")
    const hashed = await bcrypt.hash(data.password, 12)
    
    // Create user
    console.log("Creating user in database...")
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    console.log("User created successfully:", user)
    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error("Signup error:", error)
    
    // More specific error handling
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      
      // Handle Prisma-specific errors
      if (error.message.includes('P2002')) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
      
      if (error.message.includes('connection')) {
        return NextResponse.json({ error: "Database connection error" }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      error: "Registration failed",
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 })
  }
}