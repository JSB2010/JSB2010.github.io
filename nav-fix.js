/**
 * Direct JavaScript fix for navigation menu transparency in dark mode
 * This script directly applies inline styles which override all CSS rules
 */
(function() {
  // Function to fix dark mode nav menu transparency
  function fixDarkModeNavMenu() {
    // Check if we're in dark mode
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!isDarkMode) return;

    // Get the nav menu
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // DESKTOP MODE: Set the nav menu to be completely transparent
    if (window.innerWidth > 1000) {
      navMenu.style.setProperty('background', 'transparent', 'important');
      navMenu.style.setProperty('background-color', 'transparent', 'important');
      navMenu.style.setProperty('backdrop-filter', 'none', 'important');
      navMenu.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
      navMenu.style.setProperty('box-shadow', 'none', 'important');
      navMenu.style.setProperty('border', 'none', 'important');
    }
    // MOBILE MODE: Only set background when mobile menu is shown
    else if (navMenu.classList.contains('show')) {
      navMenu.style.setProperty('background', 'rgba(15, 23, 42, 0.9)', 'important');
      navMenu.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
      navMenu.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
      navMenu.style.setProperty('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.3)', 'important');
      navMenu.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.1)', 'important');
    }
  }

  // Run the fix immediately
  fixDarkModeNavMenu();

  // Run it again after a small delay to catch any post-loading changes
  setTimeout(fixDarkModeNavMenu, 500);

  // And again just to be thorough
  setTimeout(fixDarkModeNavMenu, 1000);
  
  // Also run when window is resized
  window.addEventListener('resize', fixDarkModeNavMenu);
  
  // Run when mobile menu is toggled
  document.addEventListener('click', function(e) {
    // If clicked element is the mobile menu button or its children
    if (e.target.closest('.dropdown-toggle')) {
      // Wait a moment for menu toggle to complete
      setTimeout(fixDarkModeNavMenu, 50);
    }
  });
  
  // Handle dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fixDarkModeNavMenu);

  // Bonus: Listen for DOM mutations to catch any dynamic changes
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.classList && (
            mutation.target.classList.contains('nav-menu') || 
            mutation.target.classList.contains('show'))) {
          fixDarkModeNavMenu();
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      attributes: true,
      childList: true,
      subtree: true
    });
  }
})();
