import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending by created date
      return f2.dates.created.getTime() - f1.dates.created.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byLastUpdatedDate(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Get the modified date or fall back to created date if no modified date exists
    const getLatestDate = (file: QuartzPluginData): Date | undefined => {
      if (!file.dates) return undefined
      return file.dates.modified || file.dates.created
    }

    const f1Date = getLatestDate(f1)
    const f2Date = getLatestDate(f2)

    if (f1Date && f2Date) {
      // sort descending by last modified/created date
      return f2Date.getTime() - f1Date.getTime()
    } else if (f1Date && !f2Date) {
      // prioritize files with dates
      return -1
    } else if (!f1Date && f2Date) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byCreationDate(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates?.created && f2.dates?.created) {
      // sort descending by created date
      return f2.dates.created.getTime() - f1.dates.created.getTime()
    } else if (f1.dates?.created && !f2.dates?.created) {
      // prioritize files with created dates
      return -1
    } else if (!f1.dates?.created && f2.dates?.created) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabetical(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []

        return (
          <li class="section-li">
            <div class="section">
              <div>
                {page.dates && (
                  <p class="meta">
                    <Date date={page.dates.created} locale={cfg.locale} />
                  </p>
                )}
              </div>
              <div class="desc">
                <h3>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </h3>
              </div>
              <ul class="tags">
                {tags.map((tag) => (
                  <li>
                    <a
                      class="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
