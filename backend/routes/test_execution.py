from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import time
import os

router = APIRouter()

class TestRequest(BaseModel):
    testName: str
    tags: List[str] = []
    priority: str = "medium"
    description: Optional[str] = None

class TestResult(BaseModel):
    status: str
    message: str
    duration: float
    screenshots: List[str] = []
    reportUrl: Optional[str] = None

# Playwright Test Endpoint
@router.post("/api/playwright/run", response_model=TestResult)
async def run_playwright_test(request: TestRequest):
    """
    รัน Playwright test
    """
    start_time = time.time()
    
    try:
        # สร้าง command สำหรับรัน Playwright
        # ตัวอย่าง: npx playwright test --grep "test-name"
        cmd = [
            "npx", "playwright", "test",
            "--grep", request.testName
        ]
        
        # เพิ่ม tags ถ้ามี
        if request.tags:
            tags_filter = "|".join(request.tags)
            cmd.extend(["--grep", f"@({tags_filter})"])
        
        # รัน command
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )
        
        duration = time.time() - start_time
        
        # ตรวจสอบผลลัพธ์
        if result.returncode == 0:
            return TestResult(
                status="passed",
                message=f"Test '{request.testName}' passed successfully",
                duration=duration,
                screenshots=[]  # TODO: รวบรวม screenshots
            )
        else:
            return TestResult(
                status="failed",
                message=f"Test failed: {result.stderr}",
                duration=duration,
                screenshots=[]
            )
            
    except subprocess.TimeoutExpired:
        return TestResult(
            status="failed",
            message="Test execution timeout (5 minutes)",
            duration=300,
            screenshots=[]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pytest Test Endpoint
@router.post("/api/pytest/run", response_model=TestResult)
async def run_pytest_test(request: TestRequest):
    """
    รัน Pytest test
    """
    start_time = time.time()
    
    try:
        # สร้าง command สำหรับรัน Pytest
        # ตัวอย่าง: pytest -k "test_name" -v
        cmd = [
            "pytest",
            "-k", request.testName,
            "-v",
            "--tb=short"
        ]
        
        # เพิ่ม markers ถ้ามี tags
        if request.tags:
            markers = " or ".join(request.tags)
            cmd.extend(["-m", markers])
        
        # รัน command
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        duration = time.time() - start_time
        
        if result.returncode == 0:
            return TestResult(
                status="passed",
                message=f"Test '{request.testName}' passed",
                duration=duration
            )
        else:
            return TestResult(
                status="failed",
                message=f"Test failed:\n{result.stdout}",
                duration=duration
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Robot Framework Test Endpoint
@router.post("/api/robot/run", response_model=TestResult)
async def run_robot_test(request: TestRequest):
    """
    รัน Robot Framework test
    """
    start_time = time.time()
    
    try:
        # สร้าง command สำหรับรัน Robot Framework
        # ตัวอย่าง: robot --test "Test Name" tests/
        cmd = [
            "robot",
            "--test", request.testName,
            "--outputdir", "results/robot",
            "tests/"
        ]
        
        # เพิ่ม tags ถ้ามี
        if request.tags:
            for tag in request.tags:
                cmd.extend(["--include", tag])
        
        # รัน command
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        duration = time.time() - start_time
        
        # Robot Framework return code: 0 = all pass, 1-249 = some failed
        if result.returncode == 0:
            return TestResult(
                status="passed",
                message=f"Test '{request.testName}' passed",
                duration=duration,
                screenshots=[],
                reportUrl="/results/robot/report.html"
            )
        else:
            return TestResult(
                status="failed",
                message=f"Test failed with return code {result.returncode}",
                duration=duration,
                screenshots=[],
                reportUrl="/results/robot/report.html"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Batch Test Execution
@router.post("/api/tests/batch")
async def run_batch_tests(tests: List[TestRequest]):
    """
    รัน test หลายตัวพร้อมกัน
    """
    results = []
    
    for test in tests:
        # เลือก endpoint ตาม framework
        # (ในความเป็นจริงควรใช้ async/await และรันแบบ parallel)
        result = None
        
        # TODO: Implement batch execution
        results.append(result)
    
    return {
        "total": len(tests),
        "completed": len(results),
        "results": results
    }
