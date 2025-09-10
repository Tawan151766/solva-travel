"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const errorMessages = {
  OAuthCreateAccount: {
    title: 'ไม่สามารถสร้างบัญชีได้',
    description: 'เกิดปัญหาในการสร้างบัญชีด้วย Google อาจมีบัญชีอื่นใช้อีเมลนี้อยู่แล้ว',
    suggestion: 'ลองเข้าสู่ระบบด้วยวิธีอื่น หรือติดต่อฝ่ายสนับสนุน'
  },
  OAuthAccountNotLinked: {
    title: 'บัญชีไม่ได้เชื่อมโยง',
    description: 'อีเมลนี้ถูกใช้กับวิธีเข้าสู่ระบบอื่นแล้ว',
    suggestion: 'ลองเข้าสู่ระบบด้วยวิธีที่เคยใช้'
  },
  Default: {
    title: 'เกิดข้อผิดพลาด',
    description: 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้',
    suggestion: 'กรุณาลองใหม่อีกครั้ง'
  }
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    setError(errorParam)
  }, [searchParams])

  const errorInfo = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-black/80 to-[#0a0804]/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Error Details */}
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            {errorInfo.title}
          </h1>
          
          <p className="text-[#cdc08e] mb-4">
            {errorInfo.description}
          </p>
          
          <p className="text-[#cdc08e]/80 text-sm mb-8">
            {errorInfo.suggestion}
          </p>

          {/* Error Code */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm font-mono">
                Error Code: {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all duration-200"
            >
              กลับหน้าหลัก
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] font-medium py-3 px-6 rounded-xl hover:border-[#FFD700]/40 transition-all duration-200"
            >
              ลองใหม่
            </button>
          </div>

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 pt-6 border-t border-[#FFD700]/20">
              <details className="text-left">
                <summary className="text-[#FFD700] text-sm cursor-pointer mb-2">
                  Debug Information
                </summary>
                <div className="bg-black/40 rounded p-3 text-xs font-mono">
                  <p className="text-[#cdc08e]">
                    URL: {window.location.href}
                  </p>
                  <p className="text-[#cdc08e]">
                    Error: {error || 'None'}
                  </p>
                  <p className="text-[#cdc08e]">
                    Timestamp: {new Date().toISOString()}
                  </p>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
