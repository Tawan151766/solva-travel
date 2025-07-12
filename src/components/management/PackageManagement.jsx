"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Search, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PackageManagement() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        destination: "",
        duration: "",
        price: "",
        maxParticipants: "",
        difficulty: "EASY",
        category: "CULTURAL",
        isActive: true,
        images: "",
        inclusions: "",
        exclusions: "",
        itinerary: ""
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/management/packages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPackages(data.data || []);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch packages",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            toast({
                title: "Error",
                description: "Failed to fetch packages",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setFormData({
            title: pkg.title || "",
            description: pkg.description || "",
            destination: pkg.destination || "",
            duration: pkg.duration?.toString() || "",
            price: pkg.price?.toString() || "",
            maxParticipants: pkg.maxParticipants?.toString() || "",
            difficulty: pkg.difficulty || "EASY",
            category: pkg.category || "CULTURAL",
            isActive: pkg.isActive ?? true,
            images: pkg.images?.join(', ') || "",
            inclusions: pkg.inclusions?.join(', ') || "",
            exclusions: pkg.exclusions?.join(', ') || "",
            itinerary: pkg.itinerary || ""
        });
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setFormData({
            title: "",
            description: "",
            destination: "",
            duration: "",
            price: "",
            maxParticipants: "",
            difficulty: "EASY",
            category: "CULTURAL",
            isActive: true,
            images: "",
            inclusions: "",
            exclusions: "",
            itinerary: ""
        });
    };

    const handleSubmit = async (isEdit = false) => {
        try {
            const submitData = {
                ...formData,
                duration: parseInt(formData.duration) || 1,
                price: parseFloat(formData.price) || 0,
                maxParticipants: parseInt(formData.maxParticipants) || 1,
                images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
                inclusions: formData.inclusions.split(',').map(inc => inc.trim()).filter(Boolean),
                exclusions: formData.exclusions.split(',').map(exc => exc.trim()).filter(Boolean)
            };

            const url = isEdit ? `/api/management/packages/${selectedPackage.id}` : '/api/management/packages';
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `Package ${isEdit ? 'updated' : 'created'} successfully`
                });
                fetchPackages();
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.message || `Failed to ${isEdit ? 'update' : 'create'} package`,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: `Failed to ${isEdit ? 'update' : 'create'} package`,
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (packageId) => {
        if (!confirm('Are you sure you want to delete this package?')) return;

        try {
            const response = await fetch(`/api/management/packages/${packageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Package deleted successfully"
                });
                fetchPackages();
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete package",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            toast({
                title: "Error",
                description: "Failed to delete package",
                variant: "destructive"
            });
        }
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const PackageForm = ({ isEdit }) => (
        <form className="space-y-5">
            {/* ...form fields unchanged... */}
            {/* (keep all the form fields as in your original code) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        ชื่อแพ็คเกจ
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="กรอกชื่อแพ็คเกจ"
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        จุดหมายปลายทาง
                    </label>
                    <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="กรอกจุดหมายปลายทาง"
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    />
                </div>
            </div>
            <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    รายละเอียด
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="กรอกรายละเอียดแพ็คเกจ"
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        ระยะเวลา (วัน)
                    </label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="จำนวนวัน"
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        ราคา (บาท)
                    </label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="ราคาแพ็คเกจ"
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        จำนวนผู้เข้าร่วม
                    </label>
                    <input
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        placeholder="จำนวนคนสูงสุด"
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        ระดับความยาก
                    </label>
                    <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    >
                        <option value="EASY" className="bg-black text-white">ง่าย</option>
                        <option value="MODERATE" className="bg-black text-white">ปานกลาง</option>
                        <option value="CHALLENGING" className="bg-black text-white">ท้าทาย</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                        หมวดหมู่
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    >
                        <option value="CULTURAL" className="bg-black text-white">วัฒนธรรม</option>
                        <option value="ADVENTURE" className="bg-black text-white">ผจญภัย</option>
                        <option value="NATURE" className="bg-black text-white">ธรรมชาติ</option>
                        <option value="HISTORICAL" className="bg-black text-white">ประวัติศาสตร์</option>
                        <option value="WELLNESS" className="bg-black text-white">สุขภาพ</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    รูปภาพ (URL คั่นด้วยคอมมา)
                </label>
                <textarea
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="กรอก URL รูปภาพคั่นด้วยคอมมา"
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    rows={2}
                />
            </div>
            <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    สิ่งที่รวมอยู่ในแพ็คเกจ (คั่นด้วยคอมมา)
                </label>
                <textarea
                    value={formData.inclusions}
                    onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                    placeholder="กรอกสิ่งที่รวมอยู่ในแพ็คเกจคั่นด้วยคอมมา"
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    rows={2}
                />
            </div>
            <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    สิ่งที่ไม่รวมในแพ็คเกจ (คั่นด้วยคอมมา)
                </label>
                <textarea
                    value={formData.exclusions}
                    onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                    placeholder="กรอกสิ่งที่ไม่รวมในแพ็คเกจคั่นด้วยคอมมา"
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    rows={2}
                />
            </div>
            <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    กำหนดการเดินทาง
                </label>
                <textarea
                    value={formData.itinerary}
                    onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                    placeholder="กรอกกำหนดการเดินทางแบบละเอียด"
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    rows={4}
                />
            </div>
            <div className="flex items-start space-x-2">
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mt-1 w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
                />
                <label className="text-white/80 text-sm">
                    เปิดใช้งานแพ็คเกจ
                </label>
            </div>
            <div className="flex space-x-3 pt-4">
                <button
                    type="button"
                    onClick={() => {
                        setIsEditModalOpen(false);
                        setIsCreateModalOpen(false);
                        setSelectedPackage(null);
                        setFormData({
                            title: "",
                            description: "",
                            destination: "",
                            duration: "",
                            price: "",
                            maxParticipants: "",
                            difficulty: "EASY",
                            category: "CULTURAL",
                            isActive: true,
                            images: "",
                            inclusions: "",
                            exclusions: "",
                            itinerary: ""
                        });
                    }}
                    className="flex-1 py-3 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] font-medium rounded-xl hover:bg-[#FFD700]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
                >
                    ยกเลิก
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit(isEdit)}
                    className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
                >
                    {isEdit ? 'อัปเดต' : 'สร้าง'}แพ็คเกจ
                </button>
            </div>
        </form>
    );

    if (loading) {
        return <div className="text-center py-8 text-white">Loading packages...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with search and create button */}
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
                    <Input
                        placeholder="Search packages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-black/60 border-[#FFD700]/20 text-white placeholder:text-white/50 backdrop-blur-xl"
                    />
                </div>
                <Button
                    className="flex items-center gap-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-medium"
                    onClick={() => {
                        setIsCreateModalOpen(true);
                        handleCreate();
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Create Package
                </Button>
            </div>

            {/* Packages Table */}
            <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-[#FFD700]/20 bg-black/40">
                            <TableHead className="text-[#FFD700] font-semibold">Package</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Destination</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Duration</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Price</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Max Guests</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Difficulty</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Status</TableHead>
                            <TableHead className="text-[#FFD700] font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPackages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-white/70 py-8">
                                    No packages found. Create your first package to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPackages.map((pkg) => (
                                <TableRow key={pkg.id} className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200">
                                    <TableCell className="font-medium text-white">
                                        <div>
                                            <div className="font-semibold">{pkg.title}</div>
                                            <div className="text-sm text-white/70 truncate max-w-xs">
                                                {pkg.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/90">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4 text-[#FFD700]" />
                                            {pkg.destination}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/90">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-[#FFD700]" />
                                            {pkg.duration} วัน
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/90">
                                        ฿{pkg.price?.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-white/90">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-[#FFD700]" />
                                            {pkg.maxParticipants}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={
                                                pkg.difficulty === 'EASY' ? 'default' : 
                                                pkg.difficulty === 'MODERATE' ? 'secondary' : 
                                                'destructive'
                                            }
                                        >
                                            {pkg.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                                            {pkg.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(pkg)}
                                                className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                                                onClick={() => handleDelete(pkg.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Modal (as div) */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsCreateModalOpen(false)}
                    ></div>
                    {/* Modal Container */}
                    <div className="relative z-10 w-full max-w-2xl mx-4">
                        {/* Luxury Background */}
                        <div className="relative bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Premium Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
                            {/* Close Button */}
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 border border-[#FFD700]/30"
                            >
                                <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                                </svg>
                            </button>
                            {/* Content */}
                            <div className="relative p-8 max-h-[90vh] overflow-y-auto">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
                                        สร้างแพ็คเกจใหม่
                                    </h2>
                                    <p className="text-white/70 text-sm">
                                        เพิ่มแพ็คเกจการท่องเที่ยวใหม่
                                    </p>
                                </div>
                                <PackageForm isEdit={false} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal (as div) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsEditModalOpen(false)}
                    ></div>
                    {/* Modal Container */}
                    <div className="relative z-10 w-full max-w-2xl mx-4">
                        {/* Luxury Background */}
                        <div className="relative bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Premium Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
                            {/* Close Button */}
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 border border-[#FFD700]/30"
                            >
                                <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                                </svg>
                            </button>
                            {/* Content */}
                            <div className="relative p-8 max-h-[90vh] overflow-y-auto">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
                                        แก้ไขแพ็คเกจ
                                    </h2>
                                    <p className="text-white/70 text-sm">
                                        อัปเดตข้อมูลแพ็คเกจการท่องเที่ยว
                                    </p>
                                </div>
                                <PackageForm isEdit={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
