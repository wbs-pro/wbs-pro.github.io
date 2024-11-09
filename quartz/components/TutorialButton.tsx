import { QuartzComponentConstructor } from "./types"

function TutorialButton() {
  return (
    <button id="start-tutorial" aria-label="Start tutorial" title="Start tutorial">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </button>
  )
}

TutorialButton.css = `
#start-tutorial {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  color: var(--gray);
  transition: color 0.2s ease;
}

#start-tutorial:hover {
  color: var(--secondary);
}
`

export default (() => {
  return TutorialButton
}) satisfies QuartzComponentConstructor