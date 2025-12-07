/**
 * Main application logic
 * Handles UI interactions, navigation, and API calls
 */

// Application state
const appState = {
    currentFile: null,
    settings: {},
    isModified: false
};

// Wait for PyWebView to be ready
window.addEventListener('pywebviewready', function () {
    console.log('✅ PyWebView is ready!');
    initApp();
});

/**
 * Initialize the application
 */
async function initApp() {
    console.log('🚀 Initializing application...');

    // Load app info and display in header
    await loadAppInfo();

    // Setup UI components
    setupNavigation();
    setupHomePage();
    setupEditorPage();
    setupAboutPage();

    // Load settings
    await loadSettings();

    console.log('✅ Application initialized successfully!');
}

/**
 * Load and display app info in header
 */
async function loadAppInfo() {
    try {
        const appInfo = await pyAPI.getAppInfo();
        if (appInfo) {
            document.querySelector('.app-title').textContent = appInfo.name;

            // Add version badge if not exists
            if (!document.querySelector('.app-version')) {
                const versionBadge = document.createElement('span');
                versionBadge.className = 'app-version';
                versionBadge.textContent = `v${appInfo.version}`;
                document.querySelector('.header-left').appendChild(versionBadge);
            }
        }
    } catch (error) {
        console.error('Error loading app info:', error);
    }
}

// ==================== Navigation ====================

/**
 * Setup navigation system
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.dataset.page;

            if (!pageName) return;

            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            item.classList.add('active');
            const targetPage = document.getElementById(pageName);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            console.log(`📄 Navigated to: ${pageName}`);
        });
    });
}

// ==================== Home Page ====================

/**
 * Setup home page functionality
 */
function setupHomePage() {
    const demoBtn = document.getElementById('demoBtn');
    const resultBox = document.getElementById('result');

    if (demoBtn && resultBox) {
        demoBtn.addEventListener('click', async () => {
            try {
                demoBtn.disabled = true;
                demoBtn.textContent = 'Loading...';

                const data = await pyAPI.getWelcomeMessage();

                resultBox.innerHTML = `
                    <div class="card">
                        <h3>✅ Python API Call Successful!</h3>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    </div>
                `;
            } catch (error) {
                resultBox.innerHTML = `
                    <div class="card" style="border-color: var(--error-color);">
                        <h3>❌ Error</h3>
                        <p style="color: var(--error-color);">${error.message}</p>
                    </div>
                `;
            } finally {
                demoBtn.disabled = false;
                demoBtn.innerHTML = '🚀 Call Python API';
            }
        });
    }
}

// ==================== Editor Page ====================

/**
 * Setup editor page functionality
 */
function setupEditorPage() {
    const openBtn = document.getElementById('openBtn');
    const saveBtn = document.getElementById('saveBtn');
    const newBtn = document.getElementById('newBtn');
    const textarea = document.getElementById('editor-content');
    const currentFileSpan = document.getElementById('currentFile');
    const charCountSpan = document.getElementById('charCount');

    // Track changes
    if (textarea) {
        textarea.addEventListener('input', () => {
            appState.isModified = true;
            updateCharCount();
        });
    }

    // Update character count
    function updateCharCount() {
        if (charCountSpan && textarea) {
            const count = textarea.value.length;
            charCountSpan.textContent = `${count} characters`;
        }
    }

    // New file
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            if (appState.isModified) {
                if (!confirm('You have unsaved changes. Create new file anyway?')) {
                    return;
                }
            }
            textarea.value = '';
            appState.currentFile = null;
            appState.isModified = false;
            if (currentFileSpan) {
                currentFileSpan.textContent = 'Untitled';
            }
            updateCharCount();
            console.log('📄 Created new file');
        });
    }

    // Open file
    if (openBtn) {
        openBtn.addEventListener('click', async () => {
            try {
                const filePath = await pyAPI.openFile();

                if (!filePath) {
                    console.log('File selection cancelled');
                    return;
                }

                openBtn.disabled = true;
                openBtn.textContent = 'Opening...';

                const result = await pyAPI.readFile(filePath);

                if (result.success) {
                    textarea.value = result.data;
                    appState.currentFile = filePath;
                    appState.isModified = false;

                    if (currentFileSpan) {
                        currentFileSpan.textContent = result.filename || 'Untitled';
                    }

                    updateCharCount();
                    console.log(`✅ Opened file: ${result.filename}`);

                    showNotification('File Opened', `Loaded ${result.filename}`);
                } else {
                    alert(`Error reading file: ${result.error}`);
                }
            } catch (error) {
                console.error('Error opening file:', error);
                alert(`Error opening file: ${error.message}`);
            } finally {
                openBtn.disabled = false;
                openBtn.innerHTML = '📂 Open';
            }
        });
    }

    // Save file
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            try {
                const content = textarea.value;
                let filePath = appState.currentFile;

                // If no current file, show save dialog
                if (!filePath) {
                    filePath = await pyAPI.saveFile('untitled.txt');
                }

                if (!filePath) {
                    console.log('Save cancelled');
                    return;
                }

                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';

                const result = await pyAPI.writeFile(filePath, content);

                if (result.success) {
                    appState.currentFile = filePath;
                    appState.isModified = false;

                    if (currentFileSpan) {
                        currentFileSpan.textContent = result.filename || 'Saved';
                    }

                    console.log(`✅ Saved file: ${result.filename}`);
                    showNotification('File Saved', `Saved ${result.filename}`);
                } else {
                    alert(`Error saving file: ${result.error}`);
                }
            } catch (error) {
                console.error('Error saving file:', error);
                alert(`Error saving file: ${error.message}`);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '💾 Save';
            }
        });
    }

    // Initial character count
    updateCharCount();
}

// ==================== About Page ====================

/**
 * Setup about page functionality
 */
async function setupAboutPage() {
    const systemInfoDiv = document.getElementById('systemInfo');
    const appInfoDiv = document.getElementById('appInfo');

    try {
        // Load system info
        const sysInfoResult = await pyAPI.getSystemInfo();

        if (sysInfoResult.success && systemInfoDiv) {
            const data = sysInfoResult.data;
            systemInfoDiv.innerHTML = `
                <h3>💻 System Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Platform</strong>
                        <span>${data.platform}</span>
                    </div>
                    <div class="info-item">
                        <strong>Platform Version</strong>
                        <span>${data.platform_version}</span>
                    </div>
                    <div class="info-item">
                        <strong>Python Version</strong>
                        <span>${data.python_version}</span>
                    </div>
                    <div class="info-item">
                        <strong>Machine</strong>
                        <span>${data.machine}</span>
                    </div>
                    <div class="info-item">
                        <strong>Processor</strong>
                        <span>${data.processor || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <strong>App Data Directory</strong>
                        <span style="font-size: 0.75rem; word-break: break-all;">${data.app_data_dir}</span>
                    </div>
                </div>
            `;
        }

        // Load app info
        const appInfo = await pyAPI.getAppInfo();

        if (appInfo && appInfoDiv) {
            appInfoDiv.innerHTML = `
                <h3>📱 Application Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Name</strong>
                        <span>${appInfo.name}</span>
                    </div>
                    <div class="info-item">
                        <strong>Version</strong>
                        <span>${appInfo.version}</span>
                    </div>
                    <div class="info-item">
                        <strong>Author</strong>
                        <span>${appInfo.author}</span>
                    </div>
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <strong>Description</strong>
                        <span>${appInfo.description}</span>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading about page data:', error);
        if (systemInfoDiv) {
            systemInfoDiv.innerHTML = `
                <p style="color: var(--error-color);">Error loading system information: ${error.message}</p>
            `;
        }
    }
}

// ==================== Settings ====================

/**
 * Load application settings
 */
async function loadSettings() {
    try {
        const result = await pyAPI.loadSettings();
        if (result.success) {
            appState.settings = result.data;
            console.log('✅ Settings loaded:', appState.settings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Save application settings
 */
async function saveSettings() {
    try {
        const result = await pyAPI.saveSettings(appState.settings);
        if (result.success) {
            console.log('✅ Settings saved');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// ==================== Utilities ====================

/**
 * Show a notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
async function showNotification(title, message) {
    try {
        await pyAPI.showNotification(title, message);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

/**
 * Handle before unload - warn if unsaved changes
 */
window.addEventListener('beforeunload', (e) => {
    if (appState.isModified) {
        e.preventDefault();
        e.returnValue = '';
        return 'You have unsaved changes. Are you sure you want to leave?';
    }
});

console.log('📦 App.js loaded');
