import { FolderState } from "../ExplorerNode"

type MaybeHTMLElement = HTMLElement | undefined
let currentExplorerState: FolderState[]

// Store event handlers globally
let currentToggleMenu: ((e?: Event) => void) | null = null
let currentCloseMenu: (() => void) | null = null
let currentEscHandler: ((e: KeyboardEvent) => void) | null = null
let currentClickOutsideHandler: ((e: MouseEvent) => void) | null = null
let setupCompleted = false; // Track if setup has already been completed

const observer = new IntersectionObserver((entries) => {
  const explorerUl = document.getElementById("explorer-ul")
  if (!explorerUl) return
  for (const entry of entries) {
    if (entry.isIntersecting) {
      explorerUl.classList.add("no-background")
    } else {
      explorerUl.classList.remove("no-background")
    }
  }
})

function toggleExplorer(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as MaybeHTMLElement
  if (!content) return

  content.classList.toggle("collapsed")
  content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px"
}

function toggleFolder(evt: MouseEvent) {
  evt.stopPropagation()
  const target = evt.target as MaybeHTMLElement
  if (!target) return

  const isSvg = target.nodeName === "svg"
  const childFolderContainer = (
    isSvg
      ? target.parentElement?.nextSibling
      : target.parentElement?.parentElement?.nextElementSibling
  ) as MaybeHTMLElement
  const currentFolderParent = (
    isSvg ? target.nextElementSibling : target.parentElement
  ) as MaybeHTMLElement
  if (!(childFolderContainer && currentFolderParent)) return

  childFolderContainer.classList.toggle("open")
  const isCollapsed = childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, !isCollapsed)
  const fullFolderPath = currentFolderParent.dataset.folderpath as string
  
  // Ensure path is lowercase for consistency
  const normalizedPath = fullFolderPath.toLowerCase();
  
  toggleCollapsedByPath(currentExplorerState, normalizedPath) // Use normalized path
  const stringifiedFileTree = JSON.stringify(currentExplorerState)
  
  // DEBUGGING: Log state before saving in toggleFolder
  // console.log("toggleFolder: currentExplorerState before save:", currentExplorerState);
  // console.log("toggleFolder: localStorage BEFORE setItem:", localStorage.getItem("fileTree"));
  
  localStorage.setItem("fileTree", stringifiedFileTree)
  
  // console.log("toggleFolder: localStorage AFTER setItem:", localStorage.getItem("fileTree"));
}

function setupExplorer() {
  const explorer = document.getElementById("explorer")
  if (!explorer) return

  // Cleanup previous listeners before adding new ones
  // (This assumes setupExplorer might be called multiple times, e.g., on 'nav' event)
  document.querySelectorAll('a.folder-title').forEach(link => {
    // A way to check if our specific listener was already added
    if ((link as any).__folderClickListenerAttached) {
       link.removeEventListener('click', handleFolderLinkClick);
       (link as any).__folderClickListenerAttached = false;
    }
  });

  // Add listeners for collapsing behavior (if applicable)
  if (explorer.dataset.behavior === "collapse") {
    for (const item of document.getElementsByClassName(
      "folder-button",
    ) as HTMLCollectionOf<HTMLElement>) {
      item.addEventListener("click", toggleFolder)
      window.addCleanup(() => item.removeEventListener("click", toggleFolder))
    }
  }
  // Add listener for the main explorer toggle
  explorer.addEventListener("click", toggleExplorer)
  window.addCleanup(() => explorer.removeEventListener("click", toggleExplorer))
  // Add listeners for folder icons (always toggle)
  for (const item of document.getElementsByClassName(
    "folder-icon",
  ) as HTMLCollectionOf<HTMLElement>) {
    item.addEventListener("click", toggleFolder)
    window.addCleanup(() => item.removeEventListener("click", toggleFolder))
  }
  
  // *** Add NEW listener specifically for folder links when behavior is 'link' ***
  if (explorer.dataset.behavior === "link") {
    document.querySelectorAll('a.folder-title').forEach(link => {
      // Check if the link is within a folder container and has an href
      const folderContainer = link.closest('.folder-container')
      const href = link.getAttribute('href')
      if (folderContainer && href) {
         link.addEventListener('click', handleFolderLinkClick);
         (link as any).__folderClickListenerAttached = true; // Mark as attached
         window.addCleanup(() => {
            link.removeEventListener('click', handleFolderLinkClick);
            (link as any).__folderClickListenerAttached = false;
         });
      }
    });
  }

  const storageTree = localStorage.getItem("fileTree")
  const useSavedFolderState = explorer?.dataset.savestate === "true"
  const oldExplorerState: FolderState[] =
    storageTree && useSavedFolderState ? JSON.parse(storageTree) : []
  
  // Normalize paths to lowercase when creating the lookup map
  const oldIndex = new Map(oldExplorerState.map((entry) => [entry.path.toLowerCase(), entry.collapsed]))
  
  const newExplorerState: FolderState[] = explorer.dataset.tree
    ? JSON.parse(explorer.dataset.tree)
    : []
  
  // DEBUGGING: Log the states before merging
  // console.log("--- setupExplorer --- ")
  // console.log("State from localStorage (oldIndex):", oldIndex);
  // console.log("Default state from HTML (newExplorerState):", newExplorerState);
  
  currentExplorerState = []
  for (const { path, collapsed } of newExplorerState) {
    const savedState = oldIndex.get(path.toLowerCase());
    const finalCollapsed = savedState ?? collapsed;
    
    // DEBUGGING: Log each merge decision
    // console.log(`Merging path: ${path}. Default: ${collapsed}, Saved: ${savedState}, Final: ${finalCollapsed}`);

    currentExplorerState.push({ path: path.toLowerCase(), collapsed: finalCollapsed })
  }
  
  // DEBUGGING: Log the final merged state
  // console.log("Final merged state (currentExplorerState):", currentExplorerState);

  currentExplorerState.map((folderState) => {
    // Ensure lookup path is lowercase
    const folderLi = document.querySelector(
      `[data-folderpath='${folderState.path}']`,
    ) as MaybeHTMLElement
    const folderUl = folderLi?.parentElement?.nextElementSibling as MaybeHTMLElement
    if (folderUl) {
      setFolderState(folderUl, folderState.collapsed)
    }
  })
}

function setupMobileMenu() {
  const menuButton = document.querySelector('.mobile-explorer-trigger')
  const explorer = document.querySelector('.explorer')
  const overlay = document.querySelector('.explorer-overlay')
  
  // Clean up existing handlers if they exist
  if (currentToggleMenu) {
    menuButton?.removeEventListener('click', currentToggleMenu)
    overlay?.removeEventListener('click', currentCloseMenu!)
    document.removeEventListener('keydown', currentEscHandler!)
    document.removeEventListener('click', currentClickOutsideHandler!)
    
    // Set all handlers to null after cleanup
    currentToggleMenu = null;
    currentCloseMenu = null;
    currentEscHandler = null;
    currentClickOutsideHandler = null;
  }
  
  // Don't set up new handlers if elements don't exist
  if (!menuButton || !explorer || !overlay) return;
  
  currentToggleMenu = (e?: Event) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (explorer && overlay) {
      explorer.classList.toggle('active')
      overlay.classList.toggle('active')
      menuButton?.classList.toggle('active')
      document.body.style.overflow = explorer.classList.contains('active') ? 'hidden' : ''
    }
  }

  currentCloseMenu = () => {
    if (explorer && overlay) {
      explorer.classList.remove('active')
      overlay.classList.remove('active')
      menuButton?.classList.remove('active')
      document.body.style.overflow = ''
    }
  }

  currentEscHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      currentCloseMenu!()
    }
  }

  currentClickOutsideHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.explorer') && 
        !target.closest('.menu-trigger') && 
        explorer?.classList.contains('active')) {
      currentCloseMenu!()
    }
  }

  menuButton?.addEventListener('click', currentToggleMenu)
  overlay?.addEventListener('click', currentCloseMenu)
  document.addEventListener('keydown', currentEscHandler)
  
  // Use passive event listeners for better performance on mobile
  document.addEventListener('click', currentClickOutsideHandler, { passive: true })

  window.addCleanup(() => {
    if (currentToggleMenu) {
      menuButton?.removeEventListener('click', currentToggleMenu)
      overlay?.removeEventListener('click', currentCloseMenu!)
      document.removeEventListener('keydown', currentEscHandler!)
      document.removeEventListener('click', currentClickOutsideHandler!)
    }
  })
}

function setFolderState(folderElement: HTMLElement, collapsed: boolean) {
  return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open")
}

function toggleCollapsedByPath(array: FolderState[], path: string) {
  // Ensure path comparison is case-insensitive
  const normalizedPath = path.toLowerCase();
  const entry = array.find((item) => item.path.toLowerCase() === normalizedPath)
  if (entry) {
    entry.collapsed = !entry.collapsed
    entry.path = normalizedPath; // Store normalized path in state
  }
}

// Store folder states before navigation
function getFolderStates() {
  const states = new Map<string, boolean>()
  document.querySelectorAll('[data-folderpath]').forEach((folder) => {
    const folderPath = folder.getAttribute('data-folderpath')
    if (folderPath) {
      const folderContainer = folder.parentElement?.nextElementSibling as HTMLElement
      if (folderContainer) {
        states.set(folderPath, folderContainer.classList.contains('open'))
      }
    }
  })
  return states
}

// Restore folder states after navigation
function restoreFolderStates(states: Map<string, boolean>) {
  states.forEach((isOpen, folderPath) => {
    const folder = document.querySelector(`[data-folderpath='${folderPath}']`)
    if (folder) {
      const folderContainer = folder.parentElement?.nextElementSibling as HTMLElement
      if (folderContainer) {
        if (isOpen) {
          folderContainer.classList.add('open')
          // Update the currentExplorerState to match
          const stateEntry = currentExplorerState.find(entry => entry.path === folderPath)
          if (stateEntry) {
            stateEntry.collapsed = false
          }
        } else {
          folderContainer.classList.remove('open')
          // Update the currentExplorerState to match
          const stateEntry = currentExplorerState.find(entry => entry.path === folderPath)
          if (stateEntry) {
            stateEntry.collapsed = true
          }
        }
      }
    }
  })
  // Save the updated state to localStorage
  localStorage.setItem("fileTree", JSON.stringify(currentExplorerState))
}

// *** Define the handler function for folder link clicks ***
function handleFolderLinkClick(e: Event) {
  // We know this event comes from an anchor link click in this context
  const link = e.currentTarget as HTMLAnchorElement;
  const href = link.getAttribute('href');
  
  // Prevent the global SPA handler from immediately navigating
  e.preventDefault();
  e.stopPropagation();

  const folderContainerDiv = link.closest('div[data-folderpath]');
  const folderOuterDiv = folderContainerDiv?.parentElement?.nextElementSibling as MaybeHTMLElement;
  const folderPath = folderContainerDiv?.getAttribute('data-folderpath');
  
  // Ensure path is lowercase for consistency
  const normalizedPath = folderPath?.toLowerCase();

  let stateChanged = false;
  if (folderOuterDiv && normalizedPath && currentExplorerState) {
    // Find the state entry using lowercase path
    const stateEntry = currentExplorerState.find(entry => entry.path.toLowerCase() === normalizedPath);
    
    // Check if it needs expanding
    if (!folderOuterDiv.classList.contains('open')) {
      // 1. Visually expand
      folderOuterDiv.classList.add("open");
      // 2. Update state array entry if found
      if (stateEntry) {
        stateEntry.collapsed = false; // Mark as open
        stateEntry.path = normalizedPath; // Store normalized path
      }
      stateChanged = true;
    } else {
      // Ensure state array reflects it's open even if visually it already was
      if (stateEntry && stateEntry.collapsed === true) {
         stateEntry.collapsed = false;
         stateEntry.path = normalizedPath; // Store normalized path
         stateChanged = true;
      }
    }
  }
  
  // Always save the potentially updated state before navigating
  if (currentExplorerState) {
    // DEBUGGING: Log state before saving in handleFolderLinkClick
    // console.log("handleFolderLinkClick: currentExplorerState before save:", currentExplorerState);
    // console.log("handleFolderLinkClick: localStorage BEFORE setItem:", localStorage.getItem("fileTree"));
    
    localStorage.setItem("fileTree", JSON.stringify(currentExplorerState));
    
    // console.log("handleFolderLinkClick: localStorage AFTER setItem:", localStorage.getItem("fileTree"));
  }

  // Trigger SPA navigation
  if (href) {
     // Use a small timeout if we just expanded to allow UI to update slightly
     // Might help avoid visual glitches, but can be removed if unnecessary.
     // setTimeout(() => {
       window.spaNavigate?.(new URL(href, window.location.origin));
     // }, didExpand ? 10 : 0);
  }
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  if (setupCompleted) return; // Prevent duplicate setup
  setupCompleted = true;
  
  // Set up explorer
  setupExplorer()
  
  // Handle back/forward browser navigation
  window.addEventListener('popstate', async (event) => {
    try {
      const response = await fetch(window.location.href)
      if (!response.ok) throw new Error('Failed to fetch page content')
      const html = await response.text()
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      const newContent = doc.querySelector('article.popover-hint')
      const currentContent = document.querySelector('article.popover-hint')
      
      if (currentContent && newContent) {
        currentContent.innerHTML = newContent.innerHTML
        
        const newTitle = doc.querySelector('title')
        if (newTitle) {
          document.title = newTitle.textContent || document.title
        }
        
        // Important: Restore folder states AFTER content update
        requestAnimationFrame(() => {
          if (event.state?.folderStates) {
            restoreFolderStates(new Map(event.state.folderStates))
          }
        })
      }
    } catch (error) {
      console.error('Error during navigation:', error)
      window.location.reload()
    }
  })

  // Set up mobile menu
  setupMobileMenu()
  
  // Observe the last explorer item
  const lastItem = document.getElementById("explorer-end")
  if (lastItem) {
    observer.observe(lastItem)
  }
})

// Handle navigation events
document.addEventListener('nav', () => {
  observer.disconnect()
  
  // --- Apply state directly from memory --- 
  if (currentExplorerState) {
    currentExplorerState.forEach((folderState) => {
      // Find the potentially new DOM element for this folder path (using lowercase)
      const folderLi = document.querySelector(
        `[data-folderpath='${folderState.path}']`,
      ) as MaybeHTMLElement
      const folderUl = folderLi?.parentElement?.nextElementSibling as MaybeHTMLElement
      if (folderUl) {
        // Apply the state stored in memory
        setFolderState(folderUl, folderState.collapsed)
      }
    })
  } else {
    // Fallback if state is somehow lost (shouldn't happen ideally)
    // If this happens, the state *was* lost before the nav event ran.
    console.warn("Explorer state missing on nav event, running full setup as fallback.")
    setupExplorer() 
  }
  // --- END APPLY STATE --- 

  // Still need to setup mobile menu and re-observe last item
  setupMobileMenu()
  const lastItem = document.getElementById("explorer-end")
  if (lastItem) {
    observer.observe(lastItem)
  }
})

// Handle window resize - use debouncing to prevent excessive calls
let resizeTimeout: number | null = null;
window.addEventListener("resize", () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
  
  resizeTimeout = window.setTimeout(() => {
    setupExplorer()
    setupMobileMenu()
    resizeTimeout = null;
  }, 250); // 250ms debounce
})
