/**
 * Minimal Dark Mode Fix - Removes overlay without breaking content
 */
(function() {
  console.log("🔧 Minimal dark mode fix running");
  
  // Function to run when DOM is ready
  function fixDarkMode() {
    // 1. Create dark background if it doesn't exist
    ensureDarkBackground();
    
    // 2. Make content visible by fixing z-index
    fixContentVisibility();
    
    // 3. Remove only specific overlays
    removeOverlays();
  }
  
  function ensureDarkBackground() {
    if (!document.querySelector('.dark-theme-mountain')) {
      const darkBg = document.createElement('div');
      darkBg.className = 'dark-theme-mountain';
      darkBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #0f0221 0%, #0c1339 30%, #081c51 70%, #102346 100%);
        z-index: -1;
        pointer-events: none;
      `;
      document.body.insertBefore(darkBg, document.body.firstChild);
      console.log("Created dark background");
    }
  }
  
  function fixContentVisibility() {
    // Ensure content is visible (but not the navigation which should work normally)
    document.querySelectorAll('main, .content-main, section, .card-container').forEach(el => {
      el.style.position = 'relative';
      el.style.zIndex = '1';
      el.style.backgroundColor = 'transparent';
    });
  }
  
  function removeOverlays() {
    // Only remove specific overlays that could be causing problems
    const style = document.createElement('style');
    style.textContent = `
      /* Remove specific overlays */
      body::before,
      .themed-background::before,
      div.overlay,
      div.dark-overlay {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        content: none !important;
        background: none !important;
      }
      
      /* Ensure body and HTML are transparent */
      html.dark-theme,
      html.visual-dark-mode,
      body.dark-theme,
      body.visual-dark-mode,
      body.themed-background {
        background-color: transparent !important;
        background-image: none !important;
      }
      
      /* Make sure dark theme mountain is visible */
      html.dark-theme .dark-theme-mountain,
      html.visual-dark-mode .dark-theme-mountain {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixDarkMode);
  } else {
    fixDarkMode();
  }
  
  // Also run after load
  window.addEventListener('load', fixDarkMode);
})();
