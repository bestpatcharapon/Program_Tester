# AutoTest Center 🚀

Enterprise-grade Automated Testing Dashboard with Evidence Gallery

![AutoTest Center](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Auto Evidence Capture** - Automatically captures and saves screenshots when tests fail
- **Environment Switcher** - Switch between Dev/UAT/Prod environments from the UI
- **One-Click Launcher** - Desktop app with frameless window and system tray
- **Multi-Framework Support** - Robot Framework, Playwright, and Pytest

### 🎨 Premium UI
- Modern glassmorphism design
- Dark theme with vibrant gradients
- Smooth animations and transitions
- Real-time test monitoring
- Interactive charts and statistics

### 📊 Dashboard
- Real-time test statistics
- Test results trend charts
- Framework distribution visualization
- Environment status indicators

### 🧪 Test Runner
- Framework selection (Robot/Playwright/Pytest)
- Live test execution monitoring
- Console output with color-coded logs
- Automatic screenshot capture on failure

### 🖼️ Evidence Gallery
- Auto-organized by date
- Filter by framework
- Modal image viewer
- Download and delete capabilities

### ⚙️ Settings
- Environment configuration (URLs, API keys)
- General test settings
- Framework path configuration
- Auto-save preferences

## 🏗️ Architecture

```
autotest-center/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/    # Sidebar, etc.
│   │   ├── pages/         # Dashboard, TestRunner, Gallery, Settings
│   │   └── index.css      # Design system
├── backend/           # FastAPI
│   ├── main.py           # API endpoints
│   └── requirements.txt
├── electron/          # Desktop app
│   ├── main.js           # Main process
│   └── preload.js        # Preload script
└── evidence/          # Auto-captured screenshots
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd autotest-center
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Running the Application

#### Option 1: Web App Only
```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start frontend
npm run dev
```

#### Option 2: Desktop App (Recommended)
```bash
# Start everything (backend + frontend + electron)
npm run start:all
```

#### Option 3: Development Mode
```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm run dev

# Terminal 3: Electron
npm run electron
```

## 📖 Usage

### 1. Environment Setup
1. Go to **Settings** page
2. Configure URLs and API keys for each environment (Dev/UAT/Prod)
3. Set framework paths
4. Click **Save Changes**

### 2. Running Tests
1. Go to **Test Runner** page
2. Select your framework (Robot/Playwright/Pytest)
3. Choose active environment from sidebar
4. Click **Run Tests**
5. Monitor real-time execution in console

### 3. Viewing Evidence
1. Go to **Evidence Gallery**
2. Browse screenshots organized by date
3. Filter by framework
4. Click any screenshot to view details
5. Download or delete as needed

### 4. Monitoring Dashboard
1. Go to **Dashboard** page
2. View real-time statistics
3. Analyze test trends
4. Check framework distribution

## 🔧 Configuration

### Environment Variables
Create `.env` file in backend directory:
```env
EVIDENCE_DIR=./evidence
API_HOST=0.0.0.0
API_PORT=8000
```

### Framework Integration

#### Robot Framework
```bash
robot --outputdir ./evidence --listener AutoTestListener ./tests/robot
```

#### Playwright
```javascript
// playwright.config.js
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

#### Pytest
```python
# conftest.py
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    # Capture screenshot on failure
    if call.when == "call" and call.excinfo is not None:
        capture_screenshot(item.name)
```

## 🎨 Design System

### Color Palette
- **Primary**: `#3b82f6` (Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Purple**: `#a855f7`
- **Cyan**: `#06b6d4`

### Typography
- **Sans**: Inter
- **Mono**: JetBrains Mono

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Framer Motion (animations)
- Recharts (charts)
- Lucide React (icons)
- date-fns (date formatting)

### Backend
- FastAPI
- Uvicorn
- Pydantic
- Pillow (image processing)

### Desktop
- Electron
- Frameless window
- System tray integration

## 📦 Building for Production

### Web App
```bash
npm run build
```

### Desktop App
```bash
# Install electron-builder
npm install -D electron-builder

# Build for current platform
npm run electron:build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own testing needs!

## 🙏 Acknowledgments

- Inspired by modern testing dashboards
- Built to solve real automation testing pain points
- Designed for enterprise-level test reporting

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for the testing community**

🚀 Happy Testing!
