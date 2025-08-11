# การแก้ไข Accommodation JSON Error

## ปัญหา
เมื่อสร้าง Travel Package เกิด error:
```
Error: Invalid JSON format in Accommodation field. Must be an object or array.
```

## สาเหตุ
1. **PackageFormNew.jsx** ส่ง accommodation เป็น JSON string แทนที่จะเป็น object
2. **API validation** ตรวจสอบ accommodation format ไม่เพียงพอ
3. **usePackageManagement hook** จัดการ accommodation object ไม่ถูกต้อง

## การแก้ไข

### 1. แก้ไข PackageFormNew.jsx
**ไฟล์**: `src/components/management/PackageFormNew.jsx`

**เปลี่ยนจาก**:
```jsx
submitData.accommodation = JSON.stringify(formData.accommodation);
```

**เป็น**:
```jsx
submitData.accommodation = formData.accommodation;
```

### 2. แก้ไข Travel Packages API
**ไฟล์**: `src/app/api/travel/packages/route.js`

**เพิ่ม validation**:
```javascript
// Process accommodation data with error handling if it exists
if (body.accommodation !== undefined) {
  if (typeof body.accommodation === 'string') {
    try {
      body.accommodation = JSON.parse(body.accommodation);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON format in Accommodation field. Must be an object or array.'
      }, { status: 400 });
    }
  }
  
  // Validate that accommodation is an object or array
  if (body.accommodation !== null && 
      typeof body.accommodation !== 'object') {
    return NextResponse.json({
      success: false,
      message: 'Invalid JSON format in Accommodation field. Must be an object or array.'
    }, { status: 400 });
  }
}
```

### 3. แก้ไข Management API
**ไฟล์**: `src/app/api/management/packages/[id]/route.js`

**เปลี่ยน error message** ให้ชัดเจนขึ้น:
```javascript
if (accommodation !== null && typeof accommodation !== 'object') {
  return NextResponse.json({
    success: false,
    message: 'Invalid JSON format in Accommodation field. Must be an object or array.'
  }, { status: 400 });
}
```

### 4. แก้ไข usePackageManagement Hook
**ไฟล์**: `src/hooks/usePackageManagement.js`

**ปรับปรุงการจัดการ accommodation**:
```javascript
if (formData.accommodation) {
  try {
    // If it's already an object, use it directly
    if (typeof formData.accommodation === 'object' && formData.accommodation !== null) {
      parsedAccommodation = formData.accommodation;
    } else if (typeof formData.accommodation === 'string') {
      const accommodationStr = formData.accommodation.trim();
      if (accommodationStr === '') {
        parsedAccommodation = {};
      } else if ((accommodationStr.startsWith('{') && accommodationStr.endsWith('}')) || 
          (accommodationStr.startsWith('[') && accommodationStr.endsWith(']'))) {
        parsedAccommodation = JSON.parse(accommodationStr);
      } else {
        toast({
          title: "Error",
          description: "Invalid JSON format in Accommodation field. Must be an object or array.",
          variant: "destructive",
        });
        return;
      }
    } else {
      parsedAccommodation = {};
    }
  } catch (error) {
    // Handle parsing errors
  }
}
```

## ผลลัพธ์

หลังจากการแก้ไข:

1. ✅ **Form submission** ส่ง accommodation เป็น object โดยตรง
2. ✅ **API validation** ตรวจสอบ accommodation format ได้ถูกต้อง
3. ✅ **Error messages** ชัดเจนและเป็นประโยชน์
4. ✅ **Compatibility** รองรับทั้ง string และ object format
5. ✅ **Error handling** จัดการ edge cases ได้ดีขึ้น

## การทดสอบ

1. ไปที่ Management > Travel Packages
2. กดปุ่ม "เพิ่มแพ็คเกจใหม่"
3. กรอกข้อมูลในแท็บ "ที่พัก" (Accommodation)
4. ทดสอบบันทึกแพ็คเกจ
5. ตรวจสอบว่าไม่มี JSON error

## หมายเหตุ

- การแก้ไขนี้รองรับ **backward compatibility** กับข้อมูลเก่า
- Accommodation field สามารถเป็น **object, array, หรือ null** ได้
- Error messages ชัดเจนและช่วยในการ debug
- ระบบจะ initialize accommodation เป็น `{}` เมื่อไม่มีข้อมูล
