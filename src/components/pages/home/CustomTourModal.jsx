"use client";

import { useState } from "react";

export default function CustomTourModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [requireGuide, setRequireGuide] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#231f10] rounded-lg p-6 w-full max-w-lg text-white relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-[#efc004]"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Request Custom Tour Package</h2>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">สถานที่</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white placeholder:text-[#cdc08e] border-none"
              placeholder="เช่น ภูเก็ต"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">ประเทศ / เมือง</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white placeholder:text-[#cdc08e] border-none"
              placeholder="Japan / Tokyo"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm">วันที่เริ่ม</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white border-none"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">วันที่สิ้นสุด</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white border-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-sm">งบประมาณ</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white border-none"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">จำนวนคน</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white border-none"
                placeholder="2"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm">อีเมล</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white border-none"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              className="w-full px-3 py-2 rounded-lg bg-[#4a4221] text-white border-none"
              placeholder="0812345678"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">
              ต้องการไกด์นำเที่ยวหรือไม่?
            </label>
            <div className="flex items-center gap-2">
              <input
                id="requireGuide"
                type="checkbox"
                checked={requireGuide}
                onChange={(e) => setRequireGuide(e.target.checked)}
                className="accent-[#efc004] w-4 h-4"
              />
              <label htmlFor="requireGuide" className="text-sm">
                ต้องการไกด์
              </label>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#efc004] hover:bg-[#e5b500] text-[#231f10] font-semibold py-2 px-4 rounded-lg transition"
            >
              ส่งคำขอ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
