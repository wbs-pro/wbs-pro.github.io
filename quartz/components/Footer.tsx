import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p class="flex">
          <span>
            {i18n(cfg.locale).components.footer.createdWith}{" "}
            <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
          </span>
          <span class="stats"></span>
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style + `
    footer p.flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    footer .stats {
      color: var(--gray);
      font-size: 0.9em;
    }
  `

  Footer.afterDOMLoaded = `
    let startTime;
    let cachedPageSize;
    let updateQueued = false;
    
    function startTimer() {
      startTime = performance.now();
    }
    
    function formatLoadTime(timeInMs) {
      if (timeInMs >= 1000) {
        return \`\${(timeInMs / 1000).toFixed(1)}s\`;
      }
      if (timeInMs < 1) {
        return \`\${Math.round(timeInMs * 1000)}µs\`;
      }
      return \`\${Math.round(timeInMs)}ms\`;
    }

    function formatBytes(bytes) {
      if (bytes === 0) return '0B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(1))}\${sizes[i]}\`;
    }
    
    function calculatePageSize() {
      if (cachedPageSize === undefined) {
        // Get main content size instead of entire HTML
        const mainContent = document.getElementById('quartz-body');
        if (mainContent) {
          // Calculate size of actual content without scripts and style elements
          const contentClone = mainContent.cloneNode(true);
          const scripts = contentClone.getElementsByTagName('script');
          const styles = contentClone.getElementsByTagName('style');
          
          // Remove scripts and styles from size calculation
          while (scripts.length > 0) scripts[0].remove();
          while (styles.length > 0) styles[0].remove();
          
          cachedPageSize = new Blob([contentClone.innerHTML]).size;
        } else {
          // Fallback to a simpler calculation if main content not found
          const content = document.body.innerText;
          cachedPageSize = new Blob([content]).size;
        }
      }
      return cachedPageSize;
    }
    
    function updatePageStats() {
      if (updateQueued) return;
      updateQueued = true;

      requestAnimationFrame(() => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        const pageSize = calculatePageSize();
        
        const statsElement = document.querySelector('.stats');
        if (statsElement) {
          statsElement.textContent = \`\${formatBytes(pageSize)} · \${formatLoadTime(loadTime)}\`;
        }
        
        updateQueued = false;
      });
    }

    // Reset cache on navigation
    function resetCache() {
      cachedPageSize = undefined;
    }

    // Initial page load
    startTimer();
    window.addEventListener('load', updatePageStats);

    // For SPA navigation
    document.addEventListener('nav', () => {
      resetCache();
      startTimer();
      updatePageStats();
    });
  `

  return Footer
}) satisfies QuartzComponentConstructor
