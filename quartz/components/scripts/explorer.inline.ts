import { FolderState } from "../ExplorerNode"

type MaybeHTMLElement = HTMLElement | undefined
let currentExplorerState: FolderState[]

// Store event handlers globally
let currentToggleMenu: ((e?: Event) => void) | null = null
let currentCloseMenu: (() => void) | null = null
let currentEscHandler: ((e: KeyboardEvent) => void) | null = null
let currentClickOutsideHandler: ((e: MouseEvent) => void) | null = null

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
  }
  
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
  document.addEventListener('click', currentClickOutsideHandler)

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

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  setupExplorer()
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

// Handle window resize
window.addEventListener("resize", () => {
  setupExplorer()
  setupMobileMenu()
})
