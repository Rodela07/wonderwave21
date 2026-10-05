/**
 * WanderWise — Organization Travel & Field Visit Planner
 * Vanilla JavaScript (ES6+), Offline-First, LocalStorage Powered
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONSTANTS & LOCALIZATION DICTIONARIES
  // ==========================================================================
  const STORAGE_KEYS = {
    TRIPS: 'wanderwise_trips',
    SETTINGS: 'wanderwise_settings',
    ACTIVITIES: 'wanderwise_activities'
  };

  const PRESET_COVERS = [
    { name: 'Community Field', emoji: '🌾', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230369a1"/></linearGradient></defs><rect width="600" height="300" fill="url(%23g)"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23ffffff">🌾</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="%23ffffff" opacity="0.9">Community &amp; Field Visit</text></svg>' },
    { name: 'Inspection', emoji: '🔍', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230d9488"/><stop offset="100%" stop-color="%230f766e"/></linearGradient></defs><rect width="600" height="300" fill="url(%23g)"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23ffffff">🔍</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="%23ffffff" opacity="0.9">Project &amp; Technical Inspection</text></svg>' },
    { name: 'Emergency Relief', emoji: '🚨', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23e11d48"/><stop offset="100%" stop-color="%23be123c"/></linearGradient></defs><rect width="600" height="300" fill="url(%23g)"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23ffffff">🚨</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="%23ffffff" opacity="0.9">Emergency &amp; Disaster Response</text></svg>' },
    { name: 'Survey / Data', emoji: '📊', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237c3aed"/><stop offset="100%" stop-color="%236d28d9"/></linearGradient></defs><rect width="600" height="300" fill="url(%23g)"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23ffffff">📊</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="%23ffffff" opacity="0.9">Field Survey &amp; Research</text></svg>' },
    { name: 'Workshop', emoji: '👥', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23d97706"/><stop offset="100%" stop-color="%23b45309"/></linearGradient></defs><rect width="600" height="300" fill="url(%23g)"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23ffffff">👥</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="%23ffffff" opacity="0.9">Workshop &amp; Community Training</text></svg>' }
  ];

  const BUDGET_CATEGORIES = [
    { key: 'transportation', labelEn: 'Transportation', labelBn: 'যাতায়াত / পরিবহন' },
    { key: 'accommodation', labelEn: 'Accommodation', labelBn: 'আবাসন / হোটেল' },
    { key: 'food', labelEn: 'Food & Meals', labelBn: 'খাবার ও নাস্তা' },
    { key: 'localTransport', labelEn: 'Local Transport', labelBn: 'স্থানীয় যাতায়াত' },
    { key: 'activities', labelEn: 'Activities & Meetings', labelBn: 'কার্যক্রম ও মিটিং' },
    { key: 'materials', labelEn: 'Field Materials', labelBn: 'মাঠ পর্যায়ের সরঞ্জাম' },
    { key: 'emergency', labelEn: 'Emergency Contingency', labelBn: 'জরুরি তহবিল' },
    { key: 'other', labelEn: 'Other Miscellaneous', labelBn: 'অন্যান্য বিবিধ' }
  ];

  const DEFAULT_CHECKLIST_TEMPLATE = [
    { category: 'Documents', text: 'Organization ID & Mission Travel Authorization' },
    { category: 'Documents', text: 'Local District / Police Notification Permits' },
    { category: 'Documents', text: 'Printed Terms of Reference (TOR) & Questionnaire' },
    { category: 'Equipment', text: 'Field Laptop & Charger' },
    { category: 'Equipment', text: 'Camera / High-Res Smartphone with GPS tag' },
    { category: 'Equipment', text: 'Power Banks (20,000mAh+) & Multi-pin adapter' },
    { category: 'Field Materials', text: 'Survey Clipboards & Weatherproof Notebooks' },
    { category: 'Field Materials', text: 'Sign-in Attendance Sheets & Official Seals' },
    { category: 'Safety', text: 'Organization First-Aid Box & Basic Medicine kit' },
    { category: 'Safety', text: 'Emergency Contacts Card (Local Hospital & Police)' }
  ];

  const I18N = {
    en: {
      tagline: 'Plan better. Travel prepared.',
      navDashboard: 'Dashboard',
      navTrips: 'Trips',
      navCalendar: 'Calendar',
      navBudget: 'Budget',
      navChecklist: 'Checklist',
      navReports: 'Reports',
      navSettings: 'Settings',
      btnSmartPlan: 'Smart Plan',
      btnAddTrip: 'New Trip',
      heroBadge: 'Organization Field Operations & Trip Portal',
      dashGreeting: 'Welcome to',
      dashSubtitle: 'Coordinate missions, track team logistics, manage travel budgets, and monitor field readiness in real-time.',
      dashWhatNext: 'What should we plan next?',
      statTotalTrips: 'Total Trips',
      statUpcomingTrips: 'Upcoming Trips',
      statCompletedTrips: 'Completed Trips',
      statHighPriority: 'High Priority',
      statPlannedBudget: 'Total Planned Budget',
      statAvgReadiness: 'Average Readiness',
      statViewAll: 'View all →',
      statFilter: 'Filter →',
      statReports: 'View reports →',
      statUrgent: 'Urgent visits →',
      statBudgetPlanner: 'Open Budget →',
      statPreparedness: 'Preparedness score',
      dashUpcomingVisitsTitle: 'Upcoming Field Visits',
      dashRecentActivityTitle: 'Recent Activity',
      btnViewAllTrips: 'View All Trips →',
      btnClearActivity: 'Clear',
      tripsTitle: 'Trips & Field Visits',
      tripsSubtitle: 'Search, filter, and track all organizational missions and journeys.',
      searchPlaceholder: 'Search trips by name, location, purpose, or department...',
      sortLabel: 'Sort by:',
      sortNewest: 'Newest First',
      sortOldest: 'Oldest First',
      sortDate: 'Travel Date (Soonest)',
      sortPriority: 'Priority (High to Low)',
      sortBudget: 'Budget (High to Low)',
      sortReadiness: 'Readiness Score',
      filterAll: 'All Trips',
      filterPlanned: 'Planned',
      filterPreparing: 'Preparing',
      filterUpcoming: 'Upcoming',
      filterCompleted: 'Completed',
      filterCancelled: 'Cancelled',
      filterHighPriority: 'High Priority',
      filterFavorites: 'Favorites',
      emptyTripsTitle: 'No trips found',
      emptyTripsDesc: 'Try adjusting your filters, search term, or create a new field trip.',
      calTitle: 'Mission & Travel Calendar',
      calSubtitle: 'View scheduled departures, field missions, and return dates.',
      calPrev: 'Prev',
      calToday: 'Today',
      calNext: 'Next',
      statusPlanned: 'Planned',
      statusPreparing: 'Preparing',
      statusUpcoming: 'Upcoming',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
      priorityHigh: 'High Priority',
      priorityMedium: 'Medium Priority',
      priorityLow: 'Low Priority',
      budgetTitle: 'Budget & Expense Planner',
      budgetSubtitle: 'Analyze projected travel estimates vs actual expenditure across all operational categories.',
      budgetSelectTrip: 'Select Trip:',
      budgetAllTrips: 'All Organization Trips (Aggregate)',
      budgetTotalEst: 'Total Estimated',
      budgetTotalAct: 'Total Actual Spend',
      budgetRemaining: 'Remaining Balance',
      budgetSpendRate: 'Budget Utilization',
      budgetProjectedTarget: 'Projected Target',
      budgetLoggedSpend: 'Logged Expenses',
      budgetCategoryBreakdown: 'Category Breakdown',
      budgetCategoryDesc: '8 Standard Organizational Cost Heads',
      budgetUpdateHeading: 'Update Category Expenses',
      budgetEditorDesc: 'Set estimates and actuals for the selected trip',
      btnSaveBudget: 'Save Budget Updates',
      checklistTitle: 'Field Readiness Checklist',
      checklistSubtitle: 'Standardized mission packing, safety protocols, equipment, and documents.',
      checklistSelectTrip: 'Trip:',
      checklistPreparation: 'Preparation:',
      chkItemPlaceholder: 'Add custom item (e.g. Field GPS Unit, Water Purification Tabs)...',
      catDocuments: 'Documents',
      catEquipment: 'Equipment',
      catFieldMaterials: 'Field Materials',
      catSafety: 'Safety & Health',
      catOther: 'Other',
      btnAddItem: 'Add Item',
      reportsTitle: 'Field Visit Reports',
      reportsSubtitle: 'Completed mission summaries, key findings, photo documentation, and follow-up actions.',
      btnCreateReport: 'Create Visit Report',
      emptyReportsTitle: 'No Visit Reports Yet',
      emptyReportsDesc: 'When field trips are completed, generate official visit reports with key findings, photos, and follow-up actions.',
      settingsTitle: 'System Settings & Data',
      settingsSubtitle: 'Configure preferences, currency symbols, and manage browser storage.',
      prefHeading: 'Localization & Preferences',
      prefLanguage: 'Language',
      prefLangHint: 'Switch interface language between English and Bangla.',
      prefCurrency: 'Currency Symbol',
      prefCurrencyHint: 'Choose the currency symbol used across budget calculations.',
      dataHeading: 'Data Management & Backup',
      dataStorage: 'Browser Storage Status',
      btnExportBackup: 'Export Backup (JSON)',
      btnImportBackup: 'Import Backup',
      btnResetDemo: 'Reset Demo Data',
      btnClearAllData: 'Clear All Local Data',
      aboutHeading: 'About WanderWise',
      aboutText: 'WanderWise is an offline-first organizational travel and field visit management platform designed for NGOs, emergency response units, inspection agencies, and project teams. Built with zero dependencies, 100% vanilla HTML5/CSS3/JavaScript, and browser localStorage.',
      modalAddTripTitle: 'Add New Trip / Field Visit',
      modalEditTripTitle: 'Edit Trip / Field Visit',
      modalAddTripSubtitle: 'Plan logistics, assign department, and allocate budget.',
      formTripName: 'Trip / Visit Name',
      formLocation: 'Location / District',
      formCountry: 'Country / Region',
      formPurpose: 'Purpose of Visit',
      formOrganization: 'Organization / Department',
      formStartDate: 'Start Date',
      formEndDate: 'End Date',
      formStatus: 'Trip Status',
      formPriority: 'Priority Level',
      formParticipants: 'Number of Participants',
      formBudget: 'Estimated Total Budget',
      formDescription: 'Description & Objectives',
      formNotes: 'Operational Notes & Accommodation Details',
      formCoverImage: 'Cover Image',
      btnUploadPhoto: 'Upload Local Photo',
      btnRemovePhoto: 'Remove',
      orSelectPreset: 'Or select an organizational preset:',
      btnCancel: 'Cancel',
      btnSaveTrip: 'Save Trip',
      tabOverview: 'Overview',
      tabTeam: 'Team & Roles',
      tabBudget: 'Budget Summary',
      tabItinerary: 'Itinerary',
      tabChecklist: 'Checklist',
      tabReport: 'Visit Report',
      overviewPurposeTitle: 'Mission Purpose & Scope',
      overviewLogisticsTitle: 'Logistics & Operational Notes',
      ovTeamSize: 'Team Size',
      ovPlannedBudget: 'Planned Budget',
      ovDuration: 'Duration',
      ovStatus: 'Current Status',
      teamAddMemberTitle: 'Add Team Member',
      formMemberName: 'Name',
      formMemberRole: 'Role / Designation',
      formMemberContact: 'Contact Note',
      btnAddMember: 'Add Member',
      teamRosterTitle: 'Mission Team Roster',
      btnOpenBudgetModule: 'Manage Full Category Expenses →',
      itinAddScheduleTitle: 'Schedule Itinerary Activity',
      formItinDay: 'Day Number',
      formItinTime: 'Time / Slot',
      formItinLocation: 'Location / Venue',
      formItinActivity: 'Activity / Agenda',
      formItinResponsible: 'Responsible Lead',
      btnAddActivity: 'Add Activity',
      itinScheduleTitle: 'Day-by-Day Itinerary',
      btnOpenChecklistModule: 'Open Master Checklist →',
      btnEditTrip: 'Edit Trip',
      btnDuplicateTrip: 'Duplicate',
      btnMarkCompleted: 'Mark Completed',
      btnMarkPlanned: 'Revert to Planned',
      btnDelete: 'Delete',
      btnClose: 'Close',
      modalReportTitle: 'Field Visit & Mission Report',
      modalReportSubtitle: 'Document key findings, accomplishments, challenges, and follow-ups.',
      formReportTrip: 'Associated Trip / Visit',
      formReportRating: 'Mission Success Rating',
      formReportSummary: 'Executive Summary',
      formReportAccomplished: 'What Was Accomplished',
      formReportFindings: 'Key Findings & Observations',
      formReportProblems: 'Problems & Challenges Encountered',
      formReportFollowup: 'Follow-up Actions & Recommendations',
      formReportNotes: 'General Notes',
      formReportPhotos: 'Field Photos (Stored locally)',
      btnAddPhotos: 'Add Photo',
      btnSaveReport: 'Save Report',
      btnPrintReport: 'Print / Export',
      smartBadge: 'Rule-Based Advisor',
      smartModalHeading: 'What Should We Plan Next?',
      smartModalSub: 'Find the most optimal field visit based on budget, duration, urgency, and purpose.',
      smartBudget: 'Available Budget',
      smartDuration: 'Trip Duration (Max Days)',
      smartPriority: 'Preferred Priority',
      smartPurpose: 'Visit Purpose Focus',
      optAny: 'Any Priority',
      optAnyPurpose: 'Any Purpose',
      optFieldVisit: 'Field Visit',
      optInspection: 'Inspection',
      optNgoCommunity: 'NGO / Community Visit',
      optBusinessTrip: 'Business Trip',
      optProjectVisit: 'Project Visit',
      optMeeting: 'Meeting / Conference',
      optEvent: 'Event / Workshop',
      optSurvey: 'Survey / Data Collection',
      optDisasterResponse: 'Disaster Response',
      optTraining: 'Training',
      btnFindRecommendations: 'Analyze & Recommend Trip',
      smartResultsHeading: 'Recommended Field Mission',
      btnConfirm: 'Confirm',
      readinessNotReady: 'Not Ready',
      readinessInProgress: 'In Progress',
      readinessAlmostReady: 'Almost Ready',
      readinessReady: 'Ready',
      confirmDeleteTrip: 'Are you sure you want to delete this trip? All associated itinerary, budget, and report data will be removed.',
      confirmClearData: 'WARNING: This will erase all trips, logs, and custom settings from your browser storage. Proceed?',
      confirmResetDemo: 'This will reset your data to the default sample organizational field visits. Continue?'
    },
    bn: {
      tagline: 'পরিকল্পনা হোক নির্ভুল। প্রস্তুতি হোক সম্পন্ন।',
      navDashboard: 'ড্যাশবোর্ড',
      navTrips: 'সফরসমূহ',
      navCalendar: 'ক্যালেন্ডার',
      navBudget: 'বাজেট',
      navChecklist: 'চেকলিস্ট',
      navReports: 'রিপোর্ট',
      navSettings: 'সেটিংস',
      btnSmartPlan: 'স্মার্ট প্ল্যানার',
      btnAddTrip: 'নতুন সফর',
      heroBadge: 'প্রাতিষ্ঠানিক ফিল্ড অপারেশন ও সফর পোর্টাল',
      dashGreeting: 'স্বাগতম',
      dashSubtitle: 'মিশন সমন্বয়, টিম ট্র্যাকিং, ভ্রমণ বাজেট ব্যবস্থাপনা এবং রিয়েল-টাইমে ফিল্ড প্রস্তুতি পর্যবেক্ষণ করুন।',
      dashWhatNext: 'পরবর্তী কোন সফরটি পরিকল্পনা করা উচিত?',
      statTotalTrips: 'মোট সফর',
      statUpcomingTrips: 'আসন্ন সফর',
      statCompletedTrips: 'সম্পন্ন সফর',
      statHighPriority: 'উচ্চ অগ্রাধিকার',
      statPlannedBudget: 'পরিকল্পিত বাজেট',
      statAvgReadiness: 'গড় প্রস্তুতি',
      statViewAll: 'সব দেখুন →',
      statFilter: 'ফিল্টার →',
      statReports: 'রিপোর্ট দেখুন →',
      statUrgent: 'জরুরি সফর →',
      statBudgetPlanner: 'বাজেট দেখুন →',
      statPreparedness: 'প্রস্তুতির হার',
      dashUpcomingVisitsTitle: 'আসন্ন মাঠ পর্যায় পরিদর্শন',
      dashRecentActivityTitle: 'সাম্প্রতিক কার্যক্রম',
      btnViewAllTrips: 'সকল সফর দেখুন →',
      btnClearActivity: 'মুছুন',
      tripsTitle: 'সফর ও ফিল্ড ভিজিট',
      tripsSubtitle: 'প্রতিষ্ঠানের সকল মিশন এবং ফিল্ড ভিজিট খুঁজুন, ফিল্টার ও পরিচালনা করুন।',
      searchPlaceholder: 'নাম, স্থান, উদ্দেশ্য বা বিভাগ দিয়ে সফর খুঁজুন...',
      sortLabel: 'সাজান:',
      sortNewest: 'নতুনগুলো আগে',
      sortOldest: 'পুরাতনগুলো আগে',
      sortDate: 'ভ্রমণ তারিখ (নিকটবর্তী)',
      sortPriority: 'অগ্রাধিকার (উচ্চ থেকে কম)',
      sortBudget: 'বাজেট (বেশি থেকে কম)',
      sortReadiness: 'প্রস্তুতি স্কোর',
      filterAll: 'সকল সফর',
      filterPlanned: 'পরিকল্পিত',
      filterPreparing: 'প্রস্তুতি চলছে',
      filterUpcoming: 'আসন্ন',
      filterCompleted: 'সম্পন্ন',
      filterCancelled: 'বাতিল',
      filterHighPriority: 'উচ্চ অগ্রাধিকার',
      filterFavorites: 'প্রিয় তালিকা',
      emptyTripsTitle: 'কোন সফর পাওয়া যায়নি',
      emptyTripsDesc: 'ফিল্টার বা সার্চ পরিবর্তন করে দেখুন অথবা একটি নতুন ফিল্ড সফর যোগ করুন।',
      calTitle: 'মিশন ও ভ্রমণ ক্যালেন্ডার',
      calSubtitle: 'নির্ধারিত যাত্রা, ফিল্ড মিশন ও ফেরার তারিখ পর্যবেক্ষণ করুন।',
      calPrev: 'পূর্ববর্তী',
      calToday: 'আজ',
      calNext: 'পরবর্তী',
      statusPlanned: 'পরিকল্পিত',
      statusPreparing: 'প্রস্তুতি চলছে',
      statusUpcoming: 'আসন্ন',
      statusCompleted: 'সম্পন্ন',
      statusCancelled: 'বাতিল',
      priorityHigh: 'উচ্চ অগ্রাধিকার',
      priorityMedium: 'মাঝারি অগ্রাধিকার',
      priorityLow: 'কম অগ্রাধিকার',
      budgetTitle: 'বাজেট ও ব্যয় পরিকল্পনাকারী',
      budgetSubtitle: 'সকল পরিচালনা খাতের আনুমানিক লক্ষ্যমাত্রা বনাম প্রকৃত ব্যয়ের বিশ্লেষণ।',
      budgetSelectTrip: 'সফর নির্বাচন করুন:',
      budgetAllTrips: 'সকল সফর (একত্রিত হিসাব)',
      budgetTotalEst: 'মোট আনুমানিক',
      budgetTotalAct: 'মোট প্রকৃত খরচ',
      budgetRemaining: 'অবশিষ্ট ব্যালেন্স',
      budgetSpendRate: 'বাজেট ব্যবহার হার',
      budgetProjectedTarget: 'পরিকল্পিত লক্ষ্যমাত্রা',
      budgetLoggedSpend: 'নথিভুক্ত খরচ',
      budgetCategoryBreakdown: 'খাতভিত্তিক বিভাজন',
      budgetCategoryDesc: '৮টি প্রাতিষ্ঠানিক প্রমিত খরচ খাত',
      budgetUpdateHeading: 'খাতভিত্তিক ব্যয় আপডেট',
      budgetEditorDesc: 'নির্বাচিত সফরের জন্য আনুমানিক ও প্রকৃত খরচ নির্ধারণ করুন',
      btnSaveBudget: 'বাজেট সংরক্ষণ করুন',
      checklistTitle: 'ফিল্ড প্রস্তুতি চেকলিস্ট',
      checklistSubtitle: 'প্রমিত মিশন প্যাকিং, নিরাপত্তা প্রটোকল, সরঞ্জাম ও ডকুমেন্ট।',
      checklistSelectTrip: 'সফর:',
      checklistPreparation: 'প্রস্তুতি:',
      chkItemPlaceholder: 'কাস্টম আইটেম যোগ করুন (যেমন: জিপিএস মিটার, পানি বিশুদ্ধকরণ ট্যাবলেট)...',
      catDocuments: 'ডকুমেন্টস ও অনুমতিপত্র',
      catEquipment: 'ডিজিটাল ও ফিল্ড সরঞ্জাম',
      catFieldMaterials: 'মাঠের তথ্য ও সামগ্রী',
      catSafety: 'স্বাস্থ্য ও নিরাপত্তা',
      catOther: 'অন্যান্য',
      btnAddItem: 'আইটেম যোগ করুন',
      reportsTitle: 'ফিল্ড ভিজিট রিপোর্ট',
      reportsSubtitle: 'সম্পন্ন হওয়া মিশনের সারসংক্ষেপ, প্রধান তথ্য, ছবি ও ভবিষ্যৎ করণীয়।',
      btnCreateReport: 'ভিজিট রিপোর্ট তৈরি করুন',
      emptyReportsTitle: 'এখনও কোন রিপোর্ট নেই',
      emptyReportsDesc: 'ফিল্ড সফর সম্পন্ন হলে প্রধান পর্যবেক্ষণ, ছবি ও ফলাফল সহ প্রাতিষ্ঠানিক রিপোর্ট তৈরি করুন।',
      settingsTitle: 'সিস্টেম সেটিংস ও ডাটা',
      settingsSubtitle: 'ভাষা ও কারেন্সি পছন্দ কনফিগার করুন এবং ব্রাউজার ডাটা পরিচালনা করুন।',
      prefHeading: 'ভাষা ও আঞ্চলিক সেটিংস',
      prefLanguage: 'ভাষা (Language)',
      prefLangHint: 'ইংরেজি ও বাংলার মধ্যে ইন্টারফেসের ভাষা পরিবর্তন করুন।',
      prefCurrency: 'মুদ্রা প্রতীক (Currency)',
      prefCurrencyHint: 'বাজেট গণনার জন্য ব্যবহৃত মুদ্রা প্রতীক নির্বাচন করুন।',
      dataHeading: 'ডাটা ব্যবস্থাপনা ও ব্যাকআপ',
      dataStorage: 'ব্রাউজার মেমোরি স্ট্যাটাস',
      btnExportBackup: 'ব্যাকআপ ডাউনলোড (JSON)',
      btnImportBackup: 'ব্যাকআপ আপলোড',
      btnResetDemo: 'ডেমো ডাটা রিসেট',
      btnClearAllData: 'সকল লোকাল ডাটা মুছুন',
      aboutHeading: 'WanderWise সম্পর্কে',
      aboutText: 'WanderWise একটি অফলাইন-ফার্স্ট প্রাতিষ্ঠানিক ফিল্ড ভিজিট ও ভ্রমণ ব্যবস্থাপনা সিস্টেম। কোনো সার্ভার বা গোপন তথ্যের প্রয়োজন নেই, সম্পূর্ণ ব্রাউজারে নিরাপদভাবে কাজ করে।',
      modalAddTripTitle: 'নতুন সফর / ফিল্ড ভিজিট যোগ করুন',
      modalEditTripTitle: 'সফর সম্পাদনা করুন',
      modalAddTripSubtitle: 'লজিস্টিক পরিকল্পনা, টিম নির্ধারণ ও বাজেট বরাদ্দ করুন।',
      formTripName: 'সফর / ভিজিটের নাম',
      formLocation: 'স্থান / জেলা',
      formCountry: 'দেশ / অঞ্চল',
      formPurpose: 'সফরের উদ্দেশ্য',
      formOrganization: 'প্রতিষ্ঠান / বিভাগ',
      formStartDate: 'শুরুর তারিখ',
      formEndDate: 'শেষের তারিখ',
      formStatus: 'সফরের স্ট্যাটাস',
      formPriority: 'অগ্রাধিকার মাত্রা',
      formParticipants: 'অংশগ্রহণকারীর সংখ্যা',
      formBudget: 'মোট আনুমানিক বাজেট',
      formDescription: 'উদ্দেশ্য ও বিস্তারিত বিবরণ',
      formNotes: 'লজিস্টিক ও থাকার ব্যবস্থা সংক্রান্ত নোট',
      formCoverImage: 'কভার ছবি',
      btnUploadPhoto: 'লোকাল ছবি আপলোড',
      btnRemovePhoto: 'মুছুন',
      orSelectPreset: 'অথবা প্রাতিষ্ঠানিক প্রিসেট নির্বাচন করুন:',
      btnCancel: 'বাতিল',
      btnSaveTrip: 'সফর সংরক্ষণ করুন',
      tabOverview: 'সারসংক্ষেপ',
      tabTeam: 'টিম ও দায়িত্ব',
      tabBudget: 'বাজেট বিবরণী',
      tabItinerary: 'কর্মসূচি (ইটিনেরারি)',
      tabChecklist: 'চেকলিস্ট',
      tabReport: 'ভিজিট রিপোর্ট',
      overviewPurposeTitle: 'মিশনের উদ্দেশ্য ও ব্যাপ্তি',
      overviewLogisticsTitle: 'লজিস্টিক ও ফিল্ড নোট',
      ovTeamSize: 'টিম আকার',
      ovPlannedBudget: 'পরিকল্পিত বাজেট',
      ovDuration: 'স্থায়িত্ব',
      ovStatus: 'বর্তমান অবস্থা',
      teamAddMemberTitle: 'টিম সদস্য যোগ করুন',
      formMemberName: 'নাম',
      formMemberRole: 'পদবি / দায়িত্ব',
      formMemberContact: 'যোগাযোগ নোট',
      btnAddMember: 'সদস্য যোগ করুন',
      teamRosterTitle: 'মিশন টিম রোস্টার',
      btnOpenBudgetModule: 'পূর্ণাঙ্গ বাজেট মডিউলে যান →',
      itinAddScheduleTitle: 'কর্মসূচি শিডিউল যোগ করুন',
      formItinDay: 'দিন নম্বর',
      formItinTime: 'সময় / স্লট',
      formItinLocation: 'স্থান / ভেন্যু',
      formItinActivity: 'কার্যক্রম / কর্মসূচি',
      formItinResponsible: 'দায়িত্বপ্রাপ্ত ব্যক্তি',
      btnAddActivity: 'কার্যক্রম যোগ করুন',
      itinScheduleTitle: 'দিনভিত্তিক সফর কর্মসূচি',
      btnOpenChecklistModule: 'মাস্টার চেকলিস্টে যান →',
      btnEditTrip: 'সম্পাদনা',
      btnDuplicateTrip: 'অনুলিপি (ডুপ্লিকেট)',
      btnMarkCompleted: 'সম্পন্ন চিহ্নিত করুন',
      btnMarkPlanned: 'পরিকল্পিত অবস্থায় ফিরিয়ে নিন',
      btnDelete: 'মুছে ফেলুন',
      btnClose: 'বন্ধ করুন',
      modalReportTitle: 'ফিল্ড ভিজিট ও মিশন রিপোর্ট',
      modalReportSubtitle: 'মিশনের অর্জন, মূল পর্যবেক্ষণ, সমস্যা ও ভবিষ্যৎ করণীয় নথিভুক্ত করুন।',
      formReportTrip: 'সংশ্লিষ্ট সফর',
      formReportRating: 'মিশন সাফল্য রেটিং',
      formReportSummary: 'নির্বাহী সারসংক্ষেপ',
      formReportAccomplished: 'কী কী বাস্তবায়িত হয়েছে',
      formReportFindings: 'মূল পর্যবেক্ষণ ও তথ্য',
      formReportProblems: 'সম্মুখীন হওয়া সমস্যা ও চ্যালেঞ্জ',
      formReportFollowup: 'ভবিষ্যত করণীয় ও সুপারিশ',
      formReportNotes: 'সাধারণ নোট',
      formReportPhotos: 'ফিল্ড ফটো (লোকাল ব্রাউজারে সংরক্ষিত)',
      btnAddPhotos: 'ছবি যোগ করুন',
      btnSaveReport: 'রিপোর্ট সংরক্ষণ করুন',
      btnPrintReport: 'প্রিন্ট / এক্সপোর্ট',
      smartBadge: 'রুল-ভিত্তিক উপদেষ্টা',
      smartModalHeading: 'পরবর্তী কোন সফরটি পরিকল্পনা করা উচিত?',
      smartModalSub: 'বাজেট, সময়সীমা, জরুরি অবস্থা ও উদ্দেশ্যের ভিত্তিতে সেরা সফরটি খুঁজে নিন।',
      smartBudget: 'উপলব্ধ বাজেট',
      smartDuration: 'সর্বোচ্চ সময়সীমা (দিন)',
      smartPriority: 'পছন্দসই অগ্রাধিকার',
      smartPurpose: 'সফরের উদ্দেশ্য ফোকাস',
      optAny: 'যেকোনো অগ্রাধিকার',
      optAnyPurpose: 'যেকোনো উদ্দেশ্য',
      optFieldVisit: 'মাঠ পরিদর্শন',
      optInspection: 'প্রকল্প তদন্ত / পরিদর্শন',
      optNgoCommunity: 'এনজিও / কমিউনিটি সফর',
      optBusinessTrip: 'ব্যবসায়িক সফর',
      optProjectVisit: 'প্রকল্প পরিদর্শন',
      optMeeting: 'সভা / সম্মেলন',
      optEvent: 'ইভেন্ট / ওয়ার্কশপ',
      optSurvey: 'জরিপ / ডাটা সংগ্রহ',
      optDisasterResponse: 'দুর্যোগ প্রতিক্রিয়া',
      optTraining: 'প্রশিক্ষণ',
      btnFindRecommendations: 'বিশ্লেষণ ও সুপারিশ দেখুন',
      smartResultsHeading: 'প্রস্তাবিত ফিল্ড মিশন',
      btnConfirm: 'নিশ্চিত করুন',
      readinessNotReady: 'প্রস্তুত নয়',
      readinessInProgress: 'প্রস্তুতি চলছে',
      readinessAlmostReady: 'প্রায় প্রস্তুত',
      readinessReady: 'সম্পূর্ণ প্রস্তুত',
      confirmDeleteTrip: 'আপনি কি নিশ্চিত যে এই সফরটি মুছে ফেলতে চান? সংশ্লিষ্ট সকল কর্মসূচি ও বাজেট ডাটা মুছে যাবে।',
      confirmClearData: 'সতর্কতা: এটি আপনার ব্রাউজার থেকে সমস্ত সফর ও সেটিংস মুছে ফেলবে। এগিয়ে যাবেন?',
      confirmResetDemo: 'এটি আপনার ডাটাকে ডিফল্ট নমুনা প্রাতিষ্ঠানিক ফিল্ড সফরে পুনরায় সেট করবে। চালিয়ে যাবেন?'
    }
  };

  // ==========================================================================
  // 2. SAMPLE DEMO DATA
  // ==========================================================================
  const SAMPLE_TRIPS = [
    {
      id: 'trip_demo_1',
      name: 'Khulna Community Resilience & Flood Assessment',
      location: 'Dacope & Koyra Upazilas, Khulna',
      country: 'Bangladesh',
      purpose: 'Disaster Response',
      description: 'Post-monsoon embankment assessment, drinking water salinity evaluation, and emergency relief distribution review with local Union Parishad leadership.',
      startDate: '2026-10-18',
      endDate: '2026-10-22',
      priority: 'High',
      status: 'Upcoming',
      participantsCount: 4,
      organization: 'Emergency Relief & Climate Cell',
      estimatedBudget: 1850,
      notes: 'Local speedboat transport reserved via Khulna district hub. Night stay arranged at Upazila Guest House.',
      coverImage: PRESET_COVERS[2].url,
      isFavorite: true,
      createdAt: '2026-10-01T08:30:00.000Z',
      updatedAt: '2026-10-04T12:00:00.000Z',
      team: [
        { id: 'tm_1', name: 'Dr. Shahriar Kabir', role: 'Mission Lead / Hydrologist', contactNote: 'Radio Ch-2 / Ext 401' },
        { id: 'tm_2', name: 'Tasnim Ahmed', role: 'Community Liaison Officer', contactNote: 'Khulna Field Hub' },
        { id: 'tm_3', name: 'Nafis Hossain', role: 'Logistics Coordinator', contactNote: 'Vehicle Driver Direct' },
        { id: 'tm_4', name: 'Dr. Rubina Parvin', role: 'Public Health Specialist', contactNote: 'Medical Supplies' }
      ],
      budget: {
        transportation: { est: 500, act: 480 },
        accommodation: { est: 400, act: 360 },
        food: { est: 300, act: 280 },
        localTransport: { est: 250, act: 240 },
        activities: { est: 150, act: 120 },
        materials: { est: 100, act: 90 },
        emergency: { est: 100, act: 0 },
        other: { est: 50, act: 30 }
      },
      itinerary: [
        { id: 'it_1', day: 1, time: '07:30 AM', location: 'Dhaka to Jessore Airport to Khulna', activity: 'Team departure and road transit to Khulna Base Office', responsible: 'Nafis Hossain', completed: true },
        { id: 'it_2', day: 2, time: '09:00 AM', location: 'Dacope Upazila Embankment', activity: 'Physical survey of cyclone shelters and water points', responsible: 'Dr. Shahriar Kabir', completed: false },
        { id: 'it_3', day: 3, time: '10:00 AM', location: 'Koyra Union Parishad Hall', activity: 'Stakeholder consultation with community leaders & farmers', responsible: 'Tasnim Ahmed', completed: false },
        { id: 'it_4', day: 4, time: '02:00 PM', location: 'Khulna Regional Office', activity: 'Preliminary findings synthesis and debriefing', responsible: 'Dr. Shahriar Kabir', completed: false }
      ],
      checklist: [
        { id: 'ck_1', category: 'Documents', text: 'District Commissioner Mission Clearance Form', completed: true },
        { id: 'ck_2', category: 'Documents', text: 'Official Relief Distribution Authorization', completed: true },
        { id: 'ck_3', category: 'Equipment', text: 'Water Salinity & Turbidity Testing Kit', completed: true },
        { id: 'ck_4', category: 'Equipment', text: 'GPS Handheld Unit & Extra Lithium Batteries', completed: true },
        { id: 'ck_5', category: 'Field Materials', text: 'Waterproof Clipboards & 150 Survey Questionnaires', completed: true },
        { id: 'ck_6', category: 'Safety', text: 'Life Jackets (4 units) & Emergency Medical Trauma Kit', completed: true },
        { id: 'ck_7', category: 'Safety', text: 'Satellite Phone registered with Head Office', completed: false }
      ],
      report: null
    },
    {
      id: 'trip_demo_2',
      name: 'Dhaka Central Project Infrastructure Inspection',
      location: 'Mirpur & Uttara Project Sites, Dhaka',
      country: 'Bangladesh',
      purpose: 'Inspection',
      description: 'Quarterly structural and compliance inspection of vocational training center building sites before Phase 2 handover.',
      startDate: '2026-10-12',
      endDate: '2026-10-14',
      priority: 'High',
      status: 'Preparing',
      participantsCount: 3,
      organization: 'Infrastructure & Engineering Unit',
      estimatedBudget: 600,
      notes: 'Site safety helmets and high-visibility vests required at all times.',
      coverImage: PRESET_COVERS[1].url,
      isFavorite: false,
      createdAt: '2026-09-28T10:00:00.000Z',
      updatedAt: '2026-10-02T15:00:00.000Z',
      team: [
        { id: 'tm_21', name: 'Engr. Mahbubur Rahman', role: 'Lead Civil Engineer', contactNote: 'HQ Engineering' },
        { id: 'tm_22', name: 'Saima Chowdhury', role: 'Safety Compliance Officer', contactNote: 'Quality Cell' },
        { id: 'tm_23', name: 'Tanvir Hasan', role: 'Architectural Inspector', contactNote: 'Site Liaison' }
      ],
      budget: {
        transportation: { est: 120, act: 0 },
        accommodation: { est: 0, act: 0 },
        food: { est: 180, act: 0 },
        localTransport: { est: 100, act: 0 },
        activities: { est: 80, act: 0 },
        materials: { est: 70, act: 0 },
        emergency: { est: 50, act: 0 },
        other: { est: 0, act: 0 }
      },
      itinerary: [
        { id: 'it_21', day: 1, time: '09:30 AM', location: 'Mirpur Sector 11 Site', activity: 'Foundation and electrical wiring audit', responsible: 'Engr. Mahbubur Rahman', completed: false },
        { id: 'it_22', day: 2, time: '10:00 AM', location: 'Uttara Model Town Site', activity: 'Fire exit and accessibility standards inspection', responsible: 'Saima Chowdhury', completed: false }
      ],
      checklist: [
        { id: 'ck_21', category: 'Documents', text: 'Approved Blueprint & RAJUK Building Permits', completed: true },
        { id: 'ck_22', category: 'Equipment', text: 'Laser Distance Measurer & Crack Width Gauge', completed: true },
        { id: 'ck_23', category: 'Safety', text: 'Safety Helmets & Steel-Toe Field Boots', completed: false }
      ],
      report: null
    },
    {
      id: 'trip_demo_3',
      name: 'Barishal Primary Healthcare & Community Survey',
      location: 'Bakerganj & Wazirpur, Barishal',
      country: 'Bangladesh',
      purpose: 'Survey',
      description: 'Maternal health access study and baseline nutritional survey across 8 riverine community clinics.',
      startDate: '2026-09-10',
      endDate: '2026-09-16',
      priority: 'Medium',
      status: 'Completed',
      participantsCount: 5,
      organization: 'Community Health Outreach Department',
      estimatedBudget: 2200,
      notes: 'Completed successfully. All survey datasets digitized into central health registry.',
      coverImage: PRESET_COVERS[3].url,
      isFavorite: true,
      createdAt: '2026-08-20T09:00:00.000Z',
      updatedAt: '2026-09-18T16:00:00.000Z',
      team: [
        { id: 'tm_31', name: 'Dr. Nusrat Jahan', role: 'Health Research Lead', contactNote: 'Health Division' },
        { id: 'tm_32', name: 'Kazi Farhan', role: 'Data Enumeration Supervisor', contactNote: 'M&E Team' },
        { id: 'tm_33', name: 'Mitu Akter', role: 'Field Nutritionist', contactNote: 'Clinic Liaison' }
      ],
      budget: {
        transportation: { est: 600, act: 590 },
        accommodation: { est: 500, act: 480 },
        food: { est: 400, act: 395 },
        localTransport: { est: 350, act: 340 },
        activities: { est: 150, act: 145 },
        materials: { est: 100, act: 95 },
        emergency: { est: 50, act: 0 },
        other: { est: 50, act: 45 }
      },
      itinerary: [
        { id: 'it_31', day: 1, time: '08:00 AM', location: 'Dhaka to Barishal Launch Terminal', activity: 'Team water transit and survey orientation', responsible: 'Dr. Nusrat Jahan', completed: true },
        { id: 'it_32', day: 2, time: '09:00 AM', location: 'Bakerganj Clinic Cluster', activity: 'Survey 120 mothers and infants', responsible: 'Kazi Farhan', completed: true },
        { id: 'it_33', day: 4, time: '10:00 AM', location: 'Wazirpur Community Center', activity: 'Clinic staff interview on vaccine refrigeration', responsible: 'Mitu Akter', completed: true }
      ],
      checklist: [
        { id: 'ck_31', category: 'Documents', text: 'Institutional Review Board (IRB) Ethics Approval', completed: true },
        { id: 'ck_32', category: 'Equipment', text: '5 Survey Tablets with Offline Data Collection App', completed: true },
        { id: 'ck_33', category: 'Field Materials', text: 'Mid-Upper Arm Circumference (MUAC) Tapes', completed: true }
      ],
      report: {
        id: 'rep_demo_3',
        visitSummary: 'Successfully completed primary maternal health study across Bakerganj & Wazirpur. 280 households surveyed with 100% completion rate.',
        accomplishments: 'Conducted 280 household interviews, audited 8 community clinic cold-chain facilities, and trained 14 local community health workers.',
        keyFindings: 'Identified that 3 remote island clinics lack continuous solar battery backup for vaccine storage. Overall maternal consultation rate improved by 18% compared to last year.',
        problemsEncountered: 'Heavy tidal rains delayed boat transit on Day 3 by 4 hours; team adjusted evening schedule to finish data entry.',
        followUpActions: '1. Procure 3 high-capacity solar inverter kits for island clinics.\n2. Submit finalized statistical analysis to Directorate General of Health Services by end of October.',
        rating: 5,
        notes: 'Commendable dedication shown by local community volunteers and enumerators.',
        photos: [],
        createdAt: '2026-09-17T14:30:00.000Z'
      }
    },
    {
      id: 'trip_demo_4',
      name: 'Sylhet Eco-Forestry Monitoring & Carbon Survey',
      location: 'Lawachara & Rema-Kalenga, Sylhet',
      country: 'Bangladesh',
      purpose: 'Project Visit',
      description: 'Forest canopy density measurement and biodiversity sensor verification with Forest Department field rangers.',
      startDate: '2026-11-05',
      endDate: '2026-11-09',
      priority: 'Medium',
      status: 'Planned',
      participantsCount: 3,
      organization: 'Environment & Forestry Program',
      estimatedBudget: 1400,
      notes: 'Forest permit approved by Sylhet Divisional Forest Officer.',
      coverImage: PRESET_COVERS[0].url,
      isFavorite: false,
      createdAt: '2026-10-02T11:00:00.000Z',
      updatedAt: '2026-10-02T11:00:00.000Z',
      team: [
        { id: 'tm_41', name: 'Tareq Mansoor', role: 'Ecologist & GIS Specialist', contactNote: 'Sylhet Desk' },
        { id: 'tm_42', name: 'Farzana Karim', role: 'Field Botanist', contactNote: 'Lab Unit' }
      ],
      budget: {
        transportation: { est: 400, act: 0 },
        accommodation: { est: 350, act: 0 },
        food: { est: 250, act: 0 },
        localTransport: { est: 200, act: 0 },
        activities: { est: 100, act: 0 },
        materials: { est: 50, act: 0 },
        emergency: { est: 50, act: 0 },
        other: { est: 0, act: 0 }
      },
      itinerary: [
        { id: 'it_41', day: 1, time: '06:30 AM', location: 'Dhaka to Sreemangal Train', activity: 'Transit and check-in at Forest Rest House', responsible: 'Tareq Mansoor', completed: false }
      ],
      checklist: [
        { id: 'ck_41', category: 'Documents', text: 'DFO Forest Entry & Drone Mapping Permission', completed: true },
        { id: 'ck_42', category: 'Equipment', text: 'Tree Caliper, Densiometer, and Wildlife Trail Cams', completed: false }
      ],
      report: null
    },
    {
      id: 'trip_demo_5',
      name: 'Chattogram Supply Chain & Logistics Review',
      location: 'Port Area & Agrabad, Chattogram',
      country: 'Bangladesh',
      purpose: 'Business Trip',
      description: 'Operational audit of coastal supply chain, warehouse stock rotation, and customs clearance logistics.',
      startDate: '2026-10-25',
      endDate: '2026-10-28',
      priority: 'Low',
      status: 'Planned',
      participantsCount: 2,
      organization: 'Procurement & Supply Logistics',
      estimatedBudget: 950,
      notes: 'Coordination with Port Security Office for visitor passes.',
      coverImage: PRESET_COVERS[1].url,
      isFavorite: false,
      createdAt: '2026-10-03T14:00:00.000Z',
      updatedAt: '2026-10-03T14:00:00.000Z',
      team: [
        { id: 'tm_51', name: 'Zahid Iqbal', role: 'Supply Chain Manager', contactNote: 'Procurement Cell' }
      ],
      budget: {
        transportation: { est: 300, act: 0 },
        accommodation: { est: 300, act: 0 },
        food: { est: 200, act: 0 },
        localTransport: { est: 100, act: 0 },
        activities: { est: 50, act: 0 },
        materials: { est: 0, act: 0 },
        emergency: { est: 0, act: 0 },
        other: { est: 0, act: 0 }
      },
      itinerary: [],
      checklist: [
        { id: 'ck_51', category: 'Documents', text: 'Port Gate Passes & Warehouse Gate Inward Register', completed: true }
      ],
      report: null
    }
  ];

  // ==========================================================================
  // 3. APPLICATION STATE
  // ==========================================================================
  const State = {
    trips: [],
    settings: {
      language: 'en',
      currency: '$',
      theme: 'light'
    },
    activities: [],
    activeSection: 'dashboard',
    currentFilter: 'all',
    searchQuery: '',
    sortMode: 'newest',
    activeTripId: null,
    calMonthDate: new Date(),
    selectedCoverUrl: PRESET_COVERS[0].url,
    reportPhotoStaging: []
  };

  // ==========================================================================
  // 4. STORAGE HELPERS
  // ==========================================================================
  function loadFromStorage() {
    try {
      const storedTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (storedTrips) {
        State.trips = JSON.parse(storedTrips);
      } else {
        State.trips = JSON.parse(JSON.stringify(SAMPLE_TRIPS));
        saveTripsToStorage();
      }

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        State.settings = Object.assign(State.settings, JSON.parse(storedSettings));
      }

      const storedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (storedActivities) {
        State.activities = JSON.parse(storedActivities);
      } else {
        State.activities = [
          { id: 'act_1', title: 'System Initialized', detail: 'Welcome to WanderWise organizational planner', timestamp: new Date().toISOString() }
        ];
        saveActivitiesToStorage();
      }
    } catch (e) {
      console.error('LocalStorage load error, resetting to clean state:', e);
      State.trips = JSON.parse(JSON.stringify(SAMPLE_TRIPS));
    }
  }

  function saveTripsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(State.trips));
    } catch (e) {
      console.error('Failed saving trips to localStorage:', e);
      showToast('Storage quota reached. Please compress or remove large images.', 'error');
    }
  }

  function saveSettingsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(State.settings));
    } catch (e) {
      console.error('Failed saving settings:', e);
    }
  }

  function saveActivitiesToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(State.activities));
    } catch (e) {
      console.error('Failed saving activities:', e);
    }
  }

  function logActivity(title, detail) {
    const act = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title,
      detail: detail,
      timestamp: new Date().toISOString()
    };
    State.activities.unshift(act);
    if (State.activities.length > 50) {
      State.activities.pop();
    }
    saveActivitiesToStorage();
    renderActivityFeed();
  }

  // ==========================================================================
  // 5. LOCALIZATION & TRANSLATION ENGINE
  // ==========================================================================
  function t(key) {
    const lang = State.settings.language || 'en';
    if (I18N[lang] && I18N[lang][key] !== undefined) {
      return I18N[lang][key];
    }
    if (I18N.en && I18N.en[key] !== undefined) {
      return I18N.en[key];
    }
    return key;
  }

  function updateDomTranslations() {
    const lang = State.settings.language || 'en';

    // Update text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text) {
        el.textContent = text;
      }
    });

    // Update placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = t(key);
      if (text) {
        el.setAttribute('placeholder', text);
      }
    });

    // Update language toggle buttons
    const langEnBtn = document.getElementById('langEnBtn');
    const langBnBtn = document.getElementById('langBnBtn');
    const setLangEnBtn = document.getElementById('setLangEnBtn');
    const setLangBnBtn = document.getElementById('setLangBnBtn');

    if (langEnBtn && langBnBtn) {
      langEnBtn.classList.toggle('active', lang === 'en');
      langBnBtn.classList.toggle('active', lang === 'bn');
    }
    if (setLangEnBtn && setLangBnBtn) {
      setLangEnBtn.classList.toggle('btn-primary', lang === 'en');
      setLangEnBtn.classList.toggle('btn-outline', lang !== 'en');
      setLangBnBtn.classList.toggle('btn-primary', lang === 'bn');
      setLangBnBtn.classList.toggle('btn-outline', lang !== 'bn');
    }

    // Update document title & html lang
    document.documentElement.lang = lang;
  }

  function setLanguage(lang) {
    State.settings.language = lang;
    saveSettingsToStorage();
    updateDomTranslations();
    renderAllViews();
    showToast(lang === 'bn' ? 'ভাষা বাংলায় পরিবর্তন করা হয়েছে' : 'Language switched to English', 'info');
  }

  function formatCurrency(amount) {
    const sym = State.settings.currency || '$';
    const num = Number(amount) || 0;
    return sym + num.toLocaleString();
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const lang = State.settings.language === 'bn' ? 'bn-BD' : 'en-US';
      return d.toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  function getStatusBadgeClass(status) {
    return 'status-' + (status || 'Planned');
  }

  function getPriorityBadgeClass(priority) {
    return 'priority-' + (priority || 'Medium');
  }

  function getStatusLabel(status) {
    const key = 'status' + (status || 'Planned');
    return t(key) || status;
  }

  function getPriorityLabel(priority) {
    const key = 'priority' + (priority || 'Medium');
    return t(key) || priority;
  }

  // ==========================================================================
  // 6. READINESS CALCULATION ENGINE
  // ==========================================================================
  function calculateTripReadiness(trip) {
    if (!trip) return { score: 0, level: 'not-ready', text: 'Not Ready', reasons: [] };

    let score = 0;
    const reasons = [];

    // 1. Basic Information (20%)
    if (trip.name && trip.location && trip.startDate && trip.endDate && trip.purpose && trip.organization) {
      score += 20;
    } else {
      reasons.push(t('Overview & logistics incomplete'));
    }

    // 2. Team Members (15%)
    const teamCount = (trip.team && trip.team.length) || 0;
    if (teamCount > 0) {
      score += 15;
    } else if (trip.participantsCount > 0) {
      score += 8;
    } else {
      reasons.push(t('No team members assigned'));
    }

    // 3. Budget (20%)
    if (trip.estimatedBudget > 0) {
      score += 20;
    } else {
      let catSum = 0;
      if (trip.budget) {
        Object.values(trip.budget).forEach(b => { catSum += (b.est || 0); });
      }
      if (catSum > 0) {
        score += 20;
      } else {
        reasons.push(t('Budget estimate pending'));
      }
    }

    // 4. Itinerary (20%)
    const itinCount = (trip.itinerary && trip.itinerary.length) || 0;
    if (itinCount >= 2) {
      score += 20;
    } else if (itinCount === 1) {
      score += 12;
    } else {
      reasons.push(t('Itinerary schedule empty'));
    }

    // 5. Checklist Progress (15%)
    const chkList = trip.checklist || [];
    if (chkList.length > 0) {
      const completed = chkList.filter(item => item.completed).length;
      const ratio = completed / chkList.length;
      score += Math.round(ratio * 15);
      if (completed < chkList.length) {
        reasons.push(`${chkList.length - completed} checklist items pending`);
      }
    } else {
      reasons.push(t('Checklist not prepared'));
    }

    // 6. Final preparation / status / report readiness (10%)
    if (trip.status === 'Completed' && trip.report) {
      score += 10;
    } else if (trip.status === 'Upcoming' || trip.status === 'Preparing') {
      score += 10;
    } else if (trip.status === 'Planned') {
      score += 5;
    }

    score = Math.min(100, Math.max(0, score));

    let level = 'not-ready';
    let text = t('readinessNotReady');

    if (score >= 90) {
      level = 'ready';
      text = t('readinessReady');
    } else if (score >= 70) {
      level = 'almost-ready';
      text = t('readinessAlmostReady');
    } else if (score >= 40) {
      level = 'in-progress';
      text = t('readinessInProgress');
    }

    return { score, level, text, reasons };
  }

  // ==========================================================================
  // 7. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 8. NAVIGATION & SECTION SWITCHING
  // ==========================================================================
  function switchSection(sectionId) {
    State.activeSection = sectionId;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-target');
      link.classList.toggle('active', target === sectionId);
    });

    // Update section visibility
    document.querySelectorAll('.app-section').forEach(sec => {
      const isTarget = sec.id === ('section' + capitalizeFirstLetter(sectionId));
      sec.classList.toggle('active', isTarget);
    });

    // Close mobile nav drawer if open
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) mobileNav.classList.remove('open');

    // Section specific refreshes
    if (sectionId === 'calendar') {
      renderCalendar();
    } else if (sectionId === 'budget') {
      renderBudgetSection();
    } else if (sectionId === 'checklist') {
      renderChecklistSection();
    } else if (sectionId === 'reports') {
      renderReportsSection();
    } else if (sectionId === 'settings') {
      renderSettingsSection();
    } else if (sectionId === 'trips') {
      renderTripsGrid();
    } else if (sectionId === 'dashboard') {
      renderDashboard();
    }

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // ==========================================================================
  // 9. DASHBOARD RENDERING
  // ==========================================================================
  function renderDashboard() {
    const totalTrips = State.trips.length;
    const upcomingTrips = State.trips.filter(t => t.status === 'Upcoming' || t.status === 'Preparing');
    const completedTrips = State.trips.filter(t => t.status === 'Completed');
    const highPriorityTrips = State.trips.filter(t => t.priority === 'High' && t.status !== 'Cancelled');

    let totalBudget = 0;
    let totalReadiness = 0;

    State.trips.forEach(t => {
      totalBudget += Number(t.estimatedBudget) || 0;
      totalReadiness += calculateTripReadiness(t).score;
    });

    const avgReadiness = totalTrips > 0 ? Math.round(totalReadiness / totalTrips) : 0;

    // Update stats DOM
    const elTot = document.getElementById('statTotalTrips');
    if (elTot) elTot.textContent = totalTrips;
    const elUp = document.getElementById('statUpcomingTrips');
    if (elUp) elUp.textContent = upcomingTrips.length;
    const elComp = document.getElementById('statCompletedTrips');
    if (elComp) elComp.textContent = completedTrips.length;
    const elHp = document.getElementById('statHighPriorityTrips');
    if (elHp) elHp.textContent = highPriorityTrips.length;
    const elBud = document.getElementById('statTotalBudget');
    if (elBud) elBud.textContent = formatCurrency(totalBudget);
    const elRead = document.getElementById('statAvgReadiness');
    if (elRead) elRead.textContent = avgReadiness + '%';

    // Render Upcoming Trips highlights
    const listEl = document.getElementById('dashUpcomingList');
    const badgeEl = document.getElementById('upcomingCountBadge');
    if (badgeEl) badgeEl.textContent = upcomingTrips.length;

    if (listEl) {
      if (upcomingTrips.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state" style="padding: 2rem 1rem; border: none; background: transparent;">
            <p class="empty-desc">${escapeHtml(t('No upcoming trips scheduled'))}</p>
          </div>
        `;
      } else {
        listEl.innerHTML = upcomingTrips.slice(0, 4).map(trip => {
          const readiness = calculateTripReadiness(trip);
          let colorClass = '#22c55e';
          if (readiness.score < 40) colorClass = '#ef4444';
          else if (readiness.score < 70) colorClass = '#f59e0b';
          else if (readiness.score < 90) colorClass = '#0284c7';

          return `
            <div class="upcoming-mini-card" data-trip-id="${trip.id}">
              <div class="mini-card-top">
                <div>
                  <h4 class="mini-card-title">${escapeHtml(trip.name)}</h4>
                  <div class="mini-card-meta">
                    <span class="mini-meta-item">📍 ${escapeHtml(trip.location)}</span>
                    <span class="mini-meta-item">🗓️ ${formatDate(trip.startDate)}</span>
                    <span class="mini-meta-item">👥 ${trip.participantsCount || 1} ${t('ovTeamSize')}</span>
                  </div>
                </div>
                <span class="status-badge ${getStatusBadgeClass(trip.status)}">${escapeHtml(getStatusLabel(trip.status))}</span>
              </div>
              <div class="mini-readiness-row">
                <span>${escapeHtml(readiness.text)} (${readiness.score}%)</span>
                <div class="readiness-bar-mini">
                  <div class="readiness-bar-fill" style="width: ${readiness.score}%; background: ${colorClass};"></div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    renderActivityFeed();
  }

  function renderActivityFeed() {
    const feedEl = document.getElementById('dashActivityFeed');
    if (!feedEl) return;

    if (!State.activities || State.activities.length === 0) {
      feedEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">No recent activities.</p>`;
      return;
    }

    feedEl.innerHTML = State.activities.slice(0, 10).map(act => {
      const date = new Date(act.timestamp);
      const timeStr = isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString();

      return `
        <div class="activity-item">
          <div class="activity-icon">📌</div>
          <div class="activity-body">
            <div class="activity-title">${escapeHtml(act.title)}</div>
            <div class="activity-detail">${escapeHtml(act.detail)}</div>
            <div class="activity-time">${timeStr}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // 10. TRIPS MANAGEMENT SECTION RENDERING
  // ==========================================================================
  function renderTripsGrid() {
    const gridEl = document.getElementById('tripsGrid');
    const emptyEl = document.getElementById('tripsEmptyState');
    if (!gridEl) return;

    let list = State.trips.slice();

    // 1. Search Query Filter
    if (State.searchQuery.trim()) {
      const q = State.searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.location && t.location.toLowerCase().includes(q)) ||
        (t.country && t.country.toLowerCase().includes(q)) ||
        (t.purpose && t.purpose.toLowerCase().includes(q)) ||
        (t.organization && t.organization.toLowerCase().includes(q))
      );
    }

    // 2. Status / Category Chip Filter
    if (State.currentFilter === 'favorites') {
      list = list.filter(t => t.isFavorite);
    } else if (State.currentFilter === 'high-priority') {
      list = list.filter(t => t.priority === 'High');
    } else if (State.currentFilter !== 'all') {
      list = list.filter(t => t.status === State.currentFilter);
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (State.sortMode === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (State.sortMode === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (State.sortMode === 'date') {
        return new Date(a.startDate || '9999-12-31') - new Date(b.startDate || '9999-12-31');
      } else if (State.sortMode === 'priority') {
        const pOrder = { High: 3, Medium: 2, Low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      } else if (State.sortMode === 'budget') {
        return (Number(b.estimatedBudget) || 0) - (Number(a.estimatedBudget) || 0);
      } else if (State.sortMode === 'readiness') {
        return calculateTripReadiness(b).score - calculateTripReadiness(a).score;
      }
      return 0;
    });

    updateFilterCounts();

    if (list.length === 0) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
    } else {
      if (emptyEl) emptyEl.classList.add('hidden');
      gridEl.innerHTML = list.map(trip => renderTripCardHtml(trip)).join('');
    }
  }

  function updateFilterCounts() {
    const counts = {
      all: State.trips.length,
      Planned: 0,
      Preparing: 0,
      Upcoming: 0,
      Completed: 0,
      Cancelled: 0,
      highPriority: 0,
      favorites: 0
    };

    State.trips.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
      if (t.priority === 'High') counts.highPriority++;
      if (t.isFavorite) counts.favorites++;
    });

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal('countAll', counts.all);
    setVal('countPlanned', counts.Planned);
    setVal('countPreparing', counts.Preparing);
    setVal('countUpcoming', counts.Upcoming);
    setVal('countCompleted', counts.Completed);
    setVal('countCancelled', counts.Cancelled);
    setVal('countHighPriority', counts.highPriority);
    setVal('countFavorites', counts.favorites);
  }

  function renderTripCardHtml(trip) {
    const readiness = calculateTripReadiness(trip);
    let colorClass = '#22c55e';
    if (readiness.score < 40) colorClass = '#ef4444';
    else if (readiness.score < 70) colorClass = '#f59e0b';
    else if (readiness.score < 90) colorClass = '#0284c7';

    const coverSrc = trip.coverImage || PRESET_COVERS[0].url;

    return `
      <div class="trip-card" data-trip-id="${trip.id}">
        <div class="trip-card-cover">
          <img src="${coverSrc}" alt="${escapeHtml(trip.name)}" class="trip-card-img" loading="lazy">
          <div class="trip-card-overlay"></div>
          <div class="trip-card-top-tags">
            <span class="status-badge ${getStatusBadgeClass(trip.status)}">${escapeHtml(getStatusLabel(trip.status))}</span>
            <button class="trip-card-fav-btn ${trip.isFavorite ? 'active' : ''}" data-action="toggle-fav" data-trip-id="${trip.id}" title="Toggle Favorite">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${trip.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </button>
          </div>
          <div class="trip-card-cover-info">
            <div class="trip-card-dept">${escapeHtml(trip.organization || 'Organization Mission')}</div>
            <h3 class="trip-card-title">${escapeHtml(trip.name)}</h3>
          </div>
        </div>

        <div class="trip-card-body">
          <div class="trip-meta-list">
            <div class="trip-meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(trip.location)}, ${escapeHtml(trip.country)}</span>
            </div>
            <div class="trip-meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
              <span>${formatDate(trip.startDate)} &rarr; ${formatDate(trip.endDate)}</span>
            </div>
            <div class="trip-meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <span>${trip.participantsCount || 1} ${t('ovTeamSize')} · <strong class="priority-badge ${getPriorityBadgeClass(trip.priority)}" style="padding: 0.15rem 0.4rem; font-size: 0.72rem;">${escapeHtml(getPriorityLabel(trip.priority))}</strong></span>
            </div>
          </div>

          <div class="trip-card-readiness">
            <div class="trip-readiness-labels">
              <span>${escapeHtml(t('statAvgReadiness'))}: <strong>${readiness.score}%</strong></span>
              <span class="readiness-badge-chip readiness-${readiness.level}">${escapeHtml(readiness.text)}</span>
            </div>
            <div class="readiness-bar-mini">
              <div class="readiness-bar-fill" style="width: ${readiness.score}%; background: ${colorClass};"></div>
            </div>
          </div>

          <div class="trip-card-footer">
            <div class="trip-budget-display">
              <span class="trip-budget-label">${escapeHtml(t('formBudget'))}</span>
              <span class="trip-budget-val">${formatCurrency(trip.estimatedBudget || 0)}</span>
            </div>
            <div class="trip-card-actions">
              <button class="btn btn-outline btn-sm" data-action="view-trip" data-trip-id="${trip.id}">${escapeHtml(t('tabOverview'))}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 11. TRIP DETAILS MODAL (DEEP INSPECTION & SUB-MODULES)
  // ==========================================================================
  function openTripDetailModal(tripId) {
    const trip = State.trips.find(t => t.id === tripId);
    if (!trip) return;

    State.activeTripId = tripId;

    // Header Meta & Background
    const coverHeader = document.getElementById('detailCoverHeader');
    if (coverHeader) {
      coverHeader.style.backgroundImage = `url("${trip.coverImage || PRESET_COVERS[0].url}")`;
    }

    const titleEl = document.getElementById('detailTripTitle');
    if (titleEl) titleEl.textContent = trip.name;
    const locEl = document.getElementById('detailLocationText');
    if (locEl) locEl.innerHTML = `📍 ${escapeHtml(trip.location)}, ${escapeHtml(trip.country)}`;
    const dateEl = document.getElementById('detailDateText');
    if (dateEl) dateEl.innerHTML = `🗓️ ${formatDate(trip.startDate)} &rarr; ${formatDate(trip.endDate)}`;
    const orgEl = document.getElementById('detailOrgText');
    if (orgEl) orgEl.innerHTML = `🏢 ${escapeHtml(trip.organization || 'Organization Mission')}`;

    // Status & Priority Badges
    const statusBadge = document.getElementById('detailStatusBadge');
    if (statusBadge) {
      statusBadge.className = `status-badge ${getStatusBadgeClass(trip.status)}`;
      statusBadge.textContent = getStatusLabel(trip.status);
    }

    const priorityBadge = document.getElementById('detailPriorityBadge');
    if (priorityBadge) {
      priorityBadge.className = `priority-badge ${getPriorityBadgeClass(trip.priority)}`;
      priorityBadge.textContent = getPriorityLabel(trip.priority);
    }

    const favBtn = document.getElementById('detailFavBtn');
    if (favBtn) favBtn.classList.toggle('active', !!trip.isFavorite);

    // Readiness
    const readiness = calculateTripReadiness(trip);
    const readScoreEl = document.getElementById('detailReadinessScoreText');
    if (readScoreEl) readScoreEl.textContent = `${t('statAvgReadiness')}: ${readiness.score}%`;
    const readFillEl = document.getElementById('detailReadinessFill');
    if (readFillEl) readFillEl.style.width = readiness.score + '%';

    const levelBadge = document.getElementById('detailReadinessLevelBadge');
    if (levelBadge) {
      levelBadge.className = `readiness-badge-chip readiness-${readiness.level}`;
      levelBadge.textContent = readiness.text;
    }

    const readHintEl = document.getElementById('detailReadinessHint');
    if (readHintEl) {
      readHintEl.textContent = readiness.reasons.length > 0 ? readiness.reasons.join(' · ') : t('Ready for departure');
    }

    // Complete Button text
    const compBtnText = document.getElementById('detailCompleteBtnText');
    if (compBtnText) {
      compBtnText.textContent = trip.status === 'Completed' ? t('btnMarkPlanned') : t('btnMarkCompleted');
    }

    // Render Subtabs
    renderDetailOverviewTab(trip);
    renderDetailTeamTab(trip);
    renderDetailBudgetTab(trip);
    renderDetailItineraryTab(trip);
    renderDetailChecklistTab(trip);
    renderDetailReportTab(trip);

    // Default to Overview tab
    switchDetailTab('tabOverview');

    // Show modal
    const modal = document.getElementById('tripDetailModalBackdrop');
    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
    }
  }

  function closeTripDetailModal() {
    const modal = document.getElementById('tripDetailModalBackdrop');
    if (modal) {
      modal.setAttribute('hidden', '');
      modal.style.display = 'none';
    }
    State.activeTripId = null;
  }

  function switchDetailTab(tabId) {
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.detail-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  function renderDetailOverviewTab(trip) {
    const pill = document.getElementById('detailPurposePill');
    if (pill) pill.textContent = trip.purpose || 'Field Visit';
    const desc = document.getElementById('detailDescText');
    if (desc) desc.textContent = trip.description || 'No description provided.';
    const notes = document.getElementById('detailNotesText');
    if (notes) notes.textContent = trip.notes || 'No specific operational notes recorded.';
    const teamSize = document.getElementById('detailTeamSizeVal');
    if (teamSize) teamSize.textContent = `${trip.participantsCount || (trip.team ? trip.team.length : 1)} People`;
    const bud = document.getElementById('detailBudgetVal');
    if (bud) bud.textContent = formatCurrency(trip.estimatedBudget || 0);

    let durationDays = 1;
    if (trip.startDate && trip.endDate) {
      const s = new Date(trip.startDate);
      const e = new Date(trip.endDate);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0) durationDays = diff;
    }
    const dur = document.getElementById('detailDurationVal');
    if (dur) dur.textContent = `${durationDays} Days`;
    const stat = document.getElementById('detailStatusVal');
    if (stat) stat.textContent = getStatusLabel(trip.status);
  }

  function renderDetailTeamTab(trip) {
    const rosterEl = document.getElementById('detailTeamRoster');
    if (!rosterEl) return;

    const team = trip.team || [];
    if (team.length === 0) {
      rosterEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">No team members assigned yet. Add leads and officers above.</p>`;
      return;
    }

    rosterEl.innerHTML = team.map(m => `
      <div class="team-member-card">
        <div class="member-info">
          <span class="member-name">${escapeHtml(m.name)}</span>
          <span class="member-role">${escapeHtml(m.role)}</span>
          ${m.contactNote ? `<span class="member-contact">📞 ${escapeHtml(m.contactNote)}</span>` : ''}
        </div>
        <button class="btn btn-outline btn-sm" data-action="remove-member" data-member-id="${m.id}" title="Remove Member" style="color: var(--danger);">&times;</button>
      </div>
    `).join('');
  }

  function renderDetailBudgetTab(trip) {
    let estTotal = Number(trip.estimatedBudget) || 0;
    let actTotal = 0;

    if (trip.budget) {
      Object.values(trip.budget).forEach(b => {
        actTotal += Number(b.act) || 0;
        if (!estTotal && b.est) estTotal += Number(b.est);
      });
    }

    const rem = estTotal - actTotal;

    const elEst = document.getElementById('detailBudEst');
    if (elEst) elEst.textContent = formatCurrency(estTotal);
    const elAct = document.getElementById('detailBudAct');
    if (elAct) elAct.textContent = formatCurrency(actTotal);
    const elRem = document.getElementById('detailBudRem');
    if (elRem) {
      elRem.textContent = formatCurrency(rem);
      elRem.style.color = rem < 0 ? 'var(--danger)' : 'var(--text-primary)';
    }

    const barsContainer = document.getElementById('detailBudgetBars');
    if (barsContainer) {
      barsContainer.innerHTML = BUDGET_CATEGORIES.map(cat => {
        const b = (trip.budget && trip.budget[cat.key]) || { est: 0, act: 0 };
        const catEst = Number(b.est) || 0;
        const catAct = Number(b.act) || 0;
        const catPct = catEst > 0 ? Math.min(100, Math.round((catAct / catEst) * 100)) : 0;
        const isOver = catAct > catEst && catEst > 0;

        const catLabel = State.settings.language === 'bn' ? cat.labelBn : cat.labelEn;

        return `
          <div class="cat-bar-item" style="margin-bottom: 0.65rem;">
            <div class="cat-bar-labels">
              <span>${catLabel}</span>
              <span>${formatCurrency(catAct)} / ${formatCurrency(catEst)}</span>
            </div>
            <div class="cat-bar-track">
              <div class="cat-bar-fill ${isOver ? 'over-budget' : ''}" style="width: ${catPct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function renderDetailItineraryTab(trip) {
    const listEl = document.getElementById('detailItinTimeline');
    if (!listEl) return;

    const items = (trip.itinerary || []).slice().sort((a, b) => (a.day - b.day));

    if (items.length === 0) {
      listEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">No schedule activities added yet. Use the schedule form to build daily agendas.</p>`;
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="itin-item-card">
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <span class="itin-day-badge">Day ${item.day} ${item.time ? '· ' + escapeHtml(item.time) : ''}</span>
          <button class="btn btn-outline btn-sm" data-action="remove-itin" data-itin-id="${item.id}" style="color: var(--danger); padding: 0.1rem 0.4rem; font-size: 0.75rem;">&times;</button>
        </div>
        <div class="itin-activity-title">${escapeHtml(item.activity)}</div>
        ${item.location ? `<div class="itin-meta-sub">📍 ${escapeHtml(item.location)}</div>` : ''}
        ${item.responsible ? `<div class="itin-meta-sub">👤 Lead: ${escapeHtml(item.responsible)}</div>` : ''}
      </div>
    `).join('');
  }

  function renderDetailChecklistTab(trip) {
    const listEl = document.getElementById('detailChkList');
    if (!listEl) return;

    const chkList = trip.checklist || [];
    const completed = chkList.filter(i => i.completed).length;

    const cntEl = document.getElementById('detailChkCount');
    if (cntEl) cntEl.textContent = `${completed} / ${chkList.length} ${t('statusCompleted')}`;

    if (chkList.length === 0) {
      listEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">No checklist items. Open the Checklist module to add items.</p>`;
      return;
    }

    listEl.innerHTML = chkList.map(item => `
      <div class="chk-item-row" style="background: var(--bg-subtle);">
        <label class="chk-label-wrap">
          <input type="checkbox" class="chk-checkbox" data-action="toggle-trip-chk" data-item-id="${item.id}" ${item.completed ? 'checked' : ''}>
          <span class="chk-text ${item.completed ? 'completed' : ''}">${escapeHtml(item.text)} <small style="color: var(--text-muted);">(${escapeHtml(item.category)})</small></span>
        </label>
      </div>
    `).join('');
  }

  function renderDetailReportTab(trip) {
    const contentEl = document.getElementById('detailReportContent');
    if (!contentEl) return;

    if (!trip.report) {
      contentEl.innerHTML = `
        <div class="empty-state" style="border: 1px dashed var(--border-medium); background: var(--bg-subtle);">
          <h4 style="font-size: 1.1rem; font-weight: 700;">${escapeHtml(t('emptyReportsTitle'))}</h4>
          <p class="empty-desc">${escapeHtml(t('emptyReportsDesc'))}</p>
          <button class="btn btn-primary btn-sm" id="detailCreateReportBtn" type="button">${escapeHtml(t('btnCreateReport'))}</button>
        </div>
      `;
    } else {
      const rep = trip.report;
      const stars = '★'.repeat(rep.rating || 5) + '☆'.repeat(5 - (rep.rating || 5));

      contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            <div>
              <span class="report-stars">${stars}</span>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 0.25rem;">${escapeHtml(trip.name)}</h4>
            </div>
            <button class="btn btn-outline btn-sm" id="detailViewReportBtn" type="button">${escapeHtml(t('btnPrintReport'))}</button>
          </div>
          <div>
            <strong>${escapeHtml(t('formReportSummary'))}:</strong>
            <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(rep.visitSummary)}</p>
          </div>
          <div>
            <strong>${escapeHtml(t('formReportAccomplished'))}:</strong>
            <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(rep.accomplished || rep.accomplishments)}</p>
          </div>
          ${rep.keyFindings ? `
            <div>
              <strong>${escapeHtml(t('formReportFindings'))}:</strong>
              <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(rep.keyFindings)}</p>
            </div>
          ` : ''}
          ${rep.followUpActions ? `
            <div>
              <strong>${escapeHtml(t('formReportFollowup'))}:</strong>
              <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(rep.followUpActions)}</p>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  // ==========================================================================
  // 12. CALENDAR SECTION RENDERING
  // ==========================================================================
  function renderCalendar() {
    const gridEl = document.getElementById('calendarGrid');
    const monthTitleEl = document.getElementById('calMonthTitle');
    if (!gridEl || !monthTitleEl) return;

    const cur = State.calMonthDate;
    const year = cur.getFullYear();
    const month = cur.getMonth();

    const monthNames = State.settings.language === 'bn'
      ? ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    monthTitleEl.textContent = `${monthNames[month]} ${year}`;

    const dayHeaders = State.settings.language === 'bn'
      ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let html = dayHeaders.map(d => `<div class="cal-day-header">${d}</div>`).join('');

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      html += `<div class="cal-cell other-month"><span class="cal-cell-num">${dayNum}</span></div>`;
    }

    for (let d = 1; d <= totalDays; d++) {
      const isToday = isThisMonth && today.getDate() === d;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayDate = new Date(year, month, d);

      const matchingTrips = State.trips.filter(t => {
        if (!t.startDate) return false;
        const start = new Date(t.startDate);
        const end = t.endDate ? new Date(t.endDate) : start;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return dayDate >= start && dayDate <= end;
      });

      const tripsHtml = matchingTrips.map(trip => `
        <div class="cal-trip-pill pill-${trip.status || 'Planned'}" data-trip-id="${trip.id}" title="${escapeHtml(trip.name)} (${trip.location})">
          ${escapeHtml(trip.name)}
        </div>
      `).join('');

      html += `
        <div class="cal-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
          <span class="cal-cell-num">${d}</span>
          ${tripsHtml}
        </div>
      `;
    }

    const remainingCells = (7 - ((firstDay + totalDays) % 7)) % 7;
    for (let j = 1; j <= remainingCells; j++) {
      html += `<div class="cal-cell other-month"><span class="cal-cell-num">${j}</span></div>`;
    }

    gridEl.innerHTML = html;
  }

  // ==========================================================================
  // 13. BUDGET PLANNER SECTION RENDERING
  // ==========================================================================
  function renderBudgetSection() {
    const tripSelect = document.getElementById('budgetTripSelect');
    if (!tripSelect) return;

    const curVal = tripSelect.value || 'all';
    tripSelect.innerHTML = `<option value="all">${escapeHtml(t('budgetAllTrips'))}</option>` +
      State.trips.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    tripSelect.value = curVal;

    const selectedTripId = tripSelect.value;
    let estTotal = 0;
    let actTotal = 0;
    const catTotals = {};

    BUDGET_CATEGORIES.forEach(c => { catTotals[c.key] = { est: 0, act: 0 }; });

    const editorPanel = document.getElementById('budgetEditorPanel');

    if (selectedTripId === 'all') {
      State.trips.forEach(trip => {
        estTotal += Number(trip.estimatedBudget) || 0;
        if (trip.budget) {
          BUDGET_CATEGORIES.forEach(c => {
            if (trip.budget[c.key]) {
              catTotals[c.key].est += Number(trip.budget[c.key].est) || 0;
              catTotals[c.key].act += Number(trip.budget[c.key].act) || 0;
              actTotal += Number(trip.budget[c.key].act) || 0;
            }
          });
        }
      });
      if (editorPanel) editorPanel.style.display = 'none';
    } else {
      const trip = State.trips.find(t => t.id === selectedTripId);
      if (trip) {
        estTotal = Number(trip.estimatedBudget) || 0;
        if (trip.budget) {
          BUDGET_CATEGORIES.forEach(c => {
            if (trip.budget[c.key]) {
              catTotals[c.key].est = Number(trip.budget[c.key].est) || 0;
              catTotals[c.key].act = Number(trip.budget[c.key].act) || 0;
              actTotal += Number(trip.budget[c.key].act) || 0;
            }
          });
        }
        if (editorPanel) editorPanel.style.display = 'block';
        renderBudgetEditorForm(trip);
      }
    }

    const remaining = estTotal - actTotal;
    const utilization = estTotal > 0 ? Math.min(200, Math.round((actTotal / estTotal) * 100)) : 0;

    const elEst = document.getElementById('budgetTotalEstVal');
    if (elEst) elEst.textContent = formatCurrency(estTotal);
    const elAct = document.getElementById('budgetTotalActVal');
    if (elAct) elAct.textContent = formatCurrency(actTotal);
    const elRem = document.getElementById('budgetRemainingVal');
    if (elRem) elRem.textContent = formatCurrency(remaining);
    const elUtil = document.getElementById('budgetUtilizationVal');
    if (elUtil) elUtil.textContent = utilization + '%';

    const statusEl = document.getElementById('budgetRemainingStatus');
    if (statusEl) {
      if (remaining < 0) {
        statusEl.textContent = 'Over Budget Alert';
        statusEl.style.color = 'var(--danger)';
      } else {
        statusEl.textContent = 'On Target';
        statusEl.style.color = 'var(--text-secondary)';
      }
    }

    const diffEl = document.getElementById('budgetDiffDesc');
    if (diffEl) diffEl.textContent = `Variance: ${formatCurrency(remaining)}`;

    const barsContainer = document.getElementById('budgetCategoryBars');
    if (barsContainer) {
      barsContainer.innerHTML = BUDGET_CATEGORIES.map(cat => {
        const c = catTotals[cat.key];
        const pct = c.est > 0 ? Math.min(100, Math.round((c.act / c.est) * 100)) : 0;
        const isOver = c.act > c.est && c.est > 0;
        const catLabel = State.settings.language === 'bn' ? cat.labelBn : cat.labelEn;

        return `
          <div class="cat-bar-item">
            <div class="cat-bar-labels">
              <span>${catLabel}</span>
              <span><strong>${formatCurrency(c.act)}</strong> / ${formatCurrency(c.est)}</span>
            </div>
            <div class="cat-bar-track">
              <div class="cat-bar-fill ${isOver ? 'over-budget' : ''}" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function renderBudgetEditorForm(trip) {
    const rowsEl = document.getElementById('budgetFormRows');
    if (!rowsEl || !trip) return;

    rowsEl.innerHTML = BUDGET_CATEGORIES.map(cat => {
      const b = (trip.budget && trip.budget[cat.key]) || { est: 0, act: 0 };
      const catLabel = State.settings.language === 'bn' ? cat.labelBn : cat.labelEn;

      return `
        <div class="budget-form-row">
          <span>${catLabel}</span>
          <input type="number" class="form-input form-input-sm" name="est_${cat.key}" placeholder="Est (${State.settings.currency})" value="${b.est || 0}" min="0">
          <input type="number" class="form-input form-input-sm" name="act_${cat.key}" placeholder="Act (${State.settings.currency})" value="${b.act || 0}" min="0">
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // 14. CHECKLIST SECTION RENDERING
  // ==========================================================================
  function renderChecklistSection() {
    const tripSelect = document.getElementById('checklistTripSelect');
    if (!tripSelect) return;

    const curVal = tripSelect.value || (State.trips[0] ? State.trips[0].id : '');
    tripSelect.innerHTML = State.trips.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    if (curVal && State.trips.some(t => t.id === curVal)) {
      tripSelect.value = curVal;
    }

    const tripId = tripSelect.value;
    const trip = State.trips.find(t => t.id === tripId);
    if (!trip) return;

    if (!trip.checklist) {
      trip.checklist = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST_TEMPLATE)).map(item => ({
        id: 'ck_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        ...item,
        completed: false
      }));
      saveTripsToStorage();
    }

    const chkList = trip.checklist;
    const completedCount = chkList.filter(i => i.completed).length;
    const totalCount = chkList.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const pText = document.getElementById('checklistProgressText');
    if (pText) pText.textContent = `${completedCount} / ${totalCount} ${t('statusCompleted')}`;
    const pPct = document.getElementById('checklistProgressPct');
    if (pPct) pPct.textContent = pct + '%';
    const pBar = document.getElementById('checklistProgressBar');
    if (pBar) pBar.style.width = pct + '%';

    const categories = ['Documents', 'Equipment', 'Field Materials', 'Safety', 'Other'];
    const container = document.getElementById('checklistCategoriesContainer');
    if (!container) return;

    container.innerHTML = categories.map(catKey => {
      const items = chkList.filter(i => (i.category === catKey) || (catKey === 'Other' && !categories.slice(0, 4).includes(i.category)));
      const catLabel = t('cat' + catKey.replace(/\s+/g, '')) || catKey;

      let catIcon = '📋';
      if (catKey === 'Documents') catIcon = '📄';
      else if (catKey === 'Equipment') catIcon = '💻';
      else if (catKey === 'Field Materials') catIcon = '📦';
      else if (catKey === 'Safety') catIcon = '🛡️';

      return `
        <div class="checklist-cat-card">
          <div class="chk-cat-header">
            <span class="chk-cat-title">${catIcon} ${catLabel}</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${items.filter(i => i.completed).length}/${items.length}</span>
          </div>
          <div class="chk-items-list">
            ${items.length === 0 ? `<p style="font-size: 0.78rem; color: var(--text-light);">No items in this category.</p>` : items.map(item => `
              <div class="chk-item-row">
                <label class="chk-label-wrap">
                  <input type="checkbox" class="chk-checkbox" data-action="toggle-master-chk" data-item-id="${item.id}" ${item.completed ? 'checked' : ''}>
                  <span class="chk-text ${item.completed ? 'completed' : ''}">${escapeHtml(item.text)}</span>
                </label>
                <button class="chk-del-btn" data-action="delete-master-chk" data-item-id="${item.id}" title="Delete Item">&times;</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // 15. REPORTS SECTION RENDERING
  // ==========================================================================
  function renderReportsSection() {
    const gridEl = document.getElementById('reportsGrid');
    const emptyEl = document.getElementById('reportsEmptyState');
    if (!gridEl) return;

    const tripsWithReports = State.trips.filter(t => t.report);

    if (tripsWithReports.length === 0) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
    } else {
      if (emptyEl) emptyEl.classList.add('hidden');
      gridEl.innerHTML = tripsWithReports.map(trip => {
        const rep = trip.report;
        const stars = '★'.repeat(rep.rating || 5) + '☆'.repeat(5 - (rep.rating || 5));
        const photos = rep.photos || [];

        return `
          <div class="report-card">
            <div class="report-card-top">
              <div>
                <h3 class="report-trip-name">${escapeHtml(trip.name)}</h3>
                <span style="font-size: 0.8rem; color: var(--text-muted);">🗓️ ${formatDate(trip.startDate)} · 📍 ${escapeHtml(trip.location)}</span>
              </div>
              <span class="report-stars">${stars}</span>
            </div>

            <p class="report-summary-text">${escapeHtml(rep.visitSummary)}</p>

            ${photos.length > 0 ? `
              <div class="report-photos-strip">
                ${photos.map(p => `<img src="${p}" alt="Field Photo" class="report-thumb">`).join('')}
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
              <span style="font-size: 0.75rem; color: var(--text-muted);">Logged: ${formatDate(rep.createdAt)}</span>
              <button class="btn btn-outline btn-sm" data-action="view-report" data-trip-id="${trip.id}">${escapeHtml(t('btnPrintReport'))}</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function openViewReportModal(tripId) {
    const trip = State.trips.find(t => t.id === tripId);
    if (!trip || !trip.report) return;

    const rep = trip.report;
    const stars = '★'.repeat(rep.rating || 5) + '☆'.repeat(5 - (rep.rating || 5));

    const tEl = document.getElementById('viewReportTitle');
    if (tEl) tEl.textContent = trip.name;
    const sEl = document.getElementById('viewReportSubtitle');
    if (sEl) sEl.textContent = `Official Mission Summary · ${trip.organization || ''} · ${formatDate(trip.startDate)}`;

    const contentEl = document.getElementById('viewReportContent');
    if (contentEl) {
      contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
            <div>
              <strong>Rating & Evaluation:</strong> <span class="report-stars">${stars}</span>
            </div>
            <div>
              <strong>Location:</strong> ${escapeHtml(trip.location)}, ${escapeHtml(trip.country)}
            </div>
          </div>

          <div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">1. ${escapeHtml(t('formReportSummary'))}</h4>
            <p style="font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary);">${escapeHtml(rep.visitSummary)}</p>
          </div>

          <div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">2. ${escapeHtml(t('formReportAccomplished'))}</h4>
            <p style="font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary);">${escapeHtml(rep.accomplished || rep.accomplishments)}</p>
          </div>

          ${rep.keyFindings ? `
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">3. ${escapeHtml(t('formReportFindings'))}</h4>
              <p style="font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary);">${escapeHtml(rep.keyFindings)}</p>
            </div>
          ` : ''}

          ${rep.problemsEncountered ? `
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">4. ${escapeHtml(t('formReportProblems'))}</h4>
              <p style="font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary);">${escapeHtml(rep.problemsEncountered)}</p>
            </div>
          ` : ''}

          ${rep.followUpActions ? `
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">5. ${escapeHtml(t('formReportFollowup'))}</h4>
              <p style="font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary);">${escapeHtml(rep.followUpActions)}</p>
            </div>
          ` : ''}

          ${rep.photos && rep.photos.length > 0 ? `
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem;">Field Photo Evidence</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem;">
                ${rep.photos.map(img => `<img src="${img}" style="width: 100%; height: 110px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    const modal = document.getElementById('viewReportModalBackdrop');
    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
    }
  }

  // ==========================================================================
  // 16. SETTINGS SECTION & DATA BACKUP
  // ==========================================================================
  function renderSettingsSection() {
    const curSelect = document.getElementById('currencySelect');
    if (curSelect) {
      curSelect.value = State.settings.currency || '$';
    }

    try {
      const tripsLen = localStorage.getItem(STORAGE_KEYS.TRIPS)?.length || 0;
      const actLen = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)?.length || 0;
      const totalKb = Math.round((tripsLen + actLen) / 1024);
      const stEl = document.getElementById('storageStatusText');
      if (stEl) {
        stEl.textContent = `Using LocalStorage: ~${totalKb} KB stored across ${State.trips.length} missions.`;
      }
    } catch (e) {
      // ignore
    }
  }

  function exportBackupJson() {
    const backupData = {
      wanderwiseVersion: '1.0',
      exportedAt: new Date().toISOString(),
      trips: State.trips,
      settings: State.settings,
      activities: State.activities
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `wanderwise-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Backup JSON exported successfully', 'success');
  }

  function importBackupJson(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (data && Array.isArray(data.trips)) {
          State.trips = data.trips;
          if (data.settings) State.settings = Object.assign(State.settings, data.settings);
          if (Array.isArray(data.activities)) State.activities = data.activities;

          saveTripsToStorage();
          saveSettingsToStorage();
          saveActivitiesToStorage();

          renderAllViews();
          showToast(`Successfully imported ${data.trips.length} trips!`, 'success');
        } else {
          showToast('Invalid backup format.', 'error');
        }
      } catch (err) {
        showToast('Error parsing JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // 17. SMART "WHAT SHOULD WE PLAN NEXT?" RECOMMENDER
  // ==========================================================================
  function runSmartRecommender() {
    const budgetInput = Number(document.getElementById('smartBudgetInput').value) || 2000;
    const durationInput = Number(document.getElementById('smartDurationInput').value) || 5;
    const priorityInput = document.getElementById('smartPrioritySelect').value;
    const purposeInput = document.getElementById('smartPurposeSelect').value;

    const candidateTrips = State.trips.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');

    if (candidateTrips.length === 0) {
      showToast('No active or upcoming trips to evaluate.', 'info');
      return;
    }

    const scoredTrips = candidateTrips.map(trip => {
      let score = 0;
      const reasons = [];

      // 1. Budget Fit
      const tripBudget = Number(trip.estimatedBudget) || 0;
      if (tripBudget > 0 && tripBudget <= budgetInput) {
        score += 35;
        reasons.push(`✓ Fits within budget (${formatCurrency(tripBudget)} ≤ ${formatCurrency(budgetInput)})`);
      } else if (tripBudget === 0) {
        score += 15;
        reasons.push(`✓ Budget flexible / zero logged estimate`);
      } else {
        score += 5;
      }

      // 2. Priority Fit
      if (priorityInput === 'High' && trip.priority === 'High') {
        score += 30;
        reasons.push(`✓ Matches High Priority organizational mission`);
      } else if (priorityInput === 'Medium' && (trip.priority === 'High' || trip.priority === 'Medium')) {
        score += 25;
        reasons.push(`✓ High/Medium organizational priority`);
      } else if (priorityInput === 'Any') {
        score += 20;
      }

      // 3. Purpose Fit
      if (purposeInput === 'Any' || trip.purpose === purposeInput) {
        score += 20;
        if (purposeInput !== 'Any') reasons.push(`✓ Focus aligns with ${trip.purpose}`);
      }

      // 4. Readiness bonus
      const readiness = calculateTripReadiness(trip);
      if (readiness.score >= 70) {
        score += 15;
        reasons.push(`✓ Highly prepared (${readiness.score}% readiness score)`);
      } else if (readiness.score >= 40) {
        score += 10;
        reasons.push(`✓ Preparation in progress (${readiness.score}%)`);
      }

      return { trip, score, reasons, readiness };
    });

    scoredTrips.sort((a, b) => b.score - a.score);
    const best = scoredTrips[0];

    const resultsContainer = document.getElementById('smartResultsContainer');
    const cardEl = document.getElementById('smartRecommendationCard');
    if (resultsContainer) resultsContainer.classList.remove('hidden');

    if (cardEl) {
      cardEl.innerHTML = `
        <div class="smart-rec-box">
          <div class="smart-rec-header">
            <div>
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${escapeHtml(best.trip.name)}</h4>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">📍 ${escapeHtml(best.trip.location)} · 🗓️ ${formatDate(best.trip.startDate)}</span>
            </div>
            <span class="smart-score-badge">${best.score}% Match</span>
          </div>

          <div class="smart-why-list">
            ${best.reasons.map(r => `<div>${escapeHtml(r)}</div>`).join('')}
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
            <button class="btn btn-primary btn-sm" id="smartOpenTripBtn" data-trip-id="${best.trip.id}">Open & Finalize Plan &rarr;</button>
          </div>
        </div>
      `;
    }
  }

  // ==========================================================================
  // 18. MODALS & FORMS LOGIC (ADD/EDIT TRIP, REPORT, CONFIRM)
  // ==========================================================================
  function openTripModal(editTripId = null) {
    const modal = document.getElementById('tripModalBackdrop');
    const titleEl = document.getElementById('tripModalTitle');
    const form = document.getElementById('tripForm');

    if (form) form.reset();
    const fId = document.getElementById('tripFormId');
    if (fId) fId.value = '';

    const presetsRow = document.getElementById('presetImagesRow');
    if (presetsRow) {
      presetsRow.innerHTML = PRESET_COVERS.map((preset, idx) => `
        <button type="button" class="preset-chip" data-preset-idx="${idx}">${preset.emoji} ${preset.name}</button>
      `).join('');
    }

    if (editTripId) {
      const trip = State.trips.find(t => t.id === editTripId);
      if (!trip) return;

      if (titleEl) titleEl.textContent = t('modalEditTripTitle');
      if (fId) fId.value = trip.id;
      const nIn = document.getElementById('tripNameInput');
      if (nIn) nIn.value = trip.name || '';
      const lIn = document.getElementById('tripLocationInput');
      if (lIn) lIn.value = trip.location || '';
      const cIn = document.getElementById('tripCountryInput');
      if (cIn) cIn.value = trip.country || 'Bangladesh';
      const pIn = document.getElementById('tripPurposeSelect');
      if (pIn) pIn.value = trip.purpose || 'Field Visit';
      const oIn = document.getElementById('tripOrgInput');
      if (oIn) oIn.value = trip.organization || '';
      const sIn = document.getElementById('tripStartDateInput');
      if (sIn) sIn.value = trip.startDate || '';
      const eIn = document.getElementById('tripEndDateInput');
      if (eIn) eIn.value = trip.endDate || '';
      const stIn = document.getElementById('tripStatusSelect');
      if (stIn) stIn.value = trip.status || 'Planned';
      const prIn = document.getElementById('tripPrioritySelect');
      if (prIn) prIn.value = trip.priority || 'Medium';
      const ptIn = document.getElementById('tripParticipantsInput');
      if (ptIn) ptIn.value = trip.participantsCount || 3;
      const bIn = document.getElementById('tripBudgetInput');
      if (bIn) bIn.value = trip.estimatedBudget || '';
      const dIn = document.getElementById('tripDescInput');
      if (dIn) dIn.value = trip.description || '';
      const notIn = document.getElementById('tripNotesInput');
      if (notIn) notIn.value = trip.notes || '';

      State.selectedCoverUrl = trip.coverImage || PRESET_COVERS[0].url;
    } else {
      if (titleEl) titleEl.textContent = t('modalAddTripTitle');
      State.selectedCoverUrl = PRESET_COVERS[0].url;
      const cIn = document.getElementById('tripCountryInput');
      if (cIn) cIn.value = 'Bangladesh';
      const ptIn = document.getElementById('tripParticipantsInput');
      if (ptIn) ptIn.value = 3;
    }

    updateModalImagePreview(State.selectedCoverUrl);

    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
    }
  }

  function closeTripModal() {
    const modal = document.getElementById('tripModalBackdrop');
    if (modal) {
      modal.setAttribute('hidden', '');
      modal.style.display = 'none';
    }
  }

  function updateModalImagePreview(url) {
    const previewImg = document.getElementById('tripImagePreview');
    const fallback = document.getElementById('tripImageFallback');
    const removeBtn = document.getElementById('removeTripImageBtn');

    if (url) {
      if (previewImg) {
        previewImg.src = url;
        previewImg.classList.remove('hidden');
      }
      if (fallback) fallback.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
      if (previewImg) {
        previewImg.src = '';
        previewImg.classList.add('hidden');
      }
      if (fallback) fallback.style.display = 'block';
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  function handleSaveTripForm(e) {
    e.preventDefault();

    const id = document.getElementById('tripFormId')?.value;
    const name = document.getElementById('tripNameInput')?.value.trim();
    const location = document.getElementById('tripLocationInput')?.value.trim();
    const country = document.getElementById('tripCountryInput')?.value.trim();
    const purpose = document.getElementById('tripPurposeSelect')?.value;
    const organization = document.getElementById('tripOrgInput')?.value.trim();
    const startDate = document.getElementById('tripStartDateInput')?.value;
    const endDate = document.getElementById('tripEndDateInput')?.value;
    const status = document.getElementById('tripStatusSelect')?.value;
    const priority = document.getElementById('tripPrioritySelect')?.value;
    const participantsCount = parseInt(document.getElementById('tripParticipantsInput')?.value, 10) || 1;
    const estimatedBudget = parseFloat(document.getElementById('tripBudgetInput')?.value) || 0;
    const description = document.getElementById('tripDescInput')?.value.trim();
    const notes = document.getElementById('tripNotesInput')?.value.trim();

    if (!name || !location || !country || !startDate || !endDate) {
      showToast('Please fill all required trip fields.', 'error');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      showToast('End date cannot be earlier than start date.', 'error');
      return;
    }

    if (id) {
      const idx = State.trips.findIndex(t => t.id === id);
      if (idx !== -1) {
        State.trips[idx] = Object.assign(State.trips[idx], {
          name, location, country, purpose, organization,
          startDate, endDate, status, priority, participantsCount,
          estimatedBudget, description, notes,
          coverImage: State.selectedCoverUrl,
          updatedAt: new Date().toISOString()
        });
        logActivity('Trip Updated', `${name} (${location}) was modified`);
        showToast('Trip updated successfully', 'success');
      }
    } else {
      const newTrip = {
        id: 'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name, location, country, purpose, organization,
        startDate, endDate, status, priority, participantsCount,
        estimatedBudget, description, notes,
        coverImage: State.selectedCoverUrl,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        team: [],
        budget: {},
        itinerary: [],
        checklist: JSON.parse(JSON.stringify(DEFAULT_CHECKLIST_TEMPLATE)).map(item => ({
          id: 'ck_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          ...item,
          completed: false
        })),
        report: null
      };
      State.trips.unshift(newTrip);
      logActivity('Trip Created', `New trip: ${name} (${location})`);
      showToast('New trip added successfully', 'success');
    }

    saveTripsToStorage();
    closeTripModal();
    renderAllViews();
  }

  function openCreateReportModal(tripId = null) {
    const modal = document.getElementById('reportModalBackdrop');
    const form = document.getElementById('reportForm');
    if (form) form.reset();

    const tripSelect = document.getElementById('reportTripSelect');
    if (tripSelect) {
      tripSelect.innerHTML = State.trips.map(t => `<option value="${t.id}">${escapeHtml(t.name)} (${t.status})</option>`).join('');
      if (tripId) tripSelect.value = tripId;
    }

    State.reportPhotoStaging = [];
    renderReportPhotosStaging();
    setReportRating(5);

    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
    }
  }

  function setReportRating(val) {
    const inEl = document.getElementById('reportRatingInput');
    if (inEl) inEl.value = val;
    document.querySelectorAll('#starRatingWrap .star-btn').forEach(btn => {
      const btnVal = parseInt(btn.getAttribute('data-val'), 10);
      btn.classList.toggle('active', btnVal <= val);
    });
  }

  function renderReportPhotosStaging() {
    const strip = document.getElementById('reportPhotosStrip');
    if (!strip) return;
    strip.innerHTML = State.reportPhotoStaging.map((img, idx) => `
      <div style="position: relative; display: inline-block;">
        <img src="${img}" class="report-thumb" alt="Report photo preview">
        <button type="button" data-action="remove-staging-photo" data-idx="${idx}" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 11px; cursor: pointer;">&times;</button>
      </div>
    `).join('');
  }

  function handleSaveReportForm(e) {
    e.preventDefault();

    const tripId = document.getElementById('reportTripSelect')?.value;
    const rating = parseInt(document.getElementById('reportRatingInput')?.value, 10) || 5;
    const visitSummary = document.getElementById('reportSummaryInput')?.value.trim();
    const accomplished = document.getElementById('reportAccomplishedInput')?.value.trim();
    const keyFindings = document.getElementById('reportFindingsInput')?.value.trim();
    const problemsEncountered = document.getElementById('reportProblemsInput')?.value.trim();
    const followUpActions = document.getElementById('reportFollowupInput')?.value.trim();
    const notes = document.getElementById('reportNotesInput')?.value.trim();

    if (!tripId || !visitSummary || !accomplished) {
      showToast('Please complete executive summary and accomplishments.', 'error');
      return;
    }

    const trip = State.trips.find(t => t.id === tripId);
    if (!trip) return;

    trip.report = {
      id: 'rep_' + Date.now(),
      visitSummary,
      accomplished,
      keyFindings,
      problemsEncountered,
      followUpActions,
      notes,
      rating,
      photos: State.reportPhotoStaging.slice(),
      createdAt: new Date().toISOString()
    };

    trip.status = 'Completed';
    trip.updatedAt = new Date().toISOString();

    saveTripsToStorage();
    logActivity('Report Filed', `Visit report logged for: ${trip.name}`);
    showToast('Field visit report created!', 'success');

    const modal = document.getElementById('reportModalBackdrop');
    if (modal) {
      modal.setAttribute('hidden', '');
      modal.style.display = 'none';
    }

    renderAllViews();
    if (State.activeTripId === tripId) {
      openTripDetailModal(tripId);
    }
  }

  // Universal Confirmation Dialog
  let confirmCallback = null;
  function openConfirmModal(title, message, onConfirm) {
    const tEl = document.getElementById('confirmModalTitle');
    if (tEl) tEl.textContent = title;
    const mEl = document.getElementById('confirmModalMessage');
    if (mEl) mEl.textContent = message;
    confirmCallback = onConfirm;

    const modal = document.getElementById('confirmModalBackdrop');
    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
    }
  }

  function closeConfirmModal() {
    const modal = document.getElementById('confirmModalBackdrop');
    if (modal) {
      modal.setAttribute('hidden', '');
      modal.style.display = 'none';
    }
    confirmCallback = null;
  }

  // ==========================================================================
  // 19. GLOBAL RE-RENDER HELPER
  // ==========================================================================
  function renderAllViews() {
    updateDomTranslations();
    renderDashboard();
    renderTripsGrid();
    renderCalendar();
    renderBudgetSection();
    renderChecklistSection();
    renderReportsSection();
    renderSettingsSection();
  }

  // ==========================================================================
  // 20. EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Navigation links (Desktop & Mobile)
    document.addEventListener('click', e => {
      const navBtn = e.target.closest('.nav-link');
      if (navBtn) {
        const target = navBtn.getAttribute('data-target');
        if (target) switchSection(target);
        return;
      }

      // Stat cards navigation
      const statCard = e.target.closest('.stat-card');
      if (statCard) {
        const target = statCard.getAttribute('data-nav-target');
        const filter = statCard.getAttribute('data-filter');
        if (target) {
          switchSection(target);
          if (filter && target === 'trips') {
            State.currentFilter = filter;
            document.querySelectorAll('.filter-chip').forEach(chip => {
              chip.classList.toggle('active', chip.getAttribute('data-filter') === filter);
            });
            renderTripsGrid();
          }
        }
        return;
      }

      // Panel link buttons
      const panelBtn = e.target.closest('.panel-link-btn');
      if (panelBtn) {
        const target = panelBtn.getAttribute('data-nav-target');
        if (target) switchSection(target);
        return;
      }

      // Upcoming mini cards click
      const miniCard = e.target.closest('.upcoming-mini-card');
      if (miniCard) {
        const tripId = miniCard.getAttribute('data-trip-id');
        if (tripId) openTripDetailModal(tripId);
        return;
      }

      // Trip card click
      const tripCard = e.target.closest('.trip-card');
      if (tripCard && !e.target.closest('button')) {
        const tripId = tripCard.getAttribute('data-trip-id');
        if (tripId) openTripDetailModal(tripId);
        return;
      }

      // Action triggers
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        const tripId = actionBtn.getAttribute('data-trip-id');

        if (action === 'view-trip') {
          openTripDetailModal(tripId);
        } else if (action === 'toggle-fav') {
          e.stopPropagation();
          const trip = State.trips.find(t => t.id === tripId);
          if (trip) {
            trip.isFavorite = !trip.isFavorite;
            saveTripsToStorage();
            renderTripsGrid();
            renderDashboard();
          }
        } else if (action === 'view-report') {
          openViewReportModal(tripId);
        } else if (action === 'remove-member') {
          const memberId = actionBtn.getAttribute('data-member-id');
          const trip = State.trips.find(t => t.id === State.activeTripId);
          if (trip && trip.team) {
            trip.team = trip.team.filter(m => m.id !== memberId);
            saveTripsToStorage();
            renderDetailTeamTab(trip);
            renderDashboard();
            renderTripsGrid();
          }
        } else if (action === 'remove-itin') {
          const itinId = actionBtn.getAttribute('data-itin-id');
          const trip = State.trips.find(t => t.id === State.activeTripId);
          if (trip && trip.itinerary) {
            trip.itinerary = trip.itinerary.filter(i => i.id !== itinId);
            saveTripsToStorage();
            renderDetailItineraryTab(trip);
            renderDashboard();
            renderTripsGrid();
          }
        } else if (action === 'toggle-trip-chk') {
          const itemId = actionBtn.getAttribute('data-item-id');
          const trip = State.trips.find(t => t.id === State.activeTripId);
          if (trip && trip.checklist) {
            const it = trip.checklist.find(i => i.id === itemId);
            if (it) it.completed = actionBtn.checked;
            saveTripsToStorage();
            renderDetailChecklistTab(trip);
            renderDashboard();
            renderTripsGrid();
          }
        } else if (action === 'toggle-master-chk') {
          const itemId = actionBtn.getAttribute('data-item-id');
          const tripSelect = document.getElementById('checklistTripSelect');
          if (tripSelect) {
            const trip = State.trips.find(t => t.id === tripSelect.value);
            if (trip && trip.checklist) {
              const it = trip.checklist.find(i => i.id === itemId);
              if (it) it.completed = actionBtn.checked;
              saveTripsToStorage();
              renderChecklistSection();
              renderDashboard();
              renderTripsGrid();
            }
          }
        } else if (action === 'delete-master-chk') {
          const itemId = actionBtn.getAttribute('data-item-id');
          const tripSelect = document.getElementById('checklistTripSelect');
          if (tripSelect) {
            const trip = State.trips.find(t => t.id === tripSelect.value);
            if (trip && trip.checklist) {
              trip.checklist = trip.checklist.filter(i => i.id !== itemId);
              saveTripsToStorage();
              renderChecklistSection();
            }
          }
        } else if (action === 'remove-staging-photo') {
          const idx = parseInt(actionBtn.getAttribute('data-idx'), 10);
          State.reportPhotoStaging.splice(idx, 1);
          renderReportPhotosStaging();
        }
      }

      // Calendar pill click
      const calPill = e.target.closest('.cal-trip-pill');
      if (calPill) {
        const tripId = calPill.getAttribute('data-trip-id');
        if (tripId) openTripDetailModal(tripId);
      }
    });

    // Language pills in header
    document.getElementById('langEnBtn')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('langBnBtn')?.addEventListener('click', () => setLanguage('bn'));
    document.getElementById('setLangEnBtn')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('setLangBnBtn')?.addEventListener('click', () => setLanguage('bn'));

    // Mobile menu toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('mobileNav')?.classList.toggle('open');
    });

    // Header buttons
    document.getElementById('openAddModalBtn')?.addEventListener('click', () => openTripModal());
    document.getElementById('dashAddTripBtn')?.addEventListener('click', () => openTripModal());
    document.getElementById('addTripSectionBtn')?.addEventListener('click', () => openTripModal());
    document.getElementById('emptyStateAddBtn')?.addEventListener('click', () => openTripModal());

    // Search and Sort
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    searchInput?.addEventListener('input', e => {
      State.searchQuery = e.target.value;
      if (clearSearchBtn) clearSearchBtn.classList.toggle('visible', !!State.searchQuery);
      renderTripsGrid();
    });

    clearSearchBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      State.searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      renderTripsGrid();
    });

    document.getElementById('sortSelect')?.addEventListener('change', e => {
      State.sortMode = e.target.value;
      renderTripsGrid();
    });

    // Filter Chips
    document.getElementById('filterChips')?.addEventListener('click', e => {
      const chip = e.target.closest('.filter-chip');
      if (chip) {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        State.currentFilter = chip.getAttribute('data-filter');
        renderTripsGrid();
      }
    });

    // Calendar navigation
    document.getElementById('calPrevBtn')?.addEventListener('click', () => {
      State.calMonthDate = new Date(State.calMonthDate.getFullYear(), State.calMonthDate.getMonth() - 1, 1);
      renderCalendar();
    });

    document.getElementById('calNextBtn')?.addEventListener('click', () => {
      State.calMonthDate = new Date(State.calMonthDate.getFullYear(), State.calMonthDate.getMonth() + 1, 1);
      renderCalendar();
    });

    document.getElementById('calTodayBtn')?.addEventListener('click', () => {
      State.calMonthDate = new Date();
      renderCalendar();
    });

    // Budget select and form
    document.getElementById('budgetTripSelect')?.addEventListener('change', () => {
      renderBudgetSection();
    });

    document.getElementById('budgetCategoryForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const tripId = document.getElementById('budgetTripSelect')?.value;
      const trip = State.trips.find(t => t.id === tripId);
      if (!trip) return;

      if (!trip.budget) trip.budget = {};

      BUDGET_CATEGORIES.forEach(cat => {
        const estVal = parseFloat(e.target.elements[`est_${cat.key}`]?.value) || 0;
        const actVal = parseFloat(e.target.elements[`act_${cat.key}`]?.value) || 0;
        trip.budget[cat.key] = { est: estVal, act: actVal };
      });

      saveTripsToStorage();
      logActivity('Budget Updated', `Expenses revised for ${trip.name}`);
      showToast('Budget categories saved successfully', 'success');
      renderBudgetSection();
      renderDashboard();
    });

    // Checklist add custom item
    document.getElementById('checklistTripSelect')?.addEventListener('change', () => {
      renderChecklistSection();
    });

    document.getElementById('addChecklistForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const textInput = document.getElementById('chkItemText');
      const catInput = document.getElementById('chkItemCategory');
      const tripSelect = document.getElementById('checklistTripSelect');

      if (!tripSelect) return;
      const trip = State.trips.find(t => t.id === tripSelect.value);
      if (!trip) return;

      const newItem = {
        id: 'ck_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        category: catInput ? catInput.value : 'Other',
        text: textInput ? textInput.value.trim() : '',
        completed: false
      };

      if (!trip.checklist) trip.checklist = [];
      trip.checklist.push(newItem);
      saveTripsToStorage();
      if (textInput) textInput.value = '';

      showToast('Checklist item added', 'info');
      renderChecklistSection();
      renderDashboard();
    });

    // Reports section buttons
    document.getElementById('newReportBtn')?.addEventListener('click', () => openCreateReportModal());
    document.getElementById('emptyStateReportBtn')?.addEventListener('click', () => openCreateReportModal());

    // Report stars click
    document.getElementById('starRatingWrap')?.addEventListener('click', e => {
      const star = e.target.closest('.star-btn');
      if (star) {
        const val = parseInt(star.getAttribute('data-val'), 10);
        setReportRating(val);
      }
    });

    // Report photo upload
    document.getElementById('reportPhotoUploadInput')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        compressImage(evt.target.result, 600, 0.7, compressedDataUrl => {
          State.reportPhotoStaging.push(compressedDataUrl);
          renderReportPhotosStaging();
        });
      };
      reader.readAsDataURL(file);
    });

    // Report form submit
    document.getElementById('reportForm')?.addEventListener('submit', handleSaveReportForm);

    // Trip modal close & submit
    document.getElementById('closeTripModalBtn')?.addEventListener('click', closeTripModal);
    document.getElementById('cancelTripModalBtn')?.addEventListener('click', closeTripModal);
    document.getElementById('tripForm')?.addEventListener('submit', handleSaveTripForm);

    // Trip modal presets click
    document.getElementById('presetImagesRow')?.addEventListener('click', e => {
      const btn = e.target.closest('.preset-chip');
      if (btn) {
        const idx = parseInt(btn.getAttribute('data-preset-idx'), 10);
        State.selectedCoverUrl = PRESET_COVERS[idx].url;
        updateModalImagePreview(State.selectedCoverUrl);
      }
    });

    // Trip image local upload
    document.getElementById('tripImageUploadInput')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        compressImage(evt.target.result, 800, 0.75, compressedUrl => {
          State.selectedCoverUrl = compressedUrl;
          updateModalImagePreview(State.selectedCoverUrl);
        });
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('removeTripImageBtn')?.addEventListener('click', () => {
      State.selectedCoverUrl = '';
      updateModalImagePreview('');
    });

    // Trip Detail Modal Tab clicks
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchDetailTab(btn.getAttribute('data-tab'));
      });
    });

    document.getElementById('closeDetailModalBtn')?.addEventListener('click', closeTripDetailModal);
    document.getElementById('closeDetailModalBtn2')?.addEventListener('click', closeTripDetailModal);

    // Detail Action Buttons
    document.getElementById('detailEditTripBtn')?.addEventListener('click', () => {
      const id = State.activeTripId;
      closeTripDetailModal();
      openTripModal(id);
    });

    document.getElementById('detailFavBtn')?.addEventListener('click', () => {
      const trip = State.trips.find(t => t.id === State.activeTripId);
      if (trip) {
        trip.isFavorite = !trip.isFavorite;
        saveTripsToStorage();
        document.getElementById('detailFavBtn')?.classList.toggle('active', !!trip.isFavorite);
        renderTripsGrid();
        renderDashboard();
      }
    });

    document.getElementById('detailDuplicateTripBtn')?.addEventListener('click', () => {
      const trip = State.trips.find(t => t.id === State.activeTripId);
      if (trip) {
        const dup = JSON.parse(JSON.stringify(trip));
        dup.id = 'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        dup.name = `${trip.name} (Copy)`;
        dup.status = 'Planned';
        dup.report = null;
        dup.createdAt = new Date().toISOString();
        dup.updatedAt = new Date().toISOString();
        State.trips.unshift(dup);
        saveTripsToStorage();
        logActivity('Trip Duplicated', `Duplicated: ${dup.name}`);
        showToast('Trip duplicated successfully!', 'success');
        closeTripDetailModal();
        renderAllViews();
      }
    });

    document.getElementById('detailToggleCompleteBtn')?.addEventListener('click', () => {
      const trip = State.trips.find(t => t.id === State.activeTripId);
      if (trip) {
        if (trip.status === 'Completed') {
          trip.status = 'Planned';
          showToast('Status reverted to Planned', 'info');
        } else {
          trip.status = 'Completed';
          showToast('Trip marked as Completed!', 'success');
        }
        trip.updatedAt = new Date().toISOString();
        saveTripsToStorage();
        renderAllViews();
        openTripDetailModal(trip.id);
      }
    });

    document.getElementById('detailDeleteTripBtn')?.addEventListener('click', () => {
      const trip = State.trips.find(t => t.id === State.activeTripId);
      if (trip) {
        openConfirmModal('Delete Field Trip?', t('confirmDeleteTrip'), () => {
          State.trips = State.trips.filter(t => t.id !== trip.id);
          saveTripsToStorage();
          logActivity('Trip Deleted', `Removed ${trip.name}`);
          showToast('Trip deleted.', 'info');
          closeConfirmModal();
          closeTripDetailModal();
          renderAllViews();
        });
      }
    });

    // Detail Inline Forms
    document.getElementById('addTeamMemberForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const trip = State.trips.find(t => t.id === State.activeTripId);
      if (!trip) return;

      const name = document.getElementById('memberNameInput')?.value.trim();
      const role = document.getElementById('memberRoleInput')?.value.trim();
      const contactNote = document.getElementById('memberContactInput')?.value.trim();

      if (!trip.team) trip.team = [];
      trip.team.push({
        id: 'tm_' + Date.now(),
        name, role, contactNote
      });

      trip.participantsCount = trip.team.length;
      saveTripsToStorage();
      document.getElementById('addTeamMemberForm')?.reset();
      renderDetailTeamTab(trip);
      renderDashboard();
      renderTripsGrid();
      showToast('Team member added', 'success');
    });

    document.getElementById('addItineraryForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const trip = State.trips.find(t => t.id === State.activeTripId);
      if (!trip) return;

      const day = parseInt(document.getElementById('itinDayInput')?.value, 10) || 1;
      const time = document.getElementById('itinTimeInput')?.value.trim();
      const location = document.getElementById('itinLocationInput')?.value.trim();
      const activity = document.getElementById('itinActivityInput')?.value.trim();
      const responsible = document.getElementById('itinResponsibleInput')?.value.trim();

      if (!trip.itinerary) trip.itinerary = [];
      trip.itinerary.push({
        id: 'it_' + Date.now(),
        day, time, location, activity, responsible, completed: false
      });

      saveTripsToStorage();
      document.getElementById('addItineraryForm')?.reset();
      renderDetailItineraryTab(trip);
      renderDashboard();
      renderTripsGrid();
      showToast('Itinerary activity scheduled', 'success');
    });

    document.getElementById('jumpToBudgetPlannerBtn')?.addEventListener('click', () => {
      const tripId = State.activeTripId;
      closeTripDetailModal();
      switchSection('budget');
      const tripSelect = document.getElementById('budgetTripSelect');
      if (tripSelect) {
        tripSelect.value = tripId;
        renderBudgetSection();
      }
    });

    document.getElementById('jumpToChecklistModuleBtn')?.addEventListener('click', () => {
      const tripId = State.activeTripId;
      closeTripDetailModal();
      switchSection('checklist');
      const tripSelect = document.getElementById('checklistTripSelect');
      if (tripSelect) {
        tripSelect.value = tripId;
        renderChecklistSection();
      }
    });

    // Detail Report triggers
    document.addEventListener('click', e => {
      if (e.target.id === 'detailCreateReportBtn') {
        const id = State.activeTripId;
        closeTripDetailModal();
        openCreateReportModal(id);
      } else if (e.target.id === 'detailViewReportBtn') {
        const id = State.activeTripId;
        openViewReportModal(id);
      } else if (e.target.id === 'smartOpenTripBtn') {
        const tripId = e.target.getAttribute('data-trip-id');
        const sModal = document.getElementById('smartModalBackdrop');
        if (sModal) {
          sModal.setAttribute('hidden', '');
          sModal.style.display = 'none';
        }
        openTripDetailModal(tripId);
      }
    });

    // Smart Planner Advisor
    const openSmartModal = () => {
      document.getElementById('smartResultsContainer')?.classList.add('hidden');
      const modal = document.getElementById('smartModalBackdrop');
      if (modal) {
        modal.removeAttribute('hidden');
        modal.style.display = 'flex';
      }
    };

    document.getElementById('smartPlannerBtn')?.addEventListener('click', openSmartModal);
    document.getElementById('dashSmartPlanBtn')?.addEventListener('click', openSmartModal);

    document.getElementById('closeSmartModalBtn')?.addEventListener('click', () => {
      const modal = document.getElementById('smartModalBackdrop');
      if (modal) {
        modal.setAttribute('hidden', '');
        modal.style.display = 'none';
      }
    });

    document.getElementById('smartRecommenderForm')?.addEventListener('submit', e => {
      e.preventDefault();
      runSmartRecommender();
    });

    // Settings actions
    document.getElementById('currencySelect')?.addEventListener('change', e => {
      State.settings.currency = e.target.value;
      saveSettingsToStorage();
      renderAllViews();
      showToast(`Currency changed to ${State.settings.currency}`, 'info');
    });

    document.getElementById('exportBackupBtn')?.addEventListener('click', exportBackupJson);

    document.getElementById('importBackupInput')?.addEventListener('change', e => {
      importBackupJson(e.target.files[0]);
    });

    document.getElementById('resetDemoBtn')?.addEventListener('click', () => {
      openConfirmModal('Reset Demo Data?', t('confirmResetDemo'), () => {
        State.trips = JSON.parse(JSON.stringify(SAMPLE_TRIPS));
        saveTripsToStorage();
        closeConfirmModal();
        renderAllViews();
        showToast('Sample organizational trips restored', 'success');
      });
    });

    document.getElementById('clearAllDataBtn')?.addEventListener('click', () => {
      openConfirmModal('Clear All Data?', t('confirmClearData'), () => {
        State.trips = [];
        State.activities = [];
        saveTripsToStorage();
        saveActivitiesToStorage();
        closeConfirmModal();
        renderAllViews();
        showToast('All local storage data cleared.', 'info');
      });
    });

    document.getElementById('clearActivityLogBtn')?.addEventListener('click', () => {
      State.activities = [];
      saveActivitiesToStorage();
      renderActivityFeed();
      showToast('Activity timeline cleared', 'info');
    });

    // Modals Backdrop close on escape or click outside
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeTripModal();
        closeTripDetailModal();
        closeConfirmModal();
        const rModal = document.getElementById('reportModalBackdrop');
        if (rModal) { rModal.setAttribute('hidden', ''); rModal.style.display = 'none'; }
        const vModal = document.getElementById('viewReportModalBackdrop');
        if (vModal) { vModal.setAttribute('hidden', ''); vModal.style.display = 'none'; }
        const sModal = document.getElementById('smartModalBackdrop');
        if (sModal) { sModal.setAttribute('hidden', ''); sModal.style.display = 'none'; }
      }
    });

    document.getElementById('closeReportModalBtn')?.addEventListener('click', () => {
      const rModal = document.getElementById('reportModalBackdrop');
      if (rModal) { rModal.setAttribute('hidden', ''); rModal.style.display = 'none'; }
    });

    document.getElementById('cancelReportModalBtn')?.addEventListener('click', () => {
      const rModal = document.getElementById('reportModalBackdrop');
      if (rModal) { rModal.setAttribute('hidden', ''); rModal.style.display = 'none'; }
    });

    document.getElementById('closeViewReportModalBtn')?.addEventListener('click', () => {
      const vModal = document.getElementById('viewReportModalBackdrop');
      if (vModal) { vModal.setAttribute('hidden', ''); vModal.style.display = 'none'; }
    });

    document.getElementById('printReportBtn')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('confirmCancelBtn')?.addEventListener('click', closeConfirmModal);
    document.getElementById('confirmAcceptBtn')?.addEventListener('click', () => {
      if (typeof confirmCallback === 'function') confirmCallback();
    });
  }

  // ==========================================================================
  // 21. IMAGE COMPRESSION UTILITY (CLIENT-SIDE)
  // ==========================================================================
  function compressImage(dataUrl, maxDimension, quality, callback) {
    const img = new Image();
    img.onload = function () {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      callback(compressed);
    };
    img.src = dataUrl;
  }

  // ==========================================================================
  // 22. INITIALIZATION
  // ==========================================================================
  function init() {
    loadFromStorage();
    setupEventListeners();
    updateDomTranslations();
    renderAllViews();

    if (window.location && window.location.hash) {
      const hashSection = window.location.hash.replace('#', '');
      const valid = ['dashboard', 'trips', 'calendar', 'budget', 'checklist', 'reports', 'settings'];
      if (valid.includes(hashSection)) {
        switchSection(hashSection);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for testing purposes
  window.WanderWise = {
    State,
    calculateTripReadiness,
    t,
    SAMPLE_TRIPS
  };

})();
