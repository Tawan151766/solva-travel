"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingManagement() {
  const [customTourRequests, setCustomTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const [editFormData, setEditFormData] = useState({
    status: "",
    responseNotes: "",
    estimatedCost: ""
  });

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "CONFIRMED", label: "Confirmed", color: "bg-green-100 text-green-800" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "COMPLETED", label: "Completed", color: "bg-purple-100 text-purple-800" }
  ];

  useEffect(() => {
    fetchCustomTourRequests();
  }, []);

  const fetchCustomTourRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/management/custom-tour-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomTourRequests(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch custom tour requests",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching custom tour requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch custom tour requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setEditFormData({
      status: request.status,
      responseNotes: request.responseNotes || "",
      estimatedCost: request.estimatedCost || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateRequest = async () => {
    try {
      const response = await fetch(`/api/management/custom-tour-requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Custom tour request updated successfully"
        });
        fetchCustomTourRequests();
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update custom tour request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating custom tour request:', error);
      toast({
        title: "Error",
        description: "Failed to update custom tour request",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (requestId) => {
    if (!confirm('Are you sure you want to delete this custom tour request?')) return;

    try {
      const response = await fetch(`/api/management/custom-tour-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Custom tour request deleted successfully"
        });
        fetchCustomTourRequests();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete custom tour request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting custom tour request:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom tour request",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const filteredRequests = customTourRequests.filter(request => {
    const matchesSearch = 
      request.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-8">Loading custom tour requests...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom Tour Requests Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Travelers</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-sm">
                  {request.trackingNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {request.contactName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.contactEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{request.destination}</div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">
                      {new Date(request.startDate).toLocaleDateString()} - 
                    </div>
                    <div className="text-sm">
                      {new Date(request.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{request.numberOfPeople}</TableCell>
                <TableCell className="font-medium">
                  ฿{request.budget?.toLocaleString() || 'N/A'}
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(request)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(request.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Request Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom Tour Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Tracking Number</Label>
                  <p className="font-mono">{selectedRequest.trackingNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Customer Information</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedRequest.contactName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.contactEmail}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.contactPhone}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Tour Information</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedRequest.destination}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedRequest.startDate).toLocaleDateString()} - 
                    {new Date(selectedRequest.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.numberOfPeople} people
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Budget</Label>
                  <p className="text-lg font-bold">฿{selectedRequest.budget?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Estimated Cost</Label>
                  <p className="text-lg font-bold text-green-600">
                    ฿{selectedRequest.estimatedCost?.toLocaleString() || 'Not Set'}
                  </p>
                </div>
              </div>

              {selectedRequest.accommodation && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Preferences</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">Accommodation: {selectedRequest.accommodation}</p>
                    <p className="text-sm">Transportation: {selectedRequest.transportation}</p>
                    {selectedRequest.activities && (
                      <p className="text-sm">Activities: {selectedRequest.activities}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedRequest.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.responseNotes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Response Notes</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedRequest.responseNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Request Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Custom Tour Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editFormData.status} 
                onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedCost">Estimated Cost (฿)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={editFormData.estimatedCost}
                onChange={(e) => setEditFormData({ ...editFormData, estimatedCost: e.target.value })}
                placeholder="Enter estimated cost..."
              />
            </div>

            <div>
              <Label htmlFor="responseNotes">Response Notes</Label>
              <textarea
                id="responseNotes"
                value={editFormData.responseNotes}
                onChange={(e) => setEditFormData({ ...editFormData, responseNotes: e.target.value })}
                placeholder="Add notes about this request..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRequest}>
                Update Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
