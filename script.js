// ===== Tab Navigation =====
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabId) {
    tabContents.forEach(tc => tc.classList.remove('active'));
    navLinks.forEach(nl => nl.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) {
      target.classList.add('active');
    }

    navLinks.forEach(nl => {
      if (nl.dataset.tab === tabId) {
        nl.classList.add('active');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      switchTab(tabId);
      history.pushState(null, '', `#${tabId}`);
    });
  });

  // Handle initial hash
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchTab(hash);
  }

  // Handle back/forward
  window.addEventListener('popstate', () => {
    const h = window.location.hash.replace('#', '');
    if (h && document.getElementById(h)) {
      switchTab(h);
    } else {
      switchTab('about');
    }
  });

  // ===== Circuit Board Canvas Animation =====
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let connections = [];
  let animFrame;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    initCircuit();
  }

  function initCircuit() {
    nodes = [];
    connections = [];

    const cols = Math.floor(width / 80);
    const rows = Math.floor(height / 80);
    const spacingX = width / (cols + 1);
    const spacingY = height / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = spacingX * (c + 1) + (Math.random() - 0.5) * 20;
        const y = spacingY * (r + 1) + (Math.random() - 0.5) * 20;
        const type = Math.random();
        nodes.push({
          x, y,
          radius: type < 0.2 ? 3 : 2,
          isChip: type < 0.1,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
        });
      }
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && Math.random() < 0.3) {
          connections.push({
            from: i,
            to: j,
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.005,
            active: Math.random() < 0.3,
          });
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    connections.forEach(conn => {
      const from = nodes[conn.from];
      const to = nodes[conn.to];

      ctx.beginPath();

      // Draw L-shaped connections (circuit board style)
      const midX = (from.x + to.x) / 2;
      if (Math.random() > 0.5) {
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(midX, from.y);
        ctx.lineTo(midX, to.y);
        ctx.lineTo(to.x, to.y);
      } else {
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
      }

      ctx.strokeStyle = conn.active
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Animate data pulse along active connections
      if (conn.active) {
        conn.progress += conn.speed;
        if (conn.progress > 1) conn.progress = 0;

        const px = from.x + (to.x - from.x) * conn.progress;
        const py = from.y + (to.y - from.y) * conn.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.6)';
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      node.pulse += 0.02;

      if (node.isChip) {
        // Draw chip-like square
        const size = 8;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.fillRect(node.x - size, node.y - size, size * 2, size * 2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(node.x - size, node.y - size, size * 2, size * 2);
      } else {
        const glow = 0.3 + Math.sin(node.pulse * node.speed) * 0.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${glow})`;
        ctx.fill();
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  // ===== Header scroll effect =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });
});
