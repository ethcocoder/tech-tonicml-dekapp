"""
Python API that is exposed to the JavaScript frontend.
All public methods in this class can be called from the webview.
"""

import os
import json
from pathlib import Path
import platform


class API:
    """
    Python API exposed to JavaScript through PyWebView.
    All public methods can be called from JavaScript using window.pywebview.api.method_name()
    """
    
    def __init__(self):
        """Initialize the API and set up application data directory"""
        self.app_data_dir = self._get_app_data_dir()
        self._ensure_data_dir()
        self.current_file_path = None
    
    def _get_app_data_dir(self):
        """Get application data directory based on OS"""
        if os.name == 'nt':  # Windows
            base = os.getenv('APPDATA')
        elif platform.system() == 'Darwin':  # macOS
            base = os.path.expanduser('~/Library/Application Support')
        else:  # Linux
            base = os.path.expanduser('~/.config')
        
        return Path(base) / 'TechTonicmlDeckapp'
    
    def _ensure_data_dir(self):
        """Create app data directory if it doesn't exist"""
        self.app_data_dir.mkdir(parents=True, exist_ok=True)
    
    # ==================== File Operations ====================
    
    def open_file_dialog(self):
        """
        Open file picker dialog.
        Returns: Selected file path or None if cancelled
        """
        try:
            import webview
            file_types = (
                'Text Files (*.txt;*.md)',
                'All Files (*.*)',
            )
            result = webview.windows[0].create_file_dialog(
                webview.OPEN_DIALOG,
                file_types=file_types
            )
            return result[0] if result else None
        except Exception as e:
            print(f"Error opening file dialog: {e}")
            return None
    
    def save_file_dialog(self, default_name='untitled.txt'):
        """
        Open save file dialog.
        Args:
            default_name: Default filename
        Returns: Selected file path or None if cancelled
        """
        try:
            import webview
            file_types = (
                'Text Files (*.txt;*.md)',
                'All Files (*.*)',
            )
            result = webview.windows[0].create_file_dialog(
                webview.SAVE_DIALOG,
                save_filename=default_name,
                file_types=file_types
            )
            return result if result else None
        except Exception as e:
            print(f"Error opening save dialog: {e}")
            return None
    
    def read_file(self, file_path):
        """
        Read file contents.
        Args:
            file_path: Path to file to read
        Returns: Dict with success status and data/error
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            self.current_file_path = file_path
            return {
                'success': True,
                'data': content,
                'filename': Path(file_path).name
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def write_file(self, file_path, content):
        """
        Write content to file.
        Args:
            file_path: Path to file to write
            content: Content to write
        Returns: Dict with success status and error if failed
        """
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            self.current_file_path = file_path
            return {
                'success': True,
                'filename': Path(file_path).name
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    # ==================== Settings Management ====================
    
    def save_settings(self, settings):
        """
        Save application settings to JSON file.
        Args:
            settings: Dict of settings to save
        Returns: Dict with success status
        """
        settings_file = self.app_data_dir / 'settings.json'
        try:
            with open(settings_file, 'w', encoding='utf-8') as f:
                json.dump(settings, f, indent=2)
            return {'success': True}
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def load_settings(self):
        """
        Load application settings from JSON file.
        Returns: Dict with success status and settings data
        """
        settings_file = self.app_data_dir / 'settings.json'
        try:
            if settings_file.exists():
                with open(settings_file, 'r', encoding='utf-8') as f:
                    settings = json.load(f)
                return {
                    'success': True,
                    'data': settings
                }
            else:
                # Return default settings
                default_settings = {
                    'theme': 'light',
                    'language': 'en',
                    'auto_save': False
                }
                return {
                    'success': True,
                    'data': default_settings
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    # ==================== System Operations ====================
    
    def get_system_info(self):
        """
        Get system information.
        Returns: Dict with system details
        """
        try:
            return {
                'success': True,
                'data': {
                    'platform': platform.system(),
                    'platform_version': platform.version(),
                    'python_version': platform.python_version(),
                    'machine': platform.machine(),
                    'processor': platform.processor(),
                    'app_data_dir': str(self.app_data_dir)
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def show_notification(self, title, message):
        """
        Show system notification (console-based for now).
        Args:
            title: Notification title
            message: Notification message
        Returns: Dict with success status
        """
        try:
            print(f"📢 Notification: {title} - {message}")
            return {'success': True}
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    # ==================== Application Data ====================
    
    def get_app_info(self):
        """
        Get application information.
        Returns: Dict with app metadata
        """
        from config import Config
        return {
            'name': Config.APP_NAME,
            'version': Config.APP_VERSION,
            'author': Config.APP_AUTHOR,
            'description': Config.APP_DESCRIPTION
        }
    
    def get_welcome_message(self):
        """
        Get welcome message for the home page.
        Returns: Welcome message string
        """
        from config import Config
        return {
            'message': f'Welcome to {Config.APP_NAME}!',
            'version': Config.APP_VERSION,
            'timestamp': Path.cwd().as_posix()
        }
    
    def process_text(self, text, operation='upper'):
        """
        Process text with various operations.
        Args:
            text: Text to process
            operation: Operation to perform (upper, lower, title, reverse)
        Returns: Processed text
        """
        try:
            operations = {
                'upper': lambda t: t.upper(),
                'lower': lambda t: t.lower(),
                'title': lambda t: t.title(),
                'reverse': lambda t: t[::-1],
                'count': lambda t: len(t)
            }
            
            if operation in operations:
                result = operations[operation](text)
                return {
                    'success': True,
                    'data': result,
                    'operation': operation
                }
            else:
                return {
                    'success': False,
                    'error': f'Unknown operation: {operation}'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
