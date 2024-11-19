document.addEventListener('DOMContentLoaded', () => {
  function updateTutorialTarget() {
    const explorerStep = document.querySelector('[data-tutorial-step="explorer"]')
    if (!explorerStep) return
    
    if (window.innerWidth <= 750) {
      explorerStep.setAttribute('data-tutorial-target', 'mobile-explorer')
    } else {
      explorerStep.setAttribute('data-tutorial-target', 'explorer')
    }
  }

  // Initial setup
  updateTutorialTarget()
  
  // Update on resize
  window.addEventListener('resize', updateTutorialTarget)
  window.addCleanup(() => window.removeEventListener('resize', updateTutorialTarget))
}) 