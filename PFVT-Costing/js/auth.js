/**
 * Simple Authentication Module
 * Admin access for PFVT Cluster Analysis
 */

class AuthManager {
    constructor() {
        this.adminPassword = 'pfvt2024'; // Simple password for demo
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if already authenticated in session
        this.isAuthenticated = sessionStorage.getItem('pfvt_admin_auth') === 'true';
    }

    authenticate(password) {
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            sessionStorage.setItem('pfvt_admin_auth', 'true');
            return true;
        }
        return false;
    }

    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('pfvt_admin_auth');
    }

    checkAuth() {
        return this.isAuthenticated;
    }

    promptAuth() {
        const password = prompt('🔐 Admin Access Required\n\nEnter admin password to access PFVT Cluster Analysis:');
        if (password) {
            if (this.authenticate(password)) {
                return true;
            } else {
                alert('❌ Invalid password. Access denied.');
                return false;
            }
        }
        return false;
    }
}

// Global auth manager instance
const authManager = new AuthManager();

// Made with Bob
