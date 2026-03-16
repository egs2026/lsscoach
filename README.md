# Lean Six Sigma Master Coach

AI-powered DMAIC coaching platform for banking sector process improvement projects.

Built by **Ebani Genius Solutions** for all EGS clients.

## Features

- **Complete Project Charter Builder** - 10-field validation
- **Visual DMAIC Phase Tracker** - Progress through all phases
- **AI Master Black Belt Coach** - Expert guidance via OpenRouter
- **Automated Artifact Generation** - CTQ, SIPOC, FMEA, and more
- **Phase Gating System** - Prevents skipping incomplete phases
- **EGS Professional Branding** - Teal/Gold color scheme

## Tech Stack

- **Frontend:** React 18 + Tailwind CSS
- **Backend:** Express.js (Node 18+)
- **AI:** OpenRouter (Claude 3.5 Sonnet)
- **Icons:** Lucide React
- **Build Tool:** Vite

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

```bash
cp .env.example .env
```

Edit `.env` and add your OpenRouter API key:

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key
```

Get a key at https://openrouter.ai (add ~$10 credits).

### 3. Start Development

```bash
npm run dev:all
```

This starts both the Vite frontend (port 3000) and Express backend (port 3001).

Open http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

The Express server serves both the API and the built frontend.

## File Structure

```
lss-master-coach/
├── server/
│   ├── index.js              # Express server entry point
│   ├── lib/
│   │   ├── openrouter.js     # OpenRouter API client
│   │   └── prompts.js        # AI system prompts
│   └── routes/
│       ├── charter.js        # Charter validation
│       ├── coach.js          # AI coach
│       ├── artifact.js       # Artifact generation
│       └── phaseGate.js      # Phase gate logic
├── src/
│   ├── LSSMasterCoach.jsx    # Main React component
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind CSS
├── .env.example              # Environment template
├── package.json              # Dependencies
├── vite.config.js            # Vite + proxy configuration
└── tailwind.config.js        # Tailwind configuration
```

## Usage

### 1. Create Project Charter

Fill out all 10 required fields:
- Project Title
- Background & Problem Statement
- SMART Goal
- Business Case
- Scope In/Out
- Timeline & Milestones
- Team & Stakeholders
- Success KPIs
- Financial & ESG Impact

Click "Validate Charter" to proceed.

### 2. Progress Through DMAIC

**Define Phase:** CTQ tree, SIPOC diagram
**Measure Phase:** Baseline Data Collection Plan
**Analyze Phase:** Fishbone diagram, Root Cause Analysis
**Improve Phase:** FMEA, Pilot Plan
**Control Phase:** Control Plan

### 3. Use AI Coach

Ask questions like:
- "What is a CTQ tree?"
- "How do I calculate process sigma?"
- "What's the next step in Measure phase?"

### 4. Generate Artifacts

Click "Generate" for each artifact type. The AI analyzes your charter, creates structured output, and asks clarifying questions if needed.

## DMAIC Phase Requirements

| Phase | Required Artifacts |
|-------|-------------------|
| Charter | All 10 fields completed |
| Define | CTQ, SIPOC |
| Measure | BASELINE_PLAN |
| Analyze | FISHBONE, ROOT_CAUSE |
| Improve | FMEA, PILOT_PLAN |
| Control | CONTROL_PLAN |

## Configuration

### Change AI Model

Edit `server/lib/openrouter.js` to change the default model:

```javascript
model: options.model || 'anthropic/claude-3.5-sonnet'
```

Available models:
- `anthropic/claude-3.5-sonnet` (best quality)
- `anthropic/claude-3-haiku` (faster, cheaper)
- `openai/gpt-4o` (alternative)

### Customize Branding

Colors are defined in `tailwind.config.js` and inline styles:
- Primary Teal: `#2C5F5D`
- Accent Gold: `#F39C12`

## Cost Estimate

- **OpenRouter:** $5-20/month
- **Hosting:** $0-10/month
- **Total: $5-30/month**

## Troubleshooting

### OpenRouter 401 Error
- Check API key is correct in `.env`
- Verify you have credits at https://openrouter.ai

### Server connection errors
- Ensure both dev servers are running (`npm run dev:all`)
- Check the Express server is on port 3001

## Support

- **Email:** support@ebanigeniussolutions.com
- **OpenRouter Docs:** https://openrouter.ai/docs

## License

Proprietary - Ebani Genius Solutions

All rights reserved. This software is licensed for use by EGS clients only.

## Credits

**Developed by:** Ebani Genius Solutions
**AI Model:** Claude 3.5 Sonnet via OpenRouter
**Framework:** React + Vite + Express
