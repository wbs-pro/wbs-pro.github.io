// quartz/static/scripts/gallery-init.js

window.baguetteBoxInitialized = false;
window.baguetteBoxGalleriesData = [];

function setupBaguetteBox() {
  // Ensure BaguetteBox library is loaded
  if (typeof baguetteBox === 'undefined') {
    console.warn('BaguetteBox library not loaded yet. Retrying in 100ms...');
    // Optional: retry if library loads asynchronously
    setTimeout(setupBaguetteBox, 100);
    return;
  }

  const galleryElements = document.querySelectorAll('.gallery');

  // --- Cleanup Phase ---
  if (window.baguetteBoxInitialized) {
    console.log('Destroying previous BaguetteBox instance...');
    try {
      // Clear custom listener flags before destroying
      document.querySelectorAll('[data-custom-baguettebox-listener-attached=\"true\"]').forEach(el => {
        delete el.dataset.customBaguetteboxListenerAttached;
      });
      baguetteBox.destroy(); // Should remove overlay and listeners added by run()
      window.baguetteBoxInitialized = false;
      window.baguetteBoxGalleriesData = []; // Clear stored data
    } catch (e) {
      console.error('BaguetteBox destroy failed:', e);
      // Force clear flags even if destroy fails
      window.baguetteBoxInitialized = false;
      window.baguetteBoxGalleriesData = [];
    }
  }

  // --- Initialization and Listener Replacement Phase ---
  if (galleryElements.length > 0) {
    console.log('Found galleries, initializing BaguetteBox...');
    try {
      // Initialize BaguetteBox - creates overlay, structures, attaches default listeners
      window.baguetteBoxGalleriesData = baguetteBox.run('.gallery', {
        // Add any desired options here, e.g., animation: 'fadeIn'
      });
      window.baguetteBoxInitialized = true;
      console.log('BaguetteBox run() complete. Galleries data count:', window.baguetteBoxGalleriesData.length);

      // --- Replace Event Listeners ---
      window.baguetteBoxGalleriesData.forEach((galleryArray, galleryIndex) => {
        console.log(`Processing gallery index ${galleryIndex}`);
        if (!Array.isArray(galleryArray)) {
          console.warn(`Gallery data at index ${galleryIndex} is not an array:`, galleryArray);
          return;
        }

        galleryArray.forEach((imageItem, imageIndex) => {
          if (!imageItem || !imageItem.imageElement || !imageItem.eventHandler) {
            console.warn(`Invalid imageItem at [gallery:${galleryIndex}, image:${imageIndex}]:`, imageItem);
            return;
          }

          const linkElement = imageItem.imageElement;
          const originalHandler = imageItem.eventHandler;

          // Remove the default listener added by baguetteBox.run()
          linkElement.removeEventListener('click', originalHandler);
          console.log(`Removed default listener for image ${imageIndex} in gallery ${galleryIndex}`);

          // Define our custom listener
          const customClickHandler = (event) => {
            event.preventDefault();
            event.stopPropagation(); // Crucial to stop SPA router

            console.log(`Custom click handler fired for image ${imageIndex} in gallery ${galleryIndex}`);

            if (typeof baguetteBox === 'undefined') {
              console.error('BaguetteBox disappeared before show() could be called.');
              return;
            }

            // Call baguetteBox.show() with the correct index and the specific gallery array
            try {
              // Find the *current* gallery array in the stored data just in case
              const currentGalleryData = window.baguetteBoxGalleriesData[galleryIndex];
              if (currentGalleryData) {
                baguetteBox.show(imageIndex, currentGalleryData);
                console.log(`baguetteBox.show(${imageIndex}) called successfully.`);
              } else {
                console.error('Could not find gallery data for index', galleryIndex);
              }
            } catch (e) {
              console.error(`Error calling baguetteBox.show(${imageIndex}):`, e);
            }
          };

          // Add the custom handler only if not already marked
          if (!linkElement.dataset.customBaguetteboxListenerAttached) {
            linkElement.addEventListener('click', customClickHandler);
            linkElement.dataset.customBaguetteboxListenerAttached = 'true'; // Mark as attached
            console.log(`Added custom listener for image ${imageIndex} in gallery ${galleryIndex}`);
          } else {
            console.log(`Custom listener already attached for image ${imageIndex} in gallery ${galleryIndex}`);
          }
        });
      });

    } catch (e) {
      console.error('BaguetteBox run() or listener setup failed:', e);
      window.baguetteBoxInitialized = false;
      window.baguetteBoxGalleriesData = [];
    }
  } else {
    console.log('No .gallery elements found on this page.');
    // Cleanup handled by destroy() call at the beginning if needed
  }
}

// Expose the setup function globally if needed, or rely on event listeners below
// window.setupBaguetteBox = setupBaguetteBox;

// --- Event Listeners to Trigger Setup ---

// Use requestAnimationFrame for potentially smoother DOM interaction after nav
function runSetupSafely() {
  // Add a small delay with RAF to further ensure DOM is settled after nav event
  requestAnimationFrame(() => {
     setTimeout(setupBaguetteBox, 0); // Execute in next event loop tick after paint
  });
}

window.addEventListener('load', runSetupSafely);
document.addEventListener('nav', runSetupSafely); 