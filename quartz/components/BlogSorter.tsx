import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { byCreationDate, byLastUpdatedDate, byDateAndAlphabetical, SortFn } from "./PageList"
import { useState } from "preact/hooks"
import { classNames } from "../util/lang"
import style from "./styles/blogSorter.scss"

interface BlogSorterOptions {
  defaultSort: "creation" | "updated" | "alphabetical"
}

const defaultOptions: BlogSorterOptions = {
  defaultSort: "creation"
}

export interface BlogSorterProps extends QuartzComponentProps {
  onSortChange: (sortFn: SortFn) => void
}

export default ((userOpts?: Partial<BlogSorterOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  const BlogSorter: QuartzComponent = ({ cfg, onSortChange, displayClass }: BlogSorterProps) => {
    const [currentSort, setCurrentSort] = useState<string>(opts.defaultSort)

    const handleSortChange = (sortType: string) => {
      setCurrentSort(sortType)
      
      let sortFn: SortFn
      switch (sortType) {
        case "creation":
          sortFn = byCreationDate(cfg)
          break
        case "updated":
          sortFn = byLastUpdatedDate(cfg)
          break
        case "alphabetical":
          sortFn = (f1, f2) => {
            const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
            const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
            return f1Title.localeCompare(f2Title)
          }
          break
        default:
          sortFn = byDateAndAlphabetical(cfg)
      }
      
      onSortChange(sortFn)
    }

    return (
      <div class={classNames(displayClass, "blog-sorter")}>
        <div class="sort-options">
          <span>Sort by: </span>
          <button 
            class={currentSort === "creation" ? "active" : ""} 
            onClick={() => handleSortChange("creation")}
          >
            Creation Date
          </button>
          <button 
            class={currentSort === "updated" ? "active" : ""} 
            onClick={() => handleSortChange("updated")}
          >
            Last Updated
          </button>
          <button 
            class={currentSort === "alphabetical" ? "active" : ""} 
            onClick={() => handleSortChange("alphabetical")}
          >
            Alphabetical
          </button>
        </div>
      </div>
    )
  }

  return BlogSorter
}) satisfies QuartzComponentConstructor 