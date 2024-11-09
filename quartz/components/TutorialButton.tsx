import { QuartzComponentConstructor } from "./types"

function TutorialButton() {
  return (
    <button
      id="start-tutorial"
      aria-label="Start site tutorial"
      className="tutorial-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    </button>
  )
}

TutorialButton.css = `
.tutorial-button {
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
  margin-left: 0.5rem;
}

.tutorial-button:hover {
  opacity: 1;
}
`

export default (() => {
  return TutorialButton
}) satisfies QuartzComponentConstructor 