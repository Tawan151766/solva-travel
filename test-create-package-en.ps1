# Test Create Travel Package Script - English Version

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
        Write-Host "Success: Login successful!" -ForegroundColor Green
        Write-Host "Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Gray
        Write-Host "User: $($loginResponse.user.firstName) $($loginResponse.user.lastName) ($($loginResponse.user.role))" -ForegroundColor Gray
        
        $token = $loginResponse.token
    } else {
        Write-Host "Error: Login failed - No token received" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: Login failed - $_" -ForegroundColor Red
    exit 1
}

# Step 2: Create sample package
Write-Host "`nStep 2: Creating sample travel package..." -ForegroundColor Yellow

$packageData = @{
    name = "Test Phuket Beach 4D3N Package"
    title = "Amazing Phuket Beach 4 Days 3 Nights"
    description = "Experience the beautiful southern sea of Phuket, Patong Beach with snorkeling activities and sunset viewing"
    overview = "Complete Phuket tour with sea, mountains and southern culture"
    location = "Phuket"
    destination = "Phuket and nearby islands"
    category = "Beach"
    difficulty = "Easy"
    durationDays = 4
    durationText = "4 days 3 nights"
    maxCapacity = 20
    priceNumber = 12500
    highlights = @(
        "Patong Beach",
        "Phi Phi Island",
        "Chalong Temple",
        "Weekend Night Market"
    )
    includes = @(
        "3 nights accommodation",
        "9 meals included",
        "Airport transfer",
        "Local guide",
        "Travel insurance",
        "Phi Phi Island boat tour"
    )
    excludes = @(
        "Flight tickets",
        "Personal expenses",
        "Guide and driver tips",
        "Snorkeling equipment"
    )
    tags = @("beach", "island", "snorkeling", "relaxation", "nature")
    images = @("https://example.com/phuket1.jpg", "https://example.com/phuket2.jpg")
    imageUrl = "https://example.com/phuket-main.jpg"
    accommodation = @{
        hotel_name = "Patong Beach Hotel"
        room_type = "Superior Sea View"
        rating = 4.5
        amenities = @("WiFi", "Breakfast", "Pool", "Beach Access", "Spa")
    }
    itinerary = @{
        day1 = @{
            title = "Day 1 - Arrival in Phuket"
            activities = @(
                "Airport pickup",
                "Hotel check-in",
                "Patong Beach walk",
                "Beachside dinner"
            )
        }
        day2 = @{
            title = "Day 2 - Phi Phi Island Tour"
            activities = @(
                "Departure to Phi Phi Island",
                "Snorkeling at coral reef",
                "Island lunch",
                "Sunset viewing"
            )
        }
        day3 = @{
            title = "Day 3 - Culture and Nature"
            activities = @(
                "Visit Chalong Temple",
                "Promthep Cape viewpoint",
                "Weekend Night Market",
                "Thai massage"
            )
        }
        day4 = @{
            title = "Day 4 - Shopping and Departure"
            activities = @(
                "Souvenir shopping",
                "Hotel check-out",
                "Airport transfer"
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
    
    Write-Host "Success: Package created successfully!" -ForegroundColor Green
    Write-Host "Package ID: $($createResponse.data.id)" -ForegroundColor Gray
    Write-Host "Package Name: $($createResponse.data.name)" -ForegroundColor Gray
    Write-Host "Price: $($createResponse.data.price) THB" -ForegroundColor Gray
    Write-Host "Duration: $($createResponse.data.duration) days" -ForegroundColor Gray
    Write-Host "Max Capacity: $($createResponse.data.maxCapacity) people" -ForegroundColor Gray
    
} catch {
    Write-Host "Error: Package creation failed - $_" -ForegroundColor Red
    
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
    
    Write-Host "Success: Retrieved $($packagesResponse.total) packages" -ForegroundColor Green
    
    # Show latest packages
    Write-Host "`nLatest packages:" -ForegroundColor Cyan
    $packagesResponse.data | Select-Object -First 3 | ForEach-Object {
        Write-Host "- $($_.name) (ID: $($_.id.Substring(0,8))..., Price: $($_.price) THB)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "Error: Failed to retrieve packages - $_" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
