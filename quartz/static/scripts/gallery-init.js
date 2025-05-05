// quartz/static/scripts/gallery-init.js

window.baguetteBoxInitialized = false;
window.baguetteBoxGalleriesData = [];
window.galleryAnimationStates = {}; // Store { galleryElement: { rafId: null, isPaused: false, scrollPos: 0, track: null, contentWidth: 0 } }

const PIXELS_PER_SECOND = 25;

function cleanupGalleryAnimations() {
  Object.values(window.galleryAnimationStates).forEach(state => {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }
  });
  window.galleryAnimationStates = {};
  // Also reset any cloned content if needed, though destroying/re-running setup handles this
}

function setupBaguetteBox() {
  if (typeof baguetteBox === 'undefined') {
    console.warn('BaguetteBox library not loaded yet. Retrying in 100ms...');
    setTimeout(setupBaguetteBox, 100);
    return;
  }

  const galleryElements = document.querySelectorAll('.gallery');

  // --- Cleanup Phase ---
  if (window.baguetteBoxInitialized) {
    try {
      document.querySelectorAll('[data-custom-baguettebox-listener-attached="true"]').forEach(el => {
        delete el.dataset.customBaguetteboxListenerAttached;
      });
      cleanupGalleryAnimations(); // Cleanup animations
      baguetteBox.destroy();
      window.baguetteBoxInitialized = false;
      window.baguetteBoxGalleriesData = [];
    } catch (e) {
      console.error('BaguetteBox destroy failed:', e);
      window.baguetteBoxInitialized = false;
      window.baguetteBoxGalleriesData = [];
    }
  }

  // --- Initialization, Listener Replacement, and Animation Setup Phase ---
  if (galleryElements.length > 0) {
    try {
      // --- PRE-CLEANUP: Remove existing clones before BaguetteBox runs ---
      galleryElements.forEach((gallery, index) => {
        const track = gallery.querySelector('.gallery-track');
        if (track && track.dataset.cloned === 'true') {
          console.log(`Gallery ${index}: Removing pre-existing clones.`);
          const totalChildren = track.children.length;
          const originalCount = totalChildren / 2;
          if (Number.isInteger(originalCount)) { // Make sure it's an even number
            // Remove children from the end backwards
            for (let i = totalChildren - 1; i >= originalCount; i--) {
              if (track.children[i]) {
                track.removeChild(track.children[i]);
              }
            }
          } else {
            console.warn(`Gallery ${index}: Track had odd number of children (${totalChildren}), cannot reliably remove clones.`);
            // Maybe try removing all children and letting markdown be source?
            // For now, just log and proceed.
          }
          delete track.dataset.cloned; // Reset cloned flag
        }
      });
      // --- End PRE-CLEANUP ---

      // --- Initialize BaguetteBox FIRST ---
      window.baguetteBoxGalleriesData = baguetteBox.run('.gallery', {});
      window.baguetteBoxInitialized = true;

      // --- Replace Event Listeners SECOND ---
      window.baguetteBoxGalleriesData.forEach((galleryArray, galleryIndex) => {
         if (!Array.isArray(galleryArray)) { return; }
         const galleryElement = galleryElements[galleryIndex]; // Get the actual DOM element for this gallery

         galleryArray.forEach((imageItem, imageIndex) => {
           if (!imageItem || !imageItem.imageElement || !imageItem.eventHandler) { return; }
           const linkElement = imageItem.imageElement;
           const originalHandler = imageItem.eventHandler;
           linkElement.removeEventListener('click', originalHandler);
           
           // Capture original index and the specific gallery element for the handler
           const originalImageIndex = imageIndex;
           const originalGalleryIndex = galleryIndex; // Keep track of which gallery data array to use

           const customClickHandler = (event) => {
             event.preventDefault(); event.stopPropagation();
             if (typeof baguetteBox === 'undefined') return;
             try {
               // Use the captured original index and the corresponding gallery data array captured before cloning
               const currentGalleryData = window.baguetteBoxGalleriesData[originalGalleryIndex];
               if (currentGalleryData) {
                 baguetteBox.show(originalImageIndex, currentGalleryData);
               } else {
                 console.warn(`BaguetteBox: Gallery data not found for index ${originalGalleryIndex}`);
               }
             } catch(e) { console.error(`Error calling baguetteBox.show(${originalImageIndex}):`, e); }
           };
           if (!linkElement.dataset.customBaguetteboxListenerAttached) {
             linkElement.addEventListener('click', customClickHandler);
             linkElement.dataset.customBaguetteboxListenerAttached = 'true';
           }
         });
      });
      // --- End Listener Replacement ---

      // --- Setup JS Animation and Cloning THIRD ---
      galleryElements.forEach((gallery, index) => {
          const track = gallery.querySelector('.gallery-track');
          if (!track || track.children.length === 0) {
              console.warn(`Gallery ${index} has no track or no children.`);
              return;
          }

          // Ensure we don't re-clone if setup is run multiple times without full cleanup
          if (!track.dataset.cloned) {
              const originalChildren = Array.from(track.children);
              originalChildren.forEach(child => {
                  const clone = child.cloneNode(true);
                  track.appendChild(clone);
              });
              track.dataset.cloned = 'true';
          }

          const originalContentWidth = track.scrollWidth / 2;
          if (originalContentWidth <= 0 || !Number.isFinite(originalContentWidth)) {
              console.warn(`Gallery ${index} track width calculation failed.`);
              return;
          }

          const animationState = {
              rafId: null,
              isPaused: false,
              isHoverPaused: false,
              isLightboxPaused: false,
              scrollPos: 0,
              lastTimestamp: 0,
              track: track,
              contentWidth: originalContentWidth
          };
          window.galleryAnimationStates[index] = animationState; // Use index as key for simplicity

          const animateScroll = (timestamp) => {
              if (!animationState.track) return; // Guard against edge cases during cleanup

              if (!animationState.lastTimestamp) animationState.lastTimestamp = timestamp;
              const deltaTime = (timestamp - animationState.lastTimestamp) / 1000; // seconds
              animationState.lastTimestamp = timestamp;

              // Check pause states
              animationState.isPaused = animationState.isHoverPaused || animationState.isLightboxPaused;

              if (!animationState.isPaused && deltaTime > 0) {
                  animationState.scrollPos += PIXELS_PER_SECOND * deltaTime;
                  // Wrap around seamlessly
                  if (animationState.scrollPos >= animationState.contentWidth) {
                      animationState.scrollPos -= animationState.contentWidth;
                  }
                  animationState.track.style.transform = `translateX(-${animationState.scrollPos}px)`;
              }

              // Request next frame only if not fully cleaned up
              if (window.galleryAnimationStates[index]) {
                 animationState.rafId = requestAnimationFrame(animateScroll);
              }
          };

          gallery.addEventListener('mouseenter', () => {
              if (window.galleryAnimationStates[index]) {
                  window.galleryAnimationStates[index].isHoverPaused = true;
              }
          });

          gallery.addEventListener('mouseleave', () => {
              if (window.galleryAnimationStates[index]) {
                  window.galleryAnimationStates[index].isHoverPaused = false;
                  // Reset timestamp to avoid jump after pause
                  window.galleryAnimationStates[index].lastTimestamp = 0;
              }
          });

          // Initial call
          animationState.rafId = requestAnimationFrame(animateScroll);
      });
      // --- End JS Animation Setup ---

    } catch (e) {
      console.error('BaguetteBox run() or listener/animation setup failed:', e);
      window.baguetteBoxInitialized = false;
      window.baguetteBoxGalleriesData = [];
    }
  } else {
  }
}

// Expose the setup function globally if needed, or rely on event listeners below
// window.setupBaguetteBox = setupBaguetteBox;

// --- Event Listeners to Trigger Setup ---

// Use requestAnimationFrame for potentially smoother DOM interaction after nav
function runSetupSafely() {
  requestAnimationFrame(() => {
     setTimeout(setupBaguetteBox, 0);
  });
}

window.addEventListener('load', runSetupSafely);
document.addEventListener('nav', runSetupSafely);

// --- Observer for Lightbox Pause ---
const lightboxObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const isLightboxOpen = document.body.classList.contains('baguetteBox-open');
            Object.values(window.galleryAnimationStates).forEach(state => {
                if (state) {
                    state.isLightboxPaused = isLightboxOpen;
                    if (!isLightboxOpen) {
                        // Reset timestamp to avoid jump after pause
                        state.lastTimestamp = 0;
                    }
                }
            });
        }
    }
});

lightboxObserver.observe(document.body, { attributes: true });
// --- End Observer --- 