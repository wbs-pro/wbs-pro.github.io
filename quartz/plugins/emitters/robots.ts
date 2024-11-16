import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"

export const Robots: QuartzEmitterPlugin = () => {
  return {
    name: "Robots",
    getQuartzComponents() {
      return []
    },
    async emit(ctx, _content, _resources) {
      const baseUrl = ctx.cfg.baseUrl
      if (!baseUrl) {
        return []
      }

      const robotsTxt = `User-agent: *
Allow: /
Allow: /blog/
Allow: /tags/
Allow: /about/
Allow: /contact/

# Author pages
Allow: /william-bornet-sediey
Allow: /william-bornet
Allow: /william-bornet-sédiey

Sitemap: https://${baseUrl}/sitemap.xml

# Crawl-delay: 10`

      return [{
        slug: "robots",
        ext: ".txt",
        content: robotsTxt,
      }]
    }
  }
} 