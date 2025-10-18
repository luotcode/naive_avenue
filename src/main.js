const overlay = document.getElementById('overlay');

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function targetRadiusBottomCenter() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dx = w / 2;
  const dy = h;
  return Math.hypot(dx, dy);
}

function updateMask() {
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollMax <= 0 ? 1 : clamp(window.scrollY / scrollMax, 0, 1);
  const baseR = window.innerHeight * 0.15;
  const r = lerp(baseR, targetRadiusBottomCenter() * 1.02, progress);
  overlay.style.setProperty('--rx', r + 'px');
  overlay.style.setProperty('--ry', r + 'px');
  document.documentElement.style.setProperty('--rx', r + 'px')
  document.documentElement.style.setProperty('--ry', r + 'px')
}

function pulseBaseCircle() {
  let t = 0;
  function tick() {
    t += 0.04;
    const pulse = 1 + Math.sin(t) * 0.05;
    const baseR = window.innerHeight * 0.15 * pulse;
    if (window.scrollY < 5) {
      overlay.style.setProperty('--rx', baseR + 'px');
      overlay.style.setProperty('--ry', baseR + 'px');
    }
    requestAnimationFrame(tick);
  }
  tick();
}

addEventListener('scroll', updateMask, { passive: true });
addEventListener('resize', updateMask);
updateMask();
pulseBaseCircle();
