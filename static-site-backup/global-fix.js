/**
 * Global Fix Script
 * Ensures consistent styling across all pages
 */
(function() {
    // Run immediately and after various delays to catch all possible states
    applyGlobalFixes();
    setTimeout(applyGlobalFixes, 100);
    setTimeout(applyGlobalFixes, 500);
    setTimeout(applyGlobalFixes, 1500);
    
    // Also run on page events
    document.addEventListener('DOMContentLoaded', applyGlobalFixes);
    window.addEventListener('load', applyGlobalFixes);
    document.addEventListener('header-footer-loaded', applyGlobalFixes);
    
    // Apply various global fixes
    function applyGlobalFixes() {
        fixNavigation();
        fixContentAreas();
        fixBackToTopButton();
    }
    
    // Fix navigation transparency
    function fixNavigation() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            if (isDarkMode) {
                navMenu.style.background = 'transparent';
                navMenu.style.backgroundColor = 'transparent';
                navMenu.style.backdropFilter = 'none';
                navMenu.style.webkitBackdropFilter = 'none';
                
                // Fix all list items
                navMenu.querySelectorAll('li').forEach(li => {
                    li.style.background = 'transparent';
                    li.style.backgroundColor = 'transparent';
                    
                    // Fix all links
                    const link = li.querySelector('a');
                    if (link) {
                        link.style.background = 'transparent';
                        link.style.backgroundColor = 'transparent';
                    }
                });
            } else {
                // Light mode fixes for better text contrast
                navMenu.querySelectorAll('li a').forEach(link => {
                    // Default link color
                    link.style.color = 'var(--primary-color)';
                    link.style.fontWeight = '500';
                    
                    // Active page styling
                    if (link.classList.contains('active-page')) {
                        link.style.color = 'var(--secondary-color)';
                        link.style.fontWeight = '600';
                        link.style.borderBottom = '2px solid var(--secondary-color)';
                    }
                });
            }
        }
    }
    
    // Fix content area transparency
    function fixContentAreas() {
        const contentAreas = [
            'main',
            '.content-main',
            '.project-details',
            '.project-details article',
            'section',
            '.content-section'
        ];
        
        contentAreas.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.background = 'transparent';
            });
        });
    }
    
    // Fix back to top button
    function fixBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            backToTopButton.style.color = 'white';
            backToTopButton.style.display = 'flex';
            backToTopButton.style.alignItems = 'center';
            backToTopButton.style.justifyContent = 'center';
            
            const icon = backToTopButton.querySelector('i');
            if (icon) {
                icon.style.color = 'white';
            }
        }
    }
})();
