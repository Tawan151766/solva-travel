import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: user.profileImage,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'USER'
        token.firstName = user.firstName || user.name?.split(' ')[0] || 'User'
        token.lastName = user.lastName || user.name?.split(' ').slice(1).join(' ') || ''
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our custom user table
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (!existingUser) {
            // Create user in our custom table with proper fields
            await prisma.user.create({
              data: {
                email: user.email,
                firstName: user.name?.split(' ')[0] || 'User',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                profileImage: user.image,
                emailVerified: new Date(),
                isEmailVerified: true,
                role: 'USER'
              }
            })
          } else {
            // Update existing user with Google data
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                profileImage: user.image || existingUser.profileImage,
                emailVerified: new Date(),
                isEmailVerified: true,
                image: user.image || existingUser.image
              }
            })
          }
          
          return profile?.email_verified === true
        } catch (error) {
          console.error('Error in Google signIn callback:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (account?.provider === 'google') {
        // Update last login time
        await prisma.user.update({
          where: { email: user.email },
          data: { lastLoginAt: new Date() }
        })
      }
    }
  }
}

export default NextAuth(authOptions)
