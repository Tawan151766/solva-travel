import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, ListFilter } from "lucide-react";

const sortOptions = [
  { value: "createdAt_desc", label: "Created Date (Newest)" },
  { value: "createdAt_asc", label: "Created Date (Oldest)" },
  { value: "travelDate_desc", label: "Travel Date (Newest)" },
  { value: "travelDate_asc", label: "Travel Date (Oldest)" },
  { value: "contactName_asc", label: "Customer (A-Z) " },
  { value: "contactName_desc", label: "Customer (Z-A)" },
  { value: "estimatedCost_desc", label: "Budget (Highest)" },
  { value: "estimatedCost_asc", label: "Budget (Lowest)" },
];

const Filters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  sortConfig,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="relative flex-grow max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
        <Input
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10 bg-black/60 border-[#FFD700]/20 text-white placeholder:text-white/50 backdrop-blur-xl"
        />
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-[#FFD700]" />
            <Select value={`${sortConfig.key}_${sortConfig.direction}`} onValueChange={onSortChange}>
              <SelectTrigger className="w-48 bg-black/60 border-[#FFD700]/20 text-white backdrop-blur-xl">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              
             
              <SelectContent className="bg-black/95 border-[#FFD700]/20 backdrop-blur-xl max-h-[500px]">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-[#FFD700]/20">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
              
              
            </Select>
        </div>

        <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#FFD700]" />
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-40 bg-black/60 border-[#FFD700]/20 text-white backdrop-blur-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              
             
              <SelectContent className="bg-black/95 border-[#FFD700]/20 backdrop-blur-xl max-h-[500px]">
                <SelectItem value="ALL" className="text-white hover:bg-[#FFD700]/20">
                  All Status
                </SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-[#FFD700]/20"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
              
            </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;