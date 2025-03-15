// Prevent graph initialization on mobile devices
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  if (isMobile) {
    // Add class to document for CSS targeting
    document.documentElement.classList.add('is-mobile-device');
    
    // Hide graph elements
    const graphElements = document.querySelectorAll('.graph, .graph-outer, #graph-container, #global-graph-container');
    graphElements.forEach(el => {
      if (el) el.style.display = 'none';
    });
    
    // Prevent graph script from running
    window.skipGraphInitialization = true;
    
    // Add alternative navigation if not already present
    if (!document.querySelector('.mobile-nav-alternative')) {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav-alternative';
        mobileNav.innerHTML = '<h3>Navigation</h3><p>Graph view is disabled on mobile for better performance.</p>';
        mainContent.prepend(mobileNav);
      }
    }
    
    console.log('Mobile device detected: Graph view disabled for better performance');
  }
}); 