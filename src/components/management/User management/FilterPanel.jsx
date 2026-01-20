"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

export default function FilterPanel({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = ["ADMIN", "OPERATOR", "STAFF", "USER"];
  const roleLabels = {
    ADMIN: "Admin",
    OPERATOR: "Operator",
    STAFF: "Staff",
    USER: "User",
  };

  const handleRoleToggle = (role) => {
    const newRoles = filters.roles.includes(role)
      ? filters.roles.filter((r) => r !== role)
      : [...filters.roles, role];
    onFilterChange({ ...filters, roles: newRoles });
  };

  const handleSortByChange = (value) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  const handleSortOrderChange = (order) => {
    onFilterChange({ ...filters, sortOrder: order });
  };

  const handleStatusToggle = (status) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  const handleReset = () => {
    onFilterChange({
      sortBy: "lastLogin",
      sortOrder: "desc",
      statuses: [],
      roles: [],
    });
  };

  const hasActiveFilters =
    filters.sortBy !== "lastLogin" ||
    filters.sortOrder !== "desc" ||
    filters.statuses.length > 0 ||
    filters.roles.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-[#FFD700] hover:bg-black/70 hover:border-[#FFD700]/60 transition-all font-medium"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="ml-1 h-2 w-2 rounded-full bg-[#FFD700]"></span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 z-50 bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-6 space-y-5">
          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-[#FFD700] text-sm font-semibold">Sort By</label>
            <select
              value={filters.sortBy || "lastLogin"}
              onChange={(e) => handleSortByChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            >
              <option value="lastLogin" className="bg-black text-white">
                Last Login
              </option>
              <option value="name" className="bg-black text-white">
                Name
              </option>
              <option value="email" className="bg-black text-white">
                Email
              </option>
              <option value="role" className="bg-black text-white">
                Role
              </option>
              <option value="created" className="bg-black text-white">
                Created Date
              </option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <label className="text-[#FFD700] text-sm font-semibold">Order</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortOrderChange("asc")}
                className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  filters.sortOrder === "asc"
                    ? "bg-[#FFD700] text-black"
                    : "bg-black/50 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20"
                }`}
              >
                Ascending
              </button>
              <button
                onClick={() => handleSortOrderChange("desc")}
                className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  filters.sortOrder === "desc"
                    ? "bg-[#FFD700] text-black"
                    : "bg-black/50 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20"
                }`}
              >
                Descending
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-[#FFD700] text-sm font-semibold">Status</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 px-3 py-2 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition-all">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes("active")}
                  onChange={() => handleStatusToggle("active")}
                  className="w-4 h-4 text-green-600 bg-black/50 border-green-500/30 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-white text-sm font-medium">Active</span>
              </label>
              <label className="flex items-center gap-3 px-3 py-2 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition-all">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes("inactive")}
                  onChange={() => handleStatusToggle("inactive")}
                  className="w-4 h-4 text-red-600 bg-black/50 border-red-500/30 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-white text-sm font-medium">Inactive</span>
              </label>
            </div>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-[#FFD700] text-sm font-semibold">Role</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 px-3 py-2 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={filters.roles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
                  />
                  <span className="text-white text-sm font-medium">
                    {roleLabels[role]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
