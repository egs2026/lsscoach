# Deployment Checklist

## Pre-Deployment

- [ ] Install Node.js (v18 or higher)
- [ ] Create OpenRouter account at https://openrouter.ai
- [ ] Add credits to OpenRouter (~$10)
- [ ] Copy OpenRouter API key

## Local Setup

- [ ] Run: `npm install`
- [ ] Run: `cp .env.example .env`
- [ ] Paste OpenRouter API key into `.env`
- [ ] Run: `npm run dev:all`
- [ ] Open http://localhost:3000

## Testing

- [ ] Test charter validation
  - [ ] Fill all 10 fields
  - [ ] Click "Validate Charter"
  - [ ] Should show green "Validated" badge

- [ ] Test AI Coach
  - [ ] Click "AI Master Coach"
  - [ ] Ask: "What is a CTQ tree?"
  - [ ] Should get expert response

- [ ] Test Artifact Generation
  - [ ] Advance to Define phase
  - [ ] Click "Generate Artifacts"
  - [ ] Generate CTQ artifact
  - [ ] Should create structured output

- [ ] Test Phase Gating
  - [ ] Generate both CTQ and SIPOC
  - [ ] Click "Next Phase"
  - [ ] Should advance to Measure

## Production Deployment

- [ ] Run: `npm run build`
- [ ] Set `NODE_ENV=production`
- [ ] Set `OPENROUTER_API_KEY` env var on host
- [ ] Run: `npm start`
- [ ] Verify app is accessible

### Hosting Options

**Option A: Railway/Render**
- [ ] Push to GitHub
- [ ] Connect repo to Railway or Render
- [ ] Set environment variables
- [ ] Deploy

**Option B: Your Server**
- [ ] Upload project files
- [ ] Run `npm install && npm run build`
- [ ] Start with `NODE_ENV=production npm start`
- [ ] Configure nginx reverse proxy for HTTPS

## Post-Deployment

- [ ] Test production app end-to-end
- [ ] Share URL with EGS clients
- [ ] Monitor OpenRouter usage/costs

## Success Criteria

- Users can validate charters
- AI Coach responds to questions
- Artifacts generate correctly
- Phase gating prevents skipping
- App is accessible to clients

## Need Help?

- Email: support@ebanigeniussolutions.com
- OpenRouter Docs: https://openrouter.ai/docs
