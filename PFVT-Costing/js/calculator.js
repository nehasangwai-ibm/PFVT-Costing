/**
 * IBM MAS PFVT Cost and Sizing Advisor
 * Cost Calculator with Multi-Zone Support
 */

/**
 * Calculate total costs for a configuration
 * @param {object} config - MAS configuration
 * @param {object} flavor - Worker node flavor
 * @param {number} zones - Number of zones (1, 2, or 3)
 * @returns {object} Cost breakdown
 */
function calculateCosts(config, flavor, zones = 1) {
    const workers = config.workers;
    const totalNodes = workers * zones;
    
    // Hourly cost calculation
    const hourlyCostPerNode = flavor.hourlyRate;
    const totalHourlyCost = hourlyCostPerNode * totalNodes;
    
    // Monthly cost (730 hours average)
    const monthlyCost = totalHourlyCost * 730;
    
    // Yearly cost (8,760 hours)
    const yearlyCost = totalHourlyCost * 8760;
    
    return {
        workers: workers,
        zones: zones,
        totalNodes: totalNodes,
        flavor: flavor.name,
        costs: {
            perNode: {
                hourly: hourlyCostPerNode,
                monthly: hourlyCostPerNode * 730,
                yearly: hourlyCostPerNode * 8760
            },
            perWorker: {
                hourly: hourlyCostPerNode * zones,
                monthly: hourlyCostPerNode * zones * 730,
                yearly: hourlyCostPerNode * zones * 8760
            },
            total: {
                hourly: totalHourlyCost,
                monthly: monthlyCost,
                yearly: yearlyCost
            }
        },
        breakdown: {
            formula: `${workers} workers × ${zones} zones × $${hourlyCostPerNode}/hr`,
            calculation: `${workers} × ${zones} × $${hourlyCostPerNode} = $${totalHourlyCost.toFixed(2)}/hr`
        }
    };
}

/**
 * Calculate PFVT Cost Score based on monthly cost and zones
 * @param {number} monthlyCost - Monthly cost in USD
 * @param {number} zones - Number of zones
 * @returns {object} Cost score details
 */
function calculateCostScore(monthlyCost, zones = 1) {
    let thresholds;
    
    // Zone-aware thresholds
    if (zones === 1) {
        thresholds = {
            green: 2000,
            amber: 5000
        };
    } else if (zones === 2) {
        thresholds = {
            green: 4000,
            amber: 10000
        };
    } else { // 3 zones
        thresholds = {
            green: 6000,
            amber: 15000
        };
    }
    
    let score, label, color, icon, message, severity;
    
    if (monthlyCost < thresholds.green) {
        score = 'GREEN';
        label = 'Optimal Cost';
        color = '#24a148';
        icon = '🟢';
        message = 'Cost is within optimal range';
        severity = 'low';
    } else if (monthlyCost >= thresholds.green && monthlyCost <= thresholds.amber) {
        score = 'AMBER';
        label = 'Moderate Cost';
        color = '#f1c21b';
        icon = '🟡';
        message = 'Cost is moderate - review for optimization opportunities';
        severity = 'medium';
    } else {
        score = 'RED';
        label = 'High Cost';
        color = '#fa4d56';
        icon = '🔴';
        message = 'Cost is high - optimization recommended';
        severity = 'high';
    }
    
    return {
        score: score,
        label: label,
        color: color,
        icon: icon,
        message: message,
        severity: severity,
        monthlyCost: monthlyCost,
        zones: zones,
        thresholds: thresholds
    };
}

/**
 * Calculate cost comparison between scenarios
 * @param {array} scenarios - Array of scenario objects
 * @returns {object} Comparison data
 */
function compareScenarios(scenarios) {
    if (!scenarios || scenarios.length === 0) {
        return null;
    }
    
    const costs = scenarios.map(s => s.results.costs.total.monthly);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;
    
    const comparisons = scenarios.map((scenario, index) => {
        const cost = scenario.results.costs.total.monthly;
        const diffFromMin = cost - minCost;
        const diffFromAvg = cost - avgCost;
        const percentDiffFromMin = minCost > 0 ? ((diffFromMin / minCost) * 100) : 0;
        
        return {
            scenario: scenario,
            cost: cost,
            diffFromMin: diffFromMin,
            diffFromAvg: diffFromAvg,
            percentDiffFromMin: percentDiffFromMin,
            isCheapest: cost === minCost,
            isMostExpensive: cost === maxCost
        };
    });
    
    return {
        scenarios: comparisons,
        summary: {
            minCost: minCost,
            maxCost: maxCost,
            avgCost: avgCost,
            range: maxCost - minCost,
            count: scenarios.length
        }
    };
}

/**
 * Calculate cost savings between two configurations
 * @param {object} currentCosts - Current configuration costs
 * @param {object} alternativeCosts - Alternative configuration costs
 * @returns {object} Savings analysis
 */
function calculateSavings(currentCosts, alternativeCosts) {
    const currentMonthly = currentCosts.total.monthly;
    const alternativeMonthly = alternativeCosts.total.monthly;
    
    const monthlySavings = currentMonthly - alternativeMonthly;
    const yearlySavings = monthlySavings * 12;
    const percentSavings = currentMonthly > 0 ? ((monthlySavings / currentMonthly) * 100) : 0;
    
    return {
        current: currentMonthly,
        alternative: alternativeMonthly,
        savings: {
            monthly: monthlySavings,
            yearly: yearlySavings,
            percent: percentSavings
        },
        isCheaper: monthlySavings > 0,
        recommendation: monthlySavings > 0 
            ? `Switch to alternative to save $${Math.abs(monthlySavings).toFixed(2)}/month`
            : `Current configuration is more cost-effective`
    };
}

/**
 * Estimate cost for different time periods
 * @param {number} hourlyCost - Hourly cost
 * @returns {object} Cost estimates for various periods
 */
function estimateCostPeriods(hourlyCost) {
    return {
        hourly: hourlyCost,
        daily: hourlyCost * 24,
        weekly: hourlyCost * 24 * 7,
        monthly: hourlyCost * 730,
        quarterly: hourlyCost * 730 * 3,
        yearly: hourlyCost * 8760
    };
}

/**
 * Calculate cost per resource unit
 * @param {object} costs - Cost object
 * @param {object} config - Configuration object
 * @param {number} zones - Number of zones
 * @returns {object} Cost per resource metrics
 */
function calculateCostPerResource(costs, config, zones) {
    const monthlyCost = costs.total.monthly;
    const totalNodes = config.workers * zones;
    
    return {
        perWorker: monthlyCost / config.workers,
        perNode: monthlyCost / totalNodes,
        perVCPU: monthlyCost / (config.vcpu * totalNodes),
        perGBRAM: monthlyCost / (config.ram * totalNodes),
        perGBDisk: monthlyCost / (config.disk * totalNodes)
    };
}

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format large numbers with K/M suffixes
 * @param {number} value - Numeric value
 * @returns {string} Formatted string
 */
function formatLargeNumber(value) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + 'K';
    }
    return value.toFixed(2);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateCosts,
        calculateCostScore,
        compareScenarios,
        calculateSavings,
        estimateCostPeriods,
        calculateCostPerResource,
        formatCurrency,
        formatLargeNumber
    };
}

// Made with Bob
