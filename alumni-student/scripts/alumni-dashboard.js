// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Profile Image Upload
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');
    const sidebarProfileImage = document.querySelector('.profile-image img');

    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profileImage) profileImage.src = e.target.result;
                    if (sidebarProfileImage) sidebarProfileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Edit Profile
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            editProfileModal.style.display = 'block';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Handle profile form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('editName').value,
                role: document.getElementById('editRole').value,
                company: document.getElementById('editCompany').value,
                email: document.getElementById('editEmail').value,
                phone: document.getElementById('editPhone').value,
                location: document.getElementById('editLocation').value,
                expertise: document.getElementById('editExpertise').value,
                interests: document.getElementById('editInterests').value
            };

            // Update profile information
            document.getElementById('fullName').textContent = formData.name;
            document.getElementById('currentRole').textContent = formData.role;
            document.getElementById('company').textContent = formData.company;
            document.getElementById('email').textContent = formData.email;
            document.getElementById('phone').textContent = formData.phone;
            document.getElementById('location').textContent = formData.location;

            // Update sidebar
            document.getElementById('sidebarName').textContent = formData.name;
            document.getElementById('sidebarRole').textContent = formData.role + (formData.company ? ` at ${formData.company}` : '');

            // Update expertise tags
            if (formData.expertise) {
                const expertiseTags = document.getElementById('expertiseTags');
                const tags = formData.expertise.split(',').map(tag => tag.trim()).filter(Boolean);
                if (expertiseTags && tags.length > 0) {
                    expertiseTags.innerHTML = tags
                        .map(tag => `<span class="tag">${tag}</span>`)
                        .join('');
                }
            }

            // Update interests tags
            if (formData.interests) {
                const interestsTags = document.getElementById('interestsTags');
                const tags = formData.interests.split(',').map(tag => tag.trim()).filter(Boolean);
                if (interestsTags && tags.length > 0) {
                    interestsTags.innerHTML = tags
                        .map(tag => `<span class="tag">${tag}</span>`)
                        .join('');
                }
            }

            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.textContent = 'Profile updated successfully!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);

            // Close modal
            editProfileModal.style.display = 'none';
        });
    }

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');

    function showSection(sectionId) {
        // Hide all sections first
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show the selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
            selectedSection.classList.add('active');
            
            // Trigger a fade-in animation
            selectedSection.style.opacity = '0';
            setTimeout(() => {
                selectedSection.style.opacity = '1';
            }, 50);
        }

        // Update navigation links
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update page title
        const sectionTitle = selectedSection ? selectedSection.querySelector('h3')?.textContent : 'Overview';
        document.title = `${sectionTitle} - Alumni Dashboard`;
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                e.preventDefault();
                showSection(sectionId);
            }
        });
    });

    // Show initial section (overview)
    showSection('overview');

    // Create Event
    const createEventBtn = document.getElementById('createEventBtn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            document.getElementById('createEventModal').style.display = 'block';
        });
    }

    // Share Opportunity
    const shareOpportunityBtn = document.getElementById('shareOpportunityBtn');
    if (shareOpportunityBtn) {
        shareOpportunityBtn.addEventListener('click', function() {
            document.getElementById('shareOpportunityModal').style.display = 'block';
        });
    }

    // New Message
    const newMessageBtn = document.getElementById('newMessageBtn');
    if (newMessageBtn) {
        newMessageBtn.addEventListener('click', function() {
            document.getElementById('newMessageModal').style.display = 'block';
        });
    }

    // Opportunity Management
    function initializeOpportunityManagement() {
        const shareOpportunityBtn = document.getElementById('shareOpportunityBtn');
        const shareOpportunityModal = document.getElementById('shareOpportunityModal');
        const shareOpportunityForm = document.getElementById('shareOpportunityForm');

        if (shareOpportunityBtn && shareOpportunityModal && shareOpportunityForm) {
            shareOpportunityBtn.addEventListener('click', () => {
                showModal(shareOpportunityModal);
            });

            shareOpportunityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const opportunityData = {
                    id: Date.now(),
                    title: document.getElementById('jobTitle').value,
                    company: document.getElementById('company').value,
                    location: document.getElementById('jobLocation').value,
                    type: document.getElementById('jobType').value,
                    description: document.getElementById('jobDescription').value,
                    skills: document.getElementById('requiredSkills').value.split(',').map(skill => skill.trim()),
                    createdBy: getCurrentUserName(),
                    createdAt: new Date().toISOString()
                };

                // Save to localStorage
                const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
                opportunities.unshift(opportunityData);
                localStorage.setItem('opportunities', JSON.stringify(opportunities));

                // Add to UI
                addOpportunityToUI(opportunityData);

                // Reset form and close modal
                shareOpportunityForm.reset();
                closeModal(shareOpportunityModal);
                showNotification('Opportunity shared successfully!');
            });
        }
    }

    function addOpportunityToUI(opportunityData) {
        const opportunitiesContainer = document.getElementById('opportunitiesContainer');
        if (!opportunitiesContainer) return;

        const opportunityCard = document.createElement('div');
        opportunityCard.className = 'opportunity-card';
        opportunityCard.dataset.id = opportunityData.id;

        opportunityCard.innerHTML = `
            <div class="opportunity-header">
                <h3>${opportunityData.title}</h3>
                <span class="opportunity-type">${opportunityData.type}</span>
            </div>
            <div class="opportunity-details">
                <p><i class="fas fa-building"></i> ${opportunityData.company}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${opportunityData.location}</p>
            </div>
            <p class="opportunity-description">${opportunityData.description}</p>
            <div class="skills-container">
                ${opportunityData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="opportunity-footer">
                <button class="btn-secondary" onclick="manageOpportunity(${opportunityData.id})">Manage Opportunity</button>
                <span class="opportunity-creator">Posted by ${opportunityData.createdBy}</span>
            </div>
        `;

        opportunitiesContainer.insertBefore(opportunityCard, opportunitiesContainer.firstChild);
    }

    function loadOpportunities() {
        const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
        const opportunitiesContainer = document.getElementById('opportunitiesContainer');
        if (opportunitiesContainer) {
            opportunitiesContainer.innerHTML = ''; // Clear existing opportunities
            opportunities.forEach(opportunity => addOpportunityToUI(opportunity));
        }
    }

    // Modal handling
    function initializeModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });
    }

    function showModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Event Management
    function initializeEventManagement() {
        const createEventBtn = document.getElementById('createEventBtn');
        const createEventModal = document.getElementById('createEventModal');
        const createEventForm = document.getElementById('createEventForm');

        if (createEventBtn && createEventModal && createEventForm) {
            createEventBtn.addEventListener('click', () => {
                showModal(createEventModal);
            });

            createEventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const eventData = {
                    id: Date.now(),
                    title: document.getElementById('eventTitle').value,
                    date: document.getElementById('eventDate').value,
                    location: document.getElementById('eventLocation').value,
                    description: document.getElementById('eventDescription').value,
                    type: document.getElementById('eventType').value,
                    createdBy: getCurrentUserName(),
                    createdAt: new Date().toISOString()
                };

                // Add event to storage
                const events = JSON.parse(localStorage.getItem('events') || '[]');
                events.unshift(eventData);
                localStorage.setItem('events', JSON.stringify(events));

                // Add event to UI
                addEventToUI(eventData);

                // Reset form and close modal
                createEventForm.reset();
                closeModal(createEventModal);
                showNotification('Event created successfully!');
            });
        }
    }

    function addEventToUI(eventData) {
        const eventsContainer = document.getElementById('eventsContainer');
        if (!eventsContainer) return;

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.dataset.id = eventData.id;

        const date = new Date(eventData.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        eventCard.innerHTML = `
            <div class="event-header">
                <h3>${eventData.title}</h3>
                <span class="event-type">${eventData.type}</span>
            </div>
            <div class="event-details">
                <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${eventData.location}</p>
            </div>
            <p class="event-description">${eventData.description}</p>
            <div class="event-footer">
                <button class="btn-secondary" onclick="manageEvent(${eventData.id})">Manage Event</button>
                <span class="event-creator">Posted by ${eventData.createdBy}</span>
            </div>
        `;

        eventsContainer.insertBefore(eventCard, eventsContainer.firstChild);
    }

    function loadEvents() {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const eventsContainer = document.getElementById('eventsContainer');
        if (eventsContainer) {
            eventsContainer.innerHTML = ''; // Clear existing events
            events.forEach(event => addEventToUI(event));
        }
    }

    // Helper Functions
    function getCurrentUserName() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return userData.name || 'Anonymous Alumni';
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }
        return 'just now';
    }

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Make these functions globally accessible
    window.manageEvent = function(eventId) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.id === eventId);
        
        if (event) {
            const manageEventModal = document.getElementById('manageEventModal');
            const detailsContainer = document.getElementById('manageEventDetails');
            
            detailsContainer.innerHTML = `
                <div class="event-info">
                    <p><strong>Title:</strong> ${event.title}</p>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Type:</strong> ${event.type}</p>
                    <p><strong>Description:</strong> ${event.description}</p>
                    <p><strong>Attendees:</strong> ${event.attendees ? event.attendees.length : 0}</p>
                </div>
            `;

            // Edit Event
            const editBtn = document.getElementById('editEventBtn');
            if (editBtn) {
                editBtn.onclick = () => {
                    const createEventForm = document.getElementById('createEventForm');
                    document.getElementById('eventTitle').value = event.title;
                    document.getElementById('eventDate').value = event.date;
                    document.getElementById('eventLocation').value = event.location;
                    document.getElementById('eventType').value = event.type;
                    document.getElementById('eventDescription').value = event.description;
                    createEventForm.setAttribute('data-edit-id', eventId);
                    
                    closeModal(manageEventModal);
                    showModal(document.getElementById('createEventModal'));
                };
            }

            // View Attendees
            const viewAttendeesBtn = document.getElementById('viewAttendeesBtn');
            const attendeesList = document.getElementById('attendeesList');
            if (viewAttendeesBtn && attendeesList) {
                viewAttendeesBtn.onclick = () => {
                    const attendeesContainer = attendeesList.querySelector('.attendees-container');
                    if (event.attendees && event.attendees.length > 0) {
                        attendeesContainer.innerHTML = event.attendees.map(attendee => 
                            `<div class="attendee-item">
                                <i class="fas fa-user"></i> ${attendee}
                            </div>`
                        ).join('');
                    } else {
                        attendeesContainer.innerHTML = '<p class="no-attendees">No attendees yet</p>';
                    }
                    attendeesList.style.display = 'block';
                };
            }

            // Send Reminders
            const sendRemindersBtn = document.getElementById('sendRemindersBtn');
            if (sendRemindersBtn) {
                sendRemindersBtn.onclick = () => {
                    if (event.attendees && event.attendees.length > 0) {
                        showNotification(`Reminders sent to ${event.attendees.length} attendees!`);
                    } else {
                        showNotification('No attendees to send reminders to', 'info');
                    }
                };
            }

            // Cancel Event
            const cancelEventBtn = document.getElementById('cancelEventBtn');
            if (cancelEventBtn) {
                cancelEventBtn.onclick = () => {
                    if (confirm('Are you sure you want to cancel this event? This will delete it permanently.')) {
                        const events = JSON.parse(localStorage.getItem('events') || '[]');
                        const updatedEvents = events.filter(e => e.id !== eventId);
                        localStorage.setItem('events', JSON.stringify(updatedEvents));
                        loadEvents();
                        closeModal(manageEventModal);
                        showNotification('Event cancelled and deleted successfully');
                    }
                };
            }

            showModal(manageEventModal);
        }
    };

    window.manageOpportunity = function(opportunityId) {
        const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
        const opportunity = opportunities.find(o => o.id === opportunityId);
        
        if (opportunity) {
            const manageOpportunityModal = document.getElementById('manageOpportunityModal');
            const detailsContainer = document.getElementById('manageOpportunityDetails');
            
            detailsContainer.innerHTML = `
                <div class="opportunity-info">
                    <p><strong>Title:</strong> ${opportunity.title}</p>
                    <p><strong>Company:</strong> ${opportunity.company}</p>
                    <p><strong>Location:</strong> ${opportunity.location}</p>
                    <p><strong>Type:</strong> ${opportunity.type}</p>
                    <p><strong>Description:</strong> ${opportunity.description}</p>
                    <p><strong>Applications:</strong> ${opportunity.applications ? opportunity.applications.length : 0}</p>
                </div>
            `;

            // Edit Opportunity
            const editBtn = document.getElementById('editOpportunityBtn');
            if (editBtn) {
                editBtn.onclick = () => {
                    const shareOpportunityForm = document.getElementById('shareOpportunityForm');
                    document.getElementById('jobTitle').value = opportunity.title;
                    document.getElementById('company').value = opportunity.company;
                    document.getElementById('jobLocation').value = opportunity.location;
                    document.getElementById('jobType').value = opportunity.type;
                    document.getElementById('jobDescription').value = opportunity.description;
                    document.getElementById('requiredSkills').value = opportunity.skills.join(', ');
                    shareOpportunityForm.setAttribute('data-edit-id', opportunityId);
                    
                    closeModal(manageOpportunityModal);
                    showModal(document.getElementById('shareOpportunityModal'));
                };
            }

            // View Applications
            const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
            const applicationsList = document.getElementById('applicationsList');
            if (viewApplicationsBtn && applicationsList) {
                viewApplicationsBtn.onclick = () => {
                    const applicationsContainer = applicationsList.querySelector('.applications-container');
                    if (opportunity.applications && opportunity.applications.length > 0) {
                        applicationsContainer.innerHTML = opportunity.applications.map(application => 
                            `<div class="application-item">
                                <i class="fas fa-user"></i> ${application}
                            </div>`
                        ).join('');
                    } else {
                        applicationsContainer.innerHTML = '<p class="no-applications">No applications yet</p>';
                    }
                    applicationsList.style.display = 'block';
                };
            }

            // Close Opportunity
            const closeOpportunityBtn = document.getElementById('closeOpportunityBtn');
            if (closeOpportunityBtn) {
                closeOpportunityBtn.onclick = () => {
                    if (confirm('Are you sure you want to close this opportunity? This will delete it permanently.')) {
                        const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
                        const updatedOpportunities = opportunities.filter(o => o.id !== opportunityId);
                        localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
                        loadOpportunities();
                        closeModal(manageOpportunityModal);
                        showNotification('Opportunity closed and deleted successfully');
                    }
                };
            }

            showModal(manageOpportunityModal);
        }
    };

    // Connections Management
    function initializeConnectionsSection() {
        const connectionSearch = document.getElementById('connectionSearch');
        const connectionFilter = document.getElementById('connectionFilter');
        const industryFilter = document.getElementById('industryFilter');
        const findConnectionsBtn = document.getElementById('findConnectionsBtn');

        if (connectionSearch) {
            connectionSearch.addEventListener('input', filterConnections);
        }

        if (connectionFilter) {
            connectionFilter.addEventListener('change', filterConnections);
        }

        if (industryFilter) {
            industryFilter.addEventListener('change', filterConnections);
        }

        if (findConnectionsBtn) {
            findConnectionsBtn.addEventListener('click', () => {
                showModal(document.getElementById('findConnectionsModal'));
            });
        }

        loadConnections();
    }

    function loadConnections() {
        const connections = JSON.parse(localStorage.getItem('connections') || '[]');
        const connectionsList = document.getElementById('connectionsList');
        
        if (connectionsList) {
            connectionsList.innerHTML = '';
            connections.forEach(connection => {
                const connectionCard = createConnectionCard(connection);
                connectionsList.appendChild(connectionCard);
            });
        }
    }

    function createConnectionCard(connection) {
        const card = document.createElement('div');
        card.className = 'connection-card';
        card.innerHTML = `
            <div class="connection-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="connection-info">
                <h4>${connection.name}</h4>
                <p class="connection-title">${connection.title}</p>
                <p class="connection-company">${connection.company}</p>
                <div class="connection-tags">
                    <span class="tag">${connection.industry}</span>
                    <span class="tag">${connection.type}</span>
                </div>
            </div>
            <div class="connection-actions">
                <button class="btn-secondary" onclick="sendMessage(${connection.id})">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="btn-secondary" onclick="scheduleCall(${connection.id})">
                    <i class="fas fa-phone"></i>
                </button>
            </div>
        `;
        return card;
    }

    function filterConnections() {
        const searchTerm = document.getElementById('connectionSearch').value.toLowerCase();
        const typeFilter = document.getElementById('connectionFilter').value;
        const industryFilter = document.getElementById('industryFilter').value;
        
        const connections = JSON.parse(localStorage.getItem('connections') || '[]');
        const filteredConnections = connections.filter(connection => {
            const matchesSearch = connection.name.toLowerCase().includes(searchTerm) ||
                                connection.title.toLowerCase().includes(searchTerm) ||
                                connection.company.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' || connection.type === typeFilter;
            const matchesIndustry = industryFilter === 'all' || connection.industry === industryFilter;
            
            return matchesSearch && matchesType && matchesIndustry;
        });

        const connectionsList = document.getElementById('connectionsList');
        if (connectionsList) {
            connectionsList.innerHTML = '';
            filteredConnections.forEach(connection => {
                const connectionCard = createConnectionCard(connection);
                connectionsList.appendChild(connectionCard);
            });
        }
    }

    // Mentorship Management
    function initializeMentorshipSection() {
        const becomeMentorBtn = document.getElementById('becomeMentorBtn');
        const findMentorBtn = document.getElementById('findMentorBtn');
        const tabButtons = document.querySelectorAll('.tab-btn');

        if (becomeMentorBtn) {
            becomeMentorBtn.addEventListener('click', () => {
                showModal(document.getElementById('becomeMentorModal'));
            });
        }

        if (findMentorBtn) {
            findMentorBtn.addEventListener('click', () => {
                showModal(document.getElementById('findMentorModal'));
            });
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                switchMentorshipTab(tabName);
            });
        });

        loadMentorshipData();
    }

    function loadMentorshipData() {
        // Load mentorship statistics
        const mentorshipData = JSON.parse(localStorage.getItem('mentorshipData') || '{}');
        document.getElementById('activeMentorships').textContent = mentorshipData.active || 0;
        document.getElementById('completedSessions').textContent = mentorshipData.completed || 0;
        document.getElementById('averageRating').textContent = mentorshipData.rating || '0.0';

        // Load mentees
        const mentees = JSON.parse(localStorage.getItem('mentees') || '[]');
        const menteesList = document.getElementById('menteesList');
        if (menteesList) {
            menteesList.innerHTML = mentees.map(mentee => createMentorshipCard(mentee, 'mentee')).join('');
        }

        // Load mentors
        const mentors = JSON.parse(localStorage.getItem('mentors') || '[]');
        const mentorsList = document.getElementById('mentorsList');
        if (mentorsList) {
            mentorsList.innerHTML = mentors.map(mentor => createMentorshipCard(mentor, 'mentor')).join('');
        }

        // Load requests
        const requests = JSON.parse(localStorage.getItem('mentorshipRequests') || '[]');
        const requestsList = document.getElementById('requestsList');
        if (requestsList) {
            requestsList.innerHTML = requests.map(request => createRequestCard(request)).join('');
        }
    }

    function createMentorshipCard(person, type) {
        return `
            <div class="mentorship-card">
                <div class="mentorship-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="mentorship-info">
                    <h4>${person.name}</h4>
                    <p>${person.title} at ${person.company}</p>
                    <p class="mentorship-focus">Focus: ${person.focus}</p>
                </div>
                <div class="mentorship-actions">
                    <button class="btn-secondary" onclick="scheduleMentorship(${person.id})">
                        <i class="fas fa-calendar"></i> Schedule
                    </button>
                    <button class="btn-secondary" onclick="sendMessage(${person.id})">
                        <i class="fas fa-envelope"></i> Message
                    </button>
                </div>
            </div>
        `;
    }

    function createRequestCard(request) {
        return `
            <div class="request-card">
                <div class="request-info">
                    <h4>${request.name}</h4>
                    <p>${request.type} request</p>
                    <p class="request-message">${request.message}</p>
                </div>
                <div class="request-actions">
                    <button class="btn-primary" onclick="acceptRequest(${request.id})">Accept</button>
                    <button class="btn-secondary" onclick="declineRequest(${request.id})">Decline</button>
                </div>
            </div>
        `;
    }

    function switchMentorshipTab(tabName) {
        const tabs = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-btn');

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));

        document.getElementById(`${tabName}Tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // Find Connections
    window.findConnection = function() {
        const searchTerm = document.getElementById('findConnectionSearch').value.toLowerCase();
        const typeFilter = document.getElementById('findConnectionType').value;
        const industryFilter = document.getElementById('findConnectionIndustry').value;
        
        // Simulated API call to get suggestions
        const suggestions = getSuggestedConnections(searchTerm, typeFilter, industryFilter);
        displayConnectionSuggestions(suggestions);
    }

    function getSuggestedConnections(search, type, industry) {
        // This would normally be an API call
        // For now, return mock data
        return [
            {
                id: 1,
                name: "John Doe",
                title: "Software Engineer",
                company: "Tech Corp",
                industry: "technology",
                type: "alumni"
            },
            // Add more mock data as needed
        ];
    }

    function displayConnectionSuggestions(suggestions) {
        const container = document.getElementById('connectionSuggestions');
        if (!container) return;

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-card">
                <div class="suggestion-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="suggestion-info">
                    <h4>${suggestion.name}</h4>
                    <p>${suggestion.title} at ${suggestion.company}</p>
                    <div class="suggestion-tags">
                        <span class="tag">${suggestion.industry}</span>
                        <span class="tag">${suggestion.type}</span>
                    </div>
                </div>
                <button class="btn-primary" onclick="sendConnectionRequest(${suggestion.id})">
                    Connect
                </button>
            </div>
        `).join('');
    }

    // Mentorship Functions
    window.becomeMentor = function(event) {
        event.preventDefault();
        const formData = {
            expertise: document.getElementById('mentorExpertise').value,
            availability: document.getElementById('mentorAvailability').value,
            style: document.getElementById('mentorshipStyle').value,
            bio: document.getElementById('mentorBio').value
        };

        // Save mentor application
        const mentors = JSON.parse(localStorage.getItem('mentors') || '[]');
        mentors.push({
            id: Date.now(),
            ...formData,
            name: getCurrentUserName(),
            status: 'active'
        });
        localStorage.setItem('mentors', JSON.stringify(mentors));

        // Close modal and show success message
        closeModal(document.getElementById('becomeMentorModal'));
        showNotification('Your mentor application has been submitted successfully!');
    }

    window.findMentor = function() {
        const searchTerm = document.getElementById('findMentorSearch').value.toLowerCase();
        const expertiseFilter = document.getElementById('expertiseFilter').value;
        const availabilityFilter = document.getElementById('availabilityFilter').value;
        
        // Get and display mentor suggestions
        const suggestions = getSuggestedMentors(searchTerm, expertiseFilter, availabilityFilter);
        displayMentorSuggestions(suggestions);
    }

    function getSuggestedMentors(search, expertise, availability) {
        // This would normally be an API call
        // For now, return mock data
        return [
            {
                id: 1,
                name: "Jane Smith",
                title: "Senior Developer",
                expertise: ["Web Development", "Mobile Apps"],
                availability: "3-4",
                bio: "10+ years of experience in full-stack development"
            },
            // Add more mock data as needed
        ];
    }

    function displayMentorSuggestions(suggestions) {
        const container = document.getElementById('mentorSuggestions');
        if (!container) return;

        container.innerHTML = suggestions.map(mentor => `
            <div class="mentor-suggestion-card">
                <div class="mentor-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="mentor-info">
                    <h4>${mentor.name}</h4>
                    <p>${mentor.title}</p>
                    <p class="mentor-expertise">
                        ${mentor.expertise.map(exp => `<span class="tag">${exp}</span>`).join('')}
                    </p>
                    <p class="mentor-bio">${mentor.bio}</p>
                </div>
                <button class="btn-primary" onclick="requestMentor(${mentor.id})">
                    Request Mentorship
                </button>
            </div>
        `).join('');
    }

    window.scheduleMentorship = function(mentorshipId) {
        const modal = document.getElementById('scheduleMentorshipModal');
        modal.setAttribute('data-mentorship-id', mentorshipId);
        showModal(modal);
    }

    window.submitScheduleForm = function(event) {
        event.preventDefault();
        const mentorshipId = document.getElementById('scheduleMentorshipModal').getAttribute('data-mentorship-id');
        const sessionData = {
            date: document.getElementById('sessionDate').value,
            time: document.getElementById('sessionTime').value,
            duration: document.getElementById('sessionDuration').value,
            topic: document.getElementById('sessionTopic').value
        };

        // Save session data
        const sessions = JSON.parse(localStorage.getItem('mentorshipSessions') || '[]');
        sessions.push({
            id: Date.now(),
            mentorshipId,
            ...sessionData,
            status: 'scheduled'
        });
        localStorage.setItem('mentorshipSessions', JSON.stringify(sessions));

        // Close modal and show success message
        closeModal(document.getElementById('scheduleMentorshipModal'));
        showNotification('Mentorship session scheduled successfully!');
    }

    // Initialize form handlers
    document.getElementById('becomeMentorForm')?.addEventListener('submit', becomeMentor);
    document.getElementById('scheduleMentorshipForm')?.addEventListener('submit', submitScheduleForm);
    document.getElementById('findConnectionSearch')?.addEventListener('input', findConnection);
    document.getElementById('findMentorSearch')?.addEventListener('input', findMentor);

    // Initialize everything
    initializeModals();
    initializeEventManagement();
    initializeOpportunityManagement();
    initializeConnectionsSection();
    initializeMentorshipSection();
    loadEvents();
    loadOpportunities();
});
