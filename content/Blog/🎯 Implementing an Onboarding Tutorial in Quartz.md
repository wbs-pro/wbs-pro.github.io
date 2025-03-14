---
title: 🎯 Implementing an Onboarding Tutorial in Quartz
draft: false
date: 2024-09-08
tags:
  - WebDevelopment
  - AI
  - LLM
  - JavaScript
  - Library
---
# Implementing an Onboarding Tutorial in Quartz

After receiving feedback on the navigation of this website, I decided to implement an interactive onboarding tutorial. After researching potential options, I settled on using Intro.js, a lightweight JavaScript library designed for creating step-by-step user onboarding tours.

## Why Intro.js?

I primarily chose Intro.js for the following compelling reasons:

- It is lightweight (only 10 kB) with no external dependencies.
- It offers simple and intuitive implementation.
- It is highly customizable with robust theming support.
- It is compatible with modern web frameworks.

## Implementation Details

### 1. Installation and Setup

I integrated Intro.js using CDN<span class="tooltip-question">?</span><span class="tooltip-text">Content Delivery Network - servers spread around the world that deliver website files faster by serving them from locations closer to users</span> links for both the JavaScript and CSS files:

```typescript
const INTRO_CSS_URL = 'https://unpkg.com/intro.js/minified/introjs.min.css';
const INTRO_JS_URL = 'https://unpkg.com/intro.js/minified/intro.min.js';
```

### 2. Core Configuration

The tutorial is configured with carefully designed steps that guide users through the key features that Quartz provides by default, as well as some additional features I have added.:

```typescript
const steps = [
  {
    title: '👋 Welcome',
    intro: 'Let me show you around this digital garden!',
    position: 'center'
  },
  {
    element: elements.searchButton,
    title: '🔍 Search',
    intro: 'Quickly find any content using the search feature',
    position: 'bottom'
  },
  {
    element: elements.explorer,
    title: '📂 Explorer',
    intro: isMobile 
      ? 'Tap this menu button to browse through all pages and folders'
      : 'Browse through all pages and folders here',
    position: isMobile ? 'right' : 'bottom'
  },
  {
    element: elements.graphElement,
    title: '📊 Graph View',
    intro: isMobile 
      ? 'Visualize connections between pages'
      : 'Visualize how pages are connected to each other',
    position: 'bottom'
  },
  {
    element: elements.darkmodeButton,
    title: '💡 Theme',
    intro: 'Toggle between light and dark themes',
    position: 'bottom'
  },
  {
    element: elements.tutorialButton,
    title: '❓ Help',
    intro: isMobile 
      ? 'Tap here to see this tutorial again'
      : 'You can always click this button to revisit this tutorial!',
    position: 'bottom'
  }
];

const intro = window.introJs().setOptions({
  steps,
  showProgress: false,
  showBullets: true,
  exitOnOverlayClick: false,
  exitOnEsc: true,
  disableInteraction: true,
  helperElementPadding: 8,
  tooltipPosition: 'auto',
  positionPrecedence: ['bottom', 'top', 'right', 'left'],
  showStepNumbers: false,
  keyboardNavigation: true,
  scrollTo: false,
  scrollToElement: false,
  doneLabel: 'Got it!',
  nextLabel: 'Next →',
  prevLabel: '← Back',
  overlayOpacity: 0.5,
  tooltipOffset: 10
});
```

### 3. Custom Styling

I implemented some custom CSS to ensure the tutorial matches both light and dark themes:

```css
.introjs-tooltip {
  background-color: #ffffff !important;
  color: #1a1a1a !important;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  font-family: var(--bodyFont);
  max-width: 300px;
  padding: 15px;
}

[saved-theme="dark"] .introjs-tooltip {
  background-color: #2d333b !important;
  color: #e6edf3 !important;
  border-color: #444c56;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
```

### 4. Progress Indication

As well as some custom styling for progress bullets to provide visual feedback:

```css
.introjs-bullets ul li a.active {
  background: var(--secondary) !important;
  width: 24px !important;
  border-radius: 4px !important;
}
```

## Key Features

1. **Persistent Availability**
   - The tutorial can be triggered anytime via the help button
   - First-time users automatically see the tutorial
   - Tutorial state is saved using localStorage

2. **Responsive Design**
   - Mobile-specific step content
   - Adaptive positioning based on screen size
   - Touch-friendly interface

3. **Accessibility**
   - Keyboard navigation support
   - ARIA labels<span class="tooltip-question">?</span><span class="tooltip-text">Accessible Rich Internet Applications labels - text that helps screen readers explain what buttons and features do, making the website usable for visually impaired people</span> for all interactive elements
   - High contrast visuals
   - Screen reader compatibility<span class="tooltip-question">?</span><span class="tooltip-text">Makes sure the website works properly with software that reads the content aloud for visually impaired users, including proper reading order and descriptions</span>

4. **Smooth User Experience**
   - Animated transitions between steps
   - Clear visual hierarchy
   - Non-intrusive overlay
   - Easy exit options

## Best Practices Implemented

1. **Content Design**
   - Concise, clear step descriptions
   - Logical feature introduction sequence
   - Consistent tone and style
   - Emoji usage for visual engagement

2. **Technical Optimization**
   - Lazy loading of Intro.js resources
   - Efficient DOM<span class="tooltip-question">?</span><span class="tooltip-text">Document Object Model - the tutorial smoothly updates the webpage structure by only changing what needs to be highlighted, like a spotlight moving between actors on stage</span> manipulation
   - Clean event handling
   - Proper cleanup on navigation

3. **User Control**
   - Easy exit options (ESC key, overlay click)
   - Progress visibility
   - Skip option for experienced users
   - Ability to revisit tutorial

## Resources and Documentation

- [Intro.js Official Documentation](https://introjs.com/docs/)
- [Intro.js GitHub Repository](https://github.com/usablica/intro.js)
- [Quartz Components Guide](https://quartz.jzhao.xyz/advanced/components)

## License Note

While Intro.js is open-source under the AGPL license, it requires a commercial license for use in commercial applications. For personal and non-commercial sites like this digital garden, the free version is sufficient.

## Conclusion

Implementing Intro.js for the onboarding tutorial has significantly improved the user experience of this website, mainly for people unfamiliar with this kind of navigation style, making it more accessible. Its lightweight nature, extensive customization options, and smooth integration with Quartz made it an excellent choice for creating an intuitive and engaging onboarding experience.

[Source: [Intro.js Official Website](https://introjs.com/)]

<style>
.tooltip-question {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--secondary);
  color: var(--light);
  font-size: 10px;
  font-weight: bold;
  margin-left: 4px;
  cursor: help;
  transition: all 0.2s ease;
  vertical-align: super;
}

.tooltip-question:hover {
  background-color: var(--tertiary);
  transform: scale(1.1);
}

.tooltip-text {
  display: none;
  position: absolute;
  background: var(--light);
  border: 1px solid var(--lightgray);
  color: var(--dark);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
  max-width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: none;
  white-space: normal;
  line-height: 1.4;
}

.tooltip-question:hover + .tooltip-text {
  display: block;
}

[saved-theme="dark"] .tooltip-text {
  background: var(--dark);
  border-color: var(--lightgray);
  color: var(--light);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Code block overflow handling */
pre > code {
  overflow-x: auto !important;
}

/* List spacing - only for main numbered items */
ol > li {
  margin-bottom: 1.5rem;
}

ol > li:last-child {
  margin-bottom: 0;
}

/* Ensure nested lists don't get the same spacing */
ol > li > ul > li {
  margin-bottom: 0.5rem;
}

ol > li > ul > li:last-child {
  margin-bottom: 0;
}
</style>