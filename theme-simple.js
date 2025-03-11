/**
 * Simple Theme Handler - Final Fix
 * Single script to handle theme selection consistently across all pages
 */
(function() {
    // Get theme from localStorage - default to auto
    const currentTheme = localStorage.getItem('theme-preference') || 'auto';
    
    // Apply theme class to HTML element immediately
    applyThemeClasses(currentTheme);
    
    // Apply initial inline styles to prevent flash
    applyInlineStyles(currentTheme);
    
    // Set up handlers once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also set up when page is fully loaded
    window.addEventListener('load', init);
    
    function init() {
        console.log('Theme system initializing...');
        
        // Try to set up buttons
        setupThemeButtons();
        
        // Watch for dynamically loaded footer
        watchForFooter();
        
        // Set up system preference change listener
        setupSystemListener();
        
        // Ensure any theme-specific visual elements are correctly shown
        ensureThemeVisuals();
    }
    
    function applyThemeClasses(theme) {
        // Remove existing theme classes
        document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
        
        // Add new theme class
        document.documentElement.classList.add(theme + '-theme');
        
        // IMPORTANT: Also add actual visual mode class to ensure consistent styling
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (theme === 'dark' || (theme === 'auto' && prefersDarkMode)) {
            document.documentElement.classList.add('visual-dark-mode');
            document.documentElement.classList.remove('visual-light-mode');
        } else {
            document.documentElement.classList.add('visual-light-mode');
            document.documentElement.classList.remove('visual-dark-mode');
        }
        
        // Set color-scheme
        if (theme === 'light') {
            document.documentElement.style.colorScheme = 'light';
        } else if (theme === 'dark') {
            document.documentElement.style.colorScheme = 'dark';
        } else {
            // Auto - detect from system
            document.documentElement.style.colorScheme = prefersDarkMode ? 'dark' : 'light';
        }
    }
    
    function applyInlineStyles(theme) {
        // Create or get existing style element
        let styleEl = document.getElementById('theme-inline-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'theme-inline-styles';
            document.head.appendChild(styleEl);
        }
        
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isVisualDarkMode = theme === 'dark' || (theme === 'auto' && prefersDarkMode);
        
        if (theme === 'light') {
            styleEl.textContent = `
                html, body { 
                    background-color: #ffffff !important; 
                    color: #333333 !important; 
                }
                @media (prefers-color-scheme: dark) {
                    html, body, main, .content-main { 
                        background-color: #ffffff !important; 
                        color: #333333 !important;
                    }
                    * { forced-color-adjust: none !important; }
                }
                
                /* Hide dark-mode specific elements */
                .dark-mode-only, .extra-stars, .dark-theme-mountain {
                    display: none !important;
                }
                
                /* Show light-mode specific elements */
                .light-mode-only, .light-theme-mountain {
                    display: block !important;
                }
            `;
        } else if (isVisualDarkMode) {
            // Use the same styling for both dark theme and auto+dark
            styleEl.textContent = `
                html, body { 
                    background-color: #121212 !important; 
                    color: #f1f1f1 !important; 
                }
                
                /* Force all visual dark mode styles whether it's dark theme or auto+dark */
                html, body, main, .content-main { 
                    background-color: #121212 !important; 
                    color: #f1f1f1 !important;
                }
                
                /* Show dark-mode specific elements */
                .dark-mode-only, .extra-stars, .dark-theme-mountain {
                    display: block !important;
                }
                
                /* Hide light-mode specific elements */
                .light-mode-only, .light-theme-mountain {
                    display: none !important;
                }
                
                /* Enhance stars for dark mode */
                .star {
                    opacity: 0.9 !important;
                    box-shadow: 0 0 5px rgba(255, 255, 255, 0.9) !important;
                }
                
                /* Ensure dark mode frosted glass header */
                .main-nav {
                    background: rgba(15, 23, 42, 0.8) !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                }
            `;
        } else {
            // Auto theme with light mode - clean up styles and let CSS handle it
            styleEl.textContent = `
                /* Hide dark-mode specific elements */
                .dark-mode-only, .extra-stars, .dark-theme-mountain {
                    display: none !important;
                }
                
                /* Show light-mode specific elements */
                .light-mode-only, .light-theme-mountain {
                    display: block !important;
                }
                
                /* Ensure light mode frosted glass header */
                .main-nav {
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
                }
            `;
        }
    }
    
    function setupThemeButtons() {
        const lightButton = document.getElementById('light-mode');
        const darkButton = document.getElementById('dark-mode');
        const autoButton = document.getElementById('auto-mode');
        
        if (!lightButton || !darkButton || !autoButton) {
            return false;
        }
        
        console.log('Found theme buttons, setting up handlers');
        
        // First update button active states
        updateButtonStates(currentTheme);
        
        // Replace with clones to remove any existing handlers
        const newLightBtn = lightButton.cloneNode(true);
        const newDarkBtn = darkButton.cloneNode(true);
        const newAutoBtn = autoButton.cloneNode(true);
        
        lightButton.parentNode.replaceChild(newLightBtn, lightButton);
        darkButton.parentNode.replaceChild(newDarkBtn, darkButton);
        autoButton.parentNode.replaceChild(newAutoBtn, autoButton);
        
        // Add direct handlers
        newLightBtn.onclick = function(e) {
            e.preventDefault();
            changeTheme('light');
        };
        
        newDarkBtn.onclick = function(e) {
            e.preventDefault();
            changeTheme('dark');
        };
        
        newAutoBtn.onclick = function(e) {
            e.preventDefault();
            changeTheme('auto');
        };
        
        return true;
    }
    
    function updateButtonStates(theme) {
        const lightButton = document.getElementById('light-mode');
        const darkButton = document.getElementById('dark-mode');
        const autoButton = document.getElementById('auto-mode');
        
        if (!lightButton || !darkButton || !autoButton) {
            return;
        }
        
        console.log('Updating button states to: ' + theme);
        
        // Remove active class from all buttons
        lightButton.classList.remove('active');
        darkButton.classList.remove('active');
        autoButton.classList.remove('active');
        
        // Add active class to current theme
        if (theme === 'light') {
            lightButton.classList.add('active');
        } else if (theme === 'dark') {
            darkButton.classList.add('active');
        } else {
            autoButton.classList.add('active');
        }
    }
    
    function watchForFooter() {
        // Use MutationObserver to watch for footer being loaded
        const observer = new MutationObserver(function(mutations) {
            const buttons = document.querySelectorAll('#light-mode, #dark-mode, #auto-mode');
            if (buttons.length === 3) {
                setupThemeButtons();
                observer.disconnect();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Also set up a recurring check as a fallback
        let checkCount = 0;
        const interval = setInterval(function() {
            if (setupThemeButtons()) {
                clearInterval(interval);
            }
            if (++checkCount > 20) {
                clearInterval(interval);
            }
        }, 250);
    }
    
    function setupSystemListener() {
        // Listen for system preference changes (for auto mode)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            const theme = localStorage.getItem('theme-preference') || 'auto';
            if (theme === 'auto') {
                // Just update color scheme
                document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
                ensureThemeVisuals();
            }
        });
    }
    
    function changeTheme(theme) {
        console.log('Changing theme to: ' + theme);
        
        // Store preference
        localStorage.setItem('theme-preference', theme);
        
        // Apply immediately
        applyThemeClasses(theme);
        applyInlineStyles(theme);
        updateButtonStates(theme);
        ensureThemeVisuals();
        
        // Force reload to ensure all CSS is applied properly
        const url = new URL(window.location.href);
        url.searchParams.set('theme', theme);
        url.searchParams.set('t', Date.now());
        window.location.href = url.toString();
    }
    
    function ensureThemeVisuals() {
        // Make sure all theme-specific visual elements are correctly shown based on current visual mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const isVisualDarkMode = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDarkMode);
        
        // Mark the body with a data attribute for easier CSS targeting
        document.body.dataset.visualMode = isVisualDarkMode ? 'dark' : 'light';
        
        // Update any theme-specific elements with JavaScript
        if (window.updateThemeElements) {
            window.updateThemeElements(isVisualDarkMode);
        }
    }
    
    // Make these functions available globally for other scripts
    window.ThemeManager = {
        getTheme: function() {
            return localStorage.getItem('theme-preference') || 'auto';
        },
        setTheme: changeTheme,
        updateButtons: updateButtonStates,
        isVisualDarkMode: function() {
            const theme = localStorage.getItem('theme-preference') || 'auto';
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return theme === 'dark' || (theme === 'auto' && prefersDarkMode);
        }
    };
    
    // Add a utility function for theme elements
    window.updateThemeElements = function(isDark) {
        // Show/hide theme-specific elements
        const darkElems = document.querySelectorAll('.dark-mode-only, .extra-stars, .dark-theme-mountain');
        const lightElems = document.querySelectorAll('.light-mode-only, .light-theme-mountain');
        
        darkElems.forEach(el => el.style.display = isDark ? 'block' : 'none');
        lightElems.forEach(el => el.style.display = isDark ? 'none' : 'block');
        
        // Update star elements if they exist
        const stars = document.querySelectorAll('.star');
        if (stars.length > 0) {
            stars.forEach(star => {
                if (isDark) {
                    star.style.opacity = '0.9';
                    star.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.9)';
                } else {
                    star.style.opacity = '';
                    star.style.boxShadow = '';
                }
            });
        }
    };
})();
