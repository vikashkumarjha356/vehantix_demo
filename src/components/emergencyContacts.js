import { emergencyContacts } from '../data/mockData.js';

export function renderEmergencyContacts() {
  const container = document.getElementById('section-emergency');

  const cards = emergencyContacts
    .map((contact, i) => {
      const initials = contact.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2);

      return `
      <div class="contact-card ${contact.isPrimary ? 'contact-card--primary' : ''} animate-on-scroll stagger-${i + 1}">
        ${contact.isPrimary ? '<span class="badge badge--primary" style="position:absolute;top:12px;right:12px;">Primary</span>' : ''}
        <div class="contact-card__header">
          <div class="contact-card__avatar">${initials}</div>
          <div>
            <div class="contact-card__name">${contact.name}</div>
            <div class="contact-card__relation">${contact.relationship}</div>
          </div>
        </div>
        <div class="contact-card__info">
          <div class="contact-card__row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${contact.phone}</span>
          </div>
          <div class="contact-card__row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>${contact.email}</span>
          </div>
        </div>
        <div class="contact-card__actions">
          <button class="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call
          </button>
          <button class="btn btn--outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">SOS</span>
        <h2 class="section-header__title">Emergency Contacts</h2>
      </div>
    </div>
    <div class="contacts-grid">
      ${cards}
    </div>
  `;
}
