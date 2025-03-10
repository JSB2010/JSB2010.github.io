/**
 * Theme Helper - Ensures theme is properly applied on all pages
 * This script is designed to be loaded on every page after theme-manager.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme immediately on DOM content loaded
    try {
        const savedTheme = localStorage.getItem('theme-preference') || 'auto';
        console.log('Theme helper - initial theme check: ' + savedTheme);
        
        if (window.setTheme) {
            window.setTheme(savedTheme);
        } else {
            console.warn('window.setTheme not available yet - will try again later');
            // Apply directly as fallback
            document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
            document.documentElement.classList.add(`${savedTheme}-theme`);
        }
    } catch (error) {
        console.error('Error in theme helper initial application:', error);
    }
    
    // Ensure theme buttons are properly set up once the page has loaded completely
    window.addEventListener('load', function() {
        // Wait a bit to ensure footer has fully loaded
        setTimeout(function() {
            try {
                const savedTheme = localStorage.getItem('theme-preference') || 'auto';
                console.log('Theme helper - load event check: ' + savedTheme);
                
                if (window.setTheme) {
                    window.setTheme(savedTheme);
                    console.log('Theme applied via window.setTheme');
                } else {
                    console.warn('window.setTheme still not available after page load');
                }
                
                // Add direct click handlers to buttons as failsafe
                addDirectThemeButtonHandlers();
            } catch (error) {
                console.error('Error in theme helper load handler:', error);
            }
        }, 500);
    });
    
    // Listen for footer loaded event from common.js
    document.addEventListener('header-footer-loaded', function() {
        try {
            const savedTheme = localStorage.getItem('theme-preference') || 'auto';
            console.log('Header/footer loaded event - applying theme: ' + savedTheme);
            
            if (window.setTheme) {
                window.setTheme(savedTheme);
            } else {
                console.warn('window.setTheme not available during header-footer-loaded event');
            }
            
            // Add direct click handlers to buttons as failsafe
            setTimeout(addDirectThemeButtonHandlers, 100);
        } catch (error) {
            console.error('Error in theme helper header-footer event:', error);
        }
    });
    
    /**
     * Add direct click handlers to theme buttons as a failsafe
     */
    function addDirectThemeButtonHandlers() {
        const lightButton = document.getElementById('light-mode');
        const darkButton = document.getElementById('dark-mode');
        const autoButton = document.getElementById('auto-mode');
        
        if (!lightButton || !darkButton || !autoButton) {
            console.warn('Theme buttons not found for direct handlers');
            return;
        }
        
        console.log('Adding direct theme button handlers');
        
        lightButton.onclick = function() {
            console.log('Direct handler: Light theme clicked');
            applyThemeDirectly('light');
        };
        
        darkButton.onclick = function() {
            console.log('Direct handler: Dark theme clicked');
            applyThemeDirectly('dark');
        };
        
        autoButton.onclick = function() {
            console.log('Direct handler: Auto theme clicked');
            applyThemeDirectly('auto');
        };
    }
    
    /**
     * Apply theme directly if the normal method fails
     */
    function applyThemeDirectly(theme) {
        try {
            // First try to use the proper method
            if (window.setTheme) {
                window.setTheme(theme);
                return;
            }
            
            // Fallback implementation
            document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
            document.documentElement.classList.add(`${theme}-theme`);
            localStorage.setItem('theme-preference', theme);
            
            // Update button states if possible
            if (window.updateThemeButtonStates) {
                window.updateThemeButtonStates(theme);
            } else {
                // Manual button state update
                const buttons = {
                    light: document.getElementById('light-mode'),
                    dark: document.getElementById('dark-mode'),
                    auto: document.getElementById('auto-mode')
                };
                
                if (buttons.light && buttons.dark && buttons.auto) {
                    buttons.light.classList.remove('active');
                    buttons.dark.classList.remove('active');
                    buttons.auto.classList.remove('active');
                    buttons[theme].classList.add('active');
                }
            }
            
            // Notify other scripts
            document.dispatchEvent(new CustomEvent('theme-applied', { 
                detail: { theme: theme }
            }));
            
            console.log(`Theme applied directly: ${theme}`);
        } catch (error) {
            console.error('Error in direct theme application:', error);
        }
    }
});
