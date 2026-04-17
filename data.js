/* ── Quiz Automation Demo — Data ── */

const QUIZZES = [
  {
    id: 'q1',
    name: 'SaaS Readiness Assessment',
    status: 'active',
    steps: 5,
    starts: 4820,
    completions: 3156,
    leads: 2847,
    avgScore: 72,
    topSegment: 'High-Intent Buyer',
    created: '2026-03-01',
    questions: [
      { q: 'What is your company size?', options: ['1-10', '11-50', '51-200', '200+'], weights: [5, 10, 20, 30] },
      { q: 'Current tech stack budget?', options: ['<$1K/mo', '$1K-$5K/mo', '$5K-$20K/mo', '$20K+/mo'], weights: [5, 15, 25, 35] },
      { q: 'Biggest pain point?', options: ['Manual processes', 'Data silos', 'Scaling issues', 'Compliance'], weights: [10, 15, 20, 25] },
      { q: 'Decision timeline?', options: ['Exploring', '3-6 months', '1-3 months', 'Immediately'], weights: [5, 10, 20, 30] },
      { q: 'Who is involved in decisions?', options: ['Just me', 'Small team', 'Department', 'C-Suite'], weights: [5, 10, 15, 25] }
    ]
  },
  {
    id: 'q2',
    name: 'Marketing Maturity Score',
    status: 'active',
    steps: 6,
    starts: 3210,
    completions: 2108,
    leads: 1893,
    avgScore: 58,
    topSegment: 'Growth-Stage',
    created: '2026-03-10',
    questions: [
      { q: 'How do you currently generate leads?', options: ['Word of mouth', 'Social media', 'Paid ads', 'Multi-channel'], weights: [5, 10, 20, 30] },
      { q: 'Email list size?', options: ['<500', '500-2K', '2K-10K', '10K+'], weights: [5, 10, 20, 30] },
      { q: 'Marketing automation tools?', options: ['None', 'Basic (Mailchimp)', 'Mid (ActiveCampaign)', 'Advanced (HubSpot/Marketo)'], weights: [5, 10, 20, 30] },
      { q: 'Content production frequency?', options: ['Rarely', 'Monthly', 'Weekly', 'Daily'], weights: [5, 10, 20, 25] },
      { q: 'Do you track attribution?', options: ['No', 'Partially', 'Yes, basic', 'Yes, multi-touch'], weights: [5, 10, 15, 25] },
      { q: 'Monthly marketing budget?', options: ['<$1K', '$1K-$5K', '$5K-$25K', '$25K+'], weights: [5, 15, 25, 35] }
    ]
  },
  {
    id: 'q3',
    name: 'E-Commerce Growth Quiz',
    status: 'active',
    steps: 4,
    starts: 6540,
    completions: 4012,
    leads: 3608,
    avgScore: 65,
    topSegment: 'Scale-Ready',
    created: '2026-02-15',
    questions: [
      { q: 'Monthly revenue?', options: ['<$10K', '$10K-$50K', '$50K-$250K', '$250K+'], weights: [5, 15, 25, 35] },
      { q: 'Number of SKUs?', options: ['<25', '25-100', '100-500', '500+'], weights: [5, 10, 20, 25] },
      { q: 'Current platform?', options: ['Custom', 'Shopify', 'WooCommerce', 'Enterprise (Magento/SF)'], weights: [10, 15, 10, 25] },
      { q: 'Biggest growth blocker?', options: ['Traffic', 'Conversion', 'Retention', 'Operations'], weights: [10, 15, 20, 25] }
    ]
  },
  {
    id: 'q4',
    name: 'Fitness Goal Finder',
    status: 'paused',
    steps: 5,
    starts: 8920,
    completions: 6340,
    leads: 5102,
    avgScore: 44,
    topSegment: 'Beginner',
    created: '2026-01-20',
    questions: [
      { q: 'Fitness experience?', options: ['Brand new', '<1 year', '1-3 years', '3+ years'], weights: [5, 10, 20, 30] },
      { q: 'Primary goal?', options: ['Weight loss', 'Muscle gain', 'Endurance', 'General health'], weights: [10, 15, 15, 10] },
      { q: 'Weekly workout availability?', options: ['1-2 days', '3-4 days', '5-6 days', 'Every day'], weights: [5, 15, 25, 20] },
      { q: 'Budget for coaching?', options: ['Free only', '<$50/mo', '$50-$150/mo', '$150+/mo'], weights: [5, 10, 20, 30] },
      { q: 'Preferred format?', options: ['App/Videos', 'Group classes', '1-on-1 virtual', '1-on-1 in-person'], weights: [5, 10, 20, 30] }
    ]
  }
];

const SEGMENTS = [
  { id: 's1', name: 'High-Intent Buyer', color: '#ef4444', count: 1240, criteria: 'Score 80+, timeline < 3 months', emailSequence: 'Sales Fast-Track', convRate: 18.4 },
  { id: 's2', name: 'Growth-Stage', color: '#f59e0b', count: 2890, criteria: 'Score 50-79, has budget', emailSequence: 'Nurture — Case Studies', convRate: 8.2 },
  { id: 's3', name: 'Scale-Ready', color: '#3b82f6', count: 1560, criteria: 'Revenue > $50K, growth blocker identified', emailSequence: 'Solution Deep-Dive', convRate: 12.1 },
  { id: 's4', name: 'Beginner', color: '#22c55e', count: 3420, criteria: 'Score < 30, exploring', emailSequence: 'Education Series', convRate: 3.1 },
  { id: 's5', name: 'Enterprise Prospect', color: '#a855f7', count: 680, criteria: 'Company 200+, budget > $20K/mo', emailSequence: 'Enterprise Outreach', convRate: 22.7 },
  { id: 's6', name: 'Mid-Market', color: '#06b6d4', count: 1950, criteria: 'Company 51-200, score 40-79', emailSequence: 'Product Demo Series', convRate: 9.8 }
];

const LEADS = [
  { id: 'l1', name: 'Sarah Chen', email: 'sarah@techcorp.io', company: 'TechCorp', quiz: 'SaaS Readiness Assessment', score: 92, segment: 'High-Intent Buyer', crmSync: 'synced', crmId: 'SF-48291', emailStatus: 'Sequence 3/5', completedAt: '2026-04-17 09:14', answers: [3, 3, 2, 3, 3] },
  { id: 'l2', name: 'Marcus Johnson', email: 'marcus@growthly.co', company: 'Growthly', quiz: 'Marketing Maturity Score', score: 74, segment: 'Growth-Stage', crmSync: 'synced', crmId: 'SF-48305', emailStatus: 'Sequence 2/4', completedAt: '2026-04-17 08:52', answers: [2, 2, 2, 2, 1, 2] },
  { id: 'l3', name: 'Emily Watson', email: 'emily@freshbrew.com', company: 'FreshBrew Co', quiz: 'E-Commerce Growth Quiz', score: 85, segment: 'Scale-Ready', crmSync: 'synced', crmId: 'SF-48310', emailStatus: 'Sequence 1/6', completedAt: '2026-04-17 08:31', answers: [2, 2, 1, 1] },
  { id: 'l4', name: 'David Park', email: 'david@megaindustries.com', company: 'Mega Industries', quiz: 'SaaS Readiness Assessment', score: 96, segment: 'Enterprise Prospect', crmSync: 'synced', crmId: 'SF-48312', emailStatus: 'Sequence 2/3', completedAt: '2026-04-17 07:45', answers: [3, 3, 3, 3, 3] },
  { id: 'l5', name: 'Lisa Tran', email: 'lisa@fitlife.me', company: 'Personal', quiz: 'Fitness Goal Finder', score: 28, segment: 'Beginner', crmSync: 'pending', crmId: null, emailStatus: 'Queued', completedAt: '2026-04-17 07:22', answers: [0, 0, 0, 0, 0] },
  { id: 'l6', name: 'James Mitchell', email: 'james@novaretail.com', company: 'Nova Retail', quiz: 'E-Commerce Growth Quiz', score: 68, segment: 'Mid-Market', crmSync: 'synced', crmId: 'SF-48320', emailStatus: 'Sequence 3/6', completedAt: '2026-04-16 22:10', answers: [1, 1, 1, 2] },
  { id: 'l7', name: 'Ava Morales', email: 'ava@cloudnine.io', company: 'CloudNine', quiz: 'SaaS Readiness Assessment', score: 88, segment: 'High-Intent Buyer', crmSync: 'synced', crmId: 'SF-48325', emailStatus: 'Sequence 4/5', completedAt: '2026-04-16 21:33', answers: [2, 3, 3, 3, 2] },
  { id: 'l8', name: 'Ryan Foster', email: 'ryan@brandblast.co', company: 'BrandBlast', quiz: 'Marketing Maturity Score', score: 42, segment: 'Growth-Stage', crmSync: 'failed', crmId: null, emailStatus: 'Paused', completedAt: '2026-04-16 20:18', answers: [1, 1, 1, 1, 0, 1] },
  { id: 'l9', name: 'Nina Patel', email: 'nina@luxhome.com', company: 'LuxHome', quiz: 'E-Commerce Growth Quiz', score: 95, segment: 'Enterprise Prospect', crmSync: 'synced', crmId: 'SF-48330', emailStatus: 'Sequence 1/3', completedAt: '2026-04-16 18:45', answers: [3, 3, 3, 3] },
  { id: 'l10', name: 'Tom Bradley', email: 'tom@startupxyz.com', company: 'StartupXYZ', quiz: 'SaaS Readiness Assessment', score: 35, segment: 'Mid-Market', crmSync: 'synced', crmId: 'SF-48335', emailStatus: 'Sequence 1/4', completedAt: '2026-04-16 17:20', answers: [1, 0, 1, 1, 1] },
  { id: 'l11', name: 'Megan Torres', email: 'megan@pulsefit.co', company: 'PulseFit', quiz: 'Fitness Goal Finder', score: 62, segment: 'Growth-Stage', crmSync: 'synced', crmId: 'SF-48340', emailStatus: 'Sequence 2/4', completedAt: '2026-04-16 16:05', answers: [2, 1, 2, 2, 2] },
  { id: 'l12', name: 'Alex Kim', email: 'alex@digitalnow.io', company: 'DigitalNow', quiz: 'Marketing Maturity Score', score: 81, segment: 'High-Intent Buyer', crmSync: 'synced', crmId: 'SF-48345', emailStatus: 'Sequence 3/5', completedAt: '2026-04-16 14:42', answers: [3, 3, 3, 2, 2, 2] }
];

const EMAIL_SEQUENCES = [
  { id: 'e1', name: 'Sales Fast-Track', segment: 'High-Intent Buyer', steps: 5, enrolled: 1240, opened: 892, clicked: 456, converted: 228, status: 'active' },
  { id: 'e2', name: 'Nurture — Case Studies', segment: 'Growth-Stage', steps: 4, enrolled: 2890, opened: 1734, clicked: 694, converted: 237, status: 'active' },
  { id: 'e3', name: 'Solution Deep-Dive', segment: 'Scale-Ready', steps: 6, enrolled: 1560, opened: 1092, clicked: 530, converted: 189, status: 'active' },
  { id: 'e4', name: 'Education Series', segment: 'Beginner', steps: 8, enrolled: 3420, opened: 1710, clicked: 410, converted: 106, status: 'active' },
  { id: 'e5', name: 'Enterprise Outreach', segment: 'Enterprise Prospect', steps: 3, enrolled: 680, opened: 544, clicked: 340, converted: 154, status: 'active' },
  { id: 'e6', name: 'Product Demo Series', segment: 'Mid-Market', steps: 6, enrolled: 1950, opened: 1170, clicked: 488, converted: 191, status: 'active' }
];

const AUTOMATION_RULES = [
  { id: 'r1', trigger: 'Quiz completed & score >= 80', action: 'Assign to Sales Fast-Track + notify rep via Slack', status: 'active', fires: 1240 },
  { id: 'r2', trigger: 'Quiz completed & score 50-79', action: 'Enroll in Nurture sequence + tag in CRM', status: 'active', fires: 4450 },
  { id: 'r3', trigger: 'Quiz completed & score < 30', action: 'Enroll in Education Series + low-priority CRM tag', status: 'active', fires: 3420 },
  { id: 'r4', trigger: 'Company size 200+ & budget > $20K', action: 'Flag Enterprise + assign to AE team + Slack alert', status: 'active', fires: 680 },
  { id: 'r5', trigger: 'CRM sync failure', action: 'Retry 3x, then alert ops channel + pause email', status: 'active', fires: 23 },
  { id: 'r6', trigger: 'Email sequence completed + no conversion', action: 'Move to re-engagement campaign after 14 days', status: 'active', fires: 890 },
  { id: 'r7', trigger: 'Lead opens 3+ emails in 24hrs', action: 'Bump priority + trigger sales notification', status: 'active', fires: 312 },
  { id: 'r8', trigger: 'Quiz abandoned at step 3+', action: 'Send reminder email after 2hrs + retarget ad', status: 'paused', fires: 1640 }
];

const DAILY_STATS = [
  { date: 'Apr 11', starts: 620, completions: 412, leads: 371 },
  { date: 'Apr 12', starts: 580, completions: 389, leads: 348 },
  { date: 'Apr 13', starts: 710, completions: 478, leads: 431 },
  { date: 'Apr 14', starts: 845, completions: 560, leads: 508 },
  { date: 'Apr 15', starts: 790, completions: 531, leads: 479 },
  { date: 'Apr 16', starts: 920, completions: 618, leads: 557 },
  { date: 'Apr 17', starts: 680, completions: 452, leads: 407 }
];

const CRM_SYNC_LOG = [
  { time: '09:14', lead: 'Sarah Chen', status: 'success', target: 'Salesforce', details: 'Created contact + opportunity' },
  { time: '08:52', lead: 'Marcus Johnson', status: 'success', target: 'Salesforce', details: 'Updated existing contact, added quiz data' },
  { time: '08:31', lead: 'Emily Watson', status: 'success', target: 'Salesforce', details: 'Created contact + deal stage: Qualified' },
  { time: '07:45', lead: 'David Park', status: 'success', target: 'Salesforce', details: 'Created contact + opportunity, AE assigned' },
  { time: '07:22', lead: 'Lisa Tran', status: 'pending', target: 'Salesforce', details: 'Queued — low priority' },
  { time: '22:10', lead: 'James Mitchell', status: 'success', target: 'Salesforce', details: 'Updated contact, segment changed' },
  { time: '20:18', lead: 'Ryan Foster', status: 'failed', target: 'Salesforce', details: 'API timeout — retry scheduled' },
  { time: '18:45', lead: 'Nina Patel', status: 'success', target: 'Salesforce', details: 'Created contact + enterprise flag' }
];
