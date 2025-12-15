/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * IBM Cloud ROKS Worker Node Flavors - Extended Combinations
 */

const WORKER_FLAVORS = [
    // Balanced (bx2) Series - General Purpose
    // 4 vCPU variants
    {
        id: 'bx2-4x16',
        name: 'bx2.4x16',
        series: 'bx2',
        vcpu: 4,
        ram: 16,
        storage: 100,
        storageType: 'BLOCK',
        network: '8Gbps',
        hourlyRate: 0.28,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    {
        id: 'bx2-4x32',
        name: 'bx2.4x32',
        series: 'bx2',
        vcpu: 4,
        ram: 32,
        storage: 100,
        storageType: 'BLOCK',
        network: '8Gbps',
        hourlyRate: 0.38,
        category: 'Balanced',
        description: 'General purpose with higher memory'
    },
    {
        id: 'bx2-4x64',
        name: 'bx2.4x64',
        series: 'bx2',
        vcpu: 4,
        ram: 64,
        storage: 100,
        storageType: 'BLOCK',
        network: '8Gbps',
        hourlyRate: 0.58,
        category: 'Balanced',
        description: 'Memory-optimized for 4 vCPU'
    },
    
    // 8 vCPU variants
    {
        id: 'bx2-8x16',
        name: 'bx2.8x16',
        series: 'bx2',
        vcpu: 8,
        ram: 16,
        storage: 100,
        storageType: 'BLOCK',
        network: '16Gbps',
        hourlyRate: 0.38,
        category: 'Balanced',
        description: 'Compute-optimized for 8 vCPU'
    },
    {
        id: 'bx2-8x32',
        name: 'bx2.8x32',
        series: 'bx2',
        vcpu: 8,
        ram: 32,
        storage: 100,
        storageType: 'BLOCK',
        network: '16Gbps',
        hourlyRate: 0.48,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    {
        id: 'bx2-8x64',
        name: 'bx2.8x64',
        series: 'bx2',
        vcpu: 8,
        ram: 64,
        storage: 100,
        storageType: 'BLOCK',
        network: '16Gbps',
        hourlyRate: 0.68,
        category: 'Balanced',
        description: 'Memory-optimized for 8 vCPU'
    },
    
    // 16 vCPU variants
    {
        id: 'bx2-16x32',
        name: 'bx2.16x32',
        series: 'bx2',
        vcpu: 16,
        ram: 32,
        storage: 100,
        storageType: 'BLOCK',
        network: '24Gbps',
        hourlyRate: 0.74,
        category: 'Balanced',
        description: 'Compute-optimized for 16 vCPU'
    },
    {
        id: 'bx2-16x64',
        name: 'bx2.16x64',
        series: 'bx2',
        vcpu: 16,
        ram: 64,
        storage: 100,
        storageType: 'BLOCK',
        network: '24Gbps',
        hourlyRate: 0.94,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    {
        id: 'bx2-16x128',
        name: 'bx2.16x128',
        series: 'bx2',
        vcpu: 16,
        ram: 128,
        storage: 100,
        storageType: 'BLOCK',
        network: '24Gbps',
        hourlyRate: 1.34,
        category: 'Balanced',
        description: 'Memory-optimized for 16 vCPU'
    },
    
    // 32 vCPU variants
    {
        id: 'bx2-32x64',
        name: 'bx2.32x64',
        series: 'bx2',
        vcpu: 32,
        ram: 64,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 1.51,
        category: 'Balanced',
        description: 'Compute-optimized for 32 vCPU'
    },
    {
        id: 'bx2-32x128',
        name: 'bx2.32x128',
        series: 'bx2',
        vcpu: 32,
        ram: 128,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 1.91,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    {
        id: 'bx2-32x256',
        name: 'bx2.32x256',
        series: 'bx2',
        vcpu: 32,
        ram: 256,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 2.71,
        category: 'Balanced',
        description: 'Memory-optimized for 32 vCPU'
    },
    
    // 48 vCPU variants
    {
        id: 'bx2-48x96',
        name: 'bx2.48x96',
        series: 'bx2',
        vcpu: 48,
        ram: 96,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 2.25,
        category: 'Balanced',
        description: 'Compute-optimized for 48 vCPU'
    },
    {
        id: 'bx2-48x192',
        name: 'bx2.48x192',
        series: 'bx2',
        vcpu: 48,
        ram: 192,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 2.85,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    {
        id: 'bx2-48x384',
        name: 'bx2.48x384',
        series: 'bx2',
        vcpu: 48,
        ram: 384,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 4.05,
        category: 'Balanced',
        description: 'Memory-optimized for 48 vCPU'
    },
    
    // 64 vCPU variants
    {
        id: 'bx2-64x128',
        name: 'bx2.64x128',
        series: 'bx2',
        vcpu: 64,
        ram: 128,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 3.00,
        category: 'Balanced',
        description: 'Compute-optimized for 64 vCPU'
    },
    {
        id: 'bx2-64x256',
        name: 'bx2.64x256',
        series: 'bx2',
        vcpu: 64,
        ram: 256,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 3.80,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    {
        id: 'bx2-64x512',
        name: 'bx2.64x512',
        series: 'bx2',
        vcpu: 64,
        ram: 512,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 5.40,
        category: 'Balanced',
        description: 'Memory-optimized for 64 vCPU'
    },
    
    // 96 vCPU variants
    {
        id: 'bx2-96x192',
        name: 'bx2.96x192',
        series: 'bx2',
        vcpu: 96,
        ram: 192,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 4.48,
        category: 'Balanced',
        description: 'Compute-optimized for 96 vCPU'
    },
    {
        id: 'bx2-96x384',
        name: 'bx2.96x384',
        series: 'bx2',
        vcpu: 96,
        ram: 384,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 5.68,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    
    // 128 vCPU variants
    {
        id: 'bx2-128x256',
        name: 'bx2.128x256',
        series: 'bx2',
        vcpu: 128,
        ram: 256,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 5.97,
        category: 'Balanced',
        description: 'Compute-optimized for 128 vCPU'
    },
    {
        id: 'bx2-128x512',
        name: 'bx2.128x512',
        series: 'bx2',
        vcpu: 128,
        ram: 512,
        storage: 100,
        storageType: 'BLOCK',
        network: '25Gbps',
        hourlyRate: 7.57,
        category: 'Balanced',
        description: 'General purpose balanced compute and memory'
    },
    
    // Balanced Dense (bx3d) Series - Higher Memory Density
    // 4 vCPU variants
    {
        id: 'bx3d-4x20',
        name: 'bx3d.4x20',
        series: 'bx3d',
        vcpu: 4,
        ram: 20,
        storage: 100,
        storageType: 'BLOCK',
        network: '6Gbps',
        hourlyRate: 0.27,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-4x40',
        name: 'bx3d.4x40',
        series: 'bx3d',
        vcpu: 4,
        ram: 40,
        storage: 100,
        storageType: 'BLOCK',
        network: '6Gbps',
        hourlyRate: 0.47,
        category: 'Balanced Dense',
        description: 'High memory density for 4 vCPU'
    },
    
    // 8 vCPU variants
    {
        id: 'bx3d-8x40',
        name: 'bx3d.8x40',
        series: 'bx3d',
        vcpu: 8,
        ram: 40,
        storage: 100,
        storageType: 'BLOCK',
        network: '12Gbps',
        hourlyRate: 0.51,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-8x80',
        name: 'bx3d.8x80',
        series: 'bx3d',
        vcpu: 8,
        ram: 80,
        storage: 100,
        storageType: 'BLOCK',
        network: '12Gbps',
        hourlyRate: 0.91,
        category: 'Balanced Dense',
        description: 'High memory density for 8 vCPU'
    },
    
    // 16 vCPU variants
    {
        id: 'bx3d-16x80',
        name: 'bx3d.16x80',
        series: 'bx3d',
        vcpu: 16,
        ram: 80,
        storage: 100,
        storageType: 'BLOCK',
        network: '24Gbps',
        hourlyRate: 1.01,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-16x160',
        name: 'bx3d.16x160',
        series: 'bx3d',
        vcpu: 16,
        ram: 160,
        storage: 100,
        storageType: 'BLOCK',
        network: '24Gbps',
        hourlyRate: 1.81,
        category: 'Balanced Dense',
        description: 'High memory density for 16 vCPU'
    },
    
    // 24 vCPU variants
    {
        id: 'bx3d-24x120',
        name: 'bx3d.24x120',
        series: 'bx3d',
        vcpu: 24,
        ram: 120,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 1.50,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-24x240',
        name: 'bx3d.24x240',
        series: 'bx3d',
        vcpu: 24,
        ram: 240,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 2.70,
        category: 'Balanced Dense',
        description: 'High memory density for 24 vCPU'
    },
    
    // 32 vCPU variants
    {
        id: 'bx3d-32x160',
        name: 'bx3d.32x160',
        series: 'bx3d',
        vcpu: 32,
        ram: 160,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 1.99,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-32x320',
        name: 'bx3d.32x320',
        series: 'bx3d',
        vcpu: 32,
        ram: 320,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 3.59,
        category: 'Balanced Dense',
        description: 'High memory density for 32 vCPU'
    },
    
    // 48 vCPU variants
    {
        id: 'bx3d-48x240',
        name: 'bx3d.48x240',
        series: 'bx3d',
        vcpu: 48,
        ram: 240,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 2.98,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-48x480',
        name: 'bx3d.48x480',
        series: 'bx3d',
        vcpu: 48,
        ram: 480,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 5.38,
        category: 'Balanced Dense',
        description: 'High memory density for 48 vCPU'
    },
    
    // 64 vCPU variants
    {
        id: 'bx3d-64x320',
        name: 'bx3d.64x320',
        series: 'bx3d',
        vcpu: 64,
        ram: 320,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 3.97,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-64x640',
        name: 'bx3d.64x640',
        series: 'bx3d',
        vcpu: 64,
        ram: 640,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 7.17,
        category: 'Balanced Dense',
        description: 'High memory density for 64 vCPU'
    },
    
    // 96 vCPU variants
    {
        id: 'bx3d-96x480',
        name: 'bx3d.96x480',
        series: 'bx3d',
        vcpu: 96,
        ram: 480,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 5.94,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-96x960',
        name: 'bx3d.96x960',
        series: 'bx3d',
        vcpu: 96,
        ram: 960,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 10.74,
        category: 'Balanced Dense',
        description: 'High memory density for 96 vCPU'
    },
    
    // 128 vCPU variants
    {
        id: 'bx3d-128x640',
        name: 'bx3d.128x640',
        series: 'bx3d',
        vcpu: 128,
        ram: 640,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 7.92,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-128x1280',
        name: 'bx3d.128x1280',
        series: 'bx3d',
        vcpu: 128,
        ram: 1280,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 14.32,
        category: 'Balanced Dense',
        description: 'High memory density for 128 vCPU'
    },
    
    // 176 vCPU variants
    {
        id: 'bx3d-176x880',
        name: 'bx3d.176x880',
        series: 'bx3d',
        vcpu: 176,
        ram: 880,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 10.88,
        category: 'Balanced Dense',
        description: 'Higher memory density for memory-intensive workloads'
    },
    {
        id: 'bx3d-176x1760',
        name: 'bx3d.176x1760',
        series: 'bx3d',
        vcpu: 176,
        ram: 1760,
        storage: 100,
        storageType: 'BLOCK',
        network: '32Gbps',
        hourlyRate: 19.68,
        category: 'Balanced Dense',
        description: 'High memory density for 176 vCPU'
    }
];

/**
 * Get flavor by ID
 * @param {string} flavorId - Flavor ID
 * @returns {object|null} Flavor object or null if not found
 */
function getFlavorById(flavorId) {
    return WORKER_FLAVORS.find(flavor => flavor.id === flavorId) || null;
}

/**
 * Get flavor by name
 * @param {string} flavorName - Flavor name (e.g., 'bx2.16x64')
 * @returns {object|null} Flavor object or null if not found
 */
function getFlavorByName(flavorName) {
    return WORKER_FLAVORS.find(flavor => flavor.name === flavorName) || null;
}

/**
 * Get all flavors
 * @returns {array} Array of all worker flavors
 */
function getAllFlavors() {
    return WORKER_FLAVORS;
}

/**
 * Get flavors by series
 * @param {string} series - Series name ('bx2' or 'bx3d')
 * @returns {array} Array of flavors in the series
 */
function getFlavorsBySeries(series) {
    return WORKER_FLAVORS.filter(flavor => flavor.series === series);
}

/**
 * Recommend flavors for a given MAS configuration
 * @param {object} config - MAS configuration object
 * @returns {array} Array of recommended flavors with reasons
 */
function recommendFlavors(config) {
    const recommendations = [];
    
    // Find flavors that meet or exceed the requirements
    const suitableFlavors = WORKER_FLAVORS.filter(flavor => 
        flavor.vcpu >= config.vcpu && flavor.ram >= config.ram
    );
    
    if (suitableFlavors.length === 0) {
        return [{
            flavor: null,
            reason: 'No single flavor meets the requirements. Consider using larger flavors or adjusting configuration.',
            priority: 'high'
        }];
    }
    
    // Sort by cost efficiency (closest match to requirements)
    suitableFlavors.sort((a, b) => {
        const aCost = a.hourlyRate;
        const bCost = b.hourlyRate;
        const aOverhead = (a.vcpu - config.vcpu) + (a.ram - config.ram);
        const bOverhead = (b.vcpu - config.vcpu) + (b.ram - config.ram);
        
        // Prefer lower overhead, then lower cost
        if (aOverhead !== bOverhead) {
            return aOverhead - bOverhead;
        }
        return aCost - bCost;
    });
    
    // Top recommendation - best match
    if (suitableFlavors[0]) {
        recommendations.push({
            flavor: suitableFlavors[0],
            reason: 'Best cost-performance match for your requirements',
            priority: 'high'
        });
    }
    
    // Alternative - bx3d if not already recommended
    const bx3dOption = suitableFlavors.find(f => 
        f.series === 'bx3d' && f.id !== suitableFlavors[0].id
    );
    if (bx3dOption) {
        recommendations.push({
            flavor: bx3dOption,
            reason: 'Higher memory density option for memory-intensive workloads',
            priority: 'medium'
        });
    }
    
    // Budget option - cheapest that meets requirements
    const budgetOption = suitableFlavors[suitableFlavors.length - 1];
    if (budgetOption && budgetOption.id !== suitableFlavors[0].id) {
        recommendations.push({
            flavor: budgetOption,
            reason: 'Most cost-effective option meeting minimum requirements',
            priority: 'low'
        });
    }
    
    return recommendations;
}

/**
 * Validate if a flavor meets configuration requirements
 * @param {object} flavor - Flavor object
 * @param {object} config - MAS configuration object
 * @returns {object} Validation result
 */
function validateFlavor(flavor, config) {
    const issues = [];
    
    if (flavor.vcpu < config.vcpu) {
        issues.push({
            severity: 'high',
            field: 'vcpu',
            message: `Flavor vCPU (${flavor.vcpu}) below configuration requirement (${config.vcpu})`
        });
    }
    
    if (flavor.ram < config.ram) {
        issues.push({
            severity: 'high',
            field: 'ram',
            message: `Flavor RAM (${flavor.ram}GB) below configuration requirement (${config.ram}GB)`
        });
    }
    
    // Check for over-provisioning (>50% more than needed)
    if (flavor.vcpu > config.vcpu * 1.5) {
        issues.push({
            severity: 'low',
            field: 'vcpu',
            message: `Flavor may be over-provisioned for vCPU (${flavor.vcpu} vs ${config.vcpu} required)`
        });
    }
    
    if (flavor.ram > config.ram * 1.5) {
        issues.push({
            severity: 'low',
            field: 'ram',
            message: `Flavor may be over-provisioned for RAM (${flavor.ram}GB vs ${config.ram}GB required)`
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
        WORKER_FLAVORS,
        getFlavorById,
        getFlavorByName,
        getAllFlavors,
        getFlavorsBySeries,
        recommendFlavors,
        validateFlavor
    };
}

// Made with Bob
