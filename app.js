/* ══════════════════════════════════════════════
   VERSION TIME MACHINE — App Logic
   Handles: SPA navigation, version rendering,
            link category toggling, vendor filtering
══════════════════════════════════════════════ */

/* ── SPA NAVIGATION ─────────────────────────── */
const App = (() => {
    const views   = document.querySelectorAll('.view');
    const navTabs = document.querySelectorAll('.nav-tab');

    function show(viewId) {
        views.forEach(v => v.classList.toggle('active', v.id === `view-${viewId}`));
        navTabs.forEach(t => t.classList.toggle('active', t.dataset.view === viewId));
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => show(tab.dataset.view));
    });

    return { show };
})();

window.showView = App.show;


/* ── SECTION TOGGLE (version results) ───────── */
function toggleSection(header) {
    const body = header.nextElementSibling;
    header.classList.toggle('open');
    body.classList.toggle('open');
}


/* ── LINK CATEGORY TOGGLE ────────────────────── */
function toggleCategory(header) {
    const body = header.nextElementSibling;
    header.classList.toggle('open');
    body.classList.toggle('open');
}

// Open all categories by default on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lcat-header').forEach(h => {
        h.classList.add('open');
        h.nextElementSibling.classList.add('open');
    });
});


/* ── VENDOR LINK SEARCH FILTER ───────────────── */
function filterLinks(query) {
    const q = query.trim().toLowerCase();
    const categories = document.querySelectorAll('.link-category');

    categories.forEach(cat => {
        const vendors = cat.querySelectorAll('.vendor-card');
        let visible = 0;

        vendors.forEach(v => {
            const text = v.textContent.toLowerCase();
            const match = !q || text.includes(q);
            v.classList.toggle('hidden', !match);
            if (match) visible++;
        });

        // Hide whole category if nothing matches
        cat.classList.toggle('hidden', visible === 0 && q.length > 0);
    });
}


/* ── GROUP ICONS ─────────────────────────────── */
const GROUP_ICONS = {
    browsers: '🌐',
    macos:    '🍎',
    ios:      '📱',
    ipados:   '🪄',
    esxi:     '🖥',
    m365:     '📊',
    dotnet:   '⚙️',
};


/* ── DATE FORMATTER ─────────────────────────── */
function formatDate(dateStr) {
    if (!dateStr || dateStr === '—') return '—';
    const d    = new Date(dateStr);
    const day  = d.getUTCDate();
    const mn   = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    const sfx  = (n) => {
        if (n > 3 && n < 21) return 'th';
        return ['th','st','nd','rd','th','th','th','th','th','th'][n % 10] ?? 'th';
    };
    return `${day}${sfx(day)} ${mn[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}


/* ── RENDER ONE VERSION CARD ─────────────────── */
function renderCard(platform, data) {
    const { safe, fresh, latestDays } = data;
    const card = document.createElement('div');
    card.className = 'card';

    const isFuture = platform.key.includes('26');

    if (safe.v === 'Not released yet') {
        card.innerHTML = `
            <div class="card-platform">${platform.name}</div>
            <div class="card-version-block">
                <div class="card-version-label">Safe version</div>
                <div class="not-released">Not released yet</div>
            </div>`;
        return card;
    }

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


/* ── MAIN: CHECK VERSIONS ────────────────────── */
window.checkVersions = function () {
    const input = document.getElementById('dateInput').value;
    if (!input) { alert('Please pick a date first!'); return; }

    const container = document.getElementById('results');
    container.innerHTML = '';

    // Result header with chosen date
    const header = document.createElement('div');
    header.className = 'result-header';
    header.innerHTML = `
        <div class="result-date-pill">
            <span>📅</span>
            Safe versions as of ${formatDate(input)}
        </div>`;
    container.appendChild(header);

    // Render each group as an accordion section
    groups.forEach((group, gi) => {
        const section = document.createElement('div');
        section.className = 'section';
        section.style.animationDelay = `${gi * 60}ms`;

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `
            <div class="section-header-left">
                <span class="section-icon">${GROUP_ICONS[group.id] ?? '📦'}</span>
                <span>${group.title}</span>
                <span class="section-count">${group.platforms.length}</span>
            </div>
            <span class="section-chevron">▾</span>`;
        sectionHeader.addEventListener('click', () => toggleSection(sectionHeader));

        const sectionBody = document.createElement('div');
        sectionBody.className = 'section-body';

        group.platforms.forEach((platform, pi) => {
            const data = getSafeLatest(releases[platform.key], input);
            const card = renderCard(platform, data);
            sectionBody.appendChild(card);
            setTimeout(() => card.classList.add('show'), gi * 60 + pi * 80);
        });

        section.appendChild(sectionHeader);
        section.appendChild(sectionBody);
        container.appendChild(section);

        // Auto-open first section
        if (gi === 0) {
            sectionHeader.classList.add('open');
            sectionBody.classList.add('open');
        }
    });
};


/* ── AUTO-LOAD ON READY ─────────────────────── */
window.addEventListener('load', () => {
    document.getElementById('dateInput').value = '2026-04-01';
    checkVersions();
});
