/**
 * AQUAÉRA & TGWC — Client Inquiries & Site Survey Booking Handler
 */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Pre-fill purifier product when clicking any product CTA
  document.querySelectorAll('[data-product-select]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product-select');
      const select = form ? form.querySelector('select[name="product"]') : null;

      if (select && product) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.toLowerCase().includes(product.toLowerCase()) || 
              select.options[i].text.toLowerCase().includes(product.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (!form) return;

  const feedback = form.querySelector('.form-feedback');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const productSelect = form.querySelector('select[name="product"]');
    const product = productSelect ? productSelect.options[productSelect.selectedIndex].text : 'Water Purifier';
    const service = form.querySelector('select[name="service"]') ? form.querySelector('select[name="service"]').value : 'Installation';
    const location = form.querySelector('input[name="location"]') ? form.querySelector('input[name="location"]').value.trim() : '';
    const notes = form.querySelector('textarea[name="message"]') ? form.querySelector('textarea[name="message"]').value.trim() : '';

    if (!name) {
      showFeedback('Please provide your name.', 'error');
      return;
    }

    if (!phone) {
      showFeedback('Please provide your contact phone number.', 'error');
      return;
    }

    if (email && !emailRegex.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Scheduling Request...</span>';
    }

    try {
      // Simulate submission network call
      await new Promise(resolve => setTimeout(resolve, 750));

      showFeedback(`Thank you, ${name}! Your request for ${product} (${service}) has been booked. A water service engineer will contact you shortly to confirm your free water testing and site survey.`, 'success');
      form.reset();
    } catch (err) {
      showFeedback('An error occurred. Please call our direct helpline at 1800-266-AQUA or message us on WhatsApp.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Book Free Site Survey & Quote</span>';
      }
    }
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
  }
})();
