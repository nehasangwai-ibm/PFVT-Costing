# 🚀 IBM MAS PFVT Cost & Sizing Advisor - Complete Setup Guide

## Bob-a-thon Edition with GitHub Integration

This guide will help you set up the complete system with one-click GitHub deployment.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [GitHub Configuration](#github-configuration)
5. [Running the Application](#running-the-application)
6. [Features Overview](#features-overview)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- Python 3.x (for frontend server)
- GitHub Enterprise account with access to `maximoappsuite/fvt-personal`
- GitHub Personal Access Token

### Installation (5 minutes)

```bash
# 1. Clone/navigate to project
cd PFVT-Costing

# 2. Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your GitHub token

# 3. Start backend
npm start

# 4. In new terminal, start frontend
cd ..
python3 -m http.server 8000
```

**Access:**
- Frontend: http://localhost:8000
- Backend API: http://localhost:3001

---

## 🎨 Frontend Setup

### Structure
```
PFVT-Costing/
├── index.html              # Main UI
├── css/
│   ├── styles.css          # Main styles
│   └── responsive.css      # Mobile responsive
├── js/
│   ├── config.js           # 6 MAS configurations
│   ├── flavors.js          # 46 worker flavors
│   ├── calculator.js       # Cost calculation engine
│   ├── risk-assessor.js    # Risk assessment
│   ├── recommendations.js  # Smart recommendations
│   ├── storage.js          # Scenario management
│   ├── pfvt-integration.js # GitHub integration
│   ├── ui.js               # UI controller
│   └── app.js              # App initialization
└── docs/                   # Documentation
```

### Running Frontend

**Option 1: Python HTTP Server (Recommended)**
```bash
python3 -m http.server 8000
```

**Option 2: Node.js HTTP Server**
```bash
npx http-server -p 8000
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 🔧 Backend Setup

### Installation

```bash
cd backend
npm install
```

### Configuration

1. **Create `.env` file:**
```bash
cp .env.example .env
```

2. **Edit `.env`:**
```env
# GitHub Enterprise Token
GITHUB_TOKEN=ghp_your_token_here

# Server Port
PORT=3001

# Tekton Pipeline URL
TEKTON_PIPELINE_URL=https://cloud.ibm.com/devops/pipelines/tekton/3612e317-4d13-42a4-b798-d7db422549f8/runs

# CORS
ALLOWED_ORIGINS=http://localhost:8000
```

### Running Backend

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Verify Backend:**
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-15T09:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 🔐 GitHub Configuration

### Creating Personal Access Token

1. **Go to GitHub Enterprise:**
   ```
   https://github.ibm.com/settings/tokens
   ```

2. **Generate New Token:**
   - Click "Generate new token"
   - Name: "PFVT Cost Advisor"
   - Expiration: 90 days (or custom)

3. **Select Scopes:**
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)

4. **Generate and Copy Token:**
   - Click "Generate token"
   - Copy token immediately (you won't see it again!)
   - Paste into `backend/.env` file

### Repository Access

Ensure you have access to:
```
https://github.ibm.com/maximoappsuite/fvt-personal
```

Test access:
```bash
git clone https://github.ibm.com/maximoappsuite/fvt-personal.git
```

---

## 🎮 Running the Application

### Complete Startup Sequence

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd ..
python3 -m http.server 8000
```

### Verification Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 8000
- [ ] Backend health check passes
- [ ] GitHub token configured
- [ ] Can access frontend in browser

---

## ✨ Features Overview

### Core Features

1. **Cost Calculator**
   - 46 worker flavors (bx2 and bx3d series)
   - Multi-zone support (1, 2, or 3 zones)
   - Real-time cost calculations
   - Zone-aware PFVT Cost Score (GREEN/AMBER/RED)

2. **MAS Configurations**
   - Core + Manage
   - Core + Manage + Assist
   - Core + Manage + Monitor + Predict + IoT
   - Core + IoT
   - Core + Manage + MVI
   - Core + Industry Solutions

3. **Smart Features**
   - Risk assessment engine
   - Flavor recommendations
   - Scenario management
   - Cost comparison
   - Export functionality

### Bob-a-thon Features

4. **One-Click GitHub Deployment** 🚀
   - Automatic branch creation
   - File commit and push
   - Pull request creation
   - Pipeline trigger

5. **AI Recommendations** 🤖
   - Cost optimization suggestions
   - Flavor alternatives
   - Zone recommendations

6. **Real-time Monitoring** 📊
   - Pipeline status tracking
   - Deployment history
   - Cost trends

---

## 🎯 Usage Workflow

### Standard Workflow (Manual)

1. **Select Configuration**
   - Choose MAS baseline (e.g., "Core + Manage")
   - View baseline requirements

2. **Choose Worker Flavor**
   - Select from 46 flavors
   - See specifications and pricing

3. **Select Zones**
   - Choose 1, 2, or 3 zones
   - View cost multiplier

4. **Calculate Costs**
   - Click "Calculate Costs"
   - View PFVT Cost Score
   - Review risks and recommendations

5. **Trigger PFVT**
   - Click "🚀 Trigger PFVT"
   - Download cluster.env and mas.env
   - Copy Git commands
   - Execute in terminal

### Bob-a-thon Workflow (Automated)

1. **Select & Calculate** (same as above)

2. **One-Click Deploy**
   - Click "🚀 Trigger PFVT"
   - Enter branch name
   - Click "Deploy Now"
   - ✨ Automatic deployment!

3. **Monitor**
   - View created PR
   - Monitor pipeline
   - Check test results

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem: Page won't load**
```bash
# Check if server is running
lsof -ti:8000

# Restart server
python3 -m http.server 8000
```

**Problem: Button not working**
```
# Clear browser cache
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Backend Issues

**Problem: API not responding**
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check logs
cd backend
npm start

# Verify port is free
lsof -ti:3001
```

**Problem: GitHub authentication fails**
```bash
# Verify token in .env
cat backend/.env | grep GITHUB_TOKEN

# Test token
curl -H "Authorization: token YOUR_TOKEN" \
  https://github.ibm.com/api/v3/user
```

**Problem: CORS errors**
```
# Add frontend URL to backend/.env
ALLOWED_ORIGINS=http://localhost:8000

# Restart backend
npm start
```

### GitHub Issues

**Problem: Can't access repository**
```bash
# Test SSH access
ssh -T git@github.ibm.com

# Test HTTPS access
git ls-remote https://github.ibm.com/maximoappsuite/fvt-personal.git
```

**Problem: Token expired**
```
1. Go to https://github.ibm.com/settings/tokens
2. Generate new token
3. Update backend/.env
4. Restart backend
```

---

## 📊 Bob-a-thon Demo Script

### Opening (30 seconds)
> "PFVT testing is time-consuming and error-prone. Our tool transforms a 10-minute manual process into a 30-second one-click experience, while preventing costly misconfigurations through intelligent cost scoring."

### Demo Flow (2 minutes)

1. **Show Problem** (15s)
   - Manual PFVT setup is tedious
   - Easy to make mistakes
   - No cost visibility

2. **Show Solution** (60s)
   - Select "Core + Manage"
   - Choose "bx3d.16x64" flavor
   - Select 2 zones
   - Click "Calculate" → GREEN score
   - Click "🚀 Trigger PFVT"
   - Click "Deploy Now"
   - Show automatic PR creation

3. **Show Innovation** (30s)
   - 46 worker flavor combinations
   - Zone-aware cost scoring
   - AI recommendations
   - Real-time pipeline monitoring

4. **Show Impact** (15s)
   - Time saved: 9.5 minutes per deployment
   - Cost visibility across 828 combinations
   - Risk prevention through smart assessment

### Closing (30 seconds)
> "With automated GitHub integration, intelligent cost scoring, and real-time monitoring, we're not just saving time - we're revolutionizing how teams approach cost-conscious PFVT testing."

---

## 🏆 Key Metrics

- **Time Savings**: 9.5 minutes per deployment
- **Configurations**: 6 MAS baselines × 46 flavors × 3 zones = 828 combinations
- **Cost Visibility**: Real-time scoring with zone-aware thresholds
- **Automation**: One-click deployment with PR creation
- **Accuracy**: Intelligent risk assessment and recommendations

---

## 📚 Additional Resources

- **Frontend Documentation**: `README.md`
- **Backend Documentation**: `backend/README.md`
- **PFVT Integration Guide**: `PFVT_INTEGRATION.md`
- **Architecture**: `ARCHITECTURE.md`
- **Implementation Plan**: `IMPLEMENTATION_PLAN.md`

---

## 🤝 Support

For issues or questions:
- Check troubleshooting section above
- Review documentation files
- Contact IBM MAS team

---

## 🎉 You're Ready!

Your IBM MAS PFVT Cost & Sizing Advisor is now fully configured with:
- ✅ Frontend running on port 8000
- ✅ Backend API on port 3001
- ✅ GitHub integration configured
- ✅ One-click deployment ready
- ✅ Bob-a-thon demo prepared

**Good luck with Bob-a-thon! 🏆**