import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { PageList } from "../PageList"
import { useState } from "preact/hooks"
import style from "../styles/listPage.scss"
import BlogSorter from "../BlogSorter"
import { FullSlug } from "../../util/path"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

export default (() => {
  const BlogContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { cfg, allFiles, fileData, displayClass } = props
    const [sortFn, setSortFn] = useState(null)
    
    // Filter for blog posts - you may need to adjust this depending on how you organize your blog
    const blogFilter = (file: { slug: string }) => {
      return file.slug.startsWith("Blog/") && !file.slug.includes("Drafts/") && file.slug !== "Blog/index"
    }
    
    // Get the content of the blog index page if it exists
    const contentPage = allFiles.find((file) => file.slug === "Blog/index")
    const title = contentPage?.frontmatter?.title ?? "Blog"
    
    return (
      <div class={`${displayClass ?? ""}`}>
        <article class="popover-hint">
          <h1>{title}</h1>
          {contentPage?.htmlAst && htmlToJsx(contentPage.filePath!, contentPage.htmlAst)}
          
          <BlogSorter displayClass="" onSortChange={setSortFn} {...props} />
          
          <div>
            <PageList
              {...props}
              filter={blogFilter}
              sort={sortFn}
            />
          </div>
        </article>
      </div>
    )
  }

  return BlogContent
}) satisfies QuartzComponentConstructor 