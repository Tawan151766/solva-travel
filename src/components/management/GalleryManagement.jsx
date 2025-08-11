"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageUploader from "../ui/ImageUploader";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Upload,
  Eye,
  EyeOff,
  MapPin,
  Tag,
  Calendar
} from "lucide-react";

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "BEACH",
    location: "",
    tags: "",
    isActive: true
  });

  const categories = [
    { value: "ALL", label: "ทั้งหมด", icon: "🌍" },
    { value: "BEACH", label: "ชายหาด", icon: "🏖️" },
    { value: "MOUNTAIN", label: "ภูเขา", icon: "⛰️" },
    { value: "CITY", label: "เมือง", icon: "🏙️" },
    { value: "FOREST", label: "ป่าไผ่", icon: "🌲" },
    { value: "DESERT", label: "ทะเลทราย", icon: "🏜️" },
    { value: "CULTURAL", label: "วัฒนธรรม", icon: "🏛️" },
    { value: "ADVENTURE", label: "ผจญภัย", icon: "🎯" },
    { value: "LUXURY", label: "หรูหรา", icon: "💎" },
    { value: "WILDLIFE", label: "สัตว์ป่า", icon: "🦁" },
    { value: "OTHER", label: "อื่นๆ", icon: "📷" }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery?limit=100&showAll=true", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.data?.images || []);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
      
      const payload = {
        ...formData,
        tags: tagsArray
      };

      const url = selectedImage ? `/api/gallery/${selectedImage.id}` : "/api/gallery";
      const method = selectedImage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchImages();
        handleCloseModal();
        alert(selectedImage ? "อัปเดตรูปภาพเรียบร้อยแล้ว" : "เพิ่มรูปภาพเรียบร้อยแล้ว");
      } else {
        const error = await response.json();
        alert(error.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?")) return;

    try {
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        await fetchImages();
        alert("ลบรูปภาพเรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleToggleActive = async (imageId, currentStatus) => {
    try {
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      imageUrl: image.imageUrl,
      category: image.category,
      location: image.location,
      tags: image.tags?.join(", ") || "",
      isActive: image.isActive
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedImage(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "BEACH",
      location: "",
      tags: "",
      isActive: true
    });
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "ALL" || image.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <input
              type="text"
              placeholder="ค้นหารูปภาพ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มรูปภาพ
        </Button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="bg-black/40 border border-[#FFD700]/20 rounded-xl overflow-hidden hover:border-[#FFD700]/40 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-video">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleToggleActive(image.id, image.isActive)}
                  className={`p-1 rounded-full ${
                    image.isActive 
                      ? "bg-green-500/80 text-white" 
                      : "bg-red-500/80 text-white"
                  }`}
                >
                  {image.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-[#FFD700]/90 text-black text-xs">
                  {categories.find(c => c.value === image.category)?.icon} {categories.find(c => c.value === image.category)?.label}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-1">{image.title}</h3>
              
              {image.description && (
                <p className="text-white/70 text-sm mb-3 line-clamp-2">{image.description}</p>
              )}

              {/* Location */}
              <div className="flex items-center text-white/60 text-sm mb-3">
                <MapPin className="h-3 w-3 mr-1" />
                {image.location}
              </div>

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {image.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                      +{image.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(image)}
                  className="flex-1 border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  แก้ไข
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(image.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Created Date */}
              <div className="flex items-center text-white/40 text-xs mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(image.createdAt).toLocaleDateString('th-TH')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/60 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">ไม่พบรูปภาพ</p>
            <p className="text-sm">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-black/90 via-[#0a0804]/90 to-black/90 backdrop-blur-xl rounded-xl border border-[#FFD700]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#FFD700]">
                  {selectedImage ? "แก้ไขรูปภาพ" : "เพิ่มรูปภาพใหม่"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ชื่อรูปภาพ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="ใส่ชื่อรูปภาพ"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="ใส่คำอธิบายรูปภาพ"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-4">
                    รูปภาพ *
                  </label>
                  <ImageUploader
                    onImageUploaded={(imageUrl) => 
                      setFormData({ ...formData, imageUrl })
                    }
                    currentImage={formData.imageUrl}
                    type="gallery"
                    multiple={false}
                    className="mb-4"
                  />
                </div>

                {/* Category and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      หมวดหมู่ *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    >
                      {categories.filter(c => c.value !== "ALL").map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      สถานที่ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                      placeholder="เช่น กรุงเทพฯ, ประเทศไทย"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    แท็ก (คั่นด้วยเครื่องหมายจุลภาค)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="เช่น ชายหาด, พระอาทิตย์ตก, โรแมนติก"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-white text-sm">
                    เปิดใช้งาน (แสดงในแกลเลอรี่)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1 border-white/30 text-white hover:bg-white/10"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
                  >
                    {selectedImage ? "อัปเดต" : "เพิ่มรูปภาพ"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}