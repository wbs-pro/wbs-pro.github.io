import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import LanguageHandler from "./quartz/components/LanguageHandler"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      Contact: "/contact",
      GitHub: "https://github.com/wbs-pro",
      LinkedIn: "https://linkedin.com/in/williambornetsediey",
      Behance: "https://www.behance.net/williambornetsediey",
    },
  }),
  afterBody: [
    Component.ScrollToTop(),
    Component.Tutorial(),
    LanguageHandler(),
  ],
}

// components for pages that display a single page
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.ButtonGroup(),
    Component.DesktopOnly(Component.Explorer({
      filterFn: (node) => {
        // Add paths or titles you want to hide from the explorer
        const hiddenPaths = new Set([
          "contact",  // Will hide contact.md
          // Add other paths you want to hide
        ])
        
        // Return false for paths we want to hide, true for everything else
        return !hiddenPaths.has(node.name.toLowerCase())
      }
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.ButtonGroup(),
    Component.DesktopOnly(Component.Explorer({
      filterFn: (node) => {
        // Add paths or titles you want to hide from the explorer
        const hiddenPaths = new Set([
          "contact",  // Will hide contact.md
          // Add other paths you want to hide
        ])
        
        // Return false for paths we want to hide, true for everything else
        return !hiddenPaths.has(node.name.toLowerCase())
      }
    })),
  ],
  right: [],
}

export const defaultLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.TutorialButton(),
    Component.Explorer({
      filterFn: (node) => {
        // Add paths or titles you want to hide from the explorer
        const hiddenPaths = new Set([
          "contact",  // Will hide contact.md
          // Add other paths you want to hide
        ])
        
        // Return false for paths we want to hide, true for everything else
        return !hiddenPaths.has(node.name.toLowerCase())
      }
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
  afterBody: [
    Component.Tutorial(),
  ],
}
