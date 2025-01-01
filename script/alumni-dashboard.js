document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            // Clear any stored session data
            localStorage.removeItem('alumniToken');
            // Redirect to index page
            window.location.href = 'index.html';
        }
    });

    // Initialize dashboard data
    function initializeDashboard() {
        // Add any dashboard initialization code here
    }

    // Call initialization function
    initializeDashboard();
});
