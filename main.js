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

/* ─── Mobile menu ─── */
const burger = document.getElementById('burger');
const navEl = document.getElementById('nav');
const navLinks = document.querySelector('.nav__links');

function closeNav() {
    navEl.classList.remove('nav--open');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
}

if (burger) {
    burger.addEventListener('click', () => {
        const opening = !navEl.classList.contains('nav--open');
        navEl.classList.toggle('nav--open', opening);
        document.body.classList.toggle('menu-open', opening);
        burger.setAttribute('aria-expanded', String(opening));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('click', e => {
        if (navEl.classList.contains('nav--open') && !navEl.contains(e.target)) closeNav();
    });
}

/* ─── Mobile sticky CTA ─── */
const mobileCta = document.getElementById('mobileCta');
if (mobileCta) {
    const heroCta = document.querySelector('.hero__cta');
    const update = () => {
        if (!heroCta) { mobileCta.classList.add('visible'); return; }
        mobileCta.classList.toggle('visible', heroCta.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
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
