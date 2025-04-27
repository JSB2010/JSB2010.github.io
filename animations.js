/**
 * Animations for Jacob Barkin's Portfolio
 * Handles animations and visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Apply animation classes to cards
    const cards = document.querySelectorAll('.card-container > div');
    cards.forEach((card, index) => {
        card.classList.add('animate-card', `card-${index + 1}`);
    });

    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        // Show button when scrolling down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add space elements to dark theme
    function addSpaceElements() {
        const darkThemeMountain = document.querySelector('.dark-theme-mountain');
        if (darkThemeMountain && !document.querySelector('.space-elements')) {
            // Create space elements container
            const spaceElements = document.createElement('div');
            spaceElements.className = 'space-elements';
            
            // Add shooting stars
            for (let i = 0; i < 3; i++) {
                const shootingStar = document.createElement('div');
                shootingStar.className = 'shooting-star';
                spaceElements.appendChild(shootingStar);
            }
            
            // Add twinkling stars
            for (let i = 0; i < 10; i++) {
                const twinkleStar = document.createElement('div');
                twinkleStar.className = 'twinkle-star';
                spaceElements.appendChild(twinkleStar);
            }
            
            darkThemeMountain.appendChild(spaceElements);
        }
    }
    
    // Add theme elements to cards
    function addThemeElements() {
        const techCards = document.querySelectorAll('.tech-card');
        const transitCards = document.querySelectorAll('.transit-card');
        const mountainCards = document.querySelectorAll('.mountain-card');
        const spaceCards = document.querySelectorAll('.space-card');
        
        function addElement(card, className) {
            const element = document.createElement('div');
            element.className = `card-theme-element ${className}-element`;
            card.appendChild(element);
        }
        
        techCards.forEach(card => addElement(card, 'tech'));
        transitCards.forEach(card => addElement(card, 'transit'));
        mountainCards.forEach(card => addElement(card, 'mountain'));
        spaceCards.forEach(card => addElement(card, 'space'));
    }
    
    // Add active class to current page in navigation
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath.endsWith(linkPath)) {
                link.classList.add('active-page');
            }
        });
    }
    
    // Initialize all visual enhancements
    addSpaceElements();
    addThemeElements();
    highlightCurrentPage();
    
    // Mobile navigation toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (dropdownToggle && navMenu) {
        dropdownToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-menu') && !event.target.closest('.dropdown-toggle')) {
                navMenu.classList.remove('show');
            }
        });
    }
});
