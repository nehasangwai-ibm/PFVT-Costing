/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * MAS Baseline Configurations for ROKS Clusters
 */

const MAS_CONFIGURATIONS = [
    {
        id: 'config-1',
        name: 'Core + Manage',
        components: ['Core', 'Manage'],
        workers: 3,
        vcpu: 16,
        ram: 32,
        disk: 250,
        description: 'Basic MAS deployment with asset management capabilities',
        useCase: 'Asset management and maintenance operations'
    },
    {
        id: 'config-2',
        name: 'Core + Manage + Assist',
        components: ['Core', 'Manage', 'Assist'],
        workers: 4,
        vcpu: 16,
        ram: 32,
        disk: 250,
        description: 'Asset management with AI-powered assistance',
        useCase: 'Asset management with intelligent recommendations'
    },
    {
        id: 'config-3',
        name: 'Core + Manage + Monitor + Predict + IoT',
        components: ['Core', 'Manage', 'Monitor', 'Predict', 'IoT'],
        workers: 9,
        vcpu: 16,
        ram: 32,
        disk: 300,
        description: 'Full predictive maintenance suite with IoT integration',
        useCase: 'Complete predictive maintenance and IoT device management'
    },
    {
        id: 'config-4',
        name: 'Core + IoT',
        components: ['Core', 'IoT'],
        workers: 3,
        vcpu: 8,
        ram: 16,
        disk: 200,
        description: 'IoT-focused deployment for device management',
        useCase: 'IoT device connectivity and data collection'
    },
    {
        id: 'config-5',
        name: 'Core + Manage + MVI',
        components: ['Core', 'Manage', 'MVI'],
        workers: 3,
        vcpu: 16,
        ram: 32,
        disk: 250,
        description: 'Asset management with visual inspection capabilities',
        useCase: 'Asset management with computer vision inspection'
    },
    {
        id: 'config-6',
        name: 'Core + Industry Solutions',
        components: ['Core', 'Industry'],
        industrySolutions: [
            'Health',
            'Aviation',
            'Civil',
            'Nuclear',
            'OilAndGas',
            'Transportation',
            'Utilities',
            'Accelerator'
        ],
        workers: 3,
        vcpu: 16,
        ram: 32,
        disk: 250,
        description: 'Industry-specific solutions (select one)',
        useCase: 'Specialized industry vertical solutions'
    }
];

/**
 * Get configuration by ID
 * @param {string} configId - Configuration ID
 * @returns {object|null} Configuration object or null if not found
 */
function getConfigurationById(configId) {
    return MAS_CONFIGURATIONS.find(config => config.id === configId) || null;
}

/**
 * Get all configurations
 * @returns {array} Array of all MAS configurations
 */
function getAllConfigurations() {
    return MAS_CONFIGURATIONS;
}

/**
 * Validate if a configuration meets minimum requirements
 * @param {object} config - Configuration object
 * @param {object} input - User input (workers, vcpu, ram, disk)
 * @returns {object} Validation result with status and messages
 */
function validateConfiguration(config, input) {
    const issues = [];
    
    if (input.workers < config.workers) {
        issues.push({
            severity: 'high',
            field: 'workers',
            message: `Workers (${input.workers}) below baseline minimum (${config.workers})`
        });
    }
    
    if (input.vcpu < config.vcpu) {
        issues.push({
            severity: 'high',
            field: 'vcpu',
            message: `vCPU (${input.vcpu}) below baseline requirement (${config.vcpu})`
        });
    }
    
    if (input.ram < config.ram) {
        issues.push({
            severity: 'high',
            field: 'ram',
            message: `RAM (${input.ram}GB) below baseline requirement (${config.ram}GB)`
        });
    }
    
    if (input.disk < config.disk) {
        issues.push({
            severity: 'medium',
            field: 'disk',
            message: `Disk (${input.disk}GB) below baseline requirement (${config.disk}GB)`
        });
    }
    
    return {
        valid: issues.filter(i => i.severity === 'high').length === 0,
        issues: issues
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MAS_CONFIGURATIONS,
        getConfigurationById,
        getAllConfigurations,
        validateConfiguration
    };
}

// Made with Bob
