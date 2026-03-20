import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertCircle, Send, FileText, ChevronRight, Plus, Trash2 } from 'lucide-react';
import LoginPage from './LoginPage';

const LSSMasterCoach = () => {
  // API Endpoints
  const API_BASE = '/api';
  const API_ENDPOINTS = {
    charterValidation: `${API_BASE}/charter-validate`,
    aiCoach: `${API_BASE}/ai-coach`,
    artifactGenerator: `${API_BASE}/artifact-generate`,
    phaseGate: `${API_BASE}/phase-gate`
  };

  // State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, charter, coach, artifacts
  const [currentPhase, setCurrentPhase] = useState('charter');
  const [charter, setCharter] = useState({
    title: '',
    background_problem: '',
    smart_goal: '',
    business_case: '',
    scope_in: '',
    scope_out: '',
    timeline_milestones: '',
    team_stakeholders: '',
    success_kpis: '',
    financial_esg_impact: ''
  });
  const [charterValidated, setCharterValidated] = useState(false);
  const [artifacts, setArtifacts] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const PHASES = [
    { id: 'charter', name: 'Charter', icon: FileText },
    { id: 'define', name: 'Define', icon: Circle },
    { id: 'measure', name: 'Measure', icon: Circle },
    { id: 'analyze', name: 'Analyze', icon: Circle },
    { id: 'improve', name: 'Improve', icon: Circle },
    { id: 'control', name: 'Control', icon: Circle }
  ];

  const CHARTER_FIELDS = [
    { key: 'title', label: 'Project Title', type: 'text', placeholder: 'e.g., Reduce Loan Processing Time' },
    { key: 'background_problem', label: 'Background & Problem Statement', type: 'textarea', placeholder: 'Describe the current problem and its impact...' },
    { key: 'smart_goal', label: 'SMART Goal', type: 'textarea', placeholder: 'Specific, Measurable, Achievable, Relevant, Time-bound goal...' },
    { key: 'business_case', label: 'Business Case', type: 'textarea', placeholder: 'Why is this important to the business?' },
    { key: 'scope_in', label: 'Scope In', type: 'textarea', placeholder: 'What is included in this project?' },
    { key: 'scope_out', label: 'Scope Out', type: 'textarea', placeholder: 'What is excluded from this project?' },
    { key: 'timeline_milestones', label: 'Timeline & Milestones', type: 'textarea', placeholder: 'Key dates and milestones...' },
    { key: 'team_stakeholders', label: 'Team & Stakeholders', type: 'textarea', placeholder: 'Who is involved? Who are the key stakeholders?' },
    { key: 'success_kpis', label: 'Success KPIs', type: 'textarea', placeholder: 'How will success be measured?' },
    { key: 'financial_esg_impact', label: 'Financial & ESG Impact', type: 'textarea', placeholder: 'Expected financial and environmental/social impact...' }
  ];

  // Validate Charter
  const validateCharter = async () => {
    setIsLoading(true);
    try {
      // Check all fields are filled
      const missingFields = CHARTER_FIELDS.filter(field => !charter[field.key] || charter[field.key].trim() === '');

      if (missingFields.length > 0) {
        const fieldNames = missingFields.map(f => f.label).join(', ');
        setChatMessages([...chatMessages, {
          role: 'system',
          content: `Charter incomplete. Missing fields: ${fieldNames}`,
          timestamp: new Date().toISOString()
        }]);
        setIsLoading(false);
        return;
      }

      // Call n8n webhook for validation
      const response = await fetch(API_ENDPOINTS.charterValidation, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charter })
      });

      const result = await response.json();

      if (result.valid) {
        setCharterValidated(true);
        setChatMessages([...chatMessages, {
          role: 'system',
          content: 'Charter validated successfully. You can now proceed to Define phase.',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Charter validation error:', error);
      // Fallback: validate locally
      const allFieldsFilled = CHARTER_FIELDS.every(field => charter[field.key] && charter[field.key].trim() !== '');
      if (allFieldsFilled) {
        setCharterValidated(true);
        setChatMessages([...chatMessages, {
          role: 'system',
          content: 'Charter validated (offline mode). You can proceed to Define phase.',
          timestamp: new Date().toISOString()
        }]);
      }
    }
    setIsLoading(false);
  };

  // AI Coach Mode
  const askCoach = async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    setChatMessages([...chatMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.aiCoach, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charter,
          phase: currentPhase,
          question,
          mode: 'COACH'
        })
      });

      const result = await response.json();

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response || 'Coach response received.',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Coach error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again shortly.',
        timestamp: new Date().toISOString()
      }]);
    }
    setIsLoading(false);
  };

  // Generate Artifact
  const generateArtifact = async (artifactType) => {
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.artifactGenerator, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charter,
          phase: currentPhase,
          artifact_type: artifactType,
          mode: 'ARTIFACT'
        })
      });

      const result = await response.json();

      setArtifacts(prev => ({
        ...prev,
        [currentPhase]: {
          ...prev[currentPhase],
          [artifactType]: result
        }
      }));

      setChatMessages(prev => [...prev, {
        role: 'system',
        content: `${artifactType} artifact generated for ${currentPhase} phase.`,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Artifact generation error:', error);
      setChatMessages(prev => [...prev, {
        role: 'system',
        content: 'Could not generate artifact. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    }
    setIsLoading(false);
  };

  // Check Phase Progression
  const canProgressToNextPhase = () => {
    if (currentPhase === 'charter') return charterValidated;

    const phaseArtifacts = artifacts[currentPhase] || {};
    const hasArtifacts = Object.keys(phaseArtifacts).length > 0;

    // Check if all artifacts have empty questions array
    const allComplete = Object.values(phaseArtifacts).every(artifact =>
      artifact.questions && artifact.questions.length === 0
    );

    return hasArtifacts && allComplete;
  };

  const progressPhase = async () => {
    const currentIndex = PHASES.findIndex(p => p.id === currentPhase);
    if (currentIndex < PHASES.length - 1) {
      const nextPhase = PHASES[currentIndex + 1].id;

      // Call phase gate validation
      try {
        const response = await fetch(API_ENDPOINTS.phaseGate, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_phase: currentPhase,
            next_phase: nextPhase,
            artifacts: artifacts[currentPhase]
          })
        });

        const result = await response.json();

        if (result.allowed) {
          setCurrentPhase(nextPhase);
          setChatMessages(prev => [...prev, {
            role: 'system',
            content: `Advanced to ${nextPhase} phase.`,
            timestamp: new Date().toISOString()
          }]);
        } else {
          setChatMessages(prev => [...prev, {
            role: 'system',
            content: `Cannot advance: ${result.reason}`,
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (error) {
        // Fallback to local validation
        if (canProgressToNextPhase()) {
          setCurrentPhase(nextPhase);
        }
      }
    }
  };

  // Get artifact types for current phase
  const getArtifactTypesForPhase = (phase) => {
    const artifactMap = {
      define: ['CTQ', 'SIPOC'],
      measure: ['BASELINE_PLAN'],
      analyze: ['FISHBONE', 'ROOT_CAUSE'],
      improve: ['FMEA', 'PILOT_PLAN'],
      control: ['CONTROL_PLAN']
    };
    return artifactMap[phase] || [];
  };

  // Render Functions
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#2C5F5D' }}>
          DMAIC Progress
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = phase.id === currentPhase;
            const isComplete = PHASES.findIndex(p => p.id === currentPhase) > idx;

            return (
              <div
                key={phase.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isActive
                  ? 'border-[#F39C12] bg-[#FFF9F0]'
                  : isComplete
                    ? 'border-[#2C5F5D] bg-[#F0F7F7]'
                    : 'border-gray-200 bg-white'
                  }`}
                onClick={() => {
                  if (phase.id === 'charter' || isComplete || isActive) {
                    setCurrentPhase(phase.id);
                  }
                }}
              >
                <div className="flex flex-col items-center text-center">
                  {isComplete ? (
                    <CheckCircle className="w-8 h-8 mb-2" style={{ color: '#2C5F5D' }} />
                  ) : (
                    <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-[#F39C12]' : 'text-gray-400'}`} />
                  )}
                  <span className={`text-sm font-semibold ${isActive ? 'text-[#F39C12]' : isComplete ? 'text-[#2C5F5D]' : 'text-gray-500'}`}>
                    {phase.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('charter')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          style={{ borderLeft: '4px solid #2C5F5D' }}
        >
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2C5F5D' }}>
            Project Charter
          </h3>
          <p className="text-gray-600 text-sm">
            {charterValidated ? 'View or edit your validated charter' : 'Complete your project charter to begin'}
          </p>
        </button>

        <button
          onClick={() => setCurrentView('coach')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          style={{ borderLeft: '4px solid #F39C12' }}
        >
          <h3 className="text-lg font-bold mb-2" style={{ color: '#F39C12' }}>
            AI Master Coach
          </h3>
          <p className="text-gray-600 text-sm">
            Get expert guidance for your current phase
          </p>
        </button>

        <button
          onClick={() => setCurrentView('artifacts')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          style={{ borderLeft: '4px solid #E67E22' }}
        >
          <h3 className="text-lg font-bold mb-2" style={{ color: '#E67E22' }}>
            Generate Artifacts
          </h3>
          <p className="text-gray-600 text-sm">
            Create phase-specific DMAIC artifacts
          </p>
        </button>
      </div>

      {canProgressToNextPhase() && currentPhase !== 'control' && (
        <div className="bg-[#F0F7F7] border-2 border-[#2C5F5D] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#2C5F5D' }}>
                Ready to Progress
              </h3>
              <p className="text-gray-600">
                You've completed {currentPhase} phase requirements
              </p>
            </div>
            <button
              onClick={progressPhase}
              className="px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#F39C12' }}
            >
              Next Phase <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCharter = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#2C5F5D' }}>
          Project Charter
        </h2>
        {charterValidated && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-semibold">Validated</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {CHARTER_FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2C3E50' }}>
              {field.label}
              <span className="text-red-500 ml-1">*</span>
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={charter[field.key]}
                onChange={(e) => setCharter({ ...charter, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5F5D] min-h-24"
                disabled={charterValidated}
              />
            ) : (
              <input
                type={field.type}
                value={charter[field.key]}
                onChange={(e) => setCharter({ ...charter, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5F5D]"
                disabled={charterValidated}
              />
            )}
          </div>
        ))}
      </div>

      {!charterValidated && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={validateCharter}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#2C5F5D' }}
          >
            {isLoading ? 'Validating...' : 'Validate Charter'}
          </button>
        </div>
      )}
    </div>
  );

  const renderCoach = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#2C5F5D' }}>
        AI Master Black Belt Coach
      </h2>

      <div className="mb-4 p-4 bg-[#FFF9F0] border border-[#F39C12] rounded-lg">
        <p className="text-sm" style={{ color: '#2C3E50' }}>
          <strong>Current Phase:</strong> {currentPhase.toUpperCase()}
        </p>
        <p className="text-sm mt-1 text-gray-600">
          Ask specific questions about your project, DMAIC methodology, or request artifact guidance.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {chatMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Start a conversation with your Master Black Belt coach</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${msg.role === 'user'
                  ? 'bg-[#2C5F5D] text-white ml-12'
                  : msg.role === 'assistant'
                    ? 'bg-white border border-gray-200 mr-12'
                    : 'bg-[#FFF9F0] border border-[#F39C12]'
                  }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-2 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && askCoach(userInput)}
          placeholder="Ask your question..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5F5D]"
          disabled={isLoading}
        />
        <button
          onClick={() => askCoach(userInput)}
          disabled={isLoading || !userInput.trim()}
          className="px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#F39C12' }}
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>
    </div>
  );

  const renderArtifacts = () => {
    const availableArtifacts = getArtifactTypesForPhase(currentPhase);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#2C5F5D' }}>
          {currentPhase.toUpperCase()} Phase Artifacts
        </h2>

        {currentPhase === 'charter' ? (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Complete and validate your Project Charter first before generating artifacts.
            </p>
          </div>
        ) : !charterValidated ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              You must validate your Project Charter before generating phase artifacts.
            </p>
          </div>
        ) : availableArtifacts.length === 0 ? (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">
              No artifacts required for this phase.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableArtifacts.map(artifactType => {
              const hasArtifact = artifacts[currentPhase]?.[artifactType];

              return (
                <div
                  key={artifactType}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#2C5F5D] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#2C3E50' }}>
                        {artifactType.replace(/_/g, ' ')}
                      </h3>
                      {hasArtifact && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Generated
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => generateArtifact(artifactType)}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: hasArtifact ? '#E67E22' : '#2C5F5D' }}
                    >
                      <Plus className="w-4 h-4" />
                      {hasArtifact ? 'Regenerate' : 'Generate'}
                    </button>
                  </div>

                  {hasArtifact && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(hasArtifact, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(email) => {
          setUserEmail(email);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header className="shadow-md" style={{ backgroundColor: '#2C5F5D' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#F39C12' }}>
                Lean Six Sigma Master Coach™
              </h1>
              <p className="text-sm text-white mt-1">
                Powered by Ebani Genius Solutions
              </p>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">
                {charter.title || 'New Project'}
              </p>
              <p className="text-gray-300 text-xs">
                Phase: {currentPhase.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 py-3">
            {['dashboard', 'charter', 'coach', 'artifacts'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentView === view
                  ? 'bg-[#2C5F5D] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'charter' && renderCharter()}
        {currentView === 'coach' && renderCoach()}
        {currentView === 'artifacts' && renderArtifacts()}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 Ebani Genius Solutions. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#2C5F5D]">Documentation</a>
              <a href="#" className="hover:text-[#2C5F5D]">Support</a>
              <a href="#" className="hover:text-[#2C5F5D]">Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LSSMasterCoach;
