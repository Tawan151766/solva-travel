# ระบบอัปโหลดรูปภาพใหม่ (Free Image Upload System)

## การเปลี่ยนแปลง

เราได้อัปเดตระบบอัปโหลดรูปภาพใหม่ที่ไม่ต้องใช้ S3 และฟรีโดยสมบูรณ์ โดยเก็บไฟล์ในโฟลเดอร์ `public/uploads/` ของโปรเจกต์

## โครงสร้างโฟลเดอร์

```
public/
  uploads/
    packages/    # รูปภาพของ Travel Packages
    gallery/     # รูปภาพของ Gallery
    general/     # รูปภาพทั่วไป
```

## คุณสมบัติใหม่

### 1. ImageUploader Component

- **ไฟล์**: `src/components/ui/ImageUploader.jsx`
- **ความสามารถ**:
  - Drag & Drop อัปโหลด
  - เลือกไฟล์แบบปกติ
  - รองรับหลายไฟล์พร้อมกัน
  - แสดง Preview รูปภาพ
  - ตรวจสอบประเภทไฟล์ (JPG, PNG, WebP)
  - จำกัดขนาดไฟล์ (สูงสุด 5MB)

### 2. Upload API

- **ไฟล์**: `src/app/api/upload/route.js`
- **Endpoint**: `POST /api/upload`
- **Parameters**:
  - `file`: ไฟล์รูปภาพ
  - `type`: ประเภทการอัปโหลด (packages, gallery, general)

### 3. Delete API

- **ไฟล์**: `src/app/api/upload/delete/route.js`
- **Endpoint**: `DELETE /api/upload/delete?path=/uploads/packages/filename.jpg`

## การใช้งาน

### ใน Travel Packages (PackageFormNew.jsx)

```jsx
<ImageUploader
  onImageUploaded={(imageUrl) => 
    setFormData({ ...formData, imageUrl })
  }
  currentImage={formData.imageUrl}
  type="packages"
  multiple={false}
/>
```

### ใน Gallery Management

```jsx
<ImageUploader
  onImageUploaded={(imageUrl) => 
    setFormData({ ...formData, imageUrl })
  }
  currentImage={formData.imageUrl}
  type="gallery"
  multiple={false}
/>
```

## ข้อดี

1. **ฟรี 100%** - ไม่ต้องจ่ายค่า S3 หรือบริการ cloud storage
2. **ง่ายต่อการใช้งาน** - Drag & Drop interface
3. **ปลอดภัย** - ตรวจสอบประเภทไฟล์และขนาด
4. **เร็ว** - ไฟล์อยู่ในเซิร์ฟเวอร์เดียวกัน
5. **Responsive** - ใช้งานได้ทั้งเดสก์ท็อปและมือถือ

## ข้อจำกัด

1. **การ Backup** - ต้อง backup ไฟล์ในโฟลเดอร์ public/uploads/ เอง
2. **ขนาดเซิร์ฟเวอร์** - อาจใช้พื้นที่เซิร์ฟเวอร์มาก หากมีรูปภาพเยอะ
3. **CDN** - ไม่มี CDN เหมือน S3 (แต่สามารถใช้ Cloudflare ได้)

## ไฟล์ที่ได้รับการอัปเดต

1. **src/components/ui/ImageUploader.jsx** - Component หลักสำหรับอัปโหลด
2. **src/app/api/upload/route.js** - API สำหรับอัปโหลดไฟล์
3. **src/app/api/upload/delete/route.js** - API สำหรับลบไฟล์
4. **src/components/management/PackageFormNew.jsx** - ใช้ ImageUploader แทน URL input
5. **src/components/management/PackageForm.jsx** - ใช้ ImageUploader แทน URL input  
6. **src/components/management/GalleryManagement.jsx** - ใช้ ImageUploader แทน URL input

## วิธีการทดสอบ

1. ไปที่หน้า Management > Travel Packages
2. กดปุ่ม "เพิ่มแพ็คเกจใหม่"
3. ไปที่แท็บ "รูปภาพ" 
4. ลองอัปโหลดรูปภาพด้วยการ:
   - Drag & Drop ไฟล์
   - คลิกเพื่อเลือกไฟล์
   - เลือกหลายไฟล์พร้อมกัน

## Production Deployment

เมื่อ deploy ไป production ควร:

1. ตั้งค่า backup อัตโนมัติสำหรับโฟลเดอร์ uploads/
2. ตั้งค่า CDN (เช่น Cloudflare) เพื่อเร่งความเร็ว
3. ตั้งค่า log rotation สำหรับ upload logs
4. พิจารณาใช้ cloud storage สำหรับโปรเจกต์ขนาดใหญ่
