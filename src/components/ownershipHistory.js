import { ownershipHistory } from '../data/mockData.js';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '../utils/animations.js';

Chart.register(...registerables);

export function renderOwnershipHistory() {
  const container = document.getElementById('section-ownership');

  // Compute durations for display
  const ownerSummaries = ownershipHistory
    .map((o, i) => {
      const from = new Date(o.from);
      const to = o.to ? new Date(o.to) : new Date();
      const months = Math.round((to - from) / (1000 * 60 * 60 * 24 * 30.44));
      return `
        <div class="owner-chip ${o.isCurrent ? 'owner-chip--current' : ''} animate-on-scroll stagger-${i + 1}">
          <div class="owner-chip__color" style="background: ${o.isCurrent ? '#0d9488' : ['#6366f1', '#8b5cf6', '#ec4899'][i % 3]};"></div>
          <div class="owner-chip__info">
            <span class="owner-chip__name">${o.name}</span>
            <span class="owner-chip__type">${o.type}</span>
          </div>
          <div class="owner-chip__duration">
            <span class="owner-chip__months">${months} mo</span>
            <span class="owner-chip__dates">${formatDate(o.from)} — ${formatDate(o.to)}</span>
          </div>
          ${o.isCurrent ? '<span class="badge badge--primary" style="font-size:10px;">Current</span>' : ''}
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">HISTORY</span>
        <h2 class="section-header__title">Ownership Timeline</h2>
      </div>
    </div>
    <div class="card card--no-hover animate-on-scroll stagger-1">
      <div class="chart-container chart-container--bar">
        <canvas id="ownership-chart"></canvas>
      </div>
    </div>
    <div class="ownership-toggle-container mt-24 animate-on-scroll stagger-2">
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
