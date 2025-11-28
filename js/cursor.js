<script>
(function () {
  // Config
  const ringFollowSpeed = 0.12; // lower = more lag
  const dotFollowSpeed  = 0.35; // higher = more responsive

  // Elements
  const cursorWrap = document.querySelector('.custom-cursor');
  const ring = cursorWrap.querySelector('.cursor-ring');
  const dot  = cursorWrap.querySelector('.cursor-dot');

  // State
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;
  let dotX  = mouseX, dotY  = mouseY;
  let visible = true;
  let rafId = null;

  // Enable class to hide native cursor (except prefers-reduced-motion handled by CSS)
  document.documentElement.classList.add('custom-cursor-enabled');

  // Track pointer
  function onMove(e) {
    // support both mouse and touch
    const evt = e.touches ? e.touches[0] : e;
    mouseX = evt.clientX;
    mouseY = evt.clientY;

    // show when moving
    if (!visible) {
      visible = true;
      cursorWrap.classList.remove('hidden');
    }
  }
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  // Hide cursor when pointer leaves window
  window.addEventListener('mouseleave', () => {
    cursorWrap.classList.add('hidden');
    visible = false;
  });
  window.addEventListener('mouseenter', () => {
    cursorWrap.classList.remove('hidden');
    visible = true;
  });

  // Show native cursor when hovering form controls for accessibility/UX
  const interactiveSelector = 'a, button, input, textarea, select, label, [role="button"], .no-custom-cursor';
  function handleInteractive(e) {
    document.body.classList.toggle('show-native-cursor', e.type === 'mouseover');
  }
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.matches(interactiveSelector)) handleInteractive({ type: 'mouseover' });
  }, true);
  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.matches(interactiveSelector)) handleInteractive({ type: 'mouseout' });
  }, true);

  // Respect keyboard focus: show native cursor while tab-focusing elements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.remove('custom-cursor-enabled');
    }
  });
  document.addEventListener('mousedown', () => {
    // re-enable on mouse use
    document.documentElement.classList.add('custom-cursor-enabled');
  });

  // Animation loop (lerp)
  function lerp(a, b, n) { return (1 - n) * a + n * b; }

  function render() {
    // Lerp positions
    ringX = lerp(ringX, mouseX, ringFollowSpeed);
    ringY = lerp(ringY, mouseY, ringFollowSpeed);

    dotX = lerp(dotX, mouseX, dotFollowSpeed);
    dotY = lerp(dotY, mouseY, dotFollowSpeed);

    // Apply transform
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform  = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    rafId = requestAnimationFrame(render);
  }

  // Start loop
  render();

  // Optional: expose enable/disable API
  window.customCursor = {
    enable() {
      document.documentElement.classList.add('custom-cursor-enabled');
      cursorWrap.classList.remove('hidden');
    },
    disable() {
      document.documentElement.classList.remove('custom-cursor-enabled');
      cursorWrap.classList.add('hidden');
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      cursorWrap.remove();
    }
  };
})();
</script>
