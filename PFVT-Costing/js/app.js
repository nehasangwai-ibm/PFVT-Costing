/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * Application Entry Point
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 IBM MAS PFVT Cost & Sizing Advisor');
    console.log('Initializing application...');
    
    try {
        // Initialize UI
        initializeUI();
        
        console.log('✅ Application initialized successfully');
        
        // Show welcome message
        showWelcomeMessage();
        
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        showToast('Failed to initialize application. Please refresh the page.', 'error');
    }
});

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    // Check if this is first visit
    const hasVisited = localStorage.getItem('mas-pfvt-visited');
    
    if (!hasVisited) {
        setTimeout(() => {
            showToast('Welcome to IBM MAS PFVT Cost & Sizing Advisor! Click Help for guidance.', 'info');
            localStorage.setItem('mas-pfvt-visited', 'true');
        }, 1000);
    }
}

/**
 * Handle errors globally
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred. Please try again.', 'error');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred. Please try again.', 'error');
});

/**
 * Log application info
 */
console.log('%c IBM MAS PFVT Cost & Sizing Advisor ', 'background: #0f62fe; color: white; font-size: 16px; padding: 10px;');
console.log('%c Version 1.0.0 ', 'background: #24a148; color: white; font-size: 12px; padding: 5px;');
console.log('For ROKS Clusters Only');
console.log('');
console.log('Features:');
console.log('✓ 6 MAS Baseline Configurations');
console.log('✓ 18 Worker Node Flavors');
console.log('✓ Multi-Zone Support (1-3 zones)');
console.log('✓ Zone-Aware PFVT Cost Score');
console.log('✓ Risk Assessment & Recommendations');
console.log('✓ Scenario Management');
console.log('✓ Export Functionality');
console.log('');
console.log('Need help? Click the Help button in the header.');

// Made with Bob
