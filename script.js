/**
 * ONKAR DILIP JADHAVAR — PORTFOLIO CORE SCRIPTS
 * High performance, zero external runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // --- 3. INTERACTIVE HERO AI / PARTICLE CANVAS ---
  const canvas = document.getElementById('hero-particles');
  const heroSection = document.getElementById('home');
  
  if (canvas && heroSection && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    let isHeroVisible = true;

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const resizeCanvas = () => {
      const rect = heroSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 14000), 55);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.5 + 0.8,
          baseAlpha: Math.random() * 0.45 + 0.25
        });
      }
    };

    const drawParticles = () => {
      if (!isHeroVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Wrap edges
        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Mouse interaction
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius && distMouse > 0) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          p1.x -= (dxMouse / distMouse) * force * 1.2;
          p1.y -= (dyMouse / distMouse) * force * 1.2;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p1.baseAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(203, 213, 225, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Pause canvas when offscreen to save 100% CPU
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible) {
            if (!animationId) animationId = requestAnimationFrame(drawParticles);
          } else {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    resizeCanvas();
    drawParticles();
  }

  // --- 4. CURSOR GLOW FOLLOWER (DESKTOP) ---
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const updateCursorGlow = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(updateCursorGlow);
    };
    requestAnimationFrame(updateCursorGlow);
  }

  // --- 5. SPOTLIGHT CARDS MOUSE TRACKER ---
  const spotlightCards = document.querySelectorAll('.project-card, .skill-card, .achieve-card, .resume-card, .stat-item, .gallery-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

  // --- 6. SCROLL REVEAL OBSERVER ---
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

  // --- 7. ACTIVE NAV HIGHLIGHT ON SCROLL ---
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

  // --- 8. 3D TILT EFFECT ON CARDS ---
  const tiltElements = document.querySelectorAll('#profile-card, .project-card, .achieve-card');
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    tiltElements.forEach(card => {
      const isProfile = card.id === 'profile-card';
      const maxAngle = isProfile ? 5 : 3.5;

      const handleTilt = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxAngle;
        const rotateY = ((x - centerX) / centerX) * maxAngle;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      };

      const resetTilt = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      };

      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    });
  }

  // --- 9. TYPEWRITER EFFECT ---
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

  // --- 10. STATS COUNTER ANIMATION ---
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

  // --- 11. IMAGE GALLERY / AUTOMATIC MOVING BAR + TOUCH DRAG ENGINE ---
  const galleryTrack = document.getElementById('gallery-track');
  const galleryViewport = document.getElementById('gallery-viewport');

  if (galleryTrack && galleryViewport) {
    let offset = 0;
    const baseSpeed = 0.65; // slow smooth movement in pixels per frame
    let isDragging = false;
    let isHovered = false;
    let isVisible = true;
    let startX = 0;
    let dragStartOffset = 0;
    let hasMoved = false;

    const getHalfWidth = () => {
      return galleryTrack.scrollWidth / 2;
    };

    // RAF smooth auto-drift loop
    const animateMarquee = () => {
      const halfWidth = getHalfWidth();
      if (!isDragging && !isHovered && isVisible && halfWidth > 0) {
        offset -= baseSpeed;
        if (offset <= -halfWidth) {
          offset += halfWidth;
        } else if (offset > 0) {
          offset -= halfWidth;
        }
        galleryTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      requestAnimationFrame(animateMarquee);
    };

    // Pause when offscreen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(galleryViewport);
    }

    // Hover pause
    galleryViewport.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    galleryViewport.addEventListener('mouseleave', () => {
      isHovered = false;
      if (isDragging) {
        isDragging = false;
        galleryViewport.classList.remove('is-dragging');
      }
    });

    // Touch & Mouse Drag Handlers
    const startDrag = (clientX) => {
      isDragging = true;
      hasMoved = false;
      startX = clientX;
      dragStartOffset = offset;
      galleryViewport.classList.add('is-dragging');
    };

    const moveDrag = (clientX) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      if (Math.abs(deltaX) > 6) {
        hasMoved = true;
      }
      const halfWidth = getHalfWidth();
      let newOffset = dragStartOffset + deltaX;

      if (halfWidth > 0) {
        while (newOffset <= -halfWidth) newOffset += halfWidth;
        while (newOffset > 0) newOffset -= halfWidth;
      }

      offset = newOffset;
      galleryTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      galleryViewport.classList.remove('is-dragging');
    };

    // Mouse Events
    galleryViewport.addEventListener('mousedown', (e) => {
      startDrag(e.pageX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        moveDrag(e.pageX);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        endDrag();
      }
    });

    // Touch Events
    galleryViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].pageX);
      }
    }, { passive: true });

    galleryViewport.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        moveDrag(e.touches[0].pageX);
      }
    }, { passive: true });

    galleryViewport.addEventListener('touchend', () => {
      endDrag();
    }, { passive: true });

    galleryViewport.addEventListener('touchcancel', () => {
      endDrag();
    }, { passive: true });

    // Intercept card clicks if user was dragging
    const cards = galleryTrack.querySelectorAll('.gallery-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (hasMoved) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }, true);
    });

    // Start auto-drift animation
    requestAnimationFrame(animateMarquee);
  }

  // --- 12. COPY RESUME MARKDOWN ---
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
