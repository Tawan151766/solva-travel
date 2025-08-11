"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageUploader from "../ui/ImageUploader";

export function PackageFormNew({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [previewMode, setPreviewMode] = useState(false);

  const tabs = [
    { id: "basic", label: "ข้อมูลพื้นฐาน", icon: "📝" },
    { id: "pricing", label: "ราคาและระยะเวลา", icon: "💰" },
    { id: "content", label: "เนื้อหาและรายละเอียด", icon: "📋" },
    { id: "itinerary", label: "กำหนดการเดินทาง", icon: "🗓️" },
    { id: "accommodation", label: "ที่พัก", icon: "🏨" },
    { id: "media", label: "รูปภาพ", icon: "📸" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert itinerary object to JSON string for submission
    let submitData = { ...formData };

    try {
      // Clean up the itinerary object
      const cleanItinerary = {};
      Object.entries(formData.itinerary || {}).forEach(([dayKey, day]) => {
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

      submitData.itinerary = JSON.stringify(cleanItinerary);

      // Clean up accommodation - keep as object, don't stringify
      if (
        formData.accommodation &&
        typeof formData.accommodation === "object"
      ) {
        submitData.accommodation = formData.accommodation;
      }
    } catch (err) {
      alert("ข้อมูลไม่ถูกต้อง ไม่สามารถบันทึกได้");
      console.error("Data processing error:", err);
      return;
    }

    onSubmit(isEdit, submitData);
  };

  // Initialize default data and normalize arrays
  useEffect(() => {
    setFormData((prev) => {
      // Helper function to ensure array format
      const ensureArray = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          // Try to parse as comma-separated string
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        return [];
      };

      return {
        ...prev,
        priceDetails: prev.priceDetails || {
          "2_people": { total: 0, per_person: 0 },
          "4_people": { total: 0, per_person: 0 },
          "6_people": { total: 0, per_person: 0 },
          "8_people": { total: 0, per_person: 0 },
        },
        includes: ensureArray(prev.includes),
        excludes: ensureArray(prev.excludes),
        highlights: ensureArray(prev.highlights),
        tags: ensureArray(prev.tags),
        images: ensureArray(prev.images),
        itinerary: prev.itinerary || {},
        accommodation: prev.accommodation || {},
      };
    });
  }, [formData.id]); // Add dependency to re-run when editing different packages

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ชื่อแพ็คเกจ (Title) *
          </label>
          <input
            type="text"
            value={formData.title || ""}
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
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Japanese Cultural Journey"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          คำอธิบายสั้น (Description) *
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Immerse yourself in Japanese culture from Tokyo to Kyoto"
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          ภาพรวม (Overview) *
        </label>
        <textarea
          value={formData.overview || ""}
          onChange={(e) =>
            setFormData({ ...formData, overview: e.target.value })
          }
          placeholder="Journey through Japan's most iconic destinations in this carefully curated cultural experience..."
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            จุดหมายปลายทาง (Destination) *
          </label>
          <input
            type="text"
            value={formData.destination || ""}
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
            value={formData.location || ""}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Tokyo, Japan"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            หมวดหมู่ (Category)
          </label>
          <select
            value={formData.category || "Cultural"}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          >
            <option value="Cultural">Cultural</option>
            <option value="Adventure">Adventure</option>
            <option value="Nature">Nature</option>
            <option value="Historical">Historical</option>
            <option value="Wellness">Wellness</option>
            <option value="Beach">Beach</option>
            <option value="City">City</option>
          </select>
        </div>

        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ระดับความยาก (Difficulty)
          </label>
          <select
            value={formData.difficulty || "Easy"}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value })
            }
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ระยะเวลา (Duration Text) *
          </label>
          <input
            type="text"
            value={formData.duration || ""}
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
            value={formData.durationDays || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                durationDays: parseInt(e.target.value) || 0,
              })
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
            value={formData.maxCapacity || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxCapacity: parseInt(e.target.value) || 0,
              })
            }
            placeholder="12"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ราคาหลัก (Price Text) *
          </label>
          <input
            type="text"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="$1899.00"
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
            value={formData.priceNumber || ""}
            onChange={(e) => {
              const price = parseFloat(e.target.value) || 0;
              setFormData({
                ...formData,
                priceNumber: price,
                priceDetails: {
                  "2_people": { total: price * 2, per_person: price },
                  "4_people": {
                    total: price * 4 * 0.9,
                    per_person: price * 0.9,
                  },
                  "6_people": {
                    total: price * 6 * 0.85,
                    per_person: price * 0.85,
                  },
                  "8_people": {
                    total: price * 8 * 0.8,
                    per_person: price * 0.8,
                  },
                },
              });
            }}
            placeholder="1899"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            required
          />
        </div>
      </div>

      {/* Custom Price Details */}
      <div className="bg-black/30 rounded-xl p-4 border border-[#FFD700]/20">
        <h4 className="text-[#FFD700] font-medium mb-3">
          ราคาตามจำนวนคน (สามารถแก้ไขได้)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.priceDetails || {}).map(([key, value]) => (
            <div
              key={key}
              className="border border-[#FFD700]/20 rounded-lg p-3"
            >
              <div className="text-white font-medium mb-2">
                {key.replace("_people", " คน")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#FFD700] text-xs">ราคาต่อคน</label>
                  <input
                    type="number"
                    value={value.per_person || 0}
                    onChange={(e) => {
                      const perPerson = parseFloat(e.target.value) || 0;
                      const groupSize = parseInt(key.split("_")[0]);
                      const total = perPerson * groupSize;
                      setFormData({
                        ...formData,
                        priceDetails: {
                          ...formData.priceDetails,
                          [key]: { per_person: perPerson, total: total },
                        },
                      });
                    }}
                    className="w-full px-2 py-1 bg-black/50 border border-[#FFD700]/30 rounded text-white text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[#FFD700] text-xs">ราคารวม</label>
                  <input
                    type="number"
                    value={value.total || 0}
                    onChange={(e) => {
                      const total = parseFloat(e.target.value) || 0;
                      const groupSize = parseInt(key.split("_")[0]);
                      const perPerson = total / groupSize;
                      setFormData({
                        ...formData,
                        priceDetails: {
                          ...formData.priceDetails,
                          [key]: { per_person: perPerson, total: total },
                        },
                      });
                    }}
                    className="w-full px-2 py-1 bg-black/50 border border-[#FFD700]/30 rounded text-white text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Predefined options for easy selection
  const highlightOptions = [
    "Visit iconic Mount Fuji",
    "Experience traditional tea ceremony",
    "Explore Tokyo's vibrant neighborhoods",
    "Stay in a traditional ryokan",
    "Bullet train experience",
    "Professional English-speaking guide",
    "Cultural immersion activities",
    "Authentic local cuisine",
    "Historical temple visits",
    "Scenic mountain views",
    "Traditional craft workshops",
    "Local market exploration",
    "Photography opportunities",
    "Sunset viewing spots",
    "Wildlife encounters",
  ];

  const includeOptions = [
    "5 nights accommodation",
    "Daily breakfast",
    "Airport transfers",
    "Professional English-speaking guide",
    "All entrance fees",
    "Bullet train tickets",
    "Traditional ryokan experience",
    "Welcome dinner",
    "Transportation during tour",
    "Hotel pickup and drop-off",
    "Travel insurance",
    "Free WiFi",
    "Bottled water",
    "Local SIM card",
    "Emergency support",
    "Cultural activities",
  ];

  const excludeOptions = [
    "International flights",
    "Travel insurance",
    "Lunch and dinner (except welcome dinner)",
    "Personal expenses",
    "Visa fees",
    "Optional activities",
    "Alcoholic beverages",
    "Laundry services",
    "Room service",
    "Tips and gratuities",
    "Shopping expenses",
    "Medical expenses",
    "Additional accommodation",
    "Extra transportation",
  ];

  const tagOptions = [
    "japan",
    "culture",
    "temples",
    "tokyo",
    "kyoto",
    "traditional",
    "adventure",
    "nature",
    "historical",
    "food",
    "photography",
    "family-friendly",
    "romantic",
    "luxury",
    "budget",
    "group",
    "solo",
    "beach",
    "mountain",
    "city",
    "rural",
    "festival",
  ];

  const toggleArrayItem = (array, item, setArray) => {
    const currentArray = array || [];
    if (currentArray.includes(item)) {
      setArray(currentArray.filter((i) => i !== item));
    } else {
      setArray([...currentArray, item]);
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      {/* Highlights */}
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-3">
          จุดเด่น (Highlights) * - เลือกได้หลายรายการ
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {highlightOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.highlights, option, (newHighlights) =>
                  setFormData({ ...formData, highlights: newHighlights })
                )
              }
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                (formData.highlights || []).includes(option)
                  ? "bg-[#FFD700] text-black font-medium"
                  : "bg-black/30 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Custom highlight input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="เพิ่มจุดเด่นที่กำหนดเอง..."
            className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const newHighlight = e.target.value.trim();
                if (!(formData.highlights || []).includes(newHighlight)) {
                  setFormData({
                    ...formData,
                    highlights: [...(formData.highlights || []), newHighlight],
                  });
                }
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* Selected highlights display */}
        {Array.isArray(formData.highlights) &&
          formData.highlights.length > 0 && (
            <div className="mt-3">
              <div className="text-[#FFD700] text-xs mb-2">รายการที่เลือก:</div>
              <div className="flex flex-wrap gap-1">
                {formData.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-xs"
                  >
                    {highlight}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.highlights || []).filter(
                          (_, i) => i !== idx
                        );
                        setFormData({ ...formData, highlights: updated });
                      }}
                      className="text-red-400 hover:text-red-300 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Includes */}
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-3">
          สิ่งที่รวมอยู่ในแพ็คเกจ (Includes) - เลือกได้หลายรายการ
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {includeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.includes, option, (newIncludes) =>
                  setFormData({ ...formData, includes: newIncludes })
                )
              }
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                (formData.includes || []).includes(option)
                  ? "bg-green-600 text-white font-medium"
                  : "bg-black/30 text-green-400 border border-green-400/30 hover:bg-green-400/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="เพิ่มรายการที่กำหนดเอง..."
            className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const newItem = e.target.value.trim();
                if (!(formData.includes || []).includes(newItem)) {
                  setFormData({
                    ...formData,
                    includes: [...(formData.includes || []), newItem],
                  });
                }
                e.target.value = "";
              }
            }}
          />
        </div>

        {Array.isArray(formData.includes) && formData.includes.length > 0 && (
          <div className="mt-3">
            <div className="text-green-400 text-xs mb-2">รายการที่เลือก:</div>
            <div className="flex flex-wrap gap-1">
              {formData.includes.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.includes || []).filter(
                        (_, i) => i !== idx
                      );
                      setFormData({ ...formData, includes: updated });
                    }}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Excludes */}
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-3">
          สิ่งที่ไม่รวมในแพ็คเกจ (Excludes) - เลือกได้หลายรายการ
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {excludeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.excludes, option, (newExcludes) =>
                  setFormData({ ...formData, excludes: newExcludes })
                )
              }
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                (formData.excludes || []).includes(option)
                  ? "bg-red-600 text-white font-medium"
                  : "bg-black/30 text-red-400 border border-red-400/30 hover:bg-red-400/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="เพิ่มรายการที่กำหนดเอง..."
            className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const newItem = e.target.value.trim();
                if (!(formData.excludes || []).includes(newItem)) {
                  setFormData({
                    ...formData,
                    excludes: [...(formData.excludes || []), newItem],
                  });
                }
                e.target.value = "";
              }
            }}
          />
        </div>

        {Array.isArray(formData.excludes) && formData.excludes.length > 0 && (
          <div className="mt-3">
            <div className="text-red-400 text-xs mb-2">รายการที่เลือก:</div>
            <div className="flex flex-wrap gap-1">
              {formData.excludes.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.excludes || []).filter(
                        (_, i) => i !== idx
                      );
                      setFormData({ ...formData, excludes: updated });
                    }}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-3">
          แท็ก (Tags) - เลือกได้หลายรายการ
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {tagOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.tags, option, (newTags) =>
                  setFormData({ ...formData, tags: newTags })
                )
              }
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                (formData.tags || []).includes(option)
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-black/30 text-blue-400 border border-blue-400/30 hover:bg-blue-400/10"
              }`}
            >
              #{option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="เพิ่มแท็กที่กำหนดเอง..."
            className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded-lg text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const newTag = e.target.value.trim().toLowerCase();
                if (!(formData.tags || []).includes(newTag)) {
                  setFormData({
                    ...formData,
                    tags: [...(formData.tags || []), newTag],
                  });
                }
                e.target.value = "";
              }
            }}
          />
        </div>

        {Array.isArray(formData.tags) && formData.tags.length > 0 && (
          <div className="mt-3">
            <div className="text-blue-400 text-xs mb-2">แท็กที่เลือก:</div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.tags || []).filter(
                        (_, i) => i !== idx
                      );
                      setFormData({ ...formData, tags: updated });
                    }}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Predefined itinerary templates and options
  const itineraryTemplates = {
    japan_6days: {
      day1: {
        title: "Arrival in Tokyo",
        activities: ["Airport pickup", "Shibuya crossing", "Welcome dinner"],
        accommodation: "Tokyo City Hotel",
      },
      day2: {
        title: "Tokyo Exploration",
        activities: ["Senso-ji Temple", "Tokyo Skytree", "Harajuku district"],
        accommodation: "Tokyo City Hotel",
      },
      day3: {
        title: "Mount Fuji Day Trip",
        activities: ["Lake Kawaguchi", "Fuji viewing", "Hot springs"],
        accommodation: "Tokyo City Hotel",
      },
      day4: {
        title: "Bullet Train to Kyoto",
        activities: [
          "Shinkansen experience",
          "Fushimi Inari Shrine",
          "Gion district",
        ],
        accommodation: "Traditional Ryokan",
      },
      day5: {
        title: "Kyoto Temples",
        activities: ["Kinkaku-ji Temple", "Bamboo Grove", "Tea ceremony"],
        accommodation: "Traditional Ryokan",
      },
      day6: {
        title: "Departure",
        activities: ["Free time", "Airport transfer"],
        accommodation: null,
      },
    },
    thailand_5days: {
      day1: {
        title: "Arrival in Bangkok",
        activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"],
        accommodation: "Bangkok Luxury Hotel",
      },
      day2: {
        title: "Bangkok Temple Tour",
        activities: [
          "Wat Pho Temple",
          "Grand Palace",
          "Wat Arun",
          "Khao San Road",
        ],
        accommodation: "Bangkok Luxury Hotel",
      },
      day3: {
        title: "Flight to Phuket",
        activities: ["Morning flight", "Beach time", "Sunset dinner"],
        accommodation: "Phuket Beach Resort",
      },
      day4: {
        title: "Island Hopping",
        activities: ["Phi Phi Islands", "Snorkeling", "Beach BBQ"],
        accommodation: "Phuket Beach Resort",
      },
      day5: {
        title: "Departure",
        activities: ["Free time", "Airport transfer", "Flight home"],
        accommodation: null,
      },
    },
  };

  const dayTitleOptions = [
    "Arrival Day",
    "Departure Day",
    "City Exploration",
    "Cultural Tour",
    "Adventure Day",
    "Beach Day",
    "Mountain Trip",
    "Temple Visit",
    "Shopping Day",
    "Free Day",
    "Transfer Day",
    "Island Hopping",
    "Food Tour",
    "Historical Sites",
    "Nature Walk",
  ];

  const activityOptions = [
    "Airport pickup",
    "Airport transfer",
    "Hotel check-in",
    "Welcome dinner",
    "City tour",
    "Temple visit",
    "Museum tour",
    "Shopping",
    "Beach time",
    "Island hopping",
    "Snorkeling",
    "Diving",
    "Hiking",
    "Photography",
    "Cultural show",
    "Cooking class",
    "Market visit",
    "Sunset viewing",
    "Free time",
    "Rest day",
  ];

  const accommodationOptions = [
    "Luxury Hotel",
    "Beach Resort",
    "City Hotel",
    "Traditional Ryokan",
    "Boutique Hotel",
    "Mountain Lodge",
    "Guesthouse",
    "Hostel",
    "Villa",
    "Apartment",
  ];

  const renderItinerary = () => (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-black/30 rounded-xl p-4 border border-[#FFD700]/20">
        <h4 className="text-[#FFD700] font-medium mb-3">
          เทมเพลตกำหนดการเดินทาง (Quick Templates)
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                itinerary: itineraryTemplates.japan_6days,
              })
            }
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
          >
            🇯🇵 Japan 6 Days
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                itinerary: itineraryTemplates.thailand_5days,
              })
            }
            className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30 transition-colors"
          >
            🇹🇭 Thailand 5 Days
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, itinerary: {} })}
            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-[#FFD700] font-medium">
          กำหนดการเดินทาง (Itinerary)
        </h4>
        <button
          type="button"
          onClick={() => {
            const newIdx = Object.keys(formData.itinerary || {}).length + 1;
            setFormData({
              ...formData,
              itinerary: {
                ...(formData.itinerary || {}),
                [`day${newIdx}`]: {
                  title: "",
                  activities: [],
                  accommodation: "",
                },
              },
            });
          }}
          className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg text-sm hover:bg-[#FFD700]/20 transition-colors"
        >
          + เพิ่มวันเดินทาง
        </button>
      </div>

      {Object.entries(formData.itinerary || {}).map(([dayKey, day], idx) => (
        <div
          key={dayKey}
          className="border border-[#FFD700]/30 rounded-xl p-4 bg-black/30"
        >
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-white font-medium">วันที่ {idx + 1}</h5>
            <button
              type="button"
              onClick={() => {
                const updated = { ...(formData.itinerary || {}) };
                delete updated[dayKey];
                // Re-index keys
                const reIndexed = {};
                Object.values(updated).forEach((d, i) => {
                  reIndexed[`day${i + 1}`] = d;
                });
                setFormData({ ...formData, itinerary: reIndexed });
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ลบวัน
            </button>
          </div>

          <div className="space-y-4">
            {/* Day Title with Options */}
            <div>
              <label className="text-[#FFD700] text-sm mb-2 block">
                ชื่อวัน (Title)
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {dayTitleOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        itinerary: {
                          ...(formData.itinerary || {}),
                          [dayKey]: { ...day, title: option },
                        },
                      });
                    }}
                    className="px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded text-xs hover:bg-[#FFD700]/20 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={day.title || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    itinerary: {
                      ...(formData.itinerary || {}),
                      [dayKey]: { ...day, title: e.target.value },
                    },
                  });
                }}
                className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                placeholder="หรือพิมพ์ชื่อวันที่กำหนดเอง..."
              />
            </div>

            {/* Activities with Options */}
            <div>
              <label className="text-[#FFD700] text-sm mb-2 block">
                กิจกรรม (Activities)
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {activityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const currentActivities = day.activities || [];
                      if (!currentActivities.includes(option)) {
                        const acts = [...currentActivities, option];
                        setFormData({
                          ...formData,
                          itinerary: {
                            ...(formData.itinerary || {}),
                            [dayKey]: { ...day, activities: acts },
                          },
                        });
                      }
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      (day.activities || []).includes(option)
                        ? "bg-green-600 text-white"
                        : "bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Selected Activities */}
              {(day.activities || []).map((activity, aidx) => (
                <div key={aidx} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => {
                      const acts = [...(day.activities || [])];
                      acts[aidx] = e.target.value;
                      setFormData({
                        ...formData,
                        itinerary: {
                          ...(formData.itinerary || {}),
                          [dayKey]: { ...day, activities: acts },
                        },
                      });
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white text-sm"
                    placeholder="กิจกรรม..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const acts = (day.activities || []).filter(
                        (_, i) => i !== aidx
                      );
                      setFormData({
                        ...formData,
                        itinerary: {
                          ...(formData.itinerary || {}),
                          [dayKey]: { ...day, activities: acts },
                        },
                      });
                    }}
                    className="text-red-400 text-xs hover:text-red-300 px-2 py-1"
                  >
                    ลบ
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const acts = [...(day.activities || []), ""];
                  setFormData({
                    ...formData,
                    itinerary: {
                      ...(formData.itinerary || {}),
                      [dayKey]: { ...day, activities: acts },
                    },
                  });
                }}
                className="mt-1 px-3 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded text-xs hover:bg-[#FFD700]/20 transition-colors"
              >
                + เพิ่มกิจกรรม
              </button>
            </div>

            {/* Accommodation with Options */}
            <div>
              <label className="text-[#FFD700] text-sm mb-2 block">
                ที่พัก (Accommodation)
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {accommodationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        itinerary: {
                          ...(formData.itinerary || {}),
                          [dayKey]: { ...day, accommodation: option },
                        },
                      });
                    }}
                    className="px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded text-xs hover:bg-[#FFD700]/20 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={day.accommodation || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    itinerary: {
                      ...(formData.itinerary || {}),
                      [dayKey]: { ...day, accommodation: e.target.value },
                    },
                  });
                }}
                className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                placeholder="หรือพิมพ์ชื่อที่พักที่กำหนดเอง..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAccommodation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-[#FFD700] font-medium">
          ข้อมูลที่พัก (Accommodation)
        </h4>
        <button
          type="button"
          onClick={() => {
            const cityName = prompt("ชื่อเมือง:");
            if (cityName) {
              setFormData({
                ...formData,
                accommodation: {
                  ...(formData.accommodation || {}),
                  [cityName.toLowerCase()]: {
                    name: "",
                    rating: 4,
                    amenities: [],
                  },
                },
              });
            }
          }}
          className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg text-sm hover:bg-[#FFD700]/20 transition-colors"
        >
          + เพิ่มที่พัก
        </button>
      </div>

      {Object.entries(formData.accommodation || {}).map(([city, acc]) => (
        <div
          key={city}
          className="border border-[#FFD700]/30 rounded-xl p-4 bg-black/30"
        >
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-white font-medium">เมือง: {city}</h5>
            <button
              type="button"
              onClick={() => {
                const updated = { ...(formData.accommodation || {}) };
                delete updated[city];
                setFormData({ ...formData, accommodation: updated });
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ลบที่พัก
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#FFD700] text-sm">ชื่อโรงแรม</label>
              <input
                type="text"
                value={acc.name || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    accommodation: {
                      ...(formData.accommodation || {}),
                      [city]: { ...acc, name: e.target.value },
                    },
                  });
                }}
                className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white mt-1"
                placeholder="เช่น Tokyo City Hotel"
              />
            </div>

            <div>
              <label className="text-[#FFD700] text-sm">เรตติ้ง (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={acc.rating || 4}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    accommodation: {
                      ...(formData.accommodation || {}),
                      [city]: { ...acc, rating: parseInt(e.target.value) || 4 },
                    },
                  });
                }}
                className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white mt-1"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-[#FFD700] text-sm">
              สิ่งอำนวยความสะดวก (Amenities)
            </label>
            {(acc.amenities || []).map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1 mt-1">
                <input
                  type="text"
                  value={amenity}
                  onChange={(e) => {
                    const amenities = [...(acc.amenities || [])];
                    amenities[idx] = e.target.value;
                    setFormData({
                      ...formData,
                      accommodation: {
                        ...(formData.accommodation || {}),
                        [city]: { ...acc, amenities },
                      },
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-black/50 border border-[#FFD700]/30 rounded text-white"
                  placeholder="เช่น Free WiFi"
                />
                <button
                  type="button"
                  onClick={() => {
                    const amenities = (acc.amenities || []).filter(
                      (_, i) => i !== idx
                    );
                    setFormData({
                      ...formData,
                      accommodation: {
                        ...(formData.accommodation || {}),
                        [city]: { ...acc, amenities },
                      },
                    });
                  }}
                  className="text-red-400 text-xs hover:text-red-300"
                >
                  ลบ
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const amenities = [...(acc.amenities || []), ""];
                setFormData({
                  ...formData,
                  accommodation: {
                    ...(formData.accommodation || {}),
                    [city]: { ...acc, amenities },
                  },
                });
              }}
              className="mt-1 px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded text-xs hover:bg-[#FFD700]/20 transition-colors"
            >
              + เพิ่มสิ่งอำนวยความสะดวก
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
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
        <p className="text-white/50 text-xs mt-2">
          รูปภาพหลักที่จะแสดงในหน้ารายการแพ็คเกจ
        </p>
      </div>

      {/* Additional Images Upload */}
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-4">
          รูปภาพเพิ่มเติม (Additional Images)
        </label>
        
        {/* Current additional images */}
        {(formData.images || []).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {(formData.images || []).map((image, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={image}
                  alt={`Additional image ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (formData.images || []).filter(
                      (_, i) => i !== idx
                    );
                    setFormData({ ...formData, images: updated });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <ImageUploader
          onImageUploaded={(imageUrls) => {
            const newImages = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
            setFormData({ 
              ...formData, 
              images: [...(formData.images || []), ...newImages]
            });
          }}
          type="packages"
          multiple={true}
          className="mb-4"
        />
        <p className="text-white/50 text-xs">
          รูปภาพเพิ่มเติมที่จะแสดงในรายละเอียดแพ็คเกจ (สามารถเลือกหลายไฟล์พร้อมกัน)
        </p>
      </div>

      {/* Gallery Images Upload */}
      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-4">
          รูปภาพแกลเลอรี่ (Gallery Images)
        </label>
        
        {/* Current gallery images */}
        {(formData.galleryImages || []).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {(formData.galleryImages || []).map((image, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={image}
                  alt={`Gallery image ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (formData.galleryImages || []).filter(
                      (_, i) => i !== idx
                    );
                    setFormData({ ...formData, galleryImages: updated });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <ImageUploader
          onImageUploaded={(imageUrls) => {
            const newImages = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
            setFormData({ 
              ...formData, 
              galleryImages: [...(formData.galleryImages || []), ...newImages]
            });
          }}
          type="packages"
          multiple={true}
          className="mb-4"
        />
        <p className="text-white/50 text-xs">
          รูปภาพสำหรับแกลเลอรี่ที่จะแสดงในหน้าแกลเลอรี่ของเว็บไซต์
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicInfo();
      case "pricing":
        return renderPricing();
      case "content":
        return renderContent();
      case "itinerary":
        return renderItinerary();
      case "accommodation":
        return renderAccommodation();
      case "media":
        return renderMedia();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#FFD700]/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#FFD700] text-black"
                : "bg-black/30 text-[#FFD700] hover:bg-[#FFD700]/10"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {renderTabContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-[#FFD700]/30">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {previewMode ? "แก้ไข" : "ดูตัวอย่าง"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-bold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "กำลังบันทึก..."
              : isEdit
              ? "อัปเดต"
              : "สร้างแพ็คเกจ"}
          </button>
        </div>
      </form>
    </div>
  );
}
