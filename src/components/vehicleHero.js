import { vehicle, serviceRecords, accidents } from '../data/mockData.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * Calculate vehicle health score over time.
 */
function computeHealthTimeline() {
  const purchaseDate = new Date('2023-03-10');
  const now = new Date();
  const events = [];

  serviceRecords.forEach(s => {
    const boost = s.type === 'Repair' ? 10 : s.type === 'Major' ? 8 : 5;
    events.push({ date: new Date(s.date), type: 'service', delta: boost, label: s.type + ' Service' });
  });

  accidents.forEach(a => {
    const penalty = a.severity === 'Major' ? -15 : a.severity === 'Moderate' ? -12 : -8;
    events.push({ date: new Date(a.date), type: 'accident', delta: penalty, label: a.severity + ' Accident' });
  });

  events.sort((a, b) => a.date - b.date);

  const dataPoints = [];
  let health = 100;
  const current = new Date(purchaseDate);

  while (current <= now) {
    if (dataPoints.length > 0) {
      health = Math.max(0, health - 0.8);
    }
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

export function renderVehicleHero() {
  const container = document.getElementById('section-vehicle');
  const images = vehicle.images360;
  const angleLabels = ['Front ¾', 'Front', 'Front ¾ L', 'Side L', 'Rear ¾ L', 'Rear', 'Rear ¾ R', 'Side R'];

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
        <span class="section-header__label">GARAGE</span>
        <h1 class="section-header__title">Your Vehicle</h1>
      </div>
    </div>
    <div class="card card--teal-border card--no-hover animate-on-scroll stagger-1">
      <div class="vehicle-hero">
        <div class="vehicle-hero__image-wrap" id="vehicle-360-viewer">
          <div class="vehicle-360">
            <div class="vehicle-360__canvas">
              ${images.map((src, i) => `
                <img
                  src="${src}"
                  alt="${vehicle.make} ${vehicle.model} — ${angleLabels[i]}"
                  class="vehicle-360__frame ${i === 0 ? 'vehicle-360__frame--active' : ''}"
                  data-frame="${i}"
                  draggable="false"
                />
              `).join('')}
            </div>
            <div class="vehicle-360__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6"></path>
                <path d="M2.5 22v-6h6"></path>
                <path d="M2.5 11.5a10 10 0 0 1 16.3-6.3L21.5 8"></path>
                <path d="M21.5 12.5a10 10 0 0 1-16.3 6.3L2.5 16"></path>
              </svg>
              360°
            </div>
            <div class="vehicle-360__hint" id="vehicle-360-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4"/>
              </svg>
              Drag to rotate
            </div>
            <div class="vehicle-360__controls">
              <button class="vehicle-360__btn" id="btn-rotate-left" aria-label="Rotate left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button class="vehicle-360__btn vehicle-360__btn--auto ${true ? 'active' : ''}" id="btn-auto-rotate" aria-label="Toggle auto-rotate">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              <button class="vehicle-360__btn" id="btn-rotate-right" aria-label="Rotate right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            <div class="vehicle-360__dots" id="vehicle-360-dots">
              ${images.map((_, i) => `
                <button class="vehicle-360__dot ${i === 0 ? 'vehicle-360__dot--active' : ''}" data-dot="${i}" aria-label="View angle ${i + 1}"></button>
              `).join('')}
            </div>
            <div class="vehicle-360__angle-label" id="vehicle-360-angle">${angleLabels[0]}</div>
          </div>
        </div>
        <div class="vehicle-hero__info">
          <div class="vehicle-hero__plate">${vehicle.registrationNo}</div>
          <div>
            <h2 class="vehicle-hero__name">${vehicle.make} ${vehicle.model} ${vehicle.year}</h2>
            <p class="vehicle-hero__variant">${vehicle.variant} · ${vehicle.fuel} · ${vehicle.transmission} · ${vehicle.bodyType} · ${vehicle.driveType}</p>
          </div>
          <div class="vehicle-hero__badges">
            <span class="badge badge--primary">${vehicle.isPrimary ? 'Primary' : 'Secondary'}</span>
            <span class="badge badge--success">● ${vehicle.status}</span>
            <span class="badge badge--outline">${vehicle.color}</span>
          </div>
          <div class="vehicle-hero__specs">
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">📅</div>
              <div>
                <div class="vehicle-hero__spec-label">Mfg. Year</div>
                <div class="vehicle-hero__spec-value">${vehicle.year}</div>
              </div>
            </div>

            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">📏</div>
              <div>
                <div class="vehicle-hero__spec-label">Odometer</div>
                <div class="vehicle-hero__spec-value">${vehicle.currentOdometer.toLocaleString('en-IN')} km</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">🔑</div>
              <div>
                <div class="vehicle-hero__spec-label">VIN</div>
                <div class="vehicle-hero__spec-value" style="font-size:11px; font-family: monospace;">${vehicle.vin}</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">🪑</div>
              <div>
                <div class="vehicle-hero__spec-label">Seats</div>
                <div class="vehicle-hero__spec-value">${vehicle.seatingCapacity} Seater</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">🔧</div>
              <div>
                <div class="vehicle-hero__spec-label">Engine No.</div>
                <div class="vehicle-hero__spec-value" style="font-size:11px; font-family: monospace;">${vehicle.engineNo}</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">📋</div>
              <div>
                <div class="vehicle-hero__spec-label">Registered</div>
                <div class="vehicle-hero__spec-value">${new Date(vehicle.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">🛠️</div>
              <div>
                <div class="vehicle-hero__spec-label">Next Service</div>
                <div class="vehicle-hero__spec-value">${new Date(vehicle.nextServiceDue).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">🛡️</div>
              <div>
                <div class="vehicle-hero__spec-label">Insurance Till</div>
                <div class="vehicle-hero__spec-value">${new Date(vehicle.insuranceValidTill).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
            <div class="vehicle-hero__spec">
              <div class="vehicle-hero__spec-icon">🏁</div>
              <div>
                <div class="vehicle-hero__spec-label">Fitness Till</div>
                <div class="vehicle-hero__spec-value">${new Date(vehicle.fitnessValidTill).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--color-border);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 class="card__title">Vehicle Health Timeline</h3>
          <div class="health-score-badge" style="--score-color: ${statusColor}">
            <span class="health-score-badge__value">${Math.round(currentHealth)}%</span>
            <span class="health-score-badge__label">${statusText}</span>
          </div>
        </div>
        <div class="chart-container" style="height: 180px;">
          <canvas id="health-chart"></canvas>
        </div>
      </div>
    </div>
  `;

  // ── 360° Viewer Logic ──
  const viewer = document.getElementById('vehicle-360-viewer');
  const frames = viewer.querySelectorAll('.vehicle-360__frame');
  const dots = viewer.querySelectorAll('.vehicle-360__dot');
  const hint = document.getElementById('vehicle-360-hint');
  const angleLabel = document.getElementById('vehicle-360-angle');
  const btnLeft = document.getElementById('btn-rotate-left');
  const btnRight = document.getElementById('btn-rotate-right');
  const btnAuto = document.getElementById('btn-auto-rotate');

  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;
  let autoRotate = true;
  let autoRotateInterval = null;
  let hintDismissed = false;

  const totalFrames = images.length;
  const DRAG_THRESHOLD = 40; // px per frame switch

  function showFrame(index) {
    const prev = currentFrame;
    currentFrame = ((index % totalFrames) + totalFrames) % totalFrames;
    if (prev === currentFrame) return;

    frames.forEach((f, i) => {
      f.classList.toggle('vehicle-360__frame--active', i === currentFrame);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('vehicle-360__dot--active', i === currentFrame);
    });
    angleLabel.textContent = angleLabels[currentFrame];
  }

  function stepFrame(direction) {
    showFrame(currentFrame + direction);
  }

  // ── Drag / Touch Handling ──
  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX || e.touches?.[0]?.clientX || 0;
    viewer.classList.add('vehicle-360--dragging');
    stopAutoRotate();

    if (!hintDismissed) {
      hint.classList.add('vehicle-360__hint--hidden');
      hintDismissed = true;
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX || e.touches?.[0]?.clientX || 0;
    const delta = x - startX;

    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      stepFrame(delta > 0 ? -1 : 1);
      startX = x;
    }
  }

  function onPointerUp() {
    isDragging = false;
    viewer.classList.remove('vehicle-360--dragging');
  }

  // Mouse events
  viewer.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // Touch events
  viewer.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  // ── Button Controls ──
  btnLeft.addEventListener('click', () => {
    stopAutoRotate();
    stepFrame(-1);
  });

  btnRight.addEventListener('click', () => {
    stopAutoRotate();
    stepFrame(1);
  });

  // ── Dot Navigation ──
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoRotate();
      showFrame(parseInt(dot.dataset.dot, 10));
    });
  });

  // ── Auto-Rotate ──
  function startAutoRotate() {
    if (autoRotateInterval) return;
    autoRotate = true;
    btnAuto.classList.add('active');
    // Swap to pause icon
    btnAuto.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
    autoRotateInterval = setInterval(() => stepFrame(1), 1200);
  }

  function stopAutoRotate() {
    autoRotate = false;
    btnAuto.classList.remove('active');
    // Swap to play icon
    btnAuto.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  btnAuto.addEventListener('click', () => {
    if (autoRotate) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  });

  // Start auto-rotating
  startAutoRotate();

  // Preload images for instant transitions
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // ── Render Health Chart ──
  const ctx = document.getElementById('health-chart').getContext('2d');
  const labels = timeline.map(p =>
    p.date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
  );
  const healthData = timeline.map(p => p.health);

  const gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(0, 'rgba(13, 148, 136, 0.25)');
  gradient.addColorStop(1, 'rgba(13, 148, 136, 0.02)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Health Score',
          data: healthData,
          borderColor: '#0d9488',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: healthData.map(v =>
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
            stepSize: 25,
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
