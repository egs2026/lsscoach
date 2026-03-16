import { Router } from 'express';

const router = Router();

const REQUIRED_FIELDS = [
  'title', 'background_problem', 'smart_goal',
  'business_case', 'scope_in', 'scope_out',
  'timeline_milestones', 'team_stakeholders',
  'success_kpis', 'financial_esg_impact'
];

router.post('/charter-validate', (req, res) => {
  const { charter } = req.body;

  if (!charter) {
    return res.status(400).json({
      valid: false,
      missing_fields: REQUIRED_FIELDS,
      message: 'No charter provided'
    });
  }

  const missingFields = REQUIRED_FIELDS.filter(
    field => !charter[field] || charter[field].trim() === ''
  );

  res.json({
    valid: missingFields.length === 0,
    missing_fields: missingFields,
    message: missingFields.length === 0
      ? 'Charter validated successfully'
      : `Missing fields: ${missingFields.join(', ')}`
  });
});

export default router;
