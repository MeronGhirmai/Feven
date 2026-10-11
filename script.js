/**
 * FEVEN BELETSE NEGASH — PORTFOLIO INTERACTION SUITE
 * Legally Blonde × Barbie Themed Interactive Effects & Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initSparkleCanvas();
    initPublicationFilters();
    initToastNotifications();
    initNavbarScroll();
    initBackToTop();
    initMobileNav();
    initElleScentedResume();
});

/* ==========================================================================
   1. DELICATE SPARKLE CANVAS (Elle Woods & Barbie Magic Glow)
   ========================================================================== */
let sparklesActive = true;

function initSparkleCanvas() {
    const canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 35;
    const colors = [
        'rgba(225, 29, 116, 0.7)',   // Barbie Pink
        'rgba(212, 175, 55, 0.75)',  // Gold Leaf
        'rgba(244, 63, 142, 0.65)',  // Rose Shimmer
        'rgba(255, 255, 255, 0.85)'  // Diamond White
    ];

    class Particle {
        constructor(x, y) {
            this.reset(x, y);
        }

        reset(x, y) {
            this.x = x !== undefined ? x : Math.random() * width;
            this.y = y !== undefined ? y : Math.random() * height;
            this.size = Math.random() * 4 + 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = -Math.random() * 0.8 - 0.2; // Slow gentle upward drift
            this.alpha = Math.random() * 0.8 + 0.2;
            this.life = 0;
            this.maxLife = Math.random() * 120 + 80;
            this.isStar = Math.random() > 0.4;
            this.rot = Math.random() * Math.PI;
            this.rotSpeed = (Math.random() - 0.5) * 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.rotSpeed;
            this.life++;

            // Fade in and out
            const progress = this.life / this.maxLife;
            if (progress < 0.2) {
                this.alpha = (progress / 0.2) * 0.8;
            } else if (progress > 0.7) {
                this.alpha = ((1 - progress) / 0.3) * 0.8;
            }

            if (this.life >= this.maxLife || this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }

        draw() {
            if (!sparklesActive) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            if (this.isStar) {
                // Draw 4-point sparkle star
                const r = this.size * 2;
                ctx.beginPath();
                ctx.moveTo(0, -r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.quadraticCurveTo(0, 0, 0, r);
                ctx.quadraticCurveTo(0, 0, -r, 0);
                ctx.quadraticCurveTo(0, 0, 0, -r);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Interactive mouse sparkle trail
    window.addEventListener('mousemove', (e) => {
        if (!sparklesActive || Math.random() > 0.6) return;
        const p = new Particle(e.clientX, e.clientY);
        p.vy = (Math.random() - 0.5) * 1.5;
        p.vx = (Math.random() - 0.5) * 1.5;
        p.maxLife = 50;
        particles.push(p);
        if (particles.length > 50) particles.shift();
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        if (sparklesActive) {
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Sparkle Toggle Button Control
    const toggleBtn = document.getElementById('sparkleToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sparklesActive = !sparklesActive;
            toggleBtn.innerHTML = sparklesActive ? '✦ Sparkles: On' : '✦ Sparkles: Off';
            toggleBtn.style.opacity = sparklesActive ? '1' : '0.6';
            showToast(sparklesActive ? '✨ Sparkles activated!' : '✨ Sparkles dimmed.');
        });
    }
}

/* ==========================================================================
   2. RESEARCH & PUBLICATIONS FILTERING
   ========================================================================== */
function initPublicationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const pubItems = document.querySelectorAll('.timeline-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            pubItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   3. TOAST NOTIFICATIONS
   ========================================================================== */
let toastTimeout;
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3800);
}

function initToastNotifications() {
    const copyEmailButtons = document.querySelectorAll('.btn-email-copy');
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'beletsefeven21@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast(`💌 Copied to clipboard: <strong>${email}</strong>`);
            }).catch(() => {
                showToast(`💌 Email: ${email}`);
            });
        });
    });
}

/* ==========================================================================
   4. ELLE WOODS SCENTED RÉSUMÉ HOMAGE
   ========================================================================== */
function initElleScentedResume() {
    const scentedButtons = document.querySelectorAll('.btn-scented');
    scentedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('🌸 <em>"It’s pink and it’s scented! Gives it a little something extra..."</em> — CV Dossier opened!');
        });
    });
}

/* ==========================================================================
   5. NAVBAR SCROLL ELEVATION
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   6. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backBtn = document.getElementById('backToTop');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   7. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (toggle && navContainer) {
        toggle.addEventListener('click', () => {
            navContainer.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('open');
            });
        });
    }
}
