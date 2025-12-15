/**
 * IBM MAS PFVT Cost & Sizing Advisor - Backend API
 * Handles GitHub integration and Tekton pipeline monitoring
 */

const express = require('express');
const cors = require('cors');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');
const path = require('path');
const IBMCloudService = require('./ibm-cloud-service');
const ExcelGenerator = require('./excel-generator');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub client
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

// Configuration
const GITHUB_OWNER = 'maximoappsuite';
const GITHUB_REPO = 'fvt-personal';
const DEFAULT_BRANCH = 'main';

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * Deploy configuration to GitHub
 * POST /api/deploy
 * Body: { clusterEnv, masEnv, branchName, commitMessage, configuration }
 */
app.post('/api/deploy', async (req, res) => {
    try {
        const { clusterEnv, masEnv, branchName, commitMessage, configuration } = req.body;

        if (!clusterEnv || !masEnv || !branchName) {
            return res.status(400).json({ 
                error: 'Missing required fields: clusterEnv, masEnv, branchName' 
            });
        }

        console.log(`Deploying to branch: ${branchName}`);

        // Step 1: Get the default branch reference
        const { data: refData } = await octokit.git.getRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `heads/${DEFAULT_BRANCH}`
        });

        const baseSha = refData.object.sha;

        // Step 2: Create a new branch
        try {
            await octokit.git.createRef({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                ref: `refs/heads/${branchName}`,
                sha: baseSha
            });
            console.log(`Created new branch: ${branchName}`);
        } catch (error) {
            if (error.status === 422) {
                console.log(`Branch ${branchName} already exists, using existing branch`);
            } else {
                throw error;
            }
        }

        // Step 3: Get current files (if they exist)
        let clusterEnvSha, masEnvSha;
        
        try {
            const { data: clusterFile } = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'cluster.env',
                ref: branchName
            });
            clusterEnvSha = clusterFile.sha;
        } catch (error) {
            console.log('cluster.env does not exist, will create new file');
        }

        try {
            const { data: masFile } = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: 'mas.env',
                ref: branchName
            });
            masEnvSha = masFile.sha;
        } catch (error) {
            console.log('mas.env does not exist, will create new file');
        }

        // Step 4: Update or create cluster.env
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: 'cluster.env',
            message: commitMessage || `Update PFVT configuration - ${configuration?.name || 'Custom'}`,
            content: Buffer.from(clusterEnv).toString('base64'),
            branch: branchName,
            ...(clusterEnvSha && { sha: clusterEnvSha })
        });

        // Step 5: Update or create mas.env
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: 'mas.env',
            message: commitMessage || `Update PFVT configuration - ${configuration?.name || 'Custom'}`,
            content: Buffer.from(masEnv).toString('base64'),
            branch: branchName,
            ...(masEnvSha && { sha: masEnvSha })
        });

        // Step 6: Create pull request (optional)
        let prUrl = null;
        try {
            const { data: pr } = await octokit.pulls.create({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                title: `PFVT: ${configuration?.name || 'Configuration Update'}`,
                head: branchName,
                base: DEFAULT_BRANCH,
                body: `## PFVT Configuration Update

**Configuration:** ${configuration?.name || 'Custom'}
**Cost Score:** ${configuration?.costScore || 'N/A'}
**Estimated Monthly Cost:** $${configuration?.monthlyCost || 'N/A'}

### Cluster Configuration
- **Workers:** ${configuration?.workers || 'N/A'}
- **Flavor:** ${configuration?.flavor || 'N/A'}
- **Zones:** ${configuration?.zones || 'N/A'}

### Components
${configuration?.components?.join(', ') || 'N/A'}

---
*Generated by IBM MAS PFVT Cost & Sizing Advisor*`
            });
            prUrl = pr.html_url;
        } catch (error) {
            console.log('PR creation skipped or failed:', error.message);
        }

        res.json({
            success: true,
            message: 'Configuration deployed successfully',
            branch: branchName,
            repoUrl: `https://github.ibm.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${branchName}`,
            prUrl: prUrl,
            pipelineUrl: process.env.TEKTON_PIPELINE_URL
        });

    } catch (error) {
        console.error('Deployment error:', error);
        res.status(500).json({ 
            error: 'Deployment failed', 
            message: error.message,
            details: error.response?.data || error.toString()
        });
    }
});

/**
 * Get pipeline status
 * GET /api/pipeline/status/:runId
 */
app.get('/api/pipeline/status/:runId', async (req, res) => {
    try {
        const { runId } = req.params;
        
        // Mock pipeline status for now
        // In production, integrate with Tekton API
        const mockStatus = {
            runId: runId,
            status: 'running',
            startTime: new Date().toISOString(),
            estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            steps: [
                { name: 'Clone Repository', status: 'completed', duration: '15s' },
                { name: 'Setup Environment', status: 'completed', duration: '30s' },
                { name: 'Deploy Cluster', status: 'running', duration: '2m 45s' },
                { name: 'Install MAS', status: 'pending', duration: '-' },
                { name: 'Run Tests', status: 'pending', duration: '-' }
            ]
        };

        res.json(mockStatus);
    } catch (error) {
        console.error('Pipeline status error:', error);
        res.status(500).json({ error: 'Failed to get pipeline status' });
    }
});

/**
 * Get AI cost recommendations
 * POST /api/recommendations
 * Body: { configuration, flavor, zones }
 */
app.post('/api/recommendations', async (req, res) => {
    try {
        const { configuration, flavor, zones } = req.body;

        // Simple rule-based recommendations
        // In production, use ML model
        const recommendations = [];

        // Check if flavor is oversized
        if (flavor.vcpu > configuration.vcpu * 1.5) {
            recommendations.push({
                type: 'cost_optimization',
                severity: 'medium',
                message: `Consider using a smaller flavor. Current flavor has ${flavor.vcpu} vCPU but baseline only needs ${configuration.vcpu} vCPU.`,
                suggestedFlavor: `bx3d.${configuration.vcpu}x${configuration.ram}`,
                potentialSavings: '$500-1000/month'
            });
        }

        // Check zone configuration
        if (zones === 1 && configuration.components.includes('manage')) {
            recommendations.push({
                type: 'reliability',
                severity: 'high',
                message: 'Single zone deployment detected for Manage. Consider using 2+ zones for production.',
                suggestedZones: 2,
                additionalCost: '$1000-1500/month'
            });
        }

        // Check for cost-effective alternatives
        if (flavor.series === 'bx3d' && configuration.ram < 32) {
            recommendations.push({
                type: 'cost_optimization',
                severity: 'low',
                message: 'bx2 series might be more cost-effective for your RAM requirements.',
                suggestedSeries: 'bx2',
                potentialSavings: '$200-400/month'
            });
        }

        res.json({
            recommendations,
            confidence: 0.85,
            basedOn: 'historical_data',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

/**
 * Get deployment history
 * GET /api/history
 */
app.get('/api/history', async (req, res) => {
    try {
        // Mock deployment history
        const history = [
            {
                id: '1',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                configuration: 'Core + Manage',
                cost: 2584.20,
                costScore: 'GREEN',
                status: 'completed',
                duration: '12m 34s'
            },
            {
                id: '2',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                configuration: 'Core + IoT',
                cost: 1292.10,
                costScore: 'GREEN',
                status: 'completed',
                duration: '10m 15s'
            }
        ];

        res.json({ history });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to get deployment history' });
    }
});

// ============================================================================
// IBM Cloud Cluster Analysis Endpoints
// ============================================================================

// Initialize services
let ibmCloudService;
let excelGenerator;

try {
    ibmCloudService = new IBMCloudService();
    excelGenerator = new ExcelGenerator();
    console.log('✅ IBM Cloud services initialized');
} catch (error) {
    console.warn('⚠️  IBM Cloud services not initialized:', error.message);
}

/**
 * List all IBM Cloud clusters
 * GET /api/clusters/list
 */
app.get('/api/clusters/list', async (req, res) => {
    try {
        if (!ibmCloudService) {
            return res.status(503).json({ 
                success: false, 
                error: 'IBM Cloud service not configured. Please set IBM_CLOUD_API_KEY in .env' 
            });
        }

        const clusters = await ibmCloudService.listClusters();
        
        res.json({ 
            success: true, 
            clusters: clusters,
            totalClusters: clusters.length
        });
    } catch (error) {
        console.error('Error listing clusters:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Analyze all clusters
 * POST /api/clusters/analyze
 */
app.post('/api/clusters/analyze', async (req, res) => {
    try {
        if (!ibmCloudService) {
            return res.status(503).json({ 
                success: false, 
                error: 'IBM Cloud service not configured' 
            });
        }

        console.log('Starting cluster analysis...');
        const analysisData = await ibmCloudService.analyzeAllClusters();
        
        console.log(`Analyzed ${analysisData.totalClusters} clusters`);
        
        res.json({ 
            success: true, 
            analysis: analysisData
        });
    } catch (error) {
        console.error('Error analyzing clusters:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Generate Excel report
 * POST /api/clusters/export
 */
app.post('/api/clusters/export', async (req, res) => {
    try {
        if (!excelGenerator) {
            return res.status(503).json({ 
                success: false, 
                error: 'Excel generator not initialized' 
            });
        }

        const { analysisData } = req.body;
        
        if (!analysisData) {
            return res.status(400).json({ 
                success: false, 
                error: 'Analysis data is required' 
            });
        }

        console.log('Generating Excel report...');
        const report = await excelGenerator.generateClusterReport(analysisData);
        
        console.log(`Report generated: ${report.filename}`);
        
        res.json(report);
    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Analyze and export in one call
 * POST /api/clusters/analyze-and-export
 */
app.post('/api/clusters/analyze-and-export', async (req, res) => {
    try {
        if (!ibmCloudService || !excelGenerator) {
            return res.status(503).json({ 
                success: false, 
                error: 'Services not configured' 
            });
        }

        console.log('Analyzing clusters and generating report...');
        
        // Analyze clusters
        const analysisData = await ibmCloudService.analyzeAllClusters();
        
        // Generate Excel report
        const report = await excelGenerator.generateClusterReport(analysisData);
        
        res.json({ 
            success: true,
            analysis: analysisData,
            report: report
        });
    } catch (error) {
        console.error('Error in analyze-and-export:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Serve downloads directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 PFVT Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 GitHub integration: ${process.env.GITHUB_TOKEN ? 'Configured' : 'Not configured'}`);
});

// Made with Bob
