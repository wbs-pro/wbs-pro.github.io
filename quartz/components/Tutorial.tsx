import { QuartzComponentConstructor } from "./types"

declare global {
  interface Window {
    introJs: () => {
      setOptions: (options: any) => any
      start: () => void
      onexit: (cb: () => void) => void
    }
  }
}

function Tutorial() {
  return null
}

Tutorial.css = /* css */ `
/* Base tooltip styles */
.introjs-tooltip {
  background-color: #ffffff !important;
  color: #1a1a1a !important;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  font-family: var(--bodyFont);
  max-width: 300px;
  padding: 15px;
  opacity: 1 !important;
  visibility: visible !important;
  position: absolute !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

[saved-theme="dark"] .introjs-tooltip {
  background-color: #2d333b !important;
  color: #e6edf3 !important;
  border-color: #444c56;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* Helper layer with 3px spacing */
.introjs-helperLayer {
  background: transparent !important;
  border: 2px solid var(--secondary) !important;
  box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin: -5px -3px -3px -5px !important;
  padding: 5px 3px 3px 5px !important;
  box-sizing: content-box !important;
}

[saved-theme="dark"] .introjs-helperLayer {
  box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.7) !important;
}

/* Hide helper layer for welcome step */
[data-step="0"] .introjs-helperLayer,
[data-step="0"] .introjs-tooltipReferenceLayer,
.introjs-helperLayer[data-step-number="1"],
.introjs-tooltipReferenceLayer[data-step-number="1"],
.introjs-helperLayer:first-of-type,
.introjs-tooltipReferenceLayer:first-of-type {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
}

/* Progress dots */
.introjs-bullets {
  margin: 15px 0;
}

.introjs-bullets ul {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

.introjs-bullets ul li {
  margin: 0 6px !important;
  padding: 0 !important;
}

.introjs-bullets ul li a {
  width: 8px !important;
  height: 8px !important;
  background: var(--lightgray) !important;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 0 !important;
  border: none !important;
  margin: 0 !important;
  display: block !important;
  transform-origin: left center !important;
}

[saved-theme="dark"] .introjs-bullets ul li a {
  background: var(--darkgray) !important;
}

.introjs-bullets ul li a.active {
  background: var(--secondary) !important;
  width: 24px !important;
  border-radius: 4px !important;
  transform-origin: left center !important;
}

/* Remove progress bar */
.introjs-progress,
.introjs-progressbar {
  display: none !important;
}

/* Button styling */
.introjs-button {
  font-family: var(--bodyFont);
  font-size: 0.9em;
  background-color: var(--bg) !important;
  color: var(--text) !important;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 6px 12px;
  margin: 4px;
  text-shadow: none !important;
  transition: all 0.2s ease;
}

.introjs-button:hover {
  background-color: var(--hover) !important;
  border-color: var(--secondary);
}

/* Button container */
.introjs-tooltipbuttons {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  text-align: right;
}

/* Rest of the styles remain the same... */
`

Tutorial.afterDOMLoaded = `
console.log('Tutorial script starting...');

function initTutorial() {
  const styleSheet = document.createElement('link');
  styleSheet.rel = 'stylesheet';
  styleSheet.href = 'https://unpkg.com/intro.js/minified/introjs.min.css';
  document.head.appendChild(styleSheet);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/intro.js/minified/intro.min.js';

  script.onload = () => {
    console.log('Intro.js script loaded');
    setupTutorial();
  };

  script.onerror = (e) => {
    console.error('Failed to load Intro.js:', e);
  };

  document.head.appendChild(script);
}

function setupTutorial() {
  if (typeof window.introJs === 'undefined') {
    console.error('Intro.js not loaded properly');
    return;
  }

  const isFirstVisit = () => {
    const visited = localStorage.getItem('quartzTutorialShown');
    return !visited;
  };

  const startTutorial = () => {
    console.log('Starting tutorial...');

    // Find elements (left side)
    const searchButton = document.querySelector('#search-button');
    const explorer = document.querySelector('#explorer');

    // Find elements (right side)
    const graphElement = document.querySelector('.graph');

    // Find buttons
    const darkmodeButton = document.querySelector('[aria-label="Toggle theme"]');
    const tutorialButton = document.querySelector('#start-tutorial');

    const intro = introJs();
    
    intro.setOptions({
      steps: [
        {
          title: '👋 Welcome',
          intro: 'Let me show you around this digital garden!'
        },
        {
          element: searchButton,
          title: '🔍 Search',
          intro: 'Quickly find any content using the search feature',
          position: 'bottom'
        },
        {
          element: explorer,
          title: '📁 Explorer',
          intro: 'Browse through all pages and folders here'
        },
        {
          element: graphElement,
          title: '⚛️ Graph View',
          intro: 'Visualize how pages are connected to each other',
          position: 'left'
        },
        {
          element: darkmodeButton,
          title: '🌙 Dark Mode',
          intro: 'Toggle between light and dark themes',
          position: 'bottom'
        },
        {
          element: tutorialButton,
          title: '🆘 Need Help?',
          intro: 'You can always click this button to revisit this tutorial!',
          position: 'bottom'
        }
      ].filter(step => !step.element || step.element instanceof Element),
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: false,
      helperElementPadding: 8,
      tooltipPosition: 'auto',
      positionPrecedence: ['bottom', 'top', 'right', 'left'],
      showStepNumbers: false,
      keyboardNavigation: true,
      showButtons: true,
      doneLabel: 'Got it!',
      nextLabel: 'Next →',
      prevLabel: '← Back',
      overlayOpacity: 0.5,
      scrollTo: false,
      scrollToElement: false,
      hideNext: false,
      hidePrev: false
    });

    document.body.classList.add('introjs-open');

    intro.onexit(() => {
      document.body.classList.remove('introjs-open');
      localStorage.setItem('quartzTutorialShown', 'true');
    });

    intro.start();
  };

  if (isFirstVisit()) {
    console.log('First visit detected, waiting for DOM...');
    if (document.readyState === 'complete') {
      setTimeout(startTutorial, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(startTutorial, 500);
      });
    }
  }

  const tutorialTrigger = document.getElementById('start-tutorial');
  if (tutorialTrigger) {
    tutorialTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      startTutorial();
    });
  }

  // Ensure tooltip stays visible during transitions
  const maintainTooltip = () => {
    const tooltip = document.querySelector('.introjs-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.display = 'block';
    }
  };

  // Add event listeners for all transition points
  intro.onbeforechange(maintainTooltip);
  intro.onchange(maintainTooltip);
  intro.onafterchange(maintainTooltip);

  // Additional transition handling
  document.addEventListener('introjs:beforechange', maintainTooltip);
  document.addEventListener('introjs:afterchange', maintainTooltip);

  // Mutation observer to ensure tooltip stays visible
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      maintainTooltip();
    });
  });

  intro.start();

  // Start observing once tutorial begins
  const tooltipContainer = document.querySelector('.introjs-tooltipReferenceLayer');
  if (tooltipContainer) {
    observer.observe(tooltipContainer, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  // Cleanup
  intro.onexit(() => {
    observer.disconnect();
  });
}

document.addEventListener('nav', () => {
  console.log('Nav event detected, initializing tutorial...');
  initTutorial();
});

initTutorial();
`

export default (() => {
  return Tutorial
}) satisfies QuartzComponentConstructor