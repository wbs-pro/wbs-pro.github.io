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
const lang = 'en';
document.documentElement.lang = lang;

const hreflangMeta = document.createElement('meta');
hreflangMeta.setAttribute('http-equiv', 'content-language');
hreflangMeta.setAttribute('content', lang);
document.head.appendChild(hreflangMeta);

window.documentLanguage = lang;
`

export default (() => {
  return LanguageHandler
}) satisfies QuartzComponentConstructor