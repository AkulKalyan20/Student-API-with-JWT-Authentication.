const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword123'
};

const testStudent = {
  name: 'Test Student',
  email: 'test.student@student.edu',
  age: 21,
  grade: 'Junior',
  major: 'Computer Science',
  gpa: 3.7,
  enrollmentDate: '2023-09-01'
};

// Helper function to make authenticated requests
const makeAuthRequest = async (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    ...(data && { data })
  };
  
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
};

const testUserRegistration = async () => {
  console.log('\n👤 Testing User Registration...');
  try {
    const response = await makeAuthRequest('POST', '/auth/register', testUser);
    console.log('✅ User registration successful:', response.message);
    console.log('👤 User created:', response.user.name);
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  User already exists, continuing with login...');
    } else {
      console.error('❌ User registration failed');
    }
  }
};

const testUserLogin = async () => {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await makeAuthRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.token;
    console.log('✅ Login successful:', response.message);
    console.log('🔑 Token received:', authToken.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Login failed');
    throw error;
  }
};

const testGetStudents = async () => {
  console.log('\n📚 Testing Get All Students...');
  try {
    const response = await makeAuthRequest('GET', '/students');
    console.log('✅ Get students successful');
    console.log(`📊 Found ${response.count} students`);
    response.students.forEach(student => {
      console.log(`  - ${student.name} (${student.major})`);
    });
  } catch (error) {
    console.error('❌ Get students failed');
  }
};

const testCreateStudent = async () => {
  console.log('\n➕ Testing Create Student...');
  try {
    const response = await makeAuthRequest('POST', '/students', testStudent);
    console.log('✅ Student creation successful:', response.message);
    console.log('👨‍🎓 Student created:', response.student.name);
    return response.student.id;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Student already exists');
      return null;
    } else {
      console.error('❌ Student creation failed');
      return null;
    }
  }
};

const testGetStudentById = async (studentId) => {
  if (!studentId) return;
  
  console.log('\n🔍 Testing Get Student by ID...');
  try {
    const response = await makeAuthRequest('GET', `/students/${studentId}`);
    console.log('✅ Get student by ID successful');
    console.log('👨‍🎓 Student details:', response.student.name);
  } catch (error) {
    console.error('❌ Get student by ID failed');
  }
};

const testUpdateStudent = async (studentId) => {
  if (!studentId) return;
  
  console.log('\n✏️  Testing Update Student...');
  try {
    const updateData = { gpa: 3.9, grade: 'Senior' };
    const response = await makeAuthRequest('PUT', `/students/${studentId}`, updateData);
    console.log('✅ Student update successful:', response.message);
    console.log('📈 Updated GPA to:', response.student.gpa);
  } catch (error) {
    console.error('❌ Student update failed');
  }
};

const testSearchStudents = async () => {
  console.log('\n🔍 Testing Search Students...');
  try {
    const response = await makeAuthRequest('GET', '/students?major=Computer');
    console.log('✅ Search successful');
    console.log(`🔍 Found ${response.count} students matching "Computer"`);
  } catch (error) {
    console.error('❌ Search failed');
  }
};

const testDeleteStudent = async (studentId) => {
  if (!studentId) return;
  
  console.log('\n🗑️  Testing Delete Student...');
  try {
    const response = await makeAuthRequest('DELETE', `/students/${studentId}`);
    console.log('✅ Student deletion successful:', response.message);
    console.log('👨‍🎓 Deleted student:', response.student.name);
  } catch (error) {
    console.error('❌ Student deletion failed');
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting API Tests...');
  console.log('=' * 50);
  
  try {
    await testHealthCheck();
    await testUserRegistration();
    await testUserLogin();
    await testGetStudents();
    
    const studentId = await testCreateStudent();
    await testGetStudentById(studentId);
    await testUpdateStudent(studentId);
    await testSearchStudents();
    await testDeleteStudent(studentId);
    
    console.log('\n🎉 All tests completed!');
    console.log('=' * 50);
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  makeAuthRequest,
  testUser,
  testStudent
}; 