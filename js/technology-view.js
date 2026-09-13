/**
 * AQUAÉRA — Exploded Technology View & Layer Selector
 */

(function () {
  'use strict';

  const layers = document.querySelectorAll('.tech-layer-card');
  const cutawayImage = document.querySelector('.tech-cutaway-stage img');
  const scanLine = document.querySelector('.tech-scanline');

  if (!layers.length || !cutawayImage) return;

  const LAYER_EFFECTS = {
    '1': {
      zoom: 'scale(1.08) translate(2%, -2%)',
      filter: 'brightness(1.1) contrast(1.1)'
    },
    '2': {
      zoom: 'scale(1.15) translate(-3%, 2%)',
      filter: 'brightness(1.2) hue-rotate(15deg)'
    },
    '3': {
      zoom: 'scale(1.12) translate(0%, -3%)',
      filter: 'brightness(1.05) saturate(1.2)'
    },
    '4': {
      zoom: 'scale(1.18) translate(3%, 3%)',
      filter: 'brightness(1.25) hue-rotate(-20deg)'
    },
    '5': {
      zoom: 'scale(1.1) translate(0%, 0%)',
      filter: 'brightness(1.15) saturate(1.35)'
    }
  };

  layers.forEach(card => {
    card.addEventListener('click', () => {
      layers.forEach(l => l.classList.remove('active'));
      card.classList.add('active');

      const step = card.getAttribute('data-layer') || '1';
      const effect = LAYER_EFFECTS[step];

      if (effect) {
        cutawayImage.style.transform = effect.zoom;
        cutawayImage.style.filter = effect.filter;
      }

      // Trigger scanline pulse
      if (scanLine) {
        scanLine.style.animation = 'none';
        void scanLine.offsetWidth; // trigger reflow
        scanLine.style.animation = 'scan 2.5s linear 1';
      }
    });
  });

  // Auto-cycle through layers if user doesn't interact for 8 seconds
  let autoCycleIndex = 0;
  let hasUserInteracted = false;

  layers.forEach(card => {
    card.addEventListener('mouseenter', () => {
      hasUserInteracted = true;
    });
  });

  setInterval(() => {
    if (hasUserInteracted) return;
    autoCycleIndex = (autoCycleIndex + 1) % layers.length;
    layers[autoCycleIndex].click();
  }, 6000);
})();
