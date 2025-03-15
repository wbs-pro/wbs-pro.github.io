---
title: Tutorial Component Fix Documentation
date: 2025-03-15
draft: true
tags:
  - technical
  - bug-fix
  - tutorial
  - component
  - intro.js
---

## Quick Overview

The tutorial/onboarding component in Quartz was not functioning due to resource loading issues. The fix involved improving resource loading reliability, timing, and error handling, primarily focusing on proper CDN usage and robust error detection.

**Key Changes**:
- Switched to cdnjs.cloudflare.com for better reliability
- Implemented proper resource loading validation
- Added comprehensive error handling
- Fixed timing issues with script loading

## Detailed Technical Documentation

### Problem Description

The tutorial component, which uses intro.js for onboarding functionality, was failing to load properly. The main issues were:
1. Unreliable resource loading from unpkg.com
2. Lack of proper error handling
3. Race conditions in script loading
4. No validation of successful intro.js initialization

### Solution Implementation

#### 1. Resource Loading Improvements

```typescript
function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      if (typeof window.introJs === 'undefined') {
        reject(new Error('introJs not loaded correctly'));
      } else {
        resolve();
      }
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

function loadStyle(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${url}"]`)) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
    document.head.appendChild(link);
  });
}
```

Key improvements:
- Added checks for existing resources to prevent duplicate loading
- Implemented proper error handling with specific error messages
- Added validation to ensure intro.js is actually loaded
- Used Promises for better async handling

#### 2. Resource Loading Timing

```typescript
async function loadResources() {
  try {
    await Promise.all([
      loadStyle('https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/introjs.min.css'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/intro.min.js')
    ]);
    setupTutorial();
  } catch (error) {
    console.error('Failed to load tutorial resources:', error.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadResources);
} else {
  loadResources();
}

document.addEventListener('nav', loadResources);
```

Key improvements:
- Used Promise.all for concurrent loading
- Added proper document ready state checking
- Implemented navigation event handling
- Added error reporting

#### 3. CDN Changes

Changed resource URLs from:
```typescript
'https://unpkg.com/intro.js/minified/introjs.min.css'
'https://unpkg.com/intro.js/minified/intro.min.js'
```

To:
```typescript
'https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/introjs.min.css'
'https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/intro.min.js'
```

Benefits:
- Better reliability
- Improved CORS support
- Consistent versioning
- Better caching

### Testing and Validation

The fix was tested across multiple scenarios:
1. First-time visitor experience
2. Manual tutorial trigger
3. Navigation between pages
4. Different document ready states
5. Various network conditions

### Troubleshooting Guide

If the tutorial stops working again, check:

1. Console errors for specific loading failures
2. Network tab for resource loading status
3. Verify intro.js is properly initialized (window.introJs should be defined)
4. Check if resources are being loaded multiple times
5. Verify the CDN URLs are accessible

### Related Components

The fix primarily affects:
- `Tutorial.tsx` component
- Resource loading system
- Navigation event handling
- User onboarding experience

### Future Considerations

Potential improvements:
1. Implement local fallback for CDN failures
2. Add retry logic for failed resource loading
3. Cache resources for offline usage
4. Add loading indicators during resource initialization

## Technical Context for LLMs

### Component Purpose
The tutorial component provides an interactive onboarding experience using intro.js, guiding users through the website's features and functionality.

### Implementation Details
- Uses intro.js version 7.2.0
- Implements Promise-based resource loading
- Handles both initial load and navigation events
- Includes comprehensive error handling
- Uses cdnjs.cloudflare.com as the primary CDN

### Code Structure
- Resource loading functions (loadScript, loadStyle)
- Resource initialization (loadResources)
- Tutorial setup and configuration (setupTutorial)
- Event listeners for various loading scenarios
- Error handling and reporting

### Integration Points
- Document lifecycle events
- Navigation system
- Resource loading system
- DOM manipulation
- Error logging system

This documentation should provide sufficient context for future maintenance, debugging, or reimplementation of the tutorial component.
