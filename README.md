# Tech-Tonicml Platform - Desktop Application

**Professional Windows Desktop Wrapper for the Tech-Tonicml ML Course Platform**

🌐 **Website:** [tech-tonicml.gt.tc](https://tech-tonicml.gt.tc)  
👨‍💻 **Developer:** Natnael Ermiyas  
🏢 **Company:** Ethco Coders  
📦 **Version:** 1.0.0

---

## 📖 About

Tech-Tonicml Platform Desktop App is a professional Windows application that provides a native desktop experience for accessing the Tech-Tonicml ML Course Platform. Built with Python and PyWebView, it wraps the web platform in a standalone desktop application.

### ✨ Key Features

- 🎓 **Native Desktop Experience** - Run the platform as a Windows application
- 🎨 **Professional Branding** - Custom splash screen and application icon
- 📦 **Easy Installation** - Professional installer with progress tracking
- 🖥️ **No Browser Required** - Standalone application window
- 🚀 **Fast Launch** - Quick access to your ML courses
- 💾 **Offline Installer** - No internet required for installation

---

## 🎬 Installation Experience

### For End Users

1. **Download** `TechTonicmlPlatform-Setup-v1.0.0.exe`
2. **Run** the installer
3. **Follow** the installation wizard:
   - Welcome screen
   - Accept license agreement
   - Choose installation location
   - Select desktop icon (optional)
   - Watch progress bar (0-100%)
   - Click Finish
4. **Launch** from desktop icon or Start menu

### What Users See

**Splash Screen (3 seconds):**
- Tech-Tonicml logo with smooth pulse animation
- "Welcome to Tech-Tonic ML Platform" message
- "Powered by Natnael Ermiyas - Ethco Coders"

**Main Application:**
- Native 1400x900 window (resizable)
- Full access to tech-tonicml.gt.tc
- Browse courses, watch lectures, take quizzes
- Normal window controls (minimize, maximize, close)

---

## 💻 Technology Stack

### Backend
- **Python 3.8+** - Core language
- **PyWebView 6.1** - Native webview framework
- **Pythonnet** - Windows integration

### Frontend
- **HTML5/CSS3/JavaScript** - Splash screen
- **Edge Chromium** - Rendering engine (Windows)

### Build & Distribution
- **PyInstaller 6.17** - Executable packaging
- **Inno Setup** - Professional Windows installer
- **Pillow 12.0** - Icon conversion

---

## 🛠️ For Developers

### Prerequisites

- Python 3.8 or higher
- Windows 10/11 (64-bit)
- Inno Setup (for building installer)

### Project Setup

```bash
# Clone repository
git clone https://github.com/ethcocoder/tech-tonicml-dekapp.git
cd tech-tonicml-dekapp

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running in Development

```bash
# Method 1: Using Python
python src/main.py

# Method 2: Using batch file
run_app.bat

# Enable debug mode (shows dev tools)
set DEBUG=true
python src/main.py
```

### Building the Executable

```bash
# Build with PyInstaller
.\venv\Scripts\pyinstaller.exe --clean TechTonicmlPlatform.spec

# Output location
dist\TechTonicmlPlatform\TechTonicmlPlatform.exe
```

### Creating the Installer

1. **Download Inno Setup**: https://jrsoftware.org/isdl.php

2. **Build installer (GUI method)**:
   - Open Inno Setup Compiler
   - File → Open → `installer.iss`
   - Build → Compile

3. **Build installer (CLI method)**:
   ```bash
   "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
   ```

4. **Output**: `installer/TechTonicmlPlatform-Setup-v1.0.0.exe`

---

## 📁 Project Structure

```
tech-tonicml-dekapp/
├── src/
│   ├── main.py                    # Application entry point
│   ├── api.py                     # Python API (for future features)
│   └── config.py                  # Configuration settings
├── web/
│   ├── splash.html                # Splash screen
│   ├── index.html                 # Local UI (future use)
│   ├── css/style.css              # Styling
│   ├── js/
│   │   ├── api.js                 # JS-Python bridge
│   │   └── app.js                 # Application logic
│   └── assets/
│       └── icons/
│           ├── techtonicml.png    # Original logo
│           └── techtonicml.ico    # Windows icon
├── dist/
│   └── TechTonicmlPlatform/       # Built executable
│       ├── TechTonicmlPlatform.exe
│       └── _internal/             # Dependencies
├── installer/                      # Installer output
│   └── TechTonicmlPlatform-Setup-v1.0.0.exe
├── TechTonicmlPlatform.spec       # PyInstaller config
├── installer.iss                  # Inno Setup config
├── LICENSE.txt                    # EULA
├── requirements.txt               # Python dependencies
├── run_app.bat                    # Quick launcher
└── README.md                      # This file
```

---

## 🎨 Customization

### Splash Screen

Edit `web/splash.html` to customize:
- Welcome message
- Colors and gradients
- Animation duration
- Branding text

### Application Icon

Replace `web/assets/icons/techtonicml.png` and run:
```bash
python convert_icon.py
```

### Website URL

Update in `src/config.py`:
```python
WEBSITE_URL = 'https://your-website.com'
```

### Window Size

Modify in `src/config.py`:
```python
WINDOW_WIDTH = 1400
WINDOW_HEIGHT = 900
```

---

## 📋 Distribution Checklist

- [x] Application tested and working
- [x] Executable built with custom icon
- [x] Professional installer created
- [x] License agreement included
- [x] Desktop shortcut configured
- [x] Start menu integration
- [x] Uninstaller included
- [ ] Code signing certificate (optional)
- [ ] Upload to distribution platform

---

## 📦 System Requirements

### For End Users
- **OS**: Windows 10 or Windows 11 (64-bit)
- **RAM**: 4 GB minimum
- **Disk Space**: 150 MB
- **Internet**: Required for accessing platform

### For Developers
- **Python**: 3.8 or higher
- **Disk Space**: 500 MB (including dev tools)
- **Inno Setup**: Latest version

---

## 📚 Documentation

- **[todo.md](todo.md)** - Development task checklist
- **[roadmap.md](roadmap.md)** - Project timeline and milestones
- **[implementation.md](implementation.md)** - Technical implementation guide
- **[progress.md](progress.md)** - Detailed development log (1,680+ lines)
- **[INSTALLER_README.md](INSTALLER_README.md)** - Installer build guide

---

## 🔧 Troubleshooting

### Application won't start
- Ensure Windows Defender isn't blocking it
- Run as administrator (if needed)
- Check `dist/TechTonicmlPlatform/_internal/` folder exists

### Icon not showing
- Rebuild with: `pyinstaller --clean TechTonicmlPlatform.spec`
- Verify `techtonicml.ico` exists in web/assets/icons/

### Build errors
- Ensure all dependencies installed: `pip install -r requirements.txt`
- Try clean build: `pyinstaller --clean TechTonicmlPlatform.spec`

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

Copyright (c) 2025 Natnael Ermiyas - Ethco Coders  
See [LICENSE.txt](LICENSE.txt) for full EULA

---

## 🔗 Links

- **Website**: [tech-tonicml.gt.tc](https://tech-tonicml.gt.tc)
- **Repository**: [github.com/ethcocoder/tech-tonicml-dekapp](https://github.com/ethcocoder/tech-tonicml-dekapp)
- **PyWebView**: [pywebview.flowrl.com](https://pywebview.flowrl.com)
- **Inno Setup**: [jrsoftware.org](https://jrsoftware.org)

---

## 📞 Support

For questions, issues, or support:
- Visit: [tech-tonicml.gt.tc](https://tech-tonicml.gt.tc)
- Email: Contact through website
- Issues: GitHub Issues page

---

## 🎯 Version History

### v1.0.0 (2025-12-07)
- ✅ Initial release
- ✅ Professional installer with EULA
- ✅ Custom splash screen with branding
- ✅ Desktop icon integration
- ✅ Progress bar during installation
- ✅ Start menu integration
- ✅ Uninstaller included

---

**Built with ❤️ by Natnael Ermiyas - Ethco Coders**

*Empowering machine learning education through technology*
