// Option B: Skill-Specific Bottleneck Scenario
// One intent type (Payment Declined) spiking, creating Billing workstream bottleneck

export const BASELINE_STATE = {
  // Alert info
  alert: {
    active: true,
    type: 'topic-spike',
    title: 'Topic Spike Detected: Payment Declined',
    message: 'Payment Declined intent +340% | Started 47 minutes ago',
    timestamp: '2:00 PM'
  },

  // KPI Metrics
  totalContacts: 285,
  totalContactsBaseline: 188,
  totalContactsChange: 52, // percentage

  paymentDeclinedCases: 110,
  paymentDeclinedBaseline: 25,
  paymentDeclinedChange: 340, // percentage

  aiResolutionRate: 45,
  aiResolutionBaseline: 78,
  aiResolutionChange: -33, // percentage

  humanResolutionRate: 89,
  humanResolutionBaseline: 85,
  humanResolutionChange: 4, // percentage

  avgWaitTime: 18, // minutes
  avgWaitTimeBaseline: 4,
  avgWaitTimeChange: 350, // percentage

  // Queue depths by workstream
  queueDepth: {
    billing: { count: 89, waitTime: 18, status: 'critical' },
    calls: { count: 23, waitTime: 4, status: 'normal' },
    spanish: { count: 12, waitTime: 2, status: 'normal' },
    technical: { count: 18, waitTime: 6, status: 'warning' },
    returns: { count: 8, waitTime: 3, status: 'normal' }
  },

  // Agent status
  agents: {
    total: 70,
    online: 48,
    break: 8,
    lunch: 5,
    offline: 9,
    ai: {
      total: 30,
      active: 30,
      utilization: 100
    },
    human: {
      total: 40,
      active: 18,
      utilization: 75
    }
  },

  // Intent volume time series (last 4 hours, 15min intervals)
  intentVolumeData: [
    { time: '11:00', paymentDeclined: 22, accountAccess: 18, refund: 14, checkBalance: 28 },
    { time: '11:15', paymentDeclined: 24, accountAccess: 19, refund: 15, checkBalance: 30 },
    { time: '11:30', paymentDeclined: 26, accountAccess: 20, refund: 13, checkBalance: 29 },
    { time: '11:45', paymentDeclined: 23, accountAccess: 18, refund: 16, checkBalance: 31 },
    { time: '12:00', paymentDeclined: 25, accountAccess: 21, refund: 14, checkBalance: 28 },
    { time: '12:15', paymentDeclined: 27, accountAccess: 19, refund: 15, checkBalance: 32 },
    { time: '12:30', paymentDeclined: 24, accountAccess: 20, refund: 13, checkBalance: 29 },
    { time: '12:45', paymentDeclined: 26, accountAccess: 18, refund: 16, checkBalance: 30 },
    { time: '1:00', paymentDeclined: 23, accountAccess: 21, refund: 14, checkBalance: 28 },
    { time: '1:15', paymentDeclined: 25, accountAccess: 19, refund: 15, checkBalance: 31 },
    { time: '1:30', paymentDeclined: 24, accountAccess: 20, refund: 14, checkBalance: 29 },
    { time: '1:45', paymentDeclined: 26, accountAccess: 18, refund: 16, checkBalance: 30 },
    { time: '2:00', paymentDeclined: 52, accountAccess: 20, refund: 14, checkBalance: 29 }, // Spike starts
    { time: '2:15', paymentDeclined: 78, accountAccess: 19, refund: 15, checkBalance: 31 },
    { time: '2:30', paymentDeclined: 95, accountAccess: 21, refund: 13, checkBalance: 28 },
    { time: '2:45', paymentDeclined: 110, accountAccess: 20, refund: 16, checkBalance: 30 } // Current
  ],

  // AI vs Human performance on Payment Declined
  performanceComparison: {
    ai: {
      casesAttempted: 72,
      casesResolved: 12,
      resolutionRate: 17,
      avgHandleTime: 12 // minutes
    },
    human: {
      casesAttempted: 38,
      casesResolved: 34,
      resolutionRate: 89,
      avgHandleTime: 4.5 // minutes
    }
  }
};

// State after action taken (5min time-lapse)
export const IMPROVED_STATE = {
  ...BASELINE_STATE,

  alert: {
    ...BASELINE_STATE.alert,
    type: 'improving',
    title: 'Anomaly Improving',
    message: 'Queue depth decreasing | Action taken 5 minutes ago'
  },

  totalContacts: 240,
  paymentDeclinedCases: 85,

  avgWaitTime: 12,
  avgWaitTimeChange: 200,

  queueDepth: {
    billing: { count: 51, waitTime: 12, status: 'warning' },
    calls: { count: 20, waitTime: 4, status: 'normal' },
    spanish: { count: 10, waitTime: 2, status: 'normal' },
    technical: { count: 15, waitTime: 5, status: 'normal' },
    returns: { count: 6, waitTime: 3, status: 'normal' }
  },

  humanResolutionRate: 91,
  humanResolutionChange: 6,

  agents: {
    ...BASELINE_STATE.agents,
    human: {
      total: 40,
      active: 21, // 3 more agents assigned to billing
      utilization: 85
    }
  }
};

// Recommended actions
export const RECOMMENDED_ACTIONS = [
  {
    id: 'primary',
    priority: 'primary',
    title: 'Reassign "Payment Declined" cases to Tier 2',
    description: 'Route payment-related issues to billing specialists with system access',
    addresses: [
      '89 cases in billing queue',
      '18min average wait time',
      'AI agents lack payment gateway access'
    ],
    expectedImpact: [
      'Queue clears in: ~25min',
      'Wait time: 18min → 6min (↓67%)',
      'Resolution rate: 45% → 85%'
    ],
    confidence: 'high'
  },
  {
    id: 'secondary',
    priority: 'secondary',
    title: 'Increase billing team capacity by 3 agents',
    description: 'Add human agents to handle volume spike',
    addresses: [
      'High queue volume',
      'Limited Tier 2 availability'
    ],
    expectedImpact: [
      'Additional capacity: +18 cases/hour',
      'Reduced wait time by 40%'
    ],
    confidence: 'medium'
  },
  {
    id: 'strategic',
    priority: 'tertiary',
    title: 'Create temporary AI response for known payment gateway issue',
    description: 'Provide holding message while technical team resolves gateway timeout',
    addresses: [
      'Customer communication gap',
      'AI agents providing generic responses'
    ],
    expectedImpact: [
      'Improved customer satisfaction',
      'Reduced escalations by 20%'
    ],
    confidence: 'medium'
  }
];

// Assistant conversation (pre-scripted)
export const ASSISTANT_CONVERSATION = [
  {
    role: 'user',
    message: 'Why is payment declined spiking?',
    timestamp: '2:47 PM'
  },
  {
    role: 'assistant',
    message: `The "Payment Declined" intent spike started 47 minutes ago at 2:00 PM and is caused by payment gateway timeout errors.

📊 **Root Cause:**
• Payment gateway (Stripe) experiencing intermittent timeouts
• Started after scheduled maintenance window yesterday
• Affecting ~15% of transaction attempts
• Error code: GATEWAY_TIMEOUT (error_code: 504)

📈 **Trend Analysis:**
• Volume increased from ~25/hour (baseline) to 110/hour
• Peak was 2:45 PM with 110 cases
• Affecting primarily customers with saved payment methods
• New payment attempts succeeding at normal rate

🤖 **Why AI Can't Handle It:**
• AI agents can only retry transactions (not working for timeouts)
• Resolution requires manual payment gateway log review
• AI lacks access to Stripe admin dashboard
• Customers need confirmation that charge won't duplicate

📋 **Related Context:**
• Similar incident occurred 3 months ago (Jan 2026 gateway update)
• Resolved by routing to Tier 2 with billing system access
• Average resolution time for Tier 2: 4.5min vs AI: 12min (unsuccessful)

💡 **Recommended Action:**
Reassign all "Payment Declined" cases to Tier 2 billing specialists.

This will:
• Get customers to agents who can actually resolve issues
• Stop AI from wasting time on unresolvable cases
• Reduce customer frustration from repeated failed attempts

Would you like me to execute this reassignment?`,
    timestamp: '2:47 PM'
  }
];
