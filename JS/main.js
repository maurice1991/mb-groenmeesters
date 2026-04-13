
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const siteHeader = document.getElementById("siteHeader");


menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    siteHeader.classList.toggle("menu-open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    siteHeader.classList.remove("menu-open");
});
});

// proces:
(() => {
  const section = document.querySelector('.process-section');
  const track = document.querySelector('.process-track');
  const cards = [...document.querySelectorAll('.process-card')];

  if (!section || !track || !cards.length) return;

  const MOBILE_BREAKPOINT = 950;
  const GAP = 48;

  let tops = [];
  let startScroll = 0;
  let endScroll = 0;
  let ticking = false;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function setupCards() {
    tops = [];
    let currentTop = 0;

    cards.forEach((card, index) => {
      card.style.top = '0px';
      card.style.transform = 'translate3d(0,0,0)';
      card.style.zIndex = String(index + 1);

      const height = card.offsetHeight;
      tops.push(currentTop);

      card.style.top = `${currentTop}px`;
      currentTop += height + GAP;
    });

    track.style.height = `${currentTop - GAP}px`;
  }

function setupScrollRange() {
  const rect = section.getBoundingClientRect();
  const scrollTop = window.scrollY || window.pageYOffset;
  const absoluteTop = rect.top + scrollTop;
  const viewport = window.innerHeight;

  const animationDistance = viewport * .7; // hoger = langzamer

  startScroll = absoluteTop - viewport*.06;
  endScroll = startScroll + animationDistance;

  // geef de section ook echt genoeg ruimte
  section.style.minHeight = `${animationDistance + viewport * .2}px`;
}

  function setup() {
    if (isMobile()) {
      track.style.height = 'auto';
      cards.forEach(card => {
        card.style.top = '';
        card.style.transform = '';
        card.style.zIndex = '';
      });
      return;
    }

    setupCards();
    setupScrollRange();
    update();
  }

  function getPhaseProgress(totalProgress, phaseIndex, phaseCount) {
    const start = phaseIndex / phaseCount;
    const end = (phaseIndex + 1) / phaseCount;
    const local = clamp((totalProgress - start) / (end - start), 0, 1);
    return easeInOutCubic(local);
  }

  function update() {
    if (isMobile()) return;

    const scrollTop = window.scrollY || window.pageYOffset;
    const totalProgress = clamp(
      (scrollTop - startScroll) / (endScroll - startScroll),
      0,
      1
    );

    const p1 = getPhaseProgress(totalProgress, 0, 3);
    const p2 = getPhaseProgress(totalProgress, 1, 3);
    const p3 = getPhaseProgress(totalProgress, 2, 3);

    const card1Y =
      (tops[1] - tops[0]) * p1 +
      (tops[2] - tops[1]) * p2 +
      (tops[3] - tops[2]) * p3;

    const card2Y =
      (tops[2] - tops[1]) * p2 +
      (tops[3] - tops[2]) * p3;

    const card3Y =
      (tops[3] - tops[2]) * p3;

    const card4Y = 0;

    cards[0].style.transform = `translate3d(0, ${card1Y}px, 0)`;
    cards[1].style.transform = `translate3d(0, ${card2Y}px, 0)`;
    cards[2].style.transform = `translate3d(0, ${card3Y}px, 0)`;
    cards[3].style.transform = `translate3d(0, ${card4Y}px, 0)`;
  }

  function onScroll() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener('load', setup);
  window.addEventListener('resize', setup);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Header:

const header = document.getElementById("siteHeader");
const scrollTopBtn = document.getElementById("scrollTopBtn");

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    /* Header verbergen als je naar beneden scrollt */
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      header.classList.add("hide-header");
    } 
    /* Header terug als je omhoog scrollt */
    else {
      header.classList.remove("hide-header");
    }

    /* Knop tonen na wat scrollen */
    if (currentScrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }

    lastScrollY = currentScrollY;
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });



const counters = document.querySelectorAll(".stat-number");

const animateCounter = (counter) => {
const target = +counter.getAttribute("data-target");
const suffix = counter.getAttribute("data-suffix") || "";
const duration = 1500;
const startTime = performance.now();

const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutCubic voor smooth einde
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(easedProgress * target);
    counter.textContent = currentValue + suffix;

    if (progress < 1) {
    requestAnimationFrame(updateCounter);
    } else {
    counter.textContent = target + suffix;
    }
};

requestAnimationFrame(updateCounter);
};

const observer = new IntersectionObserver((entries, observer) => {
entries.forEach((entry) => {
    if (entry.isIntersecting) {
    animateCounter(entry.target);
    observer.unobserve(entry.target);
    }
});
}, {
threshold: 0.5
});

counters.forEach(counter => {
observer.observe(counter);
});



/* Animaties */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     1. SPLIT HERO TITLE
  ========================= */

  const splitTargets = document.querySelectorAll(".split-text");

  splitTargets.forEach((element) => {
    let globalIndex = 0;
    splitNodePreserveMarkup(element);

    function splitNodePreserveMarkup(node) {
      if (node.nodeType === 3) {
        const text = node.textContent;
        if (!text.trim()) {
          return;
        }

        const fragment = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);

        parts.forEach((part) => {
          if (/^\s+$/.test(part)) {
            const space = document.createElement("span");
            space.classList.add("space");
            space.innerHTML = "&nbsp;";
            fragment.appendChild(space);
            return;
          }

          const word = document.createElement("span");
          word.classList.add("word");

          [...part].forEach((char) => {
            const charSpan = document.createElement("span");
            charSpan.classList.add("char");
            charSpan.textContent = char;
            charSpan.style.transitionDelay = `${globalIndex * 0.035}s`;
            globalIndex++;
            word.appendChild(charSpan);
          });

          fragment.appendChild(word);
        });

        node.replaceWith(fragment);
      } else if (node.nodeType === 1) {
        [...node.childNodes].forEach((child) => splitNodePreserveMarkup(child));
      }
    }
  });

  /* =========================
     2. REVEAL ON SCROLL
  ========================= */

  const revealItems = document.querySelectorAll(".reveal, .split-text");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  /* =========================
     3. HERO LOAD BOOST
     hero mag direct iets sneller inkomen
  ========================= */

  const heroReveals = document.querySelectorAll(".hero .reveal, .hero .split-text");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroReveals.forEach((el) => el.classList.add("show"));
    });
  });

  /* =========================
     4. COUNTERS
  ========================= */

  const statNumbers = document.querySelectorAll(".stat-number");
  const statsGrid = document.querySelector(".stats-grid");

  let statsStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      el.textContent = current.toLocaleString("nl-NL") + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString("nl-NL") + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if (statsGrid && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || statsStarted) return;

        statsStarted = true;
        statNumbers.forEach((num) => animateCounter(num));
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.35
    });

    statsObserver.observe(statsGrid);
  }
});

