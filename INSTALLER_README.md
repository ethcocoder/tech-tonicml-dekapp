# Building the Installer

This project uses Inno Setup to create a professional Windows installer.

## Prerequisites

1. Download and install Inno Setup from: https://jrsoftware.org/isdl.php
2. Make sure the executable is built (run `.\venv\Scripts\pyinstaller.exe --clean TechTonicmlPlatform.spec`)

## Building the Installer

1. Open Inno Setup Compiler
2. Click "File" → "Open" → Select `installer.iss`
3. Click "Build" → "Compile"
4. The installer will be created in the `installer/` folder

Or use command line:
```
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
```

## The installer will include:

- ✅ Welcome screen
- ✅ License agreement (EULA)
- ✅ Installation progress bar (0-100%)  
- ✅ Desktop shortcut with custom icon
- ✅ Start menu entry
- ✅ Option to launch app after installation

Output: `installer/TechTonicmlPlatform-Setup-v1.0.0.exe`
