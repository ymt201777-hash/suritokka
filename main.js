// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
  menuToggle.classList.toggle('is-active');
});

// Close menu on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.classList.remove('is-active');
  });
});

// Fade-in on scroll (Intersection Observer)
const targets = document.querySelectorAll(
  '.section-label, .section-title, .about-body p, .feature-card, .course-card, .access-info, .booking-desc, .form-wrap'
);

targets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

targets.forEach(el => observer.observe(el));

// Booking form submission
const form = document.getElementById('bookingForm');
const successMsg = document.getElementById('successMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  });
}
