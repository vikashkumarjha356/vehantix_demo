/**
 * Vehantix Dashboard — Main Entry Point
 * Initializes all components and sets up interactions
 */

import './style.css';

// Components
import { renderVehicleHero } from './components/vehicleHero.js';
import { renderVehicleHealth } from './components/vehicleHealth.js';
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
  initScrollSpy,
  initSidebar,
  initSmoothScroll,
} from './utils/animations.js';

function init() {
  // Render all sections
  renderVehicleHero();
  renderVehicleHealth();
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
    initSidebar();
    initSmoothScroll();
    initScrollAnimations();
    initScrollSpy();
  });
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
