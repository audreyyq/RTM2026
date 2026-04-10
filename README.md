# RTM2026 - Contact Center Monitoring Dashboard

Prototype dashboard for monitoring hybrid AI + Human agent operations in a contact center environment.

## Scenario: Skill-Specific Bottleneck (Option B)

Demonstrates an anomaly where:
- **Payment Declined** intent spikes +340%
- AI agents struggle (45% resolution rate vs 78% baseline)
- Billing queue overwhelmed (89 cases waiting, 18min wait time)
- System recommends reassigning to Tier 2 specialists

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Zendesk Garden** - Component library
- **Recharts** - Data visualization
- **Styled Components** - CSS-in-JS

## Project Structure

```
RTM2026/
├── src/
│   ├── components/      # React components
│   │   └── Dashboard.jsx
│   ├── data/           # Data config and scenarios
│   │   └── dashboardData.js
│   ├── styles/         # Global styles
│   │   └── index.css
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Development

### Data Configuration

All metrics are in `src/data/dashboardData.js`:
- `BASELINE_STATE` - Initial anomaly state
- `IMPROVED_STATE` - After action taken (5min later)
- `RECOMMENDED_ACTIONS` - Action recommendations
- `ASSISTANT_CONVERSATION` - Pre-scripted Q&A

To change metrics, edit this file and the dashboard updates automatically.

### Component Development

Using Zendesk Garden components:
- Import from `@zendeskgarden/react-*`
- Wrap app in `<ThemeProvider>`
- Follow Garden design patterns

## Prototype Flow

1. **Slack notification** → Alert received
2. **Dashboard** → Shows anomaly metrics and charts
3. **View recommendations** → Side panel with 3 actions
4. **Ask assistant** → Conversational investigation (Path B)
5. **Take action** → Execute reassignment
6. **See improvement** → Metrics update (time-lapse)

## Deployment

Configured for GitHub Pages:
- Base path: `/RTM2026/`
- Deploy with `npm run build` then push `dist/` folder

## License

Private prototype - Not for distribution
