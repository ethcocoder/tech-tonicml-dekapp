"""
Configuration file for the application.
Contains application settings, constants, and configuration parameters.
"""

import os

class Config:
    """Application configuration class"""
    
    # Application Information
    APP_NAME = 'Tech-Tonicml Platform'
    APP_VERSION = '1.0.0'
    APP_AUTHOR = 'Natnael Ermiyas - Ethco Coders'
    APP_DESCRIPTION = 'Desktop app for Tech-Tonicml ML Course Platform'
    
    # Website URL
    WEBSITE_URL = 'https://tech-tonicml.gt.tc'
    
    # Window Settings
    WINDOW_WIDTH = 1400
    WINDOW_HEIGHT = 900
    WINDOW_MIN_WIDTH = 1024
    WINDOW_MIN_HEIGHT = 768
    WINDOW_RESIZABLE = True
    WINDOW_FULLSCREEN = False
    WINDOW_BACKGROUND_COLOR = '#FFFFFF'
    
    # Splash Screen
    SPLASH_DURATION = 3000  # milliseconds

    
    # Debug Mode
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Paths
    WEB_DIR = 'web'
    RESOURCES_DIR = 'resources'
    ICON_PATH = 'web/assets/icons/techtonicml.png'
    
    # UI Settings
    DEFAULT_THEME = 'light'
    DEFAULT_LANGUAGE = 'en'
