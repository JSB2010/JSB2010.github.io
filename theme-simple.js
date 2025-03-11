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
    
    // IMMEDIATELY create mountain backgrounds if not present
    ensureBackgroundsExist();
    
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
        
        // Force create background elements immediately
        ensureBackgroundsExist();
        
        // Try to set up buttons
        setupThemeButtons();
        
        // Watch for dynamically loaded footer
        watchForFooter();
        
        // Set up system preference change listener
        setupSystemListener();
        
        // Ensure any theme-specific visual elements are correctly shown
        ensureThemeVisuals();

        // Ensure background initialization is triggered if needed
        ensureBackgroundElements();
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
                
                /* IMPORTANT: Always show background elements, just control which ones */
                .light-theme-mountain {
                    display: block !important;
                    opacity: 1 !important;
                    z-index: -1 !important; /* Fixed: Keep at -1, not -10 */
                }
                
                .dark-theme-mountain {
                    display: none !important;
                }
                
                /* Show light-mode specific elements */
                .light-mode-only {
                    display: block !important;
                }
                
                /* Hide dark-mode specific elements */
                .dark-mode-only, .extra-stars, .stars-container {
                    display: none !important;
                }
            `;
        } else if (isVisualDarkMode) {
            // Use the same styling for both dark theme and auto+dark
            styleEl.textContent = `
                /* REMOVE all background colors to allow mountain backgrounds to show */
                html, body, main, .content-main { 
                    color: #f1f1f1 !important; 
                    background-color: transparent !important;
                }
                
                /* Fix container backgrounds */
                .content-main, main, section, div {
                    background-color: transparent !important;
                }
                
                /* IMPORTANT: Always show background elements, just control which ones */
                .dark-theme-mountain {
                    display: block !important;
                    opacity: 1 !important;
                    z-index: 0 !important; /* Very high to ensure visibility */
                }
                
                .light-theme-mountain {
                    display: none !important;
                }
                
                /* Show dark-mode specific elements */
                .dark-mode-only, .extra-stars, .stars-container {
                    display: block !important;
                    opacity: 1 !important;
                }
                
                /* Hide light-mode specific elements */
                .light-mode-only {
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
                /* IMPORTANT: Always show background elements, just control which ones */
                .light-theme-mountain {
                    display: block !important;
                    opacity: 1 !important;
                    z-index: -1 !important; /* Fixed: Keep at -1, not -10 */
                }
                
                .dark-theme-mountain {
                    display: none !important;
                }
                
                /* Hide dark-mode specific elements */
                .dark-mode-only, .extra-stars, .stars-container {
                    display: none !important;
                }
                
                /* Show light-mode specific elements */
                .light-mode-only {
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
        
        // Fire custom event that theme.js can listen for
        const themeEvent = new CustomEvent('theme-changed', {
            detail: { theme }
        });
        document.dispatchEvent(themeEvent);
        
        // Call global theme functions if available
        if (window.ThemeManager && window.ThemeManager.ensureBackgrounds) {
            window.ThemeManager.ensureBackgrounds();
        }
        
        // REMOVED: No longer force reload the page
        // Just make sure backgrounds are visible
        ensureBackgroundsExist();
    }
    
    function ensureThemeVisuals() {
        // Make sure all theme-specific visual elements are correctly shown based on current visual mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const isVisualDarkMode = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDarkMode);
        
        // Mark the body with a data attribute for easier CSS targeting
        document.body.dataset.visualMode = isVisualDarkMode ? 'dark' : 'light';
        
        // CRITICAL: Force transparent backgrounds in dark mode
        if (isVisualDarkMode) {
            document.documentElement.style.backgroundColor = 'transparent';
            document.body.style.backgroundColor = 'transparent';
            
            // Remove any overlay that might be created with pseudo-elements
            const styleKiller = document.createElement('style');
            styleKiller.textContent = `
                body::before, body::after,
                html::before, html::after,
                main::before, main::after,
                .themed-background::before, .themed-background::after {
                    content: none !important;
                    display: none !important;
                    opacity: 0 !important;
                    background: none !important;
                }
            `;
            document.head.appendChild(styleKiller);
            
            // Force all major containers to be transparent
            document.querySelectorAll('main, .content-main, .themed-background').forEach(el => {
                el.style.backgroundColor = 'transparent';
            });
        }
        
        // Ensure backgrounds exist
        ensureBackgroundsExist();
        
        // CRITICAL: Force set mountain backgrounds visibility directly
        const lightMountain = document.querySelector('.light-theme-mountain');
        const darkMountain = document.querySelector('.dark-theme-mountain');
        
        if (lightMountain && darkMountain) {
            if (isVisualDarkMode) {
                lightMountain.style.display = 'none';
                darkMountain.style.display = 'block';
            } else {
                lightMountain.style.display = 'block';
                darkMountain.style.display = 'none';
            }
            console.log(`Visuals updated: ${isVisualDarkMode ? 'dark' : 'light'} mountain visible`);
        }
        
        // Update stars visibility
        const stars = document.querySelector('.stars-container');
        if (stars) {
            stars.style.display = isVisualDarkMode ? 'block' : 'none';
        }
        
        // Update any theme-specific elements with JavaScript
        if (window.updateThemeElements) {
            window.updateThemeElements(isVisualDarkMode);
        }
    }
    
    function ensureBackgroundElements() {
        // Ensure background elements are created if needed
        if (window.initializeMountainBackground && !document.querySelector('.mountain-background')) {
            window.initializeMountainBackground();
        }
        
        if (window.initializeThemeBackground && !document.querySelector('.theme-background')) {
            window.initializeThemeBackground();
        }
        
        // Initialize space elements based on theme
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const isVisualDarkMode = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDarkMode);
        
        if (isVisualDarkMode && window.initializeSpaceElements) {
            window.initializeSpaceElements();
        }
    }
    
    /**
     * Immediately ensure background elements exist
     */
    function ensureBackgroundsExist() {
        // Directly create mountain backgrounds
        if (!document.querySelector('.light-theme-mountain')) {
            const lightMountain = document.createElement('div');
            lightMountain.className = 'light-theme-mountain';
            lightMountain.style.position = 'fixed';
            lightMountain.style.top = '0';
            lightMountain.style.left = '0';
            lightMountain.style.width = '100%';
            lightMountain.style.height = '100%';
            lightMountain.style.background = 'linear-gradient(to bottom, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)';
            lightMountain.style.zIndex = '-1'; // Fixed: Keep at -1, not -10
            lightMountain.style.pointerEvents = 'none';
            document.body.prepend(lightMountain); // Use prepend to ensure it's the first element
            console.log('Created light-theme-mountain');
        }
        
        if (!document.querySelector('.dark-theme-mountain')) {
            const darkMountain = document.createElement('div');
            darkMountain.className = 'dark-theme-mountain';
            darkMountain.style.position = 'fixed';
            darkMountain.style.top = '0';
            darkMountain.style.left = '0';
            darkMountain.style.width = '100%';
            darkMountain.style.height = '100%';
            darkMountain.style.background = 'linear-gradient(to bottom, #0f0221 0%, #0c1339 30%, #081c51 70%, #102346 100%)';
            darkMountain.style.zIndex = '-1'; // Fixed: Keep at -1, not -10
            darkMountain.style.pointerEvents = 'none';
            document.body.prepend(darkMountain); // Use prepend to ensure it's the first element
            console.log('Created dark-theme-mountain');
            
            // Add a special attribute to mark this is direct DOM creation
            darkMountain.setAttribute('data-creator', 'theme-simple-emergency');
        }
        
        // Set initial visibility based on theme
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const isVisualDarkMode = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDarkMode);
        const lightMountain = document.querySelector('.light-theme-mountain');
        const darkMountain = document.querySelector('.dark-theme-mountain');
        if (lightMountain && darkMountain) {
            if (isVisualDarkMode) {
                lightMountain.style.display = 'none';
                darkMountain.style.display = 'block';
            } else {
                lightMountain.style.display = 'block';
                darkMountain.style.display = 'none';
            }
            console.log(`Set ${isVisualDarkMode ? 'dark' : 'light'} mountain visible`);
        }
        
        // CRITICAL FIX: Add style tag to ensure mountains stay visible
        const emergencyMountainFix = document.createElement('style');
        emergencyMountainFix.id = 'emergency-mountain-fix';
        emergencyMountainFix.textContent = `
            .dark-theme-mountain {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: -1 !important; /* Fixed: Keep at -1 */
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                background: linear-gradient(to bottom, #0f0221 0%, #0c1339 30%, #081c51 70%, #102346 100%) !important;
            }
            
            .light-theme-mountain {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: -1 !important; /* Fixed: Keep at -1 */
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                background: linear-gradient(to bottom, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%) !important;
            }
            
            /* Make content appear above the background */
            main, .content-main, section, article, header, footer, .card-container {
                position: relative !important;
                z-index: 1 !important;
                background-color: transparent !important;
            }
            
            /* Force remove any overlay */
            body::before, html::before, main::before {
                display: none !important;
                opacity: 0 !important;
                content: none !important;
            }
        `;
        document.head.appendChild(emergencyMountainFix);
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
        },
        ensureBackgrounds: ensureBackgroundElements
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
