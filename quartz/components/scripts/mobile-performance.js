// Improve interaction responsiveness
document.addEventListener('DOMContentLoaded', () => {
  // Use passive event listeners for touch events
  document.addEventListener('touchstart', () => {}, { passive: true });
  
  // Debounce expensive operations
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };
  
  // Apply to search and menu interactions
  const searchButton = document.querySelector('.search-button');
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  
  if (searchButton) {
    const originalClick = searchButton.onclick;
    searchButton.onclick = (e) => {
      // Immediate visual feedback
      searchButton.classList.add('active');
      // Delay the expensive operation
      setTimeout(() => {
        if (originalClick) originalClick.call(searchButton, e);
      }, 10);
    };
  }
  
  if (mobileMenuButton) {
    const originalClick = mobileMenuButton.onclick;
    mobileMenuButton.onclick = (e) => {
      // Immediate visual feedback
      mobileMenuButton.classList.toggle('active');
      // Delay the expensive operation
      setTimeout(() => {
        if (originalClick) originalClick.call(mobileMenuButton, e);
      }, 10);
    };
  }
}); 