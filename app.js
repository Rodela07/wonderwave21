/**
 * DREAM PLACES — Main Application Logic
 * Pure Vanilla JavaScript (ES6+) with localStorage persistence.
 */
(() => {
  'use strict';

  // --- Constants ---
  const STORAGE_KEY = 'dream_places_data_v2';

  const BUDGET_CATEGORIES = ['flight', 'accommodation', 'food', 'transport', 'activities', 'shopping', 'other'];

  const BUDGET_LABELS = {
    flight: '✈️ Flight',
    accommodation: '🏨 Accommodation',
    food: '🍜 Food',
    transport: '🚕 Transport',
    activities: '🎟️ Activities',
    shopping: '🛍️ Shopping',
    other: '📦 Other'
  };

  const DEFAULT_PACKING = [
    'Passport',
    'Clothes',
    'Charger',
    'Medicine',
    'Toiletries',
    'Travel documents',
    'Wallet',
    'Shoes'
  ];

  const DEFAULT_PLACES = [
    {
      id: 'dp-sample-1',
      name: 'Kyoto',
      country: 'Japan',
      note: 'Walk through the thousands of vermilion torii gates at Fushimi Inari and see the cherry blossoms in full bloom 🌸',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      imageData: null,
      priority: 'high',
      status: 'planning',
      favorite: true,
      date: '2025-04-10',
      days: 8,
      travelers: 2,
      moods: ['photography', 'culture', 'relaxing'],
      budget: { flight: 55000, accommodation: 20000, food: 12000, transport: 6000, activities: 8000, shopping: 10000, other: 3000 },
      userBudget: 120000,
      itinerary: [
        { day: 1, activities: ['✈️ Arrive Kansai Airport & train to Kyoto', '🏨 Check into Ryokan', '🌆 Evening stroll along Gion'] },
        { day: 2, activities: ['⛩️ Fushimi Inari Taisha early morning', '🍜 Local Matcha & Ramen in Nishiki Market', '🎋 Arashiyama Bamboo Grove'] }
      ],
      packing: DEFAULT_PACKING.map((item, i) => ({ item, checked: i < 5 })),
      memory: null,
      createdAt: Date.now() - 86400000 * 5
    },
    {
      id: 'dp-sample-2',
      name: 'Santorini',
      country: 'Greece',
      note: 'Watch the legendary sunset from Oia cliffside with white-washed houses and cobalt blue domes over the Aegean Sea 🌅',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      imageData: null,
      priority: 'high',
      status: 'upcoming',
      favorite: true,
      date: '2025-07-15',
      days: 6,
      travelers: 2,
      moods: ['romantic', 'photography', 'beach', 'relaxing'],
      budget: { flight: 65000, accommodation: 35000, food: 15000, transport: 8000, activities: 10000, shopping: 7000, other: 5000 },
      userBudget: 150000,
      itinerary: [
        { day: 1, activities: ['✈️ Arrive Santorini (Thira)', '🏨 Check into cave hotel', '🌅 Sunset dinner in Oia'] },
        { day: 2, activities: ['⛵ Catamaran sailing in Caldera', '🍷 Local Assyrtiko wine tasting'] }
      ],
      packing: DEFAULT_PACKING.map((item, i) => ({ item, checked: i < 6 })),
      memory: null,
      createdAt: Date.now() - 86400000 * 4
    },
    {
      id: 'dp-sample-3',
      name: 'Banff National Park',
      country: 'Canada',
      note: 'Canoe on the glacier-fed turquoise waters of Lake Louise and hike beneath towering snow-capped peaks 🛶',
      imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
      imageData: null,
      priority: 'medium',
      status: 'dream',
      favorite: false,
      date: '2026-06-20',
      days: 7,
      travelers: 2,
      moods: ['adventure', 'nature', 'photography'],
      budget: { flight: 70000, accommodation: 40000, food: 20000, transport: 10000, activities: 12000, shopping: 5000, other: 5000 },
      userBudget: 165000,
      itinerary: [],
      packing: DEFAULT_PACKING.map(item => ({ item, checked: false })),
      memory: null,
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'dp-sample-4',
      name: 'Amalfi Coast',
      country: 'Italy',
      note: 'Drive along the sheer coastal cliffs, explore Positano pastel villas, and taste fresh lemon gelato on the terrace 🍋',
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      imageData: null,
      priority: 'high',
      status: 'dream',
      favorite: true,
      date: '2025-09-12',
      days: 6,
      travelers: 2,
      moods: ['romantic', 'photography', 'food'],
      budget: { flight: 60000, accommodation: 30000, food: 15000, transport: 8000, activities: 8000, shopping: 6000, other: 4000 },
      userBudget: 130000,
      itinerary: [],
      packing: DEFAULT_PACKING.map(item => ({ item, checked: false })),
      memory: null,
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'dp-sample-5',
      name: 'Swiss Alps (Zermatt)',
      country: 'Switzerland',
      note: 'Take the scenic cogwheel railway up to Gornergrat and wake up to the majestic sunrise over the Matterhorn 🏔️',
      imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      imageData: null,
      priority: 'low',
      status: 'visited',
      favorite: false,
      date: '2024-01-20',
      days: 7,
      travelers: 2,
      moods: ['adventure', 'nature', 'photography'],
      budget: { flight: 75000, accommodation: 45000, food: 20000, transport: 10000, activities: 12000, shopping: 5000, other: 5000 },
      userBudget: 175000,
      itinerary: [
        { day: 1, activities: ['🚆 Scenic train to Zermatt (car-free village)', '🏨 Alpine lodge check-in', '🧀 Swiss fondue dinner'] }
      ],
      packing: DEFAULT_PACKING.map(item => ({ item, checked: true })),
      memory: {
        rating: 5,
        moment: 'Standing at Gornergrat watching golden morning sunlight strike the tip of the Matterhorn was breathtaking.',
        liked: 'Crisp mountain air, pristine ski slopes, and peaceful car-free village atmosphere.',
        visitedOn: '2024-01-20',
        again: 'yes'
      },
      createdAt: Date.now() - 86400000 * 15
    },
    {
      id: 'dp-sample-6',
      name: 'Cappadocia',
      country: 'Turkey',
      note: 'Float in a colorful hot air balloon across lunar valleys and ancient fairy chimneys at sunrise ✨',
      imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=80',
      imageData: null,
      priority: 'medium',
      status: 'dream',
      favorite: false,
      date: '2025-10-05',
      days: 5,
      travelers: 2,
      moods: ['adventure', 'photography', 'culture'],
      budget: { flight: 45000, accommodation: 18000, food: 8000, transport: 5000, activities: 12000, shopping: 4000, other: 3000 },
      userBudget: 98000,
      itinerary: [],
      packing: DEFAULT_PACKING.map(item => ({ item, checked: false })),
      memory: null,
      createdAt: Date.now() - 86400000 * 1
    }
  ];

  // --- State ---
  let places = [];
  let filters = {
    search: '',
    priority: 'all',     // 'all' | 'high' | 'medium' | 'low'
    status: 'all',       // 'all' | 'dream' | 'planning' | 'upcoming' | 'visited'
    favoriteOnly: false, // boolean
    sortBy: 'newest'     // 'newest' | 'oldest' | 'priority-desc' | 'name-asc' | 'country-asc'
  };
  let editingId = null;
  let deletingId = null;
  let detailPlace = null;
  let formPhotoData = null;
  let formSelectedMoods = [];
  let formRating = 0;
  let formMemAgain = 'yes';

  // --- Storage ---
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          places = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    places = structuredClone(DEFAULT_PLACES);
    saveData();
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (e) {
      console.warn('Storage quota warning, reducing base64 photos...');
      const simplified = places.map(p => ({ ...p, imageData: null }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(simplified));
      } catch (e2) {}
    }
  }

  // --- Utilities ---
  function genId() {
    return 'dp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatCurrency(val) {
    const n = Number(val) || 0;
    return '৳' + n.toLocaleString('en-IN');
  }

  function calcBudgetTotal(budget) {
    if (!budget || typeof budget !== 'object') return 0;
    return BUDGET_CATEGORIES.reduce((sum, k) => sum + (Number(budget[k]) || 0), 0);
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / 86400000);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  function getPlaceImage(place) {
    return place.imageData || place.imageUrl || null;
  }

  function calcReadiness(place) {
    const checks = [
      { done: !!(place.name && place.country), label: 'Destination selected' },
      { done: !!place.date, label: 'Travel date set' },
      { done: calcBudgetTotal(place.budget) > 0, label: 'Budget planned' },
      { done: !!(place.itinerary && place.itinerary.some(d => d.activities && d.activities.length > 0)), label: 'Itinerary created' },
      { done: !!(place.packing && place.packing.some(p => p.checked)), label: 'Packing checklist started' },
      { done: (place.days > 0 && place.travelers > 0), label: 'Trip duration & travelers entered' }
    ];
    const completed = checks.filter(c => c.done).length;
    const pct = Math.round((completed / checks.length) * 100);
    return { completed, total: checks.length, pct, checks };
  }

  function compressImage(file, maxDim = 800) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  // --- Toast Notifications ---
  function toast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.innerHTML = `
      <span>${type === 'danger' ? '🗑️' : type === 'warning' ? '⚠️' : '✓'}</span>
      <span>${escHtml(msg)}</span>
    `;
    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      toastEl.style.transition = 'all 0.25s ease';
      setTimeout(() => toastEl.remove(), 250);
    }, 3000);
  }

  // --- Modal Helpers ---
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('open');
      el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  // --- Render Functions ---
  function updateStats() {
    const total = places.length;
    const countries = new Set(places.map(p => (p.country || '').trim().toLowerCase()).filter(Boolean)).size;
    const planned = places.filter(p => p.status === 'planning' || p.status === 'upcoming').length;
    const visited = places.filter(p => p.status === 'visited').length;
    const totalBudget = places.reduce((sum, p) => sum + calcBudgetTotal(p.budget), 0);

    const statTotal = document.getElementById('statTotalPlaces');
    const statCountries = document.getElementById('statTotalCountries');
    const statPlanned = document.getElementById('statPlannedTrips');
    const statVisited = document.getElementById('statVisitedPlaces');
    const statBudget = document.getElementById('statTotalBudget');

    if (statTotal) statTotal.textContent = total;
    if (statCountries) statCountries.textContent = countries;
    if (statPlanned) statPlanned.textContent = planned;
    if (statVisited) statVisited.textContent = visited;
    if (statBudget) statBudget.textContent = formatCurrency(totalBudget);
  }

  function renderPlaces() {
    let filtered = [...places];

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.country && p.country.toLowerCase().includes(q)) ||
        (p.note && p.note.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(p => p.priority === filters.priority);
    }

    // Favorite filter
    if (filters.favoriteOnly) {
      filtered = filtered.filter(p => p.favorite);
    }

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (filters.sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      if (filters.sortBy === 'priority-desc') {
        const weights = { high: 3, medium: 2, low: 1 };
        return (weights[b.priority] || 0) - (weights[a.priority] || 0);
      }
      if (filters.sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (filters.sortBy === 'country-asc') return (a.country || '').localeCompare(b.country || '');
      return 0;
    });

    const grid = document.getElementById('placesGrid');
    const empty = document.getElementById('emptyState');
    const counter = document.getElementById('resultsCountNum');

    if (counter) counter.textContent = filtered.length;

    if (filtered.length === 0) {
      if (grid) grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
    } else {
      if (empty) empty.style.display = 'none';
      if (grid) {
        grid.innerHTML = filtered.map(place => renderPlaceCard(place)).join('');
        attachCardListeners(grid);
      }
    }
  }

  function renderPlaceCard(place) {
    const imgSrc = getPlaceImage(place);
    const total = calcBudgetTotal(place.budget);
    const days = place.date ? daysUntil(place.date) : null;
    const isVisited = place.status === 'visited';
    const stars = place.memory?.rating ? '★'.repeat(place.memory.rating) + '☆'.repeat(5 - place.memory.rating) : '';

    return `
      <article class="place-card" data-id="${place.id}">
        <div class="card-image-wrap" data-action="view" data-id="${place.id}">
          ${imgSrc 
            ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(place.name)}" class="card-image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="card-image-placeholder" style="display:none;">✈️</div>`
            : `<div class="card-image-placeholder">✈️</div>`
          }
          <div class="card-badges-top">
            <span class="card-priority-badge ${place.priority || 'medium'}">${(place.priority || 'medium').toUpperCase()}</span>
            <span class="card-status-badge ${place.status || 'dream'}">${place.status ? place.status.toUpperCase() : 'DREAM'}</span>
          </div>
          <button class="btn-fav-card" data-action="toggle-fav" data-id="${place.id}" title="${place.favorite ? 'Remove favorite' : 'Add favorite'}">
            ${place.favorite ? '❤️' : '🤍'}
          </button>
        </div>

        <div class="card-body">
          <div class="card-country">${escHtml(place.country)}</div>
          <h3 class="card-title" data-action="view" data-id="${place.id}">${escHtml(place.name)}</h3>
          ${isVisited && stars ? `<div class="card-stars">${stars}</div>` : ''}
          ${place.note ? `<p class="card-note">${escHtml(place.note)}</p>` : ''}

          <div class="card-meta-row">
            ${place.date ? `<span>🗓️ ${formatDate(place.date)}</span>` : ''}
            ${days !== null && days >= 0 ? `<span>⏰ ${days}d away</span>` : ''}
            ${place.days ? `<span>📅 ${place.days} days</span>` : ''}
            ${total > 0 ? `<span class="card-budget-badge">💰 ${formatCurrency(total)}</span>` : ''}
          </div>

          <div class="card-actions-bar">
            <button class="card-btn primary" data-action="view" data-id="${place.id}">👁️ View</button>
            <button class="card-btn" data-action="edit" data-id="${place.id}">✏️ Edit</button>
            <button class="card-btn danger" data-action="delete" data-id="${place.id}" title="Delete">🗑️</button>
          </div>
        </div>
      </article>
    `;
  }

  function attachCardListeners(container) {
    container.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const action = el.dataset.action;
        const id = el.dataset.id;
        if (action === 'view') openDetailModal(id);
        else if (action === 'edit') openEditModal(id);
        else if (action === 'delete') openDeleteModal(id);
        else if (action === 'toggle-fav') toggleFavorite(id);
      });
    });
  }

  // --- Favorite Toggle ---
  function toggleFavorite(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    place.favorite = !place.favorite;
    saveData();
    renderPlaces();
    updateStats();
    toast(place.favorite ? `Added ${place.name} to favorites ❤️` : `Removed ${place.name} from favorites`);
  }

  // --- Add / Edit Modal ---
  function openAddModal() {
    editingId = null;
    formPhotoData = null;
    formSelectedMoods = [];
    formRating = 0;
    formMemAgain = 'yes';

    document.getElementById('modalTitle').textContent = 'Add a Dream Place';
    document.getElementById('modalSubtitle').textContent = 'Fill in the details to add this destination to your bucket list.';
    document.getElementById('saveBtnText').textContent = 'Save Place';
    document.getElementById('placeIdInput').value = '';
    document.getElementById('placeForm').reset();
    document.getElementById('noteCharCounter').textContent = '0/500';

    resetPhotoUI();
    resetMoodChipsUI();
    resetStarPicker(0);
    resetMemorySection(false);
    updateFormBudgetSummary();

    clearFormErrors();
    openModal('placeModalBackdrop');
    setTimeout(() => document.getElementById('placeNameInput')?.focus(), 100);
  }

  function openEditModal(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;

    editingId = id;
    formPhotoData = place.imageData || null;
    formSelectedMoods = [...(place.moods || [])];
    formRating = place.memory?.rating || 0;
    formMemAgain = place.memory?.again || 'yes';

    document.getElementById('modalTitle').textContent = 'Edit Dream Place';
    document.getElementById('modalSubtitle').textContent = 'Update your travel details, budget, or notes.';
    document.getElementById('saveBtnText').textContent = 'Update Place';
    document.getElementById('placeIdInput').value = place.id;
    document.getElementById('placeNameInput').value = place.name || '';
    document.getElementById('countryInput').value = place.country || '';
    document.getElementById('noteInput').value = place.note || '';
    document.getElementById('noteCharCounter').textContent = `${(place.note || '').length}/500`;
    document.getElementById('imageUrlInput').value = place.imageUrl || '';
    document.getElementById('travelDateInput').value = place.date || '';
    document.getElementById('travelDaysInput').value = place.days || '';
    document.getElementById('travelersCountInput').value = place.travelers || '';
    document.getElementById('statusSelectInput').value = place.status || 'dream';

    // Priority Radio
    const pRadio = document.querySelector(`input[name="priority"][value="${place.priority || 'medium'}"]`);
    if (pRadio) pRadio.checked = true;

    // Favorite checkbox
    document.getElementById('favoriteCheckbox').checked = !!place.favorite;

    // Budget Inputs
    BUDGET_CATEGORIES.forEach(cat => {
      const el = document.getElementById('fBudget' + cat.charAt(0).toUpperCase() + cat.slice(1));
      if (el) el.value = place.budget?.[cat] || '';
    });
    document.getElementById('fBudgetUserBudget').value = place.userBudget || '';
    updateFormBudgetSummary();

    // Photo Preview
    const imgSrc = getPlaceImage(place);
    if (imgSrc) showPhotoPreview(imgSrc);
    else resetPhotoUI();

    // Moods
    resetMoodChipsUI();
    document.querySelectorAll('#formMoodChips .mood-select-chip').forEach(chip => {
      if (formSelectedMoods.includes(chip.dataset.mood)) chip.classList.add('selected');
    });

    // Memory section
    if (place.status === 'visited') {
      resetMemorySection(true);
      document.getElementById('fMemRatingInput').value = place.memory?.rating || 0;
      document.getElementById('fMemMomentInput').value = place.memory?.moment || '';
      document.getElementById('fMemLikedInput').value = place.memory?.liked || '';
      document.getElementById('fMemVisitedOnInput').value = place.memory?.visitedOn || '';
      resetStarPicker(place.memory?.rating || 0);
      setMemoryAgainUI(place.memory?.again || 'yes');
    } else {
      resetMemorySection(false);
    }

    clearFormErrors();
    openModal('placeModalBackdrop');
  }

  function resetPhotoUI() {
    document.getElementById('modalPhotoPreviewWrap').style.display = 'none';
    document.getElementById('modalPhotoPreviewImg').src = '';
    document.getElementById('imageUrlInput').value = '';
    document.getElementById('photoFileInput').value = '';
  }

  function showPhotoPreview(src) {
    document.getElementById('modalPhotoPreviewImg').src = src;
    document.getElementById('modalPhotoPreviewWrap').style.display = 'block';
  }

  function resetMoodChipsUI() {
    document.querySelectorAll('#formMoodChips .mood-select-chip').forEach(c => c.classList.remove('selected'));
  }

  function resetStarPicker(rating) {
    formRating = rating;
    document.getElementById('fMemRatingInput').value = rating;
    document.querySelectorAll('#modalStarPicker .star-pick-btn').forEach((s, i) => {
      s.classList.toggle('active', i < rating);
    });
  }

  function resetMemorySection(visible) {
    document.getElementById('formMemorySection').style.display = visible ? 'block' : 'none';
  }

  function setMemoryAgainUI(val) {
    formMemAgain = val;
    document.getElementById('fMemAgainInput').value = val;
    document.getElementById('fMemAgainYesBtn').classList.toggle('active', val === 'yes');
    document.getElementById('fMemAgainNoBtn').classList.toggle('active', val === 'no');
  }

  function clearFormErrors() {
    document.querySelectorAll('.field-error.visible').forEach(e => e.classList.remove('visible'));
    document.querySelectorAll('.form-control.error').forEach(e => e.classList.remove('error'));
  }

  function updateFormBudgetSummary() {
    let total = 0;
    BUDGET_CATEGORIES.forEach(cat => {
      const el = document.getElementById('fBudget' + cat.charAt(0).toUpperCase() + cat.slice(1));
      if (el) total += Math.max(0, parseFloat(el.value) || 0);
    });

    const totalEl = document.getElementById('formBudgetEstimatedTotal');
    if (totalEl) totalEl.textContent = formatCurrency(total);

    const userBudget = parseFloat(document.getElementById('fBudgetUserBudget')?.value) || 0;
    const diffBadge = document.getElementById('formBudgetDiffBadge');
    if (diffBadge) {
      if (userBudget > 0) {
        diffBadge.style.display = 'inline-block';
        const diff = total - userBudget;
        if (diff > 0) {
          diffBadge.className = 'budget-diff-badge over';
          diffBadge.textContent = `🔴 ${formatCurrency(diff)} Over budget`;
        } else if (diff < 0) {
          diffBadge.className = 'budget-diff-badge under';
          diffBadge.textContent = `🟢 ${formatCurrency(Math.abs(diff))} Remaining`;
        } else {
          diffBadge.className = 'budget-diff-badge under';
          diffBadge.textContent = `✓ Exactly on budget`;
        }
      } else {
        diffBadge.style.display = 'none';
      }
    }
  }

  function validateAndSavePlace(e) {
    if (e) e.preventDefault();
    clearFormErrors();
    let valid = true;

    const nameInput = document.getElementById('placeNameInput');
    const countryInput = document.getElementById('countryInput');
    const name = nameInput.value.trim();
    const country = countryInput.value.trim();

    if (!name) {
      document.getElementById('placeNameError').classList.add('visible');
      nameInput.classList.add('error');
      valid = false;
    }
    if (!country) {
      document.getElementById('countryError').classList.add('visible');
      countryInput.classList.add('error');
      valid = false;
    }
    if (!valid) return;

    const days = parseInt(document.getElementById('travelDaysInput').value) || 0;
    const travelers = parseInt(document.getElementById('travelersCountInput').value) || 1;
    if (days < 0 || travelers < 0) {
      toast('Days and travelers must be positive numbers', 'warning');
      return;
    }

    const budget = {};
    BUDGET_CATEGORIES.forEach(cat => {
      const el = document.getElementById('fBudget' + cat.charAt(0).toUpperCase() + cat.slice(1));
      budget[cat] = Math.max(0, parseFloat(el?.value) || 0);
    });

    const userBudget = Math.max(0, parseFloat(document.getElementById('fBudgetUserBudget').value) || 0);
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'medium';
    const status = document.getElementById('statusSelectInput').value;
    const favorite = document.getElementById('favoriteCheckbox').checked;

    const memory = status === 'visited' ? {
      rating: formRating,
      moment: document.getElementById('fMemMomentInput').value.trim(),
      liked: document.getElementById('fMemLikedInput').value.trim(),
      visitedOn: document.getElementById('fMemVisitedOnInput').value,
      again: formMemAgain
    } : (editingId ? places.find(p => p.id === editingId)?.memory || null : null);

    let imageData = formPhotoData;
    const imageUrl = document.getElementById('imageUrlInput').value.trim();
    if (!imageData && imageUrl) imageData = null;

    if (editingId) {
      const idx = places.findIndex(p => p.id === editingId);
      if (idx !== -1) {
        places[idx] = {
          ...places[idx],
          name,
          country,
          note: document.getElementById('noteInput').value.trim(),
          imageUrl: imageData ? '' : imageUrl,
          imageData,
          date: document.getElementById('travelDateInput').value,
          days,
          travelers,
          priority,
          status,
          favorite,
          moods: [...formSelectedMoods],
          budget,
          userBudget,
          memory
        };
      }
      toast(`Updated ${name} ✓`);
    } else {
      const newPlace = {
        id: genId(),
        name,
        country,
        note: document.getElementById('noteInput').value.trim(),
        imageUrl: imageData ? '' : imageUrl,
        imageData,
        date: document.getElementById('travelDateInput').value,
        days,
        travelers,
        priority,
        status,
        favorite,
        moods: [...formSelectedMoods],
        budget,
        userBudget,
        itinerary: [],
        packing: DEFAULT_PACKING.map(item => ({ item, checked: false })),
        memory,
        createdAt: Date.now()
      };
      places.unshift(newPlace);
      toast(`Added ${name} to Wonderwave ✓`);
    }

    saveData();
    closeModal('placeModalBackdrop');
    renderPlaces();
    updateStats();
  }

  // --- Delete Modal ---
  function openDeleteModal(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    deletingId = id;
    document.getElementById('deletePlaceName').textContent = `${place.name}, ${place.country}`;
    openModal('deleteModalBackdrop');
  }

  function confirmDelete() {
    const place = places.find(p => p.id === deletingId);
    if (!place) return;
    const name = place.name;
    places = places.filter(p => p.id !== deletingId);
    deletingId = null;
    saveData();
    closeModal('deleteModalBackdrop');
    closeModal('detailModalBackdrop');
    renderPlaces();
    updateStats();
    toast(`Deleted ${name} ✓`, 'danger');
  }

  // --- Destination Details Modal ---
  function openDetailModal(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    detailPlace = place;
    renderDetailModal(place);
    openModal('detailModalBackdrop');
  }

  function renderDetailModal(place) {
    document.getElementById('detailModalTitle').textContent = `${place.name}, ${place.country}`;
    const body = document.getElementById('detailModalBody');
    const imgSrc = getPlaceImage(place);
    const total = calcBudgetTotal(place.budget);
    const readiness = calcReadiness(place);

    if (!place.packing) place.packing = DEFAULT_PACKING.map(item => ({ item, checked: false }));
    if (!place.itinerary) place.itinerary = [];

    const packedCount = place.packing.filter(p => p.checked).length;
    const packingTotal = place.packing.length;
    const packingPct = packingTotal > 0 ? Math.round((packedCount / packingTotal) * 100) : 0;

    body.innerHTML = `
      <div class="detail-hero-banner">
        ${imgSrc ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(place.name)}">` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; font-size:4rem;">✈️</div>`}
        <div class="hero-caption">
          <h3>${escHtml(place.name)}</h3>
          <p>${escHtml(place.country)}</p>
        </div>
      </div>

      <div class="detail-info-row">
        <div class="detail-info-card">
          <div class="info-lbl">Status</div>
          <div class="info-val">${(place.status || 'dream').toUpperCase()}</div>
        </div>
        <div class="detail-info-card">
          <div class="info-lbl">Priority</div>
          <div class="info-val">${(place.priority || 'medium').toUpperCase()}</div>
        </div>
        <div class="detail-info-card">
          <div class="info-lbl">Travel Date</div>
          <div class="info-val">${formatDate(place.date)}</div>
        </div>
        <div class="detail-info-card">
          <div class="info-lbl">Estimated Total</div>
          <div class="info-val">${formatCurrency(total)}</div>
        </div>
      </div>

      ${place.note ? `<p style="font-size:0.9375rem; color:var(--text-secondary); margin-bottom:1.25rem; line-height:1.6; background:var(--bg-subtle); padding:0.875rem; border-radius:var(--radius-md);">${escHtml(place.note)}</p>` : ''}

      <!-- Travel Readiness -->
      <div class="readiness-box">
        <div class="readiness-header">
          <span>🎯 Travel Readiness — ${readiness.pct}%</span>
          <span>${readiness.completed} of ${readiness.total} milestones</span>
        </div>
        <div class="readiness-bar-track">
          <div class="readiness-bar-fill" style="width:${readiness.pct}%"></div>
        </div>
        <div class="readiness-items-grid">
          ${readiness.checks.map(c => `<div>${c.done ? '✓' : '✗'} ${escHtml(c.label)}</div>`).join('')}
        </div>
      </div>

      <!-- Budget Planner -->
      <div class="itinerary-block">
        <h4 style="font-family:var(--font-heading); font-size:1.1rem; margin-bottom:0.75rem;">💰 Budget Planner</h4>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.5rem; font-size:0.875rem; margin-bottom:0.75rem;">
          ${BUDGET_CATEGORIES.map(k => `
            <div style="display:flex; justify-content:space-between; padding:0.35rem 0.5rem; background:var(--bg-subtle); border-radius:var(--radius-sm);">
              <span>${BUDGET_LABELS[k] || k}</span>
              <strong>${formatCurrency(place.budget?.[k] || 0)}</strong>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">
          <label style="font-size:0.875rem; font-weight:700;">My Budget (৳):</label>
          <input type="number" id="detailUserBudgetInput" class="form-control" value="${place.userBudget || ''}" placeholder="100000" style="width:160px;">
          <div id="detailBudgetDiffBadge" style="margin-left:auto; font-weight:700; font-size:0.875rem;"></div>
        </div>
      </div>

      <!-- Trip Itinerary -->
      <div class="itinerary-block">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <h4 style="font-family:var(--font-heading); font-size:1.1rem;">🗓️ Trip Itinerary</h4>
          <button type="button" class="btn btn-secondary" id="detailAddDayBtn" style="padding:0.35rem 0.75rem; font-size:0.8125rem;">+ Add Day</button>
        </div>
        <div id="detailItineraryDays">
          ${place.itinerary.map((day, di) => `
            <div class="itinerary-day-box" data-day-idx="${di}">
              <div class="itinerary-day-head">
                <span>Day ${day.day || (di + 1)}</span>
                <button type="button" class="btn-text-subtle" data-action="del-day" data-day-idx="${di}">🗑️ Delete Day</button>
              </div>
              <div>
                ${(day.activities || []).map((act, ai) => `
                  <div class="itinerary-activity-item">
                    <span id="it-act-${di}-${ai}">• ${escHtml(act)}</span>
                    <div style="display:flex; gap:0.25rem;">
                      <button type="button" class="btn-text-subtle" data-action="edit-act" data-day-idx="${di}" data-act-idx="${ai}">✏️</button>
                      <button type="button" class="btn-text-subtle" data-action="del-act" data-day-idx="${di}" data-act-idx="${ai}">✕</button>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                <input type="text" class="form-control" id="newActInput-${di}" placeholder="Add activity for Day ${day.day || (di + 1)}..." style="font-size:0.8125rem; padding:0.35rem 0.625rem;">
                <button type="button" class="btn btn-primary" data-action="add-act" data-day-idx="${di}" style="padding:0.35rem 0.75rem; font-size:0.8125rem;">Add</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Packing Checklist -->
      <div class="packing-block">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <h4 style="font-family:var(--font-heading); font-size:1.1rem;">🎒 Packing Checklist</h4>
          <span style="font-size:0.8125rem; font-weight:700; color:var(--primary);">${packedCount} / ${packingTotal} completed (${packingPct}%)</span>
        </div>
        <div class="readiness-bar-track" style="margin-bottom:0.875rem;">
          <div class="readiness-bar-fill" style="width:${packingPct}%; background:var(--primary);"></div>
        </div>
        <ul class="packing-checklist-ul" id="detailPackingUl">
          ${place.packing.map((p, pi) => `
            <li class="packing-li ${p.checked ? 'checked' : ''}">
              <input type="checkbox" ${p.checked ? 'checked' : ''} data-action="toggle-pack" data-idx="${pi}">
              <span style="flex:1;">${escHtml(p.item)}</span>
              <button type="button" class="btn-text-subtle" data-action="del-pack" data-idx="${pi}">✕</button>
            </li>
          `).join('')}
        </ul>
        <div style="display:flex; gap:0.5rem; margin-top:0.875rem;">
          <input type="text" class="form-control" id="newCustomPackInput" placeholder="Add custom item..." style="font-size:0.8125rem; padding:0.4rem 0.625rem;">
          <button type="button" class="btn btn-secondary" id="addCustomPackBtn" style="padding:0.4rem 0.875rem; font-size:0.8125rem;">+ Add</button>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div style="display:flex; gap:0.75rem; justify-content:space-between; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-subtle);">
        <button type="button" class="btn btn-primary" onclick="closeModal('detailModalBackdrop'); openEditModal('${place.id}')">✏️ Edit Place</button>
        ${place.status !== 'visited' ? `<button type="button" class="btn btn-secondary" onclick="markAsVisited('${place.id}')">✓ Mark as Visited</button>` : ''}
        <button type="button" class="btn btn-danger" onclick="openDeleteModal('${place.id}')">🗑️ Delete</button>
      </div>
    `;

    attachDetailModalListeners(place);
    updateDetailBudgetDiff(total, place.userBudget || 0);
  }

  function attachDetailModalListeners(place) {
    // Budget input live update
    const ubInput = document.getElementById('detailUserBudgetInput');
    if (ubInput) {
      ubInput.addEventListener('input', e => {
        place.userBudget = Math.max(0, parseFloat(e.target.value) || 0);
        saveData();
        updateDetailBudgetDiff(calcBudgetTotal(place.budget), place.userBudget);
      });
    }

    // Add day
    document.getElementById('detailAddDayBtn')?.addEventListener('click', () => {
      if (!place.itinerary) place.itinerary = [];
      const nextDay = place.itinerary.length ? (place.itinerary[place.itinerary.length - 1].day || place.itinerary.length) + 1 : 1;
      place.itinerary.push({ day: nextDay, activities: [] });
      saveData();
      renderDetailModal(place);
      toast(`Added Day ${nextDay} ✓`);
    });

    // Itinerary actions
    document.querySelectorAll('#detailItineraryDays [data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const di = parseInt(btn.dataset.dayIdx);
        const ai = parseInt(btn.dataset.actIdx);

        if (action === 'del-day') {
          place.itinerary.splice(di, 1);
          place.itinerary.forEach((d, i) => d.day = i + 1);
          saveData();
          renderDetailModal(place);
        } else if (action === 'del-act') {
          place.itinerary[di].activities.splice(ai, 1);
          saveData();
          renderDetailModal(place);
        } else if (action === 'edit-act') {
          const textEl = document.getElementById(`it-act-${di}-${ai}`);
          const oldText = place.itinerary[di].activities[ai];
          textEl.innerHTML = `<input type="text" class="form-control" style="font-size:0.8125rem; padding:0.25rem 0.5rem;" value="${escHtml(oldText)}" id="editInput-${di}-${ai}">`;
          const inp = document.getElementById(`editInput-${di}-${ai}`);
          inp.focus();
          const saveEdit = () => {
            if (inp.value.trim()) place.itinerary[di].activities[ai] = inp.value.trim();
            saveData();
            renderDetailModal(place);
          };
          inp.addEventListener('blur', saveEdit);
          inp.addEventListener('keydown', e => {
            if (e.key === 'Enter') inp.blur();
          });
        } else if (action === 'add-act') {
          const inp = document.getElementById(`newActInput-${di}`);
          if (inp && inp.value.trim()) {
            if (!place.itinerary[di].activities) place.itinerary[di].activities = [];
            place.itinerary[di].activities.push(inp.value.trim());
            saveData();
            renderDetailModal(place);
            toast('Activity added ✓');
          }
        }
      });
    });

    // Packing checklist
    document.querySelectorAll('#detailPackingUl [data-action]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.action;
        const idx = parseInt(el.dataset.idx);
        if (action === 'toggle-pack') {
          place.packing[idx].checked = el.checked;
          saveData();
          renderDetailModal(place);
        } else if (action === 'del-pack') {
          place.packing.splice(idx, 1);
          saveData();
          renderDetailModal(place);
        }
      });
    });

    // Add custom packing item
    document.getElementById('addCustomPackBtn')?.addEventListener('click', () => {
      const inp = document.getElementById('newCustomPackInput');
      if (inp && inp.value.trim()) {
        place.packing.push({ item: inp.value.trim(), checked: false });
        saveData();
        renderDetailModal(place);
        toast(`Added "${inp.value.trim()}" ✓`);
      }
    });
  }

  function updateDetailBudgetDiff(estimated, userBudget) {
    const badge = document.getElementById('detailBudgetDiffBadge');
    if (!badge) return;
    if (!userBudget || userBudget <= 0) {
      badge.textContent = '';
      return;
    }
    const diff = estimated - userBudget;
    if (diff > 0) {
      badge.innerHTML = `<span style="color:#b91c1c;">🔴 ${formatCurrency(diff)} Over budget</span>`;
    } else if (diff < 0) {
      badge.innerHTML = `<span style="color:#15803d;">🟢 ${formatCurrency(Math.abs(diff))} Remaining</span>`;
    } else {
      badge.innerHTML = `<span style="color:#15803d;">✓ Exactly on budget</span>`;
    }
  }

  function markAsVisited(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    place.status = 'visited';
    if (!place.memory) {
      place.memory = {
        rating: 5,
        moment: '',
        liked: '',
        visitedOn: new Date().toISOString().split('T')[0],
        again: 'yes'
      };
    }
    saveData();
    renderDetailModal(place);
    renderPlaces();
    updateStats();
    toast(`Marked ${place.name} as visited ✓`);
  }

  // --- "Where Should I Go?" Recommender ---
  function openSuggModal() {
    document.querySelectorAll('#suggBudgetOptions .sugg-opt-btn, #suggDurationOptions .sugg-opt-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('#suggMoodOptions .mood-select-chip').forEach(b => b.classList.remove('selected'));
    document.getElementById('suggQuestionnaire').style.display = 'block';
    document.getElementById('suggResultContainer').style.display = 'none';
    openModal('suggModalBackdrop');
  }

  function runRecommender() {
    const budgetVal = document.querySelector('#suggBudgetOptions .sugg-opt-btn.selected')?.dataset.budget;
    const durationVal = document.querySelector('#suggDurationOptions .sugg-opt-btn.selected')?.dataset.duration;
    const selectedMoods = [...document.querySelectorAll('#suggMoodOptions .mood-select-chip.selected')].map(c => c.dataset.mood);

    if (!budgetVal && !durationVal && selectedMoods.length === 0) {
      toast('Please choose your budget, duration, or preferred mood', 'warning');
      return;
    }

    const budgetRanges = {
      '30k': [0, 30000],
      '60k': [30001, 60000],
      '100k': [60001, 100000],
      '100k+': [100001, Infinity]
    };

    const durationRanges = {
      '3': [1, 3],
      '7': [4, 7],
      '14': [8, 14],
      '15+': [15, 999]
    };

    const [minB, maxB] = budgetRanges[budgetVal] || [0, Infinity];
    const [minD, maxD] = durationRanges[durationVal] || [0, 999];

    const unvisited = places.filter(p => p.status !== 'visited');
    const pool = unvisited.length ? unvisited : places;

    if (pool.length === 0) {
      showRecommenderResult(null);
      return;
    }

    const scored = pool.map(place => {
      let score = 55;
      const reasons = [];
      const total = calcBudgetTotal(place.budget);

      if (budgetVal) {
        if (total >= minB && total <= maxB) {
          score += 20;
          reasons.push('Fits budget');
        } else if (Math.abs(total - (minB + maxB) / 2) < 25000) {
          score += 10;
          reasons.push('Close to budget');
        }
      }

      if (durationVal) {
        if (place.days >= minD && place.days <= maxD) {
          score += 15;
          reasons.push('Matches duration');
        }
      }

      if (selectedMoods.length > 0) {
        const matches = (place.moods || []).filter(m => selectedMoods.includes(m)).length;
        if (matches > 0) {
          score += 15 + matches * 5;
          reasons.push('Matches preferred mood');
        }
      }

      if (place.priority === 'high') {
        score += 8;
        reasons.push('High priority');
      }

      if (place.favorite) {
        score += 5;
        reasons.push('One of your favorites');
      }

      return {
        place,
        score: Math.min(Math.max(score, 65), 98),
        reasons: reasons.length ? reasons : ['Great bucket-list match']
      };
    }).sort((a, b) => b.score - a.score);

    showRecommenderResult(scored[0]);
  }

  function showRecommenderResult(match) {
    const qEl = document.getElementById('suggQuestionnaire');
    const rEl = document.getElementById('suggResultContainer');
    qEl.style.display = 'none';
    rEl.style.display = 'block';

    if (!match) {
      rEl.innerHTML = `
        <div style="text-align:center; padding:2rem;">
          <p style="font-size:2.5rem; margin-bottom:0.5rem;">🌍</p>
          <p>No matching destination found. Add more dream places to your list!</p>
          <button type="button" class="btn btn-primary" style="margin-top:1rem;" onclick="closeModal('suggModalBackdrop'); openAddModal();">+ Add Place</button>
        </div>`;
      return;
    }

    const { place, score, reasons } = match;
    const imgSrc = getPlaceImage(place);

    rEl.innerHTML = `
      <div class="sugg-card-result">
        ${imgSrc ? `<img src="${escHtml(imgSrc)}" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius-md); margin-bottom:1rem;">` : ''}
        <div class="sugg-match-pct">${escHtml(place.name)} — ${score}% Match</div>
        <p style="color:var(--text-secondary); margin-bottom:1rem; font-size:0.9375rem;">
          ${escHtml(place.country)} &bull; ${place.days ? place.days + ' days' : 'Custom duration'} &bull; ${calcBudgetTotal(place.budget) > 0 ? formatCurrency(calcBudgetTotal(place.budget)) : 'Flexible budget'}
        </p>
        <div style="text-align:left; background:#ffffff; padding:1rem; border-radius:var(--radius-md); margin-bottom:1.25rem;">
          <strong style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Match Reasons:</strong>
          <ul style="list-style:none; margin-top:0.35rem;">
            ${reasons.map(r => `<li style="font-size:0.875rem; color:var(--text-secondary); padding:0.2rem 0;"><span style="color:#16a34a; font-weight:bold;">✓</span> ${escHtml(r)}</li>`).join('')}
          </ul>
        </div>
        <div style="display:flex; gap:0.75rem; justify-content:center;">
          <button type="button" class="btn btn-primary" onclick="closeModal('suggModalBackdrop'); openDetailModal('${place.id}')">View Destination →</button>
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('suggQuestionnaire').style.display='block'; document.getElementById('suggResultContainer').style.display='none';">← Try Again</button>
        </div>
      </div>`;
  }

  // --- Setup Event Listeners ---
  function setupEventListeners() {
    // Header actions
    document.getElementById('brandLogoBtn')?.addEventListener('click', e => {
      e.preventDefault();
      resetAllFilters();
    });
    document.getElementById('openAddModalBtn')?.addEventListener('click', openAddModal);
    document.getElementById('whereShouldIGoBtn')?.addEventListener('click', openSuggModal);
    document.getElementById('surpriseMeToolbarBtn')?.addEventListener('click', openSuggModal);
    document.getElementById('emptyAddBtn')?.addEventListener('click', openAddModal);

    // Stat cards filter clicks
    document.getElementById('statCardTotal')?.addEventListener('click', resetAllFilters);
    document.getElementById('statCardCountries')?.addEventListener('click', () => {
      filters.sortBy = 'country-asc';
      document.getElementById('sortSelect').value = 'country-asc';
      renderPlaces();
    });
    document.getElementById('statCardPlanned')?.addEventListener('click', () => {
      filters.status = 'planning';
      document.querySelectorAll('#statusFilterGroup .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filterStatus === 'planning'));
      renderPlaces();
    });
    document.getElementById('statCardVisited')?.addEventListener('click', () => {
      filters.status = 'visited';
      document.querySelectorAll('#statusFilterGroup .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filterStatus === 'visited'));
      renderPlaces();
    });
    document.getElementById('statCardBudget')?.addEventListener('click', () => {
      filters.sortBy = 'priority-desc';
      document.getElementById('sortSelect').value = 'priority-desc';
      renderPlaces();
    });

    // Search input & clear
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    searchInput?.addEventListener('input', e => {
      filters.search = e.target.value;
      clearSearchBtn?.classList.toggle('visible', !!e.target.value);
      renderPlaces();
    });
    clearSearchBtn?.addEventListener('click', () => {
      searchInput.value = '';
      filters.search = '';
      clearSearchBtn.classList.remove('visible');
      renderPlaces();
      searchInput.focus();
    });

    // Sort select
    document.getElementById('sortSelect')?.addEventListener('change', e => {
      filters.sortBy = e.target.value;
      renderPlaces();
    });

    // Status filter chips
    document.querySelectorAll('#statusFilterGroup .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#statusFilterGroup .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filters.status = chip.dataset.filterStatus;
        renderPlaces();
      });
    });

    // Priority filter chips
    document.querySelectorAll('#priorityFilterGroup .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#priorityFilterGroup .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filters.priority = chip.dataset.filterPriority;
        renderPlaces();
      });
    });

    // Favorites filter chip
    const favFilter = document.getElementById('favoriteToggleFilter');
    favFilter?.addEventListener('click', () => {
      filters.favoriteOnly = !filters.favoriteOnly;
      favFilter.classList.toggle('active', filters.favoriteOnly);
      renderPlaces();
    });

    // Clear filters buttons
    document.getElementById('clearAllFiltersBtn')?.addEventListener('click', resetAllFilters);
    document.getElementById('emptyClearBtn')?.addEventListener('click', resetAllFilters);

    // Reset Demo places
    document.getElementById('sampleDataResetBtn')?.addEventListener('click', () => {
      places = structuredClone(DEFAULT_PLACES);
      saveData();
      resetAllFilters();
      toast('Restored demo dream places ✓');
    });

    // Form inputs & live calculations
    document.getElementById('placeForm')?.addEventListener('submit', validateAndSavePlace);
    document.getElementById('savePlaceBtn')?.addEventListener('click', validateAndSavePlace);
    document.getElementById('cancelModalBtn')?.addEventListener('click', () => closeModal('placeModalBackdrop'));
    document.getElementById('closeModalBtn')?.addEventListener('click', () => closeModal('placeModalBackdrop'));

    document.getElementById('noteInput')?.addEventListener('input', e => {
      document.getElementById('noteCharCounter').textContent = `${e.target.value.length}/500`;
    });

    // Photo file upload
    document.getElementById('chooseFileBtn')?.addEventListener('click', () => document.getElementById('photoFileInput')?.click());
    document.getElementById('photoFileInput')?.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      const compressed = await compressImage(file);
      if (compressed) {
        formPhotoData = compressed;
        document.getElementById('imageUrlInput').value = '';
        showPhotoPreview(compressed);
        toast('Photo uploaded and optimized ✓');
      }
    });

    document.getElementById('removePhotoBtn')?.addEventListener('click', () => {
      formPhotoData = null;
      resetPhotoUI();
    });

    document.getElementById('imageUrlInput')?.addEventListener('input', e => {
      const url = e.target.value.trim();
      if (url && (url.startsWith('http') || url.startsWith('data:'))) {
        formPhotoData = null;
        showPhotoPreview(url);
      } else if (!url) {
        resetPhotoUI();
      }
    });

    // Preset chips
    document.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.presetImg;
        formPhotoData = null;
        document.getElementById('imageUrlInput').value = url;
        showPhotoPreview(url);
      });
    });

    // Budget live calculation
    BUDGET_CATEGORIES.forEach(cat => {
      const el = document.getElementById('fBudget' + cat.charAt(0).toUpperCase() + cat.slice(1));
      el?.addEventListener('input', updateFormBudgetSummary);
    });
    document.getElementById('fBudgetUserBudget')?.addEventListener('input', updateFormBudgetSummary);

    // Form mood chips
    document.querySelectorAll('#formMoodChips .mood-select-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const mood = chip.dataset.mood;
        chip.classList.toggle('selected');
        if (chip.classList.contains('selected')) {
          if (!formSelectedMoods.includes(mood)) formSelectedMoods.push(mood);
        } else {
          formSelectedMoods = formSelectedMoods.filter(m => m !== mood);
        }
      });
    });

    // Status select conditional memory section
    document.getElementById('statusSelectInput')?.addEventListener('change', e => {
      resetMemorySection(e.target.value === 'visited');
    });

    // Star picker
    document.querySelectorAll('#modalStarPicker .star-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.dataset.star);
        resetStarPicker(rating);
      });
    });

    // Memory would visit again
    document.getElementById('fMemAgainYesBtn')?.addEventListener('click', () => setMemoryAgainUI('yes'));
    document.getElementById('fMemAgainNoBtn')?.addEventListener('click', () => setMemoryAgainUI('no'));

    // Details modal close
    document.getElementById('closeDetailModalBtn')?.addEventListener('click', () => closeModal('detailModalBackdrop'));

    // Delete modal actions
    document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => closeModal('deleteModalBackdrop'));
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);

    // Recommender modal actions
    document.getElementById('closeSuggModalBtn')?.addEventListener('click', () => closeModal('suggModalBackdrop'));
    document.getElementById('findMatchBtn')?.addEventListener('click', runRecommender);

    document.querySelectorAll('#suggBudgetOptions .sugg-opt-btn, #suggDurationOptions .sugg-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.parentElement;
        group.querySelectorAll('.sugg-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    document.querySelectorAll('#suggMoodOptions .mood-select-chip').forEach(chip => {
      chip.addEventListener('click', () => chip.classList.toggle('selected'));
    });

    // Backdrop click to close modals
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeAllModals();
      });
    });

    // Escape key closes modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  function resetAllFilters() {
    filters = { search: '', priority: 'all', status: 'all', favoriteOnly: false, sortBy: 'newest' };
    const searchInp = document.getElementById('searchInput');
    if (searchInp) searchInp.value = '';
    document.getElementById('clearSearchBtn')?.classList.remove('visible');
    document.getElementById('sortSelect').value = 'newest';
    document.querySelectorAll('#statusFilterGroup .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filterStatus === 'all'));
    document.querySelectorAll('#priorityFilterGroup .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filterPriority === 'all'));
    document.getElementById('favoriteToggleFilter')?.classList.remove('active');
    renderPlaces();
  }

  // --- Globals for Inline Handlers ---
  window.openAddModal = openAddModal;
  window.openEditModal = openEditModal;
  window.openDetailModal = openDetailModal;
  window.openDeleteModal = openDeleteModal;
  window.markAsVisited = markAsVisited;
  window.closeModal = closeModal;

  // --- Init ---
  function init() {
    loadData();
    setupEventListeners();
    updateStats();
    renderPlaces();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
