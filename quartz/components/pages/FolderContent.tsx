import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import path from "path"
import { useState } from "preact/hooks"
import style from "../styles/listPage.scss"
import { PageList, SortFn, byCreationDate, byLastUpdatedDate } from "../PageList"
import { stripSlashes, simplifySlug } from "../../util/path"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

interface FolderContentOptions {
  /**
   * Whether to display number of folders
   */
  showFolderCount: boolean
  sort?: SortFn
  /**
   * Whether to show sorting options on blog pages
   */
  showSortOptions?: boolean
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSortOptions: false,
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const folderSlug = stripSlashes(simplifySlug(fileData.slug!))
    const isBlogFolder = folderSlug === "blog"
    
    // Create state for the current sort method
    const [currentSort, setCurrentSort] = useState<string>("creation")
    
    // Get the appropriate sort function based on current selection
    const getSortFunction = (): SortFn => {
      if (!isBlogFolder || !options.showSortOptions) {
        return options.sort ?? ((a, b) => 0)
      }
      
      switch (currentSort) {
        case "creation":
          return byCreationDate(cfg)
        case "updated":
          return byLastUpdatedDate(cfg)
        case "alphabetical":
          return (f1, f2) => {
            const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
            const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
            return f1Title.localeCompare(f2Title)
          }
        default:
          return options.sort ?? byCreationDate(cfg)
      }
    }
    
    const allPagesInFolder = allFiles.filter((file) => {
      const fileSlug = stripSlashes(simplifySlug(file.slug!))
      const prefixed = fileSlug.startsWith(folderSlug) && fileSlug !== folderSlug
      const folderParts = folderSlug.split(path.posix.sep)
      const fileParts = fileSlug.split(path.posix.sep)
      const isDirectChild = fileParts.length === folderParts.length + 1
      return prefixed && isDirectChild
    })
    
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = ["popover-hint", ...cssClasses].join(" ")
    const listProps = {
      ...props,
      sort: getSortFunction(),
      allFiles: allPagesInFolder,
    }

    const content =
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)

    // Sort UI component to be shown on blog page
    const sortUI = (isBlogFolder && options.showSortOptions) ? (
      <div class="blog-sort-options">
        <span>Sort by: </span>
        <button 
          class={currentSort === "creation" ? "active" : ""}
          onClick={() => setCurrentSort("creation")}
        >
          Creation Date
        </button>
        <button 
          class={currentSort === "updated" ? "active" : ""}
          onClick={() => setCurrentSort("updated")}
        >
          Last Updated
        </button>
        <button 
          class={currentSort === "alphabetical" ? "active" : ""}
          onClick={() => setCurrentSort("alphabetical")}
        >
          Alphabetical
        </button>
      </div>
    ) : null

    return (
      <div class={classes}>
        <article>{content}</article>
        <div class="page-listing">
          {options.showFolderCount && (
            <p>
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: allPagesInFolder.length,
              })}
            </p>
          )}
          {sortUI}
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  // Add styling for the sort buttons
  const additionalStyles = `
  .blog-sort-options {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .blog-sort-options button {
    background-color: var(--lightgray);
    border: 1px solid var(--darkgray);
    border-radius: 4px;
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.1s ease;
  }
  
  .blog-sort-options button:hover {
    background-color: var(--gray);
  }
  
  .blog-sort-options button.active {
    background-color: var(--secondary);
    color: white;
    border-color: var(--secondary);
  }
  `

  FolderContent.css = style + PageList.css + additionalStyles
  return FolderContent
}) satisfies QuartzComponentConstructor
