# PFVT Backend API

Backend service for IBM MAS PFVT Cost & Sizing Advisor providing GitHub integration and Tekton pipeline monitoring.

## Features

- 🚀 **Automated GitHub Deployment** - One-click commit and push to fvt-personal repo
- 📊 **Pipeline Monitoring** - Real-time Tekton pipeline status
- 🤖 **AI Recommendations** - Cost optimization suggestions
- 📈 **Deployment History** - Track past deployments and costs

## Prerequisites

- Node.js >= 16.0.0
- GitHub Enterprise Personal Access Token
- Access to maximoappsuite/fvt-personal repository

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
```env
GITHUB_TOKEN=your_github_enterprise_token_here
PORT=3001
TEKTON_PIPELINE_URL=https://cloud.ibm.com/devops/pipelines/tekton/...
```

### Getting GitHub Token

1. Go to https://github.ibm.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `workflow`
4. Copy token to `.env` file

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

Returns server status and version.

### Deploy Configuration
```
POST /api/deploy
Content-Type: application/json

{
  "clusterEnv": "...",
  "masEnv": "...",
  "branchName": "feature/pfvt-config",
  "commitMessage": "Update PFVT configuration",
  "configuration": {
    "name": "Core + Manage",
    "workers": 3,
    "flavor": "bx3d.16x64",
    "zones": 2,
    "costScore": "GREEN",
    "monthlyCost": 2584.20,
    "components": ["core", "manage"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration deployed successfully",
  "branch": "feature/pfvt-config",
  "repoUrl": "https://github.ibm.com/maximoappsuite/fvt-personal/tree/feature/pfvt-config",
  "prUrl": "https://github.ibm.com/maximoappsuite/fvt-personal/pull/123",
  "pipelineUrl": "https://cloud.ibm.com/devops/pipelines/tekton/..."
}
```

### Get Pipeline Status
```
GET /api/pipeline/status/:runId
```

Returns current pipeline execution status.

### Get AI Recommendations
```
POST /api/recommendations
Content-Type: application/json

{
  "configuration": {...},
  "flavor": {...},
  "zones": 2
}
```

Returns cost optimization recommendations.

### Get Deployment History
```
GET /api/history
```

Returns list of past deployments with costs and status.

## Architecture

```
Frontend (Port 8000)
    ↓ HTTP/REST
Backend API (Port 3001)
    ↓
├─ GitHub API (Octokit)
│   └─ Create branch
│   └─ Commit files
│   └─ Create PR
│
├─ Tekton API
│   └─ Monitor pipeline
│   └─ Get status
│
└─ AI Service
    └─ Generate recommendations
```

## Error Handling

All endpoints return standard error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional context"
}
```

## Security

- GitHub token stored in environment variables
- CORS enabled for specified origins only
- Input validation on all endpoints
- Rate limiting (recommended for production)

## Development

### Adding New Endpoints

1. Add route in `server.js`
2. Implement handler function
3. Add error handling
4. Update this README

### Testing

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test deploy endpoint
curl -X POST http://localhost:3001/api/deploy \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

## Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### IBM Cloud

```bash
ibmcloud cf push pfvt-backend -m 256M
```

## Troubleshooting

### GitHub Authentication Fails
- Verify token has correct scopes
- Check token hasn't expired
- Ensure access to fvt-personal repo

### CORS Errors
- Add frontend URL to ALLOWED_ORIGINS in .env
- Restart server after .env changes

### Pipeline Status Not Updating
- Verify Tekton API credentials
- Check pipeline URL is correct

## Support

For issues or questions:
- Create issue in repository
- Contact IBM MAS team
- Check logs: `npm start > server.log 2>&1`

## License

ISC