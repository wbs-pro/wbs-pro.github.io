import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// In the SharedLayout, add the ScrollToTop component
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.ScrollToTop()],
  footer: [
    Component.ScrollToTop(),
    Component.Footer({
      links: {
        GitHub: "https://github.com/wbs-pro",
        LinkedIn: "https://linkedin.com/in/williambornetsediey",
        Behance: "https://www.behance.net/williambornetsediey",
      },
    }),
  ],
  beforeBody: [Component.ScrollToTop()],
  afterBody: [Component.ScrollToTop()],
}

// ... rest of the file remains unchanged