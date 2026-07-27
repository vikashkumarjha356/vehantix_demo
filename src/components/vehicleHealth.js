import { vehicle, serviceRecords, accidents } from '../data/mockData.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * Calculate vehicle health score over time.
 * - Starts at 100 on purchase date
 * - Decays ~0.8% per month (natural aging)
 * - Services restore health: Routine +5, Major +8, Repair +10
 * - Accidents reduce health: Minor -8, Moderate -12, Major -15
 */
function computeHealthTimeline() {
  const purchaseDate = new Date('2023-03-10');
  const now = new Date();
  const events = [];

  // Add service events
  serviceRecords.forEach(s => {
    const boost = s.type === 'Repair' ? 10 : s.type === 'Major' ? 8 : 5;
    events.push({ date: new Date(s.date), type: 'service', delta: boost, label: s.type + ' Service' });
  });

  // Add accident events
  accidents.forEach(a => {
    const penalty = a.severity === 'Major' ? -15 : a.severity === 'Moderate' ? -12 : -8;
    events.push({ date: new Date(a.date), type: 'accident', delta: penalty, label: a.severity + ' Accident' });
  });

  events.sort((a, b) => a.date - b.date);

  // Generate monthly data points
  const dataPoints = [];
  let health = 100;
  const current = new Date(purchaseDate);

  while (current <= now) {
    // Apply monthly decay
    if (dataPoints.length > 0) {
      health = Math.max(0, health - 0.8);
    }

    // Apply events that fall in this month
    events.forEach(e => {
      if (
        e.date.getFullYear() === current.getFullYear() &&
        e.date.getMonth() === current.getMonth()
      ) {
        health = Math.max(0, Math.min(100, health + e.delta));
      }
    });

    dataPoints.push({
      date: new Date(current),
      health: Math.round(health * 10) / 10,
    });

    current.setMonth(current.getMonth() + 1);
  }

  return dataPoints;
}

export function renderVehicleHealth() {
  const container = document.getElementById('section-health');
  const timeline = computeHealthTimeline();
  const currentHealth = timeline[timeline.length - 1].health;

  let statusColor, statusText;
  if (currentHealth >= 80) {
    statusColor = 'var(--color-success)';
    statusText = 'Excellent';
  } else if (currentHealth >= 50) {
    statusColor = 'var(--color-warning)';
    statusText = 'Good';
  } else {
    statusColor = 'var(--color-danger)';
    statusText = 'Needs Attention';
  }

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">DIAGNOSTICS</span>
        <h2 class="section-header__title">Vehicle Health</h2>
      </div>
      <div class="health-score-badge" style="--score-color: ${statusColor}">
        <span class="health-score-badge__value">${Math.round(currentHealth)}%</span>
        <span class="health-score-badge__label">${statusText}</span>
      </div>
    </div>
    <div class="card card--no-hover animate-on-scroll stagger-1">
      <div class="chart-container chart-container--wide">
        <canvas id="health-chart"></canvas>
      </div>
    </div>
  `;

  // ── Render Chart ──
  const ctx = document.getElementById('health-chart').getContext('2d');
  const labels = timeline.map(p =>
    p.date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
  );
  const data = timeline.map(p => p.health);

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(13, 148, 136, 0.25)');
  gradient.addColorStop(1, 'rgba(13, 148, 136, 0.02)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Health Score',
          data,
          borderColor: '#0d9488',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: data.map(v =>
            v >= 80 ? '#10b981' : v >= 50 ? '#f59e0b' : '#dc2626'
          ),
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
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
          callbacks: {
            label: ctx => `Health: ${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            callback: v => v + '%',
            font: { family: 'Inter', size: 11 },
            color: '#94a3b8',
            stepSize: 20,
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.5)',
            drawBorder: false,
          },
          border: { display: false },
        },
        x: {
          ticks: {
            font: { family: 'Inter', size: 10 },
            color: '#94a3b8',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  });
}
