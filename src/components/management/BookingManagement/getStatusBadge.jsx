import { Badge } from "@/components/ui/badge";

const getStatusBadge = (statusOptions, status) => {
  const statusOption = statusOptions.find((option) => option.value === status);

  return (
    <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>
      {statusOption?.label || status}
    </Badge>
  );
};

export default getStatusBadge;
