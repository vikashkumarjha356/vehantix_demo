/**
 * Scroll-triggered animations using IntersectionObserver
 */

export function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate progress bars inside this element
          const progressBars = entry.target.querySelectorAll('.progress-bar__fill');
          progressBars.forEach((bar) => {
            const target = bar.dataset.width;
            if (target) {
              setTimeout(() => {
                bar.style.width = target + '%';
              }, 200);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Sidebar scroll spy — highlights the active section in the sidebar
 */
export function initScrollSpy() {
  const sections = document.querySelectorAll('.section[id]');
  const links = document.querySelectorAll('.sidebar__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()} 0px -50% 0px`,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Sidebar collapse/expand toggle
 */
export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const isMobile = window.innerWidth <= 480;

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 480) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  // Close mobile sidebar when clicking a link
  sidebar.querySelectorAll('.sidebar__link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 480) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });

  // Handle resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 480) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

/**
 * Smooth scroll to section when clicking sidebar links
 */
export function initSmoothScroll() {
  document.querySelectorAll('.sidebar__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Count-up animation for numbers
 */
export function animateCounter(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(start + (target - start) * eased);
    element.textContent = current.toLocaleString('en-IN');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString('en-IN');
    }
  }

  requestAnimationFrame(update);
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Calculate months between two dates
 */
export function monthsBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = dateStr2 ? new Date(dateStr2) : new Date();
  const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  return Math.max(0, months);
}
