const timeline = document.querySelector('.timeline');
const milestones = [...document.querySelectorAll('.milestone')];
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateProgress() {
  const isMobile = window.matchMedia('(max-width: 700px)').matches;
  const available = isMobile ? timeline.offsetHeight - window.innerHeight : timeline.scrollWidth - timeline.clientWidth;
  const position = isMobile ? window.scrollY - timeline.offsetTop + 120 : timeline.scrollLeft;
  const amount = available > 0 ? position / available : 1;
  root.style.setProperty('--progress', `${Math.min(100, Math.max(8, amount * 100))}%`);
}

timeline.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });

document.querySelectorAll('.timeline-button').forEach((button) => {
  button.addEventListener('click', () => {
    const distance = milestones[0].getBoundingClientRect().width + 24;
    timeline.scrollBy({ left: Number(button.dataset.direction) * distance, behavior: 'smooth' });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('active', entry.isIntersecting);
    if (entry.isIntersecting && !reduceMotion) entry.target.classList.add('revealed');
  });
}, { root: timeline, threshold: .65 });
milestones.forEach((milestone) => observer.observe(milestone));
if (!reduceMotion) {
  const revealElements = [...document.querySelectorAll('.impact-feature, .fact, .impact-pillars article, .processor-rollcall')];
  revealElements.forEach((element) => element.classList.add('reveal-ready'));
  const revealObserver = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: .15 });
  revealElements.forEach((element) => revealObserver.observe(element));
}
updateProgress();
