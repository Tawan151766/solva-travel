"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext-simple';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  Check,
  ExternalLink,
  Trash2
} from 'lucide-react';

export default function FileUpload({ 
  onUploadSuccess, 
  onUploadError,
  allowMultiple = false,
  uploadType = 'package',
  className = '',
  maxFiles = 5
}) {
  const { data: session } = useSession();
  const { user: legacyUser, isAuthenticated: legacyAuth } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Check authentication from either NextAuth or legacy auth
  const isAuthenticated = session?.user || (legacyAuth && legacyUser);
  const currentUser = session?.user || legacyUser;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (!isAuthenticated) {
      onUploadError?.('Please sign in to upload files');
      return;
    }

    console.log('🔍 Auth status:', { 
      nextAuthSession: !!session?.user, 
      legacyAuth: !!legacyAuth,
      currentUser: currentUser?.email || currentUser?.firstName 
    });

    const fileList = Array.from(files);
    
    if (!allowMultiple && fileList.length > 1) {
      onUploadError?.('Please select only one file');
      return;
    }

    if (fileList.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const results = [];

    try {
      for (const file of fileList) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 10MB`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', uploadType);

        // Prepare headers for authentication
        const headers = {
          'x-requested-with': 'XMLHttpRequest',
        };
        
        // Add legacy auth token if available
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        results.push(result.data);
      }

      setUploadedFiles(prev => [...prev, ...results]);
      onUploadSuccess?.(allowMultiple ? results : results[0]);

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async (fileId, index) => {
    try {
      const response = await fetch(`/api/upload?fileId=${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Delete error:', error);
      onUploadError?.('Failed to delete file');
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-[#FFD700] bg-[#FFD700]/5'
            : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 text-[#FFD700] animate-spin" />
            <p className="text-white/80">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-[#FFD700]" />
            <div>
              <p className="text-white/80">
                Drag & drop images here, or{' '}
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="text-[#FFD700] hover:text-[#FFED4E] font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-white/60 mt-1">
                {allowMultiple ? `Up to ${maxFiles} files` : 'Single file only'} • 
                Max 10MB per file • JPG, PNG, WebP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-[#FFD700]/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-white/60 text-xs">
                      Uploaded to Cloudinary
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-400" />
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(file.url, '_blank')}
                    className="h-8 w-8 p-0 text-[#FFD700] hover:text-[#FFED4E]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFile(file.id, index)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
