import { QuartzComponentConstructor } from "./types"

declare global {
  interface Window {
    documentLanguage: string
  }
}

function LanguageHandler() {
  return null
}

LanguageHandler.afterDOMLoaded = `
// Set the document language to English
document.documentElement.lang = 'en';

// Add hreflang meta tag
const hreflangMeta = document.createElement('meta');
hreflangMeta.setAttribute('http-equiv', 'content-language');
hreflangMeta.setAttribute('content', 'en');
document.head.appendChild(hreflangMeta);

// Store language for other components to reference
window.documentLanguage = 'en';
`

export default (() => {
  return LanguageHandler
}) satisfies QuartzComponentConstructor