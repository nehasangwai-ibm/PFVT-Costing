/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * UI Controller
 */

// Global state
let currentConfig = null;
let currentFlavor = null;
let currentZones = 2;
let currentResults = null;

/**
 * Initialize UI components
 */
function initializeUI() {
    populateConfigurationDropdown();
    populateFlavorDropdown();
    setupEventListeners();
    updateScenarioCount();
}

/**
 * Populate MAS configuration dropdown
 */
function populateConfigurationDropdown() {
    const select = document.getElementById('mas-config');
    const configs = getAllConfigurations();
    
    configs.forEach(config => {
        const option = document.createElement('option');
        option.value = config.id;
        option.textContent = config.name;
        select.appendChild(option);
    });
}

/**
 * Populate worker flavor dropdown
 */
function populateFlavorDropdown() {
    const select = document.getElementById('worker-flavor');
    const flavors = getAllFlavors();
    
    // Group by series
    const bx2Flavors = flavors.filter(f => f.series === 'bx2');
    const bx3dFlavors = flavors.filter(f => f.series === 'bx3d');
    
    // Add bx2 group
    const bx2Group = document.createElement('optgroup');
    bx2Group.label = 'Balanced (bx2) Series';
    bx2Flavors.forEach(flavor => {
        const option = document.createElement('option');
        option.value = flavor.id;
        option.textContent = `${flavor.name} - ${flavor.vcpu} vCPU, ${flavor.ram}GB RAM ($${flavor.hourlyRate}/hr)`;
        bx2Group.appendChild(option);
    });
    select.appendChild(bx2Group);
    
    // Add bx3d group
    const bx3dGroup = document.createElement('optgroup');
    bx3dGroup.label = 'Balanced Dense (bx3d) Series';
    bx3dFlavors.forEach(flavor => {
        const option = document.createElement('option');
        option.value = flavor.id;
        option.textContent = `${flavor.name} - ${flavor.vcpu} vCPU, ${flavor.ram}GB RAM ($${flavor.hourlyRate}/hr)`;
        bx3dGroup.appendChild(option);
    });
    select.appendChild(bx3dGroup);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Configuration selection
    document.getElementById('mas-config').addEventListener('change', handleConfigChange);
    
    // Zone selection
    document.getElementById('zone-count').addEventListener('change', handleZoneChange);
    
    // Flavor selection
    document.getElementById('worker-flavor').addEventListener('change', handleFlavorChange);
    
    // Calculate button
    document.getElementById('btn-calculate').addEventListener('click', handleCalculate);
    
    // Result actions - using event delegation since buttons are in hidden section
    document.addEventListener('click', (e) => {
        if (e.target.id === 'btn-trigger-pfvt' || e.target.closest('#btn-trigger-pfvt')) {
            handleTriggerPFVT();
        } else if (e.target.id === 'btn-save-scenario' || e.target.closest('#btn-save-scenario')) {
            showSaveScenarioModal();
        } else if (e.target.id === 'btn-export-results' || e.target.closest('#btn-export-results')) {
            handleExportResults();
        } else if (e.target.id === 'btn-new-calculation' || e.target.closest('#btn-new-calculation')) {
            handleNewCalculation();
        }
    });
    
    // Modal actions
    document.getElementById('btn-help').addEventListener('click', () => showModal('modal-help'));
    document.getElementById('btn-scenarios').addEventListener('click', () => {
        loadScenariosModal();
        showModal('modal-scenarios');
    });
    document.getElementById('btn-confirm-save').addEventListener('click', handleSaveScenario);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal') || e.target.closest('.modal').id;
            if (modalId) closeModal(modalId);
        });
    });
    
    // Search scenarios
    document.getElementById('search-scenarios').addEventListener('input', handleSearchScenarios);
    
    // Delete all scenarios
    document.getElementById('btn-delete-all-scenarios').addEventListener('click', handleDeleteAllScenarios);
}

/**
 * Handle configuration change
 */
function handleConfigChange(e) {
    const configId = e.target.value;
    
    if (!configId) {
        document.getElementById('config-details').style.display = 'none';
        document.getElementById('deployment-section').style.display = 'none';
        currentConfig = null;
        return;
    }
    
    currentConfig = getConfigurationById(configId);
    
    if (currentConfig) {
        displayConfigurationDetails(currentConfig);
        document.getElementById('config-details').style.display = 'block';
        document.getElementById('deployment-section').style.display = 'block';
        
        // Recommend flavors
        recommendFlavorsForConfig(currentConfig);
    }
}

/**
 * Display configuration details
 */
function displayConfigurationDetails(config) {
    document.getElementById('config-name').textContent = config.name;
    document.getElementById('config-description').textContent = config.description;
    document.getElementById('config-components').textContent = config.components.join(', ');
    document.getElementById('config-baseline').textContent = 
        `${config.workers} workers, ${config.vcpu} vCPU, ${config.ram}GB RAM, ${config.disk}GB disk`;
}

/**
 * Recommend flavors for configuration
 */
function recommendFlavorsForConfig(config) {
    const recommendations = recommendFlavors(config);
    
    if (recommendations.length > 0 && recommendations[0].flavor) {
        // Auto-select the top recommendation
        const topFlavor = recommendations[0].flavor;
        document.getElementById('worker-flavor').value = topFlavor.id;
        handleFlavorChange({ target: { value: topFlavor.id } });
    }
}

/**
 * Handle zone change
 */
function handleZoneChange(e) {
    currentZones = parseInt(e.target.value);
}

/**
 * Handle flavor change
 */
function handleFlavorChange(e) {
    const flavorId = e.target.value;
    
    if (!flavorId) {
        document.getElementById('flavor-details').style.display = 'none';
        currentFlavor = null;
        return;
    }
    
    currentFlavor = getFlavorById(flavorId);
    
    if (currentFlavor) {
        displayFlavorDetails(currentFlavor);
        document.getElementById('flavor-details').style.display = 'block';
    }
}

/**
 * Display flavor details
 */
function displayFlavorDetails(flavor) {
    document.getElementById('flavor-vcpu').textContent = flavor.vcpu;
    document.getElementById('flavor-ram').textContent = `${flavor.ram}GB`;
    document.getElementById('flavor-storage').textContent = `${flavor.storage}GB ${flavor.storageType}`;
    document.getElementById('flavor-network').textContent = flavor.network;
    document.getElementById('flavor-rate').textContent = `$${flavor.hourlyRate}/hr`;
}

/**
 * Handle calculate button click
 */
function handleCalculate() {
    if (!currentConfig || !currentFlavor) {
        showToast('Please select both configuration and flavor', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
        performCalculation();
        hideLoading();
    }, 500);
}

/**
 * Perform cost calculation
 */
function performCalculation() {
    // Calculate costs
    const costs = calculateCosts(currentConfig, currentFlavor, currentZones);
    
    // Calculate cost score
    const costScore = calculateCostScore(costs.costs.total.monthly, currentZones);
    
    // Assess risks
    const risks = assessRisks(currentConfig, currentFlavor, currentZones, costs);
    
    // Generate recommendations
    const recommendations = generateRecommendations(
        currentConfig, 
        currentFlavor, 
        currentZones, 
        costs, 
        costScore, 
        risks
    );
    
    // Store results
    currentResults = {
        configuration: currentConfig,
        flavor: currentFlavor,
        zones: currentZones,
        costs: costs,
        costScore: costScore,
        risks: risks,
        recommendations: recommendations,
        timestamp: new Date().toISOString()
    };
    
    // Display results
    displayResults(currentResults);
    
    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Display calculation results
 */
function displayResults(results) {
    // Show results section
    document.getElementById('results-section').style.display = 'block';
    
    // Display cost score
    displayCostScore(results.costScore);
    
    // Display cluster summary
    displayClusterSummary(results);
    
    // Display cost breakdown
    displayCostBreakdown(results.costs);
    
    // Display risks
    displayRisks(results.risks);
    
    // Display recommendations
    displayRecommendations(results.recommendations);
}

/**
 * Display cost score badge
 */
function displayCostScore(costScore) {
    const badge = document.getElementById('cost-score-badge');
    
    // Remove existing score classes
    badge.classList.remove('score-green', 'score-amber', 'score-red');
    
    // Add appropriate class
    badge.classList.add(`score-${costScore.score.toLowerCase()}`);
    
    // Update content
    document.getElementById('score-icon').textContent = costScore.icon;
    document.getElementById('score-value').textContent = costScore.score;
    document.getElementById('score-description').textContent = costScore.label;
    document.getElementById('score-amount').textContent = formatCurrency(costScore.monthlyCost) + '/month';
    document.getElementById('score-message').textContent = costScore.message;
}

/**
 * Display cluster summary
 */
function displayClusterSummary(results) {
    document.getElementById('summary-workers').textContent = results.costs.workers;
    document.getElementById('summary-zones').textContent = results.costs.zones;
    document.getElementById('summary-nodes').textContent = results.costs.totalNodes;
    document.getElementById('summary-vcpu').textContent = results.flavor.vcpu;
    document.getElementById('summary-ram').textContent = `${results.flavor.ram}GB`;
    document.getElementById('summary-disk').textContent = `${results.flavor.storage}GB`;
}

/**
 * Display cost breakdown
 */
function displayCostBreakdown(costs) {
    document.getElementById('cost-formula').textContent = costs.breakdown.formula;
    document.getElementById('cost-hourly').textContent = formatCurrency(costs.costs.total.hourly);
    document.getElementById('cost-monthly').textContent = formatCurrency(costs.costs.total.monthly);
    document.getElementById('cost-yearly').textContent = formatCurrency(costs.costs.total.yearly);
}

/**
 * Display risks
 */
function displayRisks(risks) {
    const summary = getRiskSummary(risks);
    const summaryEl = document.getElementById('risk-summary');
    const listEl = document.getElementById('risk-list');
    
    // Display summary
    if (summary.total === 0) {
        summaryEl.innerHTML = '<p class="text-success">✅ No risks detected - configuration looks good!</p>';
        listEl.innerHTML = '';
    } else {
        summaryEl.innerHTML = `
            <p><strong>Risk Summary:</strong> ${summary.total} issue(s) detected</p>
            <p>High: ${summary.high} | Medium: ${summary.medium} | Low: ${summary.low}</p>
        `;
        
        // Display risk list
        listEl.innerHTML = risks.map(risk => `
            <div class="risk-item risk-${risk.severity}">
                <div class="risk-title">
                    ${getSeverityIcon(risk.severity)} ${risk.title}
                </div>
                <div class="risk-message">${risk.message}</div>
                <div class="risk-recommendation"><strong>Recommendation:</strong> ${risk.recommendation}</div>
            </div>
        `).join('');
    }
}

/**
 * Display recommendations
 */
function displayRecommendations(recommendations) {
    const listEl = document.getElementById('recommendation-list');
    
    if (recommendations.length === 0) {
        listEl.innerHTML = '<p class="text-muted">No specific recommendations at this time.</p>';
        return;
    }
    
    listEl.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item rec-${rec.type}">
            <div class="recommendation-title">
                ${getRecommendationIcon(rec.type)} ${rec.title}
            </div>
            <div class="recommendation-message">${rec.message}</div>
            <div class="recommendation-action"><strong>Action:</strong> ${rec.action}</div>
        </div>
    `).join('');
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity) {
    const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🔵'
    };
    return icons[severity] || '⚪';
}

/**
 * Get recommendation icon
 */
function getRecommendationIcon(type) {
    const icons = {
        critical: '🔴',
        optimization: '🟡',
        success: '🟢',
        'best-practice': '💡',
        info: 'ℹ️'
    };
    return icons[type] || '💡';
}

/**
 * Show save scenario modal
 */
function showSaveScenarioModal() {
    if (!currentResults) {
        showToast('No results to save', 'error');
        return;
    }
    
    // Pre-fill with suggested name
    const suggestedName = `${currentResults.configuration.name} - ${currentResults.zones} zones`;
    document.getElementById('scenario-name').value = suggestedName;
    document.getElementById('scenario-notes').value = '';
    
    showModal('modal-save-scenario');
}

/**
 * Handle save scenario
 */
function handleSaveScenario() {
    const name = document.getElementById('scenario-name').value.trim();
    const notes = document.getElementById('scenario-notes').value.trim();
    
    if (!name) {
        showToast('Please enter a scenario name', 'error');
        return;
    }
    
    const scenario = {
        name: name,
        notes: notes,
        configuration: {
            configId: currentResults.configuration.id,
            name: currentResults.configuration.name
        },
        flavor: {
            flavorId: currentResults.flavor.id,
            name: currentResults.flavor.name
        },
        zones: currentResults.zones,
        results: currentResults
    };
    
    const result = saveScenario(scenario);
    
    if (result.success) {
        showToast('Scenario saved successfully!', 'success');
        closeModal('modal-save-scenario');
        updateScenarioCount();
    } else {
        showToast('Failed to save scenario: ' + result.message, 'error');
    }
}

/**
 * Handle export results
 */
function handleExportResults() {
    if (!currentResults) {
        showToast('No results to export', 'error');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        configuration: currentResults.configuration.name,
        flavor: currentResults.flavor.name,
        zones: currentResults.zones,
        costs: {
            hourly: currentResults.costs.costs.total.hourly,
            monthly: currentResults.costs.costs.total.monthly,
            yearly: currentResults.costs.costs.total.yearly
        },
        costScore: currentResults.costScore,
        risks: currentResults.risks,
        recommendations: currentResults.recommendations
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mas-pfvt-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Results exported successfully!', 'success');
}

/**
 * Handle new calculation
 */
function handleNewCalculation() {
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('mas-config').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handle trigger PFVT
 */
function handleTriggerPFVT() {
    if (!currentResults) {
        alert('No calculation results available. Please calculate costs first.');
        return;
    }
    
    // Show PFVT integration modal
    showPFVTModal(currentResults);
}

/**
 * Load scenarios modal
 */
function loadScenariosModal() {
    const scenarios = loadAllScenarios();
    const listEl = document.getElementById('scenarios-list');
    
    if (scenarios.length === 0) {
        listEl.innerHTML = '<p class="text-muted text-center">No saved scenarios yet.</p>';
        return;
    }
    
    listEl.innerHTML = scenarios.map(scenario => createScenarioCard(scenario)).join('');
    
    // Add event listeners to scenario actions
    scenarios.forEach(scenario => {
        document.getElementById(`load-${scenario.id}`).addEventListener('click', () => handleLoadScenario(scenario.id));
        document.getElementById(`delete-${scenario.id}`).addEventListener('click', () => handleDeleteScenario(scenario.id));
    });
}

/**
 * Create scenario card HTML
 */
function createScenarioCard(scenario) {
    const score = scenario.results?.costScore?.score || 'UNKNOWN';
    const scoreClass = score.toLowerCase();
    const monthlyCost = scenario.results?.costs?.costs?.total?.monthly || 0;
    const date = new Date(scenario.createdAt).toLocaleDateString();
    
    return `
        <div class="scenario-card">
            <div class="scenario-header">
                <div>
                    <div class="scenario-title">${scenario.name}</div>
                    <div class="scenario-date">${date}</div>
                </div>
                <div class="scenario-score ${scoreClass}">${score}</div>
            </div>
            <div class="scenario-details">
                ${scenario.configuration.name} | ${scenario.flavor.name} | ${scenario.zones} zones | ${formatCurrency(monthlyCost)}/month
            </div>
            ${scenario.notes ? `<div class="scenario-details"><em>${scenario.notes}</em></div>` : ''}
            <div class="scenario-actions">
                <button id="load-${scenario.id}" class="btn btn-primary">Load</button>
                <button id="delete-${scenario.id}" class="btn btn-danger-outline">Delete</button>
            </div>
        </div>
    `;
}

/**
 * Handle load scenario
 */
function handleLoadScenario(scenarioId) {
    const scenario = loadScenario(scenarioId);
    
    if (!scenario) {
        showToast('Scenario not found', 'error');
        return;
    }
    
    // Set configuration
    document.getElementById('mas-config').value = scenario.configuration.configId;
    handleConfigChange({ target: { value: scenario.configuration.configId } });
    
    // Set zones
    document.getElementById('zone-count').value = scenario.zones;
    currentZones = scenario.zones;
    
    // Set flavor
    document.getElementById('worker-flavor').value = scenario.flavor.flavorId;
    handleFlavorChange({ target: { value: scenario.flavor.flavorId } });
    
    closeModal('modal-scenarios');
    showToast('Scenario loaded successfully!', 'success');
    
    // Auto-calculate
    setTimeout(() => handleCalculate(), 500);
}

/**
 * Handle delete scenario
 */
function handleDeleteScenario(scenarioId) {
    if (!confirm('Are you sure you want to delete this scenario?')) {
        return;
    }
    
    const result = deleteScenario(scenarioId);
    
    if (result.success) {
        showToast('Scenario deleted', 'success');
        loadScenariosModal();
        updateScenarioCount();
    } else {
        showToast('Failed to delete scenario', 'error');
    }
}

/**
 * Handle search scenarios
 */
function handleSearchScenarios(e) {
    const query = e.target.value.toLowerCase();
    const scenarios = loadAllScenarios();
    
    const filtered = scenarios.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.configuration.name.toLowerCase().includes(query) ||
        (s.notes && s.notes.toLowerCase().includes(query))
    );
    
    const listEl = document.getElementById('scenarios-list');
    
    if (filtered.length === 0) {
        listEl.innerHTML = '<p class="text-muted text-center">No scenarios match your search.</p>';
        return;
    }
    
    listEl.innerHTML = filtered.map(scenario => createScenarioCard(scenario)).join('');
    
    // Re-add event listeners
    filtered.forEach(scenario => {
        document.getElementById(`load-${scenario.id}`).addEventListener('click', () => handleLoadScenario(scenario.id));
        document.getElementById(`delete-${scenario.id}`).addEventListener('click', () => handleDeleteScenario(scenario.id));
    });
}

/**
 * Handle delete all scenarios
 */
function handleDeleteAllScenarios() {
    if (!confirm('Are you sure you want to delete ALL scenarios? This cannot be undone.')) {
        return;
    }
    
    const result = deleteAllScenarios();
    
    if (result.success) {
        showToast('All scenarios deleted', 'success');
        loadScenariosModal();
        updateScenarioCount();
    } else {
        showToast('Failed to delete scenarios', 'error');
    }
}

/**
 * Update scenario count in header
 */
function updateScenarioCount() {
    const stats = getStorageStats();
    document.getElementById('scenario-count').textContent = stats ? stats.totalScenarios : 0;
}

/**
 * Show modal
 */
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

/**
 * Close modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

/**
 * Show loading overlay
 */
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Made with Bob
