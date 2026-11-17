// Scroll reveal, card spotlight, and animated network background.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal
  const targets = document.querySelectorAll('section > h2, .card, .timeline .item, .skillgroup, .hero > *, #about > p, #contact > p');
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  targets.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });

  // Card spotlight follows cursor
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Network-of-particles background
  const canvas = document.getElementById('bg');
  if (!canvas || reduce) return;
  const ctx = canvas.getContext('2d');
  let w, h, pts;
  const mouse = { x: -1000, y: -1000 };
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = innerWidth; h = innerHeight;
    const n = Math.min(90, Math.floor(w * h / 17000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
    }));
  }
  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  (function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(34,211,238,.7)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 6.283); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 130) * .32})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      const mx = pts[i].x - mouse.x, my = pts[i].y - mouse.y, md = Math.hypot(mx, my);
      if (md < 160) {
        ctx.strokeStyle = `rgba(34,211,238,${(1 - md / 160) * .5})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  })();
})();

// Scroll progress bar + cursor glow
(function () {
  const bar = document.getElementById('progress');
  const glow = document.getElementById('cursor-glow');
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar && max > 0) bar.style.width = (scrollY / max * 100) + '%';
  }, { passive: true });
  addEventListener('mousemove', e => {
    if (!glow) return;
    glow.style.opacity = 1;
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// Email button: copies the address and shows a popup
(function () {
  const btn = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  if (!btn || !toast) return;
  let timer;
  btn.addEventListener('click', async e => {
    e.preventDefault();
    const email = 'aozerov.oleg@gmail.com';
    try { await navigator.clipboard.writeText(email); }
    catch (_) {
      const t = document.createElement('textarea'); t.value = email; document.body.appendChild(t);
      t.select(); document.execCommand('copy'); t.remove();
    }
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2200);
  });
})();
