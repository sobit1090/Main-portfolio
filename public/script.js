// Register GSAP ScrollTrigger and ScrollToPlugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Smoother Custom Cursor using GSAP quickTo
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });
  const fxTo = gsap.quickTo(cursorFollower, "x", { duration: 0.2, ease: "power2.out" });
  const fyTo = gsap.quickTo(cursorFollower, "y", { duration: 0.2, ease: "power2.out" });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX - 10);
    yTo(e.clientY - 10);
    fxTo(e.clientX - 4);
    fyTo(e.clientY - 4);
  });

  // Scale effects on hover for interactive items
  const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .tech-item, input, textarea, .hamburger, .theme-switch-btn'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 1.4, duration: 0.2 });
      gsap.to(cursorFollower, { scale: 0.5, opacity: 0.5, duration: 0.2 });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(cursorFollower, { scale: 1, opacity: 1, duration: 0.2 });
    });
  });
}

// Mobile Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Newspaper Theme Switcher
function initTheme() {
  const toggleBtn = document.querySelector('.theme-switch-btn');
  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);

  if (toggleBtn) {
    toggleBtn.textContent = currentTheme === 'dark' ? 'Day Edition' : 'Midnight Edition';

    toggleBtn.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      toggleBtn.textContent = newTheme === 'dark' ? 'Day Edition' : 'Midnight Edition';

      // Micro-animation flip
      gsap.fromTo(toggleBtn, { rotationX: 0 }, { rotationX: 360, duration: 0.5, ease: "power2.inOut" });
    });
  }
}
initTheme();

// Loading screen animation
window.addEventListener('load', () => {
  const loadScreen = document.querySelector('.loading-screen');
  if (loadScreen) {
    const tl = gsap.timeline();
    tl.to('.loading-progress', {
      width: '100%',
      duration: 1.5,
      ease: "power2.inOut"
    })
    .to(loadScreen, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        loadScreen.style.display = 'none';
        initMainAnimations();
      }
    });
  } else {
    initMainAnimations();
  }
});

function initMainAnimations() {
  // Scroll Progress Bar Tracker
  if (document.querySelector('.scroll-progress')) {
    gsap.to('.scroll-progress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  // Header Entrance Animations
  const headerTl = gsap.timeline();

  headerTl.to('.logo', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "back.out(1.5)"
  })
  .to('.tagline', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8")
  .to('.date-line', {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.6")
  .to('nav', {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.4");

  // Profile picture stagger entrance
  gsap.to('.profile-img', {
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: '#about',
      start: "top 85%"
    }
  });

  gsap.to('.about-text', {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '#about',
      start: "top 85%"
    }
  });

  // Project Cards staggered emergence
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.set(card, {
      opacity: 0,
      y: 60,
      rotationX: -10,
      transformPerspective: 1000
    });

    gsap.to(card, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none"
      },
      delay: i * 0.15
    });

    // Tilt interactions on hover
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -12,
        rotationX: 3,
        rotationY: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });

  // Tech stack icons staggered scaling
  gsap.to('.tech-item', {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    stagger: 0.08,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: '#tech',
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  // Stately title wipes
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // Staggered reveal for subpage elements (gallery cards, timeline contents, details etc.)
  gsap.utils.toArray('.gallery-item, .content-card, .feature-item, .timeline-content').forEach((item) => {
    gsap.set(item, { opacity: 0, y: 30 });
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 92%",
        toggleActions: "play none none none"
      }
    });
  });

  // Drifting code floats
  gsap.utils.toArray('.floating-code').forEach((element, i) => {
    gsap.to(element, {
      y: "random(-25, 25)",
      x: "random(-15, 15)",
      duration: "random(4, 7)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.4
    });
  });

  // Rotating ink blots
  gsap.to('.ink-blot-1', {
    rotation: 360,
    duration: 35,
    repeat: -1,
    ease: "none"
  });

  gsap.to('.ink-blot-2', {
    rotation: -360,
    duration: 40,
    repeat: -1,
    ease: "none"
  });

  // Nav smooth scrolling utilizing GSAP
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: target, offsetTo: 20 },
            ease: "power3.inOut"
          });
        }
      }
    });
  });
}

// Contact form typewriter dispatcher submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.submit-btn');
    const name = contactForm.querySelector('input[name="name"]').value;
    const email = contactForm.querySelector('input[name="email"]').value;
    const message = contactForm.querySelector('textarea[name="message"]').value;
    const thankYouEl = document.querySelector('.thank-you-message');

    gsap.timeline()
      .to(btn, { scale: 0.95, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.1 });

    try {
      btn.textContent = "PRINTING DISPATCH...";
      btn.disabled = true;

      const res = await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      if (data.success) {
        gsap.to(contactForm, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            contactForm.style.display = "none";
            thankYouEl.style.display = "block";
            
            // Stamped-on feedback animation
            gsap.fromTo(thankYouEl, 
              { opacity: 0, scale: 2, rotation: -20 }, 
              { opacity: 1, scale: 1, rotation: -3, duration: 0.6, ease: "bounce.out" }
            );
          }
        });
      } else {
        btn.textContent = "SEND DISPATCH";
        btn.disabled = false;
        alert("❌ Failed to send dispatch: " + data.error);
      }
    } catch (err) {
      btn.textContent = "SEND DISPATCH";
      btn.disabled = false;
      alert("❌ Error sending dispatch: " + err.message);
    }
  });
}

console.log("[v1] Upgraded newspaper animations and custom cursor successfully initialized.");