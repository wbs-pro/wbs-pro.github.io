# Quartz Customization Guide

This document outlines the features and customizations implemented in this Quartz project compared to the default Quartz template.

## 1. Layout Customizations

### 1.1 Shared Page Components
```typescript
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
```

### 1.2 Custom Page Layouts
- Implemented different layouts for blog posts and regular pages
- Added custom filtering for the Explorer component to hide specific pages
- Implemented responsive design with mobile-only and desktop-only components

```typescript
export const layout: QuartzLayout = {
  pageLayout: (props) => {
    const { slug } = props
    
    if (slug.startsWith("Blog/") && slug !== "Blog/index") {
      // Individual blog post layout
      return pageComponentList
    } else if (slug === "Blog" || slug === "Blog/index") {
      // Blog index with sorting
      return [
        Component.Head(),
        Component.Header(),
        Component.Search(),
        Component.Content(),
        Component.Footer,
      ]
    } else {
      // Default layout for other pages
      return pageComponentList
    }
  },
}
```

## 2. Theme Customization

### 2.1 Typography
```typescript
typography: {
  header: "Schibsted Grotesk",
  body: "Source Sans Pro",
  code: "IBM Plex Mono",
}
```

### 2.2 Color Scheme
Custom color palette for both light and dark modes:

```typescript
colors: {
  lightMode: {
    light: "#faf8f8",
    lightgray: "#e5e5e5",
    gray: "#b8b8b8",
    darkgray: "#4e4e4e",
    dark: "#2b2b2b",
    secondary: "#284b63",
    tertiary: "#84a59d",
    highlight: "rgba(143, 159, 169, 0.15)",
    textHighlight: "#fff23688",
  },
  darkMode: {
    light: "#161618",
    lightgray: "#393639",
    gray: "#646464",
    darkgray: "#d4d4d4",
    dark: "#ebebec",
    secondary: "#7b97aa",
    tertiary: "#84a59d",
    highlight: "rgba(143, 159, 169, 0.15)",
    textHighlight: "#b3aa0288",
  }
}
```

## 3. Plugin Configuration

### 3.1 Enabled Plugins
- FrontMatter
- CreatedModifiedDate
- SyntaxHighlighting (with GitHub theme)
- ObsidianFlavoredMarkdown
- GitHubFlavoredMarkdown
- TableOfContents
- CrawlLinks
- Description
- LaTeX (with KaTeX renderer)

### 3.2 Emitter Plugins
- AliasRedirects
- ComponentResources
- ContentPage
- FolderPage
- TagPage
- ContentIndex (with Sitemap and RSS enabled)
- Assets
- Static
- NotFoundPage
- Sitemap
- Robots

## 4. Additional Features

### 4.1 Analytics
Integrated Umami analytics:
```typescript
analytics: {
  provider: "umami",
  host: "https://cloud.umami.is",
  websiteId: "f44afe1b-58e4-48dc-9a6d-9cab635c476b",
}
```

### 4.2 Language Support
Added language handling through the `LanguageHandler` component

### 4.3 Blog Functionality
Custom blog content component with sorting options:
```typescript
export const components: QuartzComponents = {
  pageContent: {
    BlogContent,
  },
  FolderContent: FolderContent({
    showSortOptions: true,
  }),
}
```

### 4.4 Explorer Customization
Custom filtering to hide specific pages:
```typescript
Component.Explorer({
  filterFn: (node) => {
    const hiddenPaths = new Set([
      "contact",
      "certifications",
    ])
    return !hiddenPaths.has(node.name.toLowerCase())
  }
})
```

## 5. Site Configuration

### 5.1 Basic Settings
```typescript
configuration: {
  pageTitle: "🪴 Home",
  enableSPA: true,
  enablePopovers: true,
  locale: "en-US",
  baseUrl: "quartz.jzhao.xyz",
  ignorePatterns: ["private", "templates", ".obsidian"],
  defaultDateType: "created",
  author: "William Bornet-Sédiey",
}
```

### 5.2 Font Configuration
Using Google Fonts with CDN caching:
```typescript
theme: {
  fontOrigin: "googleFonts",
  cdnCaching: true,
}
```

This customization guide provides a comprehensive overview of the features and modifications implemented in this Quartz project. Each section includes the relevant code snippets and configuration options that can be used to recreate these features in other Quartz projects. 