document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.dataset.section) {
                e.preventDefault();
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === this.dataset.section) {
                        section.classList.add('active');
                    }
                });
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // Real user data
    const users = [
        {
            id: 1,
            name: 'Siham Kassim',
            role: 'Student',
            department: 'Software Engineering',
            status: 'active',
            lastActive: 'Just now',
            image: 'image/student.jpg'
        },
        {
            id: 2,
            name: 'Hilwa',
            role: 'Student',
            department: 'Cybersecurity',
            status: 'active',
            lastActive: '5 hours ago',
            image: 'image/student.jpg'
        },
        {
            id: 3,
            name: 'Lidya Sisay',
            role: 'Alumni',
            department: 'Software Engineering',
            status: 'active',
            lastActive: '2 hours ago',
            image: 'image/alumni1.jpg'
        },
        {
            id: 4,
            name: 'Mercy',
            role: 'Alumni',
            department: 'Computer Science',
            status: 'inactive',
            lastActive: '1 day ago',
            image: 'image/alumni1.jpg'
        },
        {
            id: 5,
            name: 'Khulud Moh',
            role: 'Student',
            department: 'Data Science',
            status: 'active',
            lastActive: '3 hours ago',
            image: 'image/student.jpg'
        }
    ];

    // Function to populate users table
    function populateUsersTable() {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            const profileImage = user.role === 'Student' ? 'image/student.jpg' : 'image/alumni1.jpg';
            
            tr.innerHTML = `
                <td>
                    <div class="user-info">
                        <img src="${profileImage}" alt="${user.name}" class="user-avatar">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.role}</td>
                <td>${user.department}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>${user.lastActive}</td>
                <td class="actions-cell">
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${user.id}" data-name="${user.name}" data-role="${user.role}" data-department="${user.department}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="btn-delete" data-id="${user.id}" data-name="${user.name}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Handle Edit Buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const userData = {
                id: this.dataset.id,
                name: this.dataset.name,
                role: this.dataset.role,
                department: this.dataset.department
            };
            openEditModal(userData);
        });
    });

    // Handle Delete Buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.id;
            const userName = this.dataset.name;
            deleteUser(userId, userName);
        });
    });

    function openEditModal(userData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit User</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <form id="editUserForm">
                    <div class="form-group">
                        <label for="editName">Name</label>
                        <input type="text" id="editName" name="editName" value="${userData.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editRole">Role</label>
                        <select id="editRole" name="editRole" required>
                            <option value="Student" ${userData.role === 'Student' ? 'selected' : ''}>Student</option>
                            <option value="Alumni" ${userData.role === 'Alumni' ? 'selected' : ''}>Alumni</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editDepartment">Department</label>
                        <input type="text" id="editDepartment" name="editDepartment" value="${userData.department}">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary close-modal">Cancel</button>
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#editUserForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Update user in the table
            const userRow = document.querySelector(`button[data-id="${userData.id}"]`).closest('tr');
            const newRole = form.editRole.value;
            
            userRow.querySelector('.user-info span').textContent = form.editName.value;
            userRow.querySelector('td:nth-child(2)').textContent = newRole;
            userRow.querySelector('td:nth-child(3)').textContent = form.editDepartment.value;
            
            // Update image based on role
            const userImage = userRow.querySelector('.user-info img');
            userImage.src = newRole === 'Student' ? 'image/student.jpg' : 'image/alumni1.jpg';
            
            // Close modal and show notification
            closeModal(modal);
            showNotification('User updated successfully');
        });

        // Handle modal close
        const closeButtons = modal.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.style.display = 'block';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });
    }

    function deleteUser(userId, userName) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>User Action</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>What would you like to do with ${userName}'s account?</p>
                    <div class="action-choices">
                        <button class="btn-deactivate">
                            <i class="fas fa-user-slash"></i>
                            Deactivate Account
                        </button>
                        <button class="btn-permanent-delete">
                            <i class="fas fa-trash"></i>
                            Permanently Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.style.display = 'block';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });

        // Handle deactivate
        const deactivateBtn = modal.querySelector('.btn-deactivate');
        deactivateBtn.addEventListener('click', () => {
            const userRow = document.querySelector(`button[data-id="${userId}"]`).closest('tr');
            const statusBadge = userRow.querySelector('.status-badge');
            statusBadge.textContent = 'Inactive';
            statusBadge.classList.remove('active');
            statusBadge.classList.add('inactive');
            
            closeModal(modal);
            showNotification('User account deactivated');
        });

        // Handle permanent delete
        const deleteBtn = modal.querySelector('.btn-permanent-delete');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to permanently delete this account? This action cannot be undone.')) {
                const userRow = document.querySelector(`button[data-id="${userId}"]`).closest('tr');
                userRow.style.animation = 'fadeOut 0.3s ease';
                
                setTimeout(() => {
                    userRow.remove();
                    closeModal(modal);
                    showNotification('User permanently deleted');
                }, 300);
            }
        });

        // Handle close
        const closeButtons = modal.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add this CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-10px); }
        }
    `;
    document.head.appendChild(style);

    // Search functionality
    const searchInput = document.querySelector('.search-filter input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) ||
                user.role.toLowerCase().includes(searchTerm) ||
                user.department.toLowerCase().includes(searchTerm)
            );
            populateFilteredUsers(filteredUsers);
        });
    }

    // Role filter functionality
    const roleFilter = document.querySelector('.search-filter select');
    if (roleFilter) {
        roleFilter.addEventListener('change', function(e) {
            const selectedRole = e.target.value.toLowerCase();
            let filteredUsers = users;
            if (selectedRole !== 'all') {
                filteredUsers = users.filter(user => 
                    user.role.toLowerCase() === selectedRole.replace('s', '')
                );
            }
            populateFilteredUsers(filteredUsers);
        });
    }

    function populateFilteredUsers(filteredUsers) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            const profileImage = user.role === 'Student' ? 'image/student.jpg' : 'image/alumni1.jpg';
            
            tr.innerHTML = `
                <td>
                    <div class="user-info">
                        <img src="${profileImage}" alt="${user.name}" class="user-avatar">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.role}</td>
                <td>${user.department}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>${user.lastActive}</td>
                <td class="actions-cell">
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${user.id}" data-name="${user.name}" data-role="${user.role}" data-department="${user.department}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="btn-delete" data-id="${user.id}" data-name="${user.name}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Event and Opportunity Management
    const events = [
        {
            id: 1,
            title: 'Career Development Workshop',
            type: 'workshop',
            date: '2024-01-15',
            time: '14:00',
            location: 'Main Campus, Room 301',
            description: 'Join us for an interactive workshop on career development and job search strategies.',
            capacity: 50,
            speakers: 'Lidya Sisay, Career Coach',
            status: 'upcoming',
            registrations: 33
        },
        {
            id: 2,
            title: 'Tech Industry Networking Event',
            type: 'networking',
            date: '2024-01-20',
            time: '17:00',
            location: 'Innovation Hub',
            description: 'Connect with industry professionals and fellow alumni in the tech sector.',
            capacity: 100,
            speakers: 'Various Industry Leaders',
            status: 'upcoming',
            registrations: 24
        
        }
    ];

    const opportunities = [
        {
            id: 1,
            title: 'Software Engineering Internship',
            type: 'internship',
            company: 'Tech Solutions Inc.',
            location: 'Addis Ababa',
            deadline: '2024-02-01',
            duration: '3 months',
            description: 'Join our dynamic team for a summer internship opportunity.',
            requirements: 'Currently pursuing Computer Science or related field\nStrong programming skills\nTeam player',
            benefits: 'Competitive stipend\nMentorship program\nPossible full-time conversion',
            contact: 'careers@techsolutions.com',
            status: 'active'
        },
        {
            id: 2,
            title: 'Data Science Mentorship Program',
            type: 'mentorship',
            company: 'Data Analytics Ethiopia',
            location: 'Remote',
            deadline: '2024-01-25',
            duration: '6 months',
            description: 'Get paired with experienced data scientists for career guidance and skill development.',
            requirements: 'Basic knowledge of Python and statistics\nStrong interest in data science',
            benefits: 'One-on-one mentoring\nProject-based learning\nNetworking opportunities',
            contact: 'mentorship@dataanalytics.et',
            status: 'active'
        }
    ];

    // Event Management Functions
    function populateEventsGrid() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        let html = '';
        events.forEach(event => {
            html += `
                <div class="event-card">
                    <div class="card-header">
                        <h3 class="card-title">${event.title}</h3>
                        <span class="card-badge badge-${event.type}">${event.type.replace('_', ' ')}</span>
                    </div>
                    <div class="card-content">
                        <div class="card-info">
                            <i class="fas fa-calendar"></i>
                            <span>${event.date} at ${event.time}</span>
                        </div>
                        <div class="card-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="card-info">
                            <i class="fas fa-users"></i>
                            <span>${event.registrations}/${event.capacity} registered</span>
                        </div>
                        <p>${event.description}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-edit" onclick="openEventModal('edit', ${event.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
        eventsGrid.innerHTML = html;
    }

    // Opportunity Management Functions
    function populateOpportunitiesGrid() {
        const opportunitiesGrid = document.getElementById('opportunitiesGrid');
        if (!opportunitiesGrid) return;

        let html = '';
        opportunities.forEach(opp => {
            html += `
                <div class="opportunity-card">
                    <div class="card-header">
                        <h3 class="card-title">${opp.title}</h3>
                        <span class="card-badge badge-${opp.type}">${opp.type}</span>
                    </div>
                    <div class="card-content">
                        <div class="card-info">
                            <i class="fas fa-building"></i>
                            <span>${opp.company}</span>
                        </div>
                        <div class="card-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${opp.location}</span>
                        </div>
                        <div class="card-info">
                            <i class="fas fa-clock"></i>
                            <span>Deadline: ${opp.deadline}</span>
                        </div>
                        <p>${opp.description}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-edit" onclick="openOpportunityModal('edit', ${opp.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="deleteOpportunity(${opp.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
        opportunitiesGrid.innerHTML = html;
    }

    // Modal Functions
    window.openEventModal = function(mode, eventId = null) {
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventModalTitle');
        const form = document.getElementById('eventForm');

        title.textContent = mode === 'add' ? 'Add New Event' : 'Edit Event';
        
        if (mode === 'edit' && eventId) {
            const event = events.find(e => e.id === eventId);
            if (event) {
                form.elements.eventTitle.value = event.title;
                form.elements.eventType.value = event.type;
                form.elements.eventDate.value = event.date;
                form.elements.eventTime.value = event.time;
                form.elements.eventLocation.value = event.location;
                form.elements.eventDescription.value = event.description;
                form.elements.eventCapacity.value = event.capacity;
                form.elements.eventSpeakers.value = event.speakers;
            }
        } else {
            form.reset();
        }

        modal.style.display = 'block';
    };

    window.openOpportunityModal = function(mode, oppId = null) {
        const modal = document.getElementById('opportunityModal');
        const title = document.getElementById('opportunityModalTitle');
        const form = document.getElementById('opportunityForm');

        title.textContent = mode === 'add' ? 'Add New Opportunity' : 'Edit Opportunity';
        
        if (mode === 'edit' && oppId) {
            const opp = opportunities.find(o => o.id === oppId);
            if (opp) {
                form.elements.opportunityTitle.value = opp.title;
                form.elements.opportunityType.value = opp.type;
                form.elements.opportunityCompany.value = opp.company;
                form.elements.opportunityLocation.value = opp.location;
                form.elements.opportunityDeadline.value = opp.deadline;
                form.elements.opportunityDuration.value = opp.duration;
                form.elements.opportunityDescription.value = opp.description;
                form.elements.opportunityRequirements.value = opp.requirements;
                form.elements.opportunityBenefits.value = opp.benefits;
                form.elements.opportunityContact.value = opp.contact;
            }
        } else {
            form.reset();
        }

        modal.style.display = 'block';
    };

    window.closeEventModal = function() {
        document.getElementById('eventModal').style.display = 'none';
    };

    window.closeOpportunityModal = function() {
        document.getElementById('opportunityModal').style.display = 'none';
    };

    // Form Submission Handlers
    window.handleEventSubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const formData = {
            title: form.elements.eventTitle.value,
            type: form.elements.eventType.value,
            date: form.elements.eventDate.value,
            time: form.elements.eventTime.value,
            location: form.elements.eventLocation.value,
            description: form.elements.eventDescription.value,
            capacity: form.elements.eventCapacity.value,
            speakers: form.elements.eventSpeakers.value,
            status: 'upcoming',
            registrations: 0
        };

        // TODO: Add to events array or update existing event
        console.log('Event form submitted:', formData);
        closeEventModal();
        populateEventsGrid();
    };

    window.handleOpportunitySubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const formData = {
            title: form.elements.opportunityTitle.value,
            type: form.elements.opportunityType.value,
            company: form.elements.opportunityCompany.value,
            location: form.elements.opportunityLocation.value,
            deadline: form.elements.opportunityDeadline.value,
            duration: form.elements.opportunityDuration.value,
            description: form.elements.opportunityDescription.value,
            requirements: form.elements.opportunityRequirements.value,
            benefits: form.elements.opportunityBenefits.value,
            contact: form.elements.opportunityContact.value,
            status: 'active'
        };

        // TODO: Add to opportunities array or update existing opportunity
        console.log('Opportunity form submitted:', formData);
        closeOpportunityModal();
        populateOpportunitiesGrid();
    };

    // Search and Filter Functions
    function setupEventSearch() {
        const searchInput = document.getElementById('eventSearch');
        const typeFilter = document.getElementById('eventTypeFilter');
        const statusFilter = document.getElementById('eventStatusFilter');

        function filterEvents() {
            const searchTerm = searchInput.value.toLowerCase();
            const typeValue = typeFilter.value;
            const statusValue = statusFilter.value;

            const filtered = events.filter(event => {
                const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                   event.description.toLowerCase().includes(searchTerm);
                const matchesType = typeValue === 'all' || event.type === typeValue;
                const matchesStatus = statusValue === 'all' || event.status === statusValue;

                return matchesSearch && matchesType && matchesStatus;
            });

            populateEventsGrid(filtered);
        }

        searchInput.addEventListener('input', filterEvents);
        typeFilter.addEventListener('change', filterEvents);
        statusFilter.addEventListener('change', filterEvents);
    }

    function setupOpportunitySearch() {
        const searchInput = document.getElementById('opportunitySearch');
        const typeFilter = document.getElementById('opportunityTypeFilter');
        const statusFilter = document.getElementById('opportunityStatusFilter');

        function filterOpportunities() {
            const searchTerm = searchInput.value.toLowerCase();
            const typeValue = typeFilter.value;
            const statusValue = statusFilter.value;

            const filtered = opportunities.filter(opp => {
                const matchesSearch = opp.title.toLowerCase().includes(searchTerm) ||
                                   opp.description.toLowerCase().includes(searchTerm) ||
                                   opp.company.toLowerCase().includes(searchTerm);
                const matchesType = typeValue === 'all' || opp.type === typeValue;
                const matchesStatus = statusValue === 'all' || opp.status === statusValue;

                return matchesSearch && matchesType && matchesStatus;
            });

            populateOpportunitiesGrid(filtered);
        }

        searchInput.addEventListener('input', filterOpportunities);
        typeFilter.addEventListener('change', filterOpportunities);
        statusFilter.addEventListener('change', filterOpportunities);
    }

    // Delete Functions
    window.deleteEvent = function(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            // TODO: Implement event deletion
            console.log('Deleting event:', eventId);
            populateEventsGrid();
        }
    };

    window.deleteOpportunity = function(oppId) {
        if (confirm('Are you sure you want to delete this opportunity?')) {
            // TODO: Implement opportunity deletion
            console.log('Deleting opportunity:', oppId);
            populateOpportunitiesGrid();
        }
    };

    // Support Requests Management
    const supportTickets = [
        {
            id: 'TICKET-001',
            subject: 'Cannot Access Event Registration',
            description: 'I am trying to register for the Tech Career Fair but getting an error message.',
            status: 'open',
            user: 'John Smith',
            userType: 'Student',
            date: '2024-12-26',
            responses: []
        },
        {
            id: 'TICKET-002',
            subject: 'Profile Update Issue',
            description: 'Unable to update my work experience in the alumni profile section.',
            status: 'inProgress',
            user: 'Sarah Johnson',
            userType: 'Alumni',
            date: '2024-12-25',
            responses: [
                {
                    admin: 'Admin',
                    message: 'We are looking into this issue. Could you please provide your browser version?',
                    date: '2024-12-25'
                }
            ]
        },
        {
            id: 'TICKET-003',
            subject: 'Password Reset Required',
            description: 'Need help resetting my password.',
            status: 'resolved',
            user: 'Mike Wilson',
            userType: 'Student',
            date: '2024-12-24',
            responses: [
                {
                    admin: 'Admin',
                    message: 'Password reset link has been sent to your email.',
                    date: '2024-12-24'
                }
            ]
        }
    ];

    function initializeSupportSection() {
        populateSupportGrid();
        
        // Add event listeners
        document.getElementById('supportFilter').addEventListener('change', filterTickets);
        document.getElementById('supportSearch').addEventListener('input', filterTickets);
        
        // Close modal when clicking the close button
        document.querySelector('#supportModal .close-modal').addEventListener('click', () => {
            document.getElementById('supportModal').style.display = 'none';
        });
    }

    function populateSupportGrid() {
        const grid = document.querySelector('.support-grid');
        grid.innerHTML = '';
        
        supportTickets.forEach(ticket => {
            const ticketElement = createTicketElement(ticket);
            grid.appendChild(ticketElement);
        });
    }

    function createTicketElement(ticket) {
        const div = document.createElement('div');
        div.className = 'support-ticket';
        div.onclick = () => openTicketModal(ticket);
        
        div.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-id">${ticket.id}</span>
                <span class="ticket-status ${ticket.status}">${formatStatus(ticket.status)}</span>
            </div>
            <h3 class="ticket-subject">${ticket.subject}</h3>
            <p class="ticket-description">${ticket.description}</p>
            <div class="ticket-meta">
                <span>${ticket.user} (${ticket.userType})</span>
                <span>${formatDate(ticket.date)}</span>
            </div>
        `;
        
        return div;
    }

    function openTicketModal(ticket) {
        const modal = document.getElementById('supportModal');
        
        // Populate modal content
        modal.querySelector('.ticket-id').textContent = ticket.id;
        modal.querySelector('.ticket-status').textContent = formatStatus(ticket.status);
        modal.querySelector('.ticket-status').className = `ticket-status ${ticket.status}`;
        modal.querySelector('.ticket-subject').textContent = ticket.subject;
        modal.querySelector('.ticket-description').textContent = ticket.description;
        modal.querySelector('.ticket-user').textContent = `${ticket.user} (${ticket.userType})`;
        modal.querySelector('.ticket-date').textContent = formatDate(ticket.date);
        
        // Set current status in dropdown
        document.getElementById('ticketStatus').value = ticket.status;
        
        // Clear response textarea
        document.getElementById('ticketResponse').value = '';
        
        // Show modal
        modal.style.display = 'block';
    }

    function updateTicket() {
        const ticketId = document.querySelector('#supportModal .ticket-id').textContent;
        const newStatus = document.getElementById('ticketStatus').value;
        const response = document.getElementById('ticketResponse').value;
        
        // Find ticket
        const ticket = supportTickets.find(t => t.id === ticketId);
        if (ticket) {
            ticket.status = newStatus;
            if (response.trim()) {
                ticket.responses.push({
                    admin: 'Admin',
                    message: response,
                    date: new Date().toISOString().split('T')[0]
                });
            }
            
            // Update UI
            populateSupportGrid();
            document.getElementById('supportModal').style.display = 'none';
        }
    }

    function filterTickets() {
        const searchTerm = document.getElementById('supportSearch').value.toLowerCase();
        const statusFilter = document.getElementById('supportFilter').value;
        
        const filteredTickets = supportTickets.filter(ticket => {
            const matchesSearch = 
                ticket.subject.toLowerCase().includes(searchTerm) ||
                ticket.description.toLowerCase().includes(searchTerm) ||
                ticket.user.toLowerCase().includes(searchTerm);
                
            const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        const grid = document.querySelector('.support-grid');
        grid.innerHTML = '';
        filteredTickets.forEach(ticket => {
            const ticketElement = createTicketElement(ticket);
            grid.appendChild(ticketElement);
        });
    }

    function formatStatus(status) {
        return status.split(/(?=[A-Z])/).join(' ');
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Analytics Section
    function initializeAnalytics() {
        // Update overview stats
        updateOverviewStats();
        
        // Initialize charts
        initializeUserDistributionChart();
        initializeEventParticipationChart();
        initializeUserActivityChart();
        initializeOpportunityDistributionChart();
        
        // Update tables
        updateTopEventsTable();
        updateDepartmentStatsTable();
        
        // Add event listener for time range changes
        document.getElementById('timeRange').addEventListener('change', function() {
            updateAllAnalytics();
        });
    }

    function updateOverviewStats() {
        // Simulated data - replace with actual API calls
        document.getElementById('totalUsers').textContent = '50';
        document.getElementById('activeStudents').textContent = '33';
        document.getElementById('activeAlumni').textContent = '17';
        document.getElementById('monthlyEvents').textContent = '13';
    }

    function initializeUserDistributionChart() {
        const ctx = document.getElementById('userDistributionChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Others'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    function initializeEventParticipationChart() {
        const ctx = document.getElementById('eventParticipationChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Workshop Attendance',
                    data: [65, 75, 70, 80, 85, 90],
                    borderColor: '#3b82f6',
                    tension: 0.4
                }, {
                    label: 'Networking Events',
                    data: [40, 45, 50, 55, 60, 65],
                    borderColor: '#10b981',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function initializeUserActivityChart() {
        const ctx = document.getElementById('userActivityChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Users',
                    data: [120, 150, 180, 160, 140, 90, 70],
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function initializeOpportunityDistributionChart() {
        const ctx = document.getElementById('opportunityDistributionChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Internships', 'Full-time Jobs', 'Projects', 'Mentorship'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    function updateTopEventsTable() {
        const tbody = document.getElementById('topEventsTable');
        // Simulated data - replace with actual API calls
        const events = [
            { name: 'Tech Career Fair 2024', type: 'Career Fair', date: '2024-03-15', participants: 250, engagement: '85%' },
            { name: 'AI Workshop Series', type: 'Workshop', date: '2024-03-10', participants: 180, engagement: '78%' },
            { name: 'Alumni Networking Night', type: 'Networking', date: '2024-03-05', participants: 150, engagement: '92%' }
        ];
        
        tbody.innerHTML = events.map(event => `
            <tr>
                <td>${event.name}</td>
                <td>${event.type}</td>
                <td>${event.date}</td>
                <td>${event.participants}</td>
                <td>${event.engagement}</td>
            </tr>
        `).join('');
    }

    function updateDepartmentStatsTable() {
        const tbody = document.getElementById('departmentStatsTable');
        // Simulated data - replace with actual API calls
        const departments = [
            { name: 'Computer Science', students: 450, alumni: 180, events: 12, engagement: '88%' },
            { name: 'Engineering', students: 380, alumni: 150, events: 10, engagement: '82%' },
            { name: 'Business', students: 320, alumni: 130, events: 8, engagement: '75%' }
        ];
        
        tbody.innerHTML = departments.map(dept => `
            <tr>
                <td>${dept.name}</td>
                <td>${dept.students}</td>
                <td>${dept.alumni}</td>
                <td>${dept.events}</td>
                <td>${dept.engagement}</td>
            </tr>
        `).join('');
    }

    function updateAllAnalytics() {
        updateOverviewStats();
        // Re-initialize all charts with new data based on selected time range
        initializeUserDistributionChart();
        initializeEventParticipationChart();
        initializeUserActivityChart();
        initializeOpportunityDistributionChart();
        updateTopEventsTable();
        updateDepartmentStatsTable();
    }

    // Call this function when the page loads
    initializeAnalytics();

    // Initialize Event and Opportunity Management
    populateEventsGrid();
    populateOpportunitiesGrid();
    setupEventSearch();
    setupOpportunitySearch();

    // Initialize the dashboard
    populateUsersTable();

    // Initialize Support Section
    initializeSupportSection();

    // Announcements Management
    const announcements = [
        {
            id: 1,
            title: 'Welcome to Spring Semester 2024',
            type: 'general',
            content: 'Welcome back students and alumni! We hope you had a great break.',
            audience: 'all',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            priority: true
        },
        {
            id: 2,
            title: 'Career Fair Registration Open',
            type: 'career',
            content: 'Register now for the upcoming Spring Career Fair.',
            audience: 'students',
            startDate: '2024-01-20',
            endDate: '2024-02-10',
            priority: false
        }
    ];

    function initializeAnnouncementsSection() {
        populateAnnouncementsGrid();
        
        // Add event listeners
        document.getElementById('announcementType').addEventListener('change', filterAnnouncements);
        document.getElementById('targetAudience').addEventListener('change', filterAnnouncements);
        document.getElementById('announcementSearch').addEventListener('input', filterAnnouncements);
        
        // Close modal when clicking the close button
        document.querySelector('#announcementModal .close-modal').addEventListener('click', closeAnnouncementModal);
    }

    function populateAnnouncementsGrid() {
        const grid = document.querySelector('.announcements-grid');
        grid.innerHTML = '';
        
        announcements.forEach(announcement => {
            const card = createAnnouncementCard(announcement);
            grid.appendChild(card);
        });
    }

    function createAnnouncementCard(announcement) {
        const div = document.createElement('div');
        div.className = `announcement-card${announcement.priority ? ' priority' : ''}`;
        
        div.innerHTML = `
            <span class="announcement-type ${announcement.type}">${formatAnnouncementType(announcement.type)}</span>
            <h3 class="announcement-title">${announcement.title}</h3>
            <p class="announcement-content">${announcement.content}</p>
            <div class="announcement-meta">
                <span>${formatAudience(announcement.audience)}</span>
                <div class="announcement-dates">
                    <span>Start: ${formatDate(announcement.startDate)}</span>
                    ${announcement.endDate ? `<span>End: ${formatDate(announcement.endDate)}</span>` : ''}
                </div>
            </div>
        `;
        
        div.onclick = () => openAnnouncementModal(announcement);
        return div;
    }

    function openAnnouncementModal(announcement = null) {
        const modal = document.getElementById('announcementModal');
        const form = document.getElementById('announcementForm');
        
        if (announcement) {
            modal.querySelector('#announcementModalTitle').textContent = 'Edit Announcement';
            form.elements.announcementTitle.value = announcement.title;
            form.elements.announcementTypeInput.value = announcement.type;
            form.elements.announcementAudience.value = announcement.audience;
            form.elements.announcementContent.value = announcement.content;
            form.elements.announcementStartDate.value = announcement.startDate;
            form.elements.announcementEndDate.value = announcement.endDate || '';
            form.elements.announcementPriority.checked = announcement.priority;
        } else {
            modal.querySelector('#announcementModalTitle').textContent = 'New Announcement';
            form.reset();
            form.elements.announcementStartDate.value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'block';
    }

    function closeAnnouncementModal() {
        document.getElementById('announcementModal').style.display = 'none';
    }

    function handleAnnouncementSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        const announcement = {
            id: announcements.length + 1,
            title: form.elements.announcementTitle.value,
            type: form.elements.announcementTypeInput.value,
            content: form.elements.announcementContent.value,
            audience: form.elements.announcementAudience.value,
            startDate: form.elements.announcementStartDate.value,
            endDate: form.elements.announcementEndDate.value || null,
            priority: form.elements.announcementPriority.checked
        };
        
        announcements.unshift(announcement);
        populateAnnouncementsGrid();
        closeAnnouncementModal();
    }

    function filterAnnouncements() {
        const typeFilter = document.getElementById('announcementType').value;
        const audienceFilter = document.getElementById('targetAudience').value;
        const searchTerm = document.getElementById('announcementSearch').value.toLowerCase();
        
        const filtered = announcements.filter(announcement => {
            const matchesType = typeFilter === 'all' || announcement.type === typeFilter;
            const matchesAudience = audienceFilter === 'all' || announcement.audience === audienceFilter;
            const matchesSearch = 
                announcement.title.toLowerCase().includes(searchTerm) ||
                announcement.content.toLowerCase().includes(searchTerm);
            
            return matchesType && matchesAudience && matchesSearch;
        });
        
        const grid = document.querySelector('.announcements-grid');
        grid.innerHTML = '';
        filtered.forEach(announcement => {
            const card = createAnnouncementCard(announcement);
            grid.appendChild(card);
        });
    }

    function formatAnnouncementType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    function formatAudience(audience) {
        const formats = {
            all: 'All Users',
            students: 'Students Only',
            alumni: 'Alumni Only'
        };
        return formats[audience] || audience;
    }

    // Settings Management
    function initializeSettings() {
        // Load saved settings if any
        loadSettings();
        
        // Add event listeners for settings changes
        document.querySelectorAll('#settings input, #settings textarea').forEach(input => {
            input.addEventListener('change', () => {
                // Enable save button
                document.querySelector('#settings .btn-primary').disabled = false;
            });
        });
    }

    function loadSettings() {
        // Load settings from localStorage or use defaults
        const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
        
        // Apply settings to form
        Object.entries(settings).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
    }

    function saveSettings() {
        const settings = {};
        
        // Collect all settings
        document.querySelectorAll('#settings input, #settings textarea').forEach(input => {
            settings[input.id] = input.type === 'checkbox' ? input.checked : input.value;
        });
        
        // Save to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        
        // Disable save button
        document.querySelector('#settings .btn-primary').disabled = true;
        
        // Show success message
        showNotification('Settings saved successfully', 'success');
    }

    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            const defaults = getDefaultSettings();
            
            // Apply defaults to form
            Object.entries(defaults).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                }
            });
            
            // Save defaults
            localStorage.setItem('adminSettings', JSON.stringify(defaults));
            
            // Show success message
            showNotification('Settings reset to default', 'success');
        }
    }

    function getDefaultSettings() {
        return {
            siteName: 'Student-Alumni Portal',
            siteDescription: 'A platform connecting students and alumni for networking and opportunities.',
            maintenanceMode: false,
            emailServer: '',
            emailPort: '',
            emailUsername: '',
            emailPassword: '',
            emailNotifications: true,
            eventReminders: true,
            supportUpdates: true,
            reminderTime: '24',
            sessionTimeout: '30',
            twoFactorAuth: false,
            strongPasswords: true
        };
    }

    // Initialize announcements and settings when page loads
    initializeAnnouncementsSection();
    initializeSettings();

    // Modal and Button Handlers
    document.addEventListener('DOMContentLoaded', function() {
        // Button click handlers
        const addButtons = {
            'addUserBtn': 'addUserModal',
            'addEventBtn': 'addEventModal',
            'addOpportunityBtn': 'addOpportunityModal'
        };

        Object.entries(addButtons).forEach(([btnId, modalId]) => {
            document.getElementById(btnId)?.addEventListener('click', () => {
                const modal = document.getElementById(modalId);
                showModal(modal);
            });
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                closeModal(modal);
            });
        });

        // Add User Form Handler
        document.getElementById('addUserForm')?.addEventListener('submit', handleAddUser);
        
        // Add Event Form Handler
        document.getElementById('addEventForm')?.addEventListener('submit', handleAddEvent);
        
        // Add Opportunity Form Handler
        document.getElementById('addOpportunityForm')?.addEventListener('submit', handleAddOpportunity);
    });

    function handleAddUser(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newUser = {
            id: Date.now(),
            name: formData.get('userName'),
            email: formData.get('userEmail'),
            role: formData.get('userRole'),
            department: formData.get('userDepartment'),
            status: 'active',
            lastActive: 'Just now'
        };

        const tbody = document.querySelector('.users-table tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-info">
                    <img src="image/${newUser.role.toLowerCase()}.jpg" alt="${newUser.name}">
                    <span>${newUser.name}</span>
                </div>
            </td>
            <td>${newUser.role}</td>
            <td>${newUser.department}</td>
            <td><span class="status-badge active">Active</span></td>
            <td>${newUser.lastActive}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" data-id="${newUser.id}" data-name="${newUser.name}" 
                        data-role="${newUser.role}" data-department="${newUser.department}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" data-id="${newUser.id}" data-name="${newUser.name}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;

        tbody.insertBefore(tr, tbody.firstChild);
        closeModal(document.getElementById('addUserModal'));
        showNotification('New user added successfully');
        this.reset();
    }

    function handleAddEvent(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newEvent = {
            id: Date.now(),
            title: formData.get('eventTitle'),
            date: new Date(formData.get('eventDate')).toLocaleString(),
            location: formData.get('eventLocation'),
            description: formData.get('eventDescription'),
            type: formData.get('eventType')
        };

        const eventsList = document.querySelector('.events-list');
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-header">
                <h3>${newEvent.title}</h3>
                <span class="event-type">${newEvent.type}</span>
            </div>
            <div class="event-details">
                <p><i class="fas fa-calendar"></i> ${newEvent.date}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${newEvent.location}</p>
                <p class="event-description">${newEvent.description}</p>
            </div>
            <div class="event-actions">
                <button class="btn-edit" data-id="${newEvent.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" data-id="${newEvent.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        eventsList.insertBefore(eventCard, eventsList.firstChild);
        closeModal(document.getElementById('addEventModal'));
        showNotification('New event added successfully');
        this.reset();
    }

    function handleAddOpportunity(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newOpportunity = {
            id: Date.now(),
            title: formData.get('opportunityTitle'),
            company: formData.get('companyName'),
            type: formData.get('opportunityType'),
            location: formData.get('location'),
            description: formData.get('description'),
            requirements: formData.get('requirements'),
            deadline: new Date(formData.get('deadline')).toLocaleDateString()
        };

        const opportunitiesList = document.querySelector('.opportunities-list');
        const opportunityCard = document.createElement('div');
        opportunityCard.className = 'opportunity-card';
        opportunityCard.innerHTML = `
            <div class="opportunity-header">
                <h3>${newOpportunity.title}</h3>
                <span class="opportunity-type">${newOpportunity.type}</span>
            </div>
            <div class="opportunity-details">
                <p><i class="fas fa-building"></i> ${newOpportunity.company}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${newOpportunity.location}</p>
                <p><i class="fas fa-clock"></i> Deadline: ${newOpportunity.deadline}</p>
                <div class="opportunity-description">
                    <h4>Description</h4>
                    <p>${newOpportunity.description}</p>
                </div>
                <div class="opportunity-requirements">
                    <h4>Requirements</h4>
                    <p>${newOpportunity.requirements}</p>
                </div>
            </div>
            <div class="opportunity-actions">
                <button class="btn-edit" data-id="${newOpportunity.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" data-id="${newOpportunity.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        opportunitiesList.insertBefore(opportunityCard, opportunitiesList.firstChild);
        closeModal(document.getElementById('addOpportunityModal'));
        showNotification('New opportunity added successfully');
        this.reset();
    }

    function showModal(modal) {
        if (!modal) return;
        requestAnimationFrame(() => {
            modal.style.display = 'block';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Database configuration and initialization
    const dbConfig = {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID
    };

    // Initialize database connection
    let db;

    async function initializeDatabase() {
        try {
            // Initialize your database connection here
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            showNotification('Database connection failed', 'error');
        }
    }

    // Enhanced user management functions
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            showNotification('Failed to fetch users', 'error');
            return [];
        }
    }

    async function updateUser(userId, userData) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) throw new Error('Failed to update user');
            
            showNotification('User updated successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            showNotification('Failed to update user', 'error');
            throw error;
        }
    }

    // Enhanced analytics functions
    async function fetchAnalyticsData() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            showNotification('Failed to fetch analytics data', 'error');
            return null;
        }
    }

    // Initialize everything when the page loads
    document.addEventListener('DOMContentLoaded', async function() {
        await initializeDatabase();
        await initializeAnalytics();
        await populateUsersTable();
        initializeEventManagement();
        initializeOpportunityManagement();
        initializeAnnouncementsSection();
        initializeSettings();
    });
});
