/**
 * Mountain Theme and Color Scheme Manager
 * Applies consistent mountain background and blue-green theme to all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a short moment to ensure common.js has loaded header/footer
    setTimeout(() => {
        // Only add theme elements if they don't already exist
        if (!document.querySelector('.mountain-background')) {
            initializeMountainBackground();
        }
        
        if (!document.querySelector('.theme-background')) {
            initializeThemeBackground();
        }
        
        // Add theme class to body if not already present
        if (!document.body.classList.contains('themed-background')) {
            document.body.classList.add('themed-background');
        }
        
        // Initialize parallax effect
        initializeParallax();
        
        // Handle loading animation
        initializeLoadingAnimation();
        
        // Apply mountain theme to project headers and elements
        applyMountainTheme();
        
        // Initialize space elements - now enhanced for dark mode
        initializeSpaceElements();
        
        // Set up dark mode detection and handling
        setupDarkModeDetection();
    }, 100);
});

/**
 * Creates and adds mountain background elements to the page
 */
function initializeMountainBackground() {
    const mountainBackground = document.createElement('div');
    mountainBackground.className = 'mountain-background';
    mountainBackground.innerHTML = `
        <div class="mountain-range mountain-back"></div>
        <div class="mountain-range mountain-middle"></div>
        <div class="mountain-range mountain-front"></div>
        <div class="forest-layer"></div>
    `;
    
    // Insert as first child of body
    document.body.insertBefore(mountainBackground, document.body.firstChild);
}

/**
 * Creates and adds theme background elements to the page
 */
function initializeThemeBackground() {
    const themeBackground = document.createElement('div');
    themeBackground.className = 'theme-background';
    themeBackground.innerHTML = `
        <div class="tech-layer"></div>
        <div class="transit-layer"></div>
        <div class="mountains-layer"></div>
        <div class="space-layer"></div>
    `;
    
    // Insert after mountain background if it exists, or as first child
    const mountainBackground = document.querySelector('.mountain-background');
    if (mountainBackground) {
        mountainBackground.after(themeBackground);
    } else {
        document.body.insertBefore(themeBackground, document.body.firstChild);
    }
}

/**
 * Initializes parallax scrolling effect for mountain layers
 */
function initializeParallax() {
    // Only apply parallax on devices that likely have good performance
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            // Apply parallax to mountain layers
            const mountainBack = document.querySelector('.mountain-back');
            const mountainMiddle = document.querySelector('.mountain-middle');
            const mountainFront = document.querySelector('.mountain-front');
            
            if (mountainBack && mountainMiddle && mountainFront) {
                mountainBack.style.transform = `translateY(${scrollY * 0.1}px) translateZ(-300px) scale(1.5)`;
                mountainMiddle.style.transform = `translateY(${scrollY * 0.05}px) translateZ(-150px) scale(1.3)`;
                mountainFront.style.transform = `translateY(${scrollY * 0.02}px) translateZ(0) scale(1.1)`;
            }
        }, { passive: true });
    }
}

/**
 * Handles loading animation across all pages
 */
function initializeLoadingAnimation() {
    const loader = document.querySelector('.loading-animation');
    
    if (!loader) return; // No loader to handle
    
    // Function to hide the loader
    const hideLoader = () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    };
    
    // Check if page is already loaded
    if (document.readyState === 'complete') {
        hideLoader();
        return;
    }
    
    // Hide loading animation when page is loaded
    window.addEventListener('load', hideLoader);
    
    // Safety timeout - hide after 3 seconds maximum regardless of load state
    setTimeout(hideLoader, 3000);
    
    // Also hide on DOMContentLoaded as a fallback
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hideLoader, 1000); // Wait 1 second after DOM is ready
    });
}

/**
 * Applies mountain themed styling to various page elements
 */
function applyMountainTheme() {
    // Apply to project headers
    const projectHeaders = document.querySelectorAll('.project-header');
    projectHeaders.forEach(header => {
        if (!header.classList.contains('mountain-themed')) {
            header.classList.add('mountain-themed');
        }
    });
    
    // Add mountain-themed class to project cards for consistency
    const projectCards = document.querySelectorAll('.project');
    projectCards.forEach(card => {
        if (!card.classList.contains('mountain-themed')) {
            card.classList.add('mountain-themed');
        }
    });
    
    // Fix any path issues in mountain-themed elements
    fixImagePaths();
}

/**
 * Fixes path issues in images and background elements
 */
function fixImagePaths() {
    // Fix image paths in gallery images
    document.querySelectorAll('.gallery-img').forEach(img => {
        if (img.src.includes('../images/')) {
            img.src = img.src.replace('../images/', '/images/');
        }
    });
}

/**
 * Applies a subtle ripple effect to water elements in mountain scenes
 * This adds a bit more life to the static mountain backgrounds
 */
function initializeWaterEffects() {
    // Only apply on pages with mountain background
    const mountainBackground = document.querySelector('.mountain-background');
    if (!mountainBackground) return;
    
    // Create water effect element if needed
    if (!document.querySelector('.water-effect')) {
        const waterEffect = document.createElement('div');
        waterEffect.className = 'water-effect';
        mountainBackground.appendChild(waterEffect);
    }
    
    // Animate water ripples
    const rippleInterval = setInterval(() => {
        const waterEffect = document.querySelector('.water-effect');
        if (!waterEffect) {
            clearInterval(rippleInterval);
            return;
        }
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        // Random position on bottom quarter of screen
        const left = Math.random() * 100;
        const top = 75 + Math.random() * 20;
        const scale = 0.5 + Math.random();
        
        ripple.style.left = `${left}%`;
        ripple.style.top = `${top}%`;
        ripple.style.transform = `scale(${scale})`;
        
        waterEffect.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 3000);
    }, 5000);
}

// Add CSS for water effects
function addWaterEffectsCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .water-effect {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 25%;
            pointer-events: none;
            z-index: -10;
        }
        
        .ripple {
            position: absolute;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            transform-origin: center;
            animation: ripple 3s ease-out;
        }
        
        @keyframes ripple {
            0% { transform: scale(0); opacity: 0.7; }
            100% { transform: scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize water effects when document is ready
document.addEventListener('DOMContentLoaded', function() {
    addWaterEffectsCSS();
    setTimeout(initializeWaterEffects, 2000); // Delay to ensure other elements are loaded
});

/**
 * Creates and adds space elements to the mountain background
 */
function initializeSpaceElements() {
    const mountainBackground = document.querySelector('.mountain-background');
    if (!mountainBackground || document.querySelector('.space-elements')) return;
    
    // Create container for space elements
    const spaceElements = document.createElement('div');
    spaceElements.className = 'space-elements';
    
    // Add moon
    const moon = document.createElement('div');
    moon.className = 'moon';
    spaceElements.appendChild(moon);
    
    // Add stars - increased count for better night sky effect
    const starCount = 150; // Increased from 100
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position - covering more of the sky
        const x = Math.random() * 100;
        const y = Math.random() * 70; // Increased from 60% to 70% of screen
        
        // Random size with more variation (0.5px to 3px)
        const size = 0.5 + Math.random() * 2.5;
        
        // Random twinkle animation delay
        const delay = Math.random() * 5;
        
        // Random brightness for more variation
        const brightness = 0.5 + Math.random() * 0.5;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = brightness.toString();
        star.style.animationDelay = `${delay}s`;
        
        spaceElements.appendChild(star);
    }
    
    // Add more shooting stars for dark mode
    for (let i = 0; i < 5; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Random position and angle
        const x = Math.random() * 100;
        const y = Math.random() * 40;
        const angle = -15 - Math.random() * 30; // -15 to -45 degrees
        
        // Random animation delay and duration
        const delay = i * 5 + Math.random() * 10; // Stagger shooting stars
        const duration = 1 + Math.random() * 2;
        
        shootingStar.style.left = `${x}%`;
        shootingStar.style.top = `${y}%`;
        shootingStar.style.transform = `rotate(${angle}deg)`;
        shootingStar.style.animationDelay = `${delay}s`;
        shootingStar.style.animationDuration = `${duration}s`;
        
        spaceElements.appendChild(shootingStar);
    }
    
    // Add constellation effect (grouped stars)
    const constellationCount = 3;
    for (let c = 0; c < constellationCount; c++) {
        const constellation = document.createElement('div');
        constellation.className = 'constellation';
        
        // Position constellation in upper part of sky
        const cx = 10 + Math.random() * 80; // 10-90% width
        const cy = 5 + Math.random() * 30; // 5-35% height
        
        constellation.style.left = `${cx}%`;
        constellation.style.top = `${cy}%`;
        
        spaceElements.appendChild(constellation);
    }
    
    // Add space elements before other mountain elements
    mountainBackground.insertBefore(spaceElements, mountainBackground.firstChild);
    
    // Add CSS for space elements
    addSpaceElementsCSS();
}

/**
 * Adds CSS for space elements
 */
function addSpaceElementsCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .space-elements {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -14; /* Between theme background and mountain ranges */
            opacity: 0.4; /* Default opacity - will be adjusted in dark mode */
            transition: opacity 1s ease;
        }
        
        .moon {
            position: absolute;
            top: 10%;
            right: 10%;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(220,240,255,0.7) 70%);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(255,255,255,0.8);
            opacity: 0.9;
            transform: translateZ(-200px);
        }
        
        .star {
            position: absolute;
            background-color: #ffffff;
            border-radius: 50%;
            opacity: 0.5;
            animation: twinkle 4s infinite ease-in-out alternate;
            box-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
        }
        
        .shooting-star {
            position: absolute;
            width: 100px;
            height: 1px;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
            opacity: 0;
            transform-origin: right center;
            animation: shooting-star 10s infinite linear;
        }
        
        .constellation {
            position: absolute;
            width: 100px;
            height: 100px;
            opacity: 0.9;
        }
        
        .constellation::before, 
        .constellation::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.8);
            box-shadow: 
                30px 20px 0 0 rgba(255, 255, 255, 0.8),
                50px 50px 0 0 rgba(255, 255, 255, 0.8),
                20px 70px 0 0 rgba(255, 255, 255, 0.8),
                70px 40px 0 0 rgba(255, 255, 255, 0.8),
                90px 10px 0 0 rgba(255, 255, 255, 0.8);
            animation: constellation-twinkle 5s infinite alternate;
        }
        
        .constellation::after {
            animation-delay: 2.5s;
        }
        
        @keyframes constellation-twinkle {
            0% { opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { opacity: 0.3; }
        }
        
        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 0.9; transform: scale(1.0); }
            100% { opacity: 0.3; transform: scale(0.8); }
        }
        
        @keyframes shooting-star {
            0% { transform: translateX(0) rotate(0deg); opacity: 0; }
            5% { opacity: 1; }
            15% { transform: translateX(-200px) rotate(0deg); opacity: 0; }
            100% { transform: translateX(-200px) rotate(0deg); opacity: 0; }
        }
        
        /* Light mode - reduced visibility of space elements */
        @media (prefers-color-scheme: light) {
            .space-elements {
                opacity: 0.2;
            }
            
            .star {
                opacity: 0.3;
            }
            
            .moon {
                opacity: 0.7;
            }
            
            .constellation {
                opacity: 0.4;
            }
        }
        
        /* Dark mode - enhanced visibility of space elements */
        @media (prefers-color-scheme: dark) {
            .space-elements {
                opacity: 0.9;
            }
            
            .star {
                opacity: 0.8;
                box-shadow: 0 0 3px rgba(255, 255, 255, 0.9);
            }
            
            .moon {
                opacity: 1;
                box-shadow: 0 0 25px rgba(255, 255, 255, 0.9);
                background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(220,240,255,0.9) 70%);
            }
            
            .shooting-star {
                height: 2px;
                box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
            }
            
            .constellation {
                opacity: 1;
            }
        }
        
        /* Mobile optimization */
        @media (max-width: 768px) {
            .moon {
                width: 40px;
                height: 40px;
                top: 5%;
                right: 5%;
            }
            
            /* Reduce animations on mobile for performance */
            .star {
                animation-duration: 6s;
            }
            
            .shooting-star {
                animation-duration: 15s;
            }
            
            .constellation {
                transform: scale(0.7);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Setup dark mode detection and handling
 */
function setupDarkModeDetection() {
    // Apply initial state based on user's preference
    updateDarkModeStyles(window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Listen for changes in the user's preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        updateDarkModeStyles(event.matches);
    });
}

/**
 * Update styles based on dark mode setting
 */
function updateDarkModeStyles(isDarkMode) {
    const mountainBackground = document.querySelector('.mountain-background');
    if (!mountainBackground) return;
    
    if (isDarkMode) {
        // Night mode - darker mountain colors and more visible stars
        mountainBackground.classList.add('dark-mode');
        
        // Make mountains darker, more blue-toned for night
        const mountainStyles = document.createElement('style');
        mountainStyles.id = 'mountain-dark-mode-styles';
        mountainStyles.textContent = `
            .mountain-back {
                background: linear-gradient(to top, transparent 0%, #0c4a6e 30%, transparent 100%) !important;
                opacity: 0.7 !important;
            }
            
            .mountain-middle {
                background: linear-gradient(to top, transparent 0%, #0e7490 35%, transparent 100%) !important;
                opacity: 0.8 !important;
            }
            
            .mountain-front {
                background: linear-gradient(to top, transparent 0%, #065f46 40%, transparent 100%) !important;
                opacity: 0.9 !important;
            }
            
            .forest-layer {
                background: linear-gradient(to top, rgba(6, 95, 70, 0.5) 0%, transparent 100%) !important;
                opacity: 0.9 !important;
            }
            
            .theme-background {
                opacity: 0.05 !important;
            }
        `;
        
        // Remove existing dark mode styles if any
        const existingStyles = document.getElementById('mountain-dark-mode-styles');
        if (existingStyles) existingStyles.remove();
        
        document.head.appendChild(mountainStyles);
    } else {
        // Light mode - remove dark mode classes and styles
        mountainBackground.classList.remove('dark-mode');
        
        const existingStyles = document.getElementById('mountain-dark-mode-styles');
        if (existingStyles) existingStyles.remove();
    }
}