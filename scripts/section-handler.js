document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and content sections
    const navLinks = document.querySelectorAll('.nav-links li[data-section]');
    const sections = document.querySelectorAll('.content-section');

    // Function to show a section with smooth transition
    function showSection(sectionId) {
        // Hide all sections first with fade out
        sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.style.opacity = '0';
                setTimeout(() => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }, 300);
            }
        });

        // Show the selected section with fade in
        setTimeout(() => {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
                // Force a reflow
                targetSection.offsetHeight;
                // Fade in
                targetSection.style.opacity = '1';
            }
        }, 300);
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);

            // On mobile, close the sidebar after selection
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });

    // Show initial section (overview)
    showSection('overview');

    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            (!menuToggle || !menuToggle.contains(e.target))) {
            sidebar.classList.remove('active');
        }
    });
});
