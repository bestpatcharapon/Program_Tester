from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import subprocess
import json
from pathlib import Path

app = FastAPI(title="Besttest API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evidence directory
EVIDENCE_DIR = Path("./evidence")
EVIDENCE_DIR.mkdir(exist_ok=True)

# Mount evidence directory
app.mount("/evidence", StaticFiles(directory=str(EVIDENCE_DIR)), name="evidence")

# Models
class TestConfig(BaseModel):
    framework: str
    environment: str
    test_path: Optional[str] = None

class TestResult(BaseModel):
    id: int
    name: str
    status: str
    duration: float
    screenshot: Optional[str] = None
    timestamp: datetime

class EnvironmentConfig(BaseModel):
    url: str
    api_key: str

# In-memory storage (replace with database in production)
test_results = []
running_tests = {}

@app.get("/")
async def root():
    return {
        "name": "Besttest API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/tests/run")
async def run_tests(config: TestConfig, background_tasks: BackgroundTasks):
    """
    Run tests based on framework and environment
    """
    test_id = len(running_tests) + 1
    
    running_tests[test_id] = {
        "status": "running",
        "framework": config.framework,
        "environment": config.environment,
        "started_at": datetime.now().isoformat()
    }
    
    # Simulate test execution in background
    background_tasks.add_task(execute_tests, test_id, config)
    
    return {
        "test_id": test_id,
        "status": "started",
        "message": f"Running {config.framework} tests on {config.environment}"
    }

async def execute_tests(test_id: int, config: TestConfig):
    """
    Execute tests based on framework
    """
    try:
        if config.framework == "robot":
            # Example: robot --outputdir ./evidence ./tests/robot
            cmd = f"robot --outputdir {EVIDENCE_DIR} {config.test_path or './tests/robot'}"
        elif config.framework == "playwright":
            # Example: npx playwright test
            cmd = f"npx playwright test {config.test_path or ''}"
        elif config.framework == "pytest":
            # Example: pytest --screenshot=on-failure
            cmd = f"pytest {config.test_path or './tests/pytest'}"
        else:
            raise ValueError(f"Unsupported framework: {config.framework}")
        
        # Execute command (commented out for demo)
        # result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        # Update test status
        running_tests[test_id]["status"] = "completed"
        running_tests[test_id]["completed_at"] = datetime.now().isoformat()
        
    except Exception as e:
        running_tests[test_id]["status"] = "failed"
        running_tests[test_id]["error"] = str(e)

@app.get("/api/tests/{test_id}/status")
async def get_test_status(test_id: int):
    """
    Get status of running test
    """
    if test_id not in running_tests:
        raise HTTPException(status_code=404, detail="Test not found")
    
    return running_tests[test_id]

@app.get("/api/evidence")
async def list_evidence():
    """
    List all evidence files
    """
    evidence_files = []
    
    for file_path in EVIDENCE_DIR.rglob("*.png"):
        stat = file_path.stat()
        evidence_files.append({
            "filename": file_path.name,
            "path": str(file_path.relative_to(EVIDENCE_DIR)),
            "size": stat.st_size,
            "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat()
        })
    
    return {
        "count": len(evidence_files),
        "files": evidence_files
    }

@app.delete("/api/evidence/{filename}")
async def delete_evidence(filename: str):
    """
    Delete evidence file
    """
    file_path = EVIDENCE_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        file_path.unlink()
        return {"message": f"Deleted {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_stats():
    """
    Get test statistics
    """
    # Mock data for demo
    return {
        "total": 175,
        "passed": 142,
        "failed": 18,
        "running": 15,
        "success_rate": 88.75
    }

@app.post("/api/config/environment")
async def save_environment_config(env: str, config: EnvironmentConfig):
    """
    Save environment configuration
    """
    config_file = Path("./config") / f"{env}.json"
    config_file.parent.mkdir(exist_ok=True)
    
    with open(config_file, "w") as f:
        json.dump(config.dict(), f, indent=2)
    
    return {
        "message": f"Saved configuration for {env}",
        "config": config.dict()
    }

@app.get("/api/config/environment/{env}")
async def get_environment_config(env: str):
    """
    Get environment configuration
    """
    config_file = Path("./config") / f"{env}.json"
    
    if not config_file.exists():
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    with open(config_file, "r") as f:
        config = json.load(f)
    
    return config

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
