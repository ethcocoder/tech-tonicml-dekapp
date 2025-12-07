# Tech-Tonicml Platform - Desktop App

Desktop application wrapper for the Tech-Tonicml ML Course Platform. Provides a native desktop experience for accessing the machine learning course platform.

🌐 **Website:** [tech-tonicml.gt.tc](https://tech-tonicml.gt.tc)  
👨‍💻 **Developer:** Natnael Ermiyas  
🏢 **Company:** Ethco Coders  
📦 **Version:** 1.0.0

## About

This desktop application wraps the Tech-Tonicml ML Course Platform (tech-tonicml.gt.tc) in a native desktop window. Features include:

- ✨ **Beautiful Splash Screen**: Shows branding and welcome message on startup
- 🖥️ **Native Desktop Experience**: Run the platform as a standalone desktop app
- 🌐 **Full Web Platform Access**: Complete access to all platform features

## Technology Stack

- **Backend**: Python 3.8+
- **GUI Framework**: PyWebView
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: PyInstaller

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ethcocoder/tech-tonicml-dekapp.git
   cd tech-tonicml-dekapp
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   
   Windows:
   ```bash
   venv\Scripts\activate
   ```
   
   macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Development Mode

```bash
python src/main.py
```

For debug mode with developer tools:
```bash
set DEBUG=true
python src/main.py
```

### Building Executable

1. **Install PyInstaller** (if not already installed)
   ```bash
   pip install pyinstaller
   ```

2. **Build the application**
   ```bash
   pyinstaller --onedir --windowed --add-data "web;web" --add-data "resources;resources" --name "TechTonicmlDeckapp" src/main.py
   ```

3. **Find the executable**
   - The built application will be in `dist/TechTonicmlDeckapp/`

## Project Structure

```
tech-tonicml-dekapp/
├── src/
│   ├── main.py           # Application entry point
│   ├── api.py            # Python API for JavaScript
│   └── config.py         # Configuration settings
├── web/
│   ├── index.html        # Main HTML file
│   ├── css/
│   │   └── style.css     # Styles
│   └── js/
│       ├── api.js        # JS API wrapper
│       └── app.js        # Application logic
├── resources/            # Application resources (icons, etc.)
├── requirements.txt      # Python dependencies
├── todo.md              # Project tasks
├── roadmap.md           # Development roadmap
├── implementation.md    # Technical implementation guide
└── progress.md          # Development progress log
```

## Usage

When you launch the application:

1. **Splash Screen** appears for 3 seconds showing:
   - "Welcome to Tech-Tonic ML Platform" message
   - "Powered by Natnael Ermiyas - Ethco Coders" branding

2. **Platform Loads** automatically after splash screen
   - Full access to tech-tonicml.gt.tc
   - Browse courses, learn machine learning
   - Access all platform features in a native desktop window


## Development

See [implementation.md](implementation.md) for detailed technical documentation.

See [roadmap.md](roadmap.md) for development timeline and milestones.

See [todo.md](todo.md) for task checklist.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

© 2025 Tech-Tonicml. All rights reserved.

## Links

- **Website**: [tech-tonicml.gt.tc](https://tech-tonicml.gt.tc)
- **Repository**: [github.com/ethcocoder/tech-tonicml-dekapp](https://github.com/ethcocoder/tech-tonicml-dekapp)

## Contact

For questions or support, visit [tech-tonicml.gt.tc](https://tech-tonicml.gt.tc)

---

Built with ❤️ by ethcocoder
