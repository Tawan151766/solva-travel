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
      
      <DialogContent className="max-w-2xl bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl border border-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/20 p-6">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent">
              Custom Tour Request Details
            </span>
          </DialogTitle>
        </DialogHeader>
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
               
                <Label className="text-white font-bold text-sm">
                  Tracking Number
                </Label>
                <p className="font-mono text-white mt-2">{selectedRequest.trackingNumber}</p>
              </div>
              <div>
               
                <Label className="text-white font-bold text-sm">
                  Status
                </Label>
                <div className="mt-2">
                  {renderStatusBadge(selectedRequest.status)}
                </div>
              </div>
            </div>

            <div>
              
              <Label className="text-white font-bold text-sm">
                Customer Information
              </Label>
              <div className="mt-2 p-4 bg-black/50 border border-[#FFD700]/20 rounded-lg">
                <p className="font-medium text-white">{selectedRequest.contactName}</p>
                <p className="text-sm text-white/70 mt-1">
                  {selectedRequest.contactEmail}
                </p>
                <p className="text-sm text-white/70">
                  {selectedRequest.contactPhone}
                </p>
              </div>
            </div>

            <div>
              
              <Label className="text-white font-bold text-sm">
                Tour Information
              </Label>
              <div className="mt-2 p-4 bg-black/50 border border-[#FFD700]/20 rounded-lg">
                <p className="font-medium text-white">{selectedRequest.destination}</p>
                <p className="text-sm text-white/70 mt-1">
                  {new Date(selectedRequest.startDate).toLocaleDateString()} -
                  {new Date(selectedRequest.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-white/70">
                  {selectedRequest.numberOfPeople} Travelers
                </p>
                <p className="text-sm text-[#FFD700] font-medium">
                  Budget: THB{selectedRequest.budget?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                
                <Label className="text-white font-bold text-sm">
                  Preferred Accommodation
                </Label>
                <p className="mt-2 text-white/80">
                  {selectedRequest.accommodation || "Not specified"}
                </p>
              </div>
              <div>
                
                <Label className="text-white font-bold text-sm">
                  Transportation
                </Label>
                <p className="mt-2 text-white/80">
                  {selectedRequest.transportation || "Not specified"}
                </p>
              </div>
            </div>

            {selectedRequest.activities && (
              <div>
                
                <Label className="text-white font-bold text-sm">
                  Activities
                </Label>
                <p className="mt-2 p-4 bg-black/50 border border-[#FFD700]/20 rounded-lg text-white/80">
                  {selectedRequest.activities}
                </p>
              </div>
            )}

            {selectedRequest.description && (
              <div>
                
                <Label className="text-white font-bold text-sm">
                  Description
                </Label>
                <p className="mt-2 p-4 bg-black/50 border border-[#FFD700]/20 rounded-lg text-white/80">
                  {selectedRequest.description}
                </p>
              </div>
            )}

            {selectedRequest.responseNotes && (
              <div>
               
                <Label className="text-white font-bold text-sm">
                  Response Notes
                </Label>
                <p className="mt-2 p-4 bg-black/50 border border-[#FFD700]/20 rounded-lg text-white/80">
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