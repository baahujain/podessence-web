/* ─── Add fade-el class and observe for scroll-in ─── */
const fadeTargets = document.querySelectorAll(
    '.feature-card, .step, .testimonial, .section-header, .stat'
);
const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 90);
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
fadeTargets.forEach(el => {
    el.classList.add('fade-el');
    io.observe(el);
});

/* ─── Nav scroll shadow ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Animated stat counters ─── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('.stat__num');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            statObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

/* ─── Add data-fade to all sections that should animate in ─── */
document.querySelectorAll(
    '.feature-card, .step, .testimonial, .section-header, .stat'
).forEach(el => el.setAttribute('data-fade', ''));

/* ─── Mobile menu (simplified toggle) ─── */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');
if (burger) {
    burger.addEventListener('click', () => {
        const open = navLinks.style.display === 'flex';
        navLinks.style.cssText = open
            ? ''
            : 'display:flex;flex-direction:column;position:fixed;top:64px;left:0;right:0;background:rgba(7,7,15,.97);backdrop-filter:blur(16px);padding:1.5rem;gap:1rem;border-bottom:1px solid rgba(255,255,255,.07);z-index:99;';
    });
    // close on link click
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinks.style.cssText = '';
    }));
}

/* ─── Phone carousel: auto-cycle every 3s ─── */
const slides = document.querySelectorAll('.phone-slide');
const dots = document.querySelectorAll('.phone-dot');
let current = 0;

function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

if (slides.length > 1) {
    setInterval(() => goToSlide(current + 1), 3000);
}
