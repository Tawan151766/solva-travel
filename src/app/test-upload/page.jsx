"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FileUpload from '@/components/ui/FileUpload';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestUploadPage() {
  const { data: session, status } = useSession();
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/debug-session', {
        credentials: 'include'
      });
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({ error: error.message });
    }
  };

  useEffect(() => {
    checkSession();
  }, [session]);

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl text-white mb-4">Test Upload</h1>
        <p className="text-white/80">Please sign in to test file upload.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">File Upload Test</h1>
        
        <div className="grid gap-6">
          {/* Debug Session */}
          <Card className="bg-blue-900/40 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center justify-between">
                Session Debug Info
                <Button 
                  onClick={checkSession}
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-blue-200 text-sm overflow-auto max-h-96">
                {JSON.stringify({
                  clientSession: session,
                  sessionStatus: status,
                  serverDebug: debugInfo
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* User Info */}
          <Card className="bg-black/40 border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Current User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white space-y-2">
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Role:</strong> {session.user.role || 'USER'}</p>
                <p><strong>Status:</strong> {session.user.role ? 'Authorized' : 'Needs Admin Approval'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Test */}
          <Card className="bg-black/40 border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Upload Test</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUploadSuccess={(files) => {
                  console.log('Upload success:', files);
                  setUploadSuccess(files);
                  setUploadError(null);
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  setUploadError(error);
                  setUploadSuccess(null);
                }}
                allowMultiple={true}
                uploadType="test"
                maxFiles={3}
              />
            </CardContent>
          </Card>

          {/* Results */}
          {uploadSuccess && (
            <Card className="bg-green-900/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Upload Success!</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-green-200 text-sm overflow-auto">
                  {JSON.stringify(uploadSuccess, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {uploadError && (
            <Card className="bg-red-900/40 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Upload Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-200">{uploadError}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
