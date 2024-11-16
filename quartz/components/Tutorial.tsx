import { QuartzComponentConstructor } from "./types"

declare global {
  interface Window {
    introJs: () => IntroJs
  }
}

interface IntroJs {
  setOptions: (options: IntroJsOptions) => IntroJs
  start: () => void
  onexit: (cb: () => void) => void
  onafterchange: (cb: () => void) => void
  previousStep: () => void
}

interface IntroJsOptions {
  steps: IntroStep[]
  showProgress: boolean
  showBullets: boolean
  exitOnOverlayClick: boolean
  exitOnEsc: boolean
  disableInteraction: boolean
  helperElementPadding: number
  tooltipPosition: string
  positionPrecedence: string[]
  showStepNumbers: boolean
  keyboardNavigation: boolean
  scrollTo: boolean | string
  scrollToElement: boolean
  doneLabel: string
  nextLabel: string
  prevLabel: string
  overlayOpacity: number
  tooltipOffset: number
}

interface IntroStep {
  title: string
  intro: string
  element?: Element
  position?: string
}

function Tutorial() {
  return null
}

Tutorial.css = /* css */ `
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
}

.introjs-bullets ul li a.active {
  background: var(--secondary) !important;
  width: 24px !important;
  border-radius: 4px !important;
}

.introjs-button {
  font-family: var(--bodyFont);
  font-size: 0.9em;
  background-color: var(--lightgray) !important;
  color: var(--dark) !important;
  border: 1px solid var(--lightgray) !important;
  border-radius: 4px;
  padding: 6px 12px;
  margin: 4px;
  text-shadow: none !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

.introjs-button:hover {
  background-color: var(--secondary) !important;
  color: var(--light) !important;
  border-color: var(--secondary) !important;
}

.introjs-tooltipbuttons {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  text-align: right;
}

body.introjs-open {
  overflow: hidden;
}

.introjs-overlay {
  z-index: 1000 !important;
}

.introjs-helperLayer,
.introjs-tooltipReferenceLayer {
  z-index: 1001 !important;
}

.introjs-tooltip {
  z-index: 1002 !important;
}
`

Tutorial.afterDOMLoaded = `
const TUTORIAL_STORAGE_KEY = 'quartzTutorialShown';
const INTRO_CSS_URL = 'https://unpkg.com/intro.js/minified/introjs.min.css';
const INTRO_JS_URL = 'https://unpkg.com/intro.js/minified/intro.min.js';

function loadResources() {
  const styleSheet = document.createElement('link');
  styleSheet.rel = 'stylesheet';
  styleSheet.href = INTRO_CSS_URL;
  document.head.appendChild(styleSheet);

  const script = document.createElement('script');
  script.src = INTRO_JS_URL;
  script.onload = setupTutorial;
  document.head.appendChild(script);
}

function setupTutorial() {
  if (typeof window.introJs === 'undefined') return;

  const isMobile = window.innerWidth <= 768;
  
  const elements = {
    searchButton: document.querySelector('.search-button'),
    explorer: document.querySelector('#explorer'),
    graphElement: document.querySelector('.graph'),
    darkmodeButton: document.querySelector('.darkmode'),
    tutorialButton: document.querySelector('#start-tutorial')
  };

  const desktopSteps = [
    {
      title: '👋 Welcome',
      intro: 'Let me show you around this digital garden!',
      position: 'center'
    },
    {
      element: elements.searchButton,
      title: '🔍 Search',
      intro: 'Quickly find any content using the search feature',
      position: 'bottom'
    },
    {
      element: elements.explorer,
      title: '📂 Explorer',
      intro: 'Browse through all pages and folders here',
      position: 'right'
    },
    {
      element: elements.graphElement,
      title: '📊 Graph View',
      intro: 'Visualize how pages are connected to each other',
      position: 'auto'
    },
    {
      element: elements.darkmodeButton,
      title: '💡 Theme',
      intro: 'Toggle between light and dark themes',
      position: 'bottom'
    },
    {
      element: elements.tutorialButton,
      title: '❓ Help',
      intro: 'You can always click this button to revisit this tutorial!',
      position: 'bottom'
    }
  ].filter(step => step.element || !step.element);

  const mobileSteps = [
    {
      title: '👋 Welcome',
      intro: 'Let me show you around this digital garden!',
      position: 'center'
    },
    {
      element: elements.searchButton,
      title: '🔍 Search',
      intro: 'Quickly find any content using the search feature',
      position: 'bottom'
    },
    {
      element: elements.explorer,
      title: '📂 Explorer',
      intro: 'Tap here to open the navigation menu',
      position: 'bottom'
    },
    {
      element: elements.darkmodeButton,
      title: '💡 Theme',
      intro: 'Toggle between light and dark themes',
      position: 'bottom'
    },
    {
      element: elements.tutorialButton,
      title: '❓ Help',
      intro: 'Tap here to see this tutorial again',
      position: 'bottom'
    }
  ].filter(step => step.element || !step.element);

  const steps = isMobile ? mobileSteps : desktopSteps;
  
  const intro = window.introJs();
  
  intro.setOptions({
    steps: steps.filter(step => !step.element || document.contains(step.element)),
    showProgress: false,
    showBullets: true,
    exitOnOverlayClick: false,
    exitOnEsc: true,
    disableInteraction: true,
    helperElementPadding: 8,
    tooltipPosition: 'auto',
    positionPrecedence: ['bottom', 'top', 'right', 'left'],
    showStepNumbers: false,
    keyboardNavigation: true,
    scrollTo: false,
    scrollToElement: false,
    doneLabel: 'Got it!',
    nextLabel: 'Next →',
    prevLabel: '← Back',
    overlayOpacity: 0.5,
    tooltipOffset: 10
  });

  intro.onafterchange(function() {
    const currentStep = this._currentStep;
    const currentElement = this._introItems[currentStep].element;
    
    if (currentElement) {
      const rect = currentElement.getBoundingClientRect();
      const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
      
      if (!isVisible) {
        currentElement.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'smooth'
        });
      }
    }
    
    const prevButton = document.querySelector('.introjs-prevbutton');
    if (!prevButton) return;

    if (this._currentStep === 0) {
      prevButton.textContent = 'Exit';
      const newButton = prevButton.cloneNode(true);
      prevButton.parentNode.replaceChild(newButton, prevButton);
      newButton.addEventListener('click', () => intro.exit());
    } else {
      prevButton.textContent = '← Back';
      const newButton = prevButton.cloneNode(true);
      prevButton.parentNode.replaceChild(newButton, prevButton);
      newButton.addEventListener('click', () => intro.previousStep());
    }
  });

  intro.onexit(() => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  });

  const tutorialButton = document.getElementById('start-tutorial');
  if (tutorialButton) {
    tutorialButton.addEventListener('click', (e) => {
      e.preventDefault();
      intro.start();
    });
  }

  // Only start automatically if tutorial hasn't been shown before
  if (!localStorage.getItem(TUTORIAL_STORAGE_KEY)) {
    intro.start();
  }
}

document.addEventListener('nav', () => {
  // Remove any existing tutorial resources
  const existingStylesheet = document.querySelector('link[href="' + INTRO_CSS_URL + '"]');
  if (existingStylesheet) existingStylesheet.remove();
  
  const existingScript = document.querySelector('script[src="' + INTRO_JS_URL + '"]');
  if (existingScript) existingScript.remove();
  
  loadResources();
});
`

export default (() => {
  return Tutorial
}) satisfies QuartzComponentConstructor