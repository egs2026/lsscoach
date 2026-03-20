import { Router } from 'express';
import { callOpenRouter } from '../lib/openrouter.js';
import { buildCoachSystemPrompt } from '../lib/prompts.js';

const router = Router();

router.post('/ai-coach', async (req, res, next) => {
  try {
    const { charter, phase, question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const systemPrompt = buildCoachSystemPrompt(charter, phase);

    const content = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      { temperature: 0.3, max_tokens: 2000 }
    );

    res.json({
      response: content,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

export default router;
