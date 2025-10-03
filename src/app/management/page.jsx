"use client";

import { useAuth } from "@/contexts/AuthContext-simple";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserManagement from "@/components/management/User management";
import BookingManagement from "@/components/management/BookingManagement/index.jsx";
import GalleryManagement from "@/components/management/GalleryManagement";
import BlogManagement from "@/components/management/BlogManagement";
import FileUpload from "@/components/ui/FileUpload";
import { Users, Calendar, Package, BarChart3, Upload, Newspaper } from "lucide-react";
import PackageManagement from "@/components/management/PackgeManagement";

export default function ManagementPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalPackages: 0,
    pendingBookings: 0,
  });
  const [blogMeta, setBlogMeta] = useState({ count: 0, loading: true });

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      if (user?.role !== "OPERATOR" && user?.role !== "ADMIN") {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, loading, user, router]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/management/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchBlogCount = useCallback(async () => {
    setBlogMeta((prev) => ({ ...prev, loading: true }));

    try {
      const params = new URLSearchParams({ limit: "1", page: "1" });
      const response = await fetch(`/api/blog?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog count");
      }

      const data = await response.json();
      const totalCount =
        data?.data?.pagination?.totalCount ??
        (Array.isArray(data?.data?.blogs) ? data.data.blogs.length : 0);

      setBlogMeta({ count: totalCount, loading: false });
    } catch (error) {
      console.error("Error fetching blog count:", error);
      setBlogMeta((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (
      isAuthenticated &&
      (user?.role === "OPERATOR" || user?.role === "ADMIN")
    ) {
      fetchStats();
      fetchBlogCount();
    }
  }, [isAuthenticated, user, fetchStats, fetchBlogCount]);

  if (loading) {
    return (
      <div className="relative flex w-full min-h-screen flex-col bg-gradient-to-br from-black via-[#0a0804] to-black overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700]"></div>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (user?.role !== "OPERATOR" && user?.role !== "ADMIN")
  ) {
    return null;
  }

  return (
    <div className="relative flex w-full min-h-screen flex-col bg-gradient-to-br from-black via-[#0a0804] to-black overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>

      <div className="layout-container flex h-full grow flex-col relative">
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-8">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Management Dashboard
              </h1>
              <p className="text-white/70">
                Welcome back, {user?.firstName} {user?.lastName}
                <Badge
                  variant="secondary"
                  className="ml-2 bg-gradient-to-r from-[#FFD700]/20 via-[#FFA500]/20 to-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30"
                >
                  {user?.role}
                </Badge>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {[
                {
                  title: "Total Users",
                  icon: <Users />,
                  value: stats.totalUsers,
                },
                {
                  title: "Tour Requests",
                  icon: <Calendar />,
                  value: stats.totalBookings,
                },
                {
                  title: "Total Packages",
                  icon: <Package />,
                  value: stats.totalPackages,
                },
                {
                  title: "Pending Requests",
                  icon: <BarChart3 />,
                  value: stats.pendingBookings,
                  color: "text-orange-400",
                },
                {
                  title: "Blog Posts",
                  icon: <Newspaper />,
                  value: blogMeta.loading ? "..." : blogMeta.count,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6 hover:bg-black/70 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-white">
                      {item.title}
                    </h3>
                    <div className="h-4 w-4 text-[#FFD700]">{item.icon}</div>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      item.color || "text-[#FFD700]"
                    }`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  ทดสอบ Upload
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-2" />
                  จัดการผู้ใช้งาน
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  จัดการคำขอทัวร์
                </TabsTrigger>
                <TabsTrigger value="packages">
                  <Package className="h-4 w-4 mr-2" />
                  จัดการแพ็คเกจ
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                  จัดการแกลเลอรี่
                </TabsTrigger>
                <TabsTrigger value="Blog">
                  <Newspaper className="h-4 w-4 mr-2" />
                  จัดการ Blog
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div className="space-y-4">
                  <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      ทดสอบ Cloudinary Upload
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      ทดสอบการอัปโหลดไฟล์ไปยัง Cloudinary พร้อมการปรับขนาดและ
                      optimization อัตโนมัติ 
                    </p>
                    <FileUpload
                      onUploadSuccess={(files) => {
                        console.log("Upload success:", files);
                        alert(
                          `Upload สำเร็จ! ไฟล์: ${
                            Array.isArray(files)
                              ? files.map((f) => f.name).join(", ")
                              : files.name
                          }`
                        );
                      }}
                      onUploadError={(error) => {
                        console.error("Upload error:", error);
                        alert(`Upload ผิดพลาด: ${error}`);
                      }}
                      allowMultiple={true}
                      uploadType="management-test"
                      maxFiles={5}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <div className="space-y-4">
                  <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      จัดการผู้ใช้งาน
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      จัดการผู้ใช้งานทั้งหมด ดูรายละเอียด และอัปเดตข้อมูลผู้ใช้
                    </p>
                    <UserManagement />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <div className="space-y-4">
                  <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      จัดการคำขอทัวร์
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      ดูและจัดการคำขอทัวร์ส่วนตัวทั้งหมด อัปเดตสถานะ
                      และจัดการคำขอของลูกค้า
                    </p>
                    <BookingManagement />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packages">
                <div className="space-y-4">
                  <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      จัดการแพ็คเกจ
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      สร้าง แก้ไข และจัดการแพ็คเกจการท่องเที่ยวและรายละเอียด
                    </p>
                    <PackageManagement />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery">
                <div className="space-y-4">
                  <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      จัดการแกลเลอรี่
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      อัปโหลด แก้ไข และจัดการรูปภาพในแกลเลอรี่
                      จัดหมวดหมู่และแท็กรูปภาพ
                    </p>
                    <GalleryManagement />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Blog">
                <div className="space-y-4">
                  <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      จัดการ Blog
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      {blogMeta.loading
                        ? "กำลังโหลดข้อมูล Blog ..."
                        : `ดูเเละเเก้ไขจัดการ Blog `}
                    </p>
                    <BlogManagement showHeader={false} onStatsChange={setBlogMeta} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}





















