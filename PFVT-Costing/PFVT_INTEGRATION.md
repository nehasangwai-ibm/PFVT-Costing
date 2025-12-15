# PFVT Integration Guide

## Overview

The IBM MAS PFVT Cost & Sizing Advisor now includes integrated support for triggering Pre-Flight Validation Tests (PFVT) directly from the UI. This feature generates configuration files and provides step-by-step instructions for executing PFVT tests on your ROKS cluster.

## Features

### 1. **Automated .env File Generation**
- Generates a complete `.env` configuration file based on your selected MAS configuration
- Includes all cluster specifications (workers, zones, flavors)
- Contains cost estimates and deployment options
- Ready to use with your PFVT repository

### 2. **Git Integration Workflow**
- Provides complete Git commands for your workflow
- Supports branch-based development
- Automatically triggers Tekton SPS pipeline on push

### 3. **Pipeline Monitoring**
- Direct links to your PFVT repository
- Quick access to Tekton pipeline dashboard
- Real-time pipeline status monitoring

## How to Use

### Step 1: Calculate Your Configuration

1. Select your MAS configuration (e.g., Core + Manage)
2. Choose worker node flavor (e.g., bx3d.16x64)
3. Select number of zones (1, 2, or 3)
4. Click **"Calculate Costs"**

### Step 2: Trigger PFVT

After calculating costs, click the **"🚀 Trigger PFVT"** button in the results section.

### Step 3: Download Configuration

In the PFVT Integration modal:

1. **Review Configuration Summary**
   - Verify MAS components
   - Check worker flavor and zone settings
   - Confirm cost score

2. **Preview .env File**
   - Review all environment variables
   - Ensure values are correct
   - Check PFVT-specific settings

3. **Download .env File**
   - Click **"📥 Download pfvt-config.env"**
   - File will be saved to your Downloads folder

### Step 4: Execute Git Commands

Copy and execute the provided Git commands:

```bash
# Step 1: Clone repository (if not already cloned)
git clone https://github.ibm.com/maximoappsuite/fvt-personal.git
cd fvt-personal

# Step 2: Create/checkout your branch
git checkout -b feature/pfvt-config

# Step 3: Copy the downloaded .env file
cp ~/Downloads/pfvt-config.env .env

# Step 4: Commit and push changes
git add .env
git commit -m "Update PFVT configuration from Cost & Sizing Advisor"
git push origin feature/pfvt-config

# Step 5: Tekton pipeline will automatically trigger!
```

### Step 5: Monitor Pipeline

- Click **"📦 Open Repository"** to view your Git repository
- Click **"🔄 View Pipeline"** to monitor Tekton pipeline execution
- Pipeline URL: https://cloud.ibm.com/devops/pipelines/tekton/3612e317-4d13-42a4-b798-d7db422549f8/runs

## Generated .env File Structure

The generated `.env` file includes:

### MAS Configuration
```bash
MAS_CONFIG_NAME="Core + Manage"
MAS_COMPONENTS="CORE,MANAGE"
MAS_WORKERS=3
MAS_VCPU_PER_WORKER=16
MAS_RAM_PER_WORKER=32
MAS_DISK_PER_WORKER=250
```

### ROKS Cluster Configuration
```bash
CLUSTER_TYPE="ROKS"
WORKER_FLAVOR="bx3d.16x64"
WORKER_VCPU=16
WORKER_RAM=64
WORKER_STORAGE=100GB
WORKER_NETWORK=16Gbps
WORKER_COUNT=3
ZONE_COUNT=2
TOTAL_NODES=6
```

### Cost Information (Reference)
```bash
HOURLY_RATE_PER_NODE=0.59
ESTIMATED_HOURLY_COST=3.54
ESTIMATED_MONTHLY_COST=2584.20
ESTIMATED_YEARLY_COST=31010.40
COST_SCORE="GREEN"
```

### Deployment Options
```bash
HIGH_AVAILABILITY=true
MULTI_ZONE=true
PRODUCTION_READY=true
```

### PFVT Test Configuration
```bash
# Add your PFVT-specific variables below
# PFVT_TEST_SUITE=
# PFVT_TIMEOUT=
# PFVT_PARALLEL=
```

## Customization

### Branch Name
Replace `feature/pfvt-config` with your actual branch name in the Git commands.

### PFVT Variables
Add any additional PFVT-specific environment variables to the `.env` file before committing:

```bash
PFVT_TEST_SUITE=full
PFVT_TIMEOUT=3600
PFVT_PARALLEL=true
PFVT_LOG_LEVEL=debug
```

## Workflow Integration

### Tekton Pipeline Trigger

The Tekton SPS pipeline is automatically triggered when you push changes to your branch:

1. **Push Detection**: Tekton monitors the repository for changes
2. **Pipeline Start**: Automatically starts when `.env` file is updated
3. **Test Execution**: Runs PFVT tests with your configuration
4. **Results**: View results in Tekton dashboard

### Pipeline Monitoring

Monitor your pipeline at:
- **Pipeline Dashboard**: https://cloud.ibm.com/devops/pipelines/tekton/3612e317-4d13-42a4-b798-d7db422549f8/runs
- **View**: Logs, status, and test results
- **Duration**: Typically 5-15 minutes

## Best Practices

### 1. **Review Before Committing**
- Always review the `.env` file before committing
- Verify all values match your requirements
- Check cost estimates align with budget

### 2. **Use Descriptive Branch Names**
```bash
git checkout -b pfvt/mas-manage-prod-config
git checkout -b test/mas-iot-3zone-setup
git checkout -b config/mas-predict-optimization
```

### 3. **Add Commit Messages**
```bash
git commit -m "PFVT: Add Core+Manage config with bx3d.16x64 flavor"
git commit -m "PFVT: Update to 3-zone HA configuration"
git commit -m "PFVT: Optimize worker flavor for cost reduction"
```

### 4. **Track Cost Score**
- Include cost score in commit messages
- Document any cost optimizations
- Track score improvements over time

### 5. **Version Control**
- Keep historical `.env` files for comparison
- Tag successful configurations
- Document configuration changes

## Troubleshooting

### Issue: Pipeline Not Triggering

**Solution:**
1. Verify you pushed to the correct branch
2. Check Tekton pipeline configuration
3. Ensure `.env` file is in the correct directory
4. Review Git credentials and permissions

### Issue: Configuration Errors

**Solution:**
1. Re-download `.env` file from the advisor
2. Verify all required variables are present
3. Check for syntax errors in `.env` file
4. Validate worker flavor availability

### Issue: Cost Score Concerns

**Solution:**
1. Review recommendations in the advisor
2. Consider alternative worker flavors
3. Adjust zone count if appropriate
4. Consult with team on budget constraints

## Security Considerations

### Git Credentials
- Use SSH keys for authentication
- Never commit sensitive credentials
- Use environment variables for secrets
- Follow IBM security guidelines

### Access Control
- Ensure proper repository permissions
- Limit pipeline access to authorized users
- Review audit logs regularly
- Follow least privilege principle

## Support

### Resources
- **Repository**: https://github.ibm.com/maximoappsuite/fvt-personal.git
- **Pipeline**: https://cloud.ibm.com/devops/pipelines/tekton/3612e317-4d13-42a4-b798-d7db422549f8/runs
- **Documentation**: See README.md for general usage

### Getting Help
1. Check this guide for common issues
2. Review Tekton pipeline logs
3. Consult with your team lead
4. Contact IBM MAS support if needed

## Examples

### Example 1: Production Deployment
```bash
# Configuration
MAS: Core + Manage
Flavor: bx3d.16x64
Zones: 3
Cost Score: AMBER

# Workflow
1. Calculate costs
2. Review recommendations
3. Download .env file
4. Push to production branch
5. Monitor pipeline
```

### Example 2: Development Testing
```bash
# Configuration
MAS: Core + IoT
Flavor: bx2.4x16
Zones: 1
Cost Score: GREEN

# Workflow
1. Calculate costs
2. Download .env file
3. Push to dev branch
4. Run quick tests
5. Iterate as needed
```

### Example 3: Cost Optimization
```bash
# Original Configuration
Flavor: bx3d.16x64
Zones: 3
Cost: $7,752.60/month
Score: RED

# Optimized Configuration
Flavor: bx3d.8x32
Zones: 2
Cost: $2,584.20/month
Score: GREEN

# Workflow
1. Compare configurations
2. Test optimized setup
3. Validate performance
4. Deploy if successful
```

## Changelog

### Version 1.0.0 (Current)
- Initial PFVT integration release
- .env file generation
- Git workflow automation
- Tekton pipeline integration
- Cost score tracking

## Future Enhancements

### Planned Features
- [ ] Direct API integration with Tekton
- [ ] Automated pipeline status polling
- [ ] Configuration version comparison
- [ ] Cost trend analysis
- [ ] Automated rollback on failures
- [ ] Multi-environment support
- [ ] Slack/Teams notifications

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Maintained By**: IBM MAS PFVT Team