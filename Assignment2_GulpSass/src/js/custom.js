$('a[href*="#"]').click(function(e) {
  e.preventDefault();
  const target = $(this.hash)[0];
  console.log('Clicked:', target);
  target.scrollIntoView({
    behavior: 'smooth'
  });
  setTimeout(() => target.focus(), 100);
});

particlesJS.load('particles', '/assets/particles.json', () => {
  console.log('Particles.js Config Loaded');
});
