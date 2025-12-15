# Cost Calculation Formulas - Detailed Explanation

## Overview
The IBM Cloud Cluster Analysis tool calculates costs based on worker node pricing, cluster uptime, and zone configuration.

## Cost Calculation Formulas

### 1. **Per-Worker Hourly Cost**
```
perWorkerHourly = WORKER_FLAVORS[flavor]
```
**Example**: b3c.16x64 (normalized to bx3d.16x64) = $0.59/hour per worker

### 2. **Total Hourly Cost**
```
totalHourly = perWorkerHourly × workerCount
```
**Example**: 
- Flavor: b3c.16x64 = $0.59/hr
- Workers: 3
- **Total Hourly = $0.59 × 3 = $1.77/hr**

### 3. **Total Monthly Cost**
```
totalMonthly = totalHourly × 730 hours
```
**Why 730 hours?** Average hours per month (365 days ÷ 12 months × 24 hours = 730)

**Example**:
- Total Hourly: $1.77/hr
- **Total Monthly = $1.77 × 730 = $1,292.10/month**

### 4. **Total Yearly Cost**
```
totalYearly = totalMonthly × 12
```
**Example**:
- Total Monthly: $1,292.10/month
- **Total Yearly = $1,292.10 × 12 = $15,505.20/year**

### 5. **Total Cost To Date** (Actual spend since creation)
```
totalCostToDate = totalMonthly × (uptimeDays / 30)
```
**Formula Breakdown**:
- `uptimeDays` = Days since cluster was created
- `uptimeDays / 30` = Convert days to months (approximate)
- Multiply by monthly cost to get total spend

**Example** (aviation cluster):
- Created: 2023-11-27
- Today: 2025-12-15
- Uptime: 749 days
- Monthly Cost: $1,292.10
- **Total Cost To Date = $1,292.10 × (749 / 30) = $32,283.29**

## Aggregated Totals (All 18 Clusters)

### Total Monthly Cost Calculation
```
totalMonthlyCost = SUM(each cluster's totalMonthly)
```
**Result**: $38,332.30/month across all 18 clusters

### Total Yearly Cost Calculation
```
totalYearlyCost = totalMonthlyCost × 12
```
**Result**: $38,332.30 × 12 = $459,987.60/year

### Total Cost To Date (All Clusters)
```
totalCostToDate = SUM(each cluster's totalCostToDate)
```
This sums up the actual spend for each cluster based on its individual uptime.

## Real Example: Aviation Cluster

**Cluster Details:**
- Name: aviation
- Flavor: b3c.16x64.300gb.encrypted
- Workers: 3
- Created: 2023-11-27
- Uptime: 749 days (24 months)

**Cost Breakdown:**
1. **Per-Worker Cost**: $0.59/hr (bx3d.16x64 pricing)
2. **Hourly Cost**: $0.59 × 3 workers = **$1.77/hr**
3. **Monthly Cost**: $1.77 × 730 hrs = **$1,292.10/month**
4. **Yearly Cost**: $1,292.10 × 12 = **$15,505.20/year**
5. **Total Cost To Date**: $1,292.10 × (749 ÷ 30) = **$32,283.29**

## Why These Formulas?

### Monthly = Hourly × 730
- **730 hours** is the standard cloud billing month
- Based on 365 days/year ÷ 12 months × 24 hours/day
- Industry standard used by AWS, Azure, IBM Cloud

### Cost To Date = Monthly × (Days / 30)
- Calculates **actual spend** since cluster creation
- Uses 30-day months for simplicity
- More accurate than just multiplying by number of months
- Accounts for partial months

## Zone Multiplier (Not Currently Applied)

**Note**: The current implementation does NOT multiply costs by zone count because:
1. IBM Cloud pricing is **per worker node**, not per zone
2. If you have 3 workers in 1 zone, you pay for 3 workers
3. If you have 3 workers across 3 zones (1 per zone), you still pay for 3 workers
4. Zone count affects **availability**, not **cost per worker**

**If zone multiplier were applied** (which would be incorrect):
```
totalHourly = perWorkerHourly × workerCount × zoneCount
```
This would **triple** the cost for 3-zone deployments, which is not how IBM Cloud bills.

## Summary Table

| Metric | Formula | Example (aviation) |
|--------|---------|-------------------|
| Per-Worker Hourly | WORKER_FLAVORS[flavor] | $0.59/hr |
| Total Hourly | perWorker × workers | $1.77/hr |
| Total Monthly | hourly × 730 | $1,292.10 |
| Total Yearly | monthly × 12 | $15,505.20 |
| Cost To Date | monthly × (days/30) | $32,283.29 |

## Verification

To verify calculations:
```bash
# Get cluster details
curl -X POST http://localhost:3001/api/clusters/analyze | jq '.analysis.clusters[0]'

# Check specific cluster
curl -X POST http://localhost:3001/api/clusters/analyze | jq '.analysis.clusters[] | select(.name=="aviation")'
```

## Notes

1. **Pricing Source**: Worker flavor prices from IBM Cloud public pricing
2. **Currency**: All costs in USD
3. **Billing Period**: Continuous (24/7/365)
4. **Rounding**: Costs rounded to 2 decimal places for display
5. **Uptime**: Calculated from cluster creation date to current date

---

**Last Updated**: December 15, 2024  
**Version**: 1.0.1