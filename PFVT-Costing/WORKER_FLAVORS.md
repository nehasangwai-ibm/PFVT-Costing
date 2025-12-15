# IBM Cloud ROKS Worker Node Flavors - Pricing Reference

## Important Cost Calculation Note

**Worker node cost is multiplied by:**
1. Number of worker nodes
2. Number of zones

**Example**: A 3-node worker pool deployed across 2 zones = 3 × 2 = 6 × hourly rate

## Available Worker Node Flavors

### Balanced (bx2) Series - General Purpose
| Flavor | vCPU | Memory | Storage | Network | Hourly Cost | Monthly Cost* |
|--------|------|--------|---------|---------|-------------|---------------|
| bx2.4x16 | 4 | 16GB | 100GB BLOCK | 8Gbps | $0.28 | $204.40 |
| bx2.8x32 | 8 | 32GB | 100GB BLOCK | 16Gbps | $0.48 | $350.40 |
| bx2.16x64 | 16 | 64GB | 100GB BLOCK | 24Gbps | $0.94 | $686.20 |
| bx2.32x128 | 32 | 128GB | 100GB BLOCK | 25Gbps | $1.91 | $1,394.30 |
| bx2.48x192 | 48 | 192GB | 100GB BLOCK | 25Gbps | $2.85 | $2,080.50 |
| bx2.64x256 | 64 | 256GB | 100GB BLOCK | 25Gbps | $3.80 | $2,774.00 |
| bx2.96x384 | 96 | 384GB | 100GB BLOCK | 25Gbps | $5.68 | $4,146.40 |
| bx2.128x512 | 128 | 512GB | 100GB BLOCK | 25Gbps | $7.57 | $5,526.10 |

### Balanced Dense (bx3d) Series - Higher Memory Density
| Flavor | vCPU | Memory | Storage | Network | Hourly Cost | Monthly Cost* |
|--------|------|--------|---------|---------|-------------|---------------|
| bx3d.4x20 | 4 | 20GB | 100GB BLOCK | 6Gbps | $0.27 | $197.10 |
| bx3d.8x40 | 8 | 40GB | 100GB BLOCK | 12Gbps | $0.51 | $372.30 |
| bx3d.16x80 | 16 | 80GB | 100GB BLOCK | 24Gbps | $1.01 | $737.30 |
| bx3d.24x120 | 24 | 120GB | 100GB BLOCK | 32Gbps | $1.50 | $1,095.00 |
| bx3d.32x160 | 32 | 160GB | 100GB BLOCK | 32Gbps | $1.99 | $1,452.70 |
| bx3d.48x240 | 48 | 240GB | 100GB BLOCK | 32Gbps | $2.98 | $2,175.40 |
| bx3d.64x320 | 64 | 320GB | 100GB BLOCK | 32Gbps | $3.97 | $2,898.10 |
| bx3d.96x480 | 96 | 480GB | 100GB BLOCK | 32Gbps | $5.94 | $4,336.20 |
| bx3d.128x640 | 128 | 640GB | 100GB BLOCK | 32Gbps | $7.92 | $5,781.60 |
| bx3d.176x880 | 176 | 880GB | 100GB BLOCK | 32Gbps | $10.88 | $7,942.40 |

*Monthly cost = Hourly cost × 730 hours (single node, single zone)

## Cost Calculation Formula

```
Total Cost = Hourly Rate × Number of Workers × Number of Zones × Hours

Examples:
- Hourly: $0.27 × 3 workers × 2 zones = $1.62/hr
- Monthly: $0.27 × 3 workers × 2 zones × 730 hours = $1,182.60/month
- Yearly: $0.27 × 3 workers × 2 zones × 8,760 hours = $14,191.20/year
```

## Flavor Selection Guidelines

### For MAS Core + Manage (3 workers, 16 vCPU, 32GB RAM)
**Recommended Flavors:**
- **bx2.16x64** - Meets requirements exactly ($0.94/hr per node)
- **bx3d.16x80** - Extra memory headroom ($1.01/hr per node)

### For MAS Core + Manage + Assist (4 workers, 16 vCPU, 32GB RAM)
**Recommended Flavors:**
- **bx2.16x64** - Meets requirements exactly ($0.94/hr per node)
- **bx3d.16x80** - Extra memory headroom ($1.01/hr per node)

### For MAS Core + Manage + Monitor + Predict + IoT (9 workers, 16 vCPU, 32GB RAM)
**Recommended Flavors:**
- **bx2.16x64** - Meets requirements exactly ($0.94/hr per node)
- **bx3d.16x80** - Extra memory headroom ($1.01/hr per node)

### For MAS Core + IoT (3 workers, 8 vCPU, 16GB RAM)
**Recommended Flavors:**
- **bx2.8x32** - Exceeds requirements ($0.48/hr per node)
- **bx3d.8x40** - Extra memory ($0.51/hr per node)
- **bx2.4x16** - Meets minimum ($0.28/hr per node)

### For MAS Core + Manage + MVI (3 workers, 16 vCPU, 32GB RAM)
**Recommended Flavors:**
- **bx2.16x64** - Meets requirements exactly ($0.94/hr per node)
- **bx3d.16x80** - Extra memory headroom ($1.01/hr per node)

### For MAS Core + Industry Solutions (3 workers, 16 vCPU, 32GB RAM)
**Recommended Flavors:**
- **bx2.16x64** - Meets requirements exactly ($0.94/hr per node)
- **bx3d.16x80** - Extra memory headroom ($1.01/hr per node)

## Multi-Zone Deployment Considerations

### Single Zone (1 zone)
- **Cost Multiplier**: 1x
- **Availability**: Lower (single point of failure)
- **Use Case**: Development, testing, non-critical workloads

### Multi-Zone (2 zones)
- **Cost Multiplier**: 2x
- **Availability**: High (zone redundancy)
- **Use Case**: Production workloads, recommended for MAS

### Multi-Zone (3 zones)
- **Cost Multiplier**: 3x
- **Availability**: Very High (maximum redundancy)
- **Use Case**: Mission-critical production workloads

## Cost Examples by Configuration

### Example 1: Core + Manage (Single Zone)
- Configuration: 3 workers, 16 vCPU, 32GB RAM
- Flavor: bx2.16x64 ($0.94/hr)
- Zones: 1
- **Hourly**: $0.94 × 3 = $2.82
- **Monthly**: $2.82 × 730 = $2,058.60
- **Yearly**: $2.82 × 8,760 = $24,703.20

### Example 2: Core + Manage (Multi-Zone)
- Configuration: 3 workers, 16 vCPU, 32GB RAM
- Flavor: bx2.16x64 ($0.94/hr)
- Zones: 2
- **Hourly**: $0.94 × 3 × 2 = $5.64
- **Monthly**: $5.64 × 730 = $4,117.20
- **Yearly**: $5.64 × 8,760 = $49,406.40

### Example 3: Full Suite (Multi-Zone)
- Configuration: 9 workers, 16 vCPU, 32GB RAM
- Flavor: bx2.16x64 ($0.94/hr)
- Zones: 2
- **Hourly**: $0.94 × 9 × 2 = $16.92
- **Monthly**: $16.92 × 730 = $12,351.60
- **Yearly**: $16.92 × 8,760 = $148,219.20

## Updated PFVT Cost Score Thresholds

Given multi-zone deployments are standard for production:

### Single Zone Deployments
- **🟢 GREEN (Optimal)**: < $2,000/month
- **🟡 AMBER (Moderate)**: $2,000 - $5,000/month
- **🔴 RED (High)**: > $5,000/month

### Multi-Zone Deployments (2 zones)
- **🟢 GREEN (Optimal)**: < $4,000/month
- **🟡 AMBER (Moderate)**: $4,000 - $10,000/month
- **🔴 RED (High)**: > $10,000/month

### Multi-Zone Deployments (3 zones)
- **🟢 GREEN (Optimal)**: < $6,000/month
- **🟡 AMBER (Moderate)**: $6,000 - $15,000/month
- **🔴 RED (High)**: > $15,000/month

## Implementation Notes

1. **Zone Selection**: Add dropdown for number of zones (1, 2, or 3)
2. **Flavor Dropdown**: Include all 18 flavors with specs
3. **Auto-Recommendation**: Suggest appropriate flavors based on MAS config
4. **Cost Multiplier**: Clearly show zone multiplier in calculations
5. **Score Adjustment**: Adjust PFVT Cost Score thresholds based on zones
6. **Validation**: Warn if selected flavor doesn't meet baseline requirements