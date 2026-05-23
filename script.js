/* ==========================================================================
   Bethanasamy Rajamani's Premium E-Portfolio JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- PART 1: Interactive Particle Network Canvas ---
  initParticleCanvas();

  // --- PART 2: Auto-Typewriter Effect ---
  initTypewriter();

  // --- PART 3: Sticky Navbar & Active Section Highlighting ---
  initNavbarScroll();

  // --- PART 4: Mobile Drawer Menu Toggle ---
  initMobileDrawer();

  // --- PART 5: Dark / Light Theme Toggle ---
  initThemeToggle();

  // --- PART 6: Skill Category Filtering ---
  initSkillTabs();

  // --- PART 7: Project Ecosystem Filtering ---
  initProjectFilters();

  // --- PART 8: Expandable Timeline Milestones ---
  initTimelineCollapse();

  // --- PART 9: Glassmorphism Contact Form Handling ---
  initContactForm();
});

/* ==========================================
   Interactive Particle Canvas Background
   ========================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let connectionDist = 120;
  let mouse = { x: null, y: null, radius: 150 };

  // Track theme background colors to match particle color themes
  function getParticleColor() {
    const isDark = document.body.classList.contains('dark-theme');
    return isDark ? 'rgba(6, 182, 212, ' : 'rgba(109, 40, 217, '; // Cyan for dark, Violet for light
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse Interaction
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around bounds
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 0.8;
          let directionY = forceDirectionY * force * 0.8;
          
          this.x += directionX;
          this.y += directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = getParticleColor() + '0.5)';
      ctx.fill();
    }
  }

  // Populate particles
  const particleCount = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    let baseColor = getParticleColor();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          let alpha = (1 - (dist / connectionDist)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = baseColor + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   Typewriter Effect (Hero Section)
   ========================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  
  const words = JSON.parse(el.getAttribute('data-words'));
  let wordIndex = 0;
  let txt = '';
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      txt = currentWord.substring(0, txt.length - 1);
    } else {
      txt = currentWord.substring(0, txt.length + 1);
    }

    el.innerHTML = txt;

    let typeSpeed = 80;
    if (isDeleting) {
      typeSpeed /= 2;
    }

    if (!isDeleting && txt === currentWord) {
      typeSpeed = 2000; // Hold full word
      isDeleting = true;
    } else if (isDeleting && txt === '') {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 500);
}

/* ==========================================
   Navbar Scroll and Intersection Observer
   ========================================== */
function initNavbarScroll() {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky Shrinking Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Dynamic Highlight Active Section in Navbar
  const observerOptions = {
    root: null,
    threshold: 0.25, // Activate when 25% of section is visible
    rootMargin: "-80px 0px 0px 0px" // Account for fixed navbar height
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================
   Mobile Side Drawer
   ========================================== */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!openBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer if user clicks outside of it
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && 
        !drawer.contains(e.target) && 
        !openBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ==========================================
   Dark / Light Theme State Manager
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');

  // Check user preference in LocalStorage
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    icon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    icon.className = 'fa-solid fa-moon';
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    
    // Rotate animation toggle
    toggleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      toggleBtn.style.transform = 'none';
    }, 400);

    if (isDark) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      icon.className = 'fa-solid fa-sun';
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      icon.className = 'fa-solid fa-moon';
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });
}

/* ==========================================
   Skill Hub Tabs Switching
   ========================================== */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-nav-btn');
  const panes = document.querySelectorAll('.skill-category-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCat = btn.getAttribute('data-skill-cat');

      // Update button highlights
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panes active state with smooth fade in
      panes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.getAttribute('id') === targetCat) {
          pane.classList.add('active');
          
          // Re-trigger progression bars fill animation
          const fillSpans = pane.querySelectorAll('.skill-progress-bar span');
          fillSpans.forEach(span => {
            span.style.animation = 'none';
            span.offsetHeight; // Trigger reflow to restart animation
            span.style.animation = null;
          });
        }
      });
    });
  });
}

/* ==========================================
   Project Ecosystem Filtering Gallery
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Toggle active states on filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCat === filterValue) {
          // Show with smooth scaling transition
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Hide with smooth transition
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 350);
        }
      });
    });
  });
}

/* ==========================================
   Expandable Professional Timeline Milestones
   ========================================== */
function initTimelineCollapse() {
  const trigger = document.querySelector('.toggle-trigger');
  const collapsibleNode = document.getElementById('earlier-career-node');
  const markerIcon = collapsibleNode ? collapsibleNode.querySelector('.trigger-icon i') : null;

  if (!trigger || !collapsibleNode) return;

  trigger.addEventListener('click', () => {
    const isExpanded = collapsibleNode.classList.contains('expanded');
    
    if (isExpanded) {
      collapsibleNode.classList.remove('expanded');
      if (markerIcon) markerIcon.className = 'fa-solid fa-plus';
    } else {
      collapsibleNode.classList.add('expanded');
      if (markerIcon) markerIcon.className = 'fa-solid fa-minus';
    }
  });

  // Also enable clicking the circle icon to expand
  const iconTrigger = collapsibleNode.querySelector('.trigger-icon');
  if (iconTrigger) {
    iconTrigger.addEventListener('click', () => {
      const isExpanded = collapsibleNode.classList.contains('expanded');
      if (isExpanded) {
        collapsibleNode.classList.remove('expanded');
        if (markerIcon) markerIcon.className = 'fa-solid fa-plus';
      } else {
        collapsibleNode.classList.add('expanded');
        if (markerIcon) markerIcon.className = 'fa-solid fa-minus';
      }
    });
  }
}

/* ==========================================
   Glassmorphism Contact Form Validation & Mock Submission
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    feedback.innerText = "Transmitting secure connection...";
    feedback.className = "form-feedback";

    // Simulate sending network request
    setTimeout(() => {
      feedback.innerText = `Thank you, ${name}! Your connection request has been securely transmitted. I'll get back to you shortly.`;
      feedback.className = "form-feedback success";
      
      // Reset the form values
      form.reset();
    }, 1500);
  });
}
