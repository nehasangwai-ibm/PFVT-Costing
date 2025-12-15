/**
 * IBM Cloud Service
 * Handles IBM Cloud API interactions for cluster analysis
 */

const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const axios = require('axios');

// Worker flavor pricing database (from frontend)
const WORKER_FLAVORS = {
    'bx2.2x8': 0.10,
    'bx2.4x16': 0.20,
    'bx2.8x32': 0.27,
    'bx2.16x32': 0.27,
    'bx2.16x64': 0.54,
    'bx2.32x128': 1.08,
    'bx2.48x192': 1.62,
    'bx3d.4x20': 0.27,
    'bx3d.8x40': 0.54,
    'bx3d.16x64': 0.59,
    'bx3d.16x80': 1.08,
    'bx3d.24x120': 1.62,
    'bx3d.32x160': 2.16,
    'bx3d.48x240': 3.24,
    'mx2.2x16': 0.15,
    'mx2.4x32': 0.30,
    'mx2.8x64': 0.59,
    'mx2.16x128': 1.18,
    'mx2.32x256': 2.36,
    'mx2.48x384': 3.54,
    // IBM Cloud b3c series (maps to bx3d pricing)
    'b3c.4x16': 0.20,
    'b3c.8x32': 0.27,
    'b3c.16x64': 0.59,
    'b3c.32x128': 1.18,
    // IBM Cloud m3c series (maps to mx2 pricing)
    'm3c.8x64': 0.59,
    'm3c.16x128': 1.18,
    'm3c.32x256': 2.36
};

/**
 * Normalize IBM Cloud flavor names to match pricing database
 * IBM Cloud uses b3c/m3c, we use bx3d/mx2
 */
function normalizeFlavor(ibmFlavor) {
    if (!ibmFlavor) return 'unknown';
    
    // Remove encryption and disk suffixes
    let normalized = ibmFlavor.replace(/\.(encrypted|300gb\.encrypted)$/, '');
    
    // Map b3c to bx3d equivalent
    if (normalized.startsWith('b3c.')) {
        normalized = normalized.replace('b3c.', 'bx3d.');
    }
    
    // Map m3c to mx2 equivalent
    if (normalized.startsWith('m3c.')) {
        normalized = normalized.replace('m3c.', 'mx2.');
    }
    
    return normalized;
}

class IBMCloudService {
    constructor() {
        this.apiKey = process.env.IBM_CLOUD_API_KEY;
        this.region = process.env.IBM_CLOUD_REGION || 'us-south';
        
        if (!this.apiKey) {
            throw new Error('IBM_CLOUD_API_KEY not configured in .env file');
        }
        
        // Initialize IAM authenticator
        this.authenticator = new IamAuthenticator({
            apikey: this.apiKey
        });
        
        // Use v1 API endpoint for better compatibility
        this.baseUrl = 'https://containers.cloud.ibm.com/global/v1';
    }
    
    /**
     * Get IAM access token
     */
    async getAccessToken() {
        try {
            const token = await this.authenticator.tokenManager.getToken();
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw new Error('Failed to authenticate with IBM Cloud');
        }
    }
    
    /**
     * List all clusters
     */
    async listClusters() {
        try {
            const token = await this.getAccessToken();
            
            console.log(`Fetching clusters from: ${this.baseUrl}/clusters`);
            console.log(`Region: ${this.region}`);
            
            const response = await axios.get(`${this.baseUrl}/clusters`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Region': this.region
                }
            });
            
            console.log(`Found ${response.data?.length || 0} clusters`);
            return response.data || [];
        } catch (error) {
            console.error('Error listing clusters:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(`Failed to list clusters: ${error.response?.status || error.message}`);
        }
    }
    
    /**
     * Get cluster details
     */
    async getClusterDetails(clusterId) {
        try {
            const token = await this.getAccessToken();
            
            console.log(`Fetching details for cluster: ${clusterId}`);
            
            // Get cluster info using v1 API
            const clusterResponse = await axios.get(`${this.baseUrl}/clusters/${clusterId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Region': this.region
                }
            });
            
            // Get worker pools using v1 API
            const workersResponse = await axios.get(`${this.baseUrl}/clusters/${clusterId}/workers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Region': this.region
                }
            });
            
            console.log(`Found ${workersResponse.data?.length || 0} workers for cluster ${clusterId}`);
            
            return {
                cluster: clusterResponse.data,
                workers: workersResponse.data || []
            };
        } catch (error) {
            console.error('Error getting cluster details:', {
                clusterId,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(`Failed to get cluster details: ${error.message}`);
        }
    }
    
    /**
     * Analyze a single cluster
     */
    analyzeCluster(clusterDetails) {
        const cluster = clusterDetails.cluster;
        const workers = clusterDetails.workers;
        
        // Debug: Log first worker to see structure
        if (workers.length > 0) {
            console.log('Sample worker data:', JSON.stringify(workers[0], null, 2));
        }
        
        // Extract worker information - try multiple possible field names
        const workerCount = workers.length;
        const firstWorker = workers[0] || {};
        const rawFlavor = firstWorker.flavor || firstWorker.machineType || firstWorker.instanceType || 'unknown';
        const zones = [...new Set(workers.map(w => w.location || w.zone || w.availabilityZone || 'unknown'))];
        const zoneCount = zones.length;
        
        // Extract CPU, Memory, Disk from worker data or flavor name
        let cpu = firstWorker.cpu || 0;
        let memory = firstWorker.memory || 0;
        let disk = firstWorker.disk || firstWorker.storage || 0;
        
        // If not in worker data, parse from flavor name (e.g., "b3c.16x64" = 16 CPU, 64GB RAM)
        if (!cpu && rawFlavor !== 'unknown') {
            const flavorMatch = rawFlavor.match(/(\d+)x(\d+)/);
            if (flavorMatch) {
                cpu = parseInt(flavorMatch[1]);
                memory = parseInt(flavorMatch[2]);
            }
        }
        
        // Extract disk from flavor if present (e.g., "300gb")
        if (!disk && rawFlavor.includes('gb')) {
            const diskMatch = rawFlavor.match(/(\d+)gb/);
            if (diskMatch) {
                disk = parseInt(diskMatch[1]);
            }
        }
        
        // Normalize flavor for pricing lookup
        const normalizedFlavor = normalizeFlavor(rawFlavor);
        
        // Calculate costs using normalized flavor
        const hourlyPrice = WORKER_FLAVORS[rawFlavor] || WORKER_FLAVORS[normalizedFlavor] || 0;
        const totalHourly = hourlyPrice * workerCount;
        const totalMonthly = totalHourly * 730; // 730 hours per month
        const totalYearly = totalMonthly * 12;
        
        // Calculate uptime
        const createdDate = new Date(cluster.createdDate || cluster.created);
        const now = new Date();
        const uptimeDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        const uptimeMonths = Math.floor(uptimeDays / 30);
        
        // Calculate cost score using normalized flavor
        const costScore = this.calculateCostScore(workerCount, normalizedFlavor, zoneCount);
        
        // Generate recommendations using normalized flavor
        const recommendations = this.generateRecommendations(workerCount, normalizedFlavor, zoneCount, cluster);
        
        return {
            id: cluster.id,
            name: cluster.name,
            state: cluster.state || 'unknown',
            createdDate: createdDate.toISOString().split('T')[0],
            uptime: uptimeDays < 30 ? `${uptimeDays} days` : `${uptimeMonths} months`,
            uptimeDays: uptimeDays,
            workers: workerCount,
            flavor: rawFlavor,
            normalizedFlavor: normalizedFlavor,
            cpu: cpu,
            memory: memory,
            disk: disk,
            zones: zoneCount,
            zoneList: zones,
            location: cluster.location || cluster.region || this.region,
            resourceGroup: cluster.resourceGroup || 'default',
            costs: {
                hourly: totalHourly,
                monthly: totalMonthly,
                yearly: totalYearly,
                perWorker: hourlyPrice
            },
            costScore: costScore,
            recommendations: recommendations,
            totalCostToDate: totalMonthly * (uptimeDays / 30) // Approximate total cost
        };
    }
    
    /**
     * Calculate PFVT cost score
     */
    calculateCostScore(workers, flavor, zones) {
        const hourlyPrice = WORKER_FLAVORS[flavor] || 0;
        const totalHourly = hourlyPrice * workers * zones;
        
        // Zone-aware thresholds
        let greenThreshold, amberThreshold;
        
        if (zones === 1) {
            greenThreshold = 1.0;  // $1/hr
            amberThreshold = 2.0;  // $2/hr
        } else if (zones === 2) {
            greenThreshold = 2.0;  // $2/hr
            amberThreshold = 4.0;  // $4/hr
        } else {
            greenThreshold = 3.0;  // $3/hr
            amberThreshold = 6.0;  // $6/hr
        }
        
        if (totalHourly <= greenThreshold) {
            return 'GREEN';
        } else if (totalHourly <= amberThreshold) {
            return 'AMBER';
        } else {
            return 'RED';
        }
    }
    
    /**
     * Generate recommendations
     */
    generateRecommendations(workers, flavor, zones, cluster) {
        const recommendations = [];
        const hourlyPrice = WORKER_FLAVORS[flavor] || 0;
        const totalHourly = hourlyPrice * workers * zones;
        
        // Check if over-provisioned
        if (totalHourly > 5.0) {
            recommendations.push('⚠️ High cost detected - Consider downsizing or using fewer zones');
        }
        
        // Check zone optimization
        if (zones === 3 && cluster.name && (cluster.name.includes('dev') || cluster.name.includes('test'))) {
            recommendations.push('💡 Dev/test environment with 3 zones - Consider using 1-2 zones to save costs');
        }
        
        // Check flavor optimization
        if (flavor.includes('mx2') || flavor.includes('bx3d')) {
            recommendations.push('💡 Using memory-dense flavor - Verify if high memory is needed');
        }
        
        // Check worker count
        if (workers > 9) {
            recommendations.push('⚠️ High worker count - Review if all workers are necessary');
        }
        
        // Suggest alternatives
        if (flavor === 'bx3d.16x64' && zones > 1) {
            const savings = (0.59 - 0.27) * workers * zones * 730;
            recommendations.push(`💰 Consider bx2.16x32 instead - Save $${savings.toFixed(0)}/month`);
        }
        
        if (recommendations.length === 0) {
            recommendations.push('✅ Configuration looks optimal');
        }
        
        return recommendations;
    }
    
    /**
     * Analyze all clusters
     */
    async analyzeAllClusters() {
        try {
            const clusters = await this.listClusters();
            
            if (!clusters || clusters.length === 0) {
                return {
                    totalClusters: 0,
                    totalWorkers: 0,
                    totalMonthlyCost: 0,
                    totalYearlyCost: 0,
                    clusters: []
                };
            }
            
            const analyses = [];
            
            for (const cluster of clusters) {
                try {
                    const details = await this.getClusterDetails(cluster.id);
                    const analysis = this.analyzeCluster(details);
                    analyses.push(analysis);
                } catch (error) {
                    console.error(`Error analyzing cluster ${cluster.id}:`, error.message);
                    // Continue with other clusters
                }
            }
            
            // Calculate totals
            const totalWorkers = analyses.reduce((sum, a) => sum + a.workers, 0);
            const totalMonthlyCost = analyses.reduce((sum, a) => sum + a.costs.monthly, 0);
            const totalYearlyCost = analyses.reduce((sum, a) => sum + a.costs.yearly, 0);
            const totalCostToDate = analyses.reduce((sum, a) => sum + a.totalCostToDate, 0);
            
            return {
                totalClusters: analyses.length,
                totalWorkers: totalWorkers,
                totalMonthlyCost: totalMonthlyCost,
                totalYearlyCost: totalYearlyCost,
                totalCostToDate: totalCostToDate,
                clusters: analyses,
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error analyzing all clusters:', error);
            throw error;
        }
    }
}

module.exports = IBMCloudService;

// Made with Bob
