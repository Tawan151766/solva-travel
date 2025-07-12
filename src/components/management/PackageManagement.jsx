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
import { Eye, Edit, Trash2, Search, Plus, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    duration: "",
    price: "",
    maxTravelers: "",
    highlights: "",
    included: "",
    excluded: "",
    images: ""
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
        setPackages(data.data);
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      duration: "",
      price: "",
      maxTravelers: "",
      highlights: "",
      included: "",
      excluded: "",
      images: ""
    });
  };

  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setIsViewModalOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name || "",
      description: pkg.description || "",
      location: pkg.location || "",
      duration: pkg.duration?.toString() || "",
      price: pkg.price?.toString() || "",
      maxTravelers: pkg.maxTravelers?.toString() || "",
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : (pkg.highlights || ""),
      included: Array.isArray(pkg.included) ? pkg.included.join('\n') : (pkg.included || ""),
      excluded: Array.isArray(pkg.excluded) ? pkg.excluded.join('\n') : (pkg.excluded || ""),
      images: Array.isArray(pkg.images) ? pkg.images.join('\n') : (pkg.images || "")
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      const packageData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        maxTravelers: parseInt(formData.maxTravelers),
        highlights: formData.highlights.split('\n').filter(item => item.trim()),
        included: formData.included.split('\n').filter(item => item.trim()),
        excluded: formData.excluded.split('\n').filter(item => item.trim()),
        images: formData.images.split('\n').filter(item => item.trim())
      };

      const response = await fetch('/api/management/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(packageData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Package created successfully"
        });
        fetchPackages();
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create package",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating package:', error);
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const packageData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        maxTravelers: parseInt(formData.maxTravelers),
        highlights: formData.highlights.split('\n').filter(item => item.trim()),
        included: formData.included.split('\n').filter(item => item.trim()),
        excluded: formData.excluded.split('\n').filter(item => item.trim()),
        images: formData.images.split('\n').filter(item => item.trim())
      };

      const response = await fetch(`/api/management/packages/${selectedPackage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(packageData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Package updated successfully"
        });
        fetchPackages();
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update package",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) return;

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
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete package",
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
    pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Packages Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Max Travelers</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {pkg.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {pkg.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {pkg.duration} days
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ฿{pkg.price?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    {pkg.maxTravelers}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {pkg._count?.bookings || 0} bookings
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(pkg)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
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

      {/* View Package Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Package Name</Label>
                  <p className="font-medium text-lg">{selectedPackage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Location</Label>
                  <p>{selectedPackage.location}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedPackage.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Duration</Label>
                  <p>{selectedPackage.duration} days</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Price</Label>
                  <p className="font-bold text-lg">฿{selectedPackage.price?.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Max Travelers</Label>
                  <p>{selectedPackage.maxTravelers} people</p>
                </div>
              </div>

              {selectedPackage.highlights && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Highlights</Label>
                  <ul className="mt-1 p-3 bg-gray-50 rounded-lg list-disc list-inside">
                    {(Array.isArray(selectedPackage.highlights) 
                      ? selectedPackage.highlights 
                      : selectedPackage.highlights.split('\n')
                    ).map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedPackage.included && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Included</Label>
                    <ul className="mt-1 p-3 bg-green-50 rounded-lg list-disc list-inside">
                      {(Array.isArray(selectedPackage.included) 
                        ? selectedPackage.included 
                        : selectedPackage.included.split('\n')
                      ).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPackage.excluded && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Excluded</Label>
                    <ul className="mt-1 p-3 bg-red-50 rounded-lg list-disc list-inside">
                      {(Array.isArray(selectedPackage.excluded) 
                        ? selectedPackage.excluded 
                        : selectedPackage.excluded.split('\n')
                      ).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Package Form */}
      {['create', 'edit'].map(mode => (
        <Dialog 
          key={mode}
          open={mode === 'create' ? isCreateModalOpen : isEditModalOpen} 
          onOpenChange={mode === 'create' ? setIsCreateModalOpen : setIsEditModalOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{mode === 'create' ? 'Create New Package' : 'Edit Package'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter package name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter package description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Number of days"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (THB) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Price in THB"
                  />
                </div>
                <div>
                  <Label htmlFor="maxTravelers">Max Travelers *</Label>
                  <Input
                    id="maxTravelers"
                    type="number"
                    value={formData.maxTravelers}
                    onChange={(e) => setFormData({ ...formData, maxTravelers: e.target.value })}
                    placeholder="Maximum travelers"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="highlights">Highlights (one per line)</Label>
                <textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Enter highlights, one per line"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="included">Included (one per line)</Label>
                  <textarea
                    id="included"
                    value={formData.included}
                    onChange={(e) => setFormData({ ...formData, included: e.target.value })}
                    placeholder="What's included, one per line"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="excluded">Excluded (one per line)</Label>
                  <textarea
                    id="excluded"
                    value={formData.excluded}
                    onChange={(e) => setFormData({ ...formData, excluded: e.target.value })}
                    placeholder="What's excluded, one per line"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <textarea
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="Enter image URLs, one per line"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (mode === 'create') setIsCreateModalOpen(false);
                    else setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={mode === 'create' ? handleCreate : handleUpdate}>
                  {mode === 'create' ? 'Create Package' : 'Update Package'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
