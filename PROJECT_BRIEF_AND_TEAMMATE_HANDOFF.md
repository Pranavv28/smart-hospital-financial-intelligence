# Aegis Health — Smart Hospital Financial Intelligence
## Complete Project Brief, Architecture & Teammate Handoff

> **Purpose of this document:** If you are a teammate joining right now, read this document top to bottom. It contains the complete project context, data pipelines, UI design system, architecture, mathematical formulas, and the 3-minute hackathon pitch script so you can start contributing or demoing immediately without needing to sit through earlier discussions.

---

## 1. Executive Pitch & Mental Model

### The 30-Second Pitch
> **"Aegis is an AI-powered financial decision-support platform for hospital CFOs and finance directors. While existing hospital accounting tools tell you what was earned, Aegis tells you where you are silently losing money through unbilled clinical procedures, and whether major multi-crore capital equipment purchases will actually break even before you buy them."**

### 🚀 Live Production Deployment
- **Live Vercel URL:** [https://frontend-dun-sigma-71.vercel.app](https://frontend-dun-sigma-71.vercel.app)
- **GitHub Repository:** [https://github.com/Pranavv28/Smart-Hospital-Financial-Intelligence](https://github.com/Pranavv28/Smart-Hospital-Financial-Intelligence)

### Core Mental Model
$$\mathbf{Source\ of\ Truth} \longrightarrow \mathbf{Automated\ Intelligence} \longrightarrow \mathbf{Decisive\ Capital\ Action}$$

1. **Source of Truth**: Granular electronic medical records (EHR completed clinical orders, procedure logs, admission dates, diagnostic test catalogs).
2. **Intelligence**: Automated reconciliation rules detecting revenue leakage (completed scans omitted from billing invoices) and forward growth trajectory projections.
3. **Decisive Action**: 1-Click billing remediation (generates supplementary invoices) and precision capital ROI simulation for high-stakes equipment purchases (e.g. 3T MRI, Cath Labs).

---

## 2. Why We Focused on the Financial Pillar

The original hackathon problem statement asked for four broad pillars:
1. *Financial Analytics*
2. *Operational Analytics (bed occupancy, ALOS)*
3. *Clinical & Quality Analytics (readmission rates, mortality)*
4. *Predictive Analytics*

**Strategic Scoping Decision**: With the deadline today, building all four shallowly would result in a generic, half-finished template. We chose to go deep on the **Financial Pillar** because that is where the highest-conviction ROI story, measurable rupee impact, and the strongest demo moments live.

---

## 3. The 3-Track Build Division

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             AEGIS PLATFORM CONTRACT                              │
├────────────────────────┬─────────────────────────┬───────────────────────────────┤
│ Track A: Data Layer    │ Track B: Core UI        │ Track C: Decision Support     │
│ • Kaggle extraction    │ • Executive Dashboard   │ • CFO AI Copilot              │
│ • Seeded Anomaly       │ • Leakage Discovery     │ • Q4 Margin Forecaster        │
│ • data/seed.json       │ • 1-Click Remediation   │ • Collapsible Left Sidebar    │
│ • analytics.js engine  │ • Capital ROI Simulator │ • Role Perspective Modal      │
└────────────────────────┴─────────────────────────┴───────────────────────────────┘
```

---

## 4. End-to-End System Architecture

```text
Kaggle Dataset (healthcare_dataset.csv)
          ↓
process_data.py (Extracts 18 real patient records, realistic Indian tariff prices & injects anomaly)
          ↓
data/seed.json (Single Source of Truth: patients, services, admissions, invoices, payments, expenses)
          ↓
frontend/src/services/dataService.js (In-memory cache, live 1-click remediation mutations, fallback loader)
          ↓
frontend/src/utils/analytics.js (Deterministic reduction functions: computeDashboardStats, computeLeakage, computeRoi)
          ↓
┌──────────────────────────────────────────────────────────────────────────────────┐
│ React 18 + Tailwind CSS + Recharts UI                                            │
│                                                                                  │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────┐ │
│ │ Executive Dashboard  │  │ Leakage Discovery    │  │ Capital ROI Simulator    │ │
│ │ 5 KPI Hero Cards,    │  │ Flagged Unbilled     │  │ Real-time volume & AMC   │ │
│ │ Area & Bar charts    │  │ Discrepancy Table    │  │ sliders, 5-yr payback    │ │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────────┘ │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────┐ │
│ │ Runway Forecaster    │  │ CFO AI Copilot       │  │ Left Navigation Sidebar  │ │
│ │ Dashed forward Q4    │  │ 5 Ledger-grounded    │  │ Collapsible, hover float │ │
│ │ growth scenarios     │  │ contextual chips     │  │ motion, top toggle       │ │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Screen-by-Screen Breakdown & Formulas

### Screen 1: Executive Dashboard (`Dashboard.jsx`)
* **5 Hero KPI Cards** (Expressed in Indian Rupee notation with Lakhs/Crores):
  1. **Total Revenue** (`₹1.46 L` / ₹1,45,900): Sum of all billed patient invoice totals.
  2. **Operating Expenses** (`₹8.17 L` / ₹8,17,000): Sum of departmental staff, consumables, and AMC overhead.
  3. **Net Operating Profit** (`-₹6.71 L` / -₹6,71,100): Calculated live as $\text{Total Revenue} - \text{Total Expenses}$.
  4. **Outstanding Receivables** (`₹74.8k` / ₹74,820): Unpaid insurance and self-pay balances.
  5. **Potential Leakage** (`₹32,600`): Highlighted in warm amber (`#FEF3C7` / `#B45309`) indicating unbilled completed procedures.
* **Monthly Revenue vs. Expenses Area Chart**: Historical cash flow trajectory.
* **Department Profitability Breakdown Bar Chart**: Bar chart showing revenue vs. expenses per clinical unit with a **Net Profit / Loss** breakdown on hover.

---

### Screen 2: Leakage Discovery & 1-Click Remediation (`LeakageAlert.jsx`)
* **The Core Finding Rule**:
  $$\text{Leakage} = \text{Completed Clinical Procedures in EHR} \setminus \text{Billed Line Items in Invoice}$$
* **Primary Anomaly**: Admission **`a7`** (Patient *Haley Perkins*) underwent a **3T MRI Scan (₹18,500)** in Radiology that was omitted from discharge invoice `inv7`.
* **1-Click Live Remediation**: Clicking **"Add to Bill"** immediately appends the missing line item to the invoice, recalculates all KPIs in real-time, increases total revenue, and eliminates the anomaly.

---

### Screen 3: Capital Equipment ROI Precision Simulator (`RoiSimulator.jsx`)
* **The Mathematical Engine**:
  $$\text{Monthly Revenue} = \text{Monthly Volume} \times \text{Average Procedure Price}$$
  $$\text{Monthly Contribution} = \text{Monthly Revenue} - \text{Monthly Operating Cost}$$
  $$\text{Annual Contribution} = \text{Monthly Contribution} \times 12$$
  $$\text{Break-Even Payback (Years)} = \frac{\text{Initial Capex}}{\text{Annual Contribution}}, \quad \text{Annual ROI \%} = \frac{\text{Annual Contribution}}{\text{Initial Capex}} \times 100$$
* **Interactive Sliders**: Dragging the **Patient Volume** ($\pm20\%$) and **Operating Cost** ($\pm20\%$) sliders updates the numbers live without lag.
* **Worked Example (Pre-filled Default)**:
  - Capex: ₹2.40 Crore (3T MRI Scanner)
  - Volume: 450 scans/month
  - Average Price: ₹8,000 / scan
  - Monthly OpCost: ₹18.00 Lakhs
  - $\rightarrow$ **Break-Even = 1.11 Years**, **Annual ROI = 90.0%**.

---

### Screen 4: Revenue & Margin Runway Forecaster (`ForecastChart.jsx`)
* **Dashed Projection Line**: Distinct visual separation between audited historical actuals and forward projections (`strokeDasharray="6 4"`).
* **Sensitivity Scenarios**:
  - *Conservative*: +2% MoM revenue growth / ₹13.8L Q4 projected revenue.
  - *Baseline*: +5% MoM revenue growth / ₹14.9L Q4 projected revenue.
  - *Aggressive*: +9% MoM diagnostic expansion / ₹16.4L Q4 projected revenue.

---

### Screen 5: CFO Decision Support Copilot (`AiCopilot.jsx`)
* **Deterministic Grounding**: Zero hallucinations. All answers dynamically interpolate live numbers from `dashboardData` at query time.
* **5 Actionable Prompts**:
  1. *"Where is revenue leaking?"* $\rightarrow$ Flags unbilled count and ₹32,600 gap.
  2. *"Which department is most profitable?"* $\rightarrow$ Analyzes top departmental contribution.
  3. *"Should we buy another MRI unit?"* $\rightarrow$ Synthesizes unit economics and payback period.
  4. *"What is our outstanding receivables risk?"* $\rightarrow$ Reviews <30 day aging health.
  5. *"What does the Q4 financial horizon look like?"* $\rightarrow$ Explains Q4 forecast runway.

---

## 6. Design System & Avoid-List Rules

The UI follows the **Light Financial Precision Theme** designed for institutional executives:

| Design Element | Specification |
|---|---|
| **Canvas / Paper** | `#F8FAFC` (Cool off-white / Slate 50) |
| **Surfaces** | `#FFFFFF` with hairline `#E2E8F0` borders (no heavy floating shadows) |
| **Typography** | Humanist Sans-Serif (`Inter` / `system-ui`) with `tabular-nums` for big KPI numbers |
| **Accents** | Deep Amber (`#B45309`) for Leakage, Forest Green (`#047857`) for Surplus, Navy (`#1E3A8A`) for Active States |
| **Sidebar Navigation** | Collapsible left sidebar with top toggle button and **snappy hover float motion** (the single motion exception) |

### Strict Avoidance Compliance
- ❌ No warm cream + terracotta + serif displays.
- ❌ No generic SaaS-card drop-shadow kits (`rgba(0,0,0,0.1)` on every card).
- ❌ No ALL-CAPS tracked-out eyebrow labels.
- ❌ No middle dots (`·`) in meta strings.
- ❌ No trailing arrows (`→`) appended to buttons.

---

## 7. The 3-Minute Hackathon Demo Script (Rehearse This!)

### 0:00 – 0:45 | Opening on Dashboard
> *"Good afternoon. Hospitals already know what was recorded on their balance sheets. What they don't know in real-time is **where they are silently losing revenue**, and **how to validate multi-crore capital equipment purchases** before spending money.*
>
> *This is **Aegis Financial Intelligence** — built specifically for hospital CFOs and finance directors. Right from our executive dashboard, we see real-time KPIs synthesized directly from admission ledgers: **Total Revenue**, **Operating Expenses**, **Net Operating Profit**, and our core differentiator — **Potential Revenue Leakage**."*

### 0:45 – 1:30 | The Revenue Leakage Discovery (The "WOW" Moment)
> *(Click **Leakage Discovery** on the sidebar)*
> *"Look at this flagged finding: **₹32,600 Potential Leakage Detected** across unbilled clinical procedures.*
>
> *Our audit engine reconciled clinical medical orders against billing invoices. It automatically detected that **Admission #a7 (Haley Perkins) had a completed 3T MRI Scan (₹18,500)** in Radiology, but due to an inter-departmental EHR gap, it never made it onto the patient's discharge invoice.*
>
> *(Click **Add to Bill**)*
> *With one click, we create a supplementary invoice, recover the ₹18,500 immediately into top-line revenue, and clear the audit anomaly."*

### 1:30 – 2:15 | Capital Equipment ROI Simulator
> *(Click **ROI Simulator** on the sidebar)*
> *"Now let's look at the decision-making pillar. Say the hospital is deciding whether to purchase an additional **₹2.4 Crore 3T MRI Scanner**.*
>
> *Our ROI simulator models the unit economics in real time: at 450 scans a month and ₹8,000 average scan revenue, after ₹18 Lakhs in monthly operating costs, the scanner yields **₹2.16 Crore** in annual contribution.*
>
> *The break-even payback period is **1.11 years** with a **90% annual ROI**.*
> *(Drag the Patient Volume slider to +15%)*
> *Notice how increasing scan volume by 15% immediately shrinks payback to under a year with dynamic 5-year cash flow projections."*

### 2:15 – 2:45 | AI Copilot & Runway Forecasting
> *(Click **AI Copilot**, click *"Where is revenue leaking?"*)*
> *"Our **CFO Decision Copilot** provides instantaneous, deterministic financial advisory grounded directly in the hospital's active ledger — no hallucinations, purely mathematical certainty.*
>
> *(Click **Revenue Forecast**)*
> *Combined with our **Forward Runway Forecaster**, leadership can toggle Conservative, Baseline, and Aggressive scenarios with dashed projection boundaries."*

### 2:45 – 3:00 | Closing Pitch
> *"Aegis transforms passive hospital accounting into active financial intelligence — plugging revenue leakage, de-risking capital investments, and empowering healthcare leadership to make data-backed financial decisions with total confidence. Thank you!"*

---

## 8. Quickstart & Local Development

### Prerequisites
- Node.js `v18+` or `v20+`
- Git

### Setup & Run Commands
```bash
# 1. Clone repository
git clone https://github.com/Pranavv28/Smart-Hospital-Financial-Intelligence.git
cd Smart-Hospital-Financial-Intelligence/frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# -> Runs live at http://localhost:3000/

# 4. Verify production build
npm run build
```

---

## 9. Repository File Map

```text
Smart-Hospital-Financial-Intelligence/
├── data/
│   ├── raw/
│   │   └── healthcare_dataset.csv      # Raw Kaggle clinical data
│   ├── process_data.py                 # Data transformation script
│   └── seed.json                       # Source of Truth contract
├── docs/
│   └── demo_script.md                  # 3-Minute presentation script
├── frontend/
│   ├── public/data/seed.json           # Bundled static contract
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx             # Collapsible left navigation
│   │   │   ├── Navbar.jsx              # Status header & perspective indicator
│   │   │   ├── Dashboard.jsx           # 5 KPI cards, area & bar charts
│   │   │   ├── LeakageAlert.jsx        # Leakage discovery & 1-click remediation
│   │   │   ├── RoiSimulator.jsx        # Precision capital payback simulator
│   │   │   ├── ForecastChart.jsx       # Q4 margin runway forecaster
│   │   │   ├── AiCopilot.jsx           # Deterministic CFO decision copilot
│   │   │   └── Login.jsx               # Role perspective modal
│   │   ├── services/dataService.js     # Unified data layer & state manager
│   │   ├── utils/analytics.js          # Calculation & audit engine
│   │   ├── utils/formatters.js         # Indian Rupee (₹) formatting
│   │   ├── App.jsx                     # Top-level view coordinator
│   │   ├── index.css                   # Custom light theme tokens
│   │   └── main.jsx                    # React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
