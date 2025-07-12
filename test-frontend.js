// Test frontend form data preparation
const testFormDataPreparation = () => {
  console.log('=== Testing Form Data Preparation ===');
  
  // Simulate form data without user login
  const formDataWithoutUser = {
    destination: 'ญี่ปุ่น',
    city: 'Tokyo',
    tripType: 'family',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    numberOfPeople: 2,
    budget: '100000',
    contactEmail: '',  // Empty because no user
    contactPhone: '',  // Empty because no user
    contactName: '',   // Empty because no user
    accommodation: '',
    transportation: '',
    specialRequirements: '',
    description: '',
    requireGuide: false,
    proposalType: 'custom_booking'
  };
  
  console.log('Form data without user:', formDataWithoutUser);
  
  // Check validation
  const requiredFields = ['destination', 'city', 'startDate', 'endDate', 'contactEmail', 'contactPhone', 'contactName', 'budget'];
  const missingFields = requiredFields.filter(field => {
    const value = formDataWithoutUser[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  console.log('Missing required fields:', missingFields);
  
  if (missingFields.length > 0) {
    console.log('❌ Validation would fail with message: กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน รวมถึงงบประมาณที่เสนอ');
    return false;
  }
  
  console.log('✅ Validation would pass');
  return true;
};

const testFormDataWithUser = () => {
  console.log('\n=== Testing Form Data With User ===');
  
  // Simulate form data with user login
  const mockUser = {
    id: '1',
    email: 'user@example.com',
    phone: '0812345678',
    firstName: 'John',
    lastName: 'Doe'
  };
  
  const formDataWithUser = {
    destination: 'ญี่ปุ่น',
    city: 'Tokyo',
    tripType: 'family',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    numberOfPeople: 2,
    budget: '100000',
    contactEmail: mockUser.email,
    contactPhone: mockUser.phone,
    contactName: `${mockUser.firstName} ${mockUser.lastName}`,
    accommodation: '',
    transportation: '',
    specialRequirements: '',
    description: '',
    requireGuide: false,
    proposalType: 'custom_booking'
  };
  
  console.log('Form data with user:', formDataWithUser);
  
  // Check validation
  const requiredFields = ['destination', 'city', 'startDate', 'endDate', 'contactEmail', 'contactPhone', 'contactName', 'budget'];
  const missingFields = requiredFields.filter(field => {
    const value = formDataWithUser[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  console.log('Missing required fields:', missingFields);
  
  if (missingFields.length > 0) {
    console.log('❌ Validation would fail');
    return false;
  }
  
  console.log('✅ Validation would pass');
  return true;
};

const testDateValidation = () => {
  console.log('\n=== Testing Date Validation ===');
  
  const startDate = new Date('2025-08-01');
  const endDate = new Date('2025-08-05');
  const today = new Date();
  
  console.log('Start date:', startDate.toISOString());
  console.log('End date:', endDate.toISOString());
  console.log('Today:', today.toISOString());
  
  if (startDate < today) {
    console.log('❌ Start date validation would fail: วันที่เริ่มต้องไม่เป็นวันที่ผ่านมาแล้ว');
    return false;
  }
  
  if (endDate <= startDate) {
    console.log('❌ End date validation would fail: วันที่สิ้นสุดต้องมากกว่าวันที่เริ่ม');
    return false;
  }
  
  console.log('✅ Date validation would pass');
  return true;
};

// Run all tests
console.log('Starting Frontend Validation Tests...\n');

testFormDataPreparation();
testFormDataWithUser();
testDateValidation();

console.log('\n=== Tests Completed ===');
