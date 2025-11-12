// versions.js
const releases = {
    chrome: [
        {v: "142", d: "2025-10-28"}, {v: "141", d: "2025-09-30"}, {v: "140", d: "2025-09-02"},
        {v: "139", d: "2025-08-05"}, {v: "138", d: "2025-06-24"}, {v: "137", d: "2025-05-27"},
        {v: "136", d: "2025-04-29"}, {v: "135", d: "2025-04-01"}, {v: "134", d: "2025-03-04"},
        {v: "133", d: "2025-02-04"}, {v: "132", d: "2025-01-14"}, {v: "131", d: "2024-11-12"},
        {v: "130", d: "2024-10-15"}, {v: "129", d: "2024-09-17"}, {v: "128", d: "2024-08-20"}
    ],
    edge: [
        {v: "142", d: "2025-10-31"}, {v: "141", d: "2025-10-02"}, {v: "140", d: "2025-09-05"},
        {v: "139", d: "2025-08-07"}, {v: "138", d: "2025-06-26"}, {v: "137", d: "2025-05-29"},
        {v: "136", d: "2025-05-01"}, {v: "135", d: "2025-04-03"}, {v: "134", d: "2025-03-06"},
        {v: "133", d: "2025-02-06"}, {v: "132", d: "2025-01-17"}, {v: "131", d: "2024-11-14"},
        {v: "130", d: "2024-10-17"}, {v: "129", d: "2024-09-19"}, {v: "128", d: "2024-08-22"}
    ],
    firefox: [
        {v: "144", d: "2025-10-14"}, {v: "143", d: "2025-09-16"}, {v: "142", d: "2025-08-19"},
        {v: "141", d: "2025-07-22"}, {v: "139", d: "2025-06-25"}, {v: "138", d: "2025-05-28"},
        {v: "137", d: "2025-04-30"}, {v: "136", d: "2025-04-02"}, {v: "135", d: "2025-03-04"},
        {v: "134", d: "2025-02-04"}, {v: "133", d: "2025-01-07"}, {v: "132", d: "2024-11-26"},
        {v: "131", d: "2024-10-29"}, {v: "130", d: "2024-10-01"}, {v: "129", d: "2024-09-03"},
        {v: "128", d: "2024-08-06"}
    ],
    safari26: [
        {v: "26.1", d: "2025-11-03"}, {v: "26.0", d: "2025-09-15"}
    ],
    safari18: [
        {v: "18.6", d: "2025-07-29"}, {v: "18.5", d: "2025-05-12"}, {v: "18.4", d: "2025-03-31"},
        {v: "18.3", d: "2025-01-27"}, {v: "18.2", d: "2024-12-11"}, {v: "18.1", d: "2024-10-28"},
        {v: "18.0.1", d: "2024-10-03"}, {v: "18.0", d: "2024-09-16"}
    ],
    ios26: [
        {v: "26.1", d: "2025-11-03"}, {v: "26.0.1", d: "2025-09-29"}, {v: "26.0", d: "2025-09-15"}
    ],
    ios18: [
        {v: "18.7.2", d: "2025-11-05"}, {v: "18.7.1", d: "2025-09-29"}, {v: "18.7", d: "2025-09-15"},
        {v: "18.6.2", d: "2025-08-20"}, {v: "18.6.1", d: "2025-08-14"}, {v: "18.6", d: "2025-07-29"},
        {v: "18.5", d: "2025-05-12"}, {v: "18.4.1", d: "2025-04-16"}, {v: "18.4", d: "2025-03-31"},
        {v: "18.3.2", d: "2025-03-11"}, {v: "18.3.1", d: "2025-02-10"}, {v: "18.3", d: "2025-01-27"},
        {v: "18.2.1", d: "2025-01-06"}, {v: "18.2", d: "2024-12-11"}, {v: "18.1.1", d: "2024-11-19"},
        {v: "18.1", d: "2024-10-28"}, {v: "18.0.1", d: "2024-10-03"}, {v: "18.0", d: "2024-09-16"}
    ],
    ios17: [
        {v: "17.7.2", d: "2024-11-19"}, {v: "17.7.1", d: "2024-10-28"}, {v: "17.7", d: "2024-09-16"},
        {v: "17.6.1", d: "2024-08-19"}, {v: "17.6", d: "2024-07-29"},
        {v: "17.5.1", d: "2024-05-20"}, {v: "17.5", d: "2024-05-13"},
        {v: "17.4.1", d: "2024-03-26"}, {v: "17.4", d: "2024-03-05"},
        {v: "17.3.1", d: "2024-02-08"}, {v: "17.3", d: "2024-01-22"},
        {v: "17.2.1", d: "2023-12-19"}, {v: "17.2", d: "2023-12-11"},
        {v: "17.1.2", d: "2023-11-30"}, {v: "17.1.1", d: "2023-11-07"}, {v: "17.1", d: "2023-10-25"},
        {v: "17.0.3", d: "2023-10-04"}, {v: "17.0.1", d: "2023-09-26"}, {v: "17.0", d: "2023-09-18"}
    ],
    ios16: [
        {v: "16.7.12", d: "2025-09-15"}, {v: "16.7.11", d: "2025-03-31"},
        {v: "16.7.10", d: "2024-08-07"}, {v: "16.7.9", d: "2024-07-29"}, {v: "16.7.8", d: "2024-05-13"},
        {v: "16.7.7", d: "2024-03-21"}, {v: "16.7.6", d: "2024-03-05"}, {v: "16.7.5", d: "2024-01-22"},
        {v: "16.7.4", d: "2023-12-19"}, {v: "16.7.3", d: "2023-12-11"}, {v: "16.7.2", d: "2023-10-25"},
        {v: "16.7.1", d: "2023-10-10"}, {v: "16.7", d: "2023-09-21"},
        {v: "16.6.1", d: "2023-09-07"}, {v: "16.6", d: "2023-07-24"},
        {v: "16.5.1", d: "2023-07-12"}, {v: "16.5", d: "2023-05-18"},
        {v: "16.4.1", d: "2023-04-07"}, {v: "16.4", d: "2023-03-27"},
        {v: "16.3.1", d: "2023-02-13"}, {v: "16.3", d: "2023-01-23"},
        {v: "16.2", d: "2022-12-13"},
        {v: "16.1.2", d: "2022-11-30"}, {v: "16.1.1", d: "2022-11-09"}, {v: "16.1", d: "2022-10-24"},
        {v: "16.0.3", d: "2022-10-10"}, {v: "16.0.2", d: "2022-09-22"}, {v: "16.0.1", d: "2022-09-14"},
        {v: "16.0", d: "2024-09-12"}
    ],
    macos26: [
        {v: "26.1 Tahoe", d: "2025-11-03"}, {v: "26.0.1 Tahoe", d: "2025-09-29"}, {v: "26.0 Tahoe", d: "2025-09-15"}
    ],
    ipadOS16: [
        {v: "16.7.12", d: "2025-09-15"}, {v: "16.7.11", d: "2025-03-31"},
        {v: "16.7.10", d: "2024-08-07"}, {v: "16.7.9", d: "2024-07-29"}, {v: "16.7.8", d: "2024-05-13"},
        {v: "16.7.7", d: "2024-03-21"}, {v: "16.7.6", d: "2024-03-05"}, {v: "16.7.5", d: "2024-01-22"},
        {v: "16.7.4", d: "2023-12-19"}, {v: "16.7.3", d: "2023-12-11"}, {v: "16.7.2", d: "2023-10-25"},
        {v: "16.7.1", d: "2023-10-10"}, {v: "16.7", d: "2023-09-21"}, {v: "16.6.1", d: "2023-09-07"},
        {v: "16.6", d: "2023-07-24"}, {v: "16.5.1", d: "2023-07-12"}, {v: "16.5", d: "2023-05-18"},
        {v: "16.4.1", d: "2023-05-01"}, {v: "16.4", d: "2023-03-27"}, {v: "16.3.1", d: "2023-02-13"},
        {v: "16.3", d: "2023-01-23"}, {v: "16.2", d: "2022-12-13"}, {v: "16.1.1", d: "2022-11-09"},
        {v: "16.1", d: "2022-10-24"}
    ],
    ipadOS17: [
        {v: "17.7.10", d: "2025-08-20"}, {v: "17.7.9", d: "2025-07-29"}, {v: "17.7.8", d: "2025-05-19"},
        {v: "17.7.7", d: "2025-05-12"}, {v: "17.7.6", d: "2025-03-31"}, {v: "17.7.5", d: "2025-02-10"},
        {v: "17.7.4", d: "2025-01-27"}, {v: "17.7.3", d: "2024-12-11"}, {v: "17.7.2", d: "2024-11-19"},
        {v: "17.7.1", d: "2024-10-28"}, {v: "17.7", d: "2024-09-16"}, {v: "17.6.1", d: "2024-08-19"},
        {v: "17.6", d: "2024-07-29"}, {v: "17.5.1", d: "2024-05-20"}, {v: "17.5", d: "2024-05-13"},
        {v: "17.4.1", d: "2024-03-21"}, {v: "17.4", d: "2024-03-05"}, {v: "17.3.1", d: "2024-02-08"},
        {v: "17.3", d: "2024-01-22"}, {v: "17.2", d: "2023-12-11"}, {v: "17.1.2", d: "2023-11-30"},
        {v: "17.1.1", d: "2023-11-07"}, {v: "17.1", d: "2023-10-25"}, {v: "17.0.3", d: "2023-10-04"},
        {v: "17.0.2", d: "2023-09-26"}, {v: "17.0.1", d: "2023-09-21"}, {v: "17.0", d: "2023-09-18"}
    ],
    ipadOS18: [
         {v: "18.7.2", d: "2025-11-05"}, {v: "18.7.1", d: "2025-09-29"}, {v: "18.7", d: "2025-09-15"},
         {v: "18.6.2", d: "2025-08-20"}, {v: "18.6.1", d: "2025-08-14"}, {v: "18.6", d: "2025-07-29"},
         {v: "18.5", d: "2025-05-12"}, {v: "18.4.1", d: "2025-04-16"}, {v: "18.4", d: "2025-03-31"},
         {v: "18.3.2", d: "2025-03-11"}, {v: "18.3.1", d: "2025-02-10"}, {v: "18.3", d: "2025-01-27"},
         {v: "18.2.1", d: "2025-01-06"}, {v: "18.2", d: "2024-12-11"}, {v: "18.1.1", d: "2024-11-19"},
         {v: "18.1", d: "2024-10-28"}, {v: "18.0.1", d: "2024-10-03"}, {v: "18.0", d: "2024-09-16"}
    ],
    ipadOS26: [
        {v: "26.1", d: "2025-11-03"},
        {v: "26.0.1", d: "2025-09-29"},
        {v: "26.0", d: "2025-09-15"}
    ],
    macos15: [
        {v: "15.7.2 Sequoia", d: "2025-11-03"}, {v: "15.7.1 Sequoia", d: "2025-09-29"}, {v: "15.7 Sequoia", d: "2025-09-15"},
        {v: "15.6.1 Sequoia", d: "2025-08-20"}, {v: "15.6 Sequoia", d: "2025-07-29"}, {v: "15.5 Sequoia", d: "2025-05-12"},
        {v: "15.4.1 Sequoia", d: "2025-04-16"}, {v: "15.4 Sequoia", d: "2025-03-31"}, {v: "15.3.2 Sequoia", d: "2025-03-11"},
        {v: "15.3.1 Sequoia", d: "2025-02-10"}, {v: "15.3 Sequoia", d: "2025-01-27"}, {v: "15.2 Sequoia", d: "2024-12-11"},
        {v: "15.1.1 Sequoia", d: "2024-11-19"}, {v: "15.1 Sequoia", d: "2024-10-28"}, {v: "15.0.1 Sequoia", d: "2024-10-03"},
        {v: "15.0 Sequoia", d: "2024-09-16"}
    ],
    macos14: [
        {v: "14.8.3 Sonoma", d: "2025-11-06"}, {v: "14.8.2 Sonoma", d: "2025-11-03"}, {v: "14.8.1 Sonoma", d: "2025-09-29"}, {v: "14.8 Sonoma", d: "2025-09-15"},
        {v: "14.7.8 Sonoma", d: "2025-08-20"}, {v: "14.7.7 Sonoma", d: "2025-07-29"}, {v: "14.7.6 Sonoma", d: "2025-05-12"}, {v: "14.7.5 Sonoma", d: "2025-03-31"},
        {v: "14.7.4 Sonoma", d: "2025-02-10"}, {v: "14.7.3 Sonoma", d: "2025-01-27"}, {v: "14.7.2 Sonoma", d: "2024-12-11"}, {v: "14.7.1 Sonoma", d: "2024-10-28"},
        {v: "14.7 Sonoma", d: "2024-09-16"}, {v: "14.6.1 Sonoma", d: "2024-08-07"}, {v: "14.6 Sonoma", d: "2024-07-29"}, {v: "14.5 Sonoma", d: "2024-05-13"},
        {v: "14.4.1 Sonoma", d: "2024-03-25"}, {v: "14.4 Sonoma", d: "2024-03-07"}, {v: "14.3.1 Sonoma", d: "2024-02-08"}, {v: "14.3 Sonoma", d: "2024-01-22"},
        {v: "14.2.1 Sonoma", d: "2023-12-19"}, {v: "14.2 Sonoma", d: "2023-12-11"}, {v: "14.1.2 Sonoma", d: "2023-11-30"}, {v: "14.1.1 Sonoma", d: "2023-11-07"},
        {v: "14.1 Sonoma", d: "2023-10-25"}, {v: "14.0 Sonoma", d: "2023-09-26"}
    ],
    macos13: [
        {v: "13.7.8 Ventura", d: "2025-08-20"}, {v: "13.7.7 Ventura", d: "2025-07-29"}, {v: "13.7.6 Ventura", d: "2025-05-12"}, {v: "13.7.5 Ventura", d: "2025-03-31"},
        {v: "13.7.4 Ventura", d: "2025-02-10"}, {v: "13.7.3 Ventura", d: "2025-01-27"}, {v: "13.7.2 Ventura", d: "2024-12-11"}, {v: "13.7.1 Ventura", d: "2024-10-28"},
        {v: "13.7 Ventura", d: "2024-09-16"}, {v: "13.6.9 Ventura", d: "2024-08-07"}, {v: "13.6.8 Ventura", d: "2024-07-29"}, {v: "13.6.7 Ventura", d: "2024-05-13"},
        {v: "13.6.6 Ventura", d: "2024-03-25"}, {v: "13.6.5 Ventura", d: "2024-03-07"}, {v: "13.6.4 Ventura", d: "2024-01-22"}, {v: "13.6.3 Ventura", d: "2023-12-11"},
        {v: "13.6.2 Ventura", d: "2023-11-07"}, {v: "13.6.1 Ventura", d: "2023-10-25"}, {v: "13.6 Ventura", d: "2023-09-21"}, {v: "13.5.2 Ventura", d: "2023-09-07"},
        {v: "13.5.1 Ventura", d: "2023-08-17"}, {v: "13.5 Ventura", d: "2023-07-24"}, {v: "13.4.1 Ventura", d: "2023-07-12"}, {v: "13.4.1 Ventura", d: "2023-07-10"},
        {v: "13.4.1 Ventura", d: "2023-06-21"}, {v: "13.4 Ventura", d: "2023-05-18"}, {v: "13.3.1 Ventura", d: "2023-05-01"}, {v: "13.3.1 Ventura", d: "2023-04-07"},
        {v: "13.3 Ventura", d: "2023-03-27"}, {v: "13.2.1 Ventura", d: "2023-02-13"}, {v: "13.2 Ventura", d: "2023-01-23"}, {v: "13.1 Ventura", d: "2022-12-13"},
        {v: "13.0.1 Ventura", d: "2022-11-09"}, {v: "13.0 Ventura", d: "2022-10-24"}
    ]
};

const emojis = {
    chrome:"Chrome", edge:"Edge", firefox:"Firefox",
    safari26:"Safari 26", safari18:"Safari 18",
    ios26:"iOS 26", ios18:"iOS 18", ios17:"iOS 17", ios16:"iOS 16",
    ipadOS16:"ipadOS 16", ipadOS17:"ipadOS 17", ipadOS18:"ipadOS 18", ipadOS26:"ipadOS 26",
    macos26:"macOS 26", macos15:"macOS 15",
    macos14:"macOS 14", macos13:"macOS 13"
};

/* ---------- GROUP DEFINITIONS ---------- */
const groups = [
    {
        id:"browsers", title:"Browsers",
        platforms:[
            {key:"chrome",   name:"Google Chrome"},
            {key:"edge",     name:"Microsoft Edge"},
            {key:"safari18", name:"Safari 18"},
            {key:"safari26", name:"Safari 26"},
            {key:"firefox",  name:"Firefox"}
        ]
    },
    {
        id:"macos", title:"macOS",
        platforms:[
            {key:"macos13", name:"macOS 13 Ventura"},
            {key:"macos14", name:"macOS 14 Sonoma"},
            {key:"macos15", name:"macOS 15 Sequoia"},
            {key:"macos26", name:"macOS 26 Tahoe"}
        ]
    },
    {
        id:"ios", title:"iOS",
        platforms:[
            {key:"ios16", name:"iOS 16"},
            {key:"ios17", name:"iOS 17 Not in Support Anymore after 24 September 2025"},
            {key:"ios18", name:"iOS 18"},
            {key:"ios26", name:"iOS 26"}
        ]
    },
    {
        id:"ipados", title:"iPadOS",
        platforms:[
            {key:"ipadOS16", name:"iPadOS 16"},
            {key:"ipadOS17", name:"iPadOS 17"},
            {key:"ipadOS18", name:"iPadOS 18"},
            {key:"ipadOS26", name:"iPadOS 26"}
        ]
    }
];

/* ---------- CORE LOGIC ---------- */
function getSafeLatest(list, targetDate){
    const target = new Date(targetDate);
    const available = list.filter(r=>new Date(r.d)<=target);
    if(!available.length) return {safe:{v:"Not released yet"}, fresh:null};

    const safeVersion = available.find(r=>{
        const days = (target-new Date(r.d))/86400000;
        return days>=14;
    });
    const latest = available[0];
    const latestDays = Math.floor((target-new Date(latest.d))/86400000);
    return {safe: safeVersion||latest, fresh:latestDays<14?latest:null, latestDays};
}

/* ---------- HELPER: Format YYYY-MM-DD → 12th September 2025 ---------- */
function formatReleaseDate(dateStr) {
    if (!dateStr || dateStr === '—') return '—';
    
    const d = new Date(dateStr);
    const day = d.getDate();
    const monthNames = ["January","February","March","April","May","June",
                        "July","August","September","October","November","December"];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    const suffix = (day => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    })(day);

    return `${day}${suffix} ${month} ${year}`;
}

/* ---------- RENDER ONE CARD ---------- */
function renderCard(p, data) {
    const { safe, fresh, latestDays } = data;
    
    const safeDate = formatReleaseDate(safe.d);
    const freshDate = fresh ? formatReleaseDate(fresh.d) : null;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <span class="emoji">${emojis[p.key]}</span>
        <h3>${p.name}</h3>
        <div class="safe-version">
            <div class="version-big">${safe.v}</div>
            <div>Released <strong>${safeDate}</strong></div>
            <div style="margin-top:10px;font-weight:bold;color:#00a0d8;">
                This was the latest SAFE version on this date
            </div>
        </div>
        ${fresh ? `
        <div class="fresh-note">
            Newer version <strong>${fresh.v}</strong> released on <strong>${freshDate}</strong><br>
            Only ${latestDays} day${latestDays > 1 ? 's' : ''} old too fresh! Wee Advisory :)
        </div>` : ''}
        ${p.key.includes('26') ? `<span class="future-badge">FUTURE OS!</span>` : ''}
    `;
    return card;
}

/* ---------- MAIN FUNCTION ---------- */
window.checkVersions = function(){
    const input = document.getElementById('dateInput').value;
    if(!input) return alert('Please pick a date!');

    // Format date nicely
    const selectedDate = new Date(input);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const container = document.getElementById('results');
    container.innerHTML = '';

    groups.forEach(g => {
        const sec = document.createElement('div');
        sec.className = 'section';

        // --- NEW: Date Label ---
        const dateLabel = document.createElement('div');
        dateLabel.className = 'date-label';
        dateLabel.innerHTML = `Safe versions as of <strong>${formattedDate}</strong>`;
        // --------------------------------

        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = g.title;
        header.onclick = () => {
            header.classList.toggle('open');
            sec.querySelector('.section-body').classList.toggle('open');
        };

        const body = document.createElement('div');
        body.className = 'section-body';

        g.platforms.forEach((p, i) => {
            const data = getSafeLatest(releases[p.key], input);
            const card = renderCard(p, data);
            body.appendChild(card);
            setTimeout(() => card.classList.add('show'), i * 120);
        });

        sec.appendChild(dateLabel);
        sec.appendChild(header);
        sec.appendChild(body);
        container.appendChild(sec);
    });
};

/* ---------- AUTO-LOAD ---------- */
window.addEventListener('load',()=>{
    document.getElementById('dateInput').value = "2025-11-12";
    checkVersions();
});