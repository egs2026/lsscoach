import { Router } from 'express';
import { callOpenRouter } from '../lib/openrouter.js';
import { buildArtifactSystemPrompt } from '../lib/prompts.js';

const router = Router();

router.post('/artifact-generate', async (req, res, next) => {
  try {
    const { charter, phase, artifact_type } = req.body;

    if (!artifact_type) {
      return res.status(400).json({ error: 'artifact_type is required' });
    }

    const systemPrompt = buildArtifactSystemPrompt(charter, phase, artifact_type);

    const content = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${artifact_type} artifact for ${phase} phase.` }
      ],
      {
        temperature: 0.2,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      }
    );

    // Clean markdown code fences if present
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const artifact = JSON.parse(cleaned);

    res.json(artifact);
  } catch (err) {
    next(err);
  }
});

export default router;
