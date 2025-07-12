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
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const [editFormData, setEditFormData] = useState({
    status: "",
    notes: ""
  });

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "CONFIRMED", label: "Confirmed", color: "bg-green-100 text-green-800" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
    { value: "COMPLETED", label: "Completed", color: "bg-blue-100 text-blue-800" }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/management/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      status: booking.status,
      notes: booking.notes || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBooking = async () => {
    try {
      const response = await fetch(`/api/management/bookings/${selectedBooking.id}`, {
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
          description: "Booking updated successfully"
        });
        fetchBookings();
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update booking",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/management/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking deleted successfully"
        });
        fetchBookings();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete booking",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.travelPackage?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings..."
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

      {/* Bookings Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Travelers</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-sm">
                  {booking.id.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.user?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{booking.travelPackage?.name}</div>
                  <div className="text-sm text-gray-500">
                    {booking.travelPackage?.location}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(booking.travelDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.numberOfTravelers}</TableCell>
                <TableCell className="font-medium">
                  ฿{booking.totalAmount?.toLocaleString() || 'N/A'}
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(booking)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(booking)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(booking.id)}
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

      {/* View Booking Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Booking ID</Label>
                  <p className="font-mono">{selectedBooking.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Customer Information</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedBooking.user?.email}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.user?.phone}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Package Information</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedBooking.travelPackage?.name}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.travelPackage?.location}</p>
                  <p className="text-sm text-gray-600">
                    Duration: {selectedBooking.travelPackage?.duration} days
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Travel Date</Label>
                  <p>{new Date(selectedBooking.travelDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Number of Travelers</Label>
                  <p>{selectedBooking.numberOfTravelers}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                <p className="text-lg font-bold">฿{selectedBooking.totalAmount?.toLocaleString()}</p>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Special Requests</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {selectedBooking.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notes</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Booking Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
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
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                placeholder="Add notes about this booking..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBooking}>
                Update Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
