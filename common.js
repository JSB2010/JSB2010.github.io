// Common JavaScript functions for header, footer and shared functionality

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
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!dropdownToggle || !navMenu) return;

    // Toggle menu on button click
    dropdownToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('show');
        this.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !dropdownToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1000) {
                navMenu.classList.remove('show');
                dropdownToggle.classList.remove('active');
            }
        });
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000 && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
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

// Run on page load
document.addEventListener('DOMContentLoaded', loadHeaderFooter);

// Expose public functions
window.loadHeaderFooter = loadHeaderFooter;
window.initMobileMenu = initMobileMenu;
window.initBackToTop = initBackToTop;
