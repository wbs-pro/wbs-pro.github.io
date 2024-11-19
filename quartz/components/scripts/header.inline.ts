document.addEventListener('DOMContentLoaded', () => {
  let lastScrollY = window.scrollY;
  let ticking = false;

  const handleScroll = () => {
    const header = document.querySelector('.left.sidebar');
    if (!header || window.innerWidth > 750) return; // Only run on mobile

    // Show header when scrolling up, hide when scrolling down
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    
    lastScrollY = window.scrollY;
    ticking = false;
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});

// Also handle navigation events
document.addEventListener('nav', () => {
  const header = document.querySelector('.left.sidebar');
  if (header) {
    header.classList.remove('header-hidden');
  }
}); 