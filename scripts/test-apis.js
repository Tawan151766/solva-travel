#!/usr/bin/env node

// API Test Script for Prisma Integration
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📡 Endpoint: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ SUCCESS: ${data.message}`);
      if (data.data) {
        if (data.data.staff) {
          console.log(`📊 Found ${data.data.staff.length} staff members`);
        }
        if (data.data.packages) {
          console.log(`📊 Found ${data.data.packages.length} travel packages`);
        }
        if (data.data.images) {
          console.log(`📊 Found ${data.data.images.length} gallery images`);
        }
        if (data.data.pagination) {
          console.log(`📄 Page ${data.data.pagination.currentPage} of ${data.data.pagination.totalPages} (Total: ${data.data.pagination.totalCount})`);
        }
      }
    } else {
      console.log(`❌ FAILED: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests for Prisma Integration\n');
  console.log('=' .repeat(50));
  
  // Test staff endpoints
  await testAPI('/staff', 'Get all staff members');
  await testAPI('/staff?page=1&limit=2', 'Get staff with pagination');
  await testAPI('/staff?search=Sarah', 'Search staff by name');
  
  // Test travel packages endpoints  
  await testAPI('/travel/packages', 'Get all travel packages');
  await testAPI('/travel/packages?page=1&limit=2', 'Get packages with pagination');
  await testAPI('/travel/packages?search=Tropical', 'Search packages by name');
  await testAPI('/travel/packages?location=Kenya', 'Filter packages by location');
  await testAPI('/travel/packages?minPrice=1000&maxPrice=1500', 'Filter packages by price range');
  
  // Test gallery endpoint (now using Prisma)
  await testAPI('/gallery', 'Get gallery images (Prisma database)');
  await testAPI('/gallery?category=beach', 'Filter gallery by beach category');
  await testAPI('/gallery?search=wildlife', 'Search gallery images');
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎉 API Testing Complete!');
}

runTests().catch(console.error);
