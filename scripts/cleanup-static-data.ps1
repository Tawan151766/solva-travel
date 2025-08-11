# PowerShell script to remove redundant static data files
# These files contain hardcoded data that should be in database only

Write-Host "Removing redundant static data files..." -ForegroundColor Yellow

# Create backup directory
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".\backup\static-data\$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "Creating backup of static data files..." -ForegroundColor Blue

# Backup files if they exist
$filesToBackup = @(
    "src\data\travelData.js",
    "src\data\galleryData.js", 
    "src\data\staffData.js",
    "sample-travel-packages.js"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        Copy-Item $file $backupDir
        Write-Host "Backed up $file" -ForegroundColor Green
    }
}

# Remove the files
Write-Host "Removing static data files..." -ForegroundColor Yellow

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        Remove-Item $file
        Write-Host "Removed $file" -ForegroundColor Red
    }
}

# List components that need to be updated
Write-Host "Components that need to be updated to use API only:" -ForegroundColor Yellow
Write-Host "   - src\components\pages\home\TravelPackages.jsx"
Write-Host "   - Any component importing from src\data\*"
Write-Host "   - Components using hardcoded data"

# Search for imports of removed files
Write-Host "Searching for imports of removed files..." -ForegroundColor Blue

$searchPatterns = @(
    "src/data/travelData",
    "src/data/galleryData", 
    "src/data/staffData",
    "sample-travel-packages"
)

foreach ($pattern in $searchPatterns) {
    $results = Get-ChildItem -Path "src" -Recurse -Include "*.js", "*.jsx", "*.ts", "*.tsx" | 
               Select-String -Pattern $pattern -SimpleMatch
    
    if ($results) {
        Write-Host "Found imports of $pattern in:" -ForegroundColor Yellow
        foreach ($result in $results) {
            Write-Host "- $($result.Filename)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "No $pattern imports found" -ForegroundColor Green
    }
}

Write-Host "Static data cleanup completed!" -ForegroundColor Green
Write-Host "Backups stored in: $backupDir" -ForegroundColor Blue
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update components to use API endpoints only"
Write-Host "2. Run database migration"  
Write-Host "3. Test all functionality"
