// EMERGENCY OVERLAY KILLER - Run this before anything else
(function() {
  // Run immediately
  function killAllOverlays() {
    console.log("🔥 EMERGENCY OVERLAY KILLER ACTIVATED");
    
    // Force mountain background to be visible with extreme z-index
    const darkMountain = document.querySelector('.dark-theme-mountain') || createEmergencyDarkMountain();
    
    // Apply critical inline styles
    darkMountain.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(to bottom, #0f0221 0%, #0c1339 30%, #081c51 70%, #102346 100%) !important;
      z-index: -1 !important; 
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: none !important;
    `;
    
    // Remove any body::before or other potential overlay elements
    const killOverlays = document.createElement('style');
    killOverlays.textContent = `
      body::before, body::after, 
      html::before, html::after,
      main::before, main::after,
      .themed-background::before, .themed-background::after,
      div[class*="theme"]::before, div[class*="theme"]::after,
      [class*="overlay"], [class*="Overlay"], 
      [class*="background"]:not(.mountain-background):not(.dark-theme-mountain):not(.light-theme-mountain),
      [class*="Background"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        content: none !important;
        background: none !important;
      }
      
      body, html, main, .content-main {
        background-color: transparent !important;
        background-image: none !important;
      }
      
      /* Force all content above the background */
      main, .content-main, header, footer, section, article, .card-container {
        position: relative !important;
        z-index: 10 !important;
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(killOverlays);
    
    // Fix z-index stacking for all major containers
    document.querySelectorAll('.content-main, main, section, .card-container').forEach(el => {
      el.style.cssText += 'position: relative !important; z-index: 10 !important; background-color: transparent !important;';
    });
  }
  
  function createEmergencyDarkMountain() {
    console.log("Creating emergency dark mountain background");
    const darkMountain = document.createElement('div');
    darkMountain.className = 'dark-theme-mountain';
    document.body.prepend(darkMountain); // Insert at the beginning of body
    return darkMountain;
  }
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', killAllOverlays);
  } else {
    killAllOverlays();
  }
  
  // Also run after window load as a backup
  window.addEventListener('load', killAllOverlays);
  
  // Re-run after a short delay to catch dynamic elements
  setTimeout(killAllOverlays, 500);
})();
