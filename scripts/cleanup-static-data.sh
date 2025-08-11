#!/bin/bash

# Script to remove redundant static data files
# These files contain hardcoded data that should be in database only

echo "🗑️  Removing redundant static data files..."

# Backup files before deletion (optional)
echo "📁 Creating backup of static data files..."
mkdir -p ./backup/static-data/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backup/static-data/$(date +%Y%m%d_%H%M%S)"

# Backup files if they exist
if [ -f "src/data/travelData.js" ]; then
    cp src/data/travelData.js "$BACKUP_DIR/"
    echo "✅ Backed up travelData.js"
fi

if [ -f "src/data/galleryData.js" ]; then
    cp src/data/galleryData.js "$BACKUP_DIR/"
    echo "✅ Backed up galleryData.js"
fi

if [ -f "src/data/staffData.js" ]; then
    cp src/data/staffData.js "$BACKUP_DIR/"
    echo "✅ Backed up staffData.js"
fi

if [ -f "sample-travel-packages.js" ]; then
    cp sample-travel-packages.js "$BACKUP_DIR/"
    echo "✅ Backed up sample-travel-packages.js"
fi

# Remove the files
echo "🗑️  Removing static data files..."

# Remove travel data file
if [ -f "src/data/travelData.js" ]; then
    rm src/data/travelData.js
    echo "❌ Removed src/data/travelData.js"
fi

# Remove gallery data file  
if [ -f "src/data/galleryData.js" ]; then
    rm src/data/galleryData.js
    echo "❌ Removed src/data/galleryData.js"
fi

# Remove staff data file
if [ -f "src/data/staffData.js" ]; then
    rm src/data/staffData.js
    echo "❌ Removed src/data/staffData.js"
fi

# Remove sample packages (move to seeds instead)
if [ -f "sample-travel-packages.js" ]; then
    rm sample-travel-packages.js
    echo "❌ Removed sample-travel-packages.js"
fi

# List components that need to be updated
echo "⚠️  Components that need to be updated to use API only:"
echo "   - src/components/pages/home/TravelPackages.jsx"
echo "   - Any component importing from src/data/*"
echo "   - Components using hardcoded data"

# Search for imports of removed files
echo "🔍 Searching for imports of removed files..."
grep -r "from.*src/data/travelData" src/ 2>/dev/null || echo "   No travelData imports found"
grep -r "from.*src/data/galleryData" src/ 2>/dev/null || echo "   No galleryData imports found"  
grep -r "from.*src/data/staffData" src/ 2>/dev/null || echo "   No staffData imports found"
grep -r "from.*sample-travel-packages" src/ 2>/dev/null || echo "   No sample-travel-packages imports found"

echo "✅ Static data cleanup completed!"
echo "📁 Backups stored in: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Update components to use API endpoints only"
echo "2. Run database migration"
echo "3. Test all functionality"
