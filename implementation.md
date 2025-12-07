# Implementation Guide - Python Webview Desktop App

## Table of Contents
1. [Project Setup](#project-setup)
2. [Architecture Overview](#architecture-overview)
3. [Core Implementation](#core-implementation)
4. [Python-JavaScript Bridge](#python-javascript-bridge)
5. [UI Development](#ui-development)
6. [Features Implementation](#features-implementation)
7. [Building & Packaging](#building--packaging)
8. [Best Practices](#best-practices)

---

## Project Setup

### Step 1: Initialize Project Structure

```
webview-app/
├── src/
│   ├── main.py              # Entry point
│   ├── api.py               # Python API exposed to JavaScript
│   ├── utils.py             # Utility functions
│   └── config.py            # Configuration
├── web/
│   ├── index.html           # Main HTML
│   ├── css/
│   │   └── style.css        # Styles
│   ├── js/
│   │   ├── app.js           # Main JavaScript
│   │   └── api.js           # API communication
│   └── assets/
│       ├── images/
│       └── icons/
├── resources/
│   └── icon.ico/.png        # Application icon
├── build/                   # Build output (gitignored)
├── venv/                    # Virtual environment (gitignored)
├── requirements.txt         # Python dependencies
├── build.spec              # PyInstaller spec file
└── README.md
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### Step 3: Install Dependencies

**requirements.txt:**
```txt
pywebview>=4.0
pyinstaller>=5.0
```

```bash
pip install -r requirements.txt
```

---

## Architecture Overview

### Application Flow

```
┌─────────────────────────────────────────────┐
│           User Interface (HTML/CSS/JS)       │
│                                             │
│  ┌─────────────┐  ┌──────────────────┐    │
│  │   UI Layer  │  │  JavaScript API   │    │
│  └─────────────┘  └──────────────────┘    │
└──────────────────────┬──────────────────────┘
                       │
            ┌──────────▼───────────┐
            │  PyWebView Bridge    │
            └──────────┬───────────┘
                       │
┌──────────────────────▼──────────────────────┐
│         Python Backend Layer                │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   API    │  │  Utils   │  │  Config  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  System Integration (File, OS, etc)  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Core Implementation

### 1. Main Entry Point (`src/main.py`)

```python
import webview
from api import API

def main():
    # Create API instance
    api = API()
    
    # Create webview window
    window = webview.create_window(
        title='My Desktop App',
        url='web/index.html',
        width=1200,
        height=800,
        resizable=True,
        fullscreen=False,
        min_size=(800, 600),
        background_color='#FFFFFF',
        js_api=api
    )
    
    # Start the application
    # Use 'edgechromium' for Windows, 'webkit' for macOS/Linux
    webview.start(debug=True)  # Set debug=False for production

if __name__ == '__main__':
    main()
```

### 2. Python API (`src/api.py`)

```python
import os
import json
from pathlib import Path

class API:
    """
    Python API exposed to JavaScript through PyWebView.
    All public methods can be called from JavaScript.
    """
    
    def __init__(self):
        self.app_data_dir = self._get_app_data_dir()
        self._ensure_data_dir()
    
    def _get_app_data_dir(self):
        """Get application data directory"""
        if os.name == 'nt':  # Windows
            base = os.getenv('APPDATA')
        else:  # macOS/Linux
            base = os.path.expanduser('~/.config')
        return Path(base) / 'MyDesktopApp'
    
    def _ensure_data_dir(self):
        """Create app data directory if it doesn't exist"""
        self.app_data_dir.mkdir(parents=True, exist_ok=True)
    
    # === File Operations ===
    
    def open_file_dialog(self):
        """Open file picker dialog"""
        import webview
        file_types = ('All Files (*.*)',)
        result = webview.windows[0].create_file_dialog(
            webview.OPEN_DIALOG,
            file_types=file_types
        )
        return result[0] if result else None
    
    def save_file_dialog(self, default_name='untitled.txt'):
        """Open save file dialog"""
        import webview
        result = webview.windows[0].create_file_dialog(
            webview.SAVE_DIALOG,
            save_filename=default_name
        )
        return result if result else None
    
    def read_file(self, file_path):
        """Read file contents"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return {'success': True, 'data': f.read()}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def write_file(self, file_path, content):
        """Write content to file"""
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    # === Settings Management ===
    
    def save_settings(self, settings):
        """Save application settings"""
        settings_file = self.app_data_dir / 'settings.json'
        try:
            with open(settings_file, 'w') as f:
                json.dump(settings, f, indent=2)
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def load_settings(self):
        """Load application settings"""
        settings_file = self.app_data_dir / 'settings.json'
        try:
            if settings_file.exists():
                with open(settings_file, 'r') as f:
                    return {'success': True, 'data': json.load(f)}
            else:
                # Return default settings
                return {'success': True, 'data': {
                    'theme': 'light',
                    'language': 'en'
                }}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    # === System Operations ===
    
    def get_system_info(self):
        """Get system information"""
        import platform
        return {
            'platform': platform.system(),
            'platform_version': platform.version(),
            'python_version': platform.python_version(),
            'machine': platform.machine()
        }
    
    def show_notification(self, title, message):
        """Show system notification (basic implementation)"""
        # For full notifications, consider using plyer or notify-py
        print(f"Notification: {title} - {message}")
        return {'success': True}
    
    # === Example Data Operations ===
    
    def get_data(self):
        """Example: Get some data"""
        return {
            'message': 'Hello from Python!',
            'timestamp': str(Path.cwd())
        }
    
    def process_data(self, input_data):
        """Example: Process data"""
        # Perform some Python processing
        result = input_data.upper() if isinstance(input_data, str) else input_data
        return {'processed': result}
```

### 3. Configuration (`src/config.py`)

```python
import os

class Config:
    # Application Info
    APP_NAME = 'My Desktop App'
    APP_VERSION = '1.0.0'
    APP_AUTHOR = 'Your Name'
    
    # Window Settings
    WINDOW_WIDTH = 1200
    WINDOW_HEIGHT = 800
    WINDOW_MIN_WIDTH = 800
    WINDOW_MIN_HEIGHT = 600
    
    # Debug Mode
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Paths
    WEB_DIR = 'web'
    RESOURCES_DIR = 'resources'
```

---

## Python-JavaScript Bridge

### JavaScript API Wrapper (`web/js/api.js`)

```javascript
/**
 * API wrapper for Python backend communication
 */
class PyAPI {
    /**
     * Call Python method
     * @param {string} method - Python method name
     * @param  {...any} args - Arguments to pass
     * @returns {Promise} - Promise resolving to Python return value
     */
    async call(method, ...args) {
        try {
            const result = await window.pywebview.api[method](...args);
            return result;
        } catch (error) {
            console.error(`Error calling ${method}:`, error);
            throw error;
        }
    }
    
    // File Operations
    async openFile() {
        return await this.call('open_file_dialog');
    }
    
    async saveFile(defaultName) {
        return await this.call('save_file_dialog', defaultName);
    }
    
    async readFile(filePath) {
        return await this.call('read_file', filePath);
    }
    
    async writeFile(filePath, content) {
        return await this.call('write_file', filePath, content);
    }
    
    // Settings
    async saveSettings(settings) {
        return await this.call('save_settings', settings);
    }
    
    async loadSettings() {
        return await this.call('load_settings');
    }
    
    // System
    async getSystemInfo() {
        return await this.call('get_system_info');
    }
    
    async showNotification(title, message) {
        return await this.call('show_notification', title, message);
    }
    
    // Data operations
    async getData() {
        return await this.call('get_data');
    }
    
    async processData(data) {
        return await this.call('process_data', data);
    }
}

// Create global API instance
const pyAPI = new PyAPI();
```

---

## UI Development

### HTML Structure (`web/index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Desktop App</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header -->
    <header class="app-header">
        <div class="header-left">
            <h1 class="app-title">My Desktop App</h1>
        </div>
        <div class="header-right">
            <button id="settingsBtn" class="icon-btn" title="Settings">
                ⚙️
            </button>
        </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
        <!-- Sidebar -->
        <aside class="sidebar">
            <nav class="nav-menu">
                <a href="#home" class="nav-item active" data-page="home">
                    🏠 Home
                </a>
                <a href="#editor" class="nav-item" data-page="editor">
                    📝 Editor
                </a>
                <a href="#about" class="nav-item" data-page="about">
                    ℹ️ About
                </a>
            </nav>
        </aside>

        <!-- Content Area -->
        <section class="content">
            <!-- Home Page -->
            <div id="home" class="page active">
                <h2>Welcome!</h2>
                <p>This is your Python-powered desktop application.</p>
                <button id="demoBtn" class="btn btn-primary">
                    Call Python API
                </button>
                <div id="result" class="result-box"></div>
            </div>

            <!-- Editor Page -->
            <div id="editor" class="page">
                <h2>Text Editor</h2>
                <div class="editor-toolbar">
                    <button id="openBtn" class="btn">📂 Open</button>
                    <button id="saveBtn" class="btn">💾 Save</button>
                </div>
                <textarea id="editor-content" class="editor-textarea" 
                          placeholder="Start typing..."></textarea>
            </div>

            <!-- About Page -->
            <div id="about" class="page">
                <h2>About</h2>
                <div id="systemInfo"></div>
            </div>
        </section>
    </main>

    <!-- Scripts -->
    <script src="js/api.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### Styling (`web/css/style.css`)

```css
/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --bg-color: #f8fafc;
    --surface-color: #ffffff;
    --text-color: #1e293b;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 'Helvetica Neue', Arial, sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    overflow: hidden;
}

/* Header */
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
}

.app-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
}

.icon-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.2s;
}

.icon-btn:hover {
    background: var(--bg-color);
}

/* Main Layout */
.app-main {
    display: flex;
    height: calc(100vh - 65px);
}

/* Sidebar */
.sidebar {
    width: 240px;
    background: var(--surface-color);
    border-right: 1px solid var(--border-color);
    padding: 1rem 0;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.nav-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: var(--text-color);
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
}

.nav-item:hover {
    background: var(--bg-color);
}

.nav-item.active {
    background: var(--primary-color);
    color: white;
}

/* Content */
.content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
}

.page {
    display: none;
}

.page.active {
    display: block;
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Buttons */
.btn {
    padding: 0.625rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
}

.btn:hover {
    background: var(--primary-hover);
}

.btn:active {
    transform: scale(0.98);
}

.btn-primary {
    background: var(--primary-color);
}

/* Editor */
.editor-toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.editor-textarea {
    width: 100%;
    height: 400px;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    resize: vertical;
}

/* Result Box */
.result-box {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    min-height: 60px;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-color);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
}
```

### Application Logic (`web/js/app.js`)

```javascript
// Wait for PyWebView to be ready
window.addEventListener('pywebviewready', function() {
    console.log('PyWebView is ready!');
    initApp();
});

// Initialize app
function initApp() {
    setupNavigation();
    setupDemoButton();
    setupEditor();
    loadSystemInfo();
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.dataset.page;
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(pageName).classList.add('active');
        });
    });
}

// Demo Button
function setupDemoButton() {
    const demoBtn = document.getElementById('demoBtn');
    const resultBox = document.getElementById('result');
    
    demoBtn.addEventListener('click', async () => {
        try {
            const data = await pyAPI.getData();
            resultBox.innerHTML = `
                <strong>Response from Python:</strong><br>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        } catch (error) {
            resultBox.innerHTML = `<span style="color: red;">Error: ${error}</span>`;
        }
    });
}

// Editor
function setupEditor() {
    const openBtn = document.getElementById('openBtn');
    const saveBtn = document.getElementById('saveBtn');
    const textarea = document.getElementById('editor-content');
    let currentFilePath = null;
    
    openBtn.addEventListener('click', async () => {
        const filePath = await pyAPI.openFile();
        if (filePath) {
            const result = await pyAPI.readFile(filePath);
            if (result.success) {
                textarea.value = result.data;
                currentFilePath = filePath;
            } else {
                alert('Error reading file: ' + result.error);
            }
        }
    });
    
    saveBtn.addEventListener('click', async () => {
        const content = textarea.value;
        let filePath = currentFilePath;
        
        if (!filePath) {
            filePath = await pyAPI.saveFile('untitled.txt');
        }
        
        if (filePath) {
            const result = await pyAPI.writeFile(filePath, content);
            if (result.success) {
                currentFilePath = filePath;
                alert('File saved successfully!');
            } else {
                alert('Error saving file: ' + result.error);
            }
        }
    });
}

// Load System Info
async function loadSystemInfo() {
    try {
        const info = await pyAPI.getSystemInfo();
        const infoDiv = document.getElementById('systemInfo');
        infoDiv.innerHTML = `
            <h3>System Information</h3>
            <ul>
                <li><strong>Platform:</strong> ${info.platform}</li>
                <li><strong>Version:</strong> ${info.platform_version}</li>
                <li><strong>Python:</strong> ${info.python_version}</li>
                <li><strong>Machine:</strong> ${info.machine}</li>
            </ul>
        `;
    } catch (error) {
        console.error('Error loading system info:', error);
    }
}
```

---

## Building & Packaging

### PyInstaller Spec File (`build.spec`)

```python
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('web', 'web'),
        ('resources', 'resources'),
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='MyDesktopApp',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # Set to False to hide console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='resources/icon.ico'  # Windows icon
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='MyDesktopApp',
)
```

### Build Commands

```bash
# Build with PyInstaller using spec file
pyinstaller build.spec

# Or build directly (one file)
pyinstaller --onefile --windowed --icon=resources/icon.ico src/main.py

# Or build directory bundle
pyinstaller --onedir --windowed --add-data "web:web" --add-data "resources:resources" --icon=resources/icon.ico src/main.py
```

---

## Best Practices

### 1. Error Handling
```python
# Always wrap Python API methods with try-except
def safe_operation(self, data):
    try:
        # Your code here
        result = process(data)
        return {'success': True, 'data': result}
    except Exception as e:
        return {'success': False, 'error': str(e)}
```

### 2. Security
- Never trust user input - always validate
- Sanitize file paths to prevent directory traversal
- Use parameterized queries for databases
- Don't expose sensitive data to JavaScript

### 3. Performance
- Lazy load heavy resources
- Use async operations in JavaScript
- Optimize Python imports
- Cache frequently accessed data

### 4. Cross-Platform Compatibility
```python
import os
from pathlib import Path

# Use Path for cross-platform paths
config_dir = Path.home() / '.myapp'

# Check OS
if os.name == 'nt':  # Windows
    # Windows-specific code
    pass
else:  # macOS/Linux
    # Unix-specific code
    pass
```

### 5. Development Workflow
- Use `debug=True` in development
- Test on all target platforms regularly
- Use version control (Git)
- Write tests for critical functions
- Document your API methods

---

## Testing

```bash
# Run the application in debug mode
python src/main.py

# Build and test
pyinstaller build.spec
./dist/MyDesktopApp/MyDesktopApp.exe  # Windows
```

---

## Troubleshooting

### Common Issues

1. **"Module not found" after building**
   - Add to `hiddenimports` in spec file

2. **Files not found in built app**
   - Add to `datas` in spec file
   - Use resource_path helper function

3. **Large executable size**
   - Use `--onedir` instead of `--onefile`
   - Exclude unnecessary packages
   - Consider using Nuitka

4. **Slow startup**
   - Optimize imports (use lazy imports)
   - Reduce number of bundled files

---

## Next Steps

1. Set up the project structure
2. Install dependencies
3. Create basic window with PyWebView
4. Build and test the executable
5. Add your specific features
6. Create installers for distribution

Good luck with your Python webview desktop app! 🚀
