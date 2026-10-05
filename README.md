# WanderWise — Organization Travel & Field Visit Planner 🗺️

> **“Plan better. Travel prepared.”**  
> **“পরিকল্পনা হোক নির্ভুল। প্রস্তুতি হোক সম্পন্ন।”**

A modern, responsive, offline-first organizational travel and field visit management platform built for NGOs, project teams, emergency response units, inspection agencies, and enterprises with **Vanilla HTML5, CSS3, JavaScript (ES6+)**, and **Browser LocalStorage**.

---

## 🌟 Key Features

### 1. 📊 Executive Dashboard
- **Dynamic Organization Metrics**: Live counters for Total Trips, Upcoming Visits, Completed Missions, High Priority Tasks, Total Planned Budget, and Average Readiness %.
- **Upcoming Visits Carousel**: Real-time cards displaying dates, lead department, team size, budget, and readiness progress bar.
- **Recent Activity Audit Feed**: Automatic logging of trip creations, completions, budget revisions, checklist updates, and filed reports.

### 2. 📋 Comprehensive Trip & Field Visit Management
- **Full Operational Data Model**:
  - Trip / Mission Name, Location (District/Area), Country / Region
  - Purpose (Field Visit, Inspection, NGO/Community, Business Trip, Project Visit, Meeting, Event, Survey, Disaster Response, Training)
  - Organization / Department
  - Start & End Dates, Status (Planned, Preparing, Upcoming, Completed, Cancelled), Priority (High, Medium, Low)
  - Number of Participants, Estimated Budget, Objectives & Description, Operational Notes
  - Cover Photos (Local image upload with client-side canvas compression + Preset organizational themes)
- **Search & Multi-Criteria Filtering**:
  - Live query across mission names, locations, purposes, and departments.
  - Filter chips: All, Planned, Preparing, Upcoming, Completed, Cancelled, High Priority, Favorites.
  - Sorting: Newest First, Oldest First, Soonest Date, Priority, Budget, Readiness Score.
- **Fast Actions**: Quick Edit, Duplicate Trip, Toggle Favorite, Mark Completed, Delete with confirmation.

### 3. 🔍 Deep Trip Inspection Modal
- **Tab 1: Overview & Logistics**: Mission scope, operational notes, team size, budget, and duration.
- **Tab 2: Team Roster & Roles**: Assign field leads, specialists, and contact notes (no sensitive data).
- **Tab 3: Budget Breakdown**: Estimated vs actual expenditure across 8 categories with remaining balance and visual progress bars.
- **Tab 4: Itinerary Scheduler**: Day-by-day scheduler with time slots, venues, activities, and responsible persons.
- **Tab 5: Trip Checklist**: Interactive mission checklist with category badges and real-time progress.
- **Tab 6: Visit Report**: Attached post-mission reports with star ratings and field photos.

### 4. 💰 Budget & Expense Planner
- **Aggregate & Per-Trip Scope**: Switch between organization-wide totals and individual mission budgets.
- **8 Standard Cost Heads**: Transportation, Accommodation, Food & Meals, Local Transport, Activities & Meetings, Field Materials, Emergency Contingency, Other Miscellaneous.
- **Automated Calculations**: Projected Target, Logged Expenses, Remaining Balance, and Utilization Rate.

### 5. ✅ Field Readiness & Packing Checklist
- **4 Core Categories**: Documents & Permits, Equipment, Field Materials, Health & Safety.
- **Preparation Meter**: Live count ("Preparation: 7 / 10 completed — 70%") with visual progress indicator.
- **Custom Additions**: Add unlimited mission-specific tasks and checklist items.

### 6. 🗓️ Interactive Monthly Travel Calendar
- **Zero API Calendar**: 100% pure vanilla JS monthly calendar.
- **Multi-Day Visualization**: Color-coded mission pills spanning scheduled dates.
- **Interactive Navigation**: Prev, Next, Today controls with instant detail view on click.

### 7. 📝 Field Visit Reports & Documentation
- **Official Mission Summaries**: Document accomplishments, key findings, problems encountered, and follow-up recommendations.
- **Rating & Photo Gallery**: 1–5 star mission evaluation and locally stored field photos.
- **Print & PDF Ready**: Built-in print/export styling for official filing.

### 8. 🎯 Dynamic Trip Readiness Score
- Dynamically calculated (0% to 100%):
  - 0–39%: **Not Ready** (Red)
  - 40–69%: **In Progress** (Amber)
  - 70–89%: **Almost Ready** (Sky Blue)
  - 90–100%: **Ready** (Emerald Green)

### 9. 💡 Smart "What Should We Plan Next?" Recommender
- **100% Offline Rule-Based Advisor**: Evaluates candidate trips based on available budget, trip duration, priority preference, and purpose focus.
- **Scoring & Tailored Reasons**: Outputs match percentage with transparent criteria explanation.

### 10. 🌐 Bilingual Support (English & বাংলা)
- Instant real-time language switcher (`EN` | `বাং`).
- Complete localization for all navigation, headings, buttons, tooltips, dialogs, status badges, and empty states.

### 11. 💾 Offline-First LocalStorage & Data Management
- Complete browser persistence across reloads.
- **Export Backup (JSON)** & **Import Backup (JSON)** for easy data transfer.
- **Reset Demo Data** option with realistic organizational samples.
- **Clear All Local Data** with safety confirmation dialog.

---

## 🚀 Running Locally

Simply open [`index.html`](file:///e:/Dream%20Places%20list/index.html) directly in any modern web browser or start a local static server:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js
npx serve .
```

Visit `http://localhost:8080` in your browser.

---

## 🧪 Automated Testing & Validation

Run the built-in validation and logic tests:

```bash
# Validate HTML structure, references, and element IDs
node validate.js

# Run business logic and test suite
node test-logic.js
```
