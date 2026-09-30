/* ==========================================
   DH Management - Main Site Script
========================================== */

document.addEventListener('DOMContentLoaded', function () {
    loadSiteData();
});

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

    // ============ الصور ============
    const whyImg = localStorage.getItem('whyImg');
    const whyImgElement = document.getElementById('whyImg');
    if (whyImg) {
        whyImgElement.src = whyImg;
        whyImgElement.style.display = 'block';
    }

    // ============ الأيقونات (About) ============
    const aboutIcons = JSON.parse(localStorage.getItem('aboutIcons')) || [];
    const aboutCards = document.querySelectorAll('#about .card');
    aboutCards.forEach(function (card, index) {
        if (aboutIcons[index]) {
            const iconDiv = card.querySelector('.icon');
            if (aboutIcons[index].startsWith('http') || aboutIcons[index].startsWith('data:')) {
                iconDiv.innerHTML = `<img src="${aboutIcons[index]}" style="width:40px;height:40px; object-fit:contain;">`;
            } else {
                iconDiv.innerHTML = `<span style="font-size:30px;">${aboutIcons[index]}</span>`;
            }
        }
    });

    // ============ الأيقونات (Services) ============
    const serviceIcons = JSON.parse(localStorage.getItem('serviceIcons')) || [];
    const serviceCards = document.querySelectorAll('#services .card');
    serviceCards.forEach(function (card, index) {
        if (serviceIcons[index]) {
            const iconDiv = card.querySelector('.icon');
            if (serviceIcons[index].startsWith('http') || serviceIcons[index].startsWith('data:')) {
                iconDiv.innerHTML = `<img src="${serviceIcons[index]}" style="width:40px;height:40px; object-fit:contain;">`;
            } else {
                iconDiv.innerHTML = `<span style="font-size:30px;">${serviceIcons[index]}</span>`;
            }
        }
    });

    // ============ الفريق ============
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    const teamContainer = document.getElementById('teamGrid');
    if (teamContainer && teamMembers.length > 0) {
        teamContainer.innerHTML = '';
        teamMembers.forEach(function (member) {
            const newMember = document.createElement('div');
            newMember.className = 'team-member';
            newMember.innerHTML = `
                <h4>${member.name}</h4>
                <p class="muted-text">${member.job}</p>
            `;
            teamContainer.appendChild(newMember);
        });
    }

    // ============ العملاء (لوجوهات) ============
    const clientLogos = JSON.parse(localStorage.getItem('clientLogos')) || [];
    const clientBoxes = document.querySelectorAll('.client-logo-box');
    clientBoxes.forEach(function (box, index) {
        const img = box.querySelector('img');
        if (clientLogos[index]) {
            img.src = clientLogos[index];
            img.style.display = 'block';
        }
    });

    // ============ الخدمات الديناميكية ============
    const dynamicServices = JSON.parse(localStorage.getItem('dynamicServices')) || [];
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid && dynamicServices.length > 0) {
        dynamicServices.forEach(function (service) {
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.innerHTML = `
                <div class="icon">${service.icon ? (service.icon.startsWith('http') ? `<img src="${service.icon}" style="width:40px;height:40px;">` : `<span style="font-size:30px;">${service.icon}</span>`) : ''}</div>
                <h4>${service.title}</h4>
            `;
            servicesGrid.appendChild(newCard);
        });
    }
}