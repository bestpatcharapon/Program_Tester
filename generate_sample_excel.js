import * as XLSX from 'xlsx'

// สร้าง sample data ที่มีข้อมูลครบถ้วน
const sampleData = [
  {
    'Test Name': 'Login with valid credentials',
    'Category': 'Authentication',
    'Framework': 'playwright',
    'Priority': 'high',
    'Tags': 'smoke,login,critical',
    'Description': 'Test user login with correct username and password'
  },
  {
    'Test Name': 'Login with invalid password',
    'Category': 'Authentication',
    'Framework': 'playwright',
    'Priority': 'high',
    'Tags': 'smoke,login,negative',
    'Description': 'Test user login with incorrect password'
  },
  {
    'Test Name': 'Password reset flow',
    'Category': 'Authentication',
    'Framework': 'playwright',
    'Priority': 'medium',
    'Tags': 'password,email',
    'Description': 'Test password reset via email'
  },
  {
    'Test Name': 'API - Create User',
    'Category': 'User Management',
    'Framework': 'pytest',
    'Priority': 'high',
    'Tags': 'api,user,crud,smoke',
    'Description': 'Test POST /api/users endpoint to create new user'
  },
  {
    'Test Name': 'API - Get User List',
    'Category': 'User Management',
    'Framework': 'pytest',
    'Priority': 'medium',
    'Tags': 'api,user',
    'Description': 'Test GET /api/users endpoint to retrieve all users'
  },
  {
    'Test Name': 'API - Update User',
    'Category': 'User Management',
    'Framework': 'pytest',
    'Priority': 'medium',
    'Tags': 'api,user,crud',
    'Description': 'Test PUT /api/users/{id} endpoint to update user data'
  },
  {
    'Test Name': 'API - Delete User',
    'Category': 'User Management',
    'Framework': 'pytest',
    'Priority': 'low',
    'Tags': 'api,user,crud',
    'Description': 'Test DELETE /api/users/{id} endpoint to remove user'
  },
  {
    'Test Name': 'Checkout - Add to Cart',
    'Category': 'E-Commerce',
    'Framework': 'robot',
    'Priority': 'high',
    'Tags': 'e2e,checkout,cart',
    'Description': 'Test adding products to shopping cart'
  },
  {
    'Test Name': 'Checkout - Payment Process',
    'Category': 'E-Commerce',
    'Framework': 'robot',
    'Priority': 'critical',
    'Tags': 'e2e,checkout,payment,critical',
    'Description': 'Test complete payment process with credit card'
  },
  {
    'Test Name': 'Checkout - Order Confirmation',
    'Category': 'E-Commerce',
    'Framework': 'robot',
    'Priority': 'high',
    'Tags': 'e2e,checkout,order',
    'Description': 'Test order confirmation and email notification'
  },
  {
    'Test Name': 'Product Search',
    'Category': 'Product Catalog',
    'Framework': 'playwright',
    'Priority': 'medium',
    'Tags': 'search,product,ui',
    'Description': 'Test product search functionality with various keywords'
  },
  {
    'Test Name': 'Product Filter by Category',
    'Category': 'Product Catalog',
    'Framework': 'playwright',
    'Priority': 'medium',
    'Tags': 'filter,product,ui',
    'Description': 'Test product filtering by category'
  },
  {
    'Test Name': 'Product Filter by Price',
    'Category': 'Product Catalog',
    'Framework': 'playwright',
    'Priority': 'low',
    'Tags': 'filter,product,ui',
    'Description': 'Test product filtering by price range'
  },
  {
    'Test Name': 'User Profile Update',
    'Category': 'User Profile',
    'Framework': 'playwright',
    'Priority': 'medium',
    'Tags': 'profile,user,ui',
    'Description': 'Test updating user profile information'
  },
  {
    'Test Name': 'Upload Profile Picture',
    'Category': 'User Profile',
    'Framework': 'playwright',
    'Priority': 'low',
    'Tags': 'profile,upload,ui',
    'Description': 'Test uploading and updating profile picture'
  }
]

// สร้าง workbook และ worksheet
const ws = XLSX.utils.json_to_sheet(sampleData)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Test Cases')

// บันทึกไฟล์
XLSX.writeFile(wb, 'sample_test_cases.xlsx')

console.log('✅ สร้างไฟล์ sample_test_cases.xlsx เรียบร้อยแล้ว!')
console.log(`📊 จำนวน test cases: ${sampleData.length}`)
console.log(`📁 กลุ่ม: ${[...new Set(sampleData.map(t => t.Category))].join(', ')}`)
