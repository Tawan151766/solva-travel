import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

const execAsync = promisify(exec);

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🌐 Testing Network Connectivity to AWS RDS...\n');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('❌ No DATABASE_URL found');
  process.exit(1);
}

const url = new URL(dbUrl);
const hostname = url.hostname;
const port = url.port || '5432';

console.log(`🎯 Target: ${hostname}:${port}\n`);

async function testConnectivity() {
  console.log('🔄 Step 1: Testing DNS resolution...');
  try {
    const { stdout } = await execAsync(`nslookup ${hostname}`);
    console.log('✅ DNS resolution successful');
    console.log('📋 DNS Info:');
    console.log(stdout.split('\n').slice(0, 10).join('\n')); // Show first 10 lines
  } catch (error) {
    console.log('❌ DNS resolution failed:', error.message);
    return false;
  }

  console.log('\n🔄 Step 2: Testing ping connectivity...');
  try {
    const { stdout } = await execAsync(`ping -n 4 ${hostname}`);
    console.log('✅ Ping successful');
    // Extract ping statistics
    const lines = stdout.split('\n');
    const statsLine = lines.find(line => line.includes('Packets:'));
    if (statsLine) {
      console.log('📊 Ping Stats:', statsLine.trim());
    }
  } catch (error) {
    console.log('❌ Ping failed - This is expected for RDS (ICMP blocked)');
    console.log('ℹ️  AWS RDS typically blocks ICMP ping for security');
  }

  console.log('\n🔄 Step 3: Testing port connectivity...');
  try {
    // Use PowerShell Test-NetConnection for port testing
    const { stdout } = await execAsync(`powershell "Test-NetConnection -ComputerName ${hostname} -Port ${port} -InformationLevel Detailed"`);
    console.log('📋 Port Test Result:');
    console.log(stdout);
    
    if (stdout.includes('TcpTestSucceeded : True')) {
      console.log('✅ Port 5432 is accessible!');
      return true;
    } else {
      console.log('❌ Port 5432 is not accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ Port test failed:', error.message);
    return false;
  }
}

async function checkCurrentIP() {
  console.log('🔄 Getting your current public IP...');
  try {
    const { stdout } = await execAsync('curl -s https://api.ipify.org');
    const publicIP = stdout.trim();
    console.log(`🌍 Your public IP: ${publicIP}`);
    console.log('ℹ️  Make sure this IP is allowed in RDS Security Group');
    return publicIP;
  } catch (error) {
    console.log('⚠️  Could not get public IP:', error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  await checkCurrentIP();
  console.log('\n' + '='.repeat(50));
  
  const isConnectable = await testConnectivity();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY:');
  
  if (isConnectable) {
    console.log('✅ Network connectivity is OK');
    console.log('🔍 The issue might be:');
    console.log('  - Database credentials');
    console.log('  - Database is not running');
    console.log('  - Application-level connection issues');
  } else {
    console.log('❌ Network connectivity failed');
    console.log('🔧 Possible solutions:');
    console.log('  1. Check if RDS instance is running');
    console.log('  2. Update Security Group to allow your IP');
    console.log('  3. Ensure RDS is publicly accessible');
    console.log('  4. Check VPC and subnet configuration');
  }
}

runTests().catch(console.error);