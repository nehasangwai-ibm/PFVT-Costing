# IBM Cloud Cluster Analysis Guide

## Overview

The IBM Cloud Cluster Analysis feature automatically connects to your IBM Cloud account, analyzes all ROKS clusters, calculates costs, generates PFVT cost scores, and provides optimization recommendations.

## Features

### 🔍 Automated Cluster Discovery
- Connects to IBM Cloud using API key authentication
- Lists all ROKS clusters in your account
- Fetches detailed worker node information for each cluster

### 💰 Cost Analysis
- Calculates hourly, daily, monthly, and annual costs
- Uses real worker flavor pricing from our database
- Accounts for multi-zone deployments
- Provides cost breakdown per cluster

### 🚦 PFVT Cost Scoring
- **GREEN**: Optimal cost efficiency (within recommended thresholds)
- **AMBER**: Moderate cost - review recommended
- **RED**: High cost - optimization strongly recommended

Zone-aware thresholds:
- 1 Zone: GREEN ≤ $1.50/hr, AMBER ≤ $3.00/hr, RED > $3.00/hr
- 2 Zones: GREEN ≤ $3.00/hr, AMBER ≤ $6.00/hr, RED > $6.00/hr
- 3 Zones: GREEN ≤ $4.50/hr, AMBER ≤ $9.00/hr, RED > $9.00/hr

### 📊 Excel Report Generation
Professional Excel reports with three worksheets:
1. **Summary**: Overview with total costs and score distribution
2. **Cluster Details**: Complete analysis for each cluster
3. **Recommendations**: Actionable optimization suggestions

## Setup

### 1. IBM Cloud API Key

Create an API key with Container Service access:

```bash
# Login to IBM Cloud
ibmcloud login

# Create API key
ibmcloud iam api-key-create pfvt-cluster-analyzer -d "PFVT Cluster Analysis Tool"
```

### 2. Configure Backend

Add your API key to `backend/.env`:

```env
IBM_CLOUD_API_KEY=your-api-key-here
IBM_CLOUD_REGION=us-south
```

### 3. Start Backend Server

```bash
cd backend
npm install
npm start
```

Server will start on port 3001.

## Usage

### Web Interface

1. **Open Application**: Navigate to http://localhost:8000
2. **Scroll to Cluster Analysis Section**
3. **Choose Action**:
   - **Analyze My Clusters**: View results in browser
   - **Analyze & Export to Excel**: Generate downloadable report

### API Endpoints

#### List Clusters
```bash
GET /api/clusters/list
```

Returns array of cluster IDs and names.

#### Analyze All Clusters
```bash
POST /api/clusters/analyze
```

Returns complete analysis with costs, scores, and recommendations.

#### Generate Excel Report
```bash
POST /api/clusters/export
Body: { "analysis": <analysis_data> }
```

Generates Excel file and returns download URL.

#### One-Click Analysis & Export
```bash
POST /api/clusters/analyze-and-export
```

Analyzes clusters and generates Excel report in one request.

## Excel Report Structure

### Summary Sheet
- Total clusters analyzed
- Total monthly cost
- Total annual cost
- Cost score distribution (GREEN/AMBER/RED)
- Average cost per cluster
- IBM branding and timestamp

### Cluster Details Sheet
Columns:
- Cluster Name
- Cluster ID
- Worker Count
- Worker Flavor
- Zones
- Hourly Cost
- Monthly Cost
- Annual Cost
- Cost Score (color-coded)
- Uptime Days

### Recommendations Sheet
Intelligent suggestions based on:
- Oversized clusters (too many workers)
- Expensive flavors (better alternatives available)
- Single-zone deployments (HA recommendations)
- Underutilized resources

## Cost Calculation

### Formula
```
Hourly Cost = Worker Count × Flavor Price × Zone Count
Daily Cost = Hourly Cost × 24
Monthly Cost = Hourly Cost × 730
Annual Cost = Monthly Cost × 12
```

### Worker Flavor Pricing
Prices are maintained in the backend database:
- bx2 series: $0.10 - $1.62/hr
- bx3d series: $0.27 - $3.24/hr
- mx2 series: $0.15 - $3.54/hr

## Recommendations Engine

### Oversized Clusters
Triggered when: Worker count > 6
Suggestion: Review workload requirements, consider rightsizing

### Expensive Flavors
Triggered when: Using high-end flavors (mx2.32x256, bx3d.48x240, etc.)
Suggestion: Evaluate if smaller flavors meet requirements

### Single Zone Deployments
Triggered when: Zone count = 1
Suggestion: Consider multi-zone for high availability

### High Cost Clusters
Triggered when: Cost score = RED
Suggestion: Immediate optimization review recommended

## Troubleshooting

### API Key Issues
**Error**: "Provided API key could not be found"
**Solution**: Verify API key is correct and has Container Service access

### No Clusters Found
**Error**: "Found 0 clusters"
**Solution**: 
- Check IBM Cloud region setting
- Verify account has ROKS clusters
- Confirm API key has proper permissions

### 404 Errors
**Error**: "Request failed with status code 404"
**Solution**: 
- Ensure using IBM Cloud Container Service v1 API
- Verify cluster IDs are valid
- Check region configuration

### Excel Generation Fails
**Error**: Excel file not created
**Solution**:
- Verify `backend/downloads/` directory exists
- Check disk space
- Review backend logs for errors

## Best Practices

### Security
- Store API keys in `.env` file (never commit to Git)
- Use API keys with minimal required permissions
- Rotate API keys regularly
- Use separate keys for dev/prod environments

### Performance
- Analysis of 18 clusters takes ~60 seconds
- Excel generation adds ~2-3 seconds
- Consider caching results for large deployments
- Run analysis during off-peak hours for production

### Cost Optimization
- Review RED-scored clusters immediately
- Evaluate AMBER-scored clusters quarterly
- Monitor cost trends over time
- Compare actual usage vs. provisioned capacity

## Integration with PFVT Tool

The cluster analysis feature complements the main PFVT cost estimation tool:

1. **Estimation Tool**: Plan new MAS deployments with optimal sizing
2. **Cluster Analysis**: Audit existing clusters for cost optimization
3. **Combined Workflow**: 
   - Analyze current clusters
   - Identify optimization opportunities
   - Use estimation tool to plan improvements
   - Deploy via PFVT pipeline

## Support

For issues or questions:
- Check backend logs: `backend/server.js` console output
- Review API responses for error details
- Verify IBM Cloud service status
- Consult IBM Cloud Container Service documentation

## Future Enhancements

Planned features:
- Historical cost tracking
- Cost trend analysis
- Automated optimization suggestions
- Integration with IBM Cloud Cost Management
- Slack/email notifications for high-cost clusters
- Scheduled analysis reports
- Multi-account support
- Custom cost thresholds per environment

---

**Version**: 1.0.0  
**Last Updated**: December 15, 2024  
**Author**: Bob - IBM MAS PFVT Cost and Sizing Advisor