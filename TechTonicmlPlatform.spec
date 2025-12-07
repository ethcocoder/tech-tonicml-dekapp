# -*- mode: python ; coding: utf-8 -*-

"""
PyInstaller spec file for Tech-Tonicml Platform Desktop App
Builds a standalone executable with all dependencies
"""

block_cipher = None

# Collect all web assets
web_datas = [
    ('web/splash.html', 'web'),
    ('web/index.html', 'web'),
    ('web/css', 'web/css'),
    ('web/js', 'web/js'),
    ('web/assets', 'web/assets'),
]

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=[],
    datas=web_datas,
    hiddenimports=[
        'pythonnet',
        'clr_loader',
        'bottle',
    ],
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
    name='TechTonicmlPlatform',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # No console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)


coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='TechTonicmlPlatform',
)
