/**
 * Optimizations for pointer interactions to improve INP metrics
 */

interface TouchTarget {
  element: HTMLElement;
  originalSize: { width: number; height: number };
}

class InteractionOptimizer {
  private static instance: InteractionOptimizer;
  private touchTargets: Map<string, TouchTarget> = new Map();
  private readonly minTouchTargetSize = 48; // Minimum size in pixels for touch targets
  private intersectionObserver: IntersectionObserver;
  private deferredElements: Set<Element> = new Set();
  
  private constructor() {
    // Initialize intersection observer for deferred loading
    this.intersectionObserver = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { rootMargin: '50px' }
    );
    
    // Initialize performance observer for INP monitoring
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'interaction' && entry.duration > 200) {
            console.warn(`High latency interaction detected: ${entry.duration}ms`, entry);
            this.optimizeInteraction(entry);
          }
        }
      });
      
      try {
        perfObserver.observe({ entryTypes: ['interaction'] });
      } catch (e) {
        console.warn('PerformanceObserver for INP not supported');
      }
    }
  }

  public static getInstance(): InteractionOptimizer {
    if (!InteractionOptimizer.instance) {
      InteractionOptimizer.instance = new InteractionOptimizer();
    }
    return InteractionOptimizer.instance;
  }

  public initialize() {
    this.setupEventDelegation();
    this.optimizeTouchTargets();
    this.deferNonCriticalInteractions();
    this.setupIntersectionObserver();
  }

  private setupEventDelegation() {
    // Use event delegation for common interactions
    document.addEventListener('click', this.handleClick, { passive: true });
    document.addEventListener('touchstart', this.handleTouch, { passive: true });
    document.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
  }

  private handleClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.matches('.mobile-tag, .result-card, .mobile-nav-alternative a')) {
      // Pre-fetch content for faster navigation
      const href = target.getAttribute('href');
      if (href) {
        this.prefetchContent(href);
      }
    }
  };

  private handleTouch = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('button, a, [role="button"]')) {
      this.provideTouchFeedback(target);
    }
  };

  private handlePointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    // Add touch action hints
    if (target.matches('.scroll-container')) {
      target.style.touchAction = 'pan-y';
    }
  };

  private optimizeTouchTargets() {
    // Find all interactive elements
    const interactiveElements = document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], input, select, textarea'
    );

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const id = element.id || element.getAttribute('data-id') || crypto.randomUUID();
      
      // Store original size
      this.touchTargets.set(id, {
        element,
        originalSize: { width: rect.width, height: rect.height }
      });

      // Ensure minimum touch target size
      if (rect.width < this.minTouchTargetSize || rect.height < this.minTouchTargetSize) {
        element.style.minWidth = this.minTouchTargetSize + 'px';
        element.style.minHeight = this.minTouchTargetSize + 'px';
        
        // If the element is an icon or small button, use padding instead
        if (element.matches('.icon-button, .small-button')) {
          element.style.padding = '12px';
        }
      }
    });
  }

  private deferNonCriticalInteractions() {
    // Find elements that can be deferred
    const deferCandidates = document.querySelectorAll(
      '.mobile-tag-list, .recent-pages, .graph-view'
    );
    
    deferCandidates.forEach(element => {
      this.deferredElements.add(element);
      this.intersectionObserver.observe(element);
      element.setAttribute('data-deferred', 'true');
    });
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting && this.deferredElements.has(entry.target)) {
        this.enableInteractions(entry.target);
        this.deferredElements.delete(entry.target);
        this.intersectionObserver.unobserve(entry.target);
      }
    });
  }

  private enableInteractions(element: Element) {
    element.removeAttribute('data-deferred');
    // Enable any deferred event listeners
    const listeners = element.getAttribute('data-listeners');
    if (listeners) {
      const parsedListeners = JSON.parse(listeners);
      parsedListeners.forEach(({ type, handler }: { type: string; handler: string }) => {
        element.addEventListener(type, new Function(handler) as EventListener, { passive: true });
      });
    }
  }

  private optimizeInteraction(entry: PerformanceEntry) {
    // Implement specific optimizations based on interaction patterns
    if ('target' in entry && entry.target instanceof Element) {
      const target = entry.target;
      
      // Check if this is a frequently interacted element
      const interactionCount = parseInt(target.getAttribute('data-interaction-count') || '0');
      target.setAttribute('data-interaction-count', (interactionCount + 1).toString());
      
      if (interactionCount > 5) {
        // Element is frequently used, apply optimizations
        this.optimizeFrequentTarget(target);
      }
    }
  }

  private optimizeFrequentTarget(target: Element) {
    // Apply optimizations for frequently used elements
    if (target.matches('.mobile-tag, .result-card')) {
      // Use transform instead of layout-triggering properties
      target.classList.add('hardware-accelerated');
      
      // Pre-connect to common destinations
      const href = target.getAttribute('href');
      if (href) {
        this.preconnectToDestination(href);
      }
    }
  }

  private provideTouchFeedback(target: HTMLElement) {
    // Add touch feedback without triggering layout
    target.style.transform = 'scale(0.98)';
    target.style.transition = 'transform 100ms';
    
    setTimeout(() => {
      target.style.transform = '';
    }, 100);
  }

  private async prefetchContent(href: string) {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    } catch (e) {
      console.warn('Prefetch failed:', e);
    }
  }

  private preconnectToDestination(href: string) {
    try {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = new URL(href, window.location.href).origin;
      document.head.appendChild(link);
    } catch (e) {
      console.warn('Preconnect failed:', e);
    }
  }

  private setupIntersectionObserver() {
    // Observe elements that might need optimization when they come into view
    const targets = document.querySelectorAll('.mobile-nav-alternative, .mobile-tag-list');
    targets.forEach(target => this.intersectionObserver.observe(target));
  }
}

// Initialize the optimizer when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const optimizer = InteractionOptimizer.getInstance();
  optimizer.initialize();
});

// Re-run optimizations after dynamic content updates
document.addEventListener('nav', () => {
  const optimizer = InteractionOptimizer.getInstance();
  optimizer.initialize();
});

// Export the optimizer instance
export const interactionOptimizer = InteractionOptimizer.getInstance();
