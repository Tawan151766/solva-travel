import fs from 'fs';
import path from 'path';

const managementApiPath = 'src/app/api/management';

// Files to update
const filesToUpdate = [
  'packages/[id]/route.js',
  'bookings/route.js',
  'bookings/[id]/route.js',
  'stats/route.js',
  'users/route.js',
  'users/[id]/route.js',
  'custom-tour-requests/route.js',
  'custom-tour-requests/[id]/route.js'
];

function updateFile(filePath) {
  try {
    const fullPath = path.join(managementApiPath, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${fullPath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // Replace OPERATOR/ADMIN checks with ADMIN only
    const patterns = [
      {
        old: /if \(!?\[?'OPERATOR',?\s*'ADMIN'\]?\.includes\(decoded\.role\)\)/g,
        new: "if (decoded.role !== 'ADMIN')"
      },
      {
        old: /if \(!\[?'OPERATOR',?\s*'ADMIN'\]?\.includes\(user\.role\)\)/g,
        new: "if (user.role !== 'ADMIN')"
      },
      {
        old: /Operator or Admin role required/g,
        new: "Admin role required"
      },
      {
        old: /operator or admin role/g,
        new: "admin role"
      },
      {
        old: /operator\/admin role/g,
        new: "admin role"
      },
      {
        old: /Insufficient permissions\. Operator or Admin role required\./g,
        new: "Insufficient permissions. Admin role required."
      }
    ];
    
    patterns.forEach(pattern => {
      if (pattern.old.test(content)) {
        content = content.replace(pattern.old, pattern.new);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔧 Updating Management API files to Admin-only access...');
console.log('');

filesToUpdate.forEach(updateFile);

console.log('');
console.log('🎉 Update completed!');
console.log('');
console.log('📋 Summary:');
console.log('- All Management APIs now require ADMIN role only');
console.log('- OPERATOR role is no longer accepted');
console.log('- Only users with role "ADMIN" can access Management features');
console.log('');
console.log('👤 Admin Account:');
console.log('📧 Email: admin@solva.com');
console.log('🔐 Password: admin123');