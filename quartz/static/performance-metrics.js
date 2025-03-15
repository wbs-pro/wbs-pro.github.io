/**
 * Performance metrics optimization script
 * Focuses on improving CLS and INP metrics for mobile devices
 */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  if (!isMobile) return;
  
  // Apply CLS optimizations
  reduceCLS();
  
  // Apply INP optimizations
  improveINP();
  
  // Monitor metrics for debugging
  if (window.PerformanceObserver) {
    monitorMetrics();
  }
});

/**
 * Reduce Cumulative Layout Shift
 */
function reduceCLS() {
  // 1. Reserve space for images and dynamic content
  reserveSpaceForImages();
  reserveSpaceForDynamicContent();
  
  // 2. Optimize font loading
  optimizeFontLoading();
  
  // 3. Prevent content jumping during load
  preventContentJumping();
}

/**
 * Improve Interaction to Next Paint metric
 */
function improveINP() {
  // 1. Optimize event handlers
  optimizeEventHandlers();
  
  // 2. Debounce scroll and resize events
  debounceHeavyEvents();
  
  // 3. Use requestAnimationFrame for visual updates
  optimizeVisualUpdates();
  
  // 4. Break up long tasks
  breakUpLongTasks();
}

/**
 * Reserve space for images to prevent layout shifts
 */
function reserveSpaceForImages() {
  // Find all images without explicit dimensions
  const images = document.querySelectorAll('img:not([width]):not([height])');
  
  images.forEach(img => {
    // Set a default aspect ratio container
    const wrapper = document.createElement('div');
    wrapper.className = 'image-aspect-ratio-container';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    
    // Use a default aspect ratio of 16:9 if unknown
    const aspectRatio = img.getAttribute('data-aspect-ratio') || '56.25%'; // 9/16 * 100
    wrapper.style.paddingBottom = aspectRatio;
    
    // Style the image to fill the container
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    
    // Replace the image with the wrapper containing the image
    if (img.parentNode) {
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }
  });
  
  // Add event listener to update aspect ratio once image loads
  document.addEventListener('load', (event) => {
    if (event.target instanceof HTMLImageElement) {
      const img = event.target;
      const wrapper = img.closest('.image-aspect-ratio-container');
      
      if (wrapper && img.naturalWidth && img.naturalHeight) {
        const aspectRatio = (img.naturalHeight / img.naturalWidth * 100) + '%';
        wrapper.style.paddingBottom = aspectRatio;
      }
    }
  }, { capture: true, passive: true });
}

/**
 * Reserve space for dynamic content to prevent layout shifts
 */
function reserveSpaceForDynamicContent() {
  // Find all dynamic content containers
  const dynamicContainers = document.querySelectorAll('.dynamic-content, [data-dynamic="true"]');
  
  dynamicContainers.forEach(container => {
    // Set min-height based on data attribute or default
    const minHeight = container.getAttribute('data-min-height') || '100px';
    container.style.minHeight = minHeight;
  });
  
  // Handle search results container specifically
  const searchResults = document.getElementById('results-container');
  if (searchResults) {
    searchResults.style.minHeight = '150px';
  }
  
  // Handle explorer container
  const explorer = document.querySelector('.explorer');
  if (explorer) {
    explorer.style.minHeight = '200px';
  }
}

/**
 * Optimize font loading to prevent text reflow
 */
function optimizeFontLoading() {
  // Add font-display: swap to all fonts
  const styleSheets = document.styleSheets;
  
  try {
    for (let i = 0; i < styleSheets.length; i++) {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (!rules) continue;
      
      for (let j = 0; j < rules.length; j++) {
        if (rules[j].type === 5) { // CSSRule.FONT_FACE_RULE
          const rule = rules[j];
          if (rule.style && !rule.style.fontDisplay) {
            rule.style.fontDisplay = 'swap';
          }
        }
      }
    }
  } catch (e) {
    // CORS restrictions may prevent accessing some stylesheets
    console.warn('Could not modify all font rules due to CORS', e);
  }
  
  // Add font-display: swap to inline styles
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
  
  // Add class to body to enable font optimization CSS
  document.body.classList.add('fonts-optimized');
}

/**
 * Prevent content jumping during page load
 */
function preventContentJumping() {
  // Lock the scroll position during critical rendering
  const scrollY = window.scrollY;
  
  // Add a style to prevent scroll jumps
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      scroll-behavior: auto !important;
      overflow-anchor: none !important;
    }
    
    /* Prevent height changes in these elements */
    .header, .footer, .sidebar, .explorer {
      contain: layout size !important;
    }
    
    /* Add content-visibility to off-screen content */
    .content-block:not(:first-child) {
      content-visibility: auto;
      contain-intrinsic-size: 0 500px;
    }
  `;
  document.head.appendChild(style);
  
  // Remove the style after initial render
  setTimeout(() => {
    style.remove();
    window.scrollTo(0, scrollY);
  }, 500);
}

/**
 * Optimize event handlers for better INP
 */
function optimizeEventHandlers() {
  // Find all click handlers and optimize them
  const clickableElements = document.querySelectorAll('a, button, [role="button"], input, .clickable');
  
  clickableElements.forEach(element => {
    // Add visual feedback immediately on click
    element.addEventListener('click', (e) => {
      // Add a visual indicator class
      element.classList.add('interaction-feedback');
      
      // Remove it after animation completes
      setTimeout(() => {
        element.classList.remove('interaction-feedback');
      }, 300);
    }, { passive: true });
  });
  
  // Add a global style for immediate feedback
  const style = document.createElement('style');
  style.textContent = `
    .interaction-feedback {
      transform: scale(0.98);
      transition: transform 100ms ease;
    }
    
    /* Ensure all interactive elements have a pointer cursor */
    a, button, [role="button"], input[type="submit"], input[type="button"], .clickable {
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Debounce scroll and resize events
 */
function debounceHeavyEvents() {
  // Replace scroll handlers with passive ones
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'scroll' || type === 'touchmove') {
      // Force passive for these events
      const newOptions = options || {};
      if (typeof newOptions === 'object') {
        newOptions.passive = true;
      } else {
        options = { passive: true };
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Debounce resize handlers
  let resizeTimeout;
  const originalResize = window.onresize;
  window.onresize = function(e) {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (originalResize) originalResize.call(window, e);
    }, 100);
  };
}

/**
 * Use requestAnimationFrame for visual updates
 */
function optimizeVisualUpdates() {
  // Create a global RAF scheduler
  window.rafScheduler = function(callback) {
    return window.requestAnimationFrame(callback);
  };
  
  // Patch DOM methods that cause layout shifts
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(child) {
    if (this.isConnected && child.nodeType === Node.ELEMENT_NODE) {
      return window.rafScheduler(() => originalAppendChild.call(this, child));
    }
    return originalAppendChild.call(this, child);
  };
  
  // Optimize classList changes that trigger repaints
  const originalToggle = DOMTokenList.prototype.toggle;
  DOMTokenList.prototype.toggle = function(token, force) {
    const element = this._element;
    if (element && element.isConnected && 
        (token === 'active' || token === 'open' || token === 'visible')) {
      return window.rafScheduler(() => originalToggle.call(this, token, force));
    }
    return originalToggle.call(this, token, force);
  };
}

/**
 * Break up long tasks to improve INP
 */
function breakUpLongTasks() {
  // Add yield points to long operations
  window.yieldToMain = function() {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  };
  
  // Add a helper for processing large arrays
  window.processInChunks = async function(items, processFn, chunkSize = 5) {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      // Process this chunk
      chunk.forEach(processFn);
      // Yield to main thread
      if (i + chunkSize < items.length) {
        await window.yieldToMain();
      }
    }
  };
  
  // Patch search functions to use chunking
  if (window.fillDocument) {
    const originalFillDocument = window.fillDocument;
    window.fillDocument = async function(data) {
      const entries = Object.entries(data);
      const results = [];
      
      await window.processInChunks(entries, ([slug, fileData]) => {
        // Process each entry
        results.push(originalFillDocument.processEntry(slug, fileData));
      });
      
      return Promise.all(results);
    };
  }
}

/**
 * Monitor CLS and INP metrics for debugging
 */
function monitorMetrics() {
  // Monitor CLS
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log(`CLS update: ${clsValue.toFixed(3)}`, entry);
      }
    }
  });
  
  clsObserver.observe({ type: 'layout-shift', buffered: true });
  
  // Monitor INP (using First Input Delay as a proxy since INP is newer)
  const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log(`Input delay: ${entry.processingStart - entry.startTime}ms`, entry);
    }
  });
  
  fidObserver.observe({ type: 'first-input', buffered: true });
  
  // Monitor long tasks
  const longtaskObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log(`Long task detected: ${entry.duration}ms`, entry);
    }
  });
  
  longtaskObserver.observe({ type: 'longtask', buffered: true });
}
