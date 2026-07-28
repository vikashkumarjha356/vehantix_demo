/**
 * Vehantix Dashboard — Main Entry Point
 * Initializes all components and sets up interactions
 */

import './style.css';

// Components
import { renderVehicleHero } from './components/vehicleHero.js';
import { renderOwnershipHistory } from './components/ownershipHistory.js';
import { renderChallanRecords } from './components/challanRecords.js';
import { renderAccidentHistory } from './components/accidentHistory.js';
import { renderServiceRecords } from './components/serviceRecords.js';
import { renderPartsAge } from './components/partsAge.js';
import { renderDocuments } from './components/documents.js';
import { renderMedicalDetails } from './components/medicalDetails.js';
import { renderEmergencyContacts } from './components/emergencyContacts.js';

// Utilities
import {
  initScrollAnimations,
} from './utils/animations.js';

function initTabs() {
  const btns = document.querySelectorAll('.top-nav__btn');
  const tabs = document.querySelectorAll('.tab-content');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all btns
      btns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');

      // Hide all tabs
      tabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
      });
      
      // Show target tab
      const targetId = btn.getAttribute('data-target');
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.style.display = 'block';
        targetTab.classList.add('active');
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function init() {
  // Render all sections
  renderVehicleHero();
  renderOwnershipHistory();
  renderChallanRecords();
  renderAccidentHistory();
  renderServiceRecords();
  renderPartsAge();
  renderDocuments();
  renderMedicalDetails();
  renderEmergencyContacts();

  // Initialize interactions (after DOM is populated)
  requestAnimationFrame(() => {
    initScrollAnimations();
    initTabs();
  });
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
