"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext-simple";

export function ReviewForm({ staffId, staffName, onReviewSubmitted }) {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
    reviewType: "SERVICE",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("กรุณาเข้าสู่ระบบก่อนเขียนรีวิว");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewedUserId: staffId,
          rating: parseInt(formData.rating),
          title: formData.title.trim(),
          comment: formData.comment.trim(),
          reviewType: formData.reviewType,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reset form
        setFormData({
          rating: 5,
          title: "",
          comment: "",
          reviewType: "SERVICE",
        });
        setShowForm(false);

        // Show success message
        alert("รีวิวของคุณถูกส่งเรียบร้อยแล้ว!");

        // Callback to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        alert(result.message || "เกิดข้อผิดพลาดในการส่งรีวิว");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("เกิดข้อผิดพลาดในการส่งรีวิว");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
        <div className="text-center">
          <h3 className="text-[#FFD700] text-lg font-semibold mb-2">
            เขียนรีวิว
          </h3>
          <p className="text-white/80 mb-4">
            กรุณาเข้าสู่ระบบเพื่อเขียนรีวิวสำหรับ {staffName}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-2 rounded-xl font-medium hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-xl border border-[#FFD700]/20 shadow-2xl shadow-black/50">
      {!showForm ? (
        <div className="p-6 text-center">
          <h3 className="text-[#FFD700] text-lg font-semibold mb-2">
            เขียนรีวิว
          </h3>
          <p className="text-white/80 mb-4">
            แบ่งปันประสบการณ์ของคุณกับ {staffName}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-3 rounded-xl font-medium hover:from-[#FFED4E] hover:to-[#FFD700] transition-all transform hover:scale-105"
          >
            เขียนรีวิว
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[#FFD700] text-lg font-semibold">
              เขียนรีวิวสำหรับ {staffName}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-3">
              คะแนน *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`text-2xl transition-colors ${
                    star <= formData.rating
                      ? "text-[#FFD700]"
                      : "text-white/30 hover:text-[#FFD700]/50"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-white/80 text-sm">
                ({formData.rating} ดาว)
              </span>
            </div>
          </div>

          {/* Review Type */}
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ประเภทรีวิว
            </label>
            <select
              value={formData.reviewType}
              onChange={(e) =>
                setFormData({ ...formData, reviewType: e.target.value })
              }
              className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            >
              <option value="SERVICE">บริการ</option>
              <option value="GUIDE">การนำเที่ยว</option>
              <option value="OVERALL">ภาพรวม</option>
            </select>
          </div>

          {/* Title Tags */}
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              หัวข้อรีวิว *
            </label>
            <select
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            >
              <option value="">เลือกหัวข้อรีวิว</option>
              <option value="บริการดีเยี่ยม">⭐ บริการดีเยี่ยม</option>
              <option value="ไกด์มืออาชีพ">👨‍🏫 ไกด์มืออาชีพ</option>
              <option value="ประทับใจมาก">😍 ประทับใจมาก</option>
              <option value="แนะนำเลย">👍 แนะนำเลย</option>
              <option value="คุ้มค่าเงิน">💰 คุ้มค่าเงิน</option>
              <option value="ประสบการณ์ดี">✨ ประสบการณ์ดี</option>
              <option value="พนักงานใจดี">❤️ พนักงานใจดี</option>
              <option value="ความรู้ดี">🧠 ความรู้ดี</option>
              <option value="ตรงเวลา">⏰ ตรงเวลา</option>
              <option value="ใส่ใจลูกค้า">🤝 ใส่ใจลูกค้า</option>
              <option value="ควรปรับปรุง">⚠️ ควรปรับปรุง</option>
              <option value="ไม่ตรงตามคาด">😐 ไม่ตรงตามคาด</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ความคิดเห็น *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="แบ่งปันประสบการณ์ของคุณ..."
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              rows={4}
              required
              maxLength={500}
            />
            <div className="text-right text-white/50 text-xs mt-1">
              {formData.comment.length}/500
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.comment.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black rounded-xl font-medium hover:from-[#FFED4E] hover:to-[#FFD700] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
