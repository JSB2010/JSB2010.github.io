document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to update active button state
    const updateActiveButton = (activeTheme) => {
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === activeTheme);
        });
    };
    
    // Function to apply theme
    const applyTheme = (theme) => {
        const root = document.documentElement;
        let effectiveTheme = theme;
        
        if (theme === 'system') {
            effectiveTheme = prefersDark.matches ? 'dark' : 'light';
        }
        
        // Remove any existing theme
        root.removeAttribute('data-theme');
        // Set new theme
        root.setAttribute('data-theme', effectiveTheme);
        localStorage.setItem('theme', theme);
        updateActiveButton(theme);
        
        // Force a repaint to ensure theme changes are applied
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger a reflow
        document.body.style.display = '';
    };
    
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Initialize theme
    applyTheme(savedTheme);
    
    // Add click handlers to buttons
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
        });
    });
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });
});