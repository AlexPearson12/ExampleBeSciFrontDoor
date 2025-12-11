// ========================================
// GLOBAL UTILITIES & CONFIGURATION
// ========================================

// Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Utility function to check if element is in viewport
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= offset
    );
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ========================================

let observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !prefersReducedMotion) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Staggered animation observer
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !prefersReducedMotion) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('stagger-visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// ========================================
// DECISION TREE LOGIC
// ========================================

let currentQuestion = 1;
let answers = {
    q1: null,
    q2: null,
    q3: null
};
let answerHistory = [];

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeScrollAnimations();
    initializeParallax();
    initializeBackToTop();
    initializeReadingProgress();
    initializeCursorEffects();
    initializeButtonRipples();
    initializeAccessibility();
    initializeTooltips();
    initializeSkipLinks();
    initializePageTransitions();
});

function initializeForm() {
    // Add event listeners to all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', handleAnswer);
    });

    // Initialize decision tree progress if on decision tree page
    if (document.querySelector('.decision-tree-form')) {
        initializeDecisionTreeEnhancements();
    }
}

function handleAnswer(event) {
    const questionName = event.target.name;
    const value = event.target.value;
    
    // Store the answer
    answers[questionName] = value;
    
    // Wait a moment for visual feedback, then proceed
    setTimeout(() => {
        if (questionName === 'q1') {
            if (value === 'yes') {
                showQuestion(2);
            } else {
                showQuestion(3);
            }
        } else if (questionName === 'q2') {
            if (value === 'yes') {
                showResult('applied-research');
            } else {
                showResult('evidence-review');
            }
        } else if (questionName === 'q3') {
            if (value === 'yes') {
                showResult('applied-research');
            } else {
                showResult('consultation');
            }
        }
    }, 300);
}

function showQuestion(questionNumber) {
    // Hide all questions
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show the target question
    const targetQuestion = document.getElementById('q' + questionNumber);
    if (targetQuestion) {
        targetQuestion.classList.add('active');
        currentQuestion = questionNumber;
        
        // Scroll to top of form
        targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showResult(resultType) {
    // Hide all questions
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show result card
    const resultCard = document.getElementById('result');
    resultCard.classList.add('active');
    
    // Set recommendation content
    const recommendation = document.getElementById('recommendation');
    const resultLink = document.getElementById('resultLink');
    
    let title, description, link;
    
    switch(resultType) {
        case 'consultation':
            title = 'Consultation';
            description = 'A single discussion providing a behavioural science perspective on your challenge.';
            link = 'consultation.html';
            break;
        case 'evidence-review':
            title = 'Evidence Review';
            description = 'A structured evaluation of existing materials, services, or interventions against current evidence.';
            link = 'evidence-review.html';
            break;
        case 'applied-research':
            title = 'Applied Research';
            description = 'A full applied behavioural science project targeting a specific behaviour.';
            link = 'applied-research.html';
            break;
    }
    
    recommendation.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    
    resultLink.href = link;
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goBack(steps) {
    // Clear answers for questions after current
    if (currentQuestion === 2) {
        answers.q2 = null;
        document.querySelectorAll('input[name="q2"]').forEach(input => {
            input.checked = false;
        });
    } else if (currentQuestion === 3) {
        answers.q3 = null;
        document.querySelectorAll('input[name="q3"]').forEach(input => {
            input.checked = false;
        });
    }
    
    // Go back to previous question
    showQuestion(currentQuestion - steps);
}

function resetForm() {
    // Clear all answers
    answers = {
        q1: null,
        q2: null,
        q3: null
    };
    answerHistory = [];

    // Uncheck all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });

    // Show first question
    showQuestion(1);

    // Update progress bar
    updateProgressBar();
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    // Observe all elements that should fade in
    const fadeElements = document.querySelectorAll('.part-card, .service-description, .service-examples, .service-deliverables, .alternative-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in-element');
        fadeInObserver.observe(el);
    });

    // Observe grids for staggered animation
    const staggerGrids = document.querySelectorAll('.parts-grid, .alternatives-grid');
    staggerGrids.forEach(grid => {
        staggerObserver.observe(grid);
    });
}

// ========================================
// PARALLAX EFFECTS
// ========================================

function initializeParallax() {
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }, 16));
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

function initializeBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // Show/hide on scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100));

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// READING PROGRESS BAR
// ========================================

function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', throttle(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, 16));
}

// ========================================
// CURSOR EFFECTS
// ========================================

function initializeCursorEffects() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    // Create cursor follower
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth follow effect
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Enlarge on hover
    const interactiveElements = document.querySelectorAll('a, button, .option-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('active');
            cursorGlow.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
            cursorGlow.classList.remove('active');
        });
    });
}

// ========================================
// BUTTON RIPPLE EFFECTS
// ========================================

function initializeButtonRipples() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========================================
// TOOLTIPS
// ========================================

function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');

    elementsWithTooltips.forEach(el => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = el.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);

        el.addEventListener('mouseenter', (e) => {
            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.style.top = rect.top - 10 + 'px';
            tooltip.classList.add('visible');
        });

        el.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '!'}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 10);

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// DECISION TREE ENHANCEMENTS
// ========================================

function initializeDecisionTreeEnhancements() {
    createProgressBar();
    createBreadcrumbs();
    updateProgressBar();
}

function createProgressBar() {
    const form = document.querySelector('.decision-tree-form');
    if (!form) return;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'decision-progress';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-text">Step <span class="current-step">1</span> of 3</div>
    `;

    form.insertBefore(progressContainer, form.firstChild);
}

function createBreadcrumbs() {
    const form = document.querySelector('.decision-tree-form');
    if (!form) return;

    const breadcrumbs = document.createElement('div');
    breadcrumbs.className = 'breadcrumbs';
    breadcrumbs.innerHTML = `
        <button class="breadcrumb" data-question="1">Q1</button>
        <span class="breadcrumb-separator">›</span>
        <button class="breadcrumb" data-question="2">Q2</button>
        <span class="breadcrumb-separator">›</span>
        <button class="breadcrumb" data-question="3">Q3</button>
    `;

    const progressBar = form.querySelector('.decision-progress');
    if (progressBar) {
        progressBar.appendChild(breadcrumbs);
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const currentStepEl = document.querySelector('.current-step');

    if (progressFill && currentStepEl) {
        const progress = (currentQuestion / 3) * 100;
        progressFill.style.width = `${progress}%`;
        currentStepEl.textContent = currentQuestion;
    }
}

// ========================================
// ACCESSIBILITY FEATURES
// ========================================

function initializeAccessibility() {
    // Enhanced focus indicators are in CSS

    // Announce page changes for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // Store reference for later use
    window.liveRegion = liveRegion;
}

function announce(message) {
    if (window.liveRegion) {
        window.liveRegion.textContent = message;
    }
}

function initializeSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add id to main content if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

// ========================================
// PAGE TRANSITIONS
// ========================================

function initializePageTransitions() {
    // Add page load animation
    document.body.classList.add('page-loaded');

    // Intercept link clicks for smooth transitions
    const internalLinks = document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href$=".html"]:not([target="_blank"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const href = link.getAttribute('href');

                document.body.classList.add('page-transitioning');

                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

// ========================================
// HERO OPTION 5: Interactive Network Canvas
// ========================================

function initializeNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mousePos = { x: 0, y: 0 };
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            const dx = mousePos.x - this.x;
            const dy = mousePos.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    // Track mouse position
    canvas.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    // Connect nearby particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 1 - distance / 120;
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(147, 51, 234, ' + (opacity * 0.3) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        connectParticles();

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup on page navigation
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// Initialize network canvas if on option 5
if (document.getElementById('networkCanvas')) {
    initializeNetworkCanvas();
}
