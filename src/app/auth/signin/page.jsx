"use client"

import { signIn, getProviders } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"

function SignInContent() {
  const searchParams = useSearchParams()
  const [providers, setProviders] = useState(null)
  const [error, setError] = useState(null)
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    async function loadProviders() {
      const res = await getProviders()
      setProviders(res)
    }
    loadProviders()

    const errorParam = searchParams.get('error')
    setError(errorParam)
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { 
        callbackUrl: callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Failed to sign in')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-black/80 to-[#0a0804]/80 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FFD700] to-[#FFED4E] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#FFD700] mb-2">
              เข้าสู่ระบบ
            </h1>
            <p className="text-[#cdc08e] text-sm">
              เลือกวิธีเข้าสู่ระบบที่คุณต้องการ
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 text-sm">
                  {error === 'OAuthCreateAccount' && 'ไม่สามารถสร้างบัญชีได้ อาจมีบัญชีอื่นใช้อีเมลนี้อยู่แล้ว'}
                  {error === 'OAuthAccountNotLinked' && 'อีเมลนี้ถูกใช้กับวิธีเข้าสู่ระบบอื่นแล้ว'}
                  {error && !['OAuthCreateAccount', 'OAuthAccountNotLinked'].includes(error) && 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'}
                </p>
              </div>
            </div>
          )}

          {/* Sign In Options */}
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-800 font-medium py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>เข้าสู่ระบบด้วย Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
              <span className="text-[#B8860B] text-sm">หรือ</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
            </div>

            {/* Back to Home */}
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] font-medium py-3 px-6 rounded-xl hover:border-[#FFD700]/40 transition-all duration-200 text-center"
            >
              เข้าสู่ระบบด้วยวิธีอื่น
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[#cdc08e]/60 text-xs">
              การเข้าสู่ระบบหมายความว่าคุณยอมรับ{' '}
              <Link href="/terms" className="text-[#FFD700] hover:underline">
                เงื่อนไขการใช้งาน
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-black/80 to-[#0a0804]/80 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl p-8">
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FFD700]/20 rounded-full"></div>
              <div className="h-8 bg-[#FFD700]/20 rounded mb-4"></div>
              <div className="h-12 bg-[#FFD700]/10 rounded mb-4"></div>
              <div className="h-12 bg-[#FFD700]/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
