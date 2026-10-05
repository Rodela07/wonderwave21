<<<<<<< HEAD
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
=======
# Wanderlust — Dream it. Plan it. Go. ✈️

A modern, elegant, and responsive travel planning application, bucket list manager, budget calculator, itinerary builder, packing checklist, and memory journal built with Vanilla HTML5, CSS3, and JavaScript (ES6+).

---

## 🌟 Features

### 1. 🏠 Interactive Dashboard
- **Live Statistics**: Dynamic counters for Dream Destinations, Total Countries, Planned Trips, Visited Places, and Total Planned Budget.
- **Featured Upcoming Trip**: Highlights your soonest scheduled adventure with days countdown and real-time Travel Readiness percentage score.
- **Recent Destinations**: Quick overview of recently added destinations with direct links.

### 2. 🌍 Dream Destinations & Wishlist
- **Full CRUD Management**: Add, view, edit, and delete destinations with confirmation modals.
- **Comprehensive Fields**: Destination Name, Country, Personal Note, Status (Dream, Planning, Upcoming, Visited), Priority (High, Medium, Low), Planned Travel Date, Duration in Days, Number of Travelers, Mood/Vibe Tags, Cover Photo, and Favorite status.
- **Search & Multi-Filters**: Real-time search across destination names and countries, combined with Status filters (All, Dream, Planning, Upcoming, Visited, Favorites) and Priority filters (All, High, Medium, Low), with a one-click **Clear Filters** button.

### 3. 📷 Photo Feature
- **Upload Cover Photo**: Local image upload with client-side canvas compression to maximize storage efficiency.
- **URL & Preview**: Instant preview with option to remove, replace, or view fullscreen.
- **Graceful Fallbacks**: Smart destination/country emoji placeholders when no photo is provided.

### 4. 💰 Travel Budget Planner
- **7 Breakdown Categories**: Flight, Accommodation, Food, Transport, Activities, Shopping, and Other.
- **Automated Calculations**: Live auto-calculating Estimated Total.
- **User Budget Comparison**: Enter "My Budget" to immediately calculate remaining funds (`🟢 Remaining`) or budget overruns (`🔴 Over budget`).

### 5. 🗓️ Day-by-Day Itinerary Builder
- **Flexible Scheduling**: Add new days and activities for each trip.
- **Full Inline Editing**: Edit activities inline, remove activities, and delete days.

### 6. 🎒 Packing Checklist
- **8 Pre-Populated Essentials**: Passport, Clothes, Charger, Medicine, Toiletries, Travel documents, Wallet, and Shoes.
- **Custom Additions**: Add unlimited custom items.
- **Interactive Check & Progress**: Live completion counter (e.g. `6 / 8 completed`) and animated progress bar.

### 7. 🎯 Dynamic Travel Readiness Score
- **Calculated Readiness**: Scores readiness (0%–100%) dynamically based on:
  - Destination & Country
  - Planned Travel Date
  - Budget Estimate
  - Trip Itinerary created
  - Packing Checklist started
  - Trip duration and travelers count

### 8. ✨ "Where Should I Go?" Smart Recommender
- **Interactive Questionnaire**: Match based on Budget, Trip Duration, and Mood/Vibes.
- **Real Saved Data Comparison**: Matches preferences against saved destinations and outputs match percentage and tailored reasons.

### 9. 📝 Visited Adventures & Memories Journal
- **Trip Journaling**: 1–5 star ratings, memorable highlights, things you liked, visit dates, and "Would visit again" recommendations.
- **Dedicated Memories Page**: Beautiful gallery showcasing past adventures.

### 10. 💾 LocalStorage Persistence
- Complete data persistence in the browser's `localStorage` across refreshes.
- Populated with realistic sample destinations on first launch.
>>>>>>> 79318aa65e937bc622c3546a5d318ec80769412d

---

## 🚀 Running Locally

<<<<<<< HEAD
Simply open [`index.html`](file:///e:/Dream%20Places%20list/index.html) directly in any modern web browser or start a local static server:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js
npx serve .
```

=======
### Option 1: Direct File
Simply double-click [`index.html`](file:///e:/Dream%20Places%20list/index.html) or open it in any modern browser.

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 8080
```
Or using Node.js `npx`:
```bash
npx serve .
```
>>>>>>> 79318aa65e937bc622c3546a5d318ec80769412d
Visit `http://localhost:8080` in your browser.

---

<<<<<<< HEAD
## 🧪 Automated Testing & Validation

Run the built-in validation and logic tests:

```bash
# Validate HTML structure, references, and element IDs
node validate.js

# Run business logic and test suite
node test-logic.js
=======
## 🌐 Deploying to Netlify

This project is a 100% static client-side web application with relative paths and zero build configuration needed.

### Steps to Deploy:
1. **Netlify Drag & Drop**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the entire project folder into the upload box.
   - Your site will go live immediately with a public URL!

2. **Netlify via GitHub**:
   - Push this repository to GitHub.
   - In Netlify, click **"Add new site"** → **"Import an existing project"** → **GitHub**.
   - Select your repository.
   - Leave Build command **empty** and Publish directory as **`.`** (root).
   - Click **Deploy Site**.

---

## 🧪 Automated Testing

To run the automated validation and test suites:

```bash
# Static syntax and DOM element validation
node validate.js

# Logic and unit tests
node test-logic.js

# Full end-to-end browser test in headless Chrome
node test-e2e.js
```

---

## 📁 Project Structure

```
.
├── index.html        # Main HTML5 entry point with semantic layout and modals
├── style.css         # Complete design system, typography, and responsive CSS
├── app.js            # Core application logic, event delegation, and state store
├── .gitignore        # Standard git ignore rules
├── validate.js       # Static validation script
├── test-logic.js     # Unit test suite
├── test-e2e.js       # End-to-end automated browser test script
└── README.md         # Documentation
>>>>>>> 79318aa65e937bc622c3546a5d318ec80769412d
```
