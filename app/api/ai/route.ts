import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Charter field definitions
const CHARTER_FIELDS = [
  'problem_statement',
  'goal_statement',
  'scope',
  'team_members',
  'timeline',
  'business_case'
];

// DMAIC phase checklist items
const PHASE_CHECKLISTS = {
  define: [
    'Project charter completed',
    'Problem statement validated',
    'SIPOC diagram created',
    'Stakeholders identified',
    'Voice of Customer (VOC) collected'
  ],
  measure: [
    'Process map created',
    'Key metrics identified',
    'Data collection plan established',
    'Baseline performance measured',
    'Measurement system validated'
  ],
  analyze: [
    'Root cause analysis completed',
    'Fishbone diagram created',
    'Data analyzed for patterns',
    'Hypothesis tested',
    'Key drivers identified'
  ],
  improve: [
    'Solution alternatives generated',
    'Pilot test conducted',
    'Cost-benefit analysis completed',
    'Implementation plan created',
    'Risks assessed'
  ],
  control: [
    'Control plan documented',
    'Control charts established',
    'Standard operating procedures updated',
    'Training completed',
    'Handoff to process owner'
  ]
};

// Badge definitions
const BADGES = {
  charter_master: { name: 'Charter Master', criteria: 'Complete and approve project charter' },
  define_expert: { name: 'Define Expert', criteria: 'Complete Define phase' },
  measure_guru: { name: 'Measure Guru', criteria: 'Complete Measure phase' },
  analyze_wizard: { name: 'Analyze Wizard', criteria: 'Complete Analyze phase' },
  improve_champion: { name: 'Improve Champion', criteria: 'Complete Improve phase' },
  control_master: { name: 'Control Master', criteria: 'Complete Control phase' },
  dmaic_black_belt: { name: 'DMAIC Black Belt', criteria: 'Complete all DMAIC phases' },
  team_player: { name: 'Team Player', criteria: 'Collaborate on 3+ projects' }
};

// Calculate charter readiness score
function calculateCharterReadiness(charter: any): number {
  let score = 0;
  const maxScore = 100;
  const fieldWeight = maxScore / CHARTER_FIELDS.length;

  for (const field of CHARTER_FIELDS) {
    const value = charter.fields?.[field];
    if (value && typeof value === 'string') {
      const length = value.trim().length;
      if (length > 0) {
        // Completeness: 50% of field weight
        score += fieldWeight * 0.5;
        
        // Clarity: 50% of field weight (based on length and structure)
        if (length >= 50) score += fieldWeight * 0.25;
        if (length >= 100) score += fieldWeight * 0.25;
      }
    }
  }

  return Math.round(score);
}

// Get missing charter fields
function getMissingCharterFields(charter: any): string[] {
  const missing: string[] = [];
  for (const field of CHARTER_FIELDS) {
    const value = charter.fields?.[field];
    if (!value || (typeof value === 'string' && value.trim().length < 20)) {
      missing.push(field);
    }
  }
  return missing;
}

// Check phase prerequisites
function canAccessPhase(phase: string, phaseStatuses: any[]): boolean {
  const phaseOrder = ['define', 'measure', 'analyze', 'improve', 'control'];
  const currentIndex = phaseOrder.indexOf(phase);
  
  if (currentIndex === 0) return true; // Define is always accessible
  
  // Check if previous phase is completed
  const previousPhase = phaseOrder[currentIndex - 1];
  const previousStatus = phaseStatuses.find(p => p.phase === previousPhase);
  
  return previousStatus?.status === 'done';
}

// Award badge
async function awardBadge(userId: string, badgeType: string): Promise<boolean> {
  try {
    const { data: existing } = await supabase
      .from('badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .single();

    if (existing) return false; // Already awarded

    await supabase.from('badges').insert({
      user_id: userId,
      badge_type: badgeType,
      badge_name: BADGES[badgeType as keyof typeof BADGES].name
    });

    return true;
  } catch (error) {
    console.error('Badge award error:', error);
    return false;
  }
}

// Generate AI response
async function generateAIResponse(systemPrompt: string, userPrompt: string, language: string): Promise<string> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}\n\nIMPORTANT: Respond in ${language === 'id' ? 'Bahasa Indonesia' : 'English'}. Be concise and actionable.`
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 500
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API Error:', error);
    return language === 'id' 
      ? 'Maaf, terjadi kesalahan. Silakan coba lagi.'
      : 'Sorry, an error occurred. Please try again.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId, projectId } = await request.json();

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'Missing userId or projectId' }, { status: 400 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // RULE 1: Check language preference
    if (!profile?.role || !profile.full_name.includes('|lang:')) {
      const message = 'Welcome! Please choose your preferred language:\n\n1. Bahasa Indonesia\n2. English\n\nType "1" or "2" to continue.';
      
      return NextResponse.json({
        assistant_message: message,
        route: 'language',
        missing_fields: ['language'],
        checklist_status: {},
        badge_awarded: null,
        suggested_actions: ['Choose language preference']
      });
    }

    // Extract language from profile
    const language = profile.full_name.includes('|lang:id') ? 'id' : 'en';

    // Get project and charter
    const { data: project } = await supabase
      .from('projects')
      .select('*, charter(*), dmaic_phase_status(*)')
      .eq('id', projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const charter = project.charter?.[0];
    const phaseStatuses = project.dmaic_phase_status || [];

    // RULE 2: Check charter status
    if (!charter || !charter.approved) {
      const missingFields = getMissingCharterFields(charter);
      const readinessScore = charter ? calculateCharterReadiness(charter) : 0;

      let aiPrompt = '';
      let suggestedActions: string[] = [];

      if (missingFields.length > 0) {
        // Request missing fields (max 3 questions)
        const fieldsToAsk = missingFields.slice(0, 3);
        aiPrompt = `The project charter is incomplete. Missing fields: ${fieldsToAsk.join(', ')}. Ask the user to provide these details. Be specific and helpful.`;
        suggestedActions = fieldsToAsk.map(f => `Complete ${f.replace(/_/g, ' ')}`);
      } else if (readinessScore < 80) {
        aiPrompt = `The charter is complete but needs more detail. Current readiness: ${readinessScore}%. Ask the user to expand on the weakest sections to reach 80% readiness.`;
        suggestedActions = ['Expand charter details', 'Add more clarity to statements'];
      } else {
        // Ready for approval
        aiPrompt = `The charter is ready for approval (${readinessScore}% complete). Ask the user if they want to approve and proceed to the Define phase.`;
        suggestedActions = ['Approve charter and start Define phase'];
      }

      const aiMessage = await generateAIResponse(
        'You are a Lean Six Sigma expert helping users complete their project charter.',
        `${aiPrompt}\n\nUser question: ${prompt}`,
        language
      );

      return NextResponse.json({
        assistant_message: aiMessage,
        route: 'charter',
        missing_fields: missingFields,
        checklist_status: { readiness_score: readinessScore },
        badge_awarded: null,
        suggested_actions: suggestedActions
      });
    }

    // Award charter badge if not already awarded
    const charterBadgeAwarded = await awardBadge(userId, 'charter_master');

    // RULE 3 & 4: DMAIC phase routing
    const currentPhase = project.current_phase || 'define';
    const phaseStatus = phaseStatuses.find(p => p.phase === currentPhase);

    // Check if user is trying to access a locked phase
    if (!canAccessPhase(currentPhase, phaseStatuses)) {
      const message = language === 'id'
        ? `Fase ${currentPhase} masih terkunci. Selesaikan fase sebelumnya terlebih dahulu.`
        : `The ${currentPhase} phase is locked. Complete the previous phase first.`;

      return NextResponse.json({
        assistant_message: message,
        route: currentPhase,
        missing_fields: [],
        checklist_status: {},
        badge_awarded: null,
        suggested_actions: ['Complete previous phase']
      });
    }

    // Get checklist for current phase
    const checklist = PHASE_CHECKLISTS[currentPhase as keyof typeof PHASE_CHECKLISTS] || [];
    const checklistStatus: Record<string, boolean> = {};
    checklist.forEach(item => {
      checklistStatus[item] = false; // Default to incomplete
    });

    // Generate phase-specific AI response
    const phasePrompts = {
      define: 'Guide