# Messaging Operations Dashboard - Specification

**Last updated:** 2026-04-13

## Overview
Real-time monitoring dashboard for Messaging channel operations showing AI agent performance, human agent capacity, and anomaly detection with recommended actions.

---

## Dashboard Layout

### Alert Banner (Top)
**Content:**
```
⚠️ Anomaly detected: Automated resolution dropped to 58% · Payment Declined +340%
Detected 2 min ago

[View recommendations] [X]
```

**Styling:**
- Neutral/warning background (light gray/blue, NOT red)
- Orange warning icon
- Blue outline button for "View recommendations"
- Positioned below filter bar, above widgets

---

### Row 1: Top of Funnel

**Left Column - Metrics Cards (2 cards):**

1. **Total contacts per channel (messaging)**
   - Value: 65 (+63%)
   - Label: "Active conversations"
   - Baseline: 40
   - No alert state

2. **Automated resolution**
   - Value: 58% ↓
   - **RED ALERT STATE** - Card should have red border/background
   - Baseline: 78%

**Right Column - Chart:**

3. **Escalation rate by intent (bar chart)**
   - **Payment Declined: 73%** (RED - highlighted bar)
   - Account Access: 45%
   - Refund Request: 28%
   - General Billing: 18%
   - Show as horizontal or vertical bar chart
   - Payment Declined bar should be visually highlighted/red

---

### Row 2: Bottleneck

**Left Column - Chart (takes ~60% width):**

4. **Queue depth per workstream (horizontal bar)**
   - **Billing: 45 (red)** - HIGHLIGHTED/RED
   - Technical Support: 12
   - Account Management: 8
   - General Inquiry: 6
   - Returns: 4
   - Billing bar should be red/critical state

**Right Column - Metrics Cards (2 cards):**

5. **Queue avg wait time**
   - Value: 8min ↑
   - Baseline: 2 min
   - Warning state (yellow) - rising from baseline

6. **Agent availability**
   - Value: 5/15
   - Subtitle: 33% spare capacity
   - Normal state

---

### Row 3: Performance

**Two cards, equal width:**

7. **Avg Time to first assignment**
   - Value: (TBD - needs realistic number)
   - Normal state

8. **Avg resolution time**
   - Value: (TBD - needs realistic number)
   - Normal state

9. **SLA compliance**
   - Value: 76% ↓
   - Normal state (or yellow warning)

---

## Recommendations Panel

**Triggered by:** Clicking "View recommendations" in alert banner

**Panel title:** "Recommended actions"

**Panel header:** Close button (X) + sparkle icon

### Action 1 (Auto-expanded, Primary)

**Title:** Reassign 28 Payment Declined tickets to Tier 2 specialists

**This addresses:**
- 28 Payment Declined tickets in queue (62% of Billing queue)
- High wait times (8 min)
- AI struggling with Payment Declined (73% escalation rate)

**Expected impact:**
- 5 Tier 2 specialists will handle reassignment (~5-6 tickets per agent)
- Queue clears in: 15min
- Wait time: 8:00 → 2:00 (↓75%)

**Buttons:**
- [Reassign tickets] - Blue bordered primary button
- ✨ Investigate with assistant - Gray bordered secondary button

---

### Action 2 (Collapsed)

**Title:** Assign Billing skill to available agents

**Preview text:** Add capacity: 4 agents from lower-volume queues · Expected impact: +25% throughput

**Expanded details:** (not needed for prototype)

---

### Action 3 (Collapsed)

**Title:** Increase agent capacity (3 → 4 chats)

**Preview text:** Temporary boost: +33% throughput · 5 additional concurrent tickets handled

**Expanded details:** (not needed for prototype)

---

## Assistant Chat Interface

**Triggered by:** Clicking "Investigate with assistant" button

**Chat title:** "Payment Declined Anomaly Investigation"

### Opening Message (Auto-sent)

```
Here's what's happening with the Payment Declined anomaly:

Root cause:
• Automated resolution dropped from 78% → 58%
• Payment Declined intent volume spiked +340% in the last 30 minutes
• The AI is escalating 73% of Payment Declined cases (vs. 22% baseline)

Why the AI agents are struggling:
This spike appears to involve a merchant processing issue outside the bot's knowledge base. Standard decline scenarios (insufficient funds, expired cards) are handled fine, but this is a system-level problem.

What would you like to explore?
```

**Suggested question buttons:**
- [Has this happened recently?]
- [What happens if I don't act?]
- [What should I do?]

---

### Q&A Flow

**Q1: "Has this happened recently?"**

```
Yes. I found 2 similar incidents in the last 90 days:

March 15, 2026 - Payment Declined +280%, lasted 45min
• Root cause: Payment gateway outage
• Action taken: Reassigned to Tier 2 + proactive notifications
• Resolution time: 38 minutes

February 8, 2026 - Payment Declined +195%, lasted 1hr 20min
• Root cause: Merchant processor downtime
• Action taken: Updated bot script temporarily
• Resolution time: 1hr 12min

Pattern: These spikes correlate with external payment system issues. Current spike is higher (+340%) than previous incidents, suggesting a broader system problem.
```

---

**Q2: "What happens if I don't act?"**

```
Based on current trajectory, here's the 30-minute forecast if no action is taken:

Queue projections:
• Billing queue: 45 → 72 cases (+60%)
• Wait time: 8min → 15min
• SLA compliance: 76% → 62% (critical breach)

Customer impact:
• ~50 customers will wait 12+ minutes
• Estimated CSAT drop: -0.7 points
• Potential escalations to social/public channels

Agent impact:
• 10 of 15 Messaging agents at max capacity (67%)
• Spillover to other queues likely in 20min

Recommendation: Act within the next 10 minutes to prevent cascading impact.
```

---

**Q3: "What should I do?"**

```
Based on the analysis, here's what I recommend:

[CARD STARTS]
Reassign 28 Payment Declined tickets to Tier 2 specialists

This addresses:
• 28 Payment Declined tickets in queue (62% of Billing queue)
• High wait times (8 min)
• AI struggling with Payment Declined (73% escalation rate)

Expected impact:
• 5 Tier 2 specialists will handle reassignment (~5-6 tickets per agent)
• Queue clears in: 15min
• Wait time: 8:00 → 2:00 (↓75%)

[Reassign tickets]
[CARD ENDS]

Additional actions to consider:
• Assign Billing skill to available agents (+25% capacity)
• Increase agent capacity limit: 3 → 4 chats (+33% throughput)

[View all recommendations]
```

---

### When "Reassign tickets" is clicked:

```
✓ Action applied: 28 Payment Declined tickets reassigned to 5 Tier 2 specialists

I'll monitor the impact. You should see:
• Queue depth dropping in ~5 min
• Wait times improving in ~10 min
• Automated resolution stabilizing

[View updated dashboard] [Monitor progress]
```

---

## Slack Notification

**Triggered:** When anomaly is first detected (2 min ago)

```
🚨 Anomaly Detected: Automated Resolution ↓26%

📊 Automated Resolution:
• Current: 58%
• Baseline: 78%
• Change: ↓20 percentage points

📈 Related Metrics:
• Payment Declined intent: +340% spike
• Payment Declined escalation rate: 73%
• Billing queue depth: 45 cases (baseline: 8)

⚠️ Impact: AI escalating more cases, Billing workstream overwhelmed

[View dashboard] [View recommended actions]

Detected: Just now (2:47 PM)
```

**Styling:** Red left border, Zendesk app icon

---

## Data Source

All data should pull from: `/src/data/dashboardData.js`

**Key data objects:**
- `BASELINE_STATE` - Current anomaly state metrics
- `IMPROVED_STATE` - Post-action metrics (for time-lapse demo)
- `RECOMMENDED_ACTIONS` - 3 action cards with details
- `ASSISTANT_CONVERSATION` - Pre-scripted Q&A

---

## Visual Design Notes

**Color States:**
- **Red/Critical:** Automated resolution card, Payment Declined bar (escalation chart), Billing bar (queue depth chart)
- **Yellow/Warning:** Queue wait time card (rising)
- **Normal/Info:** All other metrics

**Typography:**
- Metric values: Large, bold
- Labels: Small, gray
- Trends (↑↓%): Color-coded based on good/bad direction

**Charts:**
- Use Recharts library
- Garden color palette for normal states
- Red (#CC3340) for critical highlighted items
- Yellow (#F79A3E) for warning states

**Spacing:**
- Consistent 24px padding around widgets
- 16px gap between cards
- 32px gap between rows

---

## Prototype Behavior

**Semi-functional:**
- Filters in toolbar are static (not interactive)
- Clicking "View recommendations" opens side panel
- Clicking "Investigate with assistant" opens chat modal
- Pre-scripted Q&A responses
- Optional: Simulate time-lapse after action applied (metrics improve)

**Static elements:**
- Top nav (breadcrumbs, buttons)
- Side nav
- All dropdowns/filters

---

## Technical Stack

- React 18
- styled-components
- Recharts (for charts)
- Zendesk Garden (@zendeskgarden/react-*)
- Data from `dashboardData.js`

---

## File Structure

```
src/
├── components/
│   ├── TopNav.jsx (existing)
│   ├── SideNav.jsx (existing)
│   ├── DashboardToolbar.jsx (existing)
│   ├── Dashboard.jsx (update to add widgets)
│   ├── AlertBanner.jsx (NEW)
│   ├── MetricCard.jsx (NEW)
│   ├── EscalationChart.jsx (NEW)
│   ├── QueueDepthChart.jsx (NEW)
│   ├── RecommendationsPanel.jsx (NEW)
│   └── AssistantChat.jsx (NEW)
├── data/
│   └── dashboardData.js (existing)
└── App.jsx (existing)
```

---

## Notes

- Dashboard is scoped to **Messaging channel only** (no cross-channel filtering needed)
- All metrics are for real-time monitoring (not historical analysis)
- The scenario: Payment Declined intent spike causing automated resolution to fail, overwhelming Billing queue
- Primary user: Contact center supervisor responding to active incident
- Demo focus: Show both direct action path (apply recommendation) AND assistant investigation path
