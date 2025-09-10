"use client"

import { GoogleQuickAuth } from "@/components/auth/GoogleSignIn"
import { useSession } from "next-auth/react"

export default function TestGoogleAuthPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-black/80 to-[#0a0804]/80 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
            ทดสอบ Google Authentication
          </h1>
          
          <div className="space-y-6">
            <GoogleQuickAuth />
            
            {status === "loading" && (
              <div className="text-center text-[#cdc08e]">
                กำลังโหลด...
              </div>
            )}
            
            {session && (
              <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-4">
                <h3 className="text-[#FFD700] font-semibold mb-2">ข้อมูล Session:</h3>
                <pre className="text-[#cdc08e] text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
            
            {status === "unauthenticated" && (
              <div className="text-center text-[#cdc08e]">
                ยังไม่ได้เข้าสู่ระบบ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
