// Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons and projects
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.project');
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projects.forEach(project => {
                if (filterValue === 'all') {
                    // Show all projects with animation
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        project.style.display = 'flex';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 50);
                    }, 300);
                } else if (project.classList.contains(filterValue)) {
                    // Show projects that match the filter
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        project.style.display = 'flex';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 50);
                    }, 300);
                } else {
                    // Hide projects that don't match the filter
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add hover effects for project cards
    projects.forEach(project => {
        project.addEventListener('mouseenter', function() {
            // Add subtle parallax effect to the card content
            const content = this.querySelector('.project-content');
            if (content) {
                content.style.transform = 'translateZ(20px)';
            }
        });
        
        project.addEventListener('mouseleave', function() {
            // Reset parallax effect
            const content = this.querySelector('.project-content');
            if (content) {
                content.style.transform = 'translateZ(10px)';
            }
        });
    });
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        projects.forEach(project => {
            project.style.transition = 'none';
            const elements = project.querySelectorAll('*');
            elements.forEach(el => {
                el.style.transition = 'none';
                el.style.animation = 'none';
            });
        });
    }
});
