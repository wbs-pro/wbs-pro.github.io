import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/mobileTOC.scss"

export default (() => {
  const MobileTOC: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const tocScript = `
      <script>
        (function() {
          // Only run on mobile
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
          if (!isMobile) {
            document.querySelector('.mobile-toc-container')?.classList.add('desktop-hidden');
            return;
          }

          // Generate TOC
          function generateTOC() {
            const contentArea = document.querySelector('article');
            if (!contentArea) return;

            const headers = contentArea.querySelectorAll('h1[id], h2[id], h3[id]');
            const tocList = document.querySelector('.mobile-toc-list');
            
            if (tocList && headers.length > 0) {
              // Clear existing content
              tocList.innerHTML = '';
              
              // Use DocumentFragment for better performance
              const fragment = document.createDocumentFragment();
              
              headers.forEach(header => {
                const level = parseInt(header.tagName[1]);
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                // Apply hardware acceleration and touch optimization
                li.style.cssText = 'transform: translateZ(0); contain: content;';
                a.className = 'mobile-toc-link';
                a.style.cssText = 'touch-action: manipulation; transform: translateZ(0); contain: content;';
                
                a.href = '#' + header.id;
                a.textContent = header.textContent || '';
                li.style.paddingLeft = \`\${(level - 1) * 0.5}rem\`;
                
                // Add click handler for smooth scrolling
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  const target = document.getElementById(header.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, '', '#' + header.id);
                  }
                });
                
                li.appendChild(a);
                fragment.appendChild(li);
              });
              
              // Single DOM operation to add all items
              tocList.appendChild(fragment);
              document.querySelector('.mobile-toc-container')?.classList.remove('hidden');
            } else {
              document.querySelector('.mobile-toc-container')?.classList.add('hidden');
            }
          }

          // Initialize TOC when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', generateTOC);
          } else {
            generateTOC();
          }

          // Update TOC when navigation occurs
          document.addEventListener('nav', generateTOC);
        })();
      </script>
    `;

    return (
      <div className={classNames(displayClass, "mobile-toc-container")} style={{ contain: "content" }}>
        <div dangerouslySetInnerHTML={{ __html: tocScript }}></div>
        <div className="mobile-toc-header">
          <h3>Contents</h3>
        </div>
        <ul className="mobile-toc-list" style={{ contain: "content" }}>
          {/* TOC items will be populated by JavaScript */}
        </ul>
      </div>
    )
  }

  MobileTOC.css = style
  return MobileTOC
}) satisfies QuartzComponentConstructor
