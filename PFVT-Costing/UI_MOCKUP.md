# IBM MAS PFVT Cost and Sizing Advisor - UI Mockup

## Main Application Layout

```
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║        🔧 IBM MAS PFVT Cost and Sizing Advisor                       ║
║        Pre-Flight Validation Test - ROKS Cluster Costing             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────┐
│  📋 CONFIGURATION SELECTION                                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Select MAS Configuration:                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Core + Manage                                          ▼    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ℹ️ Configuration Details:                                            │
│  • Components: Core, Manage                                           │
│  • Baseline: 3 workers, 16 vCPU, 32GB RAM, 250GB disk               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  💰 PRICING INPUT                                                     │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Instance Type:                                                       │
│  ○ bx3d.4x20 ($0.27/hr) - Balanced                                   │
│  ○ mx2.8x64 ($0.59/hr) - Memory Optimized                            │
│  ○ Custom                                                             │
│                                                                       │
│  Hourly Rate: ┌──────────┐ USD                                       │
│               │  0.27    │                                            │
│               └──────────┘                                            │
│                                                                       │
│  [Calculate Costs]                                                    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  📊 COST ESTIMATION RESULTS                                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    🟢 PFVT COST SCORE                        │    │
│  │                                                               │    │
│  │                         GREEN                                 │    │
│  │                    Optimal Cost                               │    │
│  │                                                               │    │
│  │              Monthly Cost: $591.30                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Cluster Summary:                                                     │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐      │
│  │   Workers    │     vCPU     │     RAM      │     Disk     │      │
│  │      3       │      16      │    32 GB     │   250 GB     │      │
│  └──────────────┴──────────────┴──────────────┴──────────────┘      │
│                                                                       │
│  Cost Breakdown:                                                      │
│  • Hourly:   $0.81  (3 workers × $0.27/hr)                           │
│  • Monthly:  $591.30  (730 hours)                                    │
│  • Yearly:   $7,095.60  (8,760 hours)                                │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  ⚠️  RISK ASSESSMENT                                                  │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ✅ No critical risks detected                                        │
│                                                                       │
│  Configuration Status:                                                │
│  ✓ Workers meet baseline requirements                                │
│  ✓ vCPU allocation adequate                                          │
│  ✓ RAM allocation adequate                                           │
│  ✓ Disk space adequate                                               │
│  ✓ Cost within optimal range                                         │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  💡 RECOMMENDATIONS                                                   │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ✓ Cost is optimal. Configuration is cost-effective.                 │
│  ✓ Balanced instance type (bx3d.4x20) is appropriate for this        │
│    workload.                                                          │
│  ℹ️ Consider planning for high availability with additional workers   │
│    for production environments.                                       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  💾 SCENARIO MANAGEMENT                                               │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Scenario Name: ┌────────────────────────────────────┐               │
│                 │ Production Deployment              │               │
│                 └────────────────────────────────────┘               │
│                                                                       │
│  [Save Scenario]  [Load Scenario]  [Compare Scenarios]               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Cost Score Badge Variations

### Green Score (< $2,000/month)
```
┌─────────────────────────────────────────────────────────────┐
│                    🟢 PFVT COST SCORE                        │
│                                                               │
│                         GREEN                                 │
│                    Optimal Cost                               │
│                                                               │
│              Monthly Cost: $591.30                            │
│         Cost is within optimal range                          │
└─────────────────────────────────────────────────────────────┘
```

### Amber Score ($2,000 - $5,000/month)
```
┌─────────────────────────────────────────────────────────────┐
│                    🟡 PFVT COST SCORE                        │
│                                                               │
│                         AMBER                                 │
│                    Moderate Cost                              │
│                                                               │
│              Monthly Cost: $3,285.00                          │
│      Cost is moderate - review for optimization              │
└─────────────────────────────────────────────────────────────┘
```

### Red Score (> $5,000/month)
```
┌─────────────────────────────────────────────────────────────┐
│                    🔴 PFVT COST SCORE                        │
│                                                               │
│                          RED                                  │
│                      High Cost                                │
│                                                               │
│              Monthly Cost: $7,884.00                          │
│         Cost is high - optimization recommended              │
└─────────────────────────────────────────────────────────────┘
```

## Scenario Comparison View

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    SCENARIO COMPARISON                                ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────┬─────────────────────┬─────────────────────┐
│   Scenario 1        │   Scenario 2        │   Scenario 3        │
│   Production        │   Development       │   Full Suite        │
├─────────────────────┼─────────────────────┼─────────────────────┤
│                     │                     │                     │
│   🟢 GREEN          │   🟢 GREEN          │   🔴 RED            │
│   Optimal Cost      │   Optimal Cost      │   High Cost         │
│                     │                     │                     │
│   Core + Manage     │   Core + IoT        │   Core + Manage +   │
│                     │                     │   Monitor + Predict │
│                     │                     │   + IoT             │
│                     │                     │                     │
│   Workers: 3        │   Workers: 3        │   Workers: 9        │
│   vCPU: 16          │   vCPU: 8           │   vCPU: 16          │
│   RAM: 32 GB        │   RAM: 16 GB        │   RAM: 32 GB        │
│   Disk: 250 GB      │   Disk: 200 GB      │   Disk: 300 GB      │
│                     │                     │                     │
│   Instance:         │   Instance:         │   Instance:         │
│   bx3d.4x20         │   bx3d.4x20         │   mx2.8x64          │
│   $0.27/hr          │   $0.27/hr          │   $0.59/hr          │
│                     │                     │                     │
│   Monthly: $591.30  │   Monthly: $591.30  │   Monthly: $3,876   │
│   Yearly: $7,095.60 │   Yearly: $7,095.60 │   Yearly: $46,512   │
│                     │                     │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘

[Export Comparison]  [Add Scenario]  [Remove Scenario]

📊 Cost Comparison Chart
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  $50k ┤                                                         │
│       │                                                         │
│  $40k ┤                                              ███        │
│       │                                              ███        │
│  $30k ┤                                              ███        │
│       │                                              ███        │
│  $20k ┤                                              ███        │
│       │                                              ███        │
│  $10k ┤         ███                ███               ███        │
│       │         ███                ███               ███        │
│   $0  ┼─────────███────────────────███───────────────███────── │
│         Production      Development        Full Suite          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Historical Timeline View

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    HISTORICAL COST TRACKING                           ║
╚═══════════════════════════════════════════════════════════════════════╝

Filter: [Last 7 Days ▼]  [All Configurations ▼]

📈 Cost Trend Over Time
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  $8k  ┤                                                         │
│       │                                                         │
│  $6k  ┤                                    ●                    │
│       │                          ●                              │
│  $4k  ┤                ●                                        │
│       │      ●                                                  │
│  $2k  ┤  ●                                                      │
│       │                                                         │
│   $0  ┼─────────────────────────────────────────────────────── │
│       Dec 8    Dec 10    Dec 12    Dec 14    Dec 16           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Saved Scenarios:
┌─────────────────────────────────────────────────────────────────┐
│  🟢 Production Deployment          Dec 15, 2025    $591.30/mo   │
│     Core + Manage | 3 workers | bx3d.4x20                       │
│     [View] [Compare] [Delete]                                   │
├─────────────────────────────────────────────────────────────────┤
│  🟡 Staging Environment            Dec 14, 2025    $3,285/mo    │
│     Core + Manage + Assist | 4 workers | mx2.8x64              │
│     [View] [Compare] [Delete]                                   │
├─────────────────────────────────────────────────────────────────┤
│  🔴 Full Production Suite          Dec 12, 2025    $7,884/mo    │
│     Core + Manage + Monitor + Predict + IoT | 9 workers        │
│     [View] [Compare] [Delete]                                   │
└─────────────────────────────────────────────────────────────────┘

[Export All Scenarios]  [Clear History]
```

## Mobile Responsive View (< 768px)

```
┌─────────────────────────────────┐
│  🔧 IBM MAS PFVT Advisor        │
│  Cost & Sizing Tool             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  📋 Configuration               │
├─────────────────────────────────┤
│  [Core + Manage          ▼]    │
│                                 │
│  ℹ️ 3 workers, 16 vCPU          │
│     32GB RAM, 250GB disk        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  💰 Pricing                     │
├─────────────────────────────────┤
│  ○ bx3d.4x20 ($0.27/hr)        │
│  ○ mx2.8x64 ($0.59/hr)         │
│  ○ Custom                       │
│                                 │
│  [Calculate]                    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  🟢 PFVT COST SCORE             │
│                                 │
│       GREEN                     │
│   Optimal Cost                  │
│                                 │
│  Monthly: $591.30               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  📊 Costs                       │
├─────────────────────────────────┤
│  Hourly:  $0.81                 │
│  Monthly: $591.30               │
│  Yearly:  $7,095.60             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ⚠️ Risks                       │
├─────────────────────────────────┤
│  ✅ No risks detected           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  💡 Recommendations             │
├─────────────────────────────────┤
│  ✓ Cost is optimal              │
│  ✓ Configuration appropriate    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  💾 Scenarios                   │
├─────────────────────────────────┤
│  [Save] [Load] [Compare]        │
└─────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **IBM Blue**: #0f62fe (Primary actions, headers)
- **Green (Optimal)**: #24a148 (Cost score GREEN)
- **Amber (Moderate)**: #f1c21b (Cost score AMBER)
- **Red (High)**: #fa4d56 (Cost score RED)

### Secondary Colors
- **Gray 10**: #f4f4f4 (Background)
- **Gray 50**: #8d8d8d (Secondary text)
- **Gray 100**: #161616 (Primary text)
- **White**: #ffffff (Cards, panels)

### Status Colors
- **Success**: #24a148 (Checkmarks, success messages)
- **Warning**: #f1c21b (Warnings, moderate risks)
- **Error**: #fa4d56 (Errors, high risks)
- **Info**: #0f62fe (Information, tips)

## Typography

### Headings
- **H1**: 32px, Bold (Page title)
- **H2**: 24px, Semi-bold (Section headers)
- **H3**: 18px, Semi-bold (Subsections)

### Body Text
- **Regular**: 14px, Normal (Body text)
- **Small**: 12px, Normal (Helper text)
- **Large**: 16px, Normal (Important values)

### Cost Score Badge
- **Score Label**: 48px, Bold (GREEN/AMBER/RED)
- **Description**: 18px, Normal (Optimal Cost, etc.)
- **Cost Value**: 24px, Semi-bold ($591.30)

## Interactive Elements

### Buttons
```
Primary:   [Calculate Costs]  (Blue background, white text)
Secondary: [Save Scenario]    (White background, blue border)
Danger:    [Delete]           (Red background, white text)
```

### Form Inputs
```
Text Input:  ┌──────────────┐
             │ Enter value  │
             └──────────────┘

Dropdown:    ┌──────────────┐
             │ Select...  ▼ │
             └──────────────┘

Radio:       ○ Option 1
             ● Option 2 (selected)
```

### Cards
```
┌─────────────────────────────────┐
│  Card Title                     │
├─────────────────────────────────┤
│  Card content goes here         │
│  with multiple lines            │
└─────────────────────────────────┘
```

## Accessibility Features

- High contrast color combinations
- Clear focus indicators for keyboard navigation
- ARIA labels for screen readers
- Semantic HTML structure
- Responsive font sizes
- Touch-friendly button sizes (min 44x44px)
- Alt text for all icons and images
- Clear error messages
- Keyboard shortcuts for common actions

## Animation & Transitions

- Smooth transitions for cost score changes (0.3s ease)
- Fade-in for results panel (0.2s)
- Slide-in for scenario cards (0.3s)
- Hover effects on interactive elements
- Loading spinner during calculations
- Success/error toast notifications

## Key UI Principles

1. **Cost Score Prominence**: The PFVT Cost Score badge is the most prominent element in the results section
2. **Clear Hierarchy**: Information flows from configuration → pricing → results → actions
3. **Visual Feedback**: Immediate visual feedback for all user actions
4. **Responsive Design**: Adapts seamlessly from mobile to desktop
5. **Accessibility First**: Usable by everyone, including keyboard-only and screen reader users
6. **Performance**: Fast, responsive, no unnecessary animations
7. **Clarity**: Clear labels, helpful tooltips, no jargon
8. **Consistency**: Consistent spacing, colors, and interaction patterns throughout