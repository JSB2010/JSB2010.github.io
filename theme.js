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