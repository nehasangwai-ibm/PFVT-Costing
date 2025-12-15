/**
 * Mode Selector - Landing Page
 * Choose between MAS Resource Estimation or PFVT Cluster Analysis
 */

class ModeSelector {
    constructor() {
        this.currentMode = null;
        this.init();
    }

    init() {
        // Check if mode already selected in session
        const savedMode = sessionStorage.getItem('pfvt_mode');
        if (savedMode) {
            this.currentMode = savedMode;
            this.showMode(savedMode);
        } else {
            this.showLandingPage();
        }
    }

    showLandingPage() {
        // Hide all content sections
        document.getElementById('mas-estimation-content').style.display = 'none';
        document.getElementById('cluster-analysis-content').style.display = 'none';
        
        // Show landing page
        document.getElementById('landing-page').style.display = 'block';
    }

    selectMode(mode) {
        if (mode === 'cluster-analysis') {
            // Check admin authentication
            if (!authManager.checkAuth()) {
                if (!authManager.promptAuth()) {
                    return; // Authentication failed
                }
            }
        }

        this.currentMode = mode;
        sessionStorage.setItem('pfvt_mode', mode);
        this.showMode(mode);
    }

    showMode(mode) {
        // Hide landing page
        document.getElementById('landing-page').style.display = 'none';

        if (mode === 'mas-estimation') {
            document.getElementById('mas-estimation-content').style.display = 'block';
            document.getElementById('cluster-analysis-content').style.display = 'none';
        } else if (mode === 'cluster-analysis') {
            document.getElementById('mas-estimation-content').style.display = 'none';
            document.getElementById('cluster-analysis-content').style.display = 'block';
        }

        // Update header
        this.updateHeader(mode);
    }

    updateHeader(mode) {
        const modeTitle = document.getElementById('current-mode-title');
        const backBtn = document.getElementById('back-to-landing');
        
        if (mode === 'mas-estimation') {
            modeTitle.textContent = '📊 MAS Resource Estimation';
        } else if (mode === 'cluster-analysis') {
            modeTitle.textContent = '🔍 PFVT Cluster Analysis';
        }
        
        backBtn.style.display = 'inline-block';
    }

    backToLanding() {
        this.currentMode = null;
        sessionStorage.removeItem('pfvt_mode');
        this.showLandingPage();
        
        // Hide back button
        document.getElementById('back-to-landing').style.display = 'none';
        document.getElementById('current-mode-title').textContent = '';
    }
}

// Global mode selector instance
const modeSelector = new ModeSelector();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Mode selection buttons
    document.getElementById('btn-mas-estimation')?.addEventListener('click', () => {
        modeSelector.selectMode('mas-estimation');
    });

    document.getElementById('btn-cluster-analysis')?.addEventListener('click', () => {
        modeSelector.selectMode('cluster-analysis');
    });

    // Back to landing button
    document.getElementById('back-to-landing')?.addEventListener('click', () => {
        modeSelector.backToLanding();
    });
});

// Made with Bob
