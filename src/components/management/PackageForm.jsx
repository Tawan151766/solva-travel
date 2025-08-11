"use client";

import { useEffect, useState } from "react";
import ImageUploader from "../ui/ImageUploader";

export function PackageForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert itinerary object to JSON string for submission
    let submitData = { ...formData };

    try {
      // Clean up the itinerary object - remove empty entries
      const cleanItinerary = {};
      Object.entries(itineraryObj).forEach(([dayKey, day]) => {
        if (
          day &&
          (day.title ||
            (day.activities && day.activities.length > 0) ||
            day.accommodation)
        ) {
          cleanItinerary[dayKey] = {
            title: day.title || "",
            activities: (day.activities || []).filter(
              (activity) => activity.trim() !== ""
            ),
            accommodation: day.accommodation || null,
          };
        }
      });

      // Convert to JSON string for the usePackageManagement hook
      submitData.itinerary = JSON.stringify(cleanItinerary);
    } catch (err) {
      alert("Itinerary ไม่ถูกต้อง ไม่สามารถแปลงเป็น JSON ได้");
      console.error("JSON stringify error:", err);
      return;
    }

    onSubmit(isEdit, submitData);
  };
  useEffect(() => {
    if (typeof formData.includes === "string") {
      setFormData((prev) => ({
        ...prev,
        includes: formData.includes.split(",").map((i) => i.trim()),
      }));
    }

    if (typeof formData.excludes === "string") {
      setFormData((prev) => ({
        ...prev,
        excludes: formData.excludes.split(",").map((i) => i.trim()),
      }));
    }
  }, []);

  // Always use object for itinerary in UI and state
  let itineraryObj = {};
  if (
    typeof formData.itinerary === "object" &&
    formData.itinerary !== null &&
    !Array.isArray(formData.itinerary)
  ) {
    itineraryObj = formData.itinerary;
  } else if (Array.isArray(formData.itinerary)) {
    // Convert array to object with dayN keys
    formData.itinerary.forEach((day, i) => {
      itineraryObj[`day${i + 1}`] = day;
    });
    // Sync state to object if needed
    if (formData.itinerary.length > 0) {
      setFormData({ ...formData, itinerary: itineraryObj });
    }
  } else {
    itineraryObj = {};
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[70vh] overflow-y-auto"
    >
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          ข้อมูลพื้นฐาน
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ชื่อแพ็คเกจ (Title) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Experience the Magic of Japan"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ชื่อเรียก (Name) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Japanese Cultural Journey"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            รายละเอียดย่อ (Description) *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Immerse yourself in Japanese culture from Tokyo to Kyoto"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ภาพรวม (Overview) *
          </label>
          <textarea
            value={formData.overview}
            onChange={(e) =>
              setFormData({ ...formData, overview: e.target.value })
            }
            placeholder="Journey through Japan's most iconic destinations..."
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            rows={3}
            required
          />
        </div>
      </div>

      {/* Location & Category Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          สถานที่และหมวดหมู่
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              จุดหมายปลายทาง (Destination) *
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              placeholder="Japan"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ตำแหน่งที่ตั้ง (Location) *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Tokyo, Japan"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              หมวดหมู่ (Category)
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            >
              <option value="Cultural" className="bg-black text-white">
                Cultural
              </option>
              <option value="Adventure" className="bg-black text-white">
                Adventure
              </option>
              <option value="Nature" className="bg-black text-white">
                Nature
              </option>
              <option value="Historical" className="bg-black text-white">
                Historical
              </option>
              <option value="Wellness" className="bg-black text-white">
                Wellness
              </option>
            </select>
          </div>
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ระดับความยาก (Difficulty)
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            >
              <option value="Easy" className="bg-black text-white">
                Easy
              </option>
              <option value="Moderate" className="bg-black text-white">
                Moderate
              </option>
              <option value="Challenging" className="bg-black text-white">
                Challenging
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Duration & Capacity Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          ระยะเวลาและจำนวนผู้เข้าร่วม
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ระยะเวลา (Duration) *
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              placeholder="6 days 5 nights"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              จำนวนวัน (Days) *
            </label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) =>
                setFormData({ ...formData, durationDays: e.target.value })
              }
              placeholder="6"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              จำนวนคนสูงสุด (Max Capacity) *
            </label>
            <input
              type="number"
              value={formData.maxCapacity}
              onChange={(e) =>
                setFormData({ ...formData, maxCapacity: e.target.value })
              }
              placeholder="12"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          ราคา
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ราคาหลัก (Price) *
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="1899"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ราคาตัวเลข (Price Number) *
            </label>
            <input
              type="number"
              value={formData.priceNumber}
              onChange={(e) =>
                setFormData({ ...formData, priceNumber: e.target.value })
              }
              placeholder="1899"
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              required
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          กลุ่มราคาหลายคน (Price Details)
        </label>
        {Object.entries(formData.priceDetails || {}).map(
          ([key, value], idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const updated = { ...formData.priceDetails };
                  const oldValue = updated[key];
                  delete updated[key];
                  updated[newKey] = oldValue;
                  setFormData({ ...formData, priceDetails: updated });
                }}
                placeholder="2_people"
                className="col-span-2 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
              />
              <input
                type="number"
                value={value.total}
                onChange={(e) => {
                  const updated = {
                    ...formData.priceDetails,
                    [key]: {
                      ...formData.priceDetails[key],
                      total: parseFloat(e.target.value),
                    },
                  };
                  setFormData({ ...formData, priceDetails: updated });
                }}
                placeholder="Total"
                className="col-span-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
              />
              <input
                type="number"
                value={value.per_person}
                onChange={(e) => {
                  const updated = {
                    ...formData.priceDetails,
                    [key]: {
                      ...formData.priceDetails[key],
                      per_person: parseFloat(e.target.value),
                    },
                  };
                  setFormData({ ...formData, priceDetails: updated });
                }}
                placeholder="Per person"
                className="col-span-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = { ...formData.priceDetails };
                  delete updated[key];
                  setFormData({ ...formData, priceDetails: updated });
                }}
                className="text-red-400 text-sm"
              >
                ลบ
              </button>
            </div>
          )
        )}
        <button
          type="button"
          onClick={() => {
            const newKey = `group_${
              Object.keys(formData.priceDetails || {}).length + 1
            }`;
            const updated = {
              ...formData.priceDetails,
              [newKey]: { total: 0, per_person: 0 },
            };
            setFormData({ ...formData, priceDetails: updated });
          }}
          className="mt-2 px-3 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg text-sm"
        >
          + เพิ่มกลุ่มราคา
        </button>
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          รูปภาพ
        </h3>
        
        {/* Main Image Upload */}
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-4">
            รูปภาพหลัก (Main Image) *
          </label>
          <ImageUploader
            onImageUploaded={(imageUrl) => 
              setFormData({ ...formData, imageUrl })
            }
            currentImage={formData.imageUrl}
            type="packages"
            multiple={false}
            className="mb-4"
          />
        </div>

        {/* Additional Images - Convert string to array for compatibility */}
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-4">
            รูปภาพเพิ่มเติม (Additional Images)
          </label>
          <ImageUploader
            onImageUploaded={(imageUrls) => {
              const newImages = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
              const currentImages = formData.images ? formData.images.split(',').map(img => img.trim()).filter(img => img) : [];
              const allImages = [...currentImages, ...newImages];
              setFormData({ ...formData, images: allImages.join(', ') });
            }}
            type="packages"
            multiple={true}
            className="mb-4"
          />
          {formData.images && (
            <div className="mt-2 p-2 bg-black/30 rounded text-xs text-white/70">
              ปัจจุบัน: {formData.images}
            </div>
          )}
        </div>

        {/* Gallery Images - Convert string to array for compatibility */}
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-4">
            รูปภาพแกลเลอรี่ (Gallery Images)
          </label>
          <ImageUploader
            onImageUploaded={(imageUrls) => {
              const newImages = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
              const currentGalleryImages = formData.galleryImages ? formData.galleryImages.split(',').map(img => img.trim()).filter(img => img) : [];
              const allGalleryImages = [...currentGalleryImages, ...newImages];
              setFormData({ ...formData, galleryImages: allGalleryImages.join(', ') });
            }}
            type="packages"
            multiple={true}
            className="mb-4"
          />
          {formData.galleryImages && (
            <div className="mt-2 p-2 bg-black/30 rounded text-xs text-white/70">
              ปัจจุบัน: {formData.galleryImages}
            </div>
          )}
        </div>
      </div>

      {/* Content Arrays Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          เนื้อหาและรายละเอียด
        </h3>
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            จุดเด่น (Highlights - คั่นด้วยคอมมา) *
          </label>
          <textarea
            value={formData.highlights}
            onChange={(e) =>
              setFormData({ ...formData, highlights: e.target.value })
            }
            placeholder="Premium accommodation, Expert guides, Authentic cuisine"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            สิ่งที่รวมอยู่ในแพ็คเกจ (Includes)
          </label>
          {(formData.includes || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...formData.includes];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, includes: updated });
                }}
                className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
                placeholder={`รายการที่ ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.includes.filter((_, i) => i !== idx);
                  setFormData({ ...formData, includes: updated });
                }}
                className="text-red-400 text-sm"
              >
                ลบ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                includes: [...(formData.includes || []), ""],
              })
            }
            className="mt-2 px-3 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg text-sm"
          >
            + เพิ่มรายการ
          </button>
        </div>

        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            สิ่งที่ไม่รวมในแพ็คเกจ (Excludes)
          </label>
          {(formData.excludes || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...formData.excludes];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, excludes: updated });
                }}
                className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
                placeholder={`รายการที่ ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.excludes.filter((_, i) => i !== idx);
                  setFormData({ ...formData, excludes: updated });
                }}
                className="text-red-400 text-sm"
              >
                ลบ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                excludes: [...(formData.excludes || []), ""],
              })
            }
            className="mt-2 px-3 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg text-sm"
          >
            + เพิ่มรายการ
          </button>
        </div>

        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            แท็ก (Tags - คั่นด้วยคอมมา)
          </label>
          <textarea
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="japan, culture, temples, tokyo, kyoto"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            rows={2}
          />
        </div>
      </div>

      {/* JSON Data Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
          ข้อมูลเชิงโครงสร้าง (JSON)
        </h3>
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            กำหนดการเดินทาง (Itinerary) *
          </label>
          {Object.entries(itineraryObj).map(([dayKey, day], idx) => (
            <div
              key={dayKey}
              className="border border-[#FFD700]/30 rounded-xl p-4 mb-4 bg-black/30"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col flex-1">
                  <label className="text-[#FFD700] text-sm">
                    ชื่อวัน (Title)
                  </label>
                  <input
                    type="text"
                    value={day.title || ""}
                    onChange={(e) => {
                      const updated = {
                        ...itineraryObj,
                        [dayKey]: { ...day, title: e.target.value },
                      };
                      setFormData({ ...formData, itinerary: updated });
                    }}
                    className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white mb-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...itineraryObj };
                    delete updated[dayKey];
                    // Re-index keys to day1, day2, ...
                    const reIndexed = {};
                    Object.values(updated).forEach((d, i) => {
                      reIndexed[`day${i + 1}`] = d;
                    });
                    setFormData({ ...formData, itinerary: reIndexed });
                  }}
                  className="text-red-400 text-sm ml-2"
                >
                  ลบวัน
                </button>
              </div>
              <div className="mb-2">
                <label className="text-[#FFD700] text-sm">
                  กิจกรรม (Activities)
                </label>
                {(day.activities || []).map((act, aidx) => (
                  <div key={aidx} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={act}
                      onChange={(e) => {
                        const acts = [...(day.activities || [])];
                        acts[aidx] = e.target.value;
                        const updated = {
                          ...itineraryObj,
                          [dayKey]: { ...day, activities: acts },
                        };
                        setFormData({ ...formData, itinerary: updated });
                      }}
                      className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const acts = (day.activities || []).filter(
                          (_, i) => i !== aidx
                        );
                        const updated = {
                          ...itineraryObj,
                          [dayKey]: { ...day, activities: acts },
                        };
                        setFormData({ ...formData, itinerary: updated });
                      }}
                      className="text-red-400 text-xs"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const acts = [...(day.activities || []), ""];
                    const updated = {
                      ...itineraryObj,
                      [dayKey]: { ...day, activities: acts },
                    };
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  className="mt-1 px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded text-xs"
                >
                  + เพิ่มกิจกรรม
                </button>
              </div>
              <div>
                <label className="text-[#FFD700] text-sm">
                  ที่พัก (Accommodation)
                </label>
                <input
                  type="text"
                  value={day.accommodation || ""}
                  onChange={(e) => {
                    const updated = {
                      ...itineraryObj,
                      [dayKey]: { ...day, accommodation: e.target.value },
                    };
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              // Add new day as next dayN
              const newIdx = Object.keys(itineraryObj).length + 1;
              const updated = {
                ...itineraryObj,
                [`day${newIdx}`]: {
                  title: "",
                  activities: [],
                  accommodation: "",
                },
              };
              setFormData({ ...formData, itinerary: updated });
            }}
            className="px-3 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg text-sm"
          >
            + เพิ่มวันเดินทาง
          </button>
        </div>
        <div className="space-y-4">
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ที่พัก (Accommodation)
          </label>

          {Object.entries(formData.accommodation || {}).map(
            ([city, data], idx) => (
              <div
                key={city}
                className="border border-[#FFD700]/30 rounded-xl p-4 space-y-3 bg-black/30"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">เมือง: {city}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...formData.accommodation };
                      delete updated[city];
                      setFormData({ ...formData, accommodation: updated });
                    }}
                    className="text-red-400 text-sm"
                  >
                    ลบเมืองนี้
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#FFD700]">ชื่อโรงแรม</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => {
                        const updated = {
                          ...formData.accommodation,
                          [city]: { ...data, name: e.target.value },
                        };
                        setFormData({ ...formData, accommodation: updated });
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#FFD700]">
                      ระดับ (Rating)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={data.rating}
                      onChange={(e) => {
                        const updated = {
                          ...formData.accommodation,
                          [city]: { ...data, rating: Number(e.target.value) },
                        };
                        setFormData({ ...formData, accommodation: updated });
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#FFD700]">
                    สิ่งอำนวยความสะดวก (Amenities)
                  </label>
                  {(data.amenities || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updatedAmenities = [...data.amenities];
                          updatedAmenities[i] = e.target.value;
                          const updated = {
                            ...formData.accommodation,
                            [city]: { ...data, amenities: updatedAmenities },
                          };
                          setFormData({ ...formData, accommodation: updated });
                        }}
                        className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedAmenities = data.amenities.filter(
                            (_, idx) => idx !== i
                          );
                          const updated = {
                            ...formData.accommodation,
                            [city]: { ...data, amenities: updatedAmenities },
                          };
                          setFormData({ ...formData, accommodation: updated });
                        }}
                        className="text-red-400 text-sm"
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...formData.accommodation,
                        [city]: {
                          ...data,
                          amenities: [...(data.amenities || []), ""],
                        },
                      };
                      setFormData({ ...formData, accommodation: updated });
                    }}
                    className="mt-2 text-[#FFD700] text-sm"
                  >
                    + เพิ่ม Amenities
                  </button>
                </div>
              </div>
            )
          )}

          {/* Add new city */}
          <div className="mt-4">
            <label className="text-sm text-[#FFD700] block mb-1">
              เพิ่มเมืองใหม่
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ชื่อเมือง เช่น bangkok"
                value={formData.newCity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, newCity: e.target.value })
                }
                className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (!formData.newCity) return;
                  const newKey = formData.newCity.trim();
                  if (newKey in formData.accommodation)
                    return alert("เมืองนี้มีอยู่แล้ว");
                  const updated = {
                    ...formData.accommodation,
                    [newKey]: { name: "", rating: 4, amenities: [] },
                  };
                  setFormData({
                    ...formData,
                    accommodation: updated,
                    newCity: "",
                  });
                }}
                className="px-4 py-2 bg-[#FFD700]/20 border border-[#FFD700]/30 rounded text-white"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Ratings Section */}
      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">
            การตั้งค่าและการให้คะแนน
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Rating */}
            <div>
              <label className="block text-[#FFD700] text-sm font-medium mb-2">
                คะแนนรีวิว (Rating)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0 && value <= 5) {
                      setFormData({ ...formData, rating: value });
                    }
                  }}
                  placeholder="4.8"
                  className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                />
              </div>
              <p className="text-xs text-white/50 mt-1">
                {formData.rating >= 4.5
                  ? "ยอดเยี่ยม"
                  : formData.rating >= 4.0
                  ? "ดีมาก"
                  : formData.rating >= 3.0
                  ? "พอใช้"
                  : "ยังไม่มีรีวิวที่ดี"}
              </p>
            </div>

            {/* Total Reviews */}
            <div>
              <label className="block text-[#FFD700] text-sm font-medium mb-2">
                จำนวนรีวิว (Total Reviews)
              </label>
              <input
                type="number"
                min="0"
                value={formData.totalReviews}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalReviews: parseInt(e.target.value || "0"),
                  })
                }
                placeholder="4"
                className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              />
              <p className="text-xs text-white/50 mt-1">
                ใช้ระบุจำนวนผู้ให้คะแนนแพ็คเกจนี้
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={formData.isRecommended}
              onChange={(e) =>
                setFormData({ ...formData, isRecommended: e.target.checked })
              }
              className="mt-1 w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
            />
            <label className="text-white/80 text-sm">
              แพ็คเกจแนะนำ (Recommended)
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="mt-1 w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
            />
            <label className="text-white/80 text-sm">
              เปิดใช้งานแพ็คเกจ (Active)
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-6 border-t border-[#FFD700]/30">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] font-medium rounded-xl hover:bg-[#FFD700]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "กำลังดำเนินการ..." : isEdit ? "อัปเดต" : "สร้าง"}
          แพ็คเกจ
        </button>
      </div>
    </form>
  );
}
