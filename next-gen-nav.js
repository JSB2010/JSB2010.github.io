/**
 * Next-Gen Navigation System
 * Advanced navigation with smart scroll behavior, hover effects, and mobile optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    initNextGenNav();
});

/**
 * Initialize the next-gen navigation system
 */
function initNextGenNav() {
    // Add hover indicator to navigation
    addNavHoverIndicator();
    
    // Initialize smart scroll behavior
    initSmartScroll();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Set active page indicator
    setActivePage();
}

/**
 * Add hover indicator to navigation links
 */
function addNavHoverIndicator() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Create hover indicator element
    const hoverIndicator = document.createElement('span');
    hoverIndicator.className = 'hover-indicator';
    navMenu.appendChild(hoverIndicator);
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add hover event listeners to each link
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Skip if on mobile
            if (window.innerWidth <= 1100) return;
            
            // Get link dimensions and position
            const linkRect = this.getBoundingClientRect();
            const menuRect = navMenu.getBoundingClientRect();
            
            // Position the indicator
            hoverIndicator.style.width = `${linkRect.width * 0.7}px`;
            hoverIndicator.style.left = `${linkRect.left - menuRect.left + (linkRect.width * 0.15)}px`;
            hoverIndicator.style.opacity = '1';
        });
        
        link.addEventListener('mouseleave', function() {
            // Hide the indicator
            hoverIndicator.style.opacity = '0';
        });
    });
    
    // Hide indicator when mouse leaves the menu
    navMenu.addEventListener('mouseleave', function() {
        hoverIndicator.style.opacity = '0';
    });
    
    // Update indicator position on window resize
    window.addEventListener('resize', function() {
        hoverIndicator.style.opacity = '0';
    });
}

/**
 * Initialize smart scroll behavior
 */
function initSmartScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let scrollTimer;
    
    window.addEventListener('scroll', function() {
        // Clear the timer
        clearTimeout(scrollTimer);
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolled down
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.classList.add('nav-hidden');
        } else {
            // Scrolling up
            header.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // Set a timer to show the header after scrolling stops
        scrollTimer = setTimeout(function() {
            header.classList.remove('nav-hidden');
        }, 1500);
    }, { passive: true });
}

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    
    if (!mobileToggle || !navMenu || !mobileOverlay) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Toggle aria-expanded
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        
        // Prevent body scroll when menu is open
        if (this.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
    
    // Close mobile menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1100) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Set active page indicator
 */
function setActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if the link href matches the current path
        if (currentPath.endsWith(href) || 
            (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active-page');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active-page');
            link.removeAttribute('aria-current');
        }
    });
}
