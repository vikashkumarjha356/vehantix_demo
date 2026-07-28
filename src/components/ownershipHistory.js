import { ownershipHistory } from '../data/mockData.js';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '../utils/animations.js';

Chart.register(...registerables);

export function renderOwnershipHistory() {
  const container = document.getElementById('section-ownership');

  // Compute durations and detailed cards for display
  const ownerSummaries = ownershipHistory
    .map((o, i) => {
      const from = new Date(o.from);
      const to = o.to ? new Date(o.to) : new Date();
      const months = Math.round((to - from) / (1000 * 60 * 60 * 24 * 30.44));
      return `
        <div class="owner-chip ${o.isCurrent ? 'owner-chip--current' : ''} animate-on-scroll stagger-${i + 1}">
          <div class="owner-chip__header">
            <div class="owner-chip__identity">
              <div class="owner-chip__color" style="background: ${o.isCurrent ? '#0d9488' : ['#6366f1', '#8b5cf6', '#ec4899'][i % 3]};"></div>
              <div class="owner-chip__info">
                <span class="owner-chip__name">${o.name}</span>
                <span class="owner-chip__type">${o.type}</span>
              </div>
            </div>
            <div class="owner-chip__meta">
              <div class="owner-chip__duration">
                <span class="owner-chip__months">${months} mo</span>
                <span class="owner-chip__dates">${formatDate(o.from)} — ${formatDate(o.to)}</span>
              </div>
              ${o.isCurrent ? '<span class="badge badge--primary" style="font-size:10px;">Current</span>' : ''}
            </div>
          </div>

          <div class="owner-chip__details">
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">Location & RTO</span>
              <span class="owner-detail-item__value">📍 ${o.location} (${o.rto})</span>
            </div>
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">Transfer Type</span>
              <span class="owner-detail-item__value">🔄 ${o.transferType}</span>
            </div>
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">Odometer @ Transfer</span>
              <span class="owner-detail-item__value">📏 ${o.odometerAtTransfer}</span>
            </div>
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">Price / Value</span>
              <span class="owner-detail-item__value">💰 ${o.purchasePrice}</span>
            </div>
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">RC Status</span>
              <span class="owner-detail-item__value">📄 ${o.rcStatus}</span>
            </div>
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">Hypothecation</span>
              <span class="owner-detail-item__value">🏦 ${o.hypothecation}</span>
            </div>
            ${o.nominee ? `
            <div class="owner-detail-item">
              <span class="owner-detail-item__label">Registered Nominee</span>
              <span class="owner-detail-item__value">👤 ${o.nominee}</span>
            </div>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  const currentOwner = ownershipHistory.find(o => o.isCurrent) || ownershipHistory[ownershipHistory.length - 1];

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">OWNERSHIP</span>
        <h2 class="section-header__title">Ownership & Title Records</h2>
      </div>
    </div>

    <!-- Quick Owner Overview Stats -->
    <div class="owner-stats-grid animate-on-scroll stagger-1">
      <div class="owner-stat-card">
        <div class="owner-stat-card__icon">👤</div>
        <div class="owner-stat-card__info">
          <span class="owner-stat-card__label">Current Owner</span>
          <span class="owner-stat-card__value">${currentOwner.name}</span>
        </div>
      </div>
      <div class="owner-stat-card">
        <div class="owner-stat-card__icon">📜</div>
        <div class="owner-stat-card__info">
          <span class="owner-stat-card__label">Total Owners</span>
          <span class="owner-stat-card__value">2 Owners (Pre-Owned)</span>
        </div>
      </div>
      <div class="owner-stat-card">
        <div class="owner-stat-card__icon">🏛️</div>
        <div class="owner-stat-card__info">
          <span class="owner-stat-card__label">Registered RTO</span>
          <span class="owner-stat-card__value">${currentOwner.rto}</span>
        </div>
      </div>
      <div class="owner-stat-card">
        <div class="owner-stat-card__icon">🏦</div>
        <div class="owner-stat-card__info">
          <span class="owner-stat-card__label">Hypothecation</span>
          <span class="owner-stat-card__value">HDFC Bank Ltd.</span>
        </div>
      </div>
    </div>

    <div class="card card--no-hover animate-on-scroll stagger-2 mt-20">
      <h3 class="card__title mb-16">Ownership Timeline</h3>
      <div class="chart-container chart-container--bar">
        <canvas id="ownership-chart"></canvas>
      </div>
    </div>

    <div class="ownership-toggle-container mt-24 animate-on-scroll stagger-3">
      <button id="ownership-toggle-btn" class="ownership-toggle-btn is-active">
        <span>View Detailed History</span>
        <svg class="ownership-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div id="ownership-details-wrapper" class="ownership-details-wrapper is-open">
        <div class="ownership-details-inner">
          <div class="owner-chips">
            ${ownerSummaries}
          </div>
        </div>
      </div>
    </div>
  `;

  // ── Render Horizontal Bar Chart ──
  const ctx = document.getElementById('ownership-chart').getContext('2d');

  const earliest = new Date(ownershipHistory[0].from);
  const latest = new Date();

  const colors = ownershipHistory.map((o, i) =>
    o.isCurrent ? '#0d9488' : ['#6366f1', '#8b5cf6', '#ec4899'][i % 3]
  );
  const bgColors = ownershipHistory.map((o, i) =>
    o.isCurrent ? 'rgba(13, 148, 136, 0.85)' : ['rgba(99, 102, 241, 0.75)', 'rgba(139, 92, 246, 0.75)', 'rgba(236, 72, 153, 0.75)'][i % 3]
  );

  // Chart.js floating bar data: each bar = [startTimestamp, endTimestamp]
  const barData = ownershipHistory.map(o => {
    const from = new Date(o.from).getTime();
    const to = (o.to ? new Date(o.to) : new Date()).getTime();
    return [from, to];
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ownershipHistory.map(o => o.name.split(' ').slice(0, 2).join(' ')),
      datasets: [
        {
          data: barData,
          backgroundColor: bgColors,
          borderColor: colors,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26, 35, 50, 0.92)',
          titleFont: { family: 'Inter', size: 12, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title: (items) => {
              const idx = items[0].dataIndex;
              return ownershipHistory[idx].name;
            },
            label: (item) => {
              const idx = item.dataIndex;
              const o = ownershipHistory[idx];
              const from = new Date(o.from);
              const to = o.to ? new Date(o.to) : new Date();
              const months = Math.round((to - from) / (1000 * 60 * 60 * 24 * 30.44));
              return [
                `${o.type}`,
                `${formatDate(o.from)} → ${formatDate(o.to)}`,
                `Duration: ${months} months`,
                `📍 ${o.location}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: earliest.getTime(),
          max: latest.getTime(),
          ticks: {
            callback: function (value) {
              const d = new Date(value);
              return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            },
            font: { family: 'Inter', size: 10 },
            color: '#94a3b8',
            maxTicksLimit: 8,
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.4)',
            drawBorder: false,
          },
          border: { display: false },
        },
        y: {
          ticks: {
            font: { family: 'Inter', size: 11, weight: '500' },
            color: '#475569',
          },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  });

  // ── Animated Toggle Logic ──
  const toggleBtn = document.getElementById('ownership-toggle-btn');
  const detailsWrapper = document.getElementById('ownership-details-wrapper');
  
  if (toggleBtn && detailsWrapper) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = detailsWrapper.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active', isOpen);
    });
  }
}
