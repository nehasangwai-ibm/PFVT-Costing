# IBM MAS PFVT Cost and Sizing Advisor - Architecture

## Overview
A lightweight web-based application for estimating IBM MAS (Maximo Application Suite) deployment costs on ROKS (Red Hat OpenShift Kubernetes Service) clusters.

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Charts**: Chart.js for cost visualization
- **Storage**: Browser localStorage for scenario persistence
- **Deployment**: Static files (no build process required)

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Browser (Client)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              User Interface Layer                      │  │
│  │  - Configuration Selector                              │  │
│  │  - Pricing Input Forms                                 │  │
│  │  - Results Dashboard                                   │  │
│  │  - Scenario Comparison View                            │  │
│  │  - Historical Timeline                                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Business Logic Layer (JavaScript)            │  │
│  │                                                         │  │
│  │  ┌─────────────────┐  ┌──────────────────┐            │  │
│  │  │ Cost Calculator │  │ Risk Assessor    │            │  │
│  │  │ - Worker costs  │  │ - Config checks  │            │  │
│  │  │ - Projections   │  │ - Flag issues    │            │  │
│  │  └─────────────────┘  └──────────────────┘            │  │
│  │                                                         │  │
│  │  ┌─────────────────┐  ┌──────────────────┐            │  │
│  │  │ Recommendation  │  │ Scenario Manager │            │  │
│  │  │ Engine          │  │ - Save/Load      │            │  │
│  │  │ - Best practices│  │ - Compare        │            │  │
│  │  └─────────────────┘  └──────────────────┘            │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Data Layer                                │  │
│  │  - MAS Baseline Configurations                         │  │
│  │  - Pricing Data                                        │  │
│  │  - localStorage (Scenarios & History)                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### MAS Configuration
```javascript
{
  id: "config-1",
  name: "Core + Manage",
  components: ["Core", "Manage"],
  workers: 3,
  vcpu: 16,
  ram: 32,
  disk: 250
}
```

### Pricing Input
```javascript
{
  instanceType: "bx3d.4x20",
  hourlyRate: 0.27,
  currency: "USD"
}
```

### Scenario
```javascript
{
  id: "scenario-uuid",
  name: "Production Deployment",
  timestamp: "2025-12-15T07:45:00Z",
  configuration: { /* MAS Config */ },
  pricing: { /* Pricing Input */ },
  results: {
    hourlyCost: 0.81,
    monthlyCost: 583.20,
    yearlyCost: 6998.40,
    risks: [],
    recommendations: []
  }
}
```

## Key Features

### 1. Configuration Selection
- Dropdown/radio selection for 6 baseline MAS configurations
- Dynamic display of worker count, vCPU, RAM, and disk requirements
- Visual representation of selected components

### 2. Cost Calculation
- Real-time cost computation as user inputs pricing
- Multiple time horizons: hourly, monthly, yearly
- Support for different instance types (bx3d, mx2, custom)

### 3. Risk Assessment
Rules-based system checking:
- Insufficient resources for selected components
- Non-standard configurations
- Cost optimization opportunities
- Scalability concerns

### 4. Recommendations
Context-aware suggestions:
- Right-sizing opportunities
- Alternative configurations
- Cost optimization strategies
- Best practices for selected components

### 5. Scenario Management
- Save current configuration as named scenario
- Load previously saved scenarios
- Compare multiple scenarios side-by-side
- Delete unwanted scenarios

### 6. Historical Tracking
- Persist all scenarios in localStorage
- Timeline view of cost trends
- Filter by date range or configuration type
- Export historical data

### 7. Visualization
Charts using Chart.js:
- Cost breakdown by component
- Comparison bar charts for scenarios
- Timeline trend charts
- Resource utilization pie charts

## File Structure

```
PFVT-Costing/
├── index.html              # Main application page
├── css/
│   ├── styles.css          # Main stylesheet
│   └── responsive.css      # Mobile/tablet styles
├── js/
│   ├── app.js              # Application initialization
│   ├── config.js           # MAS baseline configurations
│   ├── calculator.js       # Cost calculation engine
│   ├── risk-assessor.js    # Risk assessment logic
│   ├── recommendations.js  # Recommendation engine
│   ├── scenarios.js        # Scenario management
│   ├── storage.js          # localStorage wrapper
│   ├── charts.js           # Chart.js integration
│   └── ui.js               # UI event handlers
├── lib/
│   └── chart.min.js        # Chart.js library (CDN fallback)
├── docs/
│   ├── user-guide.md       # User documentation
│   └── sizing-guide.md     # MAS sizing reference
├── ARCHITECTURE.md         # This file
└── README.md               # Project overview
```

## User Flow

```
Start
  ↓
Select MAS Configuration
  ↓
View Resource Requirements
  ↓
Enter Instance Type & Pricing
  ↓
Calculate Costs
  ↓
Review Risks & Recommendations
  ↓
[Optional] Save as Scenario
  ↓
[Optional] Compare with Other Scenarios
  ↓
[Optional] View Historical Trends
  ↓
Export Results
  ↓
End
```

## Risk Assessment Rules

1. **Under-provisioned Resources**
   - Workers < baseline minimum
   - vCPU or RAM below recommended

2. **Over-provisioned Resources**
   - Excessive workers for component set
   - Cost > 150% of baseline estimate

3. **Configuration Mismatches**
   - Components requiring specific resources
   - Missing dependencies

4. **Cost Optimization**
   - Alternative instance types available
   - Potential for resource consolidation

## Recommendation Logic

Based on selected configuration:
- Suggest optimal instance types
- Highlight cost-saving opportunities
- Warn about scalability limits
- Provide best practices for component combinations

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations
- Lazy load Chart.js only when needed
- Debounce real-time calculations
- Limit localStorage to 100 scenarios max
- Optimize chart rendering for large datasets

## Security & Privacy
- All data stored locally (no server communication)
- No sensitive information transmitted
- User can clear all data via browser settings
- No authentication required (single-user tool)

## Future Enhancements
- PDF export functionality
- Excel export for cost reports
- Multi-cluster cost aggregation
- Integration with IBM Cloud pricing API
- Dark mode theme
- Internationalization (i18n)