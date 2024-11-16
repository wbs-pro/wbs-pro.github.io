import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"

export const Sitemap: QuartzEmitterPlugin = () => {
  return {
    name: "Sitemap",
    getQuartzComponents() {
      return []
    },
    async emit(ctx, content, _resources) {
      const baseUrl = ctx.cfg.baseUrl
      if (!baseUrl) {
        return []
      }

      const authorUrls = [
        "william-bornet-sediey",
        "william-bornet",
        "william-bornet-sédiey"
      ].map(slug => `  <url>
    <loc>https://${baseUrl}/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${content
  .filter((page) => !page.frontmatter?.draft)
  .map(
    (page) => `  <url>
    <loc>https://${baseUrl}/${page.slug}</loc>
    <lastmod>${page.frontmatter?.lastmod ?? page.frontmatter?.date ?? new Date().toISOString()}</lastmod>
    <changefreq>${page.slug === "index" ? "daily" : "weekly"}</changefreq>
    <priority>${page.slug === "index" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
${authorUrls}
</urlset>`

      return [{
        slug: "sitemap",
        ext: ".xml",
        content: sitemap,
      }]
    }
  }
} 