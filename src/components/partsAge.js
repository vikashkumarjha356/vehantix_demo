import { majorParts } from '../data/mockData.js';
import { formatDate, monthsBetween } from '../utils/animations.js';

export function renderPartsAge() {
  const container = document.getElementById('section-parts');

  const cards = majorParts
    .map((part, i) => {
      const ageMonths = monthsBetween(part.installedDate, null);
      const healthPct = Math.max(0, Math.round((1 - ageMonths / part.expectedLifeMonths) * 100));
      const usedPct = Math.min(100, Math.round((ageMonths / part.expectedLifeMonths) * 100));

      let status, barClass;
      if (healthPct >= 60) {
        status = 'healthy';
        barClass = 'healthy';
      } else if (healthPct >= 25) {
        status = 'aging';
        barClass = 'aging';
      } else {
        status = 'critical';
        barClass = 'critical';
      }

      return `
      <div class="part-card animate-on-scroll stagger-${(i % 8) + 1}">
        <div class="part-card__header">
          <div class="part-card__icon">${part.icon}</div>
          <div>
            <div class="part-card__name">${part.name}</div>
            <div class="part-card__installed">Installed: ${formatDate(part.installedDate)}</div>
          </div>
        </div>
        <div class="part-card__progress">
          <div class="progress-bar">
            <div class="progress-bar__fill progress-bar__fill--${barClass}" data-width="${usedPct}"></div>
          </div>
        </div>
        <div class="part-card__meta">
          <span>${ageMonths} / ${part.expectedLifeMonths} months</span>
          <span class="part-card__health part-card__health--${status}">${healthPct}% life remaining</span>
        </div>
      </div>
    `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">COMPONENTS</span>
        <h2 class="section-header__title">Major Parts Age</h2>
      </div>
    </div>
    <div class="parts-grid">
      ${cards}
    </div>
  `;
}
