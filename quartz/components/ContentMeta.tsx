import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        // Add creation date
        segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))
        
        // Display reading time if enabled
        if (options.showReadingTime) {
          const { minutes, words: _words } = readingTime(text)
          const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
            minutes: Math.ceil(minutes),
          })
          segments.push(displayedTime)
        }
      }

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      // Only create the last-modified element if there's a modified date from frontmatter
      // This ensures we're only showing explicit updates from the frontmatter
      const hasFrontmatterModifiedDate = fileData.dates?.modified && 
        (fileData.frontmatter?.lastmod || 
         fileData.frontmatter?.updated || 
         fileData.frontmatter?.["last-modified"] ||
         fileData.frontmatter?.modified);
      
      const lastModifiedElement = hasFrontmatterModifiedDate ? (
        <div class="last-modified">
          {i18n(cfg.locale).components.contentMeta.lastUpdated?.({
            date: formatDate(fileData.dates.modified!, cfg.locale)
          }) || `Last updated: ${formatDate(fileData.dates.modified!, cfg.locale)}`}
        </div>
      ) : null;

      return (
        <div class={classNames(displayClass, "content-meta-wrapper")}>
          <p show-comma={options.showComma} class="content-meta">
            {segmentsElements}
          </p>
          {lastModifiedElement}
        </div>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style + `
    .content-meta-wrapper {
      margin-bottom: 0.5rem;
    }

    .content-meta {
      margin-bottom: 0.1rem;
    }

    .last-modified {
      color: var(--gray);
      font-size: 0.85em;
      font-style: italic;
      line-height: 1.2;
      margin-bottom: 0.1rem;
    }
  `

  return ContentMetadata
}) satisfies QuartzComponentConstructor
