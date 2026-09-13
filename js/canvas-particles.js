/**
 * AQUAÉRA — Atmospheric Particle & Moisture Fluid Simulation (Light Theme)
 */

(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 130 };
  let isRunning = true;

  const PARTICLE_COUNT = 75;
  const COLORS = [
    'rgba(14, 165, 233, 0.55)',  // Vivid Aqua
    'rgba(56, 189, 248, 0.45)',  // Sky blue
    'rgba(2, 132, 199, 0.38)',   // Ocean cyan
    'rgba(186, 230, 253, 0.65)'  // Pure mist droplet
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.6 + 1.2;
      this.baseSize = this.size;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.65 + 0.25);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationOffset = Math.random() * Math.PI * 2;
    }

    update() {
      this.oscillationOffset += this.oscillationSpeed;
      this.x += this.vx + Math.sin(this.oscillationOffset) * 0.3;
      this.y += this.vy;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 2;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 2.5;
        this.y -= Math.sin(angle) * force * 2.5;
        this.size = this.baseSize * 1.5;
      } else {
        this.size = this.baseSize;
      }

      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = 'rgba(14, 165, 233, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - dist / 80)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
    }, 150);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isRunning = entry.isIntersecting;
      if (isRunning) animate();
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);

  init();
  animate();
})();
