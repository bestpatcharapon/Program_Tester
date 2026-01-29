# 🚀 AutoTest Center - Test Cases Management

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. **Test Cases Import System** 
- ✅ อ่านไฟล์ Excel (.xlsx) ด้วย library `xlsx`
- ✅ ตรวจสอบหัวข้อ (columns) อัตโนมัติ
- ✅ รองรับชื่อ column หลายรูปแบบ
- ✅ แสดง Preview ก่อน import
- ✅ จัดกลุ่มตาม Category/Module/Feature อัตโนมัติ

### 2. **UI Features**
- ✅ Grouped view แบบพับ/ขยายได้
- ✅ แสดงสถิติแต่ละกลุ่ม (Passed/Failed)
- ✅ Search และ Filter ตาม Framework
- ✅ Download Template Excel
- ✅ Performance Optimization (ลบ backdrop-filter)

### 3. **Backend API Structure**
- ✅ สร้าง Test Execution Service (Frontend)
- ✅ สร้าง API Endpoints (Backend)
  - `/api/playwright/run` - รัน Playwright tests
  - `/api/pytest/run` - รัน Pytest tests
  - `/api/robot/run` - รัน Robot Framework tests

---

## 🎯 ขั้นตอนต่อไป

### **Phase 1: เชื่อมต่อ Backend (ต้องทำ)**

1. **ติดตั้ง Backend Dependencies**
   ```bash
   cd backend
   pip install fastapi uvicorn python-multipart
   ```

2. **สร้าง FastAPI Server**
   ```python
   # backend/main.py
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from routes import test_execution
   
   app = FastAPI()
   
   # CORS
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   # Routes
   app.include_router(test_execution.router)
   
   if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=8000)
   ```

3. **รัน Backend Server**
   ```bash
   cd backend
   python main.py
   ```

4. **อัพเดท Frontend API Config**
   ```javascript
   // src/services/api.js
   const API_BASE_URL = 'http://localhost:8000'
   ```

### **Phase 2: ทดสอบการรัน Test**

1. **คลิกปุ่ม "Run Test" (▶️)** ในแต่ละ test case
2. **ดู Console Log** เพื่อตรวจสอบ API call
3. **ตรวจสอบผลลัพธ์** ว่า status เปลี่ยนเป็น passed/failed

### **Phase 3: เพิ่มฟีเจอร์ขั้นสูง**

1. **Run All Tests in Group**
   - เพิ่มปุ่ม "Run All" ในแต่ละกลุ่ม
   - รัน tests แบบ parallel

2. **Real-time Progress**
   - แสดง progress bar
   - แสดงจำนวน tests ที่รันเสร็จ

3. **Test Report Generation**
   - สร้าง HTML report
   - Export ผลลัพธ์เป็น Excel

4. **Evidence Gallery Integration**
   - เก็บ screenshots จาก test ที่ failed
   - แสดงใน Evidence Gallery

---

## 📋 Template Excel Format

| Column Name | Description | Example |
|-------------|-------------|---------|
| **Test Name** | ชื่อ test case | `Login with valid credentials` |
| **Category** | กลุ่ม/Module | `Authentication`, `User Management` |
| **Framework** | Framework ที่ใช้ | `playwright`, `pytest`, `robot` |
| **Priority** | ความสำคัญ | `high`, `medium`, `low` |
| **Tags** | Tags (คั่นด้วย comma) | `smoke,login,critical` |
| **Description** | รายละเอียด | `Test user login with correct credentials` |

### Alternative Column Names (รองรับ):
- **Test Name**: `TestName`, `Name`, `Test Case`
- **Category**: `Module`, `Feature`
- **Framework**: `Type`
- **Description**: `Details`

---

## 🔧 การใช้งาน

### 1. Import Test Cases
```
1. คลิก "Download Template" → ได้ไฟล์ .xlsx
2. กรอกข้อมูล test cases ใน Excel
3. คลิก "Import Excel" → เลือกไฟล์
4. ระบบจะแสดง Preview และ import อัตโนมัติ
```

### 2. จัดการ Test Cases
```
- ค้นหา: พิมพ์ชื่อ test ในช่อง Search
- กรอง: เลือก Framework (Playwright/Pytest/Robot)
- พับ/ขยาย: คลิกที่หัวข้อกลุ่ม
- รัน: คลิกปุ่ม ▶️ ข้าง test
- ลบ: คลิกปุ่ม 🗑️
```

### 3. ดูสถิติ
```
- Passed: จำนวน tests ที่ผ่าน
- Failed: จำนวน tests ที่ fail
- Pending: จำนวน tests ที่ยังไม่ได้รัน
- Total: จำนวน tests ทั้งหมด
```

---

## 🎨 Files Created

```
Project_tester/
├── src/
│   ├── pages/
│   │   ├── TestCases.jsx          ✅ หน้า Test Cases Management
│   │   └── TestCases.css          ✅ Styles
│   └── services/
│       └── testExecutionService.js ✅ Test Execution Service
├── backend/
│   └── routes/
│       └── test_execution.py      ✅ API Endpoints
└── test_cases_template.csv        ✅ CSV Template (legacy)
```

---

## 🚨 Next Steps (สำคัญ!)

1. **เริ่ม Backend Server**
   ```bash
   cd backend
   python main.py
   ```

2. **ทดสอบ Import Excel**
   - ดาวน์โหลด template
   - กรอกข้อมูล
   - Import

3. **ทดสอบ Run Test**
   - คลิก Run button
   - ดูผลลัพธ์

4. **ต่อยอด**
   - เพิ่ม Run All Tests
   - เพิ่ม Progress Bar
   - สร้าง Report

---

## 💡 Tips

- **Performance**: ระบบได้ optimize แล้วโดยลบ backdrop-filter ออก
- **Excel Format**: รองรับหลายรูปแบบชื่อ column
- **Grouping**: จัดกลุ่มอัตโนมัติตาม Category
- **Real-time**: Status อัพเดทแบบ real-time

---

**สร้างโดย**: AutoTest Center Team  
**วันที่**: 2026-01-27  
**Version**: 1.0.0
