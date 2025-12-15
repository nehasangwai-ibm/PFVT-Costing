/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * localStorage Wrapper for Scenario Management
 */

const STORAGE_KEY = 'mas-pfvt-scenarios';
const MAX_SCENARIOS = 100;
const STORAGE_VERSION = '1.0';

/**
 * Initialize storage structure
 * @returns {object} Initial storage structure
 */
function initializeStorage() {
    return {
        version: STORAGE_VERSION,
        scenarios: [],
        metadata: {
            lastModified: new Date().toISOString(),
            scenarioCount: 0
        }
    };
}

/**
 * Get all data from localStorage
 * @returns {object} Storage data
 */
function getStorageData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return initializeStorage();
        }
        
        const parsed = JSON.parse(data);
        
        // Validate version
        if (parsed.version !== STORAGE_VERSION) {
            console.warn('Storage version mismatch, reinitializing');
            return initializeStorage();
        }
        
        return parsed;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return initializeStorage();
    }
}

/**
 * Save data to localStorage
 * @param {object} data - Data to save
 * @returns {boolean} Success status
 */
function saveStorageData(data) {
    try {
        data.metadata.lastModified = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        
        // Check if quota exceeded
        if (error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded, attempting cleanup');
            enforceScenarioLimit(50); // Reduce to 50 scenarios
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            } catch (retryError) {
                console.error('Retry failed:', retryError);
                return false;
            }
        }
        
        return false;
    }
}

/**
 * Save a scenario
 * @param {object} scenario - Scenario object to save
 * @returns {object} Result with success status and scenario ID
 */
function saveScenario(scenario) {
    try {
        const data = getStorageData();
        
        // Generate ID if not present
        if (!scenario.id) {
            scenario.id = generateScenarioId();
        }
        
        // Add timestamps
        if (!scenario.createdAt) {
            scenario.createdAt = new Date().toISOString();
        }
        scenario.updatedAt = new Date().toISOString();
        
        // Check if scenario already exists (update)
        const existingIndex = data.scenarios.findIndex(s => s.id === scenario.id);
        if (existingIndex >= 0) {
            data.scenarios[existingIndex] = scenario;
        } else {
            // Add new scenario
            data.scenarios.push(scenario);
            
            // Enforce limit
            if (data.scenarios.length > MAX_SCENARIOS) {
                // Remove oldest scenarios
                data.scenarios.sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                data.scenarios = data.scenarios.slice(-MAX_SCENARIOS);
            }
        }
        
        data.metadata.scenarioCount = data.scenarios.length;
        
        const success = saveStorageData(data);
        
        return {
            success: success,
            scenarioId: scenario.id,
            message: success ? 'Scenario saved successfully' : 'Failed to save scenario'
        };
    } catch (error) {
        console.error('Error saving scenario:', error);
        return {
            success: false,
            scenarioId: null,
            message: 'Error saving scenario: ' + error.message
        };
    }
}

/**
 * Load a scenario by ID
 * @param {string} scenarioId - Scenario ID
 * @returns {object|null} Scenario object or null if not found
 */
function loadScenario(scenarioId) {
    try {
        const data = getStorageData();
        return data.scenarios.find(s => s.id === scenarioId) || null;
    } catch (error) {
        console.error('Error loading scenario:', error);
        return null;
    }
}

/**
 * Load all scenarios
 * @returns {array} Array of scenario objects
 */
function loadAllScenarios() {
    try {
        const data = getStorageData();
        // Sort by creation date (newest first)
        return data.scenarios.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    } catch (error) {
        console.error('Error loading scenarios:', error);
        return [];
    }
}

/**
 * Delete a scenario
 * @param {string} scenarioId - Scenario ID
 * @returns {object} Result with success status
 */
function deleteScenario(scenarioId) {
    try {
        const data = getStorageData();
        const initialCount = data.scenarios.length;
        
        data.scenarios = data.scenarios.filter(s => s.id !== scenarioId);
        data.metadata.scenarioCount = data.scenarios.length;
        
        const success = saveStorageData(data);
        const deleted = initialCount > data.scenarios.length;
        
        return {
            success: success && deleted,
            message: deleted ? 'Scenario deleted successfully' : 'Scenario not found'
        };
    } catch (error) {
        console.error('Error deleting scenario:', error);
        return {
            success: false,
            message: 'Error deleting scenario: ' + error.message
        };
    }
}

/**
 * Delete all scenarios
 * @returns {object} Result with success status
 */
function deleteAllScenarios() {
    try {
        const data = initializeStorage();
        const success = saveStorageData(data);
        
        return {
            success: success,
            message: success ? 'All scenarios deleted' : 'Failed to delete scenarios'
        };
    } catch (error) {
        console.error('Error deleting all scenarios:', error);
        return {
            success: false,
            message: 'Error deleting scenarios: ' + error.message
        };
    }
}

/**
 * Search scenarios
 * @param {string} query - Search query
 * @returns {array} Matching scenarios
 */
function searchScenarios(query) {
    try {
        const scenarios = loadAllScenarios();
        const lowerQuery = query.toLowerCase();
        
        return scenarios.filter(scenario => 
            scenario.name.toLowerCase().includes(lowerQuery) ||
            scenario.configuration.name.toLowerCase().includes(lowerQuery) ||
            (scenario.notes && scenario.notes.toLowerCase().includes(lowerQuery))
        );
    } catch (error) {
        console.error('Error searching scenarios:', error);
        return [];
    }
}

/**
 * Filter scenarios by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {array} Filtered scenarios
 */
function filterScenariosByDate(startDate, endDate) {
    try {
        const scenarios = loadAllScenarios();
        
        return scenarios.filter(scenario => {
            const createdDate = new Date(scenario.createdAt);
            return createdDate >= startDate && createdDate <= endDate;
        });
    } catch (error) {
        console.error('Error filtering scenarios:', error);
        return [];
    }
}

/**
 * Filter scenarios by cost score
 * @param {string} score - Cost score ('GREEN', 'AMBER', 'RED')
 * @returns {array} Filtered scenarios
 */
function filterScenariosByScore(score) {
    try {
        const scenarios = loadAllScenarios();
        
        return scenarios.filter(scenario => 
            scenario.results && 
            scenario.results.costScore && 
            scenario.results.costScore.score === score
        );
    } catch (error) {
        console.error('Error filtering scenarios by score:', error);
        return [];
    }
}

/**
 * Get storage statistics
 * @returns {object} Storage statistics
 */
function getStorageStats() {
    try {
        const data = getStorageData();
        const scenarios = data.scenarios;
        
        const totalCosts = scenarios.map(s => 
            s.results?.costs?.total?.monthly || 0
        );
        
        const scores = scenarios.reduce((acc, s) => {
            const score = s.results?.costScore?.score;
            if (score) {
                acc[score] = (acc[score] || 0) + 1;
            }
            return acc;
        }, {});
        
        return {
            totalScenarios: scenarios.length,
            maxScenarios: MAX_SCENARIOS,
            utilizationPercent: (scenarios.length / MAX_SCENARIOS) * 100,
            costScores: scores,
            averageMonthlyCost: totalCosts.length > 0 
                ? totalCosts.reduce((a, b) => a + b, 0) / totalCosts.length 
                : 0,
            minMonthlyCost: totalCosts.length > 0 ? Math.min(...totalCosts) : 0,
            maxMonthlyCost: totalCosts.length > 0 ? Math.max(...totalCosts) : 0,
            lastModified: data.metadata.lastModified
        };
    } catch (error) {
        console.error('Error getting storage stats:', error);
        return null;
    }
}

/**
 * Enforce scenario limit
 * @param {number} limit - Maximum number of scenarios to keep
 * @returns {boolean} Success status
 */
function enforceScenarioLimit(limit = MAX_SCENARIOS) {
    try {
        const data = getStorageData();
        
        if (data.scenarios.length > limit) {
            // Sort by creation date and keep newest
            data.scenarios.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            data.scenarios = data.scenarios.slice(0, limit);
            data.metadata.scenarioCount = data.scenarios.length;
            
            return saveStorageData(data);
        }
        
        return true;
    } catch (error) {
        console.error('Error enforcing scenario limit:', error);
        return false;
    }
}

/**
 * Generate unique scenario ID
 * @returns {string} Unique ID
 */
function generateScenarioId() {
    return 'scenario-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Export scenarios to JSON
 * @param {array} scenarioIds - Array of scenario IDs to export (optional, exports all if not provided)
 * @returns {string} JSON string
 */
function exportScenariosToJSON(scenarioIds = null) {
    try {
        let scenarios;
        
        if (scenarioIds && scenarioIds.length > 0) {
            scenarios = scenarioIds.map(id => loadScenario(id)).filter(s => s !== null);
        } else {
            scenarios = loadAllScenarios();
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            version: STORAGE_VERSION,
            scenarioCount: scenarios.length,
            scenarios: scenarios
        };
        
        return JSON.stringify(exportData, null, 2);
    } catch (error) {
        console.error('Error exporting scenarios:', error);
        return null;
    }
}

/**
 * Import scenarios from JSON
 * @param {string} jsonString - JSON string containing scenarios
 * @returns {object} Result with success status and count
 */
function importScenariosFromJSON(jsonString) {
    try {
        const importData = JSON.parse(jsonString);
        
        if (!importData.scenarios || !Array.isArray(importData.scenarios)) {
            return {
                success: false,
                count: 0,
                message: 'Invalid import data format'
            };
        }
        
        let successCount = 0;
        
        importData.scenarios.forEach(scenario => {
            // Generate new ID to avoid conflicts
            scenario.id = generateScenarioId();
            const result = saveScenario(scenario);
            if (result.success) {
                successCount++;
            }
        });
        
        return {
            success: successCount > 0,
            count: successCount,
            message: `Imported ${successCount} of ${importData.scenarios.length} scenarios`
        };
    } catch (error) {
        console.error('Error importing scenarios:', error);
        return {
            success: false,
            count: 0,
            message: 'Error importing scenarios: ' + error.message
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveScenario,
        loadScenario,
        loadAllScenarios,
        deleteScenario,
        deleteAllScenarios,
        searchScenarios,
        filterScenariosByDate,
        filterScenariosByScore,
        getStorageStats,
        enforceScenarioLimit,
        exportScenariosToJSON,
        importScenariosFromJSON
    };
}

// Made with Bob
