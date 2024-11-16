import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function ButtonGroup(props: QuartzComponentProps) {
  const DarkmodeButton = () => {
    return (
      <button class="darkmode" id="darkmode" aria-label="Toggle theme">
        <svg id="dayIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg id="nightIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    )
  }

  return (
    <div class="button-group">
      <DarkmodeButton />
      <button
        id="start-tutorial"
        aria-label="Start site tutorial"
        class="tutorial-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
    </div>
  )
}

ButtonGroup.css = `
  .button-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .button-group button {
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .button-group button:hover {
    opacity: 1;
  }

  /* Darkmode button specific styles */
  .darkmode {
    padding: 0;
    border: none;
    position: relative;
    width: 20px;
    height: 20px;
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  .darkmode:hover {
    transform: scale(1.1);
  }

  .darkmode svg {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    fill: none;
    stroke: var(--darkgray);
    transition: all 0.3s ease;
    transform-origin: center;
  }

  /* Show moon icon in light mode (to switch to dark) */
  :root:not([saved-theme="dark"]) #dayIcon {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }

  :root:not([saved-theme="dark"]) #nightIcon {
    opacity: 1;
    transform: rotate(0) scale(1);
  }

  /* Show sun icon in dark mode (to switch to light) */
  :root[saved-theme="dark"] #dayIcon {
    opacity: 1;
    transform: rotate(0) scale(1);
  }

  :root[saved-theme="dark"] #nightIcon {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
  }

  /* Tutorial button specific styles */
  .tutorial-button {
    margin-left: 0.5rem;
  }
`

ButtonGroup.afterDOMLoaded = `
  // Darkmode toggle functionality
  const darkmode = document.querySelector('.darkmode')
  const darkmodeMobile = window.document.getElementById('darkmode-mobile')
  const html = document.querySelector('html')
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  
  if (savedTheme) {
    html?.setAttribute('saved-theme', savedTheme)
  }

  darkmode?.addEventListener('click', () => {
    const currentTheme = html?.getAttribute('saved-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    html?.setAttribute('saved-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })

  darkmodeMobile?.addEventListener('click', () => {
    const currentTheme = html?.getAttribute('saved-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    html?.setAttribute('saved-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })
`

export default (() => ButtonGroup) satisfies QuartzComponentConstructor