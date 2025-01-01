// Modal Handler for Alumni Dashboard

// Generic Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Profile Edit Modal Handler
function initializeProfileEdit() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');

    if (editProfileBtn && editProfileModal && editProfileForm) {
        editProfileBtn.addEventListener('click', () => showModal('editProfileModal'));

        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById('editFullName').value,
                email: document.getElementById('editEmail').value,
                graduationYear: document.getElementById('editGraduationYear').value,
                course: document.getElementById('editCourse').value,
                currentJob: document.getElementById('editCurrentJob').value,
                company: document.getElementById('editCompany').value,
                bio: document.getElementById('editBio').value
            };

            // Update profile information immediately
            updateProfileDisplay(formData);

            // Save to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (currentUser) {
                const userIndex = users.findIndex(user => user.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...formData };
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...formData }));
                }
            }

            // Show success message
            showNotification('Profile updated successfully!');
            closeModal('editProfileModal');
        });
    }
}

// Event Creation Modal Handler
function initializeEventCreation() {
    const createEventBtn = document.getElementById('createEventBtn');
    const createEventModal = document.getElementById('createEventModal');
    const createEventForm = document.getElementById('createEventForm');

    if (createEventBtn && createEventModal && createEventForm) {
        createEventBtn.addEventListener('click', () => showModal('createEventModal'));

        createEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const eventData = {
                id: Date.now(),
                title: document.getElementById('eventTitle').value,
                date: document.getElementById('eventDate').value,
                location: document.getElementById('eventLocation').value,
                type: document.getElementById('eventType').value,
                description: document.getElementById('eventDescription').value,
                createdBy: JSON.parse(localStorage.getItem('currentUser'))?.email || 'anonymous',
                createdAt: new Date().toISOString(),
                attendees: []
            };

            // Save event to localStorage
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            events.push(eventData);
            localStorage.setItem('events', JSON.stringify(events));

            // Update the events display
            const eventsContainer = document.getElementById('eventsContainer');
            if (eventsContainer) {
                const eventCard = createEventCard(eventData);
                eventsContainer.insertBefore(eventCard, eventsContainer.firstChild);
            }

            // Show success message
            showNotification('Event created successfully!');
            closeModal('createEventModal');
            createEventForm.reset();
        });
    }
}

// Function to create event card
function createEventCard(eventData) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-header">
            <h4>${eventData.title}</h4>
            <span class="event-type">${eventData.type}</span>
        </div>
        <div class="event-details">
            <p><i class="fas fa-calendar"></i> ${new Date(eventData.date).toLocaleString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${eventData.location}</p>
            <p class="event-description">${eventData.description}</p>
        </div>
        <div class="event-footer">
            <span class="attendees-count">
                <i class="fas fa-users"></i> ${eventData.attendees?.length || 0} Attendees
            </span>
            <button class="btn-secondary" onclick="manageEvent('${eventData.id}')">
                Manage Event
            </button>
        </div>
    `;
    return card;
}

// Opportunity Creation Modal Handler
function initializeOpportunityCreation() {
    const shareOpportunityBtn = document.getElementById('shareOpportunityBtn');
    const shareOpportunityModal = document.getElementById('shareOpportunityModal');
    const shareOpportunityForm = document.getElementById('shareOpportunityForm');

    if (shareOpportunityBtn && shareOpportunityModal && shareOpportunityForm) {
        shareOpportunityBtn.addEventListener('click', () => showModal('shareOpportunityModal'));

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
                createdBy: JSON.parse(localStorage.getItem('currentUser'))?.email || 'anonymous',
                createdAt: new Date().toISOString()
            };

            // Save opportunity to localStorage
            const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
            opportunities.push(opportunityData);
            localStorage.setItem('opportunities', JSON.stringify(opportunities));

            // Update the opportunities display
            const opportunitiesContainer = document.getElementById('opportunitiesContainer');
            if (opportunitiesContainer) {
                const opportunityCard = createOpportunityCard(opportunityData);
                opportunitiesContainer.insertBefore(opportunityCard, opportunitiesContainer.firstChild);
            }

            // Show success message
            showNotification('Opportunity shared successfully!');
            closeModal('shareOpportunityModal');
            shareOpportunityForm.reset();
        });
    }
}

// Function to create opportunity card
function createOpportunityCard(opportunityData) {
    const card = document.createElement('div');
    card.className = 'opportunity-card';
    card.innerHTML = `
        <div class="opportunity-header">
            <h4>${opportunityData.title}</h4>
            <span class="opportunity-type">${opportunityData.type}</span>
        </div>
        <div class="opportunity-details">
            <p><i class="fas fa-building"></i> ${opportunityData.company}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${opportunityData.location}</p>
            <p class="opportunity-description">${opportunityData.description}</p>
            <div class="skills-list">
                ${opportunityData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        <div class="opportunity-footer">
            <span class="posted-date">
                <i class="fas fa-clock"></i> Posted ${new Date(opportunityData.createdAt).toLocaleDateString()}
            </span>
            <button class="btn-secondary" onclick="manageOpportunity('${opportunityData.id}')">
                Manage
            </button>
        </div>
    `;
    return card;
}

// Helper function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Helper function to update profile display
function updateProfileDisplay(userData) {
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    const profileGraduationYearElement = document.getElementById('profileGraduationYear');
    const profileCourseElement = document.getElementById('profileCourse');
    const profileCurrentJobElement = document.getElementById('profileCurrentJob');
    const profileCompanyElement = document.getElementById('profileCompany');
    const profileBioElement = document.getElementById('profileBio');

    if (profileNameElement) profileNameElement.textContent = userData.fullName;
    if (profileEmailElement) profileEmailElement.textContent = userData.email;
    if (profileGraduationYearElement) profileGraduationYearElement.textContent = userData.graduationYear;
    if (profileCourseElement) profileCourseElement.textContent = userData.course;
    if (profileCurrentJobElement) profileCurrentJobElement.textContent = userData.currentJob;
    if (profileCompanyElement) profileCompanyElement.textContent = userData.company;
    if (profileBioElement) profileBioElement.textContent = userData.bio;

    // Update sidebar name if it exists
    const sidebarName = document.getElementById('sidebarName');
    if (sidebarName) sidebarName.textContent = userData.fullName;
}

// Initialize all modal handlers
document.addEventListener('DOMContentLoaded', () => {
    initializeProfileEdit();
    initializeEventCreation();
    initializeOpportunityCreation();

    // Load existing events and opportunities
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventsContainer = document.getElementById('eventsContainer');
    if (eventsContainer && events.length > 0) {
        events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsContainer.appendChild(eventCard);
        });
    }

    const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
    const opportunitiesContainer = document.getElementById('opportunitiesContainer');
    if (opportunitiesContainer && opportunities.length > 0) {
        opportunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        opportunities.forEach(opportunity => {
            const opportunityCard = createOpportunityCard(opportunity);
            opportunitiesContainer.appendChild(opportunityCard);
        });
    }
});
