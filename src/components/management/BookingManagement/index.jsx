"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CustomTourRequestsTable from "./CustomTourRequestsTable.jsx";
import EditRequestModal from "./EditRequestModal.jsx";
import Filters from "./Filters.jsx";
import fetchCustomTourRequests from "./fetchCustomTourRequests.jsx";
import getStatusBadge from "./getStatusBadge.jsx";
import handleDelete from "./handleDelete.jsx";
import handleUpdateRequest from "./handleUpdateRequest.jsx";
import ViewRequestModal from "./ViewRequestModal.jsx";

const BookingManagement = () => {
  const [customTourRequests, setCustomTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: "",
    responseNotes: "",
    estimatedCost: "",
  });
  const { toast } = useToast();

  const statusOptions = useMemo(
    () => [
      {
        value: "PENDING",
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
      },
      {
        value: "CONFIRMED",
        label: "Confirmed",
        color: "bg-green-100 text-green-800",
      },
      {
        value: "CANCELLED",
        label: "Cancelled",
        color: "bg-red-100 text-red-800",
      },
      {
        value: "IN_PROGRESS",
        label: "In Progress",
        color: "bg-blue-100 text-blue-800",
      },
      {
        value: "COMPLETED",
        label: "Completed",
        color: "bg-purple-100 text-purple-800",
      },
    ],
    []
  );

  const loadRequests = useCallback(() => {
    return fetchCustomTourRequests({
      setCustomTourRequests,
      setLoading,
      toast,
    });
  }, [toast]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    return customTourRequests.filter((request) => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch =
        request.contactName?.toLowerCase().includes(searchValue) ||
        request.contactEmail?.toLowerCase().includes(searchValue) ||
        request.destination?.toLowerCase().includes(searchValue) ||
        request.trackingNumber?.toLowerCase().includes(searchValue) ||
        request.id?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customTourRequests, searchTerm, statusFilter]);

  const renderStatusBadge = useCallback(
    (status) => getStatusBadge(statusOptions, status),
    [statusOptions]
  );

  const handleViewRequest = useCallback((request) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  }, []);

  const handleEditRequest = useCallback((request) => {
    setSelectedRequest(request);
    setEditFormData({
      status: request.status,
      responseNotes: request.responseNotes || "",
      estimatedCost: request.estimatedCost || "",
    });
    setIsEditModalOpen(true);
  }, []);

  const handleUpdate = useCallback(async () => {
    await handleUpdateRequest({
      selectedRequest,
      editFormData,
      toast,
      fetchRequests: loadRequests,
      setIsEditModalOpen,
    });
  }, [editFormData, loadRequests, selectedRequest, toast]);

  const handleDeleteRequest = useCallback(
    async (requestId) => {
      await handleDelete({
        requestId,
        toast,
        fetchRequests: loadRequests,
      });
    },
    [loadRequests, toast]
  );

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        Loading custom tour requests...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
      />

      <CustomTourRequestsTable
        requests={filteredRequests}
        onViewRequest={handleViewRequest}
        onEditRequest={handleEditRequest}
        onDeleteRequest={handleDeleteRequest}
        renderStatusBadge={renderStatusBadge}
      />

      <ViewRequestModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        selectedRequest={selectedRequest}
        renderStatusBadge={renderStatusBadge}
      />

      <EditRequestModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        statusOptions={statusOptions}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default BookingManagement;
