/**
 * Theme Manager - Centralized theme handling
 * Coordinates theme switching between components
 */

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get saved theme or default to auto
    const savedTheme = localStorage.getItem('theme-preference') || 'auto';
    applyTheme(savedTheme);
    
    // Listen for theme change events (from footer buttons or other sources)
    document.addEventListener('theme-change', function(e) {
        if (e.detail && e.detail.theme) {
            console.log(`Theme change event received: ${e.detail.theme}`);
            applyTheme(e.detail.theme);
        }
    });
    
    // Set up footer theme buttons after footer loads
    const observer = new MutationObserver(function() {
        if (document.getElementById('footer') && document.getElementById('light-mode')) {
            console.log('Footer and theme buttons detected in DOM');
            setupThemeButtons();
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});

/**
 * Apply theme to document and dispatch theme-applied event
 * @param {string} theme - 'light', 'dark', or 'auto'
 */
function applyTheme(theme) {
    console.log(`Applying theme: ${theme}`);
    
    // Remove existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    
    // Add new theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Store preference
    localStorage.setItem('theme-preference', theme);
    
    // Notify other scripts that theme has been applied
    document.dispatchEvent(new CustomEvent('theme-applied', { 
        detail: { theme: theme }
    }));
    
    // Update UI if footer buttons exist
    if (document.getElementById('light-mode')) {
        updateThemeButtonStates(theme);
    }
}

/**
 * Set up theme switcher buttons in footer
 */
function setupThemeButtons() {
    const lightButton = document.getElementById('light-mode');
    const darkButton = document.getElementById('dark-mode');
    const autoButton = document.getElementById('auto-mode');
    
    if (!lightButton || !darkButton || !autoButton) {
        console.warn('Theme buttons not found in the DOM');
        return;
    }
    
    // Remove any existing click handlers using clone technique
    const newLightButton = lightButton.cloneNode(true);
    const newDarkButton = darkButton.cloneNode(true);
    const newAutoButton = autoButton.cloneNode(true);
    
    lightButton.parentNode.replaceChild(newLightButton, lightButton);
    darkButton.parentNode.replaceChild(newDarkButton, darkButton);
    autoButton.parentNode.replaceChild(newAutoButton, autoButton);
    
    // Set initial active state
    updateThemeButtonStates(localStorage.getItem('theme-preference') || 'auto');
    
    // Add click handlers
    newLightButton.addEventListener('click', function() {
        console.log('Light theme button clicked');
        applyTheme('light');
    });
    
    newDarkButton.addEventListener('click', function() {
        console.log('Dark theme button clicked');
        applyTheme('dark');
    });
    
    newAutoButton.addEventListener('click', function() {
        console.log('Auto theme button clicked');
        applyTheme('auto');
    });
    
    console.log('Theme buttons initialized');
}

/**
 * Update active states of theme buttons
 * @param {string} activeTheme - Current theme
 */
function updateThemeButtonStates(activeTheme) {
    const lightButton = document.getElementById('light-mode');
    const darkButton = document.getElementById('dark-mode');
    const autoButton = document.getElementById('auto-mode');
    
    if (!lightButton || !darkButton || !autoButton) {
        console.warn('Theme buttons not found when trying to update states');
        return;
    }
    
    // Remove active class from all buttons
    lightButton.classList.remove('active');
    darkButton.classList.remove('active');
    autoButton.classList.remove('active');
    
    // Add active class to current theme button
    if (activeTheme === 'light') {
        lightButton.classList.add('active');
    } else if (activeTheme === 'dark') {
        darkButton.classList.add('active');
    } else {
        autoButton.classList.add('active');
    }
    
    console.log(`Button state updated: ${activeTheme} mode is now active`);
}

// Expose a global method for other scripts to change theme
window.setTheme = function(theme) {
    applyTheme(theme);
};

// Also expose the function to update button states globally
window.updateThemeButtonStates = updateThemeButtonStates;
