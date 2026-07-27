import { accidents } from '../data/mockData.js';
import { formatDate, formatCurrency } from '../utils/animations.js';

export function renderAccidentHistory() {
  const container = document.getElementById('section-accidents');

  const severityConfig = {
    Minor: { icon: '⚠️', class: 'minor', color: 'var(--color-warning)' },
    Moderate: { icon: '🔶', class: 'moderate', color: '#ea580c' },
    Major: { icon: '🔴', class: 'major', color: 'var(--color-danger)' },
  };

  const cards = accidents
    .map((a, i) => {
      const cfg = severityConfig[a.severity];
      return `
    <div class="card animate-on-scroll stagger-${i + 1}">
      <div class="accident-card">
        <div class="accident-severity">
          <div class="accident-severity__icon accident-severity__icon--${cfg.class}">${cfg.icon}</div>
          <span class="accident-severity__label" style="color:${cfg.color}">${a.severity}</span>
        </div>
        <div>
          <h3 style="font-size:16px;font-weight:600;margin-bottom:4px;">Incident on ${formatDate(a.date)}</h3>
          <p style="font-size:13px;color:var(--color-text-secondary);line-height:1.6;">${a.description}</p>
          <div class="accident-details__grid">
            <div class="accident-detail-item">
              <div class="accident-detail-item__label">Location</div>
              <div class="accident-detail-item__value">${a.location}</div>
            </div>
            <div class="accident-detail-item">
              <div class="accident-detail-item__label">Damage Estimate</div>
              <div class="accident-detail-item__value">${formatCurrency(a.damageEstimate)}</div>
            </div>
            <div class="accident-detail-item">
              <div class="accident-detail-item__label">Insurance Claim</div>
              <div class="accident-detail-item__value">
                ${a.insuranceClaim ? `<span class="badge badge--success">${a.claimStatus}</span> ${formatCurrency(a.claimAmount)}` : '<span class="badge badge--outline">Not Filed</span>'}
              </div>
            </div>
            <div class="accident-detail-item">
              <div class="accident-detail-item__label">${a.firNumber ? 'FIR Number' : 'Repair Center'}</div>
              <div class="accident-detail-item__value">${a.firNumber || a.repairCenter}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">SAFETY</span>
        <h2 class="section-header__title">Accident History</h2>
      </div>
      <span class="badge badge--warning" style="margin-left:auto;">${accidents.length} incident${accidents.length !== 1 ? 's' : ''}</span>
    </div>
    ${cards}
  `;
}
