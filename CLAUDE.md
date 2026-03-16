# CLAUDE.md — LSS Master Coach

## Project Overview
**Lean Six Sigma (LSS) Master Black Belt AI Coaching Platform** by Ebani Genius Solutions (EGS).
Full-stack web app guiding users through DMAIC methodology with AI coaching and automated artifact generation.
Target domain: Banking sector process improvement.

---

## Tech Stack
- **Frontend:** React 18, Vite (port 3000), Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js 18+, Express 5 (port 3001)
- **AI:** OpenRouter API → `anthropic/claude-3.5-sonnet` (via `server/lib/openrouter.js`)
- **Build:** ES Modules throughout (`"type": "module"`)

---

## Key Commands
```bash
npm run dev:all      # Run both frontend and backend (preferred for development)
npm run dev          # Frontend only (Vite, port 3000)
npm run dev:server   # Backend only (Express, port 3001, watch mode)
npm run build        # Production build → dist/
NODE_ENV=production npm start  # Serve production build
```

Health check: `curl http://localhost:3001/api/health`

---

## Environment
Single required variable:
```
OPENROUTER_API_KEY=sk-or-v1-...
```
Copy `.env.example` → `.env` and add the key.

---

## Project Structure
```
src/
  main.jsx              # Entry point
  LSSMasterCoach.jsx    # Main app component (state, phase tracking, chat)
  LoginPage.jsx         # Login/auth UI
  index.css             # Tailwind imports

server/
  index.js              # Express entry point (port 3001)
  routes/
    charter.js          # POST /api/charter-validate
    coach.js            # POST /api/ai-coach
    artifact.js         # POST /api/artifact-generate
    phaseGate.js        # POST /api/phase-gate
  lib/
    openrouter.js       # callOpenRouter(messages, options) helper
    prompts.js          # buildCoachSystemPrompt, buildArtifactSystemPrompt

skills/                 # Claude Code skill definitions (25 SKILL.md files)
```

---

## API Routes
| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /api/charter-validate` | `{ charter }` | `{ valid, missing_fields, message }` |
| `POST /api/ai-coach` | `{ charter, phase, question }` | AI response + timestamp |
| `POST /api/artifact-generate` | `{ charter, phase, artifact_type }` | Parsed JSON artifact |
| `POST /api/phase-gate` | `{ phase, artifacts }` | `{ allowed, reason, missing_artifacts }` |

---

## DMAIC Phases & Phase Gating
Users must generate required artifacts before advancing phases:

| Phase | Required Artifacts |
|-------|-------------------|
| charter | (none — entry point) |
| define | CTQ, SIPOC |
| measure | BASELINE_PLAN |
| analyze | FISHBONE, ROOT_CAUSE |
| improve | FMEA, PILOT_PLAN |
| control | CONTROL_PLAN |

---

## Charter Fields (all 10 required)
`title`, `background_problem`, `smart_goal`, `business_case`, `scope_in`, `scope_out`, `timeline_milestones`, `team_stakeholders`, `success_kpis`, `financial_esg_impact`

---

## Artifact JSON Structure
```json
{
  "artifact_type": "CTQ|SIPOC|BASELINE_PLAN|...",
  "phase": "define|measure|analyze|improve|control",
  "data": { },
  "assumptions": [],
  "questions": []
}
```
- `questions`: max 3 clarifying questions for missing data
- Unknown data → marked as `"unknown"` (never fabricated)

---

## AI Integration
- All AI calls go through OpenRouter (not direct Anthropic API)
- Default model: `anthropic/claude-3.5-sonnet`
- Coach endpoint: `temperature: 0.3`, `max_tokens: 2000`
- Artifact endpoint: `temperature: 0.2`, `max_tokens: 3000`, `response_format: { type: "json_object" }`
- Markdown code fence cleanup is handled in `server/routes/artifact.js`

---

## EGS Brand Colors (Tailwind)
```
egs-teal:      #2C5F5D
egs-teal-dark: #1B4948
egs-gold:      #F39C12
egs-gold-warm: #E67E22
```
Use these custom Tailwind classes for all UI work. See `tailwind.config.js`.

---

## Dev Proxy
Vite proxies `/api/*` → `http://localhost:3001` during development.
No manual CORS management needed in dev. In production, Express serves the React `dist/` build directly.

---

## Skills Directory
`skills/` contains 25 SKILL.md files with project conventions covering:
AI, frontend standards, accessibility, testing, deployment, Supabase, security, UI/UX, git, RBAC, localization, Telegram, commissions, leads, file uploads, translations, mobile, n8n workflows, and application security.

Consult relevant skill files before working in those areas.

---

## Key Conventions
- ES Modules everywhere — use `import`/`export`, not `require`/`module.exports`
- Node 18+ required
- Charter validation runs on both frontend (UX) and backend (enforcement)
- Artifacts with unanswered questions block phase gate progression
- `skills/` files are authoritative for domain-specific conventions
