/**
 * AQUAÉRA — Interactive System Recommendation & ROI Calculator
 */

(function () {
  'use strict';

  const propertyPills = document.querySelectorAll('.property-pill');
  const peopleSlider = document.getElementById('people-slider');
  const peopleVal = document.getElementById('people-val');

  const resultModel = document.querySelector('.result-model-name');
  const metricOutput = document.getElementById('calc-output');
  const metricBottles = document.getElementById('calc-bottles');
  const metricCo2 = document.getElementById('calc-co2');
  const metricSavings = document.getElementById('calc-savings');

  if (!peopleSlider) return;

  let selectedProperty = 'villa';
  let occupants = 4;

  const PROPERTY_FACTORS = {
    villa: { multiplier: 3.5, label: 'Private Estate' },
    hotel: { multiplier: 6.0, label: 'Boutique Hotel' },
    office: { multiplier: 2.2, label: 'Corporate Office' },
    wellness: { multiplier: 5.5, label: 'Wellness Retreat' },
    yacht: { multiplier: 4.0, label: 'Superyacht / Island' }
  };

  function calculate() {
    const factor = PROPERTY_FACTORS[selectedProperty].multiplier;
    const dailyLiters = Math.round(occupants * factor);
    const annualLiters = dailyLiters * 365;
    
    // Each 500ml single-use bottle = 2 bottles per liter
    const bottlesSaved = Math.round(annualLiters * 2);
    // ~82.8g CO2 per single use plastic bottle production & transport
    const co2SavedKg = Math.round((bottlesSaved * 0.0828));
    // Compared to premium bottled water (~$1.80 / liter)
    const annualSavingsUsd = Math.round(annualLiters * 1.65);

    // Determine ideal system
    let system = 'Aquaéra One';
    if (dailyLiters > 250) {
      system = 'Aquaéra Enterprise Multi-Core';
    } else if (dailyLiters > 70) {
      system = 'Aquaéra Enterprise';
    } else if (dailyLiters > 25) {
      system = 'Aquaéra Grand';
    } else {
      system = 'Aquaéra One';
    }

    // Animate DOM updates
    if (resultModel) resultModel.textContent = system;
    if (metricOutput) metricOutput.textContent = `${dailyLiters} L/day`;
    if (metricBottles) metricBottles.textContent = `${bottlesSaved.toLocaleString()}`;
    if (metricCo2) metricCo2.textContent = `${co2SavedKg.toLocaleString()} kg`;
    if (metricSavings) metricSavings.textContent = `$${annualSavingsUsd.toLocaleString()}`;
  }

  // Handle Property selection
  propertyPills.forEach(pill => {
    pill.addEventListener('click', () => {
      propertyPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedProperty = pill.getAttribute('data-property') || 'villa';
      calculate();
    });
  });

  // Handle Occupants slider
  peopleSlider.addEventListener('input', (e) => {
    occupants = parseInt(e.target.value, 10);
    if (peopleVal) peopleVal.textContent = occupants >= 50 ? '50+ Occupants' : `${occupants} People`;
    calculate();
  });

  // Initial Calculation
  calculate();
})();
