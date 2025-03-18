import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/mobileNavigation.scss"

interface FileData {
  slug: string;
  frontmatter?: {
    title?: string;
    tags?: string[];
  };
  date?: {
    modified?: Date;
    created?: Date;
  };
}

export default (() => {
  const MobileNavigation: QuartzComponent = ({ displayClass, cfg, allFiles }: QuartzComponentProps) => {
    const translations = i18n(cfg.locale)
    
    // Get recent pages (limit to 5)
    const recentPages = (allFiles as FileData[])
      .sort((a, b) => {
        const dateA = a.date?.modified || a.date?.created
        const dateB = b.date?.modified || b.date?.created
        if (!dateA || !dateB) return 0
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 5)

    // Script to handle mobile navigation and TOC
    const mobileScript = `
      <script>
        (function() {
          // Mobile detection
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
          if (!isMobile) {
            document.querySelector('.mobile-nav-alternative')?.classList.add('desktop-hidden');
            return;
          }

          // Initialize TOC
          function initTOC() {
            const contentArea = document.querySelector('article');
            if (!contentArea) return;

            const headers = contentArea.querySelectorAll('h1[id], h2[id], h3[id]');
            const tocList = document.querySelector('.mobile-toc-list');
            const tocContainer = document.querySelector('.mobile-toc');
            
            if (tocList && headers.length > 0) {
              // Clear existing content
              tocList.innerHTML = '';
              
              const fragment = document.createDocumentFragment();
              
              headers.forEach(header => {
                const level = parseInt(header.tagName[1]);
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                li.style.cssText = 'transform: translateZ(0); contain: content;';
                a.className = 'mobile-nav-link';
                a.style.cssText = 'touch-action: manipulation; transform: translateZ(0); contain: content;';
                
                a.href = '#' + header.id;
                a.textContent = header.textContent || '';
                li.style.paddingLeft = \`\${(level - 1)}rem\`;
                
                // Add click handler for smooth scrolling
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  const target = document.getElementById(header.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, '', '#' + header.id);
                    
                    // Close mobile navigation if needed
                    const mobileNav = document.querySelector('.mobile-nav-alternative');
                    if (mobileNav) {
                      mobileNav.classList.remove('active');
                    }
                  }
                });
                
                li.appendChild(a);
                fragment.appendChild(li);
              });
              
              tocList.appendChild(fragment);
              tocContainer?.classList.remove('hidden');
            } else {
              tocContainer?.classList.add('hidden');
            }
          }

          // Add mobile navigation toggle
          const mobileNav = document.querySelector('.mobile-nav-alternative');
          const toggleButton = document.createElement('button');
          toggleButton.className = 'mobile-nav-toggle';
          toggleButton.innerHTML = '<span></span><span></span><span></span>';
          toggleButton.setAttribute('aria-label', 'Toggle Navigation');
          document.body.appendChild(toggleButton);

          toggleButton.addEventListener('click', () => {
            mobileNav?.classList.toggle('active');
            toggleButton.classList.toggle('active');
          });

          // Initialize TOC when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTOC);
          } else {
            initTOC();
          }

          // Update TOC when navigation occurs
          document.addEventListener('nav', initTOC);
        })();
      </script>
    `
    
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: mobileScript }}></div>
        <div class={classNames(displayClass, "mobile-nav-alternative")} style={{ contain: "content" }}>
          {/* Table of Contents Section */}
          <div class="mobile-toc" style={{ contain: "content" }}>
            <h3>Contents</h3>
            <ul class="mobile-toc-list touch-optimized" style={{ contain: "content" }}>
            </ul>
          </div>

          <h3>{translations.components.recentNotes?.title || "Recent Pages"}</h3>
          <ul class="touch-optimized">
            {recentPages.map((page) => (
              <li key={page.slug}>
                <a href={page.slug} class="mobile-nav-link" style={{ touchAction: "manipulation" }}>
                  {page.frontmatter?.title || page.slug}
                </a>
              </li>
            ))}
          </ul>
          <div class="mobile-nav-tags" style={{ contain: "content" }}>
            <h3>Popular Tags</h3>
            <div class="mobile-tag-list">
              {Object.entries(
                (allFiles as FileData[]).flatMap((file) => file.frontmatter?.tags || [])
                  .reduce((acc, tag) => {
                    acc[tag] = (acc[tag] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([tag, count]) => (
                  <a 
                    href={`/tags/${tag}`} 
                    class="mobile-tag hardware-accelerated"
                    style={{ touchAction: "manipulation" }}
                    data-tag={tag}
                  >
                    #{tag} <span class="mobile-tag-count">({count})</span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  MobileNavigation.css = style
  return MobileNavigation
}) satisfies QuartzComponentConstructor