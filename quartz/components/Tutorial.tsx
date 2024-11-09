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

  const elements = {
    searchButton: document.querySelector('#search-button'),
    explorer: document.querySelector('#explorer'),
    graphElement: document.querySelector('.graph'),
    darkmodeButton: document.querySelector('[aria-label="Toggle theme"]'),
    tutorialButton: document.querySelector('#start-tutorial')
  };

  function maintainTooltip() {
    const tooltip = document.querySelector('.introjs-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    }
  }

  function startTutorial() {
    const intro = window.introJs();
    
    const steps = [
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
        title: '📁 Explorer',
        intro: 'Browse through all pages and folders here'
      },
      {
        element: elements.graphElement,
        title: '⚛️ Graph View',
        intro: 'Visualize how pages are connected to each other',
        position: 'left'
      },
      {
        element: elements.darkmodeButton,
        title: '🌙 Dark Mode',
        intro: 'Toggle between light and dark themes',
        position: 'bottom'
      },
      {
        element: elements.tutorialButton,
        title: '🆘 Need Help?',
        intro: 'You can always click this button to revisit this tutorial!',
        position: 'bottom'
      }
    ].filter(step => !step.element || step.element instanceof Element);

    intro.setOptions({
      steps,
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
      overlayOpacity: 0.5
    });

    document.body.classList.add('introjs-open');

    intro.onafterchange(function() {
      maintainTooltip();
      
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
      document.body.classList.remove('introjs-open');
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    });

    intro.start();
  }

  if (!localStorage.getItem(TUTORIAL_STORAGE_KEY)) {
    setTimeout(startTutorial, 500);
  }

  const tutorialButton = document.getElementById('start-tutorial');
  if (tutorialButton) {
    tutorialButton.addEventListener('click', (e) => {
      e.preventDefault();
      startTutorial();
    });
  }
}

document.addEventListener('nav', loadResources);
loadResources();
`

export default (() => {
  return Tutorial
}) satisfies QuartzComponentConstructor