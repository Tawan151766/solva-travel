# ระบบจัดการ Users, Staff, Reviews และ Management

## 📋 ภาพรวมระบบ

ระบบนี้ใช้ **table users เดียว** แต่มี **role-based system** และ **relations** ที่ครอบคลุม:

### 🎯 Role System
- **USER**: ลูกค้าทั่วไป
- **STAFF**: พนักงาน/ไกด์
- **ADMIN**: ผู้จัดการ/แอดมิน
- **SUPER_ADMIN**: ผู้จัดการระบบ

### 🔗 Table Relations
```
Users (หลัก)
├── StaffProfile (1:1) - ข้อมูลพนักงาน
├── Reviews (1:M) - รีวิวที่ให้และรับ
├── Bookings (1:M) - การจองของลูกค้า
├── StaffManagement (M:M) - การจัดการพนักงาน
└── SystemLogs (1:M) - บันทึกการใช้งาน
```

## 🚀 API Endpoints

### 1. **Authentication APIs**

#### Register User/Staff
```http
POST /api/auth/register-prisma
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+66812345678",
  "role": "STAFF"  // USER, STAFF, ADMIN
}
```

#### Login
```http
POST /api/auth/login-prisma
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. **Staff Management APIs**

#### Create/Update Staff Profile
```http
POST /api/staff/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-id",
  "employeeId": "EMP001",
  "department": "TOURS",
  "position": "Tour Guide",
  "salary": 25000,
  "hireDate": "2025-01-01",
  "bio": "Experienced tour guide...",
  "specializations": ["Mountain Tours", "Cultural Tours"],
  "languages": ["Thai", "English", "Chinese"]
}
```

#### Get Staff Profile
```http
GET /api/staff/profile?userId={userId}
```

#### Get All Staff (Admin only)
```http
GET /api/staff/management?department=TOURS&isAvailable=true
Authorization: Bearer {admin-token}
```

#### Assign Manager to Staff
```http
POST /api/staff/management
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "managerId": "manager-user-id",
  "staffId": "staff-user-id",
  "action": "add"  // or "remove"
}
```

### 3. **Review System APIs**

#### Submit Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "reviewedUserId": "staff-user-id",
  "rating": 5,
  "title": "ไกด์ดีมาก",
  "comment": "บริการดีเยี่ยม พาเที่ยวสนุก",
  "reviewType": "GUIDE",
  "bookingId": "booking-id" // optional
}
```

#### Get Reviews (Given or Received)
```http
GET /api/reviews?userId={userId}&type=received
GET /api/reviews?userId={userId}&type=given
```

## 💾 Database Schema

### Users Table (หลัก)
```sql
- id (String, Primary Key)
- email (String, Unique)
- password (String)
- firstName (String)
- lastName (String)
- phone (String?)
- role (Enum: USER, STAFF, ADMIN, SUPER_ADMIN)
- isActive (Boolean)
- isEmailVerified (Boolean)
- lastLoginAt (DateTime?)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Staff Profiles Table
```sql
- id (String, Primary Key)
- userId (String, Foreign Key → Users.id)
- employeeId (String, Unique)
- department (Enum: TOURS, CUSTOMER_SERVICE, etc.)
- position (String)
- salary (Decimal?)
- hireDate (DateTime)
- bio (String?)
- specializations (String[])
- languages (String[])
- rating (Float)
- totalReviews (Int)
- isAvailable (Boolean)
```

### Reviews Table
```sql
- id (String, Primary Key)
- reviewerId (String, Foreign Key → Users.id)
- reviewedUserId (String, Foreign Key → Users.id)
- rating (Int, 1-5)
- title (String?)
- comment (String?)
- reviewType (Enum: SERVICE, GUIDE, OVERALL, BOOKING)
- bookingId (String?, Foreign Key)
- isPublic (Boolean)
- isVerified (Boolean)
```

## 🔄 User Journey Examples

### 1. **ลูกค้ารีวิวไกด์**
```
1. ลูกค้า (USER) ลงทะเบียน
2. จองทัวร์และได้รับการบริการจากไกด์ (STAFF)
3. ลูกค้าส่งรีวิวไกด์ผ่าน POST /api/reviews
4. ระบบอัพเดท rating ของไกด์อัตโนมัติ
```

### 2. **แอดมินจัดการพนักงาน**
```
1. แอดมิน (ADMIN) เข้าสู่ระบบ
2. ดูรายชื่อพนักงานทั้งหมด GET /api/staff/management
3. กำหนดผู้จัดการให้พนักงาน POST /api/staff/management
4. ดูรีวิวของพนักงานแต่ละคน
```

### 3. **พนักงานอัพเดทโปรไฟล์**
```
1. พนักงาน (STAFF) เข้าสู่ระบบ
2. อัพเดทข้อมูลส่วนตัว POST /api/staff/profile
3. ดูรีวิวที่ได้รับ GET /api/reviews?type=received
```

## 🧪 Testing Examples

### PowerShell Testing Commands

#### 1. Register Staff
```powershell
$staffData = @{
  firstName = "สมชาย"
  lastName = "ใจดี"
  email = "somchai@solvatravel.com"
  password = "password123"
  phone = "+66812345678"
  role = "STAFF"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register-prisma" -Method Post -Body $staffData -ContentType "application/json"
```

#### 2. Create Staff Profile
```powershell
$profileData = @{
  userId = "staff-user-id"
  employeeId = "EMP001"
  department = "TOURS"
  position = "Senior Tour Guide"
  salary = 30000
  hireDate = "2025-01-01"
  bio = "มีประสบการณ์นำเที่ยวมากกว่า 5 ปี"
  specializations = @("Mountain Tours", "Cultural Tours")
  languages = @("Thai", "English", "Chinese")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/staff/profile" -Method Post -Body $profileData -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
```

#### 3. Submit Review
```powershell
$reviewData = @{
  reviewedUserId = "staff-user-id"
  rating = 5
  title = "ไกด์ดีมาก"
  comment = "บริการดีเยี่ยม มีความรู้เรื่องประวัติศาสตร์ดี"
  reviewType = "GUIDE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/reviews" -Method Post -Body $reviewData -ContentType "application/json" -Headers @{Authorization="Bearer $customerToken"}
```

## 🛡️ Security Features

1. **JWT Authentication**: ทุก API ที่สำคัญต้องมี token
2. **Role-based Access**: แต่ละ role มีสิทธิ์แตกต่างกัน
3. **Password Hashing**: ใช้ bcrypt ระดับ 12
4. **Input Validation**: ตรวจสอบข้อมูลทุกครั้งก่อนบันทึก
5. **SQL Injection Prevention**: ใช้ Prisma ORM

## 📊 Key Benefits

✅ **Single Users Table**: ใช้ table เดียวแต่มีความยืดหยุ่นสูง
✅ **Role-based System**: จัดการสิทธิ์ได้ง่าย
✅ **Flexible Relations**: สามารถ join และ query ข้อมูลได้หลากหลาย
✅ **Review System**: ลูกค้าสามารถรีวิวพนักงานได้
✅ **Staff Management**: แอดมินสามารถจัดการทีมได้
✅ **Scalable**: ขยายระบบได้ง่าย

## 🔧 Next Steps

1. เพิ่ม Email Verification
2. สร้าง Dashboard สำหรับแอดมิน
3. เพิ่มระบบแจ้งเตือน (Notifications)
4. สร้างรายงานและสถิติ
5. เพิ่ม API สำหรับ Mobile App
