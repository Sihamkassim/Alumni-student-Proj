document.addEventListener('DOMContentLoaded', function() {
    // Modal handling functions
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Add event listeners for buttons
    document.getElementById('addUserBtn').addEventListener('click', function() {
        openModal('addUserModal');
    });

    document.getElementById('addEventBtn').addEventListener('click', function() {
        openModal('addEventModal');
    });

    document.getElementById('addOpportunityBtn').addEventListener('click', function() {
        openModal('addOpportunityModal');
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // Form submission handlers
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Get form data
        const formData = new FormData(this);
        // Here you would typically send this data to your backend
        console.log('Adding new user:', Object.fromEntries(formData));
        closeModal('addUserModal');
        // Show success message
        showNotification('User added successfully!');
    });

    document.getElementById('addEventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        console.log('Creating new event:', Object.fromEntries(formData));
        closeModal('addEventModal');
        showNotification('Event created successfully!');
    });

    document.getElementById('addOpportunityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        console.log('Creating new opportunity:', Object.fromEntries(formData));
        closeModal('addOpportunityModal');
        showNotification('Opportunity created successfully!');
    });

    // Generate Report functionality
    document.getElementById('generateReportBtn').addEventListener('click', function() {
        // Here you would typically make an API call to generate the report
        showNotification('Generating report...');
        setTimeout(() => {
            // Simulate report generation
            const reportData = {
                totalUsers: document.getElementById('totalUsers').textContent,
                totalAlumni: document.getElementById('totalAlumni').textContent,
                totalStudents: document.getElementById('totalStudents').textContent,
                activeEvents: document.getElementById('activeEvents').textContent,
                timestamp: new Date().toLocaleString()
            };
            
            // Create and download report
            downloadReport(reportData);
        }, 1500);
    });

    // Navigation functionality
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.nav-links li').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId)?.classList.add('active');
        });
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            // Clear any stored session data
            localStorage.removeItem('adminToken');
            // Redirect to index page
            window.location.href = 'index.html';
        }
    });

    // Utility functions
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function downloadReport(data) {
        const reportContent = `
Alumni Connect - Administrative Report
Generated on: ${data.timestamp}

Summary:
- Total Users: ${data.totalUsers}
- Total Alumni: ${data.totalAlumni}
- Total Students: ${data.totalStudents}
- Active Events: ${data.activeEvents}
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        showNotification('Report downloaded successfully!');
    }

    // Initialize dashboard data
    function initializeDashboard() {
        // Simulate loading data from backend
        setTimeout(() => {
            document.getElementById('totalUsers').textContent = '1,234';
            document.getElementById('totalAlumni').textContent = '789';
            document.getElementById('totalStudents').textContent = '445';
            document.getElementById('activeEvents').textContent = '12';
        }, 1000);
    }

    // Call initialization function
    initializeDashboard();
});
