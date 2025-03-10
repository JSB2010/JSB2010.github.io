/**
 * Immediate theme initialization to prevent flash of wrong theme
 * This script runs before the DOM is fully loaded
 */

(function() {
    // Get saved theme or default to auto
    const savedTheme = localStorage.getItem('theme-preference') || 'auto';
    
    // Remove any existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    
    // Apply the theme class
    document.documentElement.classList.add(`${savedTheme}-theme`);
    
    // For 'auto' theme, we don't need to do anything as the CSS will handle it
    console.log(`Initial theme set: ${savedTheme}`);
})();
