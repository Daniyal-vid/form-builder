// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import Credentials from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "./src/lib/prisma"
// import bcrypt from "bcryptjs"
// import { z } from "zod"

// const credentialsSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// })

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   providers: [
//     // Google({
//     //   clientId: process.env.GOOGLE_CLIENT_ID,
//     //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // }),
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         try {
//           const { email, password } = credentialsSchema.parse(credentials)
          
//           const user = await prisma.user.findUnique({
//             where: { email },
//           })

//           if (!user || !user.password) return null

//           const isValid = await bcrypt.compare(password, user.password)
//           if (!isValid) return null

//           return {
//             id: user.id,
//             email: user.email,
//             name: user.name,
//           }
//         } catch {
//           return null
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//       }
//       return token
//     },
//     session({ session, token }) {
//       if (token.id) {
//         session.user.id = token.id as string
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: "/login",
//     signUp: "/signup",
//   },
// })

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./src/lib/prisma" // Remove 'src/' from path
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentialsSchema.parse(credentials)
          
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login", // Update to match your folder structure
    // Remove signUp since NextAuth doesn't handle signup pages
  },
})