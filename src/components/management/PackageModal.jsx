"use client";

import { PackageForm } from "./PackageForm";

export function PackageModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  formData, 
  setFormData, 
  onSubmit, 
  isEdit = false,
  isSubmitting = false 
}) {
  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl mx-4 animate-fade-in-up">
        <div className="relative bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full flex items-center justify-center hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 border border-[#FFD700]/30 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 text-[#FFD700]"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="relative p-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
                {title}
              </h2>
              <p className="text-white/70 text-sm">
                {subtitle}
              </p>
            </div>

            <PackageForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              onCancel={handleCancel}
              isEdit={isEdit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
