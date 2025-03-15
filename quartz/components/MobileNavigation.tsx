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
    // Only show on mobile
    const mobileCheck = `
      <script>
        (function() {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
          if (!isMobile) {
            document.querySelector('.mobile-nav-alternative')?.classList.add('desktop-hidden');
          }
        })();
      </script>
    `
    
    // Get recent pages (limit to 5)
    const recentPages = (allFiles as FileData[])
      .sort((a, b) => {
        const dateA = a.date?.modified || a.date?.created
        const dateB = b.date?.modified || b.date?.created
        if (!dateA || !dateB) return 0
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 5)
    
    const translations = i18n(cfg.locale)
    
    return (
      <div class={classNames(displayClass, "mobile-nav-alternative")} style={{ contain: "content" }}>
        <div dangerouslySetInnerHTML={{ __html: mobileCheck }}></div>
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
          <h3>{translations.components.recentNotes?.title || "Popular Tags"}</h3>
          <div class="mobile-tag-list">
            {/* Get top 10 tags */}
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
    )
  }

  MobileNavigation.css = style
  return MobileNavigation
}) satisfies QuartzComponentConstructor