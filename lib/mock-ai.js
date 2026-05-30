export const interviewCategories = [
  'HR Interview',
  'Chartered Accountant',
  'Finance Interview',
  'Marketing Interview',
  'Sales Interview',
  'Operations Interview',
  'Business Analyst',
  'Customer Support',
  'Management Interview',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Technical Interview',
  'Non-Technical Interview',
  'System Design',
  'DSA Interview',
  'Government Exam Interview',
  'UPSC Interview',
  'Communication Skills Interview',
  'Internship Interview'
];

export function generateInterviewQuestion({ category, difficulty, language, voiceStyle }, previousAnswer = '') {
  const intro = language === 'Hindi' ? 'Kripya bataye:' : 'Tell me:';
  const style = voiceStyle === 'Strict HR' ? 'Be specific and structured.' : 'Take your time and answer clearly.';
  const followUp = previousAnswer ? ' Based on your last answer, add one concrete example.' : '';
  return `${intro} In a ${difficulty} ${category}, how would you prove you are ready for the role? ${style}${followUp}`;
}

export function generateFeedback(transcript = '') {
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const hasExample = /example|project|built|created|led|improved|designed|handled|managed|audited|reported|negotiated|coordinated/i.test(transcript);
  const base = Math.min(88, Math.max(52, wordCount + (hasExample ? 24 : 8)));

  return {
    summary: 'You need improvement in communication clarity, role-specific examples, and explanation depth.',
    scores: {
      communication: Math.min(95, base + 4),
      roleKnowledge: Math.min(92, base + (hasExample ? 8 : -4)),
      confidence: Math.min(90, base),
      problemSolving: Math.min(93, base + 2),
      grammar: Math.min(96, base + 6),
      clarity: Math.min(94, base + 1)
    },
    strongAreas: ['Good intent in your answer', 'Relevant career direction', 'Room to build a strong project story'],
    weakAreas: ['Add sharper structure', 'Use measurable outcomes', 'Explain decisions and responsibilities more deeply'],
    improvements: ['Use STAR format', 'Add metrics', 'Pause before answering', 'End with business impact'],
    topics: ['Role fundamentals', 'Communication clarity', 'Business impact storytelling', 'Interview confidence']
  };
}

export function analyzeResume(text = '', targetRole = '') {
  const combined = `${targetRole} ${text}`;
  const hasMetrics = /\d+%|\d+x|\d+\+|reduced|improved|increased|saved|handled|managed|audited|reconciled/i.test(combined);
  const tech = /react|node|typescript|testing|api|mongodb|next|python|java|sql|cloud/i.test(combined);
  const finance = /ca|chartered accountant|accounting|audit|gst|tax|finance|tally|reconciliation|ifrs|ind as/i.test(combined);
  const hr = /hr|human resources|recruitment|payroll|employee engagement|onboarding|talent acquisition/i.test(combined);
  const business = /sales|marketing|operations|customer|business analyst|excel|crm|communication|negotiation/i.test(combined);
  const roleSignal = tech || finance || hr || business;
  const score = 62 + (hasMetrics ? 14 : 0) + (roleSignal ? 12 : 0);
  const missingSkills = getMissingSkills({ tech, finance, hr, business });

  return {
    atsScore: Math.min(96, score),
    readinessScore: Math.min(10, Math.round((score / 10) * 10) / 10),
    suggestions: [
      'Add measurable achievements to your top project bullets.',
      'Include role-specific keywords from the job description.',
      'Reduce long paragraphs into short recruiter-scannable bullets.',
      'Add tools, processes, responsibilities, and measurable outcomes.'
    ],
    missingSkills
  };
}

function getMissingSkills({ tech, finance, hr, business }) {
  if (finance) return ['GST and taxation keywords', 'Audit documentation', 'Advanced Excel', 'Financial reporting'];
  if (hr) return ['Recruitment metrics', 'HR policies', 'Payroll basics', 'Employee engagement'];
  if (business) return ['CRM tools', 'Stakeholder communication', 'Reporting dashboards', 'Negotiation examples'];
  if (tech) return ['Testing', 'System design basics', 'Performance optimization', 'Deployment workflow'];
  return ['Role-specific keywords', 'Measurable achievements', 'Communication clarity', 'Tool proficiency'];
}
