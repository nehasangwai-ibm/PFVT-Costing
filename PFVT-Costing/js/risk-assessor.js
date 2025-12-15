/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * Risk Assessment Engine
 */

/**
 * Assess all risks for a configuration
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @param {number} zones - Number of zones
 * @param {object} costs - Cost calculation results
 * @returns {array} Array of risk objects
 */
function assessRisks(config, flavor, zones, costs) {
    const risks = [];
    
    // Configuration validation risks
    const configRisks = assessConfigurationRisks(config, flavor);
    risks.push(...configRisks);
    
    // Zone-related risks
    const zoneRisks = assessZoneRisks(zones, config);
    risks.push(...zoneRisks);
    
    // Cost-related risks
    const costRisks = assessCostRisks(costs, zones);
    risks.push(...costRisks);
    
    // Resource provisioning risks
    const provisioningRisks = assessProvisioningRisks(config, flavor);
    risks.push(...provisioningRisks);
    
    // Sort by severity (high -> medium -> low)
    const severityOrder = { high: 0, medium: 1, low: 2 };
    risks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    return risks;
}

/**
 * Assess configuration-specific risks
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @returns {array} Array of risk objects
 */
function assessConfigurationRisks(config, flavor) {
    const risks = [];
    
    // vCPU validation
    if (flavor.vcpu < config.vcpu) {
        risks.push({
            id: 'insufficient-vcpu',
            severity: 'high',
            category: 'configuration',
            title: 'Insufficient vCPU',
            message: `Flavor vCPU (${flavor.vcpu}) is below baseline requirement (${config.vcpu})`,
            impact: 'Performance degradation and potential application failures',
            recommendation: 'Select a flavor with at least ' + config.vcpu + ' vCPU'
        });
    }
    
    // RAM validation
    if (flavor.ram < config.ram) {
        risks.push({
            id: 'insufficient-ram',
            severity: 'high',
            category: 'configuration',
            title: 'Insufficient RAM',
            message: `Flavor RAM (${flavor.ram}GB) is below baseline requirement (${config.ram}GB)`,
            impact: 'Memory pressure, OOM errors, and application instability',
            recommendation: 'Select a flavor with at least ' + config.ram + 'GB RAM'
        });
    }
    
    // Disk space validation
    if (flavor.storage < config.disk) {
        risks.push({
            id: 'insufficient-disk',
            severity: 'medium',
            category: 'configuration',
            title: 'Insufficient Disk Space',
            message: `Flavor storage (${flavor.storage}GB) is below baseline requirement (${config.disk}GB)`,
            impact: 'Potential storage capacity issues',
            recommendation: 'Consider additional storage volumes or larger flavor'
        });
    }
    
    return risks;
}

/**
 * Assess zone-related risks
 * @param {number} zones - Number of zones
 * @param {object} config - MAS configuration
 * @returns {array} Array of risk objects
 */
function assessZoneRisks(zones, config) {
    const risks = [];
    
    // Single zone for production workloads
    if (zones === 1 && config.workers >= 3) {
        risks.push({
            id: 'single-zone-production',
            severity: 'medium',
            category: 'availability',
            title: 'Single Zone Deployment',
            message: 'Production workload deployed in single zone',
            impact: 'No zone-level redundancy; zone failure affects entire deployment',
            recommendation: 'Consider multi-zone deployment (2+ zones) for high availability'
        });
    }
    
    // Large deployment in single zone
    if (zones === 1 && config.workers >= 6) {
        risks.push({
            id: 'large-single-zone',
            severity: 'high',
            category: 'availability',
            title: 'Large Single Zone Deployment',
            message: 'Large deployment without zone redundancy',
            impact: 'High risk of complete service disruption on zone failure',
            recommendation: 'Strongly recommend multi-zone deployment for this scale'
        });
    }
    
    return risks;
}

/**
 * Assess cost-related risks
 * @param {object} costs - Cost calculation results
 * @param {number} zones - Number of zones
 * @returns {array} Array of risk objects
 */
function assessCostRisks(costs, zones) {
    const risks = [];
    const monthlyCost = costs.costs.total.monthly;
    
    // High cost thresholds (zone-aware)
    const highCostThreshold = zones === 1 ? 10000 : zones === 2 ? 20000 : 30000;
    const veryHighCostThreshold = zones === 1 ? 20000 : zones === 2 ? 40000 : 60000;
    
    if (monthlyCost > veryHighCostThreshold) {
        risks.push({
            id: 'very-high-cost',
            severity: 'high',
            category: 'cost',
            title: 'Very High Monthly Cost',
            message: `Monthly cost ($${monthlyCost.toFixed(2)}) significantly exceeds typical range`,
            impact: 'Budget overrun and potential cost optimization opportunities missed',
            recommendation: 'Review configuration for right-sizing opportunities'
        });
    } else if (monthlyCost > highCostThreshold) {
        risks.push({
            id: 'high-cost',
            severity: 'medium',
            category: 'cost',
            title: 'High Monthly Cost',
            message: `Monthly cost ($${monthlyCost.toFixed(2)}) is above typical range`,
            impact: 'Higher than expected operational costs',
            recommendation: 'Consider cost optimization strategies'
        });
    }
    
    return risks;
}

/**
 * Assess resource provisioning risks
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @returns {array} Array of risk objects
 */
function assessProvisioningRisks(config, flavor) {
    const risks = [];
    
    // Over-provisioning checks
    const vcpuOverhead = ((flavor.vcpu - config.vcpu) / config.vcpu) * 100;
    const ramOverhead = ((flavor.ram - config.ram) / config.ram) * 100;
    
    if (vcpuOverhead > 100) {
        risks.push({
            id: 'vcpu-over-provisioned',
            severity: 'low',
            category: 'optimization',
            title: 'vCPU Over-Provisioned',
            message: `Flavor has ${vcpuOverhead.toFixed(0)}% more vCPU than required`,
            impact: 'Paying for unused compute capacity',
            recommendation: 'Consider a smaller flavor to optimize costs'
        });
    }
    
    if (ramOverhead > 100) {
        risks.push({
            id: 'ram-over-provisioned',
            severity: 'low',
            category: 'optimization',
            title: 'RAM Over-Provisioned',
            message: `Flavor has ${ramOverhead.toFixed(0)}% more RAM than required`,
            impact: 'Paying for unused memory capacity',
            recommendation: 'Consider a smaller flavor to optimize costs'
        });
    }
    
    // Network speed considerations for large deployments
    if (config.workers >= 6 && parseInt(flavor.network) < 16) {
        risks.push({
            id: 'network-bandwidth',
            severity: 'low',
            category: 'performance',
            title: 'Network Bandwidth Consideration',
            message: `Large deployment with ${flavor.network} network speed`,
            impact: 'Potential network bottlenecks under high load',
            recommendation: 'Monitor network utilization and consider higher bandwidth flavors if needed'
        });
    }
    
    return risks;
}

/**
 * Get risk summary statistics
 * @param {array} risks - Array of risk objects
 * @returns {object} Risk summary
 */
function getRiskSummary(risks) {
    const summary = {
        total: risks.length,
        high: risks.filter(r => r.severity === 'high').length,
        medium: risks.filter(r => r.severity === 'medium').length,
        low: risks.filter(r => r.severity === 'low').length,
        categories: {}
    };
    
    // Count by category
    risks.forEach(risk => {
        if (!summary.categories[risk.category]) {
            summary.categories[risk.category] = 0;
        }
        summary.categories[risk.category]++;
    });
    
    // Overall risk level
    if (summary.high > 0) {
        summary.overallRisk = 'high';
        summary.overallMessage = 'Critical issues detected - immediate action required';
    } else if (summary.medium > 0) {
        summary.overallRisk = 'medium';
        summary.overallMessage = 'Some concerns identified - review recommended';
    } else if (summary.low > 0) {
        summary.overallRisk = 'low';
        summary.overallMessage = 'Minor optimization opportunities available';
    } else {
        summary.overallRisk = 'none';
        summary.overallMessage = 'No risks detected - configuration looks good';
    }
    
    return summary;
}

/**
 * Filter risks by severity
 * @param {array} risks - Array of risk objects
 * @param {string} severity - Severity level ('high', 'medium', 'low')
 * @returns {array} Filtered risks
 */
function filterRisksBySeverity(risks, severity) {
    return risks.filter(risk => risk.severity === severity);
}

/**
 * Filter risks by category
 * @param {array} risks - Array of risk objects
 * @param {string} category - Category name
 * @returns {array} Filtered risks
 */
function filterRisksByCategory(risks, category) {
    return risks.filter(risk => risk.category === category);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        assessRisks,
        assessConfigurationRisks,
        assessZoneRisks,
        assessCostRisks,
        assessProvisioningRisks,
        getRiskSummary,
        filterRisksBySeverity,
        filterRisksByCategory
    };
}

// Made with Bob
