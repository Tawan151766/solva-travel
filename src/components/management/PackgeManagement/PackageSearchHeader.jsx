"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";

export function PackageSearchHeader({
  searchTerm,
  onSearchChange,
  onCreateClick,
  total = 0,
  activeCount = 0,
  avgPrice = 0,
  statusFilter,
  setStatusFilter,
  difficultyFilter,
  setDifficultyFilter,
  sortBy,
  setSortBy,
}) {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const difficultyOptions = [
    { value: "all", label: "Any level" },
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "challenging", label: "Challenging" },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-[#FFD700]/25 bg-black/60 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase text-white/60">Packages overview</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-white">{total}</span>
            <span className="text-sm text-green-400">
              {activeCount} active
            </span>
            <span className="text-xs text-white/60">
              Avg price: {avgPrice ? `THB ${avgPrice.toLocaleString()}` : "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              className={`border-[#FFD700]/40 text-xs ${
                statusFilter === option.value
                  ? "bg-[#FFD700] text-black"
                  : "text-[#FFD700] hover:bg-[#FFD700]/15"
              }`}
              onClick={() => setStatusFilter(option.value)}
            >
              <Filter className="mr-1 h-3 w-3" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFD700]" />
          <Input
            placeholder="Search packages, destinations, or descriptions"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/60 pl-10 text-white placeholder:text-white/50"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFD700]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-lg border border-[#FFD700]/40 bg-black/70 pl-8 pr-3 text-sm text-white"
              >
                <option value="recent">Newest</option>
                <option value="title">Title (A-Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="h-10 rounded-lg border border-[#FFD700]/40 bg-black/70 px-3 text-sm text-white"
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="flex items-center gap-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            onClick={onCreateClick}
          >
            <Plus className="h-4 w-4" />
            Create package
          </Button>
        </div>
      </div>
    </div>
  );
}

