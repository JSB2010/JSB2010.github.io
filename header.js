/**
 * Header and Navigation functionality
 * Ultra-modern, responsive navigation with smooth animations
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.site-header');
    
    // Set active page
    function setActivePage() {
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            
            // Check if this link corresponds to current page
            if (currentPath === linkPath || 
                (currentPath === '/' && linkPath === '/index.html') ||
                (currentPath === '/index.html' && linkPath === '/')) {
                link.classList.add('active-page');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active-page');
                link.removeAttribute('aria-current');
            }
        });
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle states
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open', !isExpanded);
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Event listeners
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1100) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1100 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle scroll effects
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Initialize
    setActivePage();
    handleHeaderScroll();
});
