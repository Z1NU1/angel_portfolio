/* ===========================
   LOADER
   =========================== */
window.addEventListener('load', () => {
  setTimeout(() => {
  document.getElementById('loader').classList.add('hide');
}, 3000);
});

/* ===========================
   CUSTOM CURSOR
   =========================== */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

if (cursor && cursorRing) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform     = 'translate(-50%,-50%) scale(2)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
      cursorRing.style.opacity   = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.opacity   = '0.6';
    });
  });
}

/* ===========================
   HAMBURGER / MOBILE NAV
   =========================== */
const hamburger = document.getElementById('hamburger');
const navRight  = document.getElementById('navRight');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navRight.classList.toggle('open');
});

function closeNav() {
  hamburger.classList.remove('open');
  navRight.classList.remove('open');
}

/* ===========================
   SCROLL REVEALS
   =========================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 6) * 80;
  revealObserver.observe(el);
});

/* ===========================
   SKILL BARS
   =========================== */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-inner').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('#skills').forEach(section => barObserver.observe(section));

/* ===========================
   PROCESS STEPS STAGGER
   =========================== */
document.querySelectorAll('.process-step').forEach((step, i) => {
  step.style.transitionDelay = (i * 0.12) + 's';
});

/* ===========================
   SPARKLE HEADLINE
   =========================== */
function burstSparks(letterEl, count) {
  const rect = letterEl.getBoundingClientRect();
  const parentRect = letterEl.closest('.sparkle-word').parentElement.getBoundingClientRect();
  const cx = rect.left - parentRect.left + rect.width / 2;
  const cy = rect.top  - parentRect.top  + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('i');
    spark.className = 'spark';
    const angle  = (Math.random() * 360) * Math.PI / 180;
    const dist   = 14 + Math.random() * 22;
    const size   = 4 + Math.random() * 6;
    const dur    = 0.55 + Math.random() * 0.45;
    const del    = Math.random() * 0.15;
    spark.style.cssText = `
      left:${cx}px; top:${cy}px;
      --sz:${size}px;
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist - 10}px;
      --dur:${dur}s; --del:${del}s;
    `;
    letterEl.closest('.hero-headline').appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  }
}

function initSparkleWords() {
  document.querySelectorAll('.sparkle-word').forEach((word, wi) => {
    const text = word.textContent.trim();
    word.innerHTML = '';
    [...text].forEach((ch, li) => {
      const span = document.createElement('span');
      span.className = 's-letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      const delay = 1.0 + wi * 0.35 + li * 0.07;
      span.style.animationDelay = delay + 's';
      word.appendChild(span);

      // Burst sparks when each letter fades in
      setTimeout(() => burstSparks(span, 5 + Math.floor(Math.random() * 4)), delay * 1000 + 100);
    });
  });

  // Recurring ambient sparkle on the champagne word
  setTimeout(() => {
    const word2 = document.getElementById('sparkWord2');
    if (!word2) return;
    setInterval(() => {
      const letters = word2.querySelectorAll('.s-letter');
      if (!letters.length) return;
      const pick = letters[Math.floor(Math.random() * letters.length)];
      burstSparks(pick, 3);
    }, 1800);
  }, 2800);
}

initSparkleWords();

/* ===========================
   PHOTO FLASH CANVAS
   =========================== */
const photoWrap  = document.getElementById('photoWrap');
const flashCanvas = document.getElementById('flashCanvas');

if (photoWrap && flashCanvas) {
  photoWrap.addEventListener('mouseenter', () => {
    flashCanvas.style.transition = 'opacity 0.05s';
    flashCanvas.style.opacity = '0.25';
    setTimeout(() => {
      flashCanvas.style.transition = 'opacity 0.4s';
      flashCanvas.style.opacity = '0';
    }, 80);
  });
}

/* ===========================
   SMOOTH NAV ACTIVE STATE
   =========================== */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => activeObserver.observe(section));