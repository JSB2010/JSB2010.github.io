/**
 * Global navigation transparency fix for all pages
 * Uses multiple approaches to ensure consistent transparency
 */
(function() {
  // Function to fix dark mode nav menu transparency
  function fixDarkModeNavMenu() {
    // Check if we're in dark mode
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get the nav menu and header
    const navMenu = document.querySelector('.nav-menu');
    const mainNav = document.querySelector('.main-nav');
    const navElement = document.querySelector('header.main-nav nav');
    
    if (!navMenu || !mainNav) return;

    // Apply styles based on screen width and dark mode state
    if (window.innerWidth > 1100) {
      // Updated breakpoint to match CSS
      if (isDarkMode) {
        // Dark mode desktop - transparent menu, semi-transparent header
        mainNav.style.setProperty('background', 'rgba(15, 23, 42, 0.5)', 'important');
        mainNav.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
        mainNav.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
        mainNav.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.1)', 'important');
        
        // Make the nav element transparent
        if (navElement) {
          navElement.style.setProperty('background', 'transparent', 'important');
          navElement.style.setProperty('background-color', 'transparent', 'important');
        }
        
        // Ensure desktop menu is completely transparent
        navMenu.style.setProperty('background', 'transparent', 'important');
        navMenu.style.setProperty('background-color', 'transparent', 'important');
        navMenu.style.setProperty('backdrop-filter', 'none', 'important');
        navMenu.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
        navMenu.style.setProperty('box-shadow', 'none', 'important');
        navMenu.style.setProperty('border', 'none', 'important');
        
        // Make each list item transparent
        document.querySelectorAll('.nav-menu li').forEach(item => {
          item.style.setProperty('background', 'transparent', 'important');
          item.style.setProperty('background-color', 'transparent', 'important');
          
          // Make each link transparent but visible
          const link = item.querySelector('a');
          if (link) {
            link.style.setProperty('background', 'transparent', 'important');
            link.style.setProperty('background-color', 'transparent', 'important');
          }
        });
      } else {
        // Light mode desktop - keep original styling or apply light mode styling
        mainNav.style.removeProperty('background');
        mainNav.style.removeProperty('backdrop-filter');
        mainNav.style.removeProperty('-webkit-backdrop-filter');
        
        // Light mode desktop - ensure proper text contrast
        navMenu.querySelectorAll('li a').forEach(link => {
          link.style.setProperty('color', 'var(--primary-color)', 'important');
          
          // If this is the active page, use secondary color
          if (link.classList.contains('active-page')) {
            link.style.setProperty('color', 'var(--secondary-color)', 'important');
            link.style.setProperty('font-weight', '600', 'important');
            link.style.setProperty('border-bottom', '2px solid var(--secondary-color)', 'important');
          }
          
          // Set hover styles via event listeners for better JS control
          link.addEventListener('mouseenter', function() {
            this.style.setProperty('background-color', 'var(--secondary-color)', 'important'); // Green background
            this.style.setProperty('color', 'white', 'important');
          });
          
          link.addEventListener('mouseleave', function() {
            this.style.setProperty('background-color', '', '');
            this.style.setProperty('color', this.classList.contains('active-page') ? 
              'var(--secondary-color)' : 'var(--primary-color)', 'important');
          });
        });
      }
    } else if (isDarkMode) {
      // Mobile dark mode - keep header styling but menu will be handled by toggle
      mainNav.style.setProperty('background', 'rgba(15, 23, 42, 0.5)', 'important');
      mainNav.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
      mainNav.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
    }
  }

  // Run the fix immediately
  fixDarkModeNavMenu();
  
  // Also run after small delay to ensure it catches dynamically loaded elements
  setTimeout(fixDarkModeNavMenu, 100);
  setTimeout(fixDarkModeNavMenu, 500);
  
  // Run the fix when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fixDarkModeNavMenu);
  
  // Run after complete page load
  window.addEventListener('load', fixDarkModeNavMenu);
  
  // Run when window is resized
  window.addEventListener('resize', fixDarkModeNavMenu);
  
  // Handle dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', fixDarkModeNavMenu);
    
  // Also run when navigation elements might be dynamically inserted
  document.addEventListener('header-footer-loaded', fixDarkModeNavMenu);
  
  // Create a mutation observer to watch for nav menu changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        fixDarkModeNavMenu();
      }
    });
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
})();
