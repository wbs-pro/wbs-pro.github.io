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
    
    function startTimer() {
      startTime = performance.now();
    }
    
    function formatLoadTime(timeInMs) {
      if (timeInMs >= 1000) {
        return \`\${(timeInMs / 1000).toFixed(1)}s\`;
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
    
    function updatePageStats() {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      const pageSize = new Blob([document.documentElement.outerHTML]).size;
      
      const statsElement = document.querySelector('.stats');
      if (statsElement) {
        statsElement.textContent = \`\${formatBytes(pageSize)} · \${formatLoadTime(loadTime)}\`;
      }
    }

    // Initial page load
    startTimer();
    window.addEventListener('load', updatePageStats);

    // For SPA navigation
    document.addEventListener('nav', () => {
      startTimer();
      setTimeout(updatePageStats, 0);
    });
  `

  return Footer
}) satisfies QuartzComponentConstructor
