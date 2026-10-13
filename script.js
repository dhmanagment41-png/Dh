/* ==========================================
   DH Management - Main Site Script
========================================== */

document.addEventListener('DOMContentLoaded', function () {
    Promise.resolve(window.siteSync.load())
        .catch((error) => console.error('Could not load shared site content:', error))
        .finally(() => {
            loadSiteData();
            setupNavigation();
        });
});

function isImageSource(value) {
    return /^(https?:\/\/|data:|blob:)/i.test(value) || /\.(avif|gif|jpe?g|png|webp)([?#]|$)/i.test(value);
}

function setServiceCardImage(card, source) {
    const image = document.createElement('img');
    image.className = 'service-card-image';
    image.src = source;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    card.classList.add('has-background-image');
    card.prepend(image);

    const icon = card.querySelector('.icon');
    if (icon) icon.hidden = true;
}

const defaultServiceBackgrounds = [
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
];
const defaultAboutBackgrounds = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80'
];
const defaultAboutFeatures = [
    { title: 'Build Strong & Memorable', icon: '' },
    { title: 'Reach your target audience', icon: '' },
    { title: 'Achieve real sales growth', icon: '' },
    { title: 'Exceed expectations', icon: '' }
];
const defaultServices = [
    { title: 'Professional Graphic Design', media: '' },
    { title: 'Video Production & Advertising', media: '' },
    { title: 'Content Creation & Management', media: '' },
    { title: 'Social Media Management', media: '' },
    { title: 'Website Software Development', media: '' },
    { title: 'Paid Advertising Campaigns', media: '' }
];
const defaultWhyItems = [
    { text: 'Comprehensive digital strategies tailored to your brand.' },
    { text: 'Data-driven campaigns that maximize ROI.' },
    { text: 'Creative content that engages your audience.' },
    { text: 'Dedicated support and transparent reporting.' }
];
const defaultTeamMembers = [
    { name: 'Name 1', job: 'Job Title', photo: '' },
    { name: 'Name 2', job: 'Job Title', photo: '' }
];
const defaultContactLinks = [
    { label: 'Phone', url: '#' },
    { label: 'Email', url: '#' },
    { label: 'WhatsApp', url: '#' }
];

function readSiteArray(key, fallback) {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback.map((item) => ({ ...item }));
    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : fallback.map((item) => ({ ...item }));
    } catch {
        return fallback.map((item) => ({ ...item }));
    }
}

function setupNavigation() {
    const links = [...document.querySelectorAll('header nav a[href^="#"]')];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function updateCurrentLink() {
        const marker = window.innerHeight * 0.38;
        let activeSection = sections[0];
        sections.forEach((section) => {
            const bounds = section.getBoundingClientRect();
            if (bounds.top <= marker && bounds.bottom > marker) activeSection = section;
        });
        links.forEach((link) => {
            if (activeSection && link.getAttribute('href') === `#${activeSection.id}`) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('scroll', updateCurrentLink, { passive: true });
    window.addEventListener('resize', updateCurrentLink);
    window.addEventListener('hashchange', updateCurrentLink);
    updateCurrentLink();
}

function loadSiteData() {
    // ============ اللوجو (صورة أو نص) ============
    const logoImage = localStorage.getItem('siteLogoImage');
    const logoText = localStorage.getItem('siteLogo');

    // لوجو الهيدر (صغير)
    const logoImgSmall = document.getElementById('logoImageSmall');
    const logoTextSmall = document.getElementById('logoTextSmall');
    
    if (logoImage) {
        logoImgSmall.src = logoImage;
        logoImgSmall.style.display = 'block';
        logoTextSmall.style.display = 'none';
    } else if (logoText) {
        logoTextSmall.innerText = logoText;
        logoTextSmall.style.display = 'block';
        logoImgSmall.style.display = 'none';
    } else {
        logoTextSmall.innerText = 'DH';
        logoTextSmall.style.display = 'block';
    }

    // لوجو الهيرو (كبير)
    const logoImgLarge = document.getElementById('logoImageLarge');
    const logoTextLarge = document.getElementById('logoTextLarge');
    
    if (logoImage) {
        logoImgLarge.src = logoImage;
        logoImgLarge.style.display = 'block';
        logoTextLarge.style.display = 'none';
    } else if (logoText) {
        logoTextLarge.innerText = logoText;
        logoTextLarge.style.display = 'block';
        logoImgLarge.style.display = 'none';
    } else {
        logoTextLarge.innerText = 'DH';
        logoTextLarge.style.display = 'block';
    }

    // ============ النصوص ============
    const heroTitle = localStorage.getItem('heroTitle');
    const heroDesc = localStorage.getItem('heroDesc');
    const aboutText = localStorage.getItem('aboutText');
    const mission = localStorage.getItem('mission');
    const vision = localStorage.getItem('vision');

    if (heroTitle) document.getElementById('heroTitleText').innerText = heroTitle;
    if (heroDesc) document.getElementById('heroDescText').innerText = heroDesc;
    if (aboutText) document.getElementById('aboutText').innerText = aboutText;
    if (mission) document.getElementById('missionText').innerText = mission;
    if (vision) document.getElementById('visionText').innerText = vision;
    const missionImage = localStorage.getItem('missionImage');
    const visionImage = localStorage.getItem('visionImage');
    if (missionImage) document.getElementById('missionBackgroundImage').src = missionImage;
    if (visionImage) document.getElementById('visionBackgroundImage').src = visionImage;

    const publicHeadings = [
        'aboutHeading', 'whyHeading', 'missionHeading', 'missionCardHeading',
        'visionCardHeading', 'servicesHeading', 'teamHeading', 'clientsHeading',
        'clientsDesc', 'contactHeading', 'contactDesc', 'contactSubheading'
    ];
    publicHeadings.forEach(function (key) {
        const element = document.getElementById(key);
        const value = localStorage.getItem(key);
        if (element && value !== null) element.textContent = value;
    });

    // ============ الصور ============
    const whyImg = localStorage.getItem('whyImg');
    const whyImgElement = document.getElementById('whyImg');
    if (whyImg) {
        whyImgElement.src = whyImg;
        whyImgElement.style.display = 'block';
    }

    const aboutIcons = readSiteArray('aboutIcons', []);
    const savedFeatures = localStorage.getItem('aboutFeatures');
    const aboutFeatures = savedFeatures === null
        ? defaultAboutFeatures.map((feature, index) => ({ ...feature, icon: aboutIcons[index] || '' }))
        : readSiteArray('aboutFeatures', []);
    const aboutGrid = document.getElementById('aboutFeaturesGrid');
    aboutGrid.replaceChildren();
    aboutFeatures.filter((feature) => feature.title).forEach(function (feature) {
        const card = document.createElement('div');
        card.className = 'card service-card';
        const icon = document.createElement('div');
        icon.className = 'icon';
        const title = document.createElement('h4');
        title.textContent = feature.title;
        card.append(icon, title);
        const background = feature.icon && isImageSource(feature.icon)
            ? feature.icon
            : defaultAboutBackgrounds[aboutFeatures.indexOf(feature)];
        if (background) setServiceCardImage(card, background);
        if (feature.icon && !isImageSource(feature.icon)) {
            icon.hidden = false;
            icon.textContent = feature.icon;
        }
        aboutGrid.appendChild(card);
    });

    const whyItems = readSiteArray('whyItems', defaultWhyItems);
    const whyList = document.getElementById('whyItems');
    whyList.replaceChildren();
    whyItems.filter((item) => typeof item === 'string' ? item : item.text)
        .forEach(function (item, index) {
            const listItem = document.createElement('li');
            const text = typeof item === 'string' ? item : item.text;
            listItem.textContent = `${index + 1}. ${text}`;
            whyList.appendChild(listItem);
        });

    const legacyServiceIcons = readSiteArray('serviceIcons', []);
    const legacyDynamicServices = readSiteArray('dynamicServices', []);
    const migratedServices = defaultServices.map((service, index) => ({
        ...service,
        media: legacyServiceIcons[index] || ''
    })).concat(legacyDynamicServices.map((service) => ({
        title: service.title || '',
        media: service.icon || service.media || ''
    })));
    const services = readSiteArray('siteServices', migratedServices);
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.replaceChildren();
    services.filter((service) => service.title).forEach(function (service, index) {
        const card = document.createElement('div');
        card.className = 'card service-card';
        const icon = document.createElement('div');
        icon.className = 'icon';
        const title = document.createElement('h4');
        title.textContent = service.title;
        card.append(icon, title);

        if (service.media && isImageSource(service.media)) {
            setServiceCardImage(card, service.media);
        } else {
            if (defaultServiceBackgrounds[index]) setServiceCardImage(card, defaultServiceBackgrounds[index]);
            if (service.media) {
                icon.hidden = false;
                icon.textContent = service.media;
            }
        }
        servicesGrid.appendChild(card);
    });

    const teamMembers = readSiteArray('teamMembers', defaultTeamMembers);
    const teamContainer = document.getElementById('teamGrid');
    teamContainer.replaceChildren();
    teamMembers.filter((member) => member.name || member.job).forEach(function (member) {
        const card = document.createElement('div');
        card.className = 'team-member';
        if (member.photo && isImageSource(member.photo)) {
            const image = document.createElement('img');
            image.className = 'team-member-photo';
            image.src = member.photo;
            image.alt = member.name || '';
            card.appendChild(image);
        }
        const name = document.createElement('h4');
        name.textContent = member.name || '';
        const job = document.createElement('p');
        job.className = 'muted-text';
        job.textContent = member.job || '';
        card.append(name, job);
        teamContainer.appendChild(card);
    });

    const legacyClientLogos = readSiteArray('clientLogos', []);
    const migratedClients = legacyClientLogos.map((client, index) => ({
        name: typeof client === 'string' ? `Client ${index + 1}` : client.name || `Client ${index + 1}`,
        logo: typeof client === 'string' ? client : client.logo || ''
    }));
    const clients = readSiteArray('clients', migratedClients);
    const clientsGrid = document.getElementById('clientsGrid');
    clientsGrid.replaceChildren();
    clients.filter((client) => client.logo).forEach(function (client) {
        const box = document.createElement('div');
        box.className = 'client-logo-box';
        const image = document.createElement('img');
        image.src = client.logo;
        image.alt = client.name || 'Client logo';
        box.appendChild(image);
        clientsGrid.appendChild(box);
    });

    const contactLinks = readSiteArray('contactLinks', defaultContactLinks);
    const contactContainer = document.getElementById('contactLinks');
    contactContainer.replaceChildren();
    contactLinks.filter((link) => link.label && link.url && link.url !== '#').forEach(function (link) {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.label;
        contactContainer.appendChild(anchor);
    });
}