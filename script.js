/**
 * ONKAR DILIP JADHAVAR — PORTFOLIO CORE SCRIPTS
 * High performance, zero external runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. DYNAMIC YEAR ---
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- 2. HEADER SCROLL STATE & SCROLL PROGRESS ---
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

  // --- 3. MOBILE MENU TOGGLE ---
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

  // --- 4. SCROLL REVEAL OBSERVER ---
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
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 5. ACTIVE NAV HIGHLIGHT ON SCROLL ---
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
      threshold: 0.25,
      rootMargin: '-72px 0px -40% 0px'
    });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // --- 6. 3D TILT EFFECT ON PROFILE CARD ---
  const profileCard = document.getElementById('profile-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (profileCard && !prefersReducedMotion) {
    const handleTilt = (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const resetTilt = () => {
      profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    profileCard.addEventListener('mousemove', handleTilt);
    profileCard.addEventListener('mouseleave', resetTilt);
  }

  // --- 7. TYPEWRITER EFFECT ---
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

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400; // Pause before new word
    }

    setTimeout(typeText, typeSpeed);
  }

  if (typedRoleEl) {
    setTimeout(typeText, 600);
  }

  // --- 8. STATS COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const targetVal = parseFloat(el.textContent.trim());
        const isFloat = el.textContent.includes('.');
        let current = 0;
        const duration = 1200;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
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

  // --- 9. CERTIFICATE LIGHTBOX ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  window.openCertLightbox = function(card) {
    const img = card.querySelector('img');
    if (!img || !lightbox || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Certificate View';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- 10. APPOINTMENT / OFFER LIGHTBOX ---
  const offerLightbox = document.getElementById('offer-lightbox');
  const offerLightboxImg = document.getElementById('offer-lightbox-img');
  const offerLightboxTitle = document.getElementById('offer-lightbox-title');
  const offerLightboxClose = document.getElementById('offer-lightbox-close');

  window.openOffer = function(src, title) {
    if (!offerLightbox || !offerLightboxImg) return;

    offerLightboxImg.src = src;
    offerLightboxImg.alt = title;
    if (offerLightboxTitle) offerLightboxTitle.textContent = title;
    offerLightbox.classList.add('open');
    offerLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (offerLightboxClose) offerLightboxClose.focus();
  };

  const closeOfferLightbox = () => {
    if (!offerLightbox) return;
    offerLightbox.classList.remove('open');
    offerLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (offerLightboxClose) offerLightboxClose.addEventListener('click', closeOfferLightbox);
  if (offerLightbox) {
    offerLightbox.addEventListener('click', (e) => {
      if (e.target === offerLightbox) closeOfferLightbox();
    });
  }

  // ESC key closes both modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('open')) closeLightbox();
      if (offerLightbox && offerLightbox.classList.contains('open')) closeOfferLightbox();
    }
  });

  // --- 11. TOAST NOTIFICATIONS HELPER ---
  window.showToast = function(message, iconClass = 'fas fa-circle-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  };

  // --- 12. COPY EMAIL ACTION ---
  window.copyEmail = function(email) {
    navigator.clipboard.writeText(email).then(() => {
      window.showToast(`Email copied: ${email}`);
    }).catch(() => {
      window.showToast(`Contact: ${email}`);
    });
  };

  // --- 13. COPY RESUME SUMMARY ACTION ---
  window.copyResumeSummary = function() {
    const summary = `# Onkar Dilip Jadhavar
**Generative AI Engineer & Full-Stack Developer**
- **Education:** B.Tech Computer Science & Engineering (SGI Kolhapur, CGPA: 7.8, 3rd Year) | SSC: 95%
- **Technical Stack:** Generative AI, Prompt Engineering, LLM Integration, Python, JavaScript, Modern HTML5/CSS3, REST APIs, Git.
- **Core Strengths:** Technical Leadership, Team Management, High Confidence & Public Communication, Project Delivery.
- **Experience:** Frontend Development Intern (Kinetrexa Software Pvt. Ltd.)
- **Leadership & Honors:** College Ambassador (Techfest IIT Bombay), Campus Mantri (GeeksforGeeks), VP (CSESA), Magazine Secretary (Student Council)
- **Contact:** onkarjadhavar23@gmail.com | +91 79729 61313 | linkedin.com/in/onkar-jadhavar-1b3b02345`;

    navigator.clipboard.writeText(summary).then(() => {
      window.showToast('Resume Summary copied to clipboard!');
    }).catch(() => {
      window.showToast('Failed to copy. Please try again.');
    });
  };

});
