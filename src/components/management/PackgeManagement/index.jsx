"use client";

import { useMemo, useState } from "react";
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

  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const derived = useMemo(() => {
    const parsed = packages.map((pkg) => {
      const priceNumber =
        typeof pkg.priceNumber === "number"
          ? pkg.priceNumber
          : parseFloat(pkg.price || 0);

      return {
        ...pkg,
        priceNumber: Number.isNaN(priceNumber) ? 0 : priceNumber,
      };
    });

    const filtered = parsed.filter((pkg) => {
      const statusPass =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? pkg.isActive
          : !pkg.isActive;
      const difficultyPass =
        difficultyFilter === "all"
          ? true
          : (pkg.difficulty || "").toLowerCase() === difficultyFilter;

      return statusPass && difficultyPass;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.priceNumber - b.priceNumber;
        case "price-desc":
          return b.priceNumber - a.priceNumber;
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "capacity":
          return (b.maxCapacity || 0) - (a.maxCapacity || 0);
        default:
          return (b.updatedAt || b.id || 0) - (a.updatedAt || a.id || 0);
      }
    });

    const activeCount = parsed.filter((pkg) => pkg.isActive).length;
    const avgPrice =
      parsed.length > 0
        ? Math.round(
            parsed.reduce((sum, pkg) => sum + (pkg.priceNumber || 0), 0) /
              parsed.length
          )
        : 0;

    return {
      displayPackages: sorted,
      total: parsed.length,
      activeCount,
      avgPrice,
    };
  }, [packages, statusFilter, difficultyFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-white">
        <div className="h-12 w-12 rounded-full border-2 border-[#FFD700] border-t-transparent animate-spin" />
        <span className="ml-3 text-sm">Loading packages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PackageSearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={handleCreate}
        total={derived.total}
        activeCount={derived.activeCount}
        avgPrice={derived.avgPrice}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <PackageTable
        packages={derived.displayPackages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PackageModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Create a package"
        subtitle="Capture the essentials, pricing, itinerary and media before publishing"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEdit={false}
        isSubmitting={isSubmitting}
      />

      <PackageModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Edit package details"
        subtitle="Keep destination, pricing and itinerary up to date for admins and customers"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEdit={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
