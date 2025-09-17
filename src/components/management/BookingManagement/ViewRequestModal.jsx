import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ViewRequestModal = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  renderStatusBadge,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-black/95 backdrop-blur-xl border border-[#FFD700]/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Custom Tour Request Details</DialogTitle>
        </DialogHeader>
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Tracking Number
                </Label>
                <p className="font-mono">{selectedRequest.trackingNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Status
                </Label>
                <div className="mt-1">
                  {renderStatusBadge(selectedRequest.status)}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Customer Information
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedRequest.contactName}</p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.contactEmail}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.contactPhone}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Tour Information
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedRequest.destination}</p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedRequest.startDate).toLocaleDateString()} -
                  {new Date(selectedRequest.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.numberOfPeople} Travelers
                </p>
                <p className="text-sm text-gray-600">
                  Budget: THB{selectedRequest.budget?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Preferred Accommodation
                </Label>
                <p className="mt-1">
                  {selectedRequest.accommodation || "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Transportation
                </Label>
                <p className="mt-1">
                  {selectedRequest.transportation || "Not specified"}
                </p>
              </div>
            </div>

            {selectedRequest.activities && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Activities
                </Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedRequest.activities}
                </p>
              </div>
            )}

            {selectedRequest.description && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Description
                </Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedRequest.description}
                </p>
              </div>
            )}

            {selectedRequest.responseNotes && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Response Notes
                </Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedRequest.responseNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRequestModal;
