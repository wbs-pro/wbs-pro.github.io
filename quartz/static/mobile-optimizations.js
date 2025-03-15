/**
 * Mobile-specific optimizations to prevent memory leaks and improve performance
 */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  if (!isMobile) return;
  
  // Apply mobile-specific optimizations
  applyMobileOptimizations();
  
  // Set up periodic cleanup for long browsing sessions
  setupPeriodicCleanup();
  
  // Monitor for memory issues
  setupMemoryMonitoring();
});

/**
 * Apply various optimizations for mobile devices
 */
function applyMobileOptimizations() {
  // Use passive event listeners for all touch events
  const passiveEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  passiveEvents.forEach(eventName => {
    document.addEventListener(eventName, () => {}, { passive: true });
  });
  
  // Optimize images for mobile
  optimizeImages();
  
  // Reduce animation complexity on mobile
  reduceAnimations();
  
  // Defer non-critical resources
  deferNonCriticalResources();
  
  // Optimize scroll performance
  optimizeScrolling();
}

/**
 * Optimize images by setting loading="lazy" and reducing quality for mobile
 */
function optimizeImages() {
  // Add lazy loading to all images
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
}

/**
 * Reduce animations complexity on mobile devices
 */
function reduceAnimations() {
  // Add a class to the body to allow CSS to reduce animations
  document.body.classList.add('reduce-motion');
  
  // Find and disable heavy animations
  const heavyAnimations = document.querySelectorAll('.animation-heavy, .parallax, .transition-complex');
  heavyAnimations.forEach(el => {
    el.classList.add('animation-reduced');
  });
}

/**
 * Defer loading of non-critical resources
 */
function deferNonCriticalResources() {
  // Identify non-critical scripts that can be deferred
  const nonCriticalSelectors = [
    'script[data-defer="true"]',
    'link[rel="stylesheet"][data-defer="true"]',
  ];
  
  const nonCriticalResources = document.querySelectorAll(nonCriticalSelectors.join(','));
  nonCriticalResources.forEach(resource => {
    // Mark as deferred for mobile
    resource.setAttribute('data-mobile-deferred', 'true');
    
    // For stylesheets, set media to 'print' and then switch back after load
    if (resource.tagName === 'LINK' && resource.getAttribute('rel') === 'stylesheet') {
      resource.setAttribute('media', 'print');
      setTimeout(() => {
        resource.setAttribute('media', 'all');
      }, 2000); // Load after 2 seconds
    }
  });
}

/**
 * Optimize scrolling performance on mobile
 */
function optimizeScrolling() {
  // Use IntersectionObserver for scroll-based operations
  const scrollItems = document.querySelectorAll('.scroll-animate, .lazy-load');
  
  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
          scrollObserver.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, { rootMargin: '100px' });
    
    scrollItems.forEach(item => scrollObserver.observe(item));
  } else {
    // Fallback for browsers without IntersectionObserver
    scrollItems.forEach(item => item.classList.add('in-viewport'));
  }
}

/**
 * Set up periodic cleanup to prevent memory leaks during long browsing sessions
 */
function setupPeriodicCleanup() {
  // Run cleanup every 2 minutes
  setInterval(() => {
    // Clear any caches that might be growing
    clearCaches();
    
    // Force garbage collection hint (not guaranteed but might help)
    forceGarbageCollectionHint();
  }, 2 * 60 * 1000);
}

/**
 * Clear various caches that might accumulate during browsing
 */
function clearCaches() {
  // Clear any custom caches we might have
  if (window.clearSearchCache) {
    window.clearSearchCache();
  }
  
  // Clear any event listeners that might have been duplicated
  if (window.cleanupEventListeners) {
    window.cleanupEventListeners();
  }
  
  // Clear any references to removed DOM elements
  const removedElements = document.querySelectorAll('.removed, .hidden');
  removedElements.forEach(el => {
    // Remove all child nodes to help garbage collection
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  });
}

/**
 * Try to hint to the browser that it's a good time for garbage collection
 * This is not guaranteed to work but doesn't hurt to try
 */
function forceGarbageCollectionHint() {
  // Create and remove a large object
  let largeObject = new Array(10000).fill(new Array(100).fill('gc-hint'));
  largeObject = null;
  
  // Run any cleanup functions registered by components
  if (typeof window.addCleanup === 'function' && typeof window.runCleanup === 'function') {
    window.runCleanup();
  }
}

/**
 * Set up monitoring for potential memory issues
 */
function setupMemoryMonitoring() {
  // Monitor page performance
  let lastActionTime = Date.now();
  let freezeCount = 0;
  
  // Check for UI freezes every 2 seconds
  setInterval(() => {
    const now = Date.now();
    const timeSinceLastAction = now - lastActionTime;
    
    // If more than 5 seconds have passed since last action, might be a freeze
    if (timeSinceLastAction > 5000) {
      freezeCount++;
      console.warn(`Potential UI freeze detected: ${timeSinceLastAction}ms without response`);
      
      // If we detect multiple freezes, try emergency cleanup
      if (freezeCount > 3) {
        console.warn('Multiple UI freezes detected, performing emergency cleanup');
        emergencyCleanup();
        freezeCount = 0;
      }
    }
    
    lastActionTime = now;
  }, 2000);
  
  // Reset freeze detection on user interaction
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, () => {
      lastActionTime = Date.now();
      freezeCount = 0;
    }, { passive: true });
  });
}

/**
 * Emergency cleanup when serious performance issues are detected
 */
function emergencyCleanup() {
  // Clear all caches
  clearCaches();
  
  // Remove heavy elements temporarily
  const heavyElements = document.querySelectorAll('.graph, .heavy-component, .animation-complex');
  heavyElements.forEach(el => {
    el.style.display = 'none';
    setTimeout(() => {
      el.style.display = '';
    }, 5000); // Restore after 5 seconds
  });
  
  // Force cleanup of event listeners
  if (window.cleanupEventListeners) {
    window.cleanupEventListeners();
  }
  
  // Add a global flag to indicate emergency cleanup was performed
  window.emergencyCleanupPerformed = true;
  
  // Show a brief message to the user
  const message = document.createElement('div');
  message.className = 'emergency-cleanup-message';
  message.textContent = 'Optimizing performance...';
  message.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#333;color:#fff;padding:8px 12px;border-radius:4px;z-index:9999;opacity:0.9;';
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 3000);
}
