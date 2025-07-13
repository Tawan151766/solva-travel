"use client";

import { PackageSearchHeader } from "./PackageSearchHeader";
import { PackageTable } from "./PackageTable";
import { PackageModal } from "./PackageModal";
import { usePackageManagement } from "@/hooks/usePackageManagement";

export default function PackageManagement() {
  const {
    // State
    packages,
    loading,
    searchTerm,
    isEditModalOpen,
    isCreateModalOpen,
    formData,
    isSubmitting,
    
    // Actions
    setSearchTerm,
    setFormData,
    handleEdit,
    handleCreate,
    handleSubmit,
    handleDelete,
    closeModals,
  } = usePackageManagement();

  if (loading) {
    return (
      <div className="text-center py-8 text-white">Loading packages...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <PackageSearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={handleCreate}
      />

      {/* Packages Table */}
      <PackageTable
        packages={packages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create Modal */}
      <PackageModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="สร้างแพ็คเกจใหม่"
        subtitle="เพิ่มแพ็คเกจการท่องเที่ยวใหม่"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEdit={false}
        isSubmitting={isSubmitting}
      />

      {/* Edit Modal */}
      <PackageModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="แก้ไขแพ็คเกจ"
        subtitle="อัปเดตข้อมูลแพ็คเกจการท่องเที่ยว"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEdit={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
