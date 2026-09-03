# Smart Hospital Financial Intelligence — Hackathon Game Plan
## Compressed Strategy + Team Handoff (Deadline: 2 PM Today)

> **Purpose of this file:** if you're a teammate joining right now, read this top to bottom and you'll know exactly what we're building, why we cut what we cut, and what your job is for the next few hours. No need to sit through earlier discussion.

---

## 1. Where This Came From

Two source documents exist for this project:

1. **Official problem statement** (Dr. Bhupesh Kumar Dewangan, SIT Nagpur) — asks for a broad "Healthcare Institutional RoI Dashboard" covering four pillars: Financial Analytics, Operational Analytics, Clinical & Quality Analytics, and Predictive Analytics.
2. **Original team handoff doc** — scoped this down to just the financial slice ("Smart Hospital Accounts, Billing & ROI Management"): billing, revenue leakage, ROI simulation, forecasting, AI copilot. It was written assuming a multi-day build with a 4-person team working in parallel through a full 9-step dev sequence (schema → seed → CRUD → billing → dashboard → leakage → ROI → forecasting → AI copilot → polish).

**That plan no longer fits.** With a same-day 2 PM deadline, trying to build all 12 of its "must-have" MVP items would leave us with 8 half-finished modules and nothing that actually demos cleanly. A broken multi-module build reads as "ran out of time." A narrow, working, well-rehearsed slice reads as "we know exactly what we're doing."

**This document is the compressed version.** Same core story and differentiators as the original plan — just cut down to what's actually buildable in the time left, with the slow/risky parts deliberately faked instead of half-built live.

---

## 2. The Pitch (memorize this)

> **An AI-powered hospital financial intelligence platform that detects revenue leakage, simulates ROI on major investments, and helps management make smarter billing and investment decisions.**

Core mental model: **Source of Truth → Intelligence → Decision.**
Hospitals already know how much they earned. This tells them where they're losing money, and whether a given investment is worth making.

If asked why we scoped out operational metrics (bed occupancy, ALOS) and clinical/quality metrics (readmission rate, mortality, patient satisfaction) from the official problem statement: **we went deep on the financial pillar because that's where the RoI story and the strongest demo moment live, rather than spreading a few hours thin across four pillars and doing all of them shallowly.**

---

## 3. What We're Actually Building (Scope for Today)

### Must ship, in this order — stop when time runs out

| # | Item | Notes |
|---|---|---|
| 1 | **Seed data** | Scripted once (JSON/CSV or a seed script), not built through admin UI. ~10–20 patients, a handful of invoices, **one intentionally broken record** baked in (a completed service with no matching invoice line). |
| 2 | **Dashboard screen** | Revenue, Expenses, Profit, Potential Leakage. Pull from seeded data — real backend if time allows, otherwise a straightforward read of the seed file is fine. |
| 3 | **Leakage alert** | Our single best "wow" moment. One detection rule is enough: *completed service, no invoice line → flag it*. Don't build the full rule engine — just get this one anomaly caught and displayed with an estimated impact number. |
| 4 | **ROI Simulator** | Can be pure frontend math — no backend endpoint needed if short on time. Formulas below. |

### Fake or cut if tight on time

| Item | What to do instead |
|---|---|
| AI Copilot | Do **not** live-call an LLM in the demo if it isn't rock solid. Hardcode 3–4 canned Q&A pairs in a chat UI (e.g. "Why did expenses increase?" → pre-written answer). Looks identical to judges in a 3-minute demo. |
| Forecasting | One static trend chart with 2–3 fake future months. No real regression needed. |
| Auth / roles | Fake login screen that routes straight to dashboard. No real JWT/RBAC. |
| Insurance, expense CRUD, full patient/admission screens | Only build if the must-ship list is done early. |

### Don't touch at all

- Any new module (operational analytics, clinical/quality analytics) — that conversation is closed for this build.
- Docker / cloud deployment — run locally, have a screen recording as backup in case live demo hiccups.

---

## 4. ROI Simulator — the exact math (frontend-computable, no backend needed)

```text
Monthly Revenue        = Patient Volume × Average Revenue per Patient
Monthly Contribution   = Monthly Revenue − Monthly Operating Cost
Annual Contribution    = Monthly Contribution × 12
Break-even Period      = Investment ÷ Annual Contribution
ROI                    = Annual Contribution ÷ Investment
```

**Worked example to hardcode as a default / sanity check:**
- Investment = ₹2.4 crore
- Patient volume = 450/month
- Avg revenue/patient = ₹8,000
- Operating + maintenance cost = ₹18 lakh/month

→ Monthly Revenue = ₹36L → Monthly Contribution = ₹18L → Annual Contribution = ₹2.16Cr → Break-even ≈ 1.1 years → ROI ≈ 90%/year

Add 2–3 sliders (patient volume ±10%, operating cost +10%) so it visibly recalculates — this is what makes it feel like a real tool instead of a static calculator.

---

## 5. Leakage Detection — the one rule we need

```text
IF a service record is marked "completed"
AND no invoice line item exists for that service
THEN flag: "Potential Revenue Leakage: ₹[service price]"
```

Seed exactly one (or two) of these into the data on purpose. Display it on the dashboard as a card:
> **Potential Revenue Leakage Detected: ₹18,500**

That single flagged record, visibly caught and shown on the dashboard, is the demo's centerpiece — everything else supports it.

---

## 6. Architecture

One-directional flow, nothing you don't strictly need:

```text
seed_data.py (script, run once)
        ↓
   seed.json  (patients, services, invoices — with 1 seeded anomaly)
        ↓
Data access layer  — OPTIONAL: FastAPI endpoints if there's backend
                      time, otherwise the frontend fetches seed.json
                      directly and computes analytics client-side.
                      Nothing downstream changes either way.
        ↓
┌─────────────────────────────────────────────┐
│  React frontend (runs in browser)            │
│                                               │
│  ┌───────────────┐  ┌───────────────┐        │
│  │ Dashboard      │  │ Leakage alert │        │
│  │ Revenue,       │  │ Flags the     │        │
│  │ expenses,      │  │ seeded        │        │
│  │ leakage        │  │ anomaly       │        │
│  └───────────────┘  └───────────────┘        │
│  ┌───────────────┐  ┌───────────────┐        │
│  │ ROI simulator  │  │ AI copilot    │        │
│  │ Break-even,    │  │ Canned        │        │
│  │ ROI, sliders   │  │ answers,      │        │
│  │                │  │ no live LLM   │        │
│  └───────────────┘  └───────────────┘        │
└─────────────────────────────────────────────┘
        ↓
   Live demo (for judges)
```

**Why it's shaped this way:**
- One flat data file instead of a database — no PostgreSQL setup, no migrations, nothing that can break under time pressure. The seeded anomaly lives right in this file.
- The data access layer is the *only* optional piece — skip the FastAPI wrapper entirely and fetch `seed.json` straight from React if backend time runs out. Nothing else in the diagram needs to change.
- The four frontend modules are flat and independent — no cross-dependencies, so they can be built in parallel by different teammates, and each one degrades gracefully on its own (copilot falls back to canned Q&A, ROI simulator can run pure client-side math).
- No auth layer, no separate microservices, no deployment step — all deliberately out of scope per Section 3.

---

## 7. Minimal Data Model

Keep this to the fields that actually feed the four must-ship items. Don't build out the full schema from the original handoff doc (users, equipment, audit logs, etc.) — add fields only if you have spare time.

**patients**: id, name, age, gender

**services**: id, name, department, price, status (`completed` / `pending`)

**admissions**: id, patient_id, date

**invoices**: id, admission_id, service_ids[], subtotal, discount, total

**payments**: id, invoice_id, amount, date

*(The seeded anomaly = a row in `services` marked `completed` with no matching entry in any invoice's `service_ids`.)*

---

## 8. Tech Choices (use whatever's fastest for the team, not what's "correct")

- **Frontend:** React + Tailwind (or even plain HTML/JS if faster to wire up for a demo)
- **Backend:** FastAPI, only if there's time to build real endpoints — otherwise the frontend can just read a static JSON seed file directly and compute analytics client-side
- **Data:** flat JSON/CSV seed file — do **not** stand up PostgreSQL under this time pressure unless it's already running and someone is fast with it
- **Charts:** Recharts or Chart.js for the dashboard/trend visuals

The rule for every tech decision today: **whatever gets to a working demo fastest, wins** — even if it's less "architecturally correct" than the original plan.

---

## 9. Team Split for the Remaining Hours

- **Person on data/seed:** write the seed script/JSON now, including the one seeded leakage anomaly. This blocks everyone else — do it first.
- **Person on dashboard + leakage card:** build the screen reading from the seed data, show revenue/expenses/profit/leakage.
- **Person on ROI simulator:** build the input form + the math above, purely frontend.
- **Person on demo script + polish:** start writing the 90-second narration **now, in parallel** with the coding (see below) — don't wait until the build is done.

Everyone should still understand the full flow, even with split ownership — if one module runs late, others need to be able to jump in.

---

## 10. Demo Script (rehearse this, not just the code)

1. **Open on dashboard** — revenue, expenses, profit, potential leakage number visible.
2. **Point at the leakage alert card** — "This ₹18,500 is a completed MRI scan that never made it onto an invoice. Our system caught it automatically."
3. **Switch to ROI Simulator** — "Now say the hospital's considering buying another MRI machine." Enter the worked example numbers, show break-even and ROI. Move a slider to show it recalculates live.
4. *(If ready)* **AI Copilot** — ask one of the canned questions, show the explanation.
5. **Close on the one-line pitch** (Section 2 above).

Keep it under 3 minutes. A short, clean, rehearsed run beats a longer one that risks stalling.

---

## 11. Datasets — What We Need and Where to Get It

**Recommendation: generate our own synthetic seed data via a short script, don't pull an external dataset.** Given the time constraint, this is faster and gives us exact control over the one detail that matters most — the seeded leakage anomaly. An external dataset won't have that built in, and cleaning/reshaping someone else's schema under this deadline costs more time than it saves.

**What to generate (minimum):**
- ~15–20 patients (name, age, gender — use any name generator or just `Patient A/B/C`)
- ~5–8 services across 2–3 departments, with prices
- ~10–15 completed admissions with invoices/payments
- **1–2 records where a completed service has no matching invoice line** — this is the anomaly the leakage detector "finds"

A teammate comfortable with Python can knock this out with plain loops and `random`/`faker` in well under an hour — no need for a library beyond that.

**If you want realistic reference numbers** (plausible price ranges, department names, typical billing amounts) rather than raw data to plug in directly, these are worth a quick look — both are explicitly synthetic, no credentialing or privacy paperwork required:
- **"Healthcare Dataset" by prasad22 on Kaggle** — synthetic patient billing records (age, condition, billing amount, admission type, test results) — good for realistic billing-amount ranges.
- **"Synthetic Healthcare Admissions Dataset" by yashdev01 on Kaggle** — synthetic admission records (admission/discharge dates, department/unit, length of stay) — useful if we want more realistic-looking admission dates.

**Datasets to avoid for today:** PhysioNet MIMIC-IV and CMS Medicare SynPUF (mentioned in the original handoff as research references) both require credentialing/data use agreements or heavy cleaning — not feasible in this window. They're fine to *cite* in the pitch as "we researched real-world data structures via MIMIC-IV/CMS SynPUF" for credibility, but don't try to actually pull and clean them today.

---

## 12. Definition of Done (for today)

We're done when this sequence runs, live, without errors:

```
Open dashboard
  → see revenue/expenses/profit/leakage numbers
  → see the leakage alert for the seeded anomaly
  → switch to ROI Simulator
  → enter/adjust numbers, see ROI + break-even update
  → (optional) ask AI Copilot a canned question, see an answer
```

That's the whole MVP acceptance test. Nothing beyond this list is required today.

---

## 13. North Star for Any Time-Pressure Decision

If unsure whether to build something right now, ask: **does this directly serve the 3-minute demo script in Section 10?** If no, skip it — no matter how good an idea it is for a "real" version of this product.
