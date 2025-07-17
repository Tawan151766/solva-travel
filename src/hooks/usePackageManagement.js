"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const getInitialFormData = () => ({
  // Basic Information
  title: "",
  name: "",
  description: "",
  overview: "",
  destination: "",
  location: "",
  category: "Cultural",
  difficulty: "Easy",
  duration: "",
  durationDays: "",
  maxCapacity: "",

  // Pricing
  price: "",
  priceNumber: "",
  priceDetails: {
    "2_people": { total: "", per_person: "" },
    "4_people": { total: "", per_person: "" },
    "6_people": { total: "", per_person: "" },
    "8_people": { total: "", per_person: "" },
  },

  // Images
  imageUrl: "",
  images: "",
  galleryImages: "",

  // Content Arrays
  highlights: "",
  includes: "",
  excludes: "",
  tags: "",

  // Itinerary (JSON string)
  itinerary: "",

  // Accommodation (JSON string)
  accommodation: "",

  // Flags
  isRecommended: false,
  isActive: true,

  // Ratings
  rating: "4.8",
  totalReviews: "0",
});

export function usePackageManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/management/packages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(data.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch packages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      title: pkg.title || "",
      name: pkg.name || "",
      description: pkg.description || "",
      overview: pkg.overview || "",
      destination: pkg.destination || "",
      location: pkg.location || "",
      category: pkg.category || "Cultural",
      difficulty: pkg.difficulty || "Easy",
      duration: pkg.duration || "",
      durationDays: pkg.durationDays?.toString() || "",
      maxCapacity: pkg.maxCapacity?.toString() || "",
      price: pkg.price?.toString() || "",
      priceNumber: pkg.priceNumber?.toString() || "",
      priceDetails: pkg.priceDetails || {
        "2_people": { total: "", per_person: "" },
        "4_people": { total: "", per_person: "" },
        "6_people": { total: "", per_person: "" },
        "8_people": { total: "", per_person: "" },
      },
      imageUrl: pkg.imageUrl || "",
      images: pkg.images?.join(", ") || "",
      galleryImages: pkg.galleryImages?.join(", ") || "",
      highlights: pkg.highlights?.join(", ") || "",
      includes: pkg.includes?.join(", ") || "",
      excludes: pkg.excludes?.join(", ") || "",
      tags: pkg.tags?.join(", ") || "",
      itinerary: pkg.itinerary || {},
      accommodation:
        typeof pkg.accommodation === "object"
          ? JSON.stringify(pkg.accommodation, null, 2)
          : pkg.accommodation || "",
      isRecommended: pkg.isRecommended || false,
      isActive: pkg.isActive ?? true,
      rating: pkg.rating?.toString() || "4.8",
      totalReviews: pkg.totalReviews?.toString() || "0",
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setFormData(getInitialFormData());
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (isEdit = false) => {
    try {
      setIsSubmitting(true);
      
      // Validate JSON fields
      let parsedItinerary = {};
      let parsedAccommodation = {};
      
      if (formData.itinerary) {
        try {
          // If it's already an object, no need to parse
          if (typeof formData.itinerary === 'object') {
            parsedItinerary = formData.itinerary;
          } else if (typeof formData.itinerary === 'string') {
            // Parse the JSON string
            parsedItinerary = JSON.parse(formData.itinerary);
          }
        } catch (error) {
          console.error("Itinerary parsing error:", error);
          toast({
            title: "Error",
            description: "Invalid JSON format in Itinerary field",
            variant: "destructive",
          });
          return;
        }
      }
      
      if (formData.accommodation) {
        try {
          // If it's already an object, no need to parse
          if (typeof formData.accommodation === 'object') {
            parsedAccommodation = formData.accommodation;
          } else {
            // Ensure it's a proper JSON string before parsing
            const accommodationStr = formData.accommodation.trim();
            if ((accommodationStr.startsWith('{') && accommodationStr.endsWith('}')) || 
                (accommodationStr.startsWith('[') && accommodationStr.endsWith(']'))) {
              parsedAccommodation = JSON.parse(accommodationStr);
            } else {
              // Not valid JSON format
              toast({
                title: "Error",
                description: "Invalid JSON format in Accommodation field. Must be an object or array.",
                variant: "destructive",
              });
              return;
            }
          }
        } catch (error) {
          console.error("Accommodation parsing error:", error);
          toast({
            title: "Error",
            description: "Invalid JSON format in Accommodation field",
            variant: "destructive",
          });
          return;
        }
      }

      // สร้าง comprehensive data structure
      const submitData = {
        title: formData.title,
        name: formData.name,
        description: formData.description,
        overview: formData.overview,

        // Arrays
        highlights: Array.isArray(formData.highlights) 
          ? formData.highlights.filter(Boolean)
          : formData.highlights.split(",").map((item) => item.trim()).filter(Boolean),
        includes: Array.isArray(formData.includes)
          ? formData.includes.filter(Boolean)
          : formData.includes.split(",").map((item) => item.trim()).filter(Boolean),
        excludes: Array.isArray(formData.excludes)
          ? formData.excludes.filter(Boolean)
          : formData.excludes.split(",").map((item) => item.trim()).filter(Boolean),
        tags: Array.isArray(formData.tags)
          ? formData.tags.filter(Boolean)
          : formData.tags.split(",").map((item) => item.trim()).filter(Boolean),

        // Pricing
        price: formData.price,
        priceNumber:
          parseFloat(formData.priceNumber) || parseFloat(formData.price) || 0,
        priceDetails: {
          "2_people": {
            total:
              parseFloat(formData.priceDetails?.["2_people"]?.total) ||
              parseFloat(formData.priceNumber) * 2 ||
              0,
            per_person:
              parseFloat(formData.priceDetails?.["2_people"]?.per_person) ||
              parseFloat(formData.priceNumber) ||
              0,
          },
          "4_people": {
            total:
              parseFloat(formData.priceDetails?.["4_people"]?.total) ||
              parseFloat(formData.priceNumber) * 4 * 0.9 ||
              0,
            per_person:
              parseFloat(formData.priceDetails?.["4_people"]?.per_person) ||
              parseFloat(formData.priceNumber) * 0.9 ||
              0,
          },
          "6_people": {
            total:
              parseFloat(formData.priceDetails?.["6_people"]?.total) ||
              parseFloat(formData.priceNumber) * 6 * 0.85 ||
              0,
            per_person:
              parseFloat(formData.priceDetails?.["6_people"]?.per_person) ||
              parseFloat(formData.priceNumber) * 0.85 ||
              0,
          },
          "8_people": {
            total:
              parseFloat(formData.priceDetails?.["8_people"]?.total) ||
              parseFloat(formData.priceNumber) * 8 * 0.8 ||
              0,
            per_person:
              parseFloat(formData.priceDetails?.["8_people"]?.per_person) ||
              parseFloat(formData.priceNumber) * 0.8 ||
              0,
          },
        },

        // Duration and capacity
        duration: formData.duration,
        durationDays: parseInt(formData.durationDays) || 1,
        maxCapacity: parseInt(formData.maxCapacity) || 1,

        // Location
        location: formData.location,
        destination: formData.destination,
        category: formData.category,
        difficulty: formData.difficulty,

        // Images
        imageUrl: formData.imageUrl,
        images: Array.isArray(formData.images)
          ? formData.images.filter(Boolean)
          : formData.images.split(",").map((img) => img.trim()).filter(Boolean),
        galleryImages: Array.isArray(formData.galleryImages)
          ? formData.galleryImages.filter(Boolean)
          : formData.galleryImages.split(",").map((img) => img.trim()).filter(Boolean),

        // JSON data
        itinerary: parsedItinerary,
        accommodation: parsedAccommodation,

        // Flags and ratings
        isRecommended: formData.isRecommended,
        isActive: formData.isActive,
        rating: parseFloat(formData.rating) || 4.8,
        totalReviews: parseInt(formData.totalReviews) || 0,

        // Auto-generated fields
        totalBookings: 0,
        activeBookings: 0,
      };

      const url = isEdit
        ? `/api/management/packages/${selectedPackage.id}`
        : "/api/management/packages";
      const method = isEdit ? "PUT" : "POST";

      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to continue",
          variant: "destructive",
        });
        // Redirect to login or refresh page
        window.location.href = "/";
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Package ${isEdit ? "updated" : "created"} successfully`,
        });
        fetchPackages();
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setSelectedPackage(null);
      } else {
        const errorData = await response.json();
        
        // Handle token-related errors
        if (response.status === 401 || errorData.message === "Invalid token") {
          toast({
            title: "Session Expired",
            description: "Please login again to continue",
            variant: "destructive",
          });
          // Clear invalid token and redirect
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          return;
        }
        
        toast({
          title: "Error",
          description:
            errorData.message ||
            `Failed to ${isEdit ? "update" : "create"} package`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} package`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/management/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Package deleted successfully",
        });
        fetchPackages();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete package",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedPackage(null);
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // State
    packages: filteredPackages,
    loading,
    searchTerm,
    selectedPackage,
    isEditModalOpen,
    isCreateModalOpen,
    formData,
    isSubmitting,
    
    // Actions
    setSearchTerm,
    setFormData,
    handleEdit,
    handleCreate,
    handleSubmit,
    handleDelete,
    closeModals,
  };
}
