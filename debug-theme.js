/**
 * Theme Debugger - For diagnosing and fixing theme issues
 */
(function() {
    console.log('Theme Debugger Running...');
    
    window.addEventListener('load', function() {
        setTimeout(checkThemeState, 500);
    });
    
    function checkThemeState() {
        console.log('------- THEME DEBUG INFO -------');
        
        // Check current theme
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        console.log(`Current theme: ${currentTheme}`);
        
        // Check document classes
        console.log(`Document classes: ${document.documentElement.classList}`);
        
        // Check for mountains
        const lightMountain = document.querySelector('.light-theme-mountain');
        const darkMountain = document.querySelector('.dark-theme-mountain');
        console.log(`Light mountain exists: ${!!lightMountain}`);
        console.log(`Dark mountain exists: ${!!darkMountain}`);
        
        if (lightMountain) {
            console.log(`Light mountain display: ${getComputedStyle(lightMountain).display}`);
            console.log(`Light mountain z-index: ${getComputedStyle(lightMountain).zIndex}`);
        }
        
        if (darkMountain) {
            console.log(`Dark mountain display: ${getComputedStyle(darkMountain).display}`);
            console.log(`Dark mountain z-index: ${getComputedStyle(darkMountain).zIndex}`);
        }
        
        // Check for other backgrounds
        const mountainBG = document.querySelector('.mountain-background');
        console.log(`Mountain background exists: ${!!mountainBG}`);
        
        // Fix mountains if needed
        if (!lightMountain || !darkMountain) {
            console.log('FIXING: Creating missing mountain backgrounds');
            createEmergencyMountains();
        }
        
        // Fix visibility if needed
        if (lightMountain && darkMountain) {
            const isDarkMode = document.documentElement.classList.contains('dark-theme') || 
                              (document.documentElement.classList.contains('auto-theme') && 
                               window.matchMedia('(prefers-color-scheme: dark)').matches);
            
            console.log(`Should be in dark mode: ${isDarkMode}`);
            
            if (isDarkMode && getComputedStyle(darkMountain).display === 'none') {
                console.log('FIXING: Dark mountain should be visible');
                lightMountain.style.display = 'none';
                darkMountain.style.display = 'block';
            } else if (!isDarkMode && getComputedStyle(lightMountain).display === 'none') {
                console.log('FIXING: Light mountain should be visible');
                lightMountain.style.display = 'block';
                darkMountain.style.display = 'none';
            }
        }
        
        console.log('-------------------------------');
    }
    
    function createEmergencyMountains() {
        if (!document.querySelector('.light-theme-mountain')) {
            const lightMountain = document.createElement('div');
            lightMountain.className = 'light-theme-mountain';
            lightMountain.style.position = 'fixed';
            lightMountain.style.top = '0';
            lightMountain.style.left = '0';
            lightMountain.style.width = '100%';
            lightMountain.style.height = '100%';
            lightMountain.style.background = 'linear-gradient(to bottom, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)';
            lightMountain.style.zIndex = '-2'; // Higher z-index to ensure visibility
            lightMountain.style.pointerEvents = 'none';
            document.body.appendChild(lightMountain);
            console.log('Emergency light mountain created');
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
            darkMountain.style.zIndex = '-2'; // Higher z-index to ensure visibility
            darkMountain.style.pointerEvents = 'none';
            document.body.appendChild(darkMountain);
            console.log('Emergency dark mountain created');
        }
        
        // Set visibility
        const isDarkMode = document.documentElement.classList.contains('dark-theme') || 
                          (document.documentElement.classList.contains('auto-theme') && 
                           window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        const lightMountain = document.querySelector('.light-theme-mountain');
        const darkMountain = document.querySelector('.dark-theme-mountain');
        
        if (isDarkMode) {
            lightMountain.style.display = 'none';
            darkMountain.style.display = 'block';
        } else {
            lightMountain.style.display = 'block';
            darkMountain.style.display = 'none';
        }
    }
    
    // Add button to fix themes
    window.fixTheme = function() {
        createEmergencyMountains();
        checkThemeState();
        alert('Theme debug complete! Check console for details.');
    };
})();
