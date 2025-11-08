// ===== API CONFIGURATION =====
const API_BASE_URL = 'http://localhost:8000'; // آدرس سرور FastAPI

// ===== LAPTOP 3D ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
    const laptop = document.querySelector('.laptop');
    const laptopWrapper = document.querySelector('.laptop-wrapper');
    
    if (laptop && laptopWrapper) {
        laptopWrapper.addEventListener('click', () => {
            laptop.classList.toggle('active-laptop');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const welcomeText = document.getElementById('welcomeText');
    const laptopWrapper = document.querySelector('.laptop-wrapper');
    if (welcomeText && laptopWrapper) {
        laptopWrapper.addEventListener('click', () => {
            welcomeText.classList.add('hidden');
            setTimeout(() => {
                welcomeText.classList.remove('hidden');
            }, 500);
        });
    }
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader').classList.add('hidden');
  }, 1000);
});

// ===== SCROLL PROGRESS INDICATOR =====
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('scrollIndicator').style.width = scrolled + '%';
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('navLinks').classList.remove('active');
    }
  });
});

// ===== MOBILE MENU TOGGLE =====
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

// ===== THEME TOGGLE =====
let isDark = true;
document.getElementById('themeToggle').addEventListener('click', function() {
  isDark = !isDark;
  const root = document.documentElement;
  
  if (isDark) {
    this.textContent = '🌙 Dark';
    root.style.setProperty('--bg-primary', '#0a0a0a');
    root.style.setProperty('--bg-secondary', '#1a1a1a');
    root.style.setProperty('--bg-tertiary', '#2a2a2a');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#b0b0b0');
  } else {
    this.textContent = '☀️ Light';
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f5f5f5');
    root.style.setProperty('--bg-tertiary', '#e5e5e5');
    root.style.setProperty('--text-primary', '#0a0a0a');
    root.style.setProperty('--text-secondary', '#4a4a4a');
  }
});

// ===== PROJECTS FILTER WITH API =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectsGrid = document.getElementById('projectsGrid');

// Load projects from API with a graceful fallback to local sample data
const SAMPLE_PROJECTS = [
  {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website with interactive 3D elements and smooth animations.',
    tags: ['HTML','CSS','JavaScript','Three.js'],
    demo_link: '#',
    code_link: '#',
    image: '🌐',
    category: 'web'
  },
  {
    title: 'Image Processing Tool',
    description: 'Advanced image processing tool with filters and object recognition.',
    tags: ['Python','OpenCV'],
    demo_link: '#',
    code_link: '#',
    image: '👁️',
    category: 'python'
  },
  {
    title: 'Automation Scripts',
    description: 'Collection of Python automation scripts for file handling and scheduling.',
    tags: ['Python','Automation'],
    demo_link: '#',
    code_link: '#',
    image: '🤖',
    category: 'python'
  }
];

async function loadProjects(category = 'all') {
  let projects = [];

  // Try API first
  try {
    const url = category === 'all'
      ? `${API_BASE_URL}/api/projects`
      : `${API_BASE_URL}/api/projects?category=${encodeURIComponent(category)}`;

    const response = await fetch(url, {cache: 'no-store'});
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();

    // If API returns an array, use it. Otherwise fallback.
    if (Array.isArray(data) && data.length > 0) {
      projects = data;
    } else {
      console.warn('API returned no projects, falling back to sample data.');
      projects = SAMPLE_PROJECTS.filter(p => category === 'all' ? true : p.category === category);
    }
  } catch (err) {
    console.warn('Could not load projects from API, using sample projects. Error:', err);
    projects = SAMPLE_PROJECTS.filter(p => category === 'all' ? true : p.category === category);
  }

  // Render projects
  projectsGrid.innerHTML = '';
  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.setAttribute('data-category', project.category || 'all');

    const tagsHTML = (project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

    projectCard.innerHTML = `
      <div class="project-image">${project.image || '📁'}</div>
      <div class="project-content">
        <h3 class="project-title">${project.title || 'Untitled'}</h3>
        <p class="project-description">${project.description || ''}</p>
        <div class="project-tags">${tagsHTML}</div>
        <div class="project-links">
          <a href="${project.demo_link || '#'}" class="project-link demo">Live Demo</a>
          <a href="${project.code_link || '#'}" class="project-link code">Code</a>
        </div>
      </div>
    `;

    projectsGrid.appendChild(projectCard);
  });
}

// Initial load
loadProjects();

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    loadProjects(filter);
  });
});

// ===== CONTACT FORM WITH API =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formStatus = document.getElementById('formStatus');
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Show loading state
  formStatus.textContent = 'در حال ارسال پیام...';
  formStatus.className = 'form-status';
  formStatus.style.display = 'block';
  formStatus.style.background = 'rgba(59, 130, 246, 0.1)';
  formStatus.style.color = 'var(--accent-primary)';

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      formStatus.textContent = '✅ پیام شما با موفقیت ارسال شد! به زودی پاسخ می‌دهم.';
      formStatus.className = 'form-status success';
      formStatus.style.background = 'rgba(16, 185, 129, 0.1)';
      formStatus.style.color = '#10b981';
      e.target.reset();
      
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    } else {
      throw new Error('Failed to send');
    }
  } catch (error) {
    console.error('Error:', error);
    formStatus.textContent = '❌ خطا در ارسال پیام. لطفاً دوباره تلاش کنید.';
    formStatus.className = 'form-status error';
    formStatus.style.background = 'rgba(239, 68, 68, 0.1)';
    formStatus.style.color = '#ef4444';
    formStatus.style.display = 'block';
  }
});

// ===== ANIMATED BACKGROUND (PARTICLES) =====
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const bgAnimation = document.getElementById('bgAnimation');
bgAnimation.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 100})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .contact-container > div').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ===== DYNAMIC STATS COUNTER =====
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const number = entry.target.querySelector('.stat-number');
      const target = parseInt(number.textContent);
      animateCounter(number, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
  statsObserver.observe(stat);
});

// ===== EASTER EGG - KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.style.animation = 'rainbow 2s linear infinite';
    setTimeout(() => {
      document.body.style.animation = '';
      alert('🎉 You found the secret! You\'re awesome!');
    }, 2000);
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(style);

// ===== ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Check if API is available
  checkAPIHealth();
});

// ===== CHECK API HEALTH =====
async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ API is connected and healthy');
    }
  } catch (error) {
    console.warn('⚠️ API is not available. Make sure FastAPI server is running on port 8000');
  }
}

// Check API on load
checkAPIHealth();
