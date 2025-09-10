import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext-simple';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ 
  onImageUploaded, 
  currentImage, 
  type = 'packages',
  multiple = false,
  className = '' 
}) {
  const { data: session } = useSession();
  const { user: legacyUser, isAuthenticated: legacyAuth } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Check authentication from either NextAuth or legacy auth
  const isAuthenticated = session?.user || (legacyAuth && legacyUser);
  const currentUser = session?.user || legacyUser;

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนอัปโหลดไฟล์');
      return;
    }

    setUploading(true);
    
    try {
      console.log('🔍 ImageUploader Auth status:', { 
        nextAuthSession: !!session?.user, 
        legacyAuth: !!legacyAuth,
        currentUser: currentUser?.email || currentUser?.firstName 
      });

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        // Prepare headers for authentication
        const headers = {};
        
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

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || error.message || 'Upload failed');
        }

        const result = await response.json();
        return result.data; // Return the data object with secure_url, etc.
      });

      const results = await Promise.all(uploadPromises);
      
      if (multiple) {
        onImageUploaded(results.map(result => result.secure_url)); // Use secure_url from Cloudinary
      } else {
        onImageUploaded(results[0].secure_url); // Use secure_url from Cloudinary
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('การอัปโหลดล้มเหลว: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
          ${dragActive 
            ? 'border-[#FFD700] bg-[#FFD700]/10' 
            : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {currentImage && !multiple ? (
          // Show current image preview
          <div className="relative">
            <img
              src={currentImage}
              alt="Current image"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">คลิกเพื่อเปลี่ยนรูปภาพ</p>
              </div>
            </div>
          </div>
        ) : (
          // Show upload placeholder
          <div className="text-center py-8">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700] mb-2"></div>
                <p className="text-[#FFD700] text-sm">กำลังอัปโหลด...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-12 h-12 text-[#FFD700]/50 mb-4" />
                <p className="text-[#FFD700] text-lg font-medium mb-2">
                  {multiple ? 'อัปโหลดรูปภาพ' : 'อัปโหลดรูปภาพ'}
                </p>
                <p className="text-white/70 text-sm mb-2">
                  คลิกหรือลากไฟล์มาวางที่นี่
                </p>
                <p className="text-white/50 text-xs">
                  รองรับ: JPG, PNG, WebP (สูงสุด 5MB)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload instructions */}
      <div className="mt-2 text-xs text-white/50 text-center">
        {multiple 
          ? 'สามารถเลือกหลายไฟล์พร้อมกันได้' 
          : 'เลือกรูปภาพหนึ่งไฟล์'
        }
      </div>
    </div>
  );
}
