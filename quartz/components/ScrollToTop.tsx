import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/scrollToTop.scss"

export const ScrollToTop: QuartzComponent = () => {
  return (
    <button id="scroll-to-top" className="scroll-to-top" aria-label="Scroll to top">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  )
}

ScrollToTop.css = style

ScrollToTop.afterDOMLoaded = `
  const scrollToTopButton = document.getElementById('scroll-to-top');
  const toggleButtonVisibility = () => {
    scrollToTopButton?.classList.toggle('visible', window.scrollY > 300);
  };

  if (scrollToTopButton) {
    window.addEventListener('scroll', toggleButtonVisibility);
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleButtonVisibility(); // Initial check
  }
`

export default (() => ScrollToTop) satisfies QuartzComponentConstructor