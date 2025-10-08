/**
 * Authentication Utility
 * 
 * Bu modül authentication için temel yapı sağlar.
 * Production'da NextAuth.js veya benzeri bir çözüm kullanılmalıdır.
 * 
 * TODO: NextAuth.js implementasyonu
 * 1. npm install next-auth @auth/prisma-adapter
 * 2. app/api/auth/[...nextauth]/route.ts oluştur
 * 3. NEXTAUTH_SECRET ve NEXTAUTH_URL environment variables ekle
 * 4. Prisma adapter yapılandır
 */

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'PRESIDENT' | 'BOARD_MEMBER' | 'MEMBER' | 'GUEST'
  image?: string
}

export interface Session {
  user: User
  expires: string
}

/**
 * Kullanıcı rolü kontrolü
 */
export function hasRole(user: User | null, roles: User['role'][]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Admin kontrolü
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['ADMIN'])
}

/**
 * Yönetim kurulu kontrolü
 */
export function isBoard(user: User | null): boolean {
  return hasRole(user, ['ADMIN', 'PRESIDENT', 'BOARD_MEMBER'])
}

/**
 * Mock kullanıcı - Development için
 * Production'da kaldırılmalı
 */
export const mockUser: User = {
  id: '1',
  name: 'Denizli Şube Başkanı',
  email: 'baskan@tumsiad.org.tr',
  role: 'PRESIDENT',
}

/**
 * Mock session - Development için
 * Production'da kaldırılmalı
 */
export const mockSession: Session = {
  user: mockUser,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün
}

/**
 * NextAuth.js yapılandırma örneği
 * 
 * import NextAuth from "next-auth"
 * import CredentialsProvider from "next-auth/providers/credentials"
 * import { PrismaAdapter } from "@auth/prisma-adapter"
 * import { prisma } from "@/lib/db"
 * import bcrypt from "bcrypt"
 * 
 * export const authOptions = {
 *   adapter: PrismaAdapter(prisma),
 *   providers: [
 *     CredentialsProvider({
 *       name: "Credentials",
 *       credentials: {
 *         email: { label: "Email", type: "email" },
 *         password: { label: "Şifre", type: "password" }
 *       },
 *       async authorize(credentials) {
 *         if (!credentials?.email || !credentials?.password) {
 *           return null
 *         }
 *         
 *         const user = await prisma.user.findUnique({
 *           where: { email: credentials.email }
 *         })
 *         
 *         if (!user || !user.password) {
 *           return null
 *         }
 *         
 *         const isPasswordValid = await bcrypt.compare(
 *           credentials.password,
 *           user.password
 *         )
 *         
 *         if (!isPasswordValid) {
 *           return null
 *         }
 *         
 *         return {
 *           id: user.id,
 *           email: user.email,
 *           name: user.name,
 *           role: user.role,
 *         }
 *       }
 *     })
 *   ],
 *   callbacks: {
 *     async jwt({ token, user }) {
 *       if (user) {
 *         token.role = user.role
 *       }
 *       return token
 *     },
 *     async session({ session, token }) {
 *       if (session?.user) {
 *         session.user.role = token.role
 *       }
 *       return session
 *     }
 *   },
 *   pages: {
 *     signIn: '/login',
 *   },
 *   session: {
 *     strategy: "jwt"
 *   }
 * }
 * 
 * export default NextAuth(authOptions)
 */
