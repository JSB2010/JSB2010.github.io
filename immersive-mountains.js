/**
 * Immersive Mountain Background System
 * Creates a dynamic, responsive, and visually stunning mountain background
 * with parallax effects and theme integration
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImmersiveMountains();
});

/**
 * Initialize the immersive mountain background system
 */
function initImmersiveMountains() {
    // Create mountain container if it doesn't exist
    if (document.querySelector('.immersive-mountains')) return;

    console.log('Initializing immersive mountain background system');

    // Create container
    const mountainsContainer = document.createElement('div');
    mountainsContainer.className = 'immersive-mountains';

    // Create SVG mountains with more realistic, varied shapes
    mountainsContainer.innerHTML = `
        <div class="mountains-parallax-container">
            <!-- Sky gradient layer -->
            <div class="sky-gradient"></div>

            <!-- Stars layer (visible in dark mode) -->
            <div class="stars-layer"></div>

            <!-- Far background mountains -->
            <svg class="mountain-layer mountain-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,160 L60,150 L120,170 L180,155 L240,175 L300,160 L360,180 L420,165 L480,185 L540,170 L600,190 L660,175 L720,195 L780,180 L840,200 L900,185 L960,205 L1020,190 L1080,210 L1140,195 L1200,215 L1260,200 L1320,220 L1380,205 L1440,225 L1440,320 L0,320 Z"></path>

                <!-- Snow caps for far mountains -->
                <path class="mountain-snow" d="M240,175 L245,180 L240,177 L235,180 Z M480,185 L485,190 L480,187 L475,190 Z M720,195 L725,200 L720,197 L715,200 Z M960,205 L965,210 L960,207 L955,210 Z M1200,215 L1205,220 L1200,217 L1195,220 Z"></path>
            </svg>

            <!-- Mid-distance mountains -->
            <svg class="mountain-layer mountain-mid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <!-- Left side mountains -->
                <path d="M0,200 L40,190 L80,210 L120,195 L160,215 L200,200 L240,220 L280,205 L320,225 L360,210 L400,230 L440,215 L480,235 L520,220 L560,240 L600,225 L640,245 L680,230 L720,250 L720,320 L0,320 Z"></path>

                <!-- Right side mountains -->
                <path d="M680,230 L720,250 L760,235 L800,255 L840,240 L880,260 L920,245 L960,265 L1000,250 L1040,270 L1080,255 L1120,275 L1160,260 L1200,280 L1240,265 L1280,285 L1320,270 L1360,290 L1400,275 L1440,295 L1440,320 L680,320 Z"></path>

                <!-- Snow caps for mid mountains -->
                <path class="mountain-snow" d="M160,215 L165,220 L160,217 L155,220 Z M320,225 L325,230 L320,227 L315,230 Z M480,235 L485,240 L480,237 L475,240 Z M640,245 L645,250 L640,247 L635,250 Z M800,255 L805,260 L800,257 L795,260 Z M960,265 L965,270 L960,267 L955,270 Z M1120,275 L1125,280 L1120,277 L1115,280 Z M1280,285 L1285,290 L1280,287 L1275,290 Z"></path>
            </svg>

            <!-- Foreground mountains with more dramatic peaks -->
            <svg class="mountain-layer mountain-front" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <!-- Dramatic peak 1 -->
                <path d="M0,260 L60,250 L120,270 L180,255 L240,275 L300,260 L360,280 L420,265 L480,285 L540,270 L600,290 L600,320 L0,320 Z"></path>

                <!-- Dramatic peak 2 - Sharp mountain -->
                <path d="M540,270 L600,290 L660,275 L720,295 L780,280 L840,300 L900,285 L900,320 L540,320 Z"></path>

                <!-- Dramatic peak 3 - Tallest mountain -->
                <path d="M840,300 L900,285 L960,305 L1020,290 L1080,310 L1140,295 L1200,315 L1200,320 L840,320 Z"></path>

                <!-- Dramatic peak 4 -->
                <path d="M1140,295 L1200,315 L1260,300 L1320,320 L1380,305 L1440,325 L1440,320 L1140,320 Z"></path>

                <!-- Snow caps for foreground mountains -->
                <path class="mountain-snow" d="M240,275 L245,280 L240,277 L235,280 Z M480,285 L485,290 L480,287 L475,290 Z M720,295 L725,300 L720,297 L715,300 Z M960,305 L965,310 L960,307 L955,310 Z M1200,315 L1205,320 L1200,317 L1195,320 Z"></path>
            </svg>

            <!-- Distinctive standalone peaks -->
            <svg class="mountain-layer mountain-peaks" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <!-- Sharp peak 1 -->
                <path d="M200,280 L240,220 L280,280 Z"></path>
                <path class="mountain-snow" d="M240,220 L245,230 L240,225 L235,230 Z"></path>

                <!-- Sharp peak 2 -->
                <path d="M600,290 L640,230 L680,290 Z"></path>
                <path class="mountain-snow" d="M640,230 L645,240 L640,235 L635,240 Z"></path>

                <!-- Sharp peak 3 -->
                <path d="M1000,300 L1040,240 L1080,300 Z"></path>
                <path class="mountain-snow" d="M1040,240 L1045,250 L1040,245 L1035,250 Z"></path>
            </svg>

            <!-- Forest/foothills layer -->
            <svg class="mountain-layer mountain-forest" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,290 C240,285 480,295 720,290 C960,285 1200,295 1440,290 L1440,320 L0,320 Z"></path>
            </svg>

            <!-- Trees layer -->
            <div class="trees-layer">
                <!-- Pine trees -->
                <svg class="tree-group tree-group-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" preserveAspectRatio="xMidYMax">
                    <path class="tree-trunk" d="M48,80 L52,80 L52,100 L48,100 Z"></path>
                    <path class="tree-top" d="M50,20 L30,50 L40,50 L25,70 L40,70 L30,85 L70,85 L60,70 L75,70 L60,50 L70,50 Z"></path>
                </svg>

                <svg class="tree-group tree-group-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80" preserveAspectRatio="xMidYMax">
                    <path class="tree-trunk" d="M48,80 L52,80 L52,100 L48,100 Z"></path>
                    <path class="tree-top" d="M50,20 L30,50 L40,50 L25,70 L40,70 L30,85 L70,85 L60,70 L75,70 L60,50 L70,50 Z"></path>
                </svg>

                <svg class="tree-group tree-group-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120" preserveAspectRatio="xMidYMax">
                    <path class="tree-trunk" d="M48,80 L52,80 L52,100 L48,100 Z"></path>
                    <path class="tree-top" d="M50,20 L30,50 L40,50 L25,70 L40,70 L30,85 L70,85 L60,70 L75,70 L60,50 L70,50 Z"></path>
                </svg>

                <!-- Rounded trees -->
                <svg class="tree-group tree-group-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="90" height="90" preserveAspectRatio="xMidYMax">
                    <path class="tree-trunk" d="M48,80 L52,80 L52,100 L48,100 Z"></path>
                    <circle class="tree-top rounded" cx="50" cy="50" r="30"></circle>
                </svg>

                <svg class="tree-group tree-group-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="70" height="70" preserveAspectRatio="xMidYMax">
                    <path class="tree-trunk" d="M48,80 L52,80 L52,100 L48,100 Z"></path>
                    <circle class="tree-top rounded" cx="50" cy="50" r="30"></circle>
                </svg>

                <!-- Tall pine -->
                <svg class="tree-group tree-group-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120" preserveAspectRatio="xMidYMax">
                    <path class="tree-trunk" d="M48,100 L52,100 L52,120 L48,120 Z"></path>
                    <path class="tree-top" d="M50,10 L35,40 L45,40 L30,65 L45,65 L30,90 L70,90 L55,65 L70,65 L55,40 L65,40 Z"></path>
                </svg>
            </div>

            <!-- Clouds layer -->
            <div class="clouds-layer">
                <div class="cloud cloud-1"></div>
                <div class="cloud cloud-2"></div>
                <div class="cloud cloud-3"></div>
                <div class="cloud cloud-4"></div>
                <div class="cloud cloud-5"></div>
            </div>

            <!-- Shooting stars (visible in dark mode) -->
            <div class="shooting-stars">
                <div class="shooting-star shooting-star-1"></div>
                <div class="shooting-star shooting-star-2"></div>
                <div class="shooting-star shooting-star-3"></div>
            </div>

            <!-- Satellites (visible in dark mode) -->
            <div class="satellites">
                <div class="satellite satellite-1"></div>
                <div class="satellite satellite-2"></div>
            </div>
        </div>
    `;

    // Create stars
    const starsLayer = mountainsContainer.querySelector('.stars-layer');
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        // Vary star sizes
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Make some stars brighter
        if (Math.random() > 0.7) {
            star.classList.add('bright');
        }

        starsLayer.appendChild(star);
    }

    // Add to body
    document.body.appendChild(mountainsContainer);
    console.log('Created immersive mountain background');

    // Add mountain styles
    addImmersiveMountainStyles();

    // Initialize parallax effect
    initParallaxEffect();
}

/**
 * Add styles for the immersive mountain background
 */
function addImmersiveMountainStyles() {
    if (document.getElementById('immersive-mountain-styles')) return;

    const style = document.createElement('style');
    style.id = 'immersive-mountain-styles';
    style.textContent = `
        /* Main container */
        .immersive-mountains {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
        }

        /* Parallax container */
        .mountains-parallax-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            perspective: 1000px;
        }

        /* Sky gradient */
        .sky-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(224, 242, 254, 0.5) 0%, rgba(186, 230, 253, 0.3) 100%);
            transition: all 0.5s ease;
        }

        /* Dark mode sky */
        :root.visual-dark-mode .sky-gradient {
            background: linear-gradient(to bottom, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%);
        }

        /* Stars layer */
        .stars-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        :root.visual-dark-mode .stars-layer {
            opacity: 1;
        }

        /* Individual star */
        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            opacity: 0.7;
            animation: twinkle 5s infinite alternate ease-in-out;
        }

        .star.bright {
            width: 3px;
            height: 3px;
            opacity: 0.9;
        }

        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); }
        }

        /* Mountain layers */
        .mountain-layer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            transition: transform 0.1s ease-out;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        /* Mountain positioning and parallax depths */
        .mountain-bg {
            height: 50%;
            transform: translateZ(-100px) scale(1.1);
        }

        .mountain-mid {
            height: 60%;
            transform: translateZ(-50px) scale(1.05);
        }

        .mountain-front {
            height: 40%;
            transform: translateZ(-25px) scale(1.025);
        }

        .mountain-peaks {
            height: 45%;
            transform: translateZ(-10px) scale(1.01);
        }

        .mountain-forest {
            height: 20%;
            transform: translateZ(0) scale(1);
        }

        /* Light mode mountain colors - realistic blue-green gradient */
        .mountain-bg path:not(.mountain-snow) {
            fill: rgba(56, 189, 248, 0.3); /* Light blue */
            transition: fill 0.5s ease;
        }

        .mountain-mid path:not(.mountain-snow) {
            fill: rgba(14, 165, 233, 0.4); /* Medium blue */
            transition: fill 0.5s ease;
        }

        .mountain-front path:not(.mountain-snow) {
            fill: rgba(2, 132, 199, 0.5); /* Darker blue */
            transition: fill 0.5s ease;
        }

        .mountain-peaks path:not(.mountain-snow) {
            fill: rgba(3, 105, 161, 0.6); /* Deep blue */
            transition: fill 0.5s ease;
        }

        .mountain-forest path {
            fill: rgba(16, 185, 129, 0.3); /* Green for forest */
            transition: fill 0.5s ease;
        }

        /* Snow caps */
        .mountain-snow {
            fill: rgba(255, 255, 255, 0.7);
            transition: fill 0.5s ease;
        }

        /* Dark mode mountain colors - deeper blue-teal gradient */
        :root.visual-dark-mode .mountain-bg path:not(.mountain-snow) {
            fill: rgba(12, 74, 110, 0.5); /* Dark blue */
        }

        :root.visual-dark-mode .mountain-mid path:not(.mountain-snow) {
            fill: rgba(15, 118, 110, 0.5); /* Dark teal */
        }

        :root.visual-dark-mode .mountain-front path:not(.mountain-snow) {
            fill: rgba(17, 94, 89, 0.6); /* Darker teal */
        }

        :root.visual-dark-mode .mountain-peaks path:not(.mountain-snow) {
            fill: rgba(7, 89, 133, 0.65); /* Deep blue */
        }

        :root.visual-dark-mode .mountain-forest path {
            fill: rgba(5, 150, 105, 0.4); /* Dark green for forest */
        }

        :root.visual-dark-mode .mountain-snow {
            fill: rgba(226, 232, 240, 0.5); /* Slightly dimmer snow for dark mode */
        }

        /* Clouds layer */
        .clouds-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        /* Individual cloud */
        .cloud {
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            filter: blur(20px);
            opacity: 0.7;
            transition: opacity 0.5s ease;
        }

        :root.visual-dark-mode .cloud {
            opacity: 0.2;
        }

        .cloud-1 {
            width: 200px;
            height: 60px;
            top: 20%;
            left: 10%;
            animation: cloud-drift-1 120s linear infinite;
        }

        .cloud-2 {
            width: 300px;
            height: 80px;
            top: 15%;
            left: 30%;
            animation: cloud-drift-2 180s linear infinite;
        }

        .cloud-3 {
            width: 250px;
            height: 70px;
            top: 25%;
            left: 50%;
            animation: cloud-drift-3 150s linear infinite;
        }

        .cloud-4 {
            width: 350px;
            height: 90px;
            top: 10%;
            left: 70%;
            animation: cloud-drift-4 200s linear infinite;
        }

        .cloud-5 {
            width: 180px;
            height: 50px;
            top: 30%;
            left: 85%;
            animation: cloud-drift-5 160s linear infinite;
        }

        @keyframes cloud-drift-1 {
            0% { transform: translateX(-300px); }
            100% { transform: translateX(calc(100vw + 300px)); }
        }

        @keyframes cloud-drift-2 {
            0% { transform: translateX(calc(100vw + 300px)); }
            100% { transform: translateX(-300px); }
        }

        @keyframes cloud-drift-3 {
            0% { transform: translateX(-300px); }
            100% { transform: translateX(calc(100vw + 300px)); }
        }

        @keyframes cloud-drift-4 {
            0% { transform: translateX(calc(100vw + 300px)); }
            100% { transform: translateX(-300px); }
        }

        @keyframes cloud-drift-5 {
            0% { transform: translateX(-300px); }
            100% { transform: translateX(calc(100vw + 300px)); }
        }

        /* Shooting stars */
        .shooting-stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        :root.visual-dark-mode .shooting-stars {
            opacity: 1;
        }

        .shooting-star {
            position: absolute;
            width: 100px;
            height: 1px;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
            opacity: 0;
            transform: rotate(-45deg);
            animation: shooting 10s linear infinite;
        }

        .shooting-star::before {
            content: '';
            position: absolute;
            width: 10px;
            height: 1px;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 100%);
            transform: translateY(-1px);
        }

        .shooting-star-1 {
            top: 20%;
            left: 30%;
            animation-delay: 3s;
        }

        .shooting-star-2 {
            top: 15%;
            left: 60%;
            animation-delay: 7s;
        }

        .shooting-star-3 {
            top: 25%;
            left: 80%;
            animation-delay: 15s;
        }

        @keyframes shooting {
            0% {
                opacity: 0;
                transform: rotate(-45deg) translateX(0);
            }
            1% {
                opacity: 1;
            }
            5% {
                opacity: 1;
                transform: rotate(-45deg) translateX(200px);
            }
            6% {
                opacity: 0;
            }
            100% {
                opacity: 0;
                transform: rotate(-45deg) translateX(200px);
            }
        }

        /* Satellites */
        .satellites {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        :root.visual-dark-mode .satellites {
            opacity: 1;
        }

        .satellite {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
        }

        .satellite-1 {
            top: 10%;
            left: 20%;
            animation: satellite-1 60s linear infinite;
        }

        .satellite-2 {
            top: 15%;
            left: 70%;
            animation: satellite-2 80s linear infinite;
        }

        @keyframes satellite-1 {
            0% { transform: translate(0, 0); }
            100% { transform: translate(calc(100vw - 40%), 5%); }
        }

        @keyframes satellite-2 {
            0% { transform: translate(0, 0); }
            100% { transform: translate(calc(-100vw + 40%), 10%); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .mountain-bg {
                height: 40%;
            }

            .mountain-mid {
                height: 50%;
            }

            .mountain-front {
                height: 30%;
            }

            .mountain-peaks {
                height: 35%;
            }

            .mountain-forest {
                height: 15%;
            }

            .cloud {
                filter: blur(15px);
            }
        }

        @media (max-width: 480px) {
            .mountain-bg {
                height: 30%;
            }

            .mountain-mid {
                height: 40%;
            }

            .mountain-front {
                height: 25%;
            }

            .mountain-peaks {
                height: 30%;
            }

            .mountain-forest {
                height: 10%;
            }

            .cloud {
                filter: blur(10px);
            }
        }

        /* Trees layer */
        .trees-layer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20%;
            pointer-events: none;
            z-index: 2;
        }

        /* Tree groups */
        .tree-group {
            position: absolute;
            bottom: 0;
            transform-origin: bottom center;
            animation: tree-sway 8s ease-in-out infinite alternate;
            will-change: transform;
        }

        .tree-group-1 {
            left: 5%;
            animation-delay: 0s;
        }

        .tree-group-2 {
            left: 15%;
            animation-delay: 1s;
        }

        .tree-group-3 {
            left: 25%;
            animation-delay: 2s;
        }

        .tree-group-4 {
            left: 60%;
            animation-delay: 1.5s;
        }

        .tree-group-5 {
            left: 75%;
            animation-delay: 0.5s;
        }

        .tree-group-6 {
            left: 85%;
            animation-delay: 2.5s;
        }

        /* Tree parts */
        .tree-trunk {
            fill: #5D4037;
        }

        .tree-top {
            fill: #2E7D32;
            transition: fill 0.5s ease;
        }

        .tree-top.rounded {
            fill: #388E3C;
        }

        /* Dark mode trees */
        :root.visual-dark-mode .tree-top {
            fill: #1B5E20;
        }

        :root.visual-dark-mode .tree-top.rounded {
            fill: #2E7D32;
        }

        /* Tree animation */
        @keyframes tree-sway {
            0% {
                transform: rotate(-1deg);
            }
            100% {
                transform: rotate(1deg);
            }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .mountain-layer,
            .cloud,
            .shooting-star,
            .satellite,
            .star,
            .tree-group {
                animation: none !important;
                transition: none !important;
            }
        }
    `;

    document.head.appendChild(style);
}

/**
 * Initialize parallax effect for mountains
 */
function initParallaxEffect() {
    // Skip if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const mountainLayers = document.querySelectorAll('.mountain-layer');
    const cloudsLayer = document.querySelector('.clouds-layer');

    // Parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Apply different parallax depths to each layer
        mountainLayers.forEach(layer => {
            const depth = parseFloat(getComputedStyle(layer).getPropertyValue('transform').split(',')[14]) || 0;
            const movement = depth / -100;

            // Calculate movement based on depth
            const moveX = x * movement * 20;
            const moveY = y * movement * 10;

            // Apply transform
            layer.style.transform = `translateZ(${depth}px) translateX(${moveX}px) translateY(${moveY}px) scale(${1 + Math.abs(depth) / 1000})`;
        });

        // Move clouds in opposite direction for enhanced depth
        if (cloudsLayer) {
            cloudsLayer.style.transform = `translateX(${-x * 20}px) translateY(${-y * 10}px)`;
        }
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', function() {
        mountainLayers.forEach(layer => {
            const depth = parseFloat(getComputedStyle(layer).getPropertyValue('transform').split(',')[14]) || 0;
            layer.style.transform = `translateZ(${depth}px) scale(${1 + Math.abs(depth) / 1000})`;
        });

        if (cloudsLayer) {
            cloudsLayer.style.transform = 'translateX(0) translateY(0)';
        }
    });

    // Subtle parallax on scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        mountainLayers.forEach(layer => {
            const depth = parseFloat(getComputedStyle(layer).getPropertyValue('transform').split(',')[14]) || 0;
            const movement = depth / -100;

            // Calculate movement based on depth and scroll position
            const moveY = scrollY * movement * 0.05;

            // Get current X transform if any
            const currentTransform = layer.style.transform;
            const currentX = currentTransform.includes('translateX')
                ? parseFloat(currentTransform.split('translateX(')[1])
                : 0;

            // Apply transform preserving X movement from mouse
            layer.style.transform = `translateZ(${depth}px) translateX(${currentX}px) translateY(${moveY}px) scale(${1 + Math.abs(depth) / 1000})`;
        });
    }, { passive: true });
}
