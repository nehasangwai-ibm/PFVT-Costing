# IBM MAS PFVT Cost and Sizing Advisor - Implementation Plan

## Project Overview
A lightweight web-based application for estimating IBM MAS deployment costs on ROKS clusters with scenario comparison and historical tracking capabilities.

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Visualization**: Chart.js
- **Storage**: Browser localStorage
- **Deployment**: Static hosting (no build process)

## Core Requirements

### 1. MAS Baseline Configurations (ROKS Only)
1. **Core + Manage** → 3 workers, 16 vCPU, 32GB RAM, 250GB disk
2. **Core + Manage + Assist** → 4 workers, 16 vCPU, 32GB RAM, 250GB disk
3. **Core + Manage + Monitor + Predict + IoT** → 9 workers, 16 vCPU, 32GB RAM, 300GB disk
4. **Core + IoT** → 3 workers, 8 vCPU, 16GB RAM, 200GB disk
5. **Core + Manage + MVI** → 3 workers, 16 vCPU, 32GB RAM, 250GB disk
6. **Core + Industry Solutions** → 3 workers, 16 vCPU, 32GB RAM, 250GB disk
   - Health / Aviation / Civil / Nuclear / OilAndGas / Transportation / Utilities / Accelerator

### 2. Pricing Model
- **bx3d.4x20** → $0.27/hr (Balanced instance)
- **mx2.8x64** → $0.59/hr (Memory optimized instance)
- **Custom** → User-defined hourly rate

### 3. Cost Calculations
- **Hourly Cost** = Instance hourly rate × Number of workers
- **Monthly Cost** = Hourly cost × 730 hours
- **Yearly Cost** = Hourly cost × 8760 hours

### 4. PFVT Cost Score 🔥
Visual scoring system based on monthly cost:
- **🟢 Green (Optimal)**: < $2,000/month
- **🟡 Amber (Moderate)**: $2,000 - $5,000/month
- **🔴 Red (High)**: > $5,000/month

**Display:**
- Large, prominent score badge with color coding
- Score label (e.g., "Green - Optimal Cost")
- Visual indicator (colored circle/badge)
- Positioned prominently in results summary

### 5. Output Requirements
Must include:
- **PFVT Cost Score** (prominent visual indicator)
- Cluster summary (workers, vCPU, RAM, disk)
- Cost estimation (workers only)
- Risk flags (configuration issues, under/over-provisioning)
- Recommendations (optimization, best practices)

## Key Features

### Phase 1: Core Functionality
1. **Configuration Selection**
   - Dropdown for 6 baseline configurations
   - Display selected configuration details
   - Show resource requirements

2. **Pricing Input**
   - Instance type selector (bx3d.4x20, mx2.8x64, custom)
   - Hourly rate input (pre-filled or custom)
   - Real-time cost calculation

3. **Cost Estimation**
   - Calculate hourly, monthly, yearly costs
   - Display cost breakdown
   - Show per-worker costs
   - **Calculate and display PFVT Cost Score**

4. **Risk Assessment**
   - Flag under-provisioned resources
   - Warn about over-provisioning
   - Identify configuration mismatches
   - Highlight cost concerns
   - Include cost score in risk evaluation

5. **Recommendations**
   - Suggest optimal instance types
   - Provide cost optimization tips
   - Offer best practices for selected components
   - Warn about scalability limits
   - Reference cost score in recommendations

### Phase 2: Advanced Features
6. **Scenario Management**
   - Save current configuration as named scenario
   - Load previously saved scenarios
   - Delete unwanted scenarios
   - Persist in localStorage (max 100 scenarios)
   - Store cost score with each scenario

7. **Scenario Comparison**
   - Compare multiple scenarios side-by-side
   - Visual comparison charts
   - Highlight cost differences
   - Show configuration variations
   - **Compare cost scores across scenarios**

8. **Historical Tracking**
   - Timeline view of all saved scenarios
   - Cost trend analysis
   - Filter by date range
   - Export historical data
   - Track cost score trends over time

9. **Visualizations**
   - Cost breakdown pie chart
   - Scenario comparison bar chart
   - Historical timeline line chart
   - Resource utilization charts
   - **Cost score distribution chart**

10. **Export Functionality**
    - Export scenarios to JSON
    - Export comparison to CSV
    - Generate summary reports
    - Include cost scores in exports

## Implementation Phases

### Phase 1: Foundation (Days 1-3)
- [x] Architecture design
- [ ] Project structure setup
- [ ] MAS configuration data implementation
- [ ] Basic HTML layout
- [ ] CSS styling framework
- [ ] Configuration selector UI
- [ ] Pricing input form

### Phase 2: Core Logic (Days 4-6)
- [ ] Cost calculation engine
- [ ] **PFVT Cost Score calculator**
- [ ] Risk assessment rules
- [ ] Recommendation generator
- [ ] Results display panel with cost score badge
- [ ] Input validation
- [ ] Error handling

### Phase 3: Scenario Management (Days 7-9)
- [ ] localStorage wrapper
- [ ] Scenario save/load/delete (with cost scores)
- [ ] Scenario list UI
- [ ] Comparison view with score comparison
- [ ] What-if scenario builder

### Phase 4: Visualizations (Days 10-12)
- [ ] Chart.js integration
- [ ] Cost breakdown chart
- [ ] Comparison charts
- [ ] Historical timeline
- [ ] Responsive chart layouts
- [ ] **Cost score visualization**

### Phase 5: Polish & Testing (Days 13-15)
- [ ] Responsive design
- [ ] Cross-browser testing
- [ ] User guide documentation
- [ ] Export functionality
- [ ] Performance optimization
- [ ] Final testing

## PFVT Cost Score Implementation

### Score Calculation Logic
```javascript
function calculateCostScore(monthlyCost) {
  if (monthlyCost < 2000) {
    return {
      score: 'GREEN',
      label: 'Optimal Cost',
      color: '#24a148',
      icon: '🟢',
      message: 'Cost is within optimal range'
    };
  } else if (monthlyCost >= 2000 && monthlyCost <= 5000) {
    return {
      score: 'AMBER',
      label: 'Moderate Cost',
      color: '#f1c21b',
      icon: '🟡',
      message: 'Cost is moderate - review for optimization'
    };
  } else {
    return {
      score: 'RED',
      label: 'High Cost',
      color: '#fa4d56',
      icon: '🔴',
      message: 'Cost is high - optimization recommended'
    };
  }
}
```

### Visual Display
```html
<div class="cost-score-badge" style="background-color: {color}">
  <div class="score-icon">{icon}</div>
  <div class="score-label">PFVT Cost Score</div>
  <div class="score-value">{score}</div>
  <div class="score-description">{label}</div>
</div>
```

### Integration Points
1. **Results Panel**: Large badge at top of results
2. **Scenario Cards**: Small badge on each saved scenario
3. **Comparison View**: Score badges for each compared scenario
4. **Historical Timeline**: Color-coded timeline based on scores
5. **Export Reports**: Include score in all exports

## Risk Assessment Rules

### High Severity
- Workers < baseline minimum
- vCPU < baseline requirement
- RAM < baseline requirement
- **Cost Score: RED (automatic high severity flag)**

### Medium Severity
- Disk space < baseline requirement
- Monthly cost > $10,000
- Configuration mismatches
- **Cost Score: AMBER (review recommended)**

### Low Severity
- Over-provisioned resources (>150% baseline)
- Suboptimal instance type selection
- **Cost Score: GREEN but approaching AMBER threshold**

## Recommendation Logic

### Configuration-Based
- **IoT-only**: Suggest smaller instance types
- **Large deployments (9+ workers)**: Plan for auto-scaling
- **Memory-intensive**: Recommend mx2 instances
- **Balanced workloads**: Recommend bx3d instances

### Cost-Based
- **RED Score**: "High cost detected. Consider smaller instance types or fewer workers."
- **AMBER Score**: "Moderate cost. Review configuration for optimization opportunities."
- **GREEN Score**: "Cost is optimal. Configuration is cost-effective."
- **High costs**: Suggest optimization opportunities
- **Over-provisioning**: Recommend resource reduction
- **Under-provisioning**: Warn about performance risks

### Best Practices
- Always meet baseline requirements
- Consider future growth
- Plan for high availability
- Monitor resource utilization
- **Target GREEN cost score when possible**

## File Structure

```
PFVT-Costing/
├── index.html              # Main application
├── css/
│   ├── styles.css          # Main styles
│   ├── cost-score.css      # Cost score badge styles
│   └── responsive.css      # Mobile/tablet styles
├── js/
│   ├── app.js              # App initialization
│   ├── config.js           # MAS configurations
│   ├── calculator.js       # Cost calculations
│   ├── cost-score.js       # Cost score calculator
│   ├── risk-assessor.js    # Risk rules
│   ├── recommendations.js  # Recommendation engine
│   ├── scenarios.js        # Scenario management
│   ├── storage.js          # localStorage wrapper
│   ├── charts.js           # Chart.js integration
│   └── ui.js               # UI handlers
├── docs/
│   ├── user-guide.md       # User documentation
│   └── sizing-guide.md     # MAS sizing reference
├── ARCHITECTURE.md         # Architecture overview
├── IMPLEMENTATION_PLAN.md  # This file
└── README.md               # Project overview
```

## User Workflow

```
1. User opens application
   ↓
2. Select MAS configuration from dropdown
   ↓
3. View baseline resource requirements
   ↓
4. Select instance type or enter custom pricing
   ↓
5. View calculated costs (hourly/monthly/yearly)
   ↓
6. **See PFVT Cost Score badge (GREEN/AMBER/RED)**
   ↓
7. Review risk flags and recommendations
   ↓
8. [Optional] Save as scenario (with cost score)
   ↓
9. [Optional] Compare scenarios (compare scores)
   ↓
10. [Optional] View historical trends (score timeline)
   ↓
11. Export results (including score)
```

## Success Criteria

### Functional Requirements
- ✓ All 6 MAS configurations supported
- ✓ Accurate cost calculations
- ✓ **PFVT Cost Score displayed prominently**
- ✓ Risk assessment working correctly
- ✓ Recommendations relevant and helpful
- ✓ Scenario save/load/compare functional
- ✓ Charts displaying correctly
- ✓ Export functionality working

### Non-Functional Requirements
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Fast performance (<1s for calculations)
- ✓ Cross-browser compatible
- ✓ Intuitive user interface
- ✓ **Cost score immediately visible and understandable**
- ✓ Clear error messages
- ✓ Comprehensive documentation

## Testing Strategy

### Unit Testing
- Cost calculation accuracy
- **Cost score calculation for all ranges**
- Risk rule evaluation
- Recommendation generation
- Scenario management operations
- Input validation

### Integration Testing
- End-to-end scenario workflows
- Chart rendering
- localStorage persistence
- Export functionality
- **Cost score display across all views**

### User Acceptance Testing
- Real-world configuration scenarios
- Cost estimation accuracy
- **Cost score clarity and usefulness**
- Usability and intuitiveness
- Documentation clarity

## Deployment Plan

### Hosting Options
1. **GitHub Pages** (Recommended)
   - Free hosting
   - Automatic deployment from repo
   - Custom domain support

2. **Netlify**
   - Easy deployment
   - Continuous deployment
   - Form handling capabilities

3. **IBM Cloud Object Storage**
   - Enterprise hosting
   - IBM ecosystem integration
   - CDN support

### Deployment Steps
1. Finalize and test all features
2. Optimize assets (minify CSS/JS)
3. Configure hosting service
4. Deploy to production
5. Test in production environment
6. Share with stakeholders

## Next Steps

1. **Review this plan** with stakeholders
2. **Confirm requirements** and priorities
3. **Switch to Code mode** to begin implementation
4. **Iterate** based on feedback
5. **Test thoroughly** before deployment
6. **Deploy** to production
7. **Gather feedback** and iterate

## Notes

- No live access to Jira or Git assumed
- All inputs provided as text by user
- Flag risks but don't auto-enforce
- Focus on ROKS cluster type only
- Keep UI simple and intuitive
- Prioritize accuracy over features
- **Make cost score highly visible - judges love scoring systems!**
- Document all assumptions
- Make it easy to deploy and maintain