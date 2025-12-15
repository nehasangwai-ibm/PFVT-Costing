/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * Recommendations Engine
 */

/**
 * Generate all recommendations for a configuration
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @param {number} zones - Number of zones
 * @param {object} costs - Cost calculation results
 * @param {object} costScore - Cost score object
 * @param {array} risks - Array of risk objects
 * @returns {array} Array of recommendation objects
 */
function generateRecommendations(config, flavor, zones, costs, costScore, risks) {
    const recommendations = [];
    
    // Cost score-based recommendations
    const scoreRecs = getScoreRecommendations(costScore, zones);
    recommendations.push(...scoreRecs);
    
    // Configuration-specific recommendations
    const configRecs = getConfigurationRecommendations(config, flavor, zones);
    recommendations.push(...configRecs);
    
    // Flavor optimization recommendations
    const flavorRecs = getFlavorRecommendations(config, flavor, costs);
    recommendations.push(...flavorRecs);
    
    // Zone-based recommendations
    const zoneRecs = getZoneRecommendations(zones, config, costs);
    recommendations.push(...zoneRecs);
    
    // Risk-based recommendations
    const riskRecs = getRiskBasedRecommendations(risks);
    recommendations.push(...riskRecs);
    
    // Best practices
    const bestPractices = getBestPractices(config, zones);
    recommendations.push(...bestPractices);
    
    // Remove duplicates and sort by priority
    const uniqueRecs = removeDuplicateRecommendations(recommendations);
    return sortRecommendationsByPriority(uniqueRecs);
}

/**
 * Get recommendations based on cost score
 * @param {object} costScore - Cost score object
 * @param {number} zones - Number of zones
 * @returns {array} Array of recommendations
 */
function getScoreRecommendations(costScore, zones) {
    const recommendations = [];
    
    if (costScore.score === 'GREEN') {
        recommendations.push({
            id: 'cost-optimal',
            type: 'success',
            priority: 'low',
            title: 'Cost is Optimal',
            message: 'Your configuration is cost-effective and within the optimal range.',
            action: 'No immediate action required'
        });
    } else if (costScore.score === 'AMBER') {
        recommendations.push({
            id: 'cost-moderate',
            type: 'optimization',
            priority: 'medium',
            title: 'Cost Optimization Opportunity',
            message: 'Your configuration has moderate costs. Review for potential optimizations.',
            action: 'Consider smaller flavors or reducing zones if high availability is not critical'
        });
    } else if (costScore.score === 'RED') {
        recommendations.push({
            id: 'cost-high',
            type: 'critical',
            priority: 'high',
            title: 'High Cost Detected',
            message: 'Your configuration has high costs that may impact budget.',
            action: 'Review flavor selection, number of zones, and worker count for optimization'
        });
    }
    
    return recommendations;
}

/**
 * Get configuration-specific recommendations
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @param {number} zones - Number of zones
 * @returns {array} Array of recommendations
 */
function getConfigurationRecommendations(config, flavor, zones) {
    const recommendations = [];
    
    // IoT-specific recommendations
    if (config.components.includes('IoT') && config.components.length === 2) {
        recommendations.push({
            id: 'iot-optimization',
            type: 'optimization',
            priority: 'medium',
            title: 'IoT Configuration Optimization',
            message: 'IoT-focused deployments can often use smaller instance types.',
            action: 'Consider bx2.8x32 or bx3d.8x40 for cost savings if performance is adequate'
        });
    }
    
    // Large deployment recommendations
    if (config.workers >= 9) {
        recommendations.push({
            id: 'large-deployment',
            type: 'scalability',
            priority: 'high',
            title: 'Large Deployment Detected',
            message: 'Large deployments require careful planning for scalability and management.',
            action: 'Plan for auto-scaling, load balancing, and monitoring infrastructure'
        });
    }
    
    // Predictive maintenance suite
    if (config.components.includes('Predict') && config.components.includes('Monitor')) {
        recommendations.push({
            id: 'predictive-maintenance',
            type: 'best-practice',
            priority: 'medium',
            title: 'Predictive Maintenance Suite',
            message: 'Full predictive maintenance requires robust infrastructure.',
            action: 'Ensure adequate resources for AI/ML workloads and data processing'
        });
    }
    
    // MVI (Visual Inspection) recommendations
    if (config.components.includes('MVI')) {
        recommendations.push({
            id: 'mvi-resources',
            type: 'performance',
            priority: 'medium',
            title: 'Visual Inspection Workload',
            message: 'MVI requires sufficient resources for image processing.',
            action: 'Consider flavors with higher memory for optimal performance'
        });
    }
    
    return recommendations;
}

/**
 * Get flavor optimization recommendations
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @param {object} costs - Cost calculation results
 * @returns {array} Array of recommendations
 */
function getFlavorRecommendations(config, flavor, costs) {
    const recommendations = [];
    
    // Check if flavor is optimal
    const vcpuMatch = Math.abs(flavor.vcpu - config.vcpu) / config.vcpu;
    const ramMatch = Math.abs(flavor.ram - config.ram) / config.ram;
    
    // Flavor is significantly larger than needed
    if (vcpuMatch > 0.5 || ramMatch > 0.5) {
        recommendations.push({
            id: 'flavor-oversized',
            type: 'cost',
            priority: 'medium',
            title: 'Flavor May Be Oversized',
            message: 'Selected flavor has significantly more resources than baseline requirements.',
            action: 'Review flavor recommendations for better cost-performance match'
        });
    }
    
    // Recommend bx3d for memory-intensive workloads
    if (config.ram >= 32 && flavor.series === 'bx2') {
        recommendations.push({
            id: 'consider-bx3d',
            type: 'optimization',
            priority: 'low',
            title: 'Consider Memory-Dense Flavors',
            message: 'For memory-intensive workloads, bx3d series offers better memory density.',
            action: 'Evaluate bx3d series flavors for potential cost savings'
        });
    }
    
    return recommendations;
}

/**
 * Get zone-based recommendations
 * @param {number} zones - Number of zones
 * @param {object} config - MAS configuration
 * @param {object} costs - Cost calculation results
 * @returns {array} Array of recommendations
 */
function getZoneRecommendations(zones, config, costs) {
    const recommendations = [];
    
    if (zones === 1) {
        recommendations.push({
            id: 'single-zone-warning',
            type: 'availability',
            priority: 'high',
            title: 'Single Zone Deployment',
            message: 'Single zone deployments lack zone-level redundancy.',
            action: 'Consider multi-zone (2+ zones) for production workloads to ensure high availability'
        });
    } else if (zones === 2) {
        recommendations.push({
            id: 'multi-zone-good',
            type: 'success',
            priority: 'low',
            title: 'Multi-Zone Deployment',
            message: 'Two-zone deployment provides good balance of availability and cost.',
            action: 'Recommended configuration for production workloads'
        });
    } else if (zones === 3) {
        recommendations.push({
            id: 'three-zone-premium',
            type: 'info',
            priority: 'low',
            title: 'Maximum Redundancy',
            message: 'Three-zone deployment provides maximum availability.',
            action: 'Ensure the additional cost is justified by availability requirements'
        });
    }
    
    return recommendations;
}

/**
 * Get recommendations based on detected risks
 * @param {array} risks - Array of risk objects
 * @returns {array} Array of recommendations
 */
function getRiskBasedRecommendations(risks) {
    const recommendations = [];
    
    const highRisks = risks.filter(r => r.severity === 'high');
    
    if (highRisks.length > 0) {
        recommendations.push({
            id: 'address-high-risks',
            type: 'critical',
            priority: 'high',
            title: 'Critical Issues Detected',
            message: `${highRisks.length} high-severity risk(s) detected.`,
            action: 'Address all high-severity risks before deployment'
        });
    }
    
    return recommendations;
}

/**
 * Get best practice recommendations
 * @param {object} config - MAS configuration
 * @param {number} zones - Number of zones
 * @returns {array} Array of recommendations
 */
function getBestPractices(config, zones) {
    const recommendations = [];
    
    recommendations.push({
        id: 'monitoring',
        type: 'best-practice',
        priority: 'medium',
        title: 'Implement Monitoring',
        message: 'Set up comprehensive monitoring for your MAS deployment.',
        action: 'Configure alerts for resource utilization, performance metrics, and cost thresholds'
    });
    
    recommendations.push({
        id: 'backup-strategy',
        type: 'best-practice',
        priority: 'medium',
        title: 'Backup and Disaster Recovery',
        message: 'Ensure proper backup and disaster recovery procedures.',
        action: 'Implement regular backups and test recovery procedures'
    });
    
    if (config.workers >= 3) {
        recommendations.push({
            id: 'capacity-planning',
            type: 'best-practice',
            priority: 'low',
            title: 'Capacity Planning',
            message: 'Plan for future growth and scaling requirements.',
            action: 'Review resource utilization regularly and adjust as needed'
        });
    }
    
    return recommendations;
}

/**
 * Remove duplicate recommendations
 * @param {array} recommendations - Array of recommendation objects
 * @returns {array} Deduplicated recommendations
 */
function removeDuplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
        if (seen.has(rec.id)) {
            return false;
        }
        seen.add(rec.id);
        return true;
    });
}

/**
 * Sort recommendations by priority
 * @param {array} recommendations - Array of recommendation objects
 * @returns {array} Sorted recommendations
 */
function sortRecommendationsByPriority(recommendations) {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recommendations.sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );
}

/**
 * Filter recommendations by type
 * @param {array} recommendations - Array of recommendation objects
 * @param {string} type - Recommendation type
 * @returns {array} Filtered recommendations
 */
function filterRecommendationsByType(recommendations, type) {
    return recommendations.filter(rec => rec.type === type);
}

/**
 * Get recommendation summary
 * @param {array} recommendations - Array of recommendation objects
 * @returns {object} Summary statistics
 */
function getRecommendationSummary(recommendations) {
    return {
        total: recommendations.length,
        high: recommendations.filter(r => r.priority === 'high').length,
        medium: recommendations.filter(r => r.priority === 'medium').length,
        low: recommendations.filter(r => r.priority === 'low').length,
        types: {
            critical: recommendations.filter(r => r.type === 'critical').length,
            optimization: recommendations.filter(r => r.type === 'optimization').length,
            bestPractice: recommendations.filter(r => r.type === 'best-practice').length,
            success: recommendations.filter(r => r.type === 'success').length
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateRecommendations,
        getScoreRecommendations,
        getConfigurationRecommendations,
        getFlavorRecommendations,
        getZoneRecommendations,
        getRiskBasedRecommendations,
        getBestPractices,
        filterRecommendationsByType,
        getRecommendationSummary
    };
}

// Made with Bob
