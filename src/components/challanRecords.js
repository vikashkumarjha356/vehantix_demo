import { challans } from '../data/mockData.js';
import { formatDate, formatCurrency } from '../utils/animations.js';

export function renderChallanRecords() {
  const container = document.getElementById('section-challans');

  const pending = challans.filter((c) => c.status === 'pending');
  const cleared = challans.filter((c) => c.status === 'cleared');
  const totalPending = pending.reduce((sum, c) => sum + c.amount, 0);
  const totalCleared = cleared.reduce((sum, c) => sum + c.amount, 0);

  const renderCards = (items, type) =>
    items
      .map(
        (c, i) => `
    <div class="challan-card challan-card--${type} animate-on-scroll stagger-${i + 1}">
      <div class="challan-card__header">
        <span class="challan-card__id">${c.id}</span>
        <span class="badge ${type === 'pending' ? 'badge--danger' : 'badge--success'}">${type === 'pending' ? 'Pending' : 'Cleared'}</span>
      </div>
      <div class="challan-card__amount">${formatCurrency(c.amount)}</div>
      <div class="challan-card__violation">${c.violation}</div>
      <div class="challan-card__detail">📍 ${c.location}</div>
      <div class="challan-card__detail">📅 ${formatDate(c.date)}</div>
      <div class="challan-card__detail">🏛️ ${c.authority}</div>
      ${type === 'pending' ? `<div class="challan-card__detail" style="color:var(--color-danger);font-weight:600;">⏰ Due: ${formatDate(c.dueDate)}</div>` : `<div class="challan-card__detail" style="color:var(--color-success);font-weight:600;">✅ Paid: ${formatDate(c.paidDate)}</div>`}
    </div>
  `
      )
      .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">TRAFFIC</span>
        <h2 class="section-header__title">Challan Records</h2>
      </div>
    </div>

    <div class="challan-summary animate-on-scroll">
      <div class="challan-summary__item" style="border-left: 4px solid var(--color-danger);">
        <span class="challan-summary__label">Pending Amount</span>
        <span class="challan-summary__value challan-summary__value--danger">${formatCurrency(totalPending)}</span>
        <span style="font-size:12px;color:var(--color-text-muted);">${pending.length} challan${pending.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="challan-summary__item" style="border-left: 4px solid var(--color-success);">
        <span class="challan-summary__label">Total Cleared</span>
        <span class="challan-summary__value challan-summary__value--success">${formatCurrency(totalCleared)}</span>
        <span style="font-size:12px;color:var(--color-text-muted);">${cleared.length} challan${cleared.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="challan-summary__item">
        <span class="challan-summary__label">Total Challans</span>
        <span class="challan-summary__value">${challans.length}</span>
        <span style="font-size:12px;color:var(--color-text-muted);">all time</span>
      </div>
    </div>

    <div class="tab-bar" id="challan-tabs">
      <button class="tab-bar__btn tab-bar__btn--danger active" data-tab="pending">Pending (${pending.length})</button>
      <button class="tab-bar__btn" data-tab="cleared">Cleared (${cleared.length})</button>
    </div>

    <div id="challan-pending" class="challan-grid">
      ${renderCards(pending, 'pending')}
    </div>
    <div id="challan-cleared" class="challan-grid" style="display:none;">
      ${renderCards(cleared, 'cleared')}
    </div>
  `;

  // Tab switching
  const tabs = container.querySelectorAll('.tab-bar__btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('challan-pending').style.display = target === 'pending' ? 'grid' : 'none';
      document.getElementById('challan-cleared').style.display = target === 'cleared' ? 'grid' : 'none';
    });
  });
}
