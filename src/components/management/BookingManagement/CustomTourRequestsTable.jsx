import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";

const CustomTourRequestsTable = ({
  requests,
  onViewRequest,
  onEditRequest,
  onDeleteRequest,
  renderStatusBadge,
}) => {
  return (
    <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-[#FFD700]/20 bg-black/40">
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Tracking Number
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Customer
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Destination
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Travel Date
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Travelers
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Budget
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3 text-center">
                Status
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3">
                Created
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold text-xs whitespace-nowrap px-2 py-3 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.id}
                className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
              >
                <TableCell className="font-mono text-xs text-white whitespace-nowrap px-2 py-3">
                  {request.trackingNumber}
                </TableCell>
                <TableCell className="px-2 py-3">
                  <div>
                    <div className="font-medium text-white text-xs">
                      {request.contactName}
                    </div>
                    <div className="text-xs text-white/70 truncate">
                      {request.contactEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-2 py-3">
                  <div className="font-medium text-white text-xs whitespace-nowrap">
                    {request.destination}
                  </div>
                </TableCell>
                <TableCell className="px-2 py-3">
                  <div>
                    <div className="text-xs text-white whitespace-nowrap">
                      {new Date(request.startDate).toLocaleDateString()} -
                    </div>
                    <div className="text-xs text-white whitespace-nowrap">
                      {new Date(request.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white text-xs whitespace-nowrap px-2 py-3">
                  {request.numberOfPeople}
                </TableCell>
                <TableCell className="font-medium text-[#FFD700] text-xs whitespace-nowrap px-2 py-3">
                  THB{request.budget?.toLocaleString() || "N/A"}
                </TableCell>
                <TableCell className="text-center px-2 py-3">
                  <div className="inline-block text-xs">
                    {renderStatusBadge(request.status)}
                  </div>
                </TableCell>
                <TableCell className="text-white text-xs whitespace-nowrap px-2 py-3">
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-2 py-3">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRequest(request)}
                      className="border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]/60 px-2 py-1.5 transition-all duration-200 font-medium text-xs whitespace-nowrap"
                      title="View Request"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditRequest(request)}
                      className="border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]/60 px-2 py-1.5 transition-all duration-200 font-medium text-xs whitespace-nowrap"
                      title="Edit Request"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteRequest(request.id)}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 px-2 py-1.5 transition-all duration-200 font-medium text-xs whitespace-nowrap"
                      title="Delete Request"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomTourRequestsTable;
