import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { Menu } from "./icons"
import { i18n } from "../i18n"
import { pathToRoot } from "../util/path"

export function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = pathToRoot(fileData.slug!)
  
  return (
    <h1 class={`page-title ${displayClass ?? ""}`}>
      <button
        class="menu-trigger mobile-explorer-trigger"
        aria-label="Toggle Explorer"
      >
        <Menu />
      </button>
      <a href={baseDir}>{title}</a>
    </h1>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
}

.menu-trigger {
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  display: none;
  z-index: 1000;
}

@media (max-width: 600px) {
  .menu-trigger {
    display: block;
    position: relative;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
