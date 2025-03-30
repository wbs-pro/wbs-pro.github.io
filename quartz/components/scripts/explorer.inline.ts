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
  toggleCollapsedByPath(currentExplorerState, fullFolderPath)
  const stringifiedFileTree = JSON.stringify(currentExplorerState)
  localStorage.setItem("fileTree", stringifiedFileTree)
}

function setupExplorer() {
  const explorer = document.getElementById("explorer")
  if (!explorer) return

  if (explorer.dataset.behavior === "collapse") {
    for (const item of document.getElementsByClassName(
      "folder-button",
    ) as HTMLCollectionOf<HTMLElement>) {
      item.addEventListener("click", toggleFolder)
      window.addCleanup(() => item.removeEventListener("click", toggleFolder))
    }
  }

  explorer.addEventListener("click", toggleExplorer)
  window.addCleanup(() => explorer.removeEventListener("click", toggleExplorer))

  for (const item of document.getElementsByClassName(
    "folder-icon",
  ) as HTMLCollectionOf<HTMLElement>) {
    item.addEventListener("click", toggleFolder)
    window.addCleanup(() => item.removeEventListener("click", toggleFolder))
  }

  const storageTree = localStorage.getItem("fileTree")
  const useSavedFolderState = explorer?.dataset.savestate === "true"
  const oldExplorerState: FolderState[] =
    storageTree && useSavedFolderState ? JSON.parse(storageTree) : []
  const oldIndex = new Map(oldExplorerState.map((entry) => [entry.path, entry.collapsed]))
  const newExplorerState: FolderState[] = explorer.dataset.tree
    ? JSON.parse(explorer.dataset.tree)
    : []
  currentExplorerState = []
  for (const { path, collapsed } of newExplorerState) {
    currentExplorerState.push({ path, collapsed: oldIndex.get(path) ?? collapsed })
  }

  currentExplorerState.map((folderState) => {
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
  const entry = array.find((item) => item.path === path)
  if (entry) {
    entry.collapsed = !entry.collapsed
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

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  if (setupCompleted) return; // Prevent duplicate setup
  setupCompleted = true;
  
  // Set up explorer
  setupExplorer()
  
  // Handle explorer link clicks to prevent full page reload
  const explorerContent = document.getElementById('explorer-content')
  if (explorerContent) {
    explorerContent.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href) {
        e.preventDefault()
        
        try {
          // Store current folder states before navigation
          const folderStates = getFolderStates()
          
          // Fetch the new page content
          const response = await fetch(link.href)
          if (!response.ok) throw new Error('Failed to fetch page content')
          const html = await response.text()
          
          // Create a temporary element to parse the HTML
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          
          // Find the article content in the new page
          const newContent = doc.querySelector('article.popover-hint')
          if (!newContent) throw new Error('Could not find article content')
          
          // Update the current page content
          const currentContent = document.querySelector('article.popover-hint')
          if (currentContent && newContent) {
            currentContent.innerHTML = newContent.innerHTML
            
            // Update URL without page reload
            history.pushState({
              folderStates: Array.from(folderStates.entries())
            }, '', link.href)
            
            // Update page title if available
            const newTitle = doc.querySelector('title')
            if (newTitle) {
              document.title = newTitle.textContent || document.title
            }
            
            // Important: Restore folder states AFTER content update
            requestAnimationFrame(() => {
              restoreFolderStates(folderStates)
            })
          }
        } catch (error) {
          console.error('Error during navigation:', error)
          // Fallback to traditional navigation on error
          window.location.href = link.href
        }
      }
    })
  }
  
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
  setupExplorer()
  setupMobileMenu()
  
  // Reobserve the last item
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
