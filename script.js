/**
 * ONKAR DILIP JADHAVAR — PORTFOLIO CORE SCRIPTS
 * High performance, zero external runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER SCROLL STATE & TOP PROGRESS BAR ---
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scroll-progress');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min((scrollY / docHeight) * 100, 100);
        progressBar.style.width = `${percent}%`;
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. SCROLL REVEAL OBSERVER ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 4. ACTIVE NAV HIGHLIGHT ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navItems.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-72px 0px -40% 0px'
    });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // --- 5. 3D TILT EFFECT ON PROFILE CARD ---
  const profileCard = document.getElementById('profile-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (profileCard && !prefersReducedMotion) {
    const handleTilt = (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const resetTilt = () => {
      profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    profileCard.addEventListener('mousemove', handleTilt);
    profileCard.addEventListener('mouseleave', resetTilt);
  }

  // --- 6. TYPEWRITER EFFECT ---
  const typedRoleEl = document.getElementById('typed-role');
  const roles = [
    'Generative AI Engineer',
    'LLM Systems Developer',
    'Full-Stack Web Architect',
    'Prompt Pipeline Engineer',
    'Technical Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeText() {
    if (!typedRoleEl) return;

    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      typedRoleEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedRoleEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeText, typeSpeed);
  }

  if (typedRoleEl) {
    setTimeout(typeText, 600);
  }

  // --- 7. STATS COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const targetVal = parseFloat(el.textContent.trim());
        const isFloat = el.textContent.includes('.');
        const duration = 1200;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const val = easeProgress * targetVal;

          el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = isFloat ? targetVal.toFixed(1) : targetVal;
          }
        };

        requestAnimationFrame(updateCounter);
        statsObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));
  }

  // --- 8. COPY RESUME MARKDOWN ---
  const copyMdBtn = document.getElementById('copy-markdown-btn');
  if (copyMdBtn) {
    copyMdBtn.addEventListener('click', () => {
      const summary = `# Onkar Dilip Jadhavar
**Generative AI Engineer & Full-Stack Developer**
- **Education:** B.Tech in CSE (Sanjay Ghodawat Institute, CGPA: 7.8, 3rd Year) | SSC: 95.00% | HSC: 77.33%
- **Specializations:** Generative AI, LLMs, Prompt Pipelines, React 18, Node.js, Python, Modern HTML5/CSS3, REST APIs.
- **Experience:** AI & Web Developer Intern @ Kinetrexa (Sep 2024 – Present)
- **Leadership:** Vice-President (CSESA), Magazine Secretary (Student Council), Campus Ambassador (Techfest IIT Bombay), Student Ambassador (GeeksforGeeks), Internshala Student Partner (ISP).
- **Contact:** omkarjadhavar13@gmail.com | linkedin.com/in/onkarjadhavar | github.com/onkarjadhavar`;

      navigator.clipboard.writeText(summary).then(() => {
        showToast('Resume Markdown copied to clipboard!');
      }).catch(() => {
        showToast('Failed to copy. Please try again.');
      });
    });
  }

});

// --- GLOBAL LIGHTBOX VIEWER ---
window.openLightbox = function(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (!modal || !img) return;

  img.src = src;
  img.alt = caption || 'Document Viewer';
  if (cap) cap.textContent = caption || '';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLightbox();
  }
});

// --- GLOBAL TOAST NOTIFICATION ---
window.showToast = function(message, iconClass = 'fas fa-circle-check') {
  let toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

// --- CONTACT FORM DISPATCH ---
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('form-name')?.value || 'Friend';
  const email = document.getElementById('form-email')?.value || '';
  const message = document.getElementById('form-message')?.value || '';

  const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  window.open(`mailto:omkarjadhavar13@gmail.com?subject=${subject}&body=${body}`, '_blank');
  window.showToast(`Thank you, ${name}! Your email client has been opened.`);

  const form = document.getElementById('contact-form');
  if (form) form.reset();
};
