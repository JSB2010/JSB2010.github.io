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
        
        // Apply the saved theme immediately
        const savedTheme = localStorage.getItem('theme-preference') || 'auto';
        applyTheme(savedTheme);
    }, 100);
});

// Listen for theme changes from theme-init.js
document.addEventListener('theme-applied', function(e) {
    const theme = e.detail.theme;
    applyTheme(theme);
});

// Listen for direct theme change events (from footer buttons)
document.addEventListener('theme-change', function(e) {
    const theme = e.detail.theme;
    applyTheme(theme);
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
    
    // Add snow caps to mountains
    addSnowCapsToMountains();
}

/**
 * Adds snow cap effect to the mountains
 */
function addSnowCapsToMountains() {
    const style = document.createElement('style');
    style.id = 'snow-caps-style';
    style.textContent = `
        /* Snow caps for light mode */
        .mountain-back {
            background: linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.9) 0%,
                rgba(240, 248, 255, 0.8) 5%,
                rgba(240, 248, 255, 0.3) 8%,
                transparent 15%),
                radial-gradient(ellipse at bottom, #0c4a6e 30%, transparent 80%) !important;
        }
        
        .mountain-middle {
            background: linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.85) 0%,
                rgba(240, 248, 255, 0.75) 3%,
                rgba(240, 248, 255, 0.25) 6%,
                transparent 12%),
                radial-gradient(ellipse at bottom, #0e7490 30%, transparent 80%) !important;
        }
        
        .mountain-front {
            background: linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.8) 0%,
                rgba(240, 248, 255, 0.7) 2%,
                rgba(240, 248, 255, 0.2) 4%,
                transparent 10%),
                radial-gradient(ellipse at bottom, #065f46 30%, transparent 80%) !important;
        }
    `;
    
    document.head.appendChild(style);
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
    
    // Add satellites (visible in both light and dark mode)
    addSatellites(spaceElements, 3); // Add 3 satellites
    
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
 * Adds satellite elements that are visible in both light and dark modes
 * @param {HTMLElement} container - The container element for satellites
 * @param {number} count - Number of satellites to add
 */
function addSatellites(container, count) {
    for (let i = 0; i < count; i++) {
        const satellite = document.createElement('div');
        satellite.className = 'satellite';
        
        // Create satellite body
        const body = document.createElement('div');
        body.className = 'satellite-body';
        
        // Create solar panels
        const leftPanel = document.createElement('div');
        leftPanel.className = 'satellite-panel left-panel';
        
        const rightPanel = document.createElement('div');
        rightPanel.className = 'satellite-panel right-panel';
        
        // Append parts to satellite
        satellite.appendChild(leftPanel);
        satellite.appendChild(body);
        satellite.appendChild(rightPanel);
        
        // Random position
        const startY = Math.random() * 40; // Upper 40% of screen
        
        // Random animation duration and delay
        const duration = 180 + Math.random() * 120; // 180-300s to cross screen
        const delay = i * 40; // Stagger satellites
        
        satellite.style.top = `${startY}%`;
        satellite.style.animationDuration = `${duration}s`;
        satellite.style.animationDelay = `${delay}s`;
        
        container.appendChild(satellite);
    }
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
        
        /* Satellite styling */
        .satellite {
            position: absolute;
            left: -50px; /* Start offscreen */
            display: flex;
            align-items: center;
            transform: scale(0.5);
            animation: orbit linear infinite;
            z-index: -13;
        }
        
        .satellite-body {
            width: 12px;
            height: 24px;
            background-color: #d4d4d8;
            border: 1px solid #a1a1aa;
            border-radius: 2px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .satellite-panel {
            width: 24px;
            height: 8px;
            background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
            border: 1px solid #2563eb;
        }
        
        .left-panel {
            margin-right: 2px;
        }
        
        .right-panel {
            margin-left: 2px;
        }
        
        @keyframes orbit {
            from { transform: translateX(-50px) scale(0.5); }
            to { transform: translateX(calc(100vw + 50px)) scale(0.5); }
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
                opacity: 0.4; /* Increased from 0.2 */
            }
            
            .star {
                opacity: 0.5; /* Increased from 0.3 */
                box-shadow: 0 0 3px rgba(100, 100, 255, 0.6); /* Bluish glow */
            }
            
            .moon {
                opacity: 0.8; /* Increased from 0.7 */
            }
            
            .constellation {
                opacity: 0.6; /* Increased from 0.4 */
            }
            
            /* Make satellites more visible in light mode */
            .satellite {
                filter: drop-shadow(0 0 3px rgba(0, 0, 50, 0.5));
            }
            
            /* Add subtle shooting stars to light mode */
            .shooting-star {
                opacity: 0.4;
                height: 1px;
                box-shadow: 0 0 2px rgba(100, 100, 255, 0.6);
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
            
            .satellite {
                transform: scale(0.3); /* Smaller satellites on mobile */
            }
            
            @keyframes orbit {
                from { transform: translateX(-30px) scale(0.3); }
                to { transform: translateX(calc(100vw + 30px)) scale(0.3); }
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
            /* Enhanced space background for dark mode */
            .mountain-background {
                background: linear-gradient(to bottom, 
                    #0f0221 0%, 
                    #0c1339 30%, 
                    #081c51 70%, 
                    #102346 100%);
            }
            
            /* Add nebula effects */
            .mountain-background::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(103, 65, 217, 0.15), transparent 25%),
                    radial-gradient(circle at 80% 40%, rgba(158, 58, 185, 0.1), transparent 35%),
                    radial-gradient(circle at 40% 80%, rgba(83, 49, 156, 0.15), transparent 30%);
                z-index: -14;
                pointer-events: none;
            }
            
            /* Dark mode mountains with snow caps */
            .mountain-back {
                background: linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.95) 0%,
                    rgba(230, 240, 255, 0.9) 3%,
                    rgba(200, 230, 255, 0.6) 6%,
                    rgba(150, 200, 255, 0.3) 10%,
                    transparent 15%),
                    radial-gradient(ellipse at bottom, #0c4a6e 30%, transparent 80%) !important;
                opacity: 0.7 !important;
            }
            
            .mountain-middle {
                background: linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.9) 0%,
                    rgba(230, 240, 255, 0.85) 2%,
                    rgba(200, 230, 255, 0.55) 4%,
                    rgba(150, 200, 255, 0.25) 7%,
                    transparent 12%),
                    radial-gradient(ellipse at bottom, #0e7490 30%, transparent 80%) !important;
                opacity: 0.8 !important;
            }
            
            .mountain-front {
                background: linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.85) 0%,
                    rgba(230, 240, 255, 0.8) 1.5%,
                    rgba(200, 230, 255, 0.5) 3%,
                    rgba(150, 200, 255, 0.2) 5%,
                    transparent 10%),
                    radial-gradient(ellipse at bottom, #065f46 30%, transparent 80%) !important;
                opacity: 0.9 !important;
            }
            
            /* Rest of dark mode styles */
            .forest-layer {
                background: radial-gradient(ellipse at top center, rgba(6, 95, 70, 0.5) 10%, transparent 70%) !important;
                opacity: 0.8 !important;
            }
            
            /* Only remove specific background patterns that cause lines */
            .forest-layer::before,
            .forest-layer::after {
                display: none !important;
            }
            
            .theme-background {
                opacity: 0.05 !important;
            }
            
            /* Fix transit map overlay in dark mode */
            .transit-map-overlay {
                opacity: 0.1 !important;
            }
            
            .transit-line {
                height: 2px !important;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%) !important;
                box-shadow: none !important;
            }
            
            /* Remove only vertical linear gradients */
            .transit-layer,
            .mountains-layer,
            .transit-curve {
                background-image: none !important;
            }
            
            /* Enhanced star visibility */
            .space-elements {
                opacity: 1 !important;
            }
            
            .star {
                opacity: 0.9 !important;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.9) !important;
            }
            
            .moon {
                opacity: 1 !important;
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.9) !important;
                background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(220,240,255,0.9) 70%) !important;
            }
            
            .shooting-star {
                height: 3px !important;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.9) !important;
                background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%) !important;
            }
        `;
        
        // Remove existing dark mode styles if any
        const existingStyles = document.getElementById('mountain-dark-mode-styles');
        if (existingStyles) existingStyles.remove();
        
        document.head.appendChild(mountainStyles);
        
        // Add more stars for dark mode
        enhanceSpaceForDarkMode();
        
    } else {
        // Light mode - remove dark mode classes and styles
        mountainBackground.classList.remove('dark-mode');
        
        const existingStyles = document.getElementById('mountain-dark-mode-styles');
        if (existingStyles) existingStyles.remove();
        
        // Remove extra stars
        const extraStars = document.querySelector('.extra-stars');
        if (extraStars) extraStars.remove();
        
        // Add light mode specific enhancements
        enhanceSpaceForLightMode();
    }
}

/**
 * Add additional space elements specifically for dark mode
 */
function enhanceSpaceForDarkMode() {
    // Remove previous extra stars if they exist
    const oldExtraStars = document.querySelector('.extra-stars');
    if (oldExtraStars) oldExtraStars.remove();
    
    const mountainBackground = document.querySelector('.mountain-background');
    if (!mountainBackground) return;
    
    // Create container for extra space elements
    const extraStars = document.createElement('div');
    extraStars.className = 'extra-stars';
    
    // Add purple nebula effects
    const nebulaCount = 3;
    for (let i = 0; i < nebulaCount; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 60; // Keep in upper 60% of screen
        
        // Random size
        const size = 150 + Math.random() * 200;
        
        // Random opacity
        const opacity = 0.05 + Math.random() * 0.15;
        
        // Random hue variation (purples and blues)
        const hue = 250 + (Math.random() * 60 - 30); // 220-280 range (purple-blue)
        
        nebula.style.left = `${x}%`;
        nebula.style.top = `${y}%`;
        nebula.style.width = `${size}px`;
        nebula.style.height = `${size * 0.6}px`;
        nebula.style.background = `radial-gradient(ellipse at center, hsla(${hue}, 80%, 60%, ${opacity}) 0%, transparent 70%)`;
        nebula.style.borderRadius = '50%';
        nebula.style.transform = `rotate(${Math.random() * 360}deg)`;
        nebula.style.position = 'absolute';
        nebula.style.zIndex = '-14';
        nebula.style.pointerEvents = 'none';
        
        extraStars.appendChild(nebula);
    }
    
    // Add many more stars
    const extraStarCount = 150; // More stars for dark mode
    for (let i = 0; i < extraStarCount; i++) {
        const star = document.createElement('div');
        star.className = 'extra-star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 80; // 0-80% of screen height
        
        // Random size (slightly smaller than primary stars)
        const size = 0.5 + Math.random() * 2;
        
        // Random brightness
        const brightness = 0.5 + Math.random() * 0.5;
        
        // Random twinkle effect
        const delay = Math.random() * 5;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = '#ffffff';
        star.style.borderRadius = '50%';
        star.style.position = 'absolute';
        star.style.zIndex = '-13';
        star.style.opacity = brightness.toString();
        star.style.boxShadow = `0 0 ${size}px rgba(255, 255, 255, ${brightness * 0.5})`;
        star.style.animation = `twinkle ${3 + Math.random() * 4}s infinite ease-in-out alternate`;
        star.style.animationDelay = `${delay}s`;
        star.style.pointerEvents = 'none';
        
        extraStars.appendChild(star);
    }
    
    // Add space dust (tiny stars)
    const dustCount = 200;
    for (let i = 0; i < dustCount; i++) {
        const dust = document.createElement('div');
        dust.className = 'space-dust';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 80;
        
        // Very small size
        const size = 0.3 + Math.random() * 0.5;
        
        // Low opacity
        const opacity = 0.3 + Math.random() * 0.3;
        
        dust.style.left = `${x}%`;
        dust.style.top = `${y}%`;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        dust.style.backgroundColor = '#ffffff';
        dust.style.borderRadius = '50%';
        dust.style.position = 'absolute';
        dust.style.zIndex = '-14';
        dust.style.opacity = opacity.toString();
        dust.style.pointerEvents = 'none';
        
        extraStars.appendChild(dust);
    }
    
    // Insert before other elements in the mountain background
    mountainBackground.insertBefore(extraStars, mountainBackground.firstChild);
    
    // Add CSS for extra stars
    addExtraStarsCSS();
}

/**
 * Add CSS for extra space elements in dark mode
 */
function addExtraStarsCSS() {
    // Check if the style already exists
    const existingStyle = document.getElementById('extra-stars-style');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'extra-stars-style';
    style.textContent = `
        .extra-stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -13;
        }
        
        .extra-star {
            animation: twinkle-extra 4s infinite ease-in-out alternate;
        }
        
        @keyframes twinkle-extra {
            0% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 0.9; transform: scale(1.0); }
            100% { opacity: 0.2; transform: scale(0.8); }
        }
        
        .nebula {
            animation: nebula-pulse 15s infinite ease-in-out alternate;
            mix-blend-mode: screen;
        }
        
        @keyframes nebula-pulse {
            0% { opacity: 0.5; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.1) rotate(5deg); }
            100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .nebula {
                animation-duration: 20s;
            }
            
            .extra-star {
                animation-duration: 6s;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Add light mode specific space elements
 */
function enhanceSpaceForLightMode() {
    const spaceElements = document.querySelector('.space-elements');
    if (!spaceElements) return;
    
    // Make existing stars more visible in light mode
    const stars = spaceElements.querySelectorAll('.star');
    stars.forEach(star => {
        // Increase brightness of some stars
        if (Math.random() > 0.7) {
            const sizePx = parseFloat(star.style.width);
            star.style.boxShadow = `0 0 ${sizePx * 2}px rgba(100, 100, 255, 0.7)`;
            star.style.opacity = '0.7';
        }
    });
    
    // Add a few daytime shooting stars - very subtle
    for (let i = 0; i < 2; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star light-mode';
        
        // Random position and angle
        const x = Math.random() * 100;
        const y = Math.random() * 25; // Upper part of sky
        const angle = -15 - Math.random() * 30;
        
        const delay = i * 30 + Math.random() * 30;
        const duration = 15 + Math.random() * 10;
        
        shootingStar.style.left = `${x}%`;
        shootingStar.style.top = `${y}%`;
        shootingStar.style.transform = `rotate(${angle}deg)`;
        shootingStar.style.animationDelay = `${delay}s`;
        shootingStar.style.animationDuration = `${duration}s`;
        
        spaceElements.appendChild(shootingStar);
    }
}

/**
 * Apply theme based on user preference or system setting
 * @param {string} theme - 'light', 'dark', or 'auto'
 */
function applyTheme(theme) {
    // Apply theme classes (this is now redundant with theme-init.js but kept for compatibility)
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    document.documentElement.classList.add(`${theme}-theme`);
    
    if (theme === 'light') {
        // Remove extra stars from dark mode
        const extraStars = document.querySelector('.extra-stars');
        if (extraStars) extraStars.remove();
        
        // Apply light mode specific enhancements
        enhanceSpaceForLightMode();
    } else if (theme === 'dark') {
        // Add dark mode specific enhancements
        enhanceSpaceForDarkMode();
    } else {
        // Auto theme (system preference)
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            enhanceSpaceForDarkMode();
        } else {
            // Remove extra stars from dark mode
            const extraStars = document.querySelector('.extra-stars');
            if (extraStars) extraStars.remove();
            
            // Apply light mode enhancements
            enhanceSpaceForLightMode();
        }
    }
    
    // Update dark mode styles based on effective theme
    const effectiveDarkMode = (theme === 'dark' || 
        (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    updateDarkModeStyles(effectiveDarkMode);
}

/**
 * Theme JavaScript - Handles dynamic theme elements like stars and mountain backgrounds
 */
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeVisuals);
    } else {
        initThemeVisuals();
    }
    
    // Also run on window load to catch all elements
    window.addEventListener('load', initThemeVisuals);
    
    function initThemeVisuals() {
        // First check if we're in dark mode (either explicit or via auto)
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isVisualDarkMode = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDarkMode);
        
        console.log(`Theme visuals - current: ${currentTheme}, dark mode: ${isVisualDarkMode}`);
        
        // Create mountain backgrounds if they don't exist yet
        ensureMountainBackground();
        
        // Create stars if they don't exist yet
        if (isVisualDarkMode) {
            ensureStars();
        }
        
        // Update visibility based on current visual mode
        updateThemeVisibility(isVisualDarkMode);
        
        // Listen for system preference changes if in auto mode
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (currentTheme === 'auto') {
                updateThemeVisibility(e.matches);
            }
        });
    }
    
    function ensureMountainBackground() {
        // Create both light and dark theme mountains
        if (!document.querySelector('.light-theme-mountain')) {
            createMountain('light-theme-mountain');
        }
        
        if (!document.querySelector('.dark-theme-mountain')) {
            createMountain('dark-theme-mountain');
        }
    }
    
    function createMountain(className) {
        const mountainElem = document.createElement('div');
        mountainElem.className = className;
        document.body.appendChild(mountainElem);
    }
    
    function ensureStars() {
        if (!document.querySelector('.stars-container')) {
            createStars();
        }
    }
    
    function createStars() {
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container extra-stars';
        document.body.appendChild(starsContainer);
        
        // Create regular stars
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
        
        // Create shooting stars
        for (let i = 0; i < 3; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.left = `${Math.random() * 100}%`;
            shootingStar.style.top = `${Math.random() * 50}%`;
            shootingStar.style.animationDelay = `${Math.random() * 10 + 5}s`;
            starsContainer.appendChild(shootingStar);
        }
    }
    
    function updateThemeVisibility(isDarkMode) {
        // Update classes on root element to ensure proper CSS applies
        if (isDarkMode) {
            document.documentElement.classList.add('visual-dark-mode');
            document.documentElement.classList.remove('visual-light-mode');
        } else {
            document.documentElement.classList.add('visual-light-mode');
            document.documentElement.classList.remove('visual-dark-mode');
        }
        
        // Update stars visibility
        const stars = document.querySelector('.stars-container');
        if (stars) {
            stars.style.display = isDarkMode ? 'block' : 'none';
        }
        
        // Update mountain backgrounds
        const lightMountain = document.querySelector('.light-theme-mountain');
        const darkMountain = document.querySelector('.dark-theme-mountain');
        
        if (lightMountain) {
            lightMountain.style.display = isDarkMode ? 'none' : 'block';
        }
        
        if (darkMountain) {
            darkMountain.style.display = isDarkMode ? 'block' : 'none';
        }
        
        // Update data attribute on body for easier CSS targeting
        document.body.dataset.visualMode = isDarkMode ? 'dark' : 'light';
    }
})();