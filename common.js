// Common JavaScript functions for header, footer and shared functionality

// Handle loading animation when header and footer are loaded
function handleLoadingAnimation() {
    const loader = document.querySelector('.loading-animation');
    if (!loader) return;
    
    // Hide the loader
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
}

// Load header and footer content
async function loadHeaderFooter() {
    try {
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok) throw new Error('Header not found');
        if (!footerResponse.ok) throw new Error('Footer not found');

        const [headerText, footerText] = await Promise.all([
            headerResponse.text(),
            footerResponse.text()
        ]);

        // Insert header and footer content
        const headerElement = document.getElementById('header');
        const footerElement = document.getElementById('footer');
        
        if (headerElement) headerElement.innerHTML = headerText;
        if (footerElement) footerElement.innerHTML = footerText;

        // Initialize mobile menu functionality after header is loaded
        initMobileMenu();
        
        // Initialize back-to-top functionality
        initBackToTop();
        
        // Apply mountain theme styling to navigation
        applyMountainThemeToNavigation();
        
        // Remove any duplicate back-to-top buttons
        removeDuplicateBackToTop();
        
        // Hide loading animation after content is loaded
        handleLoadingAnimation();
        
        // Event emitted for theme.js to know header/footer are ready
        document.dispatchEvent(new CustomEvent('header-footer-loaded'));
        
        // Ensure nav-fix.js runs after header is loaded
        ensureNavFixApplied();
    } catch (error) {
        console.error('Error loading content:', error);
        // Hide loader even if there's an error
        handleLoadingAnimation();
    }
}

/**
 * Ensures the nav-fix script is loaded and applied on all pages
 */
function ensureNavFixApplied() {
    // Check if nav-fix script is already loaded
    if (!document.querySelector('script[src*="nav-fix.js"]')) {
        const navFixScript = document.createElement('script');
        navFixScript.src = '/nav-fix.js';
        document.body.appendChild(navFixScript);
    }
    
    // Attempt to run the fix directly if it might be available
    if (typeof window.fixDarkModeNavMenu === 'function') {
        window.fixDarkModeNavMenu();
    }
}

// Mobile menu functionality - improved for better dark mode compatibility
function initMobileMenu() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!dropdownToggle || !navMenu) return;

    // Toggle menu on button click
    dropdownToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('show');
        this.classList.toggle('active');
        
        // Apply dark mode styles immediately if in dark mode
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (navMenu.classList.contains('show')) {
                navMenu.style.background = 'rgba(15, 23, 42, 0.9)';
                navMenu.style.backdropFilter = 'blur(10px)';
                navMenu.style.webkitBackdropFilter = 'blur(10px)';
            } else {
                navMenu.style.background = 'transparent';
                navMenu.style.backdropFilter = 'none';
                navMenu.style.webkitBackdropFilter = 'none';
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !dropdownToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
            
            // Reset styles in dark mode
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                navMenu.style.background = 'transparent';
                navMenu.style.backdropFilter = 'none';
                navMenu.style.webkitBackdropFilter = 'none';
            }
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1000) {
                navMenu.classList.remove('show');
                dropdownToggle.classList.remove('active');
                
                // Reset styles in dark mode
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    navMenu.style.background = 'transparent';
                    navMenu.style.backdropFilter = 'none';
                    navMenu.style.webkitBackdropFilter = 'none';
                }
            }
        });
    });

    // Reset menu state on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000 && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
            
            // Reset styling for desktop view in dark mode
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                navMenu.style.background = 'transparent';
                navMenu.style.backdropFilter = 'none';
                navMenu.style.webkitBackdropFilter = 'none';
            }
        }
    });
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    function handleScroll() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Check scroll position on page load
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll to top on button click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Apply mountain theme to navigation elements
function applyMountainThemeToNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Add mountain theme styling to active page link
    const currentPath = window.location.pathname;
    const links = navMenu.querySelectorAll('a');
    
    links.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        
        // Check if this link corresponds to current page
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath === '/index.html') ||
            (currentPath === '/index.html' && linkPath === '/')) {
            link.classList.add('active-page');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Remove duplicate back-to-top buttons that might exist from individual page scripts
 */
function removeDuplicateBackToTop() {
    const backToTopButtons = document.querySelectorAll('#back-to-top');
    if (backToTopButtons.length > 1) {
        // Keep only the first one
        for (let i = 1; i < backToTopButtons.length; i++) {
            backToTopButtons[i].remove();
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadHeaderFooter);

// Expose public functions
window.loadHeaderFooter = loadHeaderFooter;
window.initMobileMenu = initMobileMenu;
window.initBackToTop = initBackToTop;
