console.log("ScrollToTop script loaded");

const scrollToTop = () => {
  console.log("Scrolling to top");
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleScroll = () => {
  console.log("Handling scroll");
  const scrollToTopButton = document.getElementById('scroll-to-top');
  if (scrollToTopButton) {
    console.log("Current scroll position:", window.scrollY);
    if (window.scrollY > 300) {
      scrollToTopButton.classList.add('visible');
      console.log("Button should be visible");
    } else {
      scrollToTopButton.classList.remove('visible');
      console.log("Button should be hidden");
    }
  } else {
    console.error("Scroll to top button not found in handleScroll");
  }
};

const setupScrollToTop = () => {
  console.log("Setting up ScrollToTop");
  const scrollToTopButton = document.getElementById('scroll-to-top');
  if (scrollToTopButton) {
    console.log("Scroll to top button found");
    
    // Create named handler functions so we can remove them later
    const clickHandler = (e: Event) => {
      console.log("Button clicked");
      e.preventDefault();
      scrollToTop();
    };
    
    const scrollHandler = () => handleScroll();
    
    scrollToTopButton.addEventListener('click', clickHandler);
    window.addEventListener('scroll', scrollHandler);
    
    // Add cleanup function
    window.addCleanup(() => {
      scrollToTopButton.removeEventListener('click', clickHandler);
      window.removeEventListener('scroll', scrollHandler);
    });
    
    // Initial check for button visibility
    handleScroll();
  } else {
    console.error("Scroll to top button not found in setupScrollToTop");
  }
};

// Run setup on navigation events
document.addEventListener('nav', () => {
  console.log("Navigation event detected, running setupScrollToTop");
  setupScrollToTop();
});