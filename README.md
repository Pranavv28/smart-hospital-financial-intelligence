# Smart Hospital Financial Intelligence (AegisFinance)

An AI-powered hospital financial decision-support and revenue intelligence platform that detects unbilled procedural leakage, simulates ROI on major capital investments, and provides real-time CFO advisory.

---

## 🏛️ Project Architecture & Split

```text
├── data/
│   ├── seed.json             # Canonical reconciled ledger contract (Track A output)
│   ├── process_data.py       # Data synthesis and anomaly injection pipeline
│   └── test_analytics.js     # Analytics math & business logic verification suite
├── docs/
│   └── demo_script.md        # 3-minute executive CFO presentation script
├── frontend/                 # Track B & Track C UI
│   ├── public/
│   │   └── data/seed.json    # Bundled seed ledger for offline/instant client access
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Collapsible navigation with floating interactive tiles
│   │   │   ├── Dashboard.jsx      # Executive overview with 5 KPI cards, trend & dept charts
│   │   │   ├── LeakageAlert.jsx   # Revenue leakage discrepancy auditor with 1-click billing
│   │   │   ├── RoiSimulator.jsx   # CapEx decision instrument with live sensitivity sliders
│   │   │   ├── AiCopilot.jsx      # Deterministic CFO advisory copilot
│   │   │   └── ForecastChart.jsx  # Multi-line historical vs forecast revenue trajectory
│   │   ├── services/
│   │   │   └── dataService.js     # Data layer with live in-memory reconciliation
│   │   ├── utils/
│   │   │   ├── analytics.js       # Core financial computation engine
│   │   │   └── formatters.js      # Indian Rupee (₹ Lakhs/Crores) currency formatters
│   │   ├── App.jsx                # Main application shell with top context bar
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Financial precision design system & typography tokens
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
```

---

## ⚡ Quick Start & Local Run

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🔬 Core Differentiators
1. **Automated Revenue Leakage Audit**: Compares completed EHR clinical procedures against patient invoice line items, catching omitted charges (e.g., Admission `a7` MRI scan worth `₹18,500`).
2. **Interactive Capital Allocation & ROI Simulator**: Real-time break-even and annualized ROI computations with dynamic volume and OpEx sensitivity sliders.
3. **Deterministic Financial Copilot**: Generates CFO advisory responses grounded mathematically in ledger data with zero hallucination.
