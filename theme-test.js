/**
 * Theme Test Script
 * Used to diagnose theme-switching issues
 */
(function() {
    console.log('🔍 Theme Test Script Running');
    
    // Test localStorage
    try {
        const testKey = 'theme-test-key';
        localStorage.setItem(testKey, 'test-value');
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        console.log(`localStorage test: ${testValue === 'test-value' ? 'PASSED ✓' : 'FAILED ✗'}`);
    } catch (error) {
        console.error('localStorage test failed:', error);
    }
    
    // Check current theme
    const currentTheme = localStorage.getItem('theme-preference') || 'auto';
    console.log(`Current theme in localStorage: ${currentTheme}`);
    
    // Check document class
    const docClasses = document.documentElement.classList;
    console.log(`Current document classes: ${Array.from(docClasses).join(', ')}`);
    
    // Check if theme class matches localStorage
    const hasMatchingClass = docClasses.contains(`${currentTheme}-theme`);
    console.log(`Theme class matches localStorage: ${hasMatchingClass ? 'YES ✓' : 'NO ✗'}`);
    
    // Check theme button states
    setTimeout(function() {
        const lightButton = document.getElementById('light-mode');
        const darkButton = document.getElementById('dark-mode');
        const autoButton = document.getElementById('auto-mode');
        
        if (lightButton && darkButton && autoButton) {
            console.log(`Button states: light=${lightButton.classList.contains('active')}, dark=${darkButton.classList.contains('active')}, auto=${autoButton.classList.contains('active')}`);
            
            // Check if button state matches theme
            const correctButtonActive = 
                (currentTheme === 'light' && lightButton.classList.contains('active')) ||
                (currentTheme === 'dark' && darkButton.classList.contains('active')) ||
                (currentTheme === 'auto' && autoButton.classList.contains('active'));
                
            console.log(`Correct button active: ${correctButtonActive ? 'YES ✓' : 'NO ✗'}`);
        } else {
            console.log('Could not find theme buttons - footer may not be loaded yet');
        }
    }, 1000);
    
    // Check for global theme functions
    setTimeout(function() {
        console.log(`Global setTheme function available: ${typeof window.setTheme === 'function' ? 'YES ✓' : 'NO ✗'}`);
        console.log(`Global updateThemeButtonStates function available: ${typeof window.updateThemeButtonStates === 'function' ? 'YES ✓' : 'NO ✗'}`);
    }, 500);
    
    // Add a diagnostic control to the page
    setTimeout(function() {
        const control = document.createElement('div');
        control.style.position = 'fixed';
        control.style.bottom = '10px';
        control.style.left = '10px';
        control.style.padding = '5px';
        control.style.background = 'rgba(0,0,0,0.7)';
        control.style.color = 'white';
        control.style.fontSize = '12px';
        control.style.zIndex = '9999';
        control.style.borderRadius = '3px';
        control.textContent = `Theme: ${currentTheme}`;
        
        // Add ability to toggle theme directly
        control.addEventListener('click', function() {
            const themes = ['light', 'dark', 'auto'];
            const currentIndex = themes.indexOf(localStorage.getItem('theme-preference') || 'auto');
            const nextIndex = (currentIndex + 1) % themes.length;
            const newTheme = themes[nextIndex];
            
            if (window.setTheme) {
                window.setTheme(newTheme);
            } else {
                document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
                document.documentElement.classList.add(`${newTheme}-theme`);
                localStorage.setItem('theme-preference', newTheme);
            }
            
            control.textContent = `Theme: ${newTheme}`;
            console.log(`Theme changed via test control: ${newTheme}`);
        });
        
        document.body.appendChild(control);
    }, 1500);
})();
