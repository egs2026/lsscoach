# Lean Six Sigma Master Coach - Setup Guide

## Architecture

```
User Browser (React App on port 3000)
    ↓ /api/* (proxied via Vite in dev)
Express Server (port 3001)
    ↓
OpenRouter API (AI Processing)
```

## Setup (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

Requires Node.js 18 or higher.

### Step 2: Configure API Key

```bash
cp .env.example .env
```

Edit `.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key
```

Get your key:
1. Go to https://openrouter.ai
2. Sign up for an account
3. Add $10 credits (should last months)
4. Copy your API key from the dashboard

**Cost estimate:**
- AI Coach calls: ~$0.01 per message
- Artifact generation: ~$0.02 per artifact
- Monthly usage (50 projects): ~$5-10

### Step 3: Start Development

```bash
npm run dev:all
```

This runs both servers concurrently:
- **Vite** (frontend): http://localhost:3000
- **Express** (API): http://localhost:3001

The Vite dev server proxies `/api/*` requests to Express, so no CORS issues.

You can also run them separately in two terminals:
```bash
npm run dev          # Terminal 1: Vite frontend
npm run dev:server   # Terminal 2: Express backend
```

## Testing Your Setup

### Test API Health

```bash
curl http://localhost:3001/api/health
```
Expected: `{"status":"ok"}`

### Test Charter Validation

```bash
curl -X POST http://localhost:3001/api/charter-validate ^
  -H "Content-Type: application/json" ^
  -d "{\"charter\":{\"title\":\"Test\",\"background_problem\":\"Test\",\"smart_goal\":\"Test\",\"business_case\":\"Test\",\"scope_in\":\"Test\",\"scope_out\":\"Test\",\"timeline_milestones\":\"Test\",\"team_stakeholders\":\"Test\",\"success_kpis\":\"Test\",\"financial_esg_impact\":\"Test\"}}"
```
Expected: `{"valid":true,"missing_fields":[],"message":"Charter validated successfully"}`

### Test in Browser

1. Open http://localhost:3000
2. Fill all 10 charter fields
3. Click "Validate Charter" - should show green badge
4. Try the AI Coach - ask "What is a CTQ tree?"
5. Generate a CTQ artifact in the Define phase

## Production Deployment

### Build

```bash
npm run build
```

### Run in Production

```bash
NODE_ENV=production npm start
```

The Express server serves both the API and the built React app from `dist/`.

### Deploy to Railway/Render

1. Push your repo to GitHub
2. Connect to Railway or Render
3. Set environment variable: `OPENROUTER_API_KEY`
4. Set build command: `npm run build`
5. Set start command: `npm start`

### Deploy to Your Server

```bash
npm run build
NODE_ENV=production node server/index.js
```

Configure a reverse proxy (nginx) for HTTPS.

## Customization

### Change AI Model

Edit `server/lib/openrouter.js`:
```javascript
model: options.model || 'anthropic/claude-3.5-sonnet'
```

### Add More Artifact Types

1. Add the type to `getArtifactTypesForPhase()` in `src/LSSMasterCoach.jsx`
2. The AI will auto-generate based on the system prompt

### Custom Branding

Update colors in `tailwind.config.js` and inline styles:
- Primary Teal: `#2C5F5D`
- Accent Gold: `#F39C12`

## Troubleshooting

### OpenRouter returns 401
- Verify API key is correct in `.env`
- Check you have credits
- Ensure `OPENROUTER_API_KEY` starts with `sk-or-`

### Artifacts generate empty data
- Check charter has all fields filled
- Check server console for error details
- Try adjusting temperature in route files (0.2-0.5)

### Server won't start
- Check Node.js version: `node --version` (need 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Next Steps

1. Add user authentication
2. Add project persistence (database)
3. Create admin dashboard
4. Add export to PDF/DOCX
5. Build email notifications
6. Add collaborative features

## Support

- Email: support@ebanigeniussolutions.com
- OpenRouter Docs: https://openrouter.ai/docs

## License

Proprietary - Ebani Genius Solutions
