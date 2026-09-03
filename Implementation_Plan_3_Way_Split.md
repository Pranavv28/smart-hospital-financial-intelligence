# Smart Hospital Financial Intelligence — Implementation Plan
## 3-Person Parallel Build Plan (Deadline: 2 PM Today)

> **Read this if you're one of the 3 people building this.** It assumes you've already read `Hackathon_Game_Plan_Handoff.md` (the strategy doc) — this file is the "now go build it" version: concrete tasks, file structure, exact contracts between the three tracks, and checkpoints.

---

## 1. The Three Tracks

| Track | Owner | Builds |
|---|---|---|
| **A — Data & Backend** | Person 1 | Processes the 2 Kaggle datasets into `seed.json`, injects the leakage anomaly, optionally wraps it in a FastAPI layer |
| **B — Core UI** | Person 2 | Dashboard, Leakage Alert card/table, ROI Simulator |
| **C — Supporting UI + Integration** | Person 3 | AI Copilot (canned), Forecast chart, cosmetic login, demo script, final integration/testing |

**Golden rule: Track A must produce `seed.json` first — everything else depends on it.** If Track A isn't done within the first ~45–60 minutes, Tracks B and C should start against a **hand-written fake `seed.json`** (5 minutes to type by hand) so nobody sits idle, then swap in the real one once it's ready. The shape must match Section 4 exactly regardless of which one is used.

---

## 2. Repo / Folder Structure (agree on this before anyone writes code)

```text
project/
  data/
    raw/                    ← put the 2 Kaggle CSVs here, untouched
      healthcare_dataset.csv
      synthetic_admissions.csv
    seed.json                ← Track A's final output — the contract file
    process_data.py          ← Track A's script

  backend/                   ← only if Track A has time for FastAPI
    main.py
    routes/
      dashboard.py
      leakage.py
      roi.py

  frontend/
    src/
      components/
        Dashboard.jsx        ← Track B
        LeakageAlert.jsx     ← Track B
        RoiSimulator.jsx     ← Track B
        AiCopilot.jsx        ← Track C
        ForecastChart.jsx    ← Track C
        Login.jsx            ← Track C
      services/
        dataService.js       ← fetch seed.json OR call backend, one switch point
      App.jsx

  docs/
    demo_script.md           ← Track C
```

**Why this matters:** `data/seed.json` and `frontend/src/services/dataService.js` are the two files everyone reads from. As long as those two contracts hold, all three tracks can work without touching each other's files.

---

## 3. Track A — Data & Backend (Person 1)

### Step 1: Load the two Kaggle datasets

Once uploaded, drop them at `data/raw/healthcare_dataset.csv` and `data/raw/synthetic_admissions.csv`.

- **`healthcare_dataset.csv` (prasad22)** — has Age, Gender, Blood Type, Medical Condition, Billing Amount, Admission Type, Medication, Test Results. **Use this one for realistic billing-amount ranges and admission types.**
- **`synthetic_admissions.csv` (yashdev01)** — has demographics, admission/discharge dates, diagnosis codes, procedures, department/unit, length of stay. **Use this one for admission dates, departments, and length-of-stay values.**

They're two separate synthetic populations — don't try to join them by patient. Instead: pull **distributions** from each (typical billing amounts, typical departments, typical date ranges) and use those distributions to generate our own smaller, coherent dataset. Trying to merge them row-by-row will cost more time than it saves.

### Step 2: Build the service catalog

From the departments/conditions present in the datasets, hand-pick ~6–8 services across 2–3 departments with a price per service (use the billing-amount distribution from `healthcare_dataset.csv` to pick realistic prices). Example:

```text
Radiology:   MRI Scan (₹18,500), X-Ray (₹2,200)
Cardiology:  ECG (₹1,800), Angiography (₹45,000)
General:     Consultation (₹800), Blood Test (₹1,200)
```

### Step 3: Generate patients + admissions + invoices

Write `process_data.py` (plain pandas, no need for anything fancier):

1. Sample ~15–20 rows from `synthetic_admissions.csv` for admission dates/departments/length of stay.
2. Generate a patient per admission (name can be `Patient 1`, `Patient 2`... — no need for realistic names).
3. Assign each admission 1–3 services from the catalog.
4. Create an invoice per admission = sum of assigned service prices (minus a small random discount for realism).
5. Create a payment per invoice (some full, some partial — for receivables).

### Step 4: Inject the leakage anomaly — the most important step

Pick **1–2 admissions** and mark one of their services as `"status": "completed"` **without** adding it to that admission's invoice `service_ids`. Print/log which record you picked so Track B knows the exact number to expect on the dashboard.

```text
Example: Admission #7 — MRI Scan completed (₹18,500), but invoice #7 only lists
the Consultation and Blood Test. This ₹18,500 is what the Leakage Alert should show.
```

### Step 5: Output `seed.json` — this is the contract (see Section 4 for exact shape)

### Step 6 (optional, only if time remains after Step 5): FastAPI wrapper

```text
GET /analytics/dashboard   → aggregates from seed.json
GET /analytics/leakage     → the flagged anomaly/anomalies
POST /roi/simulate         → runs the ROI formulas server-side
```

If you don't get to this — that's fine. The frontend will just compute the same things client-side from `seed.json` directly (see `dataService.js` in Section 5).

---

## 4. The Contract — `seed.json` Shape (do not deviate from this)

```json
{
  "patients": [
    { "id": "p1", "name": "Patient 1", "age": 45, "gender": "F" }
  ],
  "services": [
    { "id": "s1", "name": "MRI Scan", "department": "Radiology", "price": 18500 }
  ],
  "admissions": [
    { "id": "a1", "patient_id": "p1", "date": "2026-08-10", "service_ids": ["s1", "s2"] }
  ],
  "invoices": [
    {
      "id": "inv1",
      "admission_id": "a1",
      "service_ids": ["s2"],
      "subtotal": 2000,
      "discount": 0,
      "total": 2000
    }
  ],
  "payments": [
    { "id": "pay1", "invoice_id": "inv1", "amount": 2000, "date": "2026-08-11" }
  ],
  "expenses": [
    { "id": "e1", "department": "Radiology", "category": "Maintenance", "amount": 40000, "month": "2026-08" }
  ]
}
```

**Key rule for the anomaly:** in the example above, admission `a1` has services `["s1","s2"]` but invoice `inv1` only bills `["s2"]` — `s1` (the ₹18,500 MRI) is the leakage. Any frontend leakage-detection logic just needs to compare `admission.service_ids` against the union of that admission's invoice `service_ids`.

`expenses` is a flat monthly list — enough for a simple expense trend line, doesn't need to be exhaustive.

---

## 5. Track B — Core UI (Person 2)

This is the highest-priority visual track — build in this order, stop when time runs out.

### `dataService.js` (build this first, shared by everyone)

One function per screen need, each with a fallback: try the backend endpoint, fall back to computing from `seed.json` directly if the backend isn't up.

```js
// pseudocode
export async function getDashboardData() {
  try { return await fetch('/api/analytics/dashboard').then(r => r.json()); }
  catch { return computeDashboardFromSeed(seedData); }
}
```

Agree with Track A up front on whether the backend will exist — if not, skip the `try` block entirely and just compute client-side. Don't build both halves speculatively.

### Dashboard screen

**Top row — 5 KPI cards:**
```text
Total Revenue | Total Expenses | Net Profit | Outstanding Receivables | Potential Leakage
```
- Revenue = sum of invoice totals
- Expenses = sum of expenses
- Profit = Revenue − Expenses
- Receivables = sum of (invoice total − payments received) across unpaid/partial invoices
- Potential Leakage = sum of all flagged anomaly amounts (from Section 6 logic)

**Below that — 2 charts:**
- Revenue trend (line chart, monthly — can be the 5–6 months of expense/invoice dates you have)
- Department profitability (bar chart: revenue vs expense per department)

**Alerts strip:** a small highlighted card that says *"⚠ 1 leakage alert — ₹18,500 potentially unbilled"* — links to the Leakage screen/section.

### Leakage Alert component

Cards: Potential Leakage total | Number of Alerts | Estimated Recoverable Amount

Table below: `Admission | Service | Reason | Estimated Impact`

**Detection logic (client-side, simple):**
```js
for each admission:
  billedServiceIds = union of service_ids across all invoices for that admission
  for each service_id in admission.service_ids:
    if service_id not in billedServiceIds:
      flag as leakage, impact = price of that service
```

### ROI Simulator

Inputs: Investment, Patient Volume/month, Avg Revenue/patient, Operating Cost/month. Pre-fill with the worked example from the strategy doc (₹2.4Cr investment, 450 patients, ₹8,000/patient, ₹18L operating cost) so it's never empty on load.

```text
Monthly Revenue      = Patient Volume × Avg Revenue
Monthly Contribution = Monthly Revenue − Operating Cost
Annual Contribution  = Monthly Contribution × 12
Break-even (years)   = Investment ÷ Annual Contribution
ROI (%)              = Annual Contribution ÷ Investment × 100
```

Add 2 sliders: Patient Volume (±10%), Operating Cost (+10%) — recompute live on change, no submit button needed.

---

## 6. Track C — Supporting UI + Integration (Person 3)

Build in this order — the first two are optional polish, the last two are not.

### AI Copilot (canned)

A simple chat UI with 4–5 clickable suggested questions, each mapped to a **pre-written answer string** referencing real numbers pulled from `seed.json` at load time (not hardcoded numbers, so it stays consistent if the seed data changes):

```text
"Where are we losing money?"
  → "You have {leakageCount} unbilled service(s) totaling ₹{leakageTotal}, mainly in {topDept}."

"Which department is most profitable?"
  → "{topDept} shows the highest profit margin, at ₹{topDeptProfit}."

"Should we buy another MRI?"
  → "Based on current assumptions, break-even is about {breakEvenYears} years with an ROI of {roi}%."
```

No LLM call in the demo path. If there's real time left after everything else, wire an actual LLM call as a bonus — but the canned path must work regardless.

### Forecast chart

One line chart: historical revenue (from `seed.json`, however many months exist) + 2–3 extra "forecast" points computed as a simple flat growth assumption (e.g. +5%/month) — not a real model. Label the forecast portion visually distinct (dashed line).

### Cosmetic login (only if A + B + the above are done early)

Dropdown: "Login as: Admin / Manager / Accountant" → routes to the same dashboard regardless of selection. No real auth, no backend check. See earlier discussion — skip entirely if time is short.

### Integration + testing (this is the real job — don't shortchange it)

- Confirm `seed.json` loads correctly in every component once Track A delivers it
- Walk the full demo sequence end to end (Section 7) and fix anything that breaks
- Write `docs/demo_script.md` — the actual words to say, timed to under 3 minutes
- Have a recorded screen-capture backup in case live demo has issues

---

## 7. Definition of Done (same as the strategy doc — repeated here as the integration checklist)

```text
Open dashboard
  → revenue/expenses/profit/leakage numbers visible
  → leakage alert shows the seeded anomaly with correct amount
  → switch to ROI Simulator
  → adjust a slider, see ROI + break-even update live
  → (if built) ask AI Copilot a canned question, see a correct answer
```

---

## 8. Checkpoints (rough timing — adjust to however much time is actually left)

| Checkpoint | What must be true |
|---|---|
| +45–60 min | Track A has a `seed.json` (real or hand-typed placeholder) that Tracks B/C can build against |
| Halfway mark | Dashboard + Leakage Alert render real numbers from `seed.json`; ROI Simulator computes correctly |
| ~30 min before deadline | Full demo sequence (Section 7) runs without errors; stop building new features |
| Final stretch | Only bug fixes and demo rehearsal — no new code |

**If any track is behind at the halfway mark, the other two should pause and help unblock it rather than continuing to build unrelated polish.** A complete Definition of Done beats a bigger feature set every time today.
