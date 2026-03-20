import { Router } from 'express';

const router = Router();

const REQUIRED_ARTIFACTS = {
  charter: [],
  define: ['CTQ', 'SIPOC'],
  measure: ['BASELINE_PLAN'],
  analyze: ['FISHBONE', 'ROOT_CAUSE'],
  improve: ['FMEA', 'PILOT_PLAN'],
  control: ['CONTROL_PLAN']
};

router.post('/phase-gate', (req, res) => {
  const { current_phase, next_phase, artifacts } = req.body;
  const required = REQUIRED_ARTIFACTS[current_phase] || [];

  const missingArtifacts = required.filter(type => !artifacts || !artifacts[type]);

  if (missingArtifacts.length > 0) {
    return res.json({
      allowed: false,
      reason: `Missing required artifacts: ${missingArtifacts.join(', ')}`,
      missing_artifacts: missingArtifacts
    });
  }

  const incompleteArtifacts = required.filter(type => {
    const artifact = artifacts[type];
    return artifact.questions && artifact.questions.length > 0;
  });

  if (incompleteArtifacts.length > 0) {
    return res.json({
      allowed: false,
      reason: `Incomplete artifacts with unanswered questions: ${incompleteArtifacts.join(', ')}`,
      missing_artifacts: []
    });
  }

  res.json({
    allowed: true,
    reason: 'All phase requirements met',
    missing_artifacts: []
  });
});

export default router;
