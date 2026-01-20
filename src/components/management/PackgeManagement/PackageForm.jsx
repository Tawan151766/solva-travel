
"use client";

import { useEffect, useState } from "react";
import ImageUploader from "../../ui/ImageUploader";

export function PackageForm({
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
    { id: "basic", label: "Basic info" },
    { id: "pricing", label: "Pricing & capacity" },
    { id: "content", label: "Highlights & tags" },
    { id: "itinerary", label: "Itinerary" },
    { id: "accommodation", label: "Accommodation" },
    { id: "media", label: "Media" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitData = { ...formData };

    try {
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

      if (formData.accommodation && typeof formData.accommodation === "object") {
        submitData.accommodation = formData.accommodation;
      }
    } catch (err) {
      alert(
        "We could not process the itinerary data. Please check the fields and try again."
      );
      console.error("Data processing error:", err);
      return;
    }

    onSubmit(isEdit, submitData);
  };

  useEffect(() => {
    setFormData((prev) => {
      const ensureArray = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
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
        galleryImages: ensureArray(prev.galleryImages),
        itinerary: prev.itinerary || {},
        accommodation: prev.accommodation || {},
      };
    });
  }, [formData.id, setFormData]);

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
    "Professional guide",
    "All entrance fees",
    "Bullet train tickets",
    "Welcome dinner",
    "Transportation during tour",
    "Hotel pickup and drop-off",
    "Travel insurance",
    "Free WiFi",
    "Bottled water",
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

  const toggleArrayItem = (array, item, setArray) => {
    const currentArray = array || [];
    if (currentArray.includes(item)) {
      setArray(currentArray.filter((i) => i !== item));
    } else {
      setArray([...currentArray, item]);
    }
  };
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Package title *
          </label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Experience the Magic of Japan"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Internal name *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Japanese Cultural Journey"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#FFD700]">
          Short description *
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Immerse yourself in Japanese culture from Tokyo to Kyoto."
          className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#FFD700]">
          Overview *
        </label>
        <textarea
          value={formData.overview || ""}
          onChange={(e) =>
            setFormData({ ...formData, overview: e.target.value })
          }
          placeholder="Journey through iconic destinations with curated cultural experiences..."
          className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Destination *
          </label>
          <input
            type="text"
            value={formData.destination || ""}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            placeholder="Japan"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Location *
          </label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Tokyo, Japan"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Category
          </label>
          <select
            value={formData.category || "Cultural"}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
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
          <label className="block text-sm font-medium text-[#FFD700]">
            Difficulty
          </label>
          <select
            value={formData.difficulty || "Easy"}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value })
            }
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="h-4 w-4 rounded border-[#FFD700]/40 bg-black/70"
          />
          Visible to customers
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={formData.isRecommended}
            onChange={(e) =>
              setFormData({ ...formData, isRecommended: e.target.checked })
            }
            className="h-4 w-4 rounded border-[#FFD700]/40 bg-black/70"
          />
          Mark as recommended
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-white/80">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating || ""}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="w-20 rounded border border-[#FFD700]/30 bg-black/50 px-2 py-2 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-white/80">Reviews</label>
            <input
              type="number"
              min="0"
              value={formData.totalReviews || ""}
              onChange={(e) =>
                setFormData({ ...formData, totalReviews: e.target.value })
              }
              className="w-20 rounded border border-[#FFD700]/30 bg-black/50 px-2 py-2 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Duration text *
          </label>
          <input
            type="text"
            value={formData.duration || ""}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="6 days 5 nights"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Days *
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
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Max capacity *
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
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Price (display text) *
          </label>
          <input
            type="text"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="THB 18,900"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FFD700]">
            Price per person (number) *
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
            placeholder="18900"
            className="w-full rounded-xl border border-[#FFD700]/30 bg-black/50 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FFD700] focus:bg-black/70 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#FFD700]/20 bg-black/30 p-4">
        <h4 className="mb-3 font-medium text-[#FFD700]">
          Group pricing (override per group if needed)
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(formData.priceDetails || {}).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-[#FFD700]/20 p-3"
            >
              <div className="mb-2 text-white font-medium">
                {key.replace("_people", " people")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#FFD700]">
                    Price per person
                  </label>
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
                          [key]: { per_person: perPerson, total },
                        },
                      });
                    }}
                    className="w-full rounded border border-[#FFD700]/30 bg-black/50 px-2 py-1 text-sm text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#FFD700]">Total</label>
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
                          [key]: { per_person: perPerson, total },
                        },
                      });
                    }}
                    className="w-full rounded border border-[#FFD700]/30 bg-black/50 px-2 py-1 text-sm text-white"
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
  const renderContent = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-sm font-medium text-[#FFD700]">
          Highlights * (click to add, Enter to create custom)
        </label>
        <div className="mb-4 flex flex-wrap gap-2">
          {highlightOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.highlights, option, (newHighlights) =>
                  setFormData({ ...formData, highlights: newHighlights })
                )
              }
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                (formData.highlights || []).includes(option)
                  ? "bg-[#FFD700] text-black font-medium"
                  : "border border-[#FFD700]/30 bg-black/30 text-[#FFD700] hover:bg-[#FFD700]/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Press Enter to add a custom highlight"
            className="flex-1 rounded-lg border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
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

        {Array.isArray(formData.highlights) &&
          formData.highlights.length > 0 && (
            <div className="mt-3">
              <div className="mb-2 text-xs text-[#FFD700]">Selected:</div>
              <div className="flex flex-wrap gap-1">
                {formData.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded bg-[#FFD700]/20 px-2 py-1 text-xs text-[#FFD700]"
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
                      className="ml-1 text-red-400 hover:text-red-300"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-[#FFD700]">
          Included items
        </label>
        <div className="mb-4 flex flex-wrap gap-2">
          {includeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.includes, option, (newIncludes) =>
                  setFormData({ ...formData, includes: newIncludes })
                )
              }
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                (formData.includes || []).includes(option)
                  ? "bg-green-600 text-white font-medium"
                  : "border border-green-400/30 bg-black/30 text-green-400 hover:bg-green-400/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Press Enter to add an inclusion"
            className="flex-1 rounded-lg border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
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
            <div className="mb-2 text-xs text-green-400">Selected:</div>
            <div className="flex flex-wrap gap-1">
              {formData.includes.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded bg-green-600/20 px-2 py-1 text-xs text-green-300"
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
                    className="ml-1 text-red-400 hover:text-red-300"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-[#FFD700]">
          Excluded items
        </label>
        <div className="mb-4 flex flex-wrap gap-2">
          {excludeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.excludes, option, (newExcludes) =>
                  setFormData({ ...formData, excludes: newExcludes })
                )
              }
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                (formData.excludes || []).includes(option)
                  ? "bg-red-600 text-white font-medium"
                  : "border border-red-400/30 bg-black/30 text-red-400 hover:bg-red-400/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Press Enter to add an exclusion"
            className="flex-1 rounded-lg border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
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
            <div className="mb-2 text-xs text-red-400">Selected:</div>
            <div className="flex flex-wrap gap-1">
              {formData.excludes.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded bg-red-600/20 px-2 py-1 text-xs text-red-300"
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
                    className="ml-1 text-red-400 hover:text-red-300"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-[#FFD700]">
          Tags
        </label>
        <div className="mb-4 flex flex-wrap gap-2">
          {tagOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                toggleArrayItem(formData.tags, option, (newTags) =>
                  setFormData({ ...formData, tags: newTags })
                )
              }
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                (formData.tags || []).includes(option)
                  ? "bg-blue-600 text-white font-medium"
                  : "border border-blue-400/30 bg-black/30 text-blue-400 hover:bg-blue-400/10"
              }`}
            >
              #{option}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Press Enter to add a tag"
            className="flex-1 rounded-lg border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
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
            <div className="mb-2 text-xs text-blue-400">Selected:</div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded bg-blue-600/20 px-2 py-1 text-xs text-blue-300"
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
                    className="ml-1 text-red-400 hover:text-red-300"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#FFD700]/20 bg-black/30 p-4">
        <h4 className="mb-3 font-medium text-[#FFD700]">Quick templates</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                itinerary: itineraryTemplates.japan_6days,
              })
            }
            className="rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-200 hover:bg-blue-600/30 transition-colors"
          >
            Japan 6 days
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                itinerary: itineraryTemplates.thailand_5days,
              })
            }
            className="rounded-lg bg-green-600/20 px-4 py-2 text-sm text-green-200 hover:bg-green-600/30 transition-colors"
          >
            Thailand 5 days
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, itinerary: {} })}
            className="rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-200 hover:bg-red-600/30 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="font-medium text-[#FFD700]">Itinerary</h4>
        <button
          type="button"
          onClick={() => {
            const newIdx = Object.keys(formData.itinerary || {}).length + 1;
            setFormData({
              ...formData,
              itinerary: {
                ...(formData.itinerary || {}),
                [`day${newIdx}`]: {
                  title: `Day ${newIdx}`,
                  activities: [],
                  accommodation: "",
                },
              },
            });
          }}
          className="rounded-lg bg-[#FFD700]/10 px-4 py-2 text-sm text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
        >
          + Add day
        </button>
      </div>

      {Object.entries(formData.itinerary || {}).length === 0 && (
        <p className="text-sm text-white/60">
          No days added yet. Use templates or add days manually.
        </p>
      )}

      {Object.entries(formData.itinerary || {}).map(([dayKey, day], idx) => (
        <div
          key={dayKey}
          className="rounded-xl border border-[#FFD700]/20 bg-black/40 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Day {idx + 1}</span>
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
                className="rounded-lg border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
                placeholder="Day title"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const updated = { ...(formData.itinerary || {}) };
                delete updated[dayKey];
                setFormData({ ...formData, itinerary: updated });
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>

          <div className="mb-2 text-xs text-white/60">
            Quick titles:
            <div className="mt-2 flex flex-wrap gap-2">
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
                  className="rounded px-3 py-1 text-xs text-[#FFD700] transition-colors hover:bg-[#FFD700]/20"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="text-sm text-[#FFD700]">Activities</label>
            {(day.activities || []).map((activity, activityIdx) => (
              <div key={activityIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => {
                    const updatedActivities = [...(day.activities || [])];
                    updatedActivities[activityIdx] = e.target.value;
                    setFormData({
                      ...formData,
                      itinerary: {
                        ...(formData.itinerary || {}),
                        [dayKey]: { ...day, activities: updatedActivities },
                      },
                    });
                  }}
                  className="flex-1 rounded-lg border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
                  placeholder="Add activity"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedActivities = (day.activities || []).filter(
                      (_, i) => i !== activityIdx
                    );
                    setFormData({
                      ...formData,
                      itinerary: {
                        ...(formData.itinerary || {}),
                        [dayKey]: { ...day, activities: updatedActivities },
                      },
                    });
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      itinerary: {
                        ...(formData.itinerary || {}),
                        [dayKey]: {
                          ...day,
                          activities: [
                            ...(day.activities || []),
                            option,
                          ],
                        },
                      },
                    });
                  }}
                  className="rounded bg-[#FFD700]/10 px-3 py-1 text-xs text-[#FFD700] hover:bg-[#FFD700]/20"
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  itinerary: {
                    ...(formData.itinerary || {}),
                    [dayKey]: {
                      ...day,
                      activities: [...(day.activities || []), ""],
                    },
                  },
                });
              }}
              className="rounded bg-black/60 px-3 py-2 text-sm text-white hover:bg-black/80 border border-[#FFD700]/30"
            >
              + Add activity
            </button>
          </div>

          <div className="mt-4">
            <label className="text-sm text-[#FFD700]">Accommodation</label>
            <div className="mt-2 flex flex-wrap gap-2">
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
                  className="rounded bg-[#FFD700]/10 px-3 py-1 text-xs text-[#FFD700] hover:bg-[#FFD700]/20"
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
              className="mt-2 w-full rounded border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
              placeholder="e.g. Tokyo City Hotel"
            />
          </div>
        </div>
      ))}
    </div>
  );
  const renderAccommodation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-[#FFD700]">Accommodation by city</h4>
        <button
          type="button"
          onClick={() => {
            const cityName = prompt("City name");
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
          className="rounded-lg bg-[#FFD700]/10 px-4 py-2 text-sm text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
        >
          + Add city
        </button>
      </div>

      {Object.entries(formData.accommodation || {}).map(([city, acc]) => (
        <div
          key={city}
          className="rounded-xl border border-[#FFD700]/30 bg-black/30 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-white font-medium">City: {city}</h5>
            <button
              type="button"
              onClick={() => {
                const updated = { ...(formData.accommodation || {}) };
                delete updated[city];
                setFormData({ ...formData, accommodation: updated });
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove city
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-[#FFD700]">Hotel name</label>
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
                className="mt-1 w-full rounded border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
                placeholder="Tokyo City Hotel"
              />
            </div>

            <div>
              <label className="text-sm text-[#FFD700]">
                Rating (1-5)
              </label>
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
                className="mt-1 w-full rounded border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-[#FFD700]">Amenities</label>
            {(acc.amenities || []).map((amenity, idx) => (
              <div key={idx} className="mt-1 flex items-center gap-2">
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
                  className="flex-1 rounded border border-[#FFD700]/30 bg-black/50 px-3 py-2 text-white"
                  placeholder="Free WiFi"
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
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  remove
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
              className="mt-2 rounded bg-[#FFD700]/10 px-2 py-1 text-xs text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
            >
              + Add amenity
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-4 block text-sm font-medium text-[#FFD700]">
          Main image *
        </label>
        <ImageUploader
          onImageUploaded={(imageUrl) => {
            setFormData({ ...formData, imageUrl });
          }}
          currentImage={formData.imageUrl}
          type="packages"
          multiple={false}
          className="mb-4"
        />
        <p className="text-xs text-white/50">
          Use a clear hero image that represents the destination or highlight.
        </p>
      </div>

      <div>
        <label className="mb-4 block text-sm font-medium text-[#FFD700]">
          Additional images
        </label>

        {(formData.images || []).length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {(formData.images || []).map((image, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={image}
                  alt={`Additional image ${idx + 1}`}
                  className="h-32 w-full rounded-lg object-cover"
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
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  x
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
              images: [...(formData.images || []), ...newImages],
            });
          }}
          type="packages"
          multiple={true}
          className="mb-4"
        />
        <p className="text-xs text-white/50">
          Upload lifestyle or detail shots to help admins and customers visualise
          the trip.
        </p>
      </div>

      <div>
        <label className="mb-4 block text-sm font-medium text-[#FFD700]">
          Gallery images
        </label>

        {(formData.galleryImages || []).length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {(formData.galleryImages || []).map((image, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={image}
                  alt={`Gallery image ${idx + 1}`}
                  className="h-32 w-full rounded-lg object-cover"
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
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  x
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
              galleryImages: [...(formData.galleryImages || []), ...newImages],
            });
          }}
          type="packages"
          multiple={true}
          className="mb-4"
        />
        <p className="text-xs text-white/50">
          Use this for optional gallery sets or carousel images.
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
      <div className="flex flex-wrap gap-2 border-b border-[#FFD700]/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#FFD700] text-black"
                : "bg-black/30 text-[#FFD700] hover:bg-[#FFD700]/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {renderTabContent()}
        </div>

        <div className="flex items-center justify-between border-t border-[#FFD700]/30 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              {previewMode ? "Hide preview" : "Preview mode"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFED4E] px-8 py-3 font-bold text-black transition-all hover:from-[#FFED4E] hover:to-[#FFD700] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update package"
              : "Create package"}
          </button>
        </div>
      </form>
    </div>
  );
}

