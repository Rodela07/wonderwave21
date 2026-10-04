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

---

## 🚀 Running Locally

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
Visit `http://localhost:8080` in your browser.

---

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
```
