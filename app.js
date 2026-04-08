/* ══════════════════════════════════════════════════════════════════════
   VERSION TIME MACHINE — App Logic  v2.0
   Dynamic sidebar + EndOfLife.date API + Time Machine
══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── CONSTANTS ──────────────────────────────────────────────────────── */
const API_BASE      = 'https://endoflife.date/api';
const ALL_PRODUCTS  = `${API_BASE}/all.json`;
const LS_CACHE_KEY  = 'vtm_releases_cache';
const LS_TIME_KEY   = 'vtm_last_updated';
const LS_LIST_KEY   = 'vtm_product_list';
const SAFE_DAYS     = 14;           // safe buffer in days
const WARN_EOL_DAYS = 90;           // < 90 days to EOL = orange warning

/* ── STATE ──────────────────────────────────────────────────────────── */
let allProductSlugs  = [];          // ['chrome','edge','firefox', …]
let selectedProduct  = null;        // { slug, name, cycles[] } | null
let fetchController  = null;        // AbortController for in-flight fetches
let sidebarOpen      = false;

// `releases` is defined in versions.js as the fallback/seed data.
// We extend it dynamically as products are loaded.

/* ══════════════════════════════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════════════════════════════ */
const Theme = (() => {
    const html   = document.documentElement;
    const btn    = document.getElementById('themeToggle');
    const KEY    = 'vtm-theme';
    const ICONS  = { dark: '☀️', light: '🌙' };
    const LABELS = { dark: 'Switch to light mode', light: 'Switch to dark mode' };

    function apply(mode) {
        html.classList.toggle('light', mode === 'light');
        btn.textContent = ICONS[mode];
        btn.setAttribute('aria-label', LABELS[mode]);
        btn.title = LABELS[mode];
        localStorage.setItem(KEY, mode);
    }
    function toggle() { apply(html.classList.contains('light') ? 'dark' : 'light'); }
    function init() {
        const saved = localStorage.getItem(KEY);
        if (saved) { apply(saved); }
        else if (window.matchMedia?.('(prefers-color-scheme: light)').matches) { apply('light'); }
        else { apply('dark'); }
    }
    btn.addEventListener('click', toggle);
    return { init };
})();

/* ══════════════════════════════════════════════════════════════════════
   SPA NAVIGATION
══════════════════════════════════════════════════════════════════════ */
const AppNav = (() => {
    const views   = document.querySelectorAll('.view');
    const navTabs = document.querySelectorAll('.nav-tab');

    function show(viewId) {
        views.forEach(v   => v.classList.toggle('active', v.id === `view-${viewId}`));
        navTabs.forEach(t => t.classList.toggle('active', t.dataset.view === viewId));
    }
    navTabs.forEach(tab => tab.addEventListener('click', () => show(tab.dataset.view)));
    return { show };
})();

window.showView = AppNav.show;

/* ══════════════════════════════════════════════════════════════════════
   SIDEBAR TOGGLE (hamburger / mobile)
══════════════════════════════════════════════════════════════════════ */
const sidebar        = document.getElementById('sidebar');
const hamburger      = document.getElementById('hamburger');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebarOpen = true;
    sidebar.classList.add('open');
    hamburger.classList.add('active');
    sidebarOverlay.classList.add('visible');
}
function closeSidebar() {
    sidebarOpen = false;
    sidebar.classList.remove('open');
    hamburger.classList.remove('active');
    sidebarOverlay.classList.remove('visible');
}
function toggleSidebar() { sidebarOpen ? closeSidebar() : openSidebar(); }

hamburger.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

/* ══════════════════════════════════════════════════════════════════════
   SECTION & CATEGORY TOGGLES
══════════════════════════════════════════════════════════════════════ */
function toggleSection(header) {
    const body = header.nextElementSibling;
    header.classList.toggle('open');
    body.classList.toggle('open');
}
function toggleCategory(header) {
    const body = header.nextElementSibling;
    header.classList.toggle('open');
    body.classList.toggle('open');
}

/* ══════════════════════════════════════════════════════════════════════
   VENDOR LINK FILTER
══════════════════════════════════════════════════════════════════════ */
function filterLinks(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('.link-category').forEach(cat => {
        let visible = 0;
        cat.querySelectorAll('.vendor-card').forEach(v => {
            const match = !q || v.textContent.toLowerCase().includes(q);
            v.classList.toggle('hidden', !match);
            if (match) visible++;
        });
        cat.classList.toggle('hidden', visible === 0 && q.length > 0);
    });
}

/* ══════════════════════════════════════════════════════════════════════
   API STATUS INDICATOR
══════════════════════════════════════════════════════════════════════ */
function setApiStatus(state, label) {
    const el  = document.getElementById('apiStatus');
    const lbl = document.getElementById('apiLabel');
    el.className  = `api-status ${state}`;
    lbl.textContent = label;
}

/* ══════════════════════════════════════════════════════════════════════
   DATE FORMATTER
══════════════════════════════════════════════════════════════════════ */
function formatDate(dateStr) {
    if (!dateStr || dateStr === '—') return '—';
    const d   = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getUTCDate();
    const mn  = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
    const sfx = n => {
        if (n > 3 && n < 21) return 'th';
        return (['th','st','nd','rd','th','th','th','th','th','th'][n % 10]) ?? 'th';
    };
    return `${day}${sfx(day)} ${mn[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function relativeTime(isoDate) {
    if (!isoDate) return '';
    const now  = new Date();
    const then = new Date(isoDate);
    const days = Math.round((then - now) / 86400000);
    if (days > 365)  return `in ~${Math.round(days/365)}y`;
    if (days > 30)   return `in ~${Math.round(days/30)}mo`;
    if (days > 0)    return `in ${days}d`;
    if (days === 0)  return 'today';
    if (days > -30)  return `${-days}d ago`;
    if (days > -365) return `~${Math.round(-days/30)}mo ago`;
    return `~${Math.round(-days/365)}y ago`;
}

/* ══════════════════════════════════════════════════════════════════════
   CORE LOGIC: getSafeLatest
══════════════════════════════════════════════════════════════════════ */
function getSafeLatest(list, targetDate) {
    if (!list || !list.length) return { safe: { v: 'Not released yet' }, fresh: null };
    const target    = new Date(targetDate);
    const available = list.filter(r => new Date(r.d) <= target);
    if (!available.length) return { safe: { v: 'Not released yet' }, fresh: null };

    const safeVersion = available.find(r => {
        const days = (target - new Date(r.d)) / 86400000;
        return days >= SAFE_DAYS;
    });
    const latest     = available[0];
    const latestDays = Math.floor((target - new Date(latest.d)) / 86400000);
    return { safe: safeVersion || latest, fresh: latestDays < SAFE_DAYS ? latest : null, latestDays };
}

/* ══════════════════════════════════════════════════════════════════════
   RENDER ONE VERSION CARD (existing grouped view)
══════════════════════════════════════════════════════════════════════ */
const GROUP_ICONS = {
    browsers: '🌏', macos: '💻', ios: '📱', ipados: '🍎',
    esxi: '🖥', m365: '📊', dotnet: '⚙️',
};

function renderCard(platform, data, selectedDate) {
    const { safe, fresh, latestDays } = data;
    const card = document.createElement('div');
    card.className = 'card';

    const isEol = platform.eol && new Date(selectedDate) >= new Date(platform.eol);
    if (isEol) card.classList.add('card--eol');

    if (safe.v === 'Not released yet') {
        card.innerHTML = `
            <div class="card-name">${platform.name}</div>
            <div class="card-version-block">
                <div class="card-version-label">Safe version</div>
                <div class="not-released">Not released yet</div>
            </div>`;
        return card;
    }

    if (isEol) {
        card.innerHTML = `
            <div class="card-name">${platform.name}</div>
            <div class="card-eol-banner">
                <span class="card-eol-icon">⚠</span>
                <div>
                    <div class="card-eol-title">End of Life</div>
                    <div class="card-eol-date">Support ended ${formatDate(platform.eol)} — no further security patches</div>
                </div>
            </div>`;
        return card;
    }

    const isFuture = platform.key && platform.key.includes('26');
    card.innerHTML = `
        <div class="card-name">${platform.name}</div>
        <div class="card-version-block">
            <div class="card-version-label">✓ Latest safe version</div>
            <div class="card-version-number">${safe.v}</div>
            <div class="card-version-date">Released ${formatDate(safe.d)}</div>
        </div>
        ${fresh ? `
        <div class="card-fresh-note">
            ⚠ Newer version <strong>${fresh.v}</strong> (${formatDate(fresh.d)}) was only
            ${latestDays} day${latestDays !== 1 ? 's' : ''} old — too fresh to be safe
        </div>` : ''}
        ${isFuture ? `<div class="future-badge">Future OS</div>` : ''}
    `;
    return card;
}

/* ══════════════════════════════════════════════════════════════════════
   RENDER GROUPED DEFAULT VIEW
══════════════════════════════════════════════════════════════════════ */
function renderGroupedView(targetDate) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'result-header';
    header.innerHTML = `
        <div class="result-date-pill">
            <span>📅</span> Safe versions as of ${formatDate(targetDate)}
        </div>`;
    container.appendChild(header);

    const LABELS = {
        browsers: 'Safe browser versions on',
        macos:    'Safe macOS versions on',
        ios:      'Safe iOS versions on',
        ipados:   'Safe iPadOS versions on',
        esxi:     'Safe VMware ESXi versions on',
        m365:     'Safe Microsoft 365 versions on',
        dotnet:   'Safe .NET versions on',
    };

    groups.forEach((group, gi) => {
        const section       = document.createElement('div');
        section.className   = 'section';
        section.style.animationDelay = `${gi * 55}ms`;

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        const dateLabel = LABELS[group.id] ?? 'Safe versions on';

        sectionHeader.innerHTML = `
            <div class="section-header-left">
                <span class="section-icon">${GROUP_ICONS[group.id] ?? '📦'}</span>
                <div class="section-header-text">
                    <span class="section-title">${group.title}</span>
                    <span class="section-date-label">${dateLabel} ${formatDate(targetDate)}</span>
                </div>
                <span class="section-count">${group.platforms.length}</span>
            </div>
            <span class="section-chevron">▾</span>`;
        sectionHeader.addEventListener('click', () => toggleSection(sectionHeader));

        const sectionBody = document.createElement('div');
        sectionBody.className = 'section-body';

        group.platforms.forEach((platform, pi) => {
            const data = getSafeLatest(releases[platform.key], targetDate);
            const card = renderCard(platform, data, targetDate);
            sectionBody.appendChild(card);
            setTimeout(() => card.classList.add('show'), gi * 55 + pi * 75);
        });

        section.appendChild(sectionHeader);
        section.appendChild(sectionBody);
        container.appendChild(section);

        if (gi === 0) {
            sectionHeader.classList.add('open');
            sectionBody.classList.add('open');
        }
    });
}

/* ══════════════════════════════════════════════════════════════════════
   EOL HELPER
   Centralises the check: is a cycle EOL as of a given date?
   Handles all three forms the API uses:
     eol: "2024-11-12"  → date string, compare against targetDate
     eol: true          → permanently EOL (no date given, e.g. old Android)
     eol: false         → actively supported with no planned end date
     eol: undefined     → unknown / not annotated
══════════════════════════════════════════════════════════════════════ */
function isCycleEolAsOf(eolValue, targetDate) {
    if (eolValue === true)  return true;                          // boolean true  → always EOL
    if (!eolValue)          return false;                         // false/null/undefined → not EOL
    return new Date(targetDate) >= new Date(String(eolValue));    // date string comparison
}

/* ── Helper: human-readable EOL cell for the release table ── */
function formatEolCell(eolValue) {
    if (eolValue === true)  return `<span style="color:var(--eol-red)">EOL (no date)</span>`;
    if (!eolValue)          return `<span style="color:var(--safe)">Active</span>`;
    const daysLeft = Math.floor((new Date(String(eolValue)) - new Date()) / 86400000);
    if (daysLeft < 0)       return `<span style="color:var(--eol-red)">${formatDate(String(eolValue))}</span>`;
    if (daysLeft < WARN_EOL_DAYS) return `<span style="color:var(--warn)">${formatDate(String(eolValue))} (${relativeTime(String(eolValue))})</span>`;
    return `${formatDate(String(eolValue))} <span style="color:var(--ink-3);font-size:0.75em">(${relativeTime(String(eolValue))})</span>`;
}

/* ══════════════════════════════════════════════════════════════════════
   RENDER SINGLE DYNAMIC PRODUCT VIEW
   • eol:true  is now treated as permanently EOL (fixes Android etc.)
   • Multi-cycle products show one card per cycle with a search bar
   • Single-stream products (Chrome, Firefox…) show one merged card
══════════════════════════════════════════════════════════════════════ */
function renderProductView(slug, cycles, targetDate) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    if (!cycles || cycles.length === 0) {
        container.innerHTML = `
            <div class="results-error">
                <div class="results-error-icon">📭</div>
                <div>No release data found for <strong>${slug}</strong>.</div>
            </div>`;
        return;
    }

    const today       = new Date().toISOString().slice(0, 10);
    const targetD     = new Date(targetDate);
    const displayName = formatSlugName(slug);

    /* ── Step 1: build per-cycle groups ─────────────────────────────────
       Sort newest-cycle first so cards render in descending version order.
    ────────────────────────────────────────────────────────────────────── */
    const sortedCycles = [...cycles].sort((a, b) => {
        const da = a.latestReleaseDate || a.releaseDate || '';
        const db = b.latestReleaseDate || b.releaseDate || '';
        return db.localeCompare(da);
    });

    const cycleGroups = sortedCycles
        .map(c => {
            const d = c.latestReleaseDate || c.releaseDate;
            const v = c.latest || c.cycle;
            if (!d || !v) return null;
            return {
                cycleLabel: String(c.cycle),
                eol:        c.eol,          // raw API value — may be true/false/date-string
                lts:        c.lts || false,
                releases:   [{ v: String(v), d: String(d) }],
            };
        })
        .filter(Boolean);

    if (cycleGroups.length === 0) {
        container.innerHTML = `
            <div class="results-error">
                <div class="results-error-icon">📭</div>
                <div>No usable release data found for <strong>${displayName}</strong>.</div>
            </div>`;
        return;
    }

    /* ── Step 2: overall header status badges ────────────────────────── */
    // "active" means: not EOL as of today (using our helper)
    const activeCyc = cycleGroups.filter(g => !isCycleEolAsOf(g.eol, today));
    const nearEol   = activeCyc.filter(g => {
        if (!g.eol || g.eol === true || g.eol === false) return false;
        return (new Date(String(g.eol)) - new Date()) / 86400000 < WARN_EOL_DAYS;
    });

    let statusBadge = '';
    if (activeCyc.length === 0) {
        statusBadge = `<span class="product-badge product-badge--eol">⛔ All cycles EOL</span>`;
    } else if (nearEol.length > 0) {
        statusBadge = `<span class="product-badge product-badge--warn">⚠ ${nearEol.length} cycle${nearEol.length > 1 ? 's' : ''} near EOL</span>`;
    } else {
        statusBadge = `<span class="product-badge product-badge--supported">✓ Actively supported</span>`;
    }

    /* ── Step 3: page header ─────────────────────────────────────────── */
    const header = document.createElement('div');
    header.className = 'result-header';
    header.innerHTML = `
        <div class="product-view-header">
            <div>
                <div class="product-view-title">${displayName}</div>
                <div class="product-view-meta">
                    ${statusBadge}
                    <span class="product-badge product-badge--info">${cycleGroups.length} cycle${cycleGroups.length !== 1 ? 's' : ''} tracked</span>
                    <span class="product-badge product-badge--info">As of ${formatDate(targetDate)}</span>
                </div>
            </div>
            <div class="result-date-pill"><span>📅</span> ${formatDate(targetDate)}</div>
        </div>`;
    container.appendChild(header);

    /* ── Step 4: single-stream vs multi-cycle decision ───────────────────
       Single-stream: all cycle labels are bare integers AND none carry any
       eol annotation (e.g. Chrome 128/129/130…).
       Everything else (dotnet, android, macos, ios…) is multi-cycle.
    ────────────────────────────────────────────────────────────────────── */
    const allIntegerCycles = cycleGroups.every(g => /^\d+$/.test(g.cycleLabel));
    const anyEolAnnotated  = cycleGroups.some(g => g.eol !== undefined && g.eol !== false);
    const isSingleStream   = allIntegerCycles && !anyEolAnnotated;

    // Flat releases list used by both paths for the history table + cache
    const flatReleases = cycleGroups
        .flatMap(g => g.releases)
        .sort((a, b) => b.d.localeCompare(a.d));
    releases[slug] = flatReleases;

    if (isSingleStream) {
        /* ── Single-stream: one merged card ─────────────────────────── */
        const safeResult = getSafeLatest(flatReleases, targetDate);

        const section = document.createElement('div');
        section.className = 'section';
        section.style.animationDelay = '0ms';

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header open';
        sectionHeader.style.cursor = 'default';
        sectionHeader.innerHTML = `
            <div class="section-header-left">
                <span class="section-icon">✅</span>
                <div class="section-header-text">
                    <span class="section-title">Safe version on ${formatDate(targetDate)}</span>
                    <span class="section-date-label">14-day buffer applied</span>
                </div>
            </div>`;

        const sectionBody = document.createElement('div');
        sectionBody.className = 'section-body open';
        sectionBody.style.gridTemplateColumns = '1fr';

        const card = _buildSingleCard(displayName, safeResult, null, targetDate, false);
        card.classList.add('show');
        sectionBody.appendChild(card);

        section.appendChild(sectionHeader);
        section.appendChild(sectionBody);
        container.appendChild(section);

    } else {
        /* ── Multi-cycle: one card per cycle + search bar ────────────── */

        const section = document.createElement('div');
        section.className = 'section';
        section.style.animationDelay = '0ms';

        /* Section header */
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header open';
        sectionHeader.innerHTML = `
            <div class="section-header-left">
                <span class="section-icon">📦</span>
                <div class="section-header-text">
                    <span class="section-title">${displayName}</span>
                    <span class="section-date-label">Safe versions on ${formatDate(targetDate)} · 14-day buffer</span>
                </div>
                <span class="section-count">${cycleGroups.length}</span>
            </div>
            <span class="section-chevron">▾</span>`;
        sectionHeader.addEventListener('click', () => toggleSection(sectionHeader));

        /* ── Search bar (injected between header and cards) ── */
        const searchWrap = document.createElement('div');
        searchWrap.className = 'results-search-wrap';
        searchWrap.innerHTML = `
            <div class="results-search-inner">
                <svg class="results-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text"
                       class="results-search-input"
                       id="productVersionSearch"
                       placeholder="Filter versions…"
                       autocomplete="off"
                       spellcheck="false">
                <button class="results-search-clear" id="productVersionSearchClear" aria-label="Clear">✕</button>
            </div>
            <span class="results-search-count" id="productVersionSearchCount"></span>`;

        /* Section body — holds the cards */
        const sectionBody = document.createElement('div');
        sectionBody.className = 'section-body open';
        sectionBody.id = 'productVersionCards';

        /* Build one card per cycle */
        cycleGroups.forEach((group, idx) => {
            const isEolOnDate = isCycleEolAsOf(group.eol, targetDate);

            // EOL date string for the banner (undefined when eol:true has no date)
            const eolDateStr = (group.eol && group.eol !== true && group.eol !== false)
                ? String(group.eol)
                : (group.eol === true ? '__permanent__' : null);

            const cardName   = `${displayName} ${group.cycleLabel}${group.lts ? ' LTS' : ''}`;
            const safeResult = getSafeLatest(group.releases, targetDate);

            const card = _buildSingleCard(cardName, safeResult, eolDateStr, targetDate, false);

            // data-search stores the searchable text (card name, lowercased)
            card.dataset.search = cardName.toLowerCase();

            setTimeout(() => card.classList.add('show'), idx * 65);
            sectionBody.appendChild(card);
        });

        /* No-results message node (hidden by default) */
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'results-search-noresults';
        noResultsMsg.style.display = 'none';
        noResultsMsg.textContent = 'No versions match your search.';
        sectionBody.appendChild(noResultsMsg);

        /* Wire up search input */
        // Defer until the DOM nodes are in the document
        section.appendChild(sectionHeader);
        section.appendChild(searchWrap);
        section.appendChild(sectionBody);
        container.appendChild(section);

        // Now the nodes are reachable; attach listeners
        const searchInput = document.getElementById('productVersionSearch');
        const searchClearBtn = document.getElementById('productVersionSearchClear');
        const searchCount = document.getElementById('productVersionSearchCount');

        function applyVersionFilter(q) {
            const term = q.trim().toLowerCase();
            const cards = sectionBody.querySelectorAll('.card');
            let visible = 0;
            cards.forEach(c => {
                const match = !term || (c.dataset.search || '').includes(term);
                c.style.display = match ? '' : 'none';
                if (match) visible++;
            });
            // Update count badge
            const total = cards.length;
            searchCount.textContent = term
                ? `${visible} of ${total}`
                : `${total} version${total !== 1 ? 's' : ''}`;
            // Show/hide clear button
            searchClearBtn.style.display = term ? '' : 'none';
            // Show/hide no-results message
            noResultsMsg.style.display = (term && visible === 0) ? '' : 'none';
        }

        // Initialise count label
        applyVersionFilter('');

        searchInput.addEventListener('input', () => applyVersionFilter(searchInput.value));
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            applyVersionFilter('');
            searchInput.focus();
        });
    }

    /* ── Step 5: full release history table ─────────────────────────── */
    const tableSection = document.createElement('div');
    tableSection.className = 'section';
    tableSection.style.animationDelay = '120ms';

    const tableHeader = document.createElement('div');
    tableHeader.className = 'section-header';
    tableHeader.innerHTML = `
        <div class="section-header-left">
            <span class="section-icon">📋</span>
            <div class="section-header-text">
                <span class="section-title">Full Release History</span>
                <span class="section-date-label">${sortedCycles.length} cycles</span>
            </div>
        </div>
        <span class="section-chevron">▾</span>`;
    tableHeader.addEventListener('click', () => toggleSection(tableHeader));

    const tableBody = document.createElement('div');
    tableBody.className = 'section-body open';
    tableBody.style.gridTemplateColumns = '1fr';
    tableBody.style.maxHeight = '6000px';
    tableBody.style.opacity   = '1';
    tableBody.style.padding   = '12px';

    const tableWrap = document.createElement('div');
    tableWrap.className = 'release-table-wrap';

    const rows = sortedCycles.map(cycle => {
        const v   = cycle.latest || cycle.cycle;
        const d   = cycle.latestReleaseDate || cycle.releaseDate;
        const eol = cycle.eol;
        if (!v || !d) return '';

        const releaseDate  = new Date(d);
        const isAvailable  = releaseDate <= targetD;
        const isEolOnDate  = isCycleEolAsOf(eol, targetDate);  // ← uses the shared helper

        // Per-cycle safe check for the ✓ Safe badge
        const cycleSafe = getSafeLatest([{ v: String(v), d: String(d) }], targetDate);

        let badge = '', rowClass = '';
        if (!isAvailable) {
            badge = `<span class="release-row-badge badge-future">Future</span>`;
        } else if (isEolOnDate) {
            badge = `<span class="release-row-badge badge-eol">EOL</span>`;
        } else if (cycleSafe.safe && cycleSafe.safe.v !== 'Not released yet') {
            if (cycleSafe.fresh) {
                badge = `<span class="release-row-badge badge-fresh">Too fresh</span>`;
            } else {
                badge = `<span class="release-row-badge badge-safe">✓ Safe</span>`;
                rowClass = 'safe-row';
            }
        } else {
            badge = `<span class="release-row-badge badge-older">Older</span>`;
        }

        const ltsCell = cycle.lts
            ? `<span style="color:var(--safe);font-size:0.7rem;font-family:var(--font-mono)">LTS</span>`
            : '';

        return `
            <tr class="${rowClass}">
                <td><span class="version-mono">${v}</span> ${ltsCell}</td>
                <td>${formatDate(d)}</td>
                <td>${formatEolCell(eol)}</td>
                <td>${badge}</td>
            </tr>`;
    }).join('');

    tableWrap.innerHTML = `
        <table class="release-table">
            <thead>
                <tr>
                    <th>Version / Cycle</th>
                    <th>Release Date</th>
                    <th>End of Life</th>
                    <th>Status on ${formatDate(targetDate)}</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;

    tableBody.appendChild(tableWrap);
    tableHeader.classList.add('open');
    tableSection.appendChild(tableHeader);
    tableSection.appendChild(tableBody);
    container.appendChild(tableSection);
}

/* ══════════════════════════════════════════════════════════════════════
   HELPER: build one version card DOM node
   Used by renderProductView for both single-stream and multi-cycle paths.
   eolDateStr: ISO date string, '__permanent__' (eol:true), or null.
══════════════════════════════════════════════════════════════════════ */
function _buildSingleCard(name, safeResult, eolDateStr, targetDate, isFuture) {
    const { safe, fresh, latestDays } = safeResult;
    const card = document.createElement('div');
    card.className = 'card';

    // Permanent EOL (eol:true) or date-based EOL
    const isPermanentEol = eolDateStr === '__permanent__';
    const isDateEol      = eolDateStr && !isPermanentEol && new Date(targetDate) >= new Date(eolDateStr);
    const isEol          = isPermanentEol || isDateEol;

    if (isEol) card.classList.add('card--eol');

    if (safe.v === 'Not released yet') {
        card.innerHTML = `
            <div class="card-name">${name}</div>
            <div class="card-version-block">
                <div class="card-version-label">Safe version</div>
                <div class="not-released">Not released yet</div>
            </div>`;
        return card;
    }

    if (isEol) {
        const eolDateDisplay = isPermanentEol
            ? 'unknown date — permanently unsupported'
            : `${formatDate(eolDateStr)} — no further security patches`;
        card.innerHTML = `
            <div class="card-name">${name}</div>
            <div class="card-eol-banner">
                <span class="card-eol-icon">⚠</span>
                <div>
                    <div class="card-eol-title">End of Life</div>
                    <div class="card-eol-date">Support ended ${eolDateDisplay}</div>
                </div>
            </div>`;
        return card;
    }

    card.innerHTML = `
        <div class="card-name">${name}</div>
        <div class="card-version-block">
            <div class="card-version-label">✓ Latest safe version</div>
            <div class="card-version-number">${safe.v}</div>
            <div class="card-version-date">Released ${formatDate(safe.d)}</div>
        </div>
        ${fresh ? `
        <div class="card-fresh-note">
            ⚠ Newer version <strong>${fresh.v}</strong> (${formatDate(fresh.d)}) was only
            ${latestDays} day${latestDays !== 1 ? 's' : ''} old — too fresh to be safe
        </div>` : ''}
        ${isFuture ? `<div class="future-badge">Future OS</div>` : ''}
    `;
    return card;
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN: checkVersions()  — called by button + on page load
══════════════════════════════════════════════════════════════════════ */
window.checkVersions = function () {
    const input = document.getElementById('dateInput').value;
    if (!input) { alert('Please pick a date first!'); return; }

    if (selectedProduct) {
        // Fetch or use cached product data
        fetchAndRenderProduct(selectedProduct.slug, input);
    } else {
        renderGroupedView(input);
    }
};

/* ══════════════════════════════════════════════════════════════════════
   SELECTED PRODUCT  —  sidebar click → set → render
══════════════════════════════════════════════════════════════════════ */
function selectProduct(slug, name) {
    selectedProduct = { slug, name };

    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.toggle('active', el.dataset.slug === slug);
    });

    // Update active product bar in hero
    const bar  = document.getElementById('activeProductBar');
    const lbl  = document.getElementById('activeProductName');
    bar.style.display = 'inline-flex';
    lbl.textContent   = name || slug.replace(/-/g, ' ');

    // Navigate to home view and run
    AppNav.show('home');
    window.checkVersions();

    // Close sidebar on mobile
    if (window.innerWidth < 900) closeSidebar();
}

window.clearSelectedProduct = function () {
    selectedProduct = null;
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.getElementById('activeProductBar').style.display = 'none';
    window.checkVersions();
};

/* ══════════════════════════════════════════════════════════════════════
   FETCH PRODUCT RELEASE DATA
══════════════════════════════════════════════════════════════════════ */
async function fetchProductCycles(slug) {
    // Check memory cache first
    if (releases[slug] && releases[slug]._raw) {
        return releases[slug]._raw;
    }
    // Check localStorage cache
    try {
        const cached = JSON.parse(localStorage.getItem(LS_CACHE_KEY) || '{}');
        if (cached[slug]) {
            releases[slug] = cached[slug].list;
            releases[slug]._raw = cached[slug].raw;
            return cached[slug].raw;
        }
    } catch (_) { /* ignore */ }

    const res    = await fetch(`${API_BASE}/${slug}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cycles = await res.json();

    // Persist to localStorage
    try {
        const cached    = JSON.parse(localStorage.getItem(LS_CACHE_KEY) || '{}');
        cached[slug]    = { raw: cycles, list: normalizeCycles(cycles), ts: Date.now() };
        localStorage.setItem(LS_CACHE_KEY, JSON.stringify(cached));
    } catch (_) { /* quota exceeded — ignore */ }

    return cycles;
}

function normalizeCycles(cycles) {
    return cycles
        .map(c => {
            const d = c.latestReleaseDate || c.releaseDate;
            const v = c.latest || c.cycle;
            if (!d || !v) return null;
            return { v: String(v), d: String(d) };
        })
        .filter(Boolean)
        .sort((a, b) => b.d.localeCompare(a.d));
}

async function fetchAndRenderProduct(slug, targetDate) {
    const container = document.getElementById('results');
    container.innerHTML = `
        <div class="results-loading">
            <div class="spinner"></div>
            <span>Loading data for <strong>${slug}</strong>…</span>
        </div>`;

    try {
        const cycles = await fetchProductCycles(slug);
        renderProductView(slug, cycles, targetDate);
    } catch (e) {
        // Fallback to cached releases object if it has data
        if (releases[slug] && releases[slug].length) {
            renderGroupedView(targetDate); // graceful fallback
        } else {
            container.innerHTML = `
                <div class="results-error">
                    <div class="results-error-icon">🔌</div>
                    <div>Could not load data for <strong>${slug}</strong>.<br>
                    <small>${e.message}</small></div>
                </div>`;
        }
        setApiStatus('err', 'API error');
    }
}

/* ══════════════════════════════════════════════════════════════════════
   FETCH ALL PRODUCTS  (sidebar population)
══════════════════════════════════════════════════════════════════════ */
async function fetchAllProducts(force = false) {
    const refreshBtn = document.getElementById('sidebarRefresh');
    const refreshIcon = document.getElementById('refreshIcon');
    refreshBtn.classList.add('spinning');
    setApiStatus('', 'Fetching…');

    try {
        // Try localStorage first unless forced
        if (!force) {
            const cachedList = localStorage.getItem(LS_LIST_KEY);
            if (cachedList) {
                allProductSlugs = JSON.parse(cachedList);
                populateSidebar(allProductSlugs);
                updateLastUpdatedLabel();
                setApiStatus('ok', `${allProductSlugs.length} products`);
                refreshBtn.classList.remove('spinning');
                return;
            }
        }

        const res  = await fetch(ALL_PRODUCTS);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allProductSlugs = await res.json(); // array of slug strings

        localStorage.setItem(LS_LIST_KEY, JSON.stringify(allProductSlugs));
        localStorage.setItem(LS_TIME_KEY, new Date().toISOString());

        if (force) {
            // Clear product cache on full refresh
            localStorage.removeItem(LS_CACHE_KEY);
        }

        populateSidebar(allProductSlugs);
        updateLastUpdatedLabel();
        setApiStatus('ok', `${allProductSlugs.length} products`);

    } catch (e) {
        setApiStatus('err', 'Offline / API down');
        document.getElementById('sidebarLoading').innerHTML = `
            <div style="color:var(--eol-red);font-size:1.5rem">🔌</div>
            <span style="color:var(--eol-red)">Cannot reach EndOfLife.date<br><small>Showing local data only</small></span>`;

        // Populate sidebar with what we know from versions.js
        const fallbackSlugs = ['chrome','edge','firefox','ios','macos','dotnet'];
        populateSidebar(fallbackSlugs);
    } finally {
        refreshBtn.classList.remove('spinning');
    }
}

/* ══════════════════════════════════════════════════════════════════════
   POPULATE SIDEBAR
══════════════════════════════════════════════════════════════════════ */
function populateSidebar(slugs) {
    const list = document.getElementById('sidebarList');
    list.innerHTML = '';

    document.getElementById('productCount').textContent = slugs.length;

    // Build items
    allSidebarItems = slugs.map(slug => ({
        slug,
        name: formatSlugName(slug),
        el: null,
    }));

    // Alphabetical group by first letter
    const grouped = {};
    allSidebarItems.forEach(item => {
        const letter = item.name[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(item);
    });

    Object.keys(grouped).sort().forEach(letter => {
        const groupLabel      = document.createElement('div');
        groupLabel.className  = 'sidebar-group-label';
        groupLabel.textContent = letter;
        list.appendChild(groupLabel);

        grouped[letter].forEach(item => {
            const el = document.createElement('div');
            el.className   = 'sidebar-item';
            el.dataset.slug = item.slug;
            el.dataset.name = item.name.toLowerCase();

            // EOL dot — basic heuristic from cached data
            const dot = makeDot(item.slug);

            el.innerHTML = `
                <div class="sidebar-eol-dot ${dot}"></div>
                <span class="sidebar-item-name">${item.name}</span>
            `;
            el.addEventListener('click', () => selectProduct(item.slug, item.name));

            item.el = el;
            list.appendChild(el);
        });
    });
}

let allSidebarItems = [];

function makeDot(slug) {
    // Check if we have data for this product in the releases cache
    const data = releases[slug];
    if (!data || !data.length) return 'eol-dot--grey';

    const latest = data[0];
    if (!latest) return 'eol-dot--grey';
    // Green if recent release (within 2 years)
    const daysOld = (new Date() - new Date(latest.d)) / 86400000;
    if (daysOld < 730) return 'eol-dot--green';
    if (daysOld < 1460) return 'eol-dot--orange';
    return 'eol-dot--red';
}

function formatSlugName(slug) {
    // Convert slug to readable name
    return slug
        .replace(/-/g, ' ')
        .replace(/\b(\w)/g, l => l.toUpperCase())
        .replace(/\bAmazon\b/, 'Amazon')
        .replace(/\bLts\b/, 'LTS')
        .replace(/\bVmware\b/, 'VMware')
        .replace(/\bIos\b/, 'iOS')
        .replace(/\bMacos\b/, 'macOS')
        .replace(/\bDotnet\b/, '.NET');
}

/* ══════════════════════════════════════════════════════════════════════
   SIDEBAR SEARCH FILTER
══════════════════════════════════════════════════════════════════════ */
const sidebarSearch = document.getElementById('sidebarSearch');
const searchClear   = document.getElementById('searchClear');

sidebarSearch.addEventListener('input', () => {
    const q = sidebarSearch.value.trim().toLowerCase();
    searchClear.classList.toggle('visible', q.length > 0);
    filterSidebar(q);
});

searchClear.addEventListener('click', () => {
    sidebarSearch.value = '';
    searchClear.classList.remove('visible');
    filterSidebar('');
});

function filterSidebar(q) {
    const list = document.getElementById('sidebarList');
    let visibleCount = 0;

    // Show/hide items and labels
    let lastLabel = null;
    let labelHasVisible = false;

    Array.from(list.children).forEach(el => {
        if (el.classList.contains('sidebar-group-label')) {
            if (lastLabel && !labelHasVisible) lastLabel.style.display = 'none';
            lastLabel = el;
            labelHasVisible = false;
            el.style.display = '';
        } else if (el.classList.contains('sidebar-item')) {
            const name = el.dataset.name || '';
            const slug = el.dataset.slug || '';
            const match = !q || name.includes(q) || slug.includes(q);
            el.style.display = match ? '' : 'none';
            if (match) { visibleCount++; labelHasVisible = true; }
        }
    });
    if (lastLabel && !labelHasVisible) lastLabel.style.display = 'none';

    // No results message
    let noResults = list.querySelector('.sidebar-no-results');
    if (q && visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'sidebar-no-results';
            list.appendChild(noResults);
        }
        noResults.textContent = `No products matching "${q}"`;
    } else if (noResults) {
        noResults.remove();
    }
}

/* ══════════════════════════════════════════════════════════════════════
   REFRESH BUTTON
══════════════════════════════════════════════════════════════════════ */
document.getElementById('sidebarRefresh').addEventListener('click', () => {
    fetchAllProducts(true);
});

/* ══════════════════════════════════════════════════════════════════════
   LAST UPDATED LABEL
══════════════════════════════════════════════════════════════════════ */
function updateLastUpdatedLabel() {
    const ts = localStorage.getItem(LS_TIME_KEY);
    if (!ts) return;
    const d = new Date(ts);
    document.getElementById('lastUpdated').textContent =
        `Updated ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

/* ══════════════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    Theme.init();

    // Open all link categories by default
    document.querySelectorAll('.lcat-header').forEach(h => {
        h.classList.add('open');
        h.nextElementSibling.classList.add('open');
    });

    // Default date
    document.getElementById('dateInput').value = new Date().toISOString().slice(0, 10);

    // Render default grouped view immediately with static data
    renderGroupedView(document.getElementById('dateInput').value);

    // Then load API data for sidebar (non-blocking)
    fetchAllProducts(false);

    updateLastUpdatedLabel();
});
