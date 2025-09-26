import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

const Filters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
}) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
        <Input
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10 bg-black/60 border-[#FFD700]/20 text-white placeholder:text-white/50 backdrop-blur-xl"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40 bg-black/60 border-[#FFD700]/20 text-white backdrop-blur-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-black/95 border-[#FFD700]/20 backdrop-blur-xl">
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
  );
};

export default Filters;
