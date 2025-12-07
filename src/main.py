"""
Main entry point for the Tech-Tonicml Platform Desktop App.
Desktop wrapper for the Tech-Tonicml ML Course Platform.
Shows splash screen, then loads tech-tonicml.gt.tc website.
"""

import webview
import sys
from pathlib import Path

# Add src directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from config import Config


def get_splash_path():
    """Get the path to the splash screen HTML file"""
    if getattr(sys, 'frozen', False):
        # Running as compiled executable
        base_path = Path(sys._MEIPASS)
    else:
        # Running as script
        base_path = Path(__file__).parent.parent
    
    splash_path = base_path / Config.WEB_DIR / 'splash.html'
    return str(splash_path)


def main():
    """Main function to start the application"""
    
    print(f"Starting {Config.APP_NAME} v{Config.APP_VERSION}")
    print(f"By: {Config.APP_AUTHOR}")
    print(f"Splash screen duration: {Config.SPLASH_DURATION}ms")
    print(f"Website URL: {Config.WEBSITE_URL}")
    print(f"Debug mode: {Config.DEBUG}")
    
    # Get splash screen path
    splash_file = get_splash_path()
    
    # Create the main window with splash screen
    # The splash screen will auto-redirect to the website
    window = webview.create_window(
        title=Config.APP_NAME,
        url=splash_file,
        width=Config.WINDOW_WIDTH,
        height=Config.WINDOW_HEIGHT,
        resizable=Config.WINDOW_RESIZABLE,
        fullscreen=Config.WINDOW_FULLSCREEN,
        min_size=(Config.WINDOW_MIN_WIDTH, Config.WINDOW_MIN_HEIGHT),
        background_color=Config.WINDOW_BACKGROUND_COLOR
    )
    
    # Start the application
    # debug=True enables dev tools in the webview
    webview.start(debug=Config.DEBUG, gui='edgechromium' if sys.platform == 'win32' else None)


if __name__ == '__main__':
    main()

