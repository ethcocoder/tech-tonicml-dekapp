/**
 * API wrapper for Python backend communication
 * Provides async methods to call Python functions from JavaScript
 */

class PyAPI {
    /**
     * Call a Python method through PyWebView bridge
     * @param {string} method - Python method name
     * @param {...any} args - Arguments to pass to Python method
     * @returns {Promise} - Promise resolving to Python return value
     */
    async call(method, ...args) {
        try {
            if (!window.pywebview || !window.pywebview.api) {
                throw new Error('PyWebView API not available');
            }
            const result = await window.pywebview.api[method](...args);
            return result;
        } catch (error) {
            console.error(`Error calling Python method '${method}':`, error);
            throw error;
        }
    }

    // ==================== File Operations ====================

    /**
     * Open file picker dialog
     * @returns {Promise<string|null>} Selected file path or null
     */
    async openFile() {
        return await this.call('open_file_dialog');
    }

    /**
     * Open save file dialog
     * @param {string} defaultName - Default filename
     * @returns {Promise<string|null>} Selected file path or null
     */
    async saveFile(defaultName = 'untitled.txt') {
        return await this.call('save_file_dialog', defaultName);
    }

    /**
     * Read file contents
     * @param {string} filePath - Path to file
     * @returns {Promise<Object>} Result object with success, data/error
     */
    async readFile(filePath) {
        return await this.call('read_file', filePath);
    }

    /**
     * Write content to file
     * @param {string} filePath - Path to file
     * @param {string} content - Content to write
     * @returns {Promise<Object>} Result object with success status
     */
    async writeFile(filePath, content) {
        return await this.call('write_file', filePath, content);
    }

    // ==================== Settings ====================

    /**
     * Save application settings
     * @param {Object} settings - Settings object to save
     * @returns {Promise<Object>} Result object with success status
     */
    async saveSettings(settings) {
        return await this.call('save_settings', settings);
    }

    /**
     * Load application settings
     * @returns {Promise<Object>} Result object with settings data
     */
    async loadSettings() {
        return await this.call('load_settings');
    }

    // ==================== System ====================

    /**
     * Get system information
     * @returns {Promise<Object>} System info object
     */
    async getSystemInfo() {
        return await this.call('get_system_info');
    }

    /**
     * Show system notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @returns {Promise<Object>} Result object
     */
    async showNotification(title, message) {
        return await this.call('show_notification', title, message);
    }

    // ==================== Application Data ====================

    /**
     * Get application info
     * @returns {Promise<Object>} App info object
     */
    async getAppInfo() {
        return await this.call('get_app_info');
    }

    /**
     * Get welcome message
     * @returns {Promise<Object>} Welcome message data
     */
    async getWelcomeMessage() {
        return await this.call('get_welcome_message');
    }

    /**
     * Process text with various operations
     * @param {string} text - Text to process
     * @param {string} operation - Operation: upper, lower, title, reverse, count
     * @returns {Promise<Object>} Result object with processed text
     */
    async processText(text, operation) {
        return await this.call('process_text', text, operation);
    }
}

// Create global API instance
const pyAPI = new PyAPI();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PyAPI;
}
