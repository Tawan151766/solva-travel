# Test Create Travel Package Script

# First, get admin token
Write-Host "=== Testing Travel Package Creation ===" -ForegroundColor Green

# Step 1: Login as admin
Write-Host "`nStep 1: Login as admin..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@solva.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
    
    if ($loginResponse.token) {
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Gray
        Write-Host "User: $($loginResponse.user.firstName) $($loginResponse.user.lastName) ($($loginResponse.user.role))" -ForegroundColor Gray
        
        $token = $loginResponse.token
    } else {
        Write-Host "❌ Login failed: No token received" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Login error: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Create sample package
Write-Host "`nStep 2: Creating sample travel package..." -ForegroundColor Yellow

$packageData = @{
    name = "ทดสอบแพ็กเกจ Phuket 4 วัน 3 คืน"
    title = "ทดสอบแพ็กเกจ Phuket 4 วัน 3 คืน"
    description = "สัมผัสความงามของทะเลใต้ หาดป่าตอง ภูเก็ต พร้อมกิจกรรมดำน้ำและชมวิวพระอาทิตย์ตก"
    overview = "เที่ยวภูเก็ตแบบครบครัน ทะเล ภูเขา และวัฒนธรรมใต้"
    location = "ภูเก็ต"
    destination = "ภูเก็ต และเกาะใกล้เคียง"
    category = "Beach"
    difficulty = "Easy"
    durationDays = 4
    durationText = "4 วัน 3 คืน"
    maxCapacity = 20
    priceNumber = 12500
    highlights = @(
        "หาดป่าตอง",
        "เกาะพีพี",
        "วัดฉลอง",
        "ตลาดนัดวีเคนด์"
    )
    includes = @(
        "ที่พัก 3 คืน",
        "อาหาร 9 มื้อ",
        "รถรับส่ง",
        "ไกด์ท้องถิ่น",
        "ประกันการเดินทาง",
        "ค่าเรือเกาะพีพี"
    )
    excludes = @(
        "ตั๋วเครื่องบิน",
        "ค่าใช้จ่ายส่วนตัว",
        "ทิปไกด์และคนขับ",
        "อุปกรณ์ดำน้ำ"
    )
    tags = @("ทะเล", "เกาะ", "ดำน้ำ", "พักผ่อน", "ธรรมชาติ")
    images = @("https://example.com/phuket1.jpg", "https://example.com/phuket2.jpg")
    imageUrl = "https://example.com/phuket-main.jpg"
    accommodation = @{
        hotel_name = "โรงแรมชายหาดป่าตอง"
        room_type = "Superior Sea View"
        rating = 4.5
        amenities = @("WiFi", "Breakfast", "Pool", "Beach Access", "Spa")
    }
    itinerary = @{
        day1 = @{
            title = "วันที่ 1 - เดินทางถึงภูเก็ต"
            activities = @(
                "รับจากสนามบิน",
                "เช็คอินโรงแรม",
                "เดินเล่นหาดป่าตอง",
                "ทานอาหารเย็นริมชายหาด"
            )
        }
        day2 = @{
            title = "วันที่ 2 - ทัวร์เกาะพีพี"
            activities = @(
                "ออกเดินทางเกาะพีพี",
                "ดำน้ำชมปะการัง",
                "ทานอาหารกลางวันบนเกาะ",
                "ชมวิวพระอาทิตย์ตก"
            )
        }
        day3 = @{
            title = "วันที่ 3 - วัฒนธรรมและธรรมชาติ"
            activities = @(
                "เยี่ยมชมวัดฉลอง",
                "ขึ้นเขาแหลมพรหมเทพ",
                "ตลาดนัดวีเคนด์",
                "นวดแผนไทย"
            )
        }
        day4 = @{
            title = "วันที่ 4 - ช้อปปิ้งและเดินทางกลับ"
            activities = @(
                "ช้อปปิ้งของฝาก",
                "เช็คเอาต์",
                "ส่งสนามบิน"
            )
        }
    }
    isRecommended = $true
    isActive = $true
    rating = 4.7
    totalReviews = 0
} | ConvertTo-Json -Depth 10

# Create authorization header
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

try {
    Write-Host "Sending package data..." -ForegroundColor Gray
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/management/packages" -Method POST -Headers $headers -Body $packageData
    
    Write-Host "✅ Package created successfully!" -ForegroundColor Green
    Write-Host "Package ID: $($createResponse.data.id)" -ForegroundColor Gray
    Write-Host "Package Name: $($createResponse.data.name)" -ForegroundColor Gray
    Write-Host "Price: ฿$($createResponse.data.price)" -ForegroundColor Gray
    Write-Host "Duration: $($createResponse.data.duration) days" -ForegroundColor Gray
    Write-Host "Max Capacity: $($createResponse.data.maxCapacity) people" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Package creation failed: $_" -ForegroundColor Red
    
    # Try to get more error details
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

# Step 3: Verify package was created
Write-Host "`nStep 3: Verifying package was created..." -ForegroundColor Yellow

try {
    $packagesResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/management/packages" -Method GET -Headers $headers
    
    Write-Host "✅ Retrieved $($packagesResponse.total) packages" -ForegroundColor Green
    
    # Show latest packages
    $packagesResponse.data | Select-Object -First 3 | ForEach-Object {
        Write-Host "- $($_.name) (ID: $($_.id.Substring(0,8))..., Price: ฿$($_.price))" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Failed to retrieve packages: $_" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
