/**
 * IBM Cloud Cluster Analysis Module
 * Handles cluster fetching, analysis, and Excel export
 */

const CLUSTER_API_BASE = 'http://localhost:3001/api/clusters';

/**
 * Fetch clusters from IBM Cloud
 */
async function fetchClusters() {
    try {
        showLoadingState('Fetching clusters from IBM Cloud...');
        
        const response = await fetch(`${CLUSTER_API_BASE}/list`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch clusters');
        }
        
        hideLoadingState();
        return data.clusters;
    } catch (error) {
        hideLoadingState();
        console.error('Error fetching clusters:', error);
        showNotification(`Error: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Analyze all clusters
 */
async function analyzeClusters() {
    try {
        showLoadingState('Analyzing clusters and calculating costs...');
        
        const response = await fetch(`${CLUSTER_API_BASE}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to analyze clusters');
        }
        
        hideLoadingState();
        return data.analysis;
    } catch (error) {
        hideLoadingState();
        console.error('Error analyzing clusters:', error);
        showNotification(`Error: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Export analysis to Excel
 */
async function exportToExcel(analysisData) {
    try {
        showLoadingState('Generating Excel report...');
        
        const response = await fetch(`${CLUSTER_API_BASE}/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ analysisData })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to generate Excel report');
        }
        
        hideLoadingState();
        
        // Download the file
        const downloadUrl = `http://localhost:3001${data.url}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification(`✅ Excel report downloaded: ${data.filename}`, 'success');
        
        return data;
    } catch (error) {
        hideLoadingState();
        console.error('Error exporting to Excel:', error);
        showNotification(`Error: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Analyze and export in one call
 */
async function analyzeAndExport() {
    try {
        showLoadingState('Analyzing clusters and generating report...');
        
        const response = await fetch(`${CLUSTER_API_BASE}/analyze-and-export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to analyze and export');
        }
        
        hideLoadingState();
        
        // Download the file
        const downloadUrl = `http://localhost:3001${data.report.url}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = data.report.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification(`✅ Analysis complete! Report downloaded: ${data.report.filename}`, 'success');
        
        return data;
    } catch (error) {
        hideLoadingState();
        console.error('Error in analyze and export:', error);
        showNotification(`Error: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Display cluster analysis results
 */
function displayClusterAnalysis(analysisData) {
    const container = document.getElementById('cluster-analysis-results');
    
    if (!container) {
        console.error('Cluster analysis results container not found');
        return;
    }
    
    // Generate summary HTML
    const summaryHTML = `
        <div class="analysis-summary">
            <h3>📊 Analysis Summary</h3>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="summary-label">Total Clusters</div>
                    <div class="summary-value">${analysisData.totalClusters}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Total Workers</div>
                    <div class="summary-value">${analysisData.totalWorkers}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Monthly Cost</div>
                    <div class="summary-value cost-value">$${analysisData.totalMonthlyCost.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Yearly Cost</div>
                    <div class="summary-value cost-value">$${analysisData.totalYearlyCost.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Total Cost To Date</div>
                    <div class="summary-value cost-value">$${analysisData.totalCostToDate.toFixed(2)}</div>
                </div>
            </div>
        </div>
        
        <div class="clusters-table-container">
            <h3>🖥️ Cluster Details</h3>
            <table class="clusters-table">
                <thead>
                    <tr>
                        <th>Cluster Name</th>
                        <th>State</th>
                        <th>Created</th>
                        <th>Uptime</th>
                        <th>Workers</th>
                        <th>Flavor</th>
                        <th>CPU/Node</th>
                        <th>RAM/Node</th>
                        <th>Disk/Node</th>
                        <th>Zones</th>
                        <th>Monthly Cost</th>
                        <th>Score</th>
                        <th>Recommendations</th>
                    </tr>
                </thead>
                <tbody>
                    ${analysisData.clusters.map(cluster => `
                        <tr>
                            <td><strong>${cluster.name}</strong></td>
                            <td><span class="status-badge status-${cluster.state}">${cluster.state}</span></td>
                            <td>${cluster.createdDate}</td>
                            <td>${cluster.uptime}</td>
                            <td>${cluster.workers}</td>
                            <td><code>${cluster.flavor}</code></td>
                            <td>${cluster.cpu || 'N/A'}</td>
                            <td>${cluster.memory ? cluster.memory + ' GB' : 'N/A'}</td>
                            <td>${cluster.disk ? cluster.disk + ' GB' : 'N/A'}</td>
                            <td>${cluster.zones}</td>
                            <td class="cost-cell">$${cluster.costs.monthly.toFixed(2)}</td>
                            <td>
                                <span class="cost-score-badge cost-score-${cluster.costScore.toLowerCase()}">
                                    ${cluster.costScore}
                                </span>
                            </td>
                            <td class="recommendations-cell">
                                <ul class="recommendations-list">
                                    ${cluster.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="analysis-actions">
            <button class="btn btn-success" onclick="handleExportExcel()">
                <span class="icon">📥</span> Export to Excel
            </button>
            <button class="btn btn-secondary" onclick="handleRefreshAnalysis()">
                <span class="icon">🔄</span> Refresh Analysis
            </button>
        </div>
    `;
    
    container.innerHTML = summaryHTML;
    container.style.display = 'block';
    
    // Store analysis data globally for export
    window.currentAnalysisData = analysisData;
}

/**
 * Handle analyze clusters button click
 */
async function handleAnalyzeClusters() {
    try {
        const analysisData = await analyzeClusters();
        displayClusterAnalysis(analysisData);
    } catch (error) {
        console.error('Error in handleAnalyzeClusters:', error);
    }
}

/**
 * Handle export to Excel
 */
async function handleExportExcel() {
    if (!window.currentAnalysisData) {
        showNotification('No analysis data available. Please analyze clusters first.', 'warning');
        return;
    }
    
    try {
        await exportToExcel(window.currentAnalysisData);
    } catch (error) {
        console.error('Error in handleExportExcel:', error);
    }
}

/**
 * Handle refresh analysis
 */
async function handleRefreshAnalysis() {
    await handleAnalyzeClusters();
}

/**
 * Handle analyze and export (one-click)
 */
async function handleAnalyzeAndExport() {
    try {
        const result = await analyzeAndExport();
        displayClusterAnalysis(result.analysis);
    } catch (error) {
        console.error('Error in handleAnalyzeAndExport:', error);
    }
}

/**
 * Show loading state
 */
function showLoadingState(message = 'Loading...') {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        const loaderText = loader.querySelector('p');
        if (loaderText) {
            loaderText.textContent = message;
        }
        loader.style.display = 'flex';
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to container
    const container = document.getElementById('toast-container');
    if (container) {
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for cluster analysis buttons
    const analyzeBtn = document.getElementById('btn-analyze-clusters');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalyzeClusters);
    }
    
    const analyzeExportBtn = document.getElementById('btn-analyze-export');
    if (analyzeExportBtn) {
        analyzeExportBtn.addEventListener('click', handleAnalyzeAndExport);
    }
});

// Made with Bob
