"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"

export function GoogleSignInButton({ onSuccess, className = "" }) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/' 
      })
      
      if (result?.ok && !result?.error) {
        if (onSuccess) {
          onSuccess(result)
        }
      } else {
        console.error('Google sign in failed:', result?.error)
      }
    } catch (error) {
      console.error('Google sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (session) {
    return (
      <div className="text-center space-y-4">
        <p className="text-[#cdc08e]">เข้าสู่ระบบแล้วด้วย Google</p>
        <p className="text-[#FFD700]">{session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200"
        >
          ออกจากระบบ
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full bg-white text-gray-800 font-medium py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      ) : (
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
      )}
      <span>
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
      </span>
    </button>
  )
}

export function GoogleQuickAuth({ showSignOut = true }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#FFD700] flex items-center justify-center text-black font-bold">
                {session.user.firstName?.[0] || session.user.email?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-[#FFD700] font-medium">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="text-[#cdc08e] text-sm">{session.user.email}</p>
          </div>
        </div>
        {showSignOut && (
          <button
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            ออกจากระบบ
          </button>
        )}
      </div>
    )
  }

  return <GoogleSignInButton />
}
