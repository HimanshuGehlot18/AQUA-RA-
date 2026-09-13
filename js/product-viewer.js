/**
 * AQUAÉRA — 3D Product Interactive Viewer for Home, Office, and Hotel Water Purifiers
 */

(function () {
  'use strict';

  const PRODUCT_DATA = {
    home: {
      name: 'Aquaéra Home Purifier',
      tier: 'Residential & Private Estate Pure Water',
      tagline: 'Ultra-compact architectural water purifier generating 30 liters of pure, mineralized water daily from ambient air. Designed for kitchens, pantries, and private estates with zero plumbing.',
      dailyOutput: '30 Liters / Day',
      purity: '99.999%',
      power: '320W Eco Draw',
      sound: '28 dB Whisper Silent',
      image: 'assets/images/product-home.jpg',
      hotspots: [
        { top: '30%', left: '48%', title: 'Air Induction & HEPA Pre-Filter', desc: 'Removes PM2.5, dust, allergens, and airborne micro-particles prior to condensation.' },
        { top: '55%', left: '52%', title: 'Hydrophilic Condenser Core', desc: 'Precision dew-point cooling coils extract pure atmospheric moisture with minimal energy.' },
        { top: '78%', left: '46%', title: 'Natural Mineral Balance Cell', desc: 'Infuses vital calcium, magnesium, and potassium for a crisp, refreshing 7.8 pH taste.' }
      ]
    },
    office: {
      name: 'Aquaéra Office Purifier',
      tier: 'Workplace & Executive Floor Pure Water',
      tagline: 'Continuous high-capacity atmospheric hydration system for modern offices, corporate suites, and co-working spaces. Eliminates plastic bottles and 5-gallon jugs permanently.',
      dailyOutput: '80 Liters / Day',
      purity: '99.999%',
      power: '580W Smart Variable',
      sound: '30 dB Quiet Operation',
      image: 'assets/images/app-commercial.jpg',
      hotspots: [
        { top: '25%', left: '50%', title: 'Dual Air Purification Turbines', desc: 'High-volume airflow handles continuous multi-person workplace environments.' },
        { top: '52%', left: '48%', title: 'Twin Extraction Condensers', desc: 'Delivers 80L daily yield to keep teams energized with pure cellular hydration.' },
        { top: '76%', left: '52%', title: 'Touchless Sensor Dispenser', desc: 'Hands-free infrared dispensing for glasses, carafes, and reusable bottles.' }
      ]
    },
    hotel: {
      name: 'Aquaéra Hotel Purifier',
      tier: 'Luxury Hospitality & Resort Pure Water',
      tagline: 'Industrial-grade water generation designed for boutique hotels, fine dining restaurants, and wellness resorts. Serves chilled still and sparkling water with custom carafes.',
      dailyOutput: '250 Liters / Day',
      purity: '99.9999%',
      power: '1.8 kW High-Efficiency',
      sound: '34 dB Acoustic Shielded',
      image: 'assets/images/product-hospitality.jpg',
      hotspots: [
        { top: '22%', left: '50%', title: 'Commercial Air Scrubbing Grid', desc: 'Electrostatic multi-layer filtration certified for high-traffic hospitality standards.' },
        { top: '48%', left: '54%', title: 'Continuous 254nm UV-C Circulation', desc: 'Closed-loop germicidal sanitization guarantees absolute zero microbial presence.' },
        { top: '78%', left: '48%', title: 'Dual Still & Sparkling Manifold', desc: 'Chills to 4°C with integrated micro-carbonation for tableside luxury dining.' }
      ]
    }
  };

  const stage = document.querySelector('.viewer-stage');
  const object3d = document.querySelector('.viewer-3d-object');
  const viewerImage = document.querySelector('.viewer-image');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const hotspotsContainer = document.querySelector('.hotspots-container');

  const tierEl = document.querySelector('.product-tier');
  const nameEl = document.querySelector('.product-name');
  const taglineEl = document.querySelector('.product-tagline');
  const outputEl = document.querySelector('.spec-output');
  const purityEl = document.querySelector('.spec-purity');
  const powerEl = document.querySelector('.spec-power');
  const soundEl = document.querySelector('.spec-sound');
  const ctaInquireBtn = document.querySelector('.product-actions [data-open-modal]');

  if (!stage || !object3d) return;

  let currentRotationY = 0;
  let isDragging = false;
  let startX = 0;

  // 1. 3D Tilt on Hover
  stage.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -(y / rect.height) * 14;
    const tiltY = (x / rect.width) * 16 + currentRotationY;

    object3d.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  });

  stage.addEventListener('mouseleave', () => {
    if (isDragging) return;
    object3d.style.transform = `rotateX(0deg) rotateY(${currentRotationY}deg) scale(1)`;
  });

  // 2. 360 Drag Rotation
  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stage.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    startX = e.clientX;
    currentRotationY += deltaX * 0.4;
    object3d.style.transform = `rotateX(0deg) rotateY(${currentRotationY}deg) scale(1.02)`;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      stage.style.cursor = 'grab';
    }
  });

  // Touch device support
  stage.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    startX = e.touches[0].clientX;
    currentRotationY += deltaX * 0.4;
    object3d.style.transform = `rotateX(0deg) rotateY(${currentRotationY}deg)`;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 3. Hotspots
  function renderHotspots(hotspots) {
    if (!hotspotsContainer) return;
    hotspotsContainer.innerHTML = '';

    hotspots.forEach((hs) => {
      const pin = document.createElement('div');
      pin.className = 'hotspot-pin';
      pin.style.top = hs.top;
      pin.style.left = hs.left;
      pin.setAttribute('aria-label', hs.title);

      pin.innerHTML = `
        <div class="pin-ring"></div>
        <div class="pin-core"></div>
        <div class="hotspot-tooltip">
          <div class="tooltip-title">${hs.title}</div>
          <div class="tooltip-desc">${hs.desc}</div>
        </div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.hotspot-pin').forEach(p => {
          if (p !== pin) p.classList.remove('active');
        });
        pin.classList.toggle('active');
      });

      hotspotsContainer.appendChild(pin);
    });
  }

  // 4. Switch Models
  function switchProduct(modelKey) {
    const data = PRODUCT_DATA[modelKey];
    if (!data) return;

    currentRotationY = 0;
    object3d.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';

    if (viewerImage) {
      viewerImage.style.opacity = '0.3';
      setTimeout(() => {
        viewerImage.src = data.image;
        viewerImage.alt = data.name;
        viewerImage.style.opacity = '1';
      }, 180);
    }

    if (tierEl) tierEl.textContent = data.tier;
    if (nameEl) nameEl.textContent = data.name;
    if (taglineEl) taglineEl.textContent = data.tagline;
    if (outputEl) outputEl.textContent = data.dailyOutput;
    if (purityEl) purityEl.textContent = data.purity;
    if (powerEl) powerEl.textContent = data.power;
    if (soundEl) soundEl.textContent = data.sound;

    if (ctaInquireBtn) {
      ctaInquireBtn.setAttribute('data-preset-app', data.name);
    }

    renderHotspots(data.hotspots);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const model = btn.getAttribute('data-model');
      switchProduct(model);
    });
  });

  // Also bind "View in 3D" buttons from the cards
  document.querySelectorAll('[data-switch-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModel = btn.getAttribute('data-switch-to');
      const matchingTab = document.querySelector(`.tab-btn[data-model="${targetModel}"]`);
      if (matchingTab) matchingTab.click();

      const stageEl = document.querySelector('.product-showcase-card');
      if (stageEl) {
        stageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Default to home
  switchProduct('home');
})();
