# 🔧 IBM MAS PFVT Cost & Sizing Advisor

A web-based cost estimation and sizing advisor for IBM Maximo Application Suite (MAS) deployments on Red Hat OpenShift Kubernetes Service (ROKS) clusters.

## 🎯 Overview

The IBM MAS PFVT (Pre-Flight Validation Test) Cost & Sizing Advisor helps you:
- **Estimate costs** for MAS deployments on ROKS
- **Analyze existing clusters** with IBM Cloud integration
- **Select appropriate** worker node flavors
- **Assess configuration** risks
- **Get optimization** recommendations
- **Compare different** deployment scenarios
- **Track historical** costs
- **Export reports** to Excel

## 🆕 What's New

### 🎨 IBM Blue & Teal Theme
- Professional IBM-branded color scheme
- Modern gradient backgrounds
- Enhanced visual hierarchy
- Improved readability and contrast

### 🔐 Admin Authentication
- Secure access to cluster analysis features
- Password-protected admin functions
- Session-based authentication
- **Admin Password**: `pfvt2024`

### 🏠 Landing Page
- Two-mode selection interface:
  1. **MAS Resource Estimation** - Open to all users
  2. **PFVT Cluster Analysis** - Admin access only
- Clear feature descriptions
- Intuitive navigation

### 📊 IBM Cloud Cluster Analysis
- Connect to IBM Cloud API
- Analyze existing ROKS clusters
- Real-time cost calculations
- Hardware specifications display
- Export analysis to Excel
- Colored cost score badges (GREEN/AMBER/RED)

## ✨ Key Features

### 🔢 6 MAS Baseline Configurations
1. **Core + Manage** - Basic asset management (3 workers, 16 vCPU, 32GB RAM)
2. **Core + Manage + Assist** - AI-powered assistance (4 workers, 16 vCPU, 32GB RAM)
3. **Core + Manage + Monitor + Predict + IoT** - Full predictive maintenance (9 workers, 16 vCPU, 32GB RAM)
4. **Core + IoT** - IoT-focused deployment (3 workers, 8 vCPU, 16GB RAM)
5. **Core + Manage + MVI** - Visual inspection (3 workers, 16 vCPU, 32GB RAM)
6. **Core + Industry Solutions** - Specialized verticals (3 workers, 16 vCPU, 32GB RAM)

### 💰 18 Worker Node Flavors
- **Balanced (bx2) Series**: 8 flavors from bx2.4x16 to bx2.128x512
- **Balanced Dense (bx3d) Series**: 10 flavors from bx3d.4x20 to bx3d.176x880

### 🌍 Multi-Zone Support
- **1 Zone**: Development/testing environments
- **2 Zones**: Production (recommended)
- **3 Zones**: Mission-critical deployments

### 🎯 PFVT Cost Score
Zone-aware cost scoring system:
- **🟢 GREEN (Optimal)**: Cost within optimal range
- **🟡 AMBER (Moderate)**: Review for optimization opportunities
- **🔴 RED (High)**: Optimization recommended

**Thresholds adjust based on zones:**
- Single Zone: GREEN < $2k, AMBER $2k-$5k, RED > $5k
- Multi-Zone (2): GREEN < $4k, AMBER $4k-$10k, RED > $10k
- Multi-Zone (3): GREEN < $6k, AMBER $6k-$15k, RED > $15k

### 🛡️ Risk Assessment
- Configuration validation
- Flavor compatibility checks
- Zone redundancy warnings
- Cost optimization alerts

### 💡 Smart Recommendations
- Flavor suggestions based on requirements
- Cost optimization strategies
- Best practices guidance
- Availability recommendations

### 💾 Scenario Management
- Save up to 100 scenarios
- Load and compare scenarios
- Search and filter capabilities
- Import/export functionality

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No server or build process required!

### Installation

1. **Clone or download this repository**
```bash
git clone <repository-url>
cd PFVT-Costing
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
open index.html
# or
python -m http.server 8000  # Then visit http://localhost:8000
```

That's it! No npm install, no build process, no dependencies to manage.

## 📖 How to Use

### 🏠 Landing Page
When you first open the application, you'll see two options:

1. **MAS Resource Estimation** (Open Access)
   - Estimate costs for new MAS deployments
   - Select configurations and worker flavors
   - Get recommendations and risk assessments
   - Save and compare scenarios

2. **PFVT Cluster Analysis** (Admin Only)
   - Analyze existing IBM Cloud ROKS clusters
   - View real-time cost data
   - Export analysis to Excel
   - Requires admin password: `pfvt2024`

### 📊 MAS Resource Estimation Mode

#### Step 1: Select MAS Configuration
Choose from 6 baseline configurations based on your MAS components.

#### Step 2: Choose Deployment Options
- Select number of zones (1, 2, or 3)
- Choose worker node flavor from 46 options

#### Step 3: Calculate Costs
Click "Calculate Costs" to see:
- **PFVT Cost Score** (prominent colored badge)
- Cluster summary (workers, zones, resources)
- Cost breakdown (hourly, monthly, yearly)
- Risk assessment
- Recommendations

#### Step 4: Save Scenario (Optional)
Save your configuration for future reference and comparison.

#### Step 5: Compare Scenarios (Optional)
Load saved scenarios to compare different configurations.

### 🔍 PFVT Cluster Analysis Mode (Admin)

#### Step 1: Authentication
- Click "PFVT Cluster Analysis" on landing page
- Enter admin password: `pfvt2024`
- Access granted for current session

#### Step 2: Configure IBM Cloud Access
1. Navigate to backend directory
2. Copy `.env.example` to `.env`
3. Add your IBM Cloud API key:
   ```
   IBM_CLOUD_API_KEY=your_api_key_here
   IBM_CLOUD_REGION=us-south
   ```

#### Step 3: Start Backend Server
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:3001`

#### Step 4: Analyze Clusters
1. Click "Analyze Clusters" button
2. View comprehensive cluster analysis:
   - Cluster name and state
   - Creation date and uptime
   - Worker count and flavor
   - CPU, Memory, Disk specifications
   - Zone configuration
   - Monthly cost with colored score badge
   - Optimization recommendations

#### Step 5: Export to Excel
- Click "Export to Excel" button
- Download comprehensive analysis report
- Includes all cluster details and costs

### 🎨 Cost Score Color Indicators

The application uses colored badges to indicate cost levels:

- **🟢 GREEN**: Optimal cost range
  - Light green background (#defbe6)
  - Dark green text and border (#24a148)
  
- **🟡 AMBER**: Moderate cost, review recommended
  - Light yellow background (#fcf4d6)
  - Dark yellow text and border (#f1c21b)
  
- **🔴 RED**: High cost, optimization needed
  - Light red background (#fff1f1)
  - Dark red text and border (#fa4d56)

## 💡 Cost Calculation Formula

```
Total Cost = Workers × Zones × Hourly Rate × Hours

Example:
3 workers × 2 zones × $0.94/hr × 730 hours = $4,117.20/month
```

## 📊 Example Scenarios

### Scenario 1: Development Environment
- **Configuration**: Core + IoT
- **Flavor**: bx2.8x32 ($0.48/hr)
- **Zones**: 1
- **Monthly Cost**: ~$1,051 (🟢 GREEN)

### Scenario 2: Production Deployment
- **Configuration**: Core + Manage
- **Flavor**: bx2.16x64 ($0.94/hr)
- **Zones**: 2
- **Monthly Cost**: ~$4,117 (🟡 AMBER)

### Scenario 3: Full Suite
- **Configuration**: Core + Manage + Monitor + Predict + IoT
- **Flavor**: bx2.16x64 ($0.94/hr)
- **Zones**: 2
- **Monthly Cost**: ~$12,352 (🔴 RED)

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser localStorage
- **Deployment**: Static files (no server required)

### File Structure
```
PFVT-Costing/
├── index.html                    # Main application
├── css/
│   ├── styles.css                # Main styles (IBM Blue & Teal theme)
│   ├── landing.css               # Landing page styles
│   └── responsive.css            # Mobile/tablet styles
├── js/
│   ├── app.js                    # Application entry point
│   ├── auth.js                   # Admin authentication
│   ├── mode-selector.js          # Landing page mode selection
│   ├── config.js                 # MAS configurations (6)
│   ├── flavors.js                # Worker flavors (46)
│   ├── calculator.js             # Cost calculations
│   ├── risk-assessor.js          # Risk assessment
│   ├── recommendations.js        # Recommendations engine
│   ├── storage.js                # localStorage wrapper
│   ├── cluster-analysis.js       # IBM Cloud cluster analysis
│   ├── pfvt-integration.js       # PFVT pipeline integration
│   └── ui.js                     # UI controller
├── backend/
│   ├── server.js                 # Express server
│   ├── ibm-cloud-service.js      # IBM Cloud API integration
│   ├── excel-generator.js        # Excel report generation
│   ├── package.json              # Node dependencies
│   ├── .env.example              # Environment template
│   └── README.md                 # Backend documentation
├── docs/                         # Documentation
├── ARCHITECTURE.md               # Technical architecture
├── IMPLEMENTATION_PLAN.md        # Implementation details
├── UI_MOCKUP.md                  # UI design specs
├── WORKER_FLAVORS.md             # Flavor pricing reference
├── PLANNING_SUMMARY.md           # Project summary
├── CLUSTER_ANALYSIS_GUIDE.md     # Cluster analysis guide
├── COST_CALCULATION_EXPLAINED.md # Cost formula documentation
└── README.md                     # This file
```

## 🔧 Configuration

### MAS Baseline Configurations
Defined in `js/config.js`. Each configuration includes:
- Components (Core, Manage, IoT, etc.)
- Baseline requirements (workers, vCPU, RAM, disk)
- Description and use case

### Worker Node Flavors
Defined in `js/flavors.js`. Each flavor includes:
- Specifications (vCPU, RAM, storage, network)
- Hourly rate
- Category (Balanced or Balanced Dense)

### Cost Score Thresholds
Defined in `js/calculator.js`. Adjust thresholds in the `calculateCostScore()` function.

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security

### Admin Access
- Admin password: `pfvt2024`
- Change password in `js/auth.js`:
  ```javascript
  this.adminPassword = 'your_new_password';
  ```
- Session-based authentication (cleared on browser close)

### IBM Cloud API Key
- Store API key in `backend/.env` (never commit to Git)
- Use environment variables for sensitive data
- Rotate API keys regularly
- Follow IBM Cloud security best practices

## 🎨 Customization

### IBM Blue & Teal Theme
Current color scheme in `css/landing.css` and `css/styles.css`:
```css
/* IBM Colors */
--ibm-blue: #0f62fe;
--ibm-blue-hover: #0353e9;
--ibm-teal: #00b4a0;

/* Cost Score Colors */
--score-green: #24a148;
--score-amber: #f1c21b;
--score-red: #fa4d56;
```

### Branding
Update colors in `css/styles.css`:
```css
:root {
    --ibm-blue: #0f62fe;
    --score-green: #24a148;
    --score-amber: #f1c21b;
    --score-red: #fa4d56;
}
```

### Adding New Configurations
Edit `js/config.js` and add to `MAS_CONFIGURATIONS` array.

### Adding New Flavors
Edit `js/flavors.js` and add to `WORKER_FLAVORS` array.

## 🐛 Troubleshooting

### Scenarios not saving
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Calculations seem incorrect
- Verify flavor hourly rates in `js/flavors.js`
- Check zone multiplier is applied correctly
- Review cost formula in documentation

### UI not loading
- Ensure all JavaScript files are loaded
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 📄 License

This project is provided as-is for IBM MAS cost estimation purposes.

## 🤝 Contributing

This is an internal tool. For improvements or bug fixes, please contact the development team.

## 📞 Support

For questions or issues:
1. Check the Help section in the application
2. Review this README and documentation files
3. Contact your IBM representative

## 🔄 Version History

### Version 1.0.0 (2025-12-15)
- ✅ Initial release
- ✅ 6 MAS baseline configurations
- ✅ 18 worker node flavors
- ✅ Multi-zone support (1-3 zones)
- ✅ Zone-aware PFVT Cost Score
- ✅ Risk assessment engine
- ✅ Recommendations engine
- ✅ Scenario management (save/load/compare)
- ✅ Export functionality
- ✅ Responsive design
- ✅ Complete documentation

## 🎯 Roadmap

Future enhancements may include:
- [ ] Chart.js visualizations
- [ ] PDF export functionality
- [ ] Multi-cluster cost aggregation
- [ ] Integration with IBM Cloud pricing API
- [ ] Dark mode theme
- [ ] Internationalization (i18n)

## ⚠️ Important Notes

- **Cost estimates are approximate** - Actual costs may vary based on usage and IBM Cloud pricing
- **ROKS clusters only** - This tool is specifically for Red Hat OpenShift Kubernetes Service
- **Baseline sizing** - Actual requirements may vary based on workload and usage patterns
- **Multi-zone costs** - Remember that costs multiply by the number of zones
- **Storage not included** - Worker node costs only; additional storage costs may apply

## 🙏 Acknowledgments

Built for IBM MAS Pre-Flight Validation Testing (PFVT) cost estimation.

---

**Made with ❤️ for IBM MAS deployments**