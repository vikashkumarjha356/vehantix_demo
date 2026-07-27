import { serviceRecords } from '../data/mockData.js';
import { formatDate, formatCurrency } from '../utils/animations.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function renderServiceRecords() {
  const container = document.getElementById('section-services');

  const typeConfig = {
    Routine: 'routine',
    Major: 'major',
    Repair: 'repair',
  };

  const lastService = serviceRecords[serviceRecords.length - 1];
  const nextDue = lastService.nextServiceDue;

  // Build compact table rows
  const rows = serviceRecords
    .map(
      (s) => `
    <tr>
      <td>${formatDate(s.date)}</td>
      <td><span class="service-type-badge service-type-badge--${typeConfig[s.type]}">${s.type}</span></td>
      <td style="max-width:280px;">${s.description}</td>
      <td>${s.odometer.toLocaleString('en-IN')} km</td>
      <td style="font-weight:600;">${s.cost === 0 ? '<span style="color:var(--color-success)">Free</span>' : formatCurrency(s.cost)}</td>
      <td style="font-size:12px;">${s.center}</td>
    </tr>
  `
    )
    .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">MAINTENANCE</span>
        <h2 class="section-header__title">Service Records</h2>
      </div>
      <span class="badge badge--outline" style="margin-left:auto;">${serviceRecords.length} records</span>
    </div>

    <div class="card card--no-hover animate-on-scroll stagger-1">
      <div class="chart-header">
        <h3 class="chart-header__title">Service Cost Trend</h3>
        <div class="chart-header__subtitle">Cumulative cost · next service projected</div>
      </div>
      <div class="chart-container chart-container--wide">
        <canvas id="service-chart"></canvas>
      </div>
    </div>

    <div class="animate-on-scroll stagger-2">
      <div class="service-table-wrap">
        <table class="service-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Odometer</th>
              <th>Cost</th>
              <th>Service Center</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <div class="next-service-banner">
        <div class="next-service-banner__icon">🔔</div>
        <div>
          <div class="next-service-banner__text">Next Service Due</div>
          <div class="next-service-banner__date">${formatDate(nextDue)} · Approx. ${(lastService.odometer + 5000).toLocaleString('en-IN')} km</div>
        </div>
      </div>
    </div>
  `;

  // ── Render Service Chart ──
  const ctx = document.getElementById('service-chart').getContext('2d');

  // Build cumulative cost data
  let cumulative = 0;
  const serviceData = serviceRecords.map(s => {
    cumulative += s.cost;
    return {
      x: new Date(s.date).getTime(),
      y: cumulative,
      type: s.type,
      cost: s.cost,
      desc: s.description,
    };
  });

  // Projected next service point
  const projectedDate = new Date(nextDue).getTime();
  const estimatedNextCost = 10000; // estimated
  const projectedCost = cumulative + estimatedNextCost;

  // Point colors by service type
  const pointColors = serviceRecords.map(s => {
    if (s.type === 'Repair') return '#dc2626';
    if (s.type === 'Major') return '#f59e0b';
    return '#10b981';
  });

  const pointSizes = serviceRecords.map(s => {
    if (s.type === 'Repair') return 7;
    if (s.type === 'Major') return 6;
    return 5;
  });

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Cumulative Cost',
          data: serviceData.map(d => ({ x: d.x, y: d.y })),
          borderColor: '#6366f1',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: pointSizes,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
        },
        {
          label: 'Projected',
          data: [
            { x: serviceData[serviceData.length - 1].x, y: cumulative },
            { x: projectedDate, y: projectedCost },
          ],
          borderColor: 'rgba(99, 102, 241, 0.4)',
          borderWidth: 2,
          borderDash: [8, 5],
          pointRadius: [0, 6],
          pointBackgroundColor: ['transparent', 'rgba(99, 102, 241, 0.5)'],
          pointBorderColor: ['transparent', '#6366f1'],
          pointBorderWidth: [0, 2],
          pointStyle: ['circle', 'triangle'],
          fill: false,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26, 35, 50, 0.92)',
          titleFont: { family: 'Inter', size: 12, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          filter: (item) => item.datasetIndex === 0,
          callbacks: {
            title: (items) => {
              const idx = items[0].dataIndex;
              return formatDate(serviceRecords[idx].date);
            },
            label: (item) => {
              const s = serviceRecords[item.dataIndex];
              return [
                `${s.type} Service`,
                `Cost: ${s.cost === 0 ? 'Free' : formatCurrency(s.cost)}`,
                `Total: ${formatCurrency(item.parsed.y)}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          ticks: {
            callback: (value) => {
              const d = new Date(value);
              return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            },
            font: { family: 'Inter', size: 10 },
            color: '#94a3b8',
            maxTicksLimit: 8,
          },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => '₹' + (v / 1000).toFixed(0) + 'k',
            font: { family: 'Inter', size: 11 },
            color: '#94a3b8',
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.5)',
            drawBorder: false,
          },
          border: { display: false },
        },
      },
    },
  });
}
