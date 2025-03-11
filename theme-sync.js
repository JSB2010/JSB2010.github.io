/**
 * Theme Synchronization Script - Ensures all theme scripts and elements work together
 */
(function() {
    console.log('Theme sync initializing...');
    
    // Wait for everything to be loaded
    window.addEventListener('load', function() {
        setTimeout(syncThemes, 100);
        
        // Add direct click handlers for theme buttons
        document.addEventListener('click', handleThemeButtonClick);
        
        // Add helper button for manual theme fix
        addThemeFixButton();
    });
    
    // Handle theme button clicks directly
    function handleThemeButtonClick(e) {
        const targetId = e.target.id || (e.target.closest('button') ? e.target.closest('button').id : null);
        
        if (targetId && ['light-mode', 'dark-mode', 'auto-mode'].includes(targetId)) {
            e.preventDefault();
            e.stopPropagation();
            
            const theme = targetId.replace('-mode', '');
            console.log('Theme button clicked:', theme);
            
            // Apply theme through all available methods to ensure it works
            if (window.ThemeManager && window.ThemeManager.setTheme) {
                console.log('Using ThemeManager.setTheme');
                window.ThemeManager.setTheme(theme);
            }
            
            // Store in localStorage directly as backup
            localStorage.setItem('theme-preference', theme);
            
            // Manually update buttons as fallback
            updateThemeButtons(theme);
            
            // Force update backgrounds
            updateThemeVisibility(theme);
            
            // Broadcast theme change event
            const event = new CustomEvent('theme-changed', { 
                detail: { theme: theme } 
            });
            document.dispatchEvent(event);
            
            return false;
        }
    }
    
    // Update theme button states
    function updateThemeButtons(theme) {
        const lightButton = document.getElementById('light-mode');
        const darkButton = document.getElementById('dark-mode');
        const autoButton = document.getElementById('auto-mode');
        
        if (lightButton && darkButton && autoButton) {
            lightButton.classList.remove('active');
            darkButton.classList.remove('active');
            autoButton.classList.remove('active');
            
            if (theme === 'light') {
                lightButton.classList.add('active');
            } else if (theme === 'dark') {
                darkButton.classList.add('active');
            } else {
                autoButton.classList.add('active');
            }
        }
    }
    
    // Update theme visibility
    function updateThemeVisibility(theme) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isVisualDarkMode = theme === 'dark' || (theme === 'auto' && prefersDarkMode);
        
        // Update visual mode class on document element
        if (isVisualDarkMode) {
            document.documentElement.classList.add('visual-dark-mode');
            document.documentElement.classList.remove('visual-light-mode');
            
            // Force remove any background colors
            document.documentElement.style.backgroundColor = 'transparent';
            document.body.style.backgroundColor = 'transparent';
            
            if (document.querySelector('main')) {
                document.querySelector('main').style.backgroundColor = 'transparent';
            }
            
            if (document.querySelector('.content-main')) {
                document.querySelector('.content-main').style.backgroundColor = 'transparent';
            }
        } else {
            document.documentElement.classList.add('visual-light-mode');
            document.documentElement.classList.remove('visual-dark-mode');
        }
        
        // Force update mountain visibility
        const lightMountain = document.querySelector('.light-theme-mountain');
        const darkMountain = document.querySelector('.dark-theme-mountain');
        
        if (lightMountain && darkMountain) {
            lightMountain.style.display = isVisualDarkMode ? 'none' : 'block';
            darkMountain.style.display = isVisualDarkMode ? 'block' : 'none';
            
            // Make sure z-index is correct
            lightMountain.style.zIndex = '0';
            darkMountain.style.zIndex = '0';
            console.log(`Mountain visibility updated: ${isVisualDarkMode ? 'dark' : 'light'} theme`);
        } else {
            console.log('Creating mountains (not found)');
            createMountains();
        }
    }
    
    // Create mountains if they don't exist
    function createMountains() {
        if (!document.querySelector('.light-theme-mountain')) {
            const lightMountain = document.createElement('div');
            lightMountain.className = 'light-theme-mountain';
            lightMountain.style.position = 'fixed';
            lightMountain.style.top = '0';
            lightMountain.style.left = '0';
            lightMountain.style.width = '100%';
            lightMountain.style.height = '100%';
            lightMountain.style.background = 'linear-gradient(to bottom, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)';
            lightMountain.style.zIndex = '0'; // Use a higher z-index to ensure visibility
            lightMountain.style.pointerEvents = 'none';
            document.body.prepend(lightMountain); // Place at the beginning of body
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
            darkMountain.style.zIndex = '0'; // Use a higher z-index to ensure visibility
            darkMountain.style.pointerEvents = 'none';
            
            // Add nebula effect directly
            const nebulaEffect = document.createElement('div');
            nebulaEffect.style.position = 'absolute';
            nebulaEffect.style.top = '0';
            nebulaEffect.style.left = '0';
            nebulaEffect.style.width = '100%';
            nebulaEffect.style.height = '100%';
            nebulaEffect.style.background = `
                radial-gradient(circle at 20% 20%, rgba(103, 65, 217, 0.15), transparent 25%),
                radial-gradient(circle at 80% 40%, rgba(158, 58, 185, 0.1), transparent 35%),
                radial-gradient(circle at 40% 80%, rgba(83, 49, 156, 0.15), transparent 30%)
            `;
            nebulaEffect.style.pointerEvents = 'none';
            darkMountain.appendChild(nebulaEffect);
            
            document.body.prepend(darkMountain); // Place at the beginning of body
        }
        
        // Also ensure no overlays are blocking
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        
        // Set initial visibility
        const theme = localStorage.getItem('theme-preference') || 'auto';
        updateThemeVisibility(theme);
    }
    
    // Add a fix button that can be invoked from console if needed
    function addThemeFixButton() {
        window.fixAllThemes = function() {
            createMountains();
            const theme = localStorage.getItem('theme-preference') || 'auto';
            updateThemeVisibility(theme);
            updateThemeButtons(theme);
            console.log('Theme fix applied!');
            return 'Theme fix complete';
        };
    }
    
    // Sync all theme elements
    function syncThemes() {
        const theme = localStorage.getItem('theme-preference') || 'auto';
        
        // Apply theme classes
        document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
        document.documentElement.classList.add(`${theme}-theme`);
        
        // Force remove any overlay backgrounds
        if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.style.backgroundColor = 'transparent';
            document.body.style.backgroundColor = 'transparent';
            
            if (document.querySelector('main')) {
                document.querySelector('main').style.backgroundColor = 'transparent';
            }
        }
        
        // Update buttons
        updateThemeButtons(theme);
        
        // Update visibility
        updateThemeVisibility(theme);
    }
})();
