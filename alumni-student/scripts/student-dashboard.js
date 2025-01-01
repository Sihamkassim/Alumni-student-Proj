document.addEventListener('DOMContentLoaded', function() {
    // Basic user info management
    const storedUsername = localStorage.getItem('username');
    const storedUserType = localStorage.getItem('userType');

    // Update name in various places
    document.querySelectorAll('#studentName, #welcomeName').forEach(el => {
        el.textContent = storedUsername || 'Student';
    });

    // Update student details if needed
    const studentDetailsEl = document.getElementById('studentDetails');
    if (studentDetailsEl) {
        studentDetailsEl.textContent = storedUserType === 'student' ? 'Student' : 'User Details';
    }

    // Navigation functionality
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
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Profile image upload
    const editOverlay = document.querySelector('.edit-overlay');
    if (editOverlay) {
        editOverlay.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.querySelector('.profile-image img').src = event.target.result;
                        showNotification('Profile picture updated successfully!');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Profile editing functionality
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            const isEditing = this.classList.contains('editing');
            const profileFields = document.querySelectorAll('.profile-info .info-value');
            
            if (isEditing) {
                // Save changes
                this.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
                this.classList.remove('editing');
                
                // Make fields non-editable
                profileFields.forEach(field => {
                    field.contentEditable = false;
                    field.classList.remove('editing');
                });
                
                // Save to localStorage
                const profileData = {
                    fullName: document.getElementById('fullName').textContent,
                    studentId: document.getElementById('studentId').textContent,
                    department: document.getElementById('department').textContent,
                    yearOfStudy: document.getElementById('yearOfStudy').textContent,
                    email: document.getElementById('email').textContent
                };
                
                // Update sidebar name
                document.getElementById('studentName').textContent = profileData.fullName;
                
                localStorage.setItem('profileData', JSON.stringify(profileData));
                showNotification('Profile updated successfully!');
            } else {
                // Enable editing
                this.innerHTML = '<i class="fas fa-save"></i> Save Changes';
                this.classList.add('editing');
                
                // Make fields editable
                profileFields.forEach(field => {
                    field.contentEditable = true;
                    field.classList.add('editing');
                });
            }
        });
    }

    // Skills management
    const skillsList = document.getElementById('skillsList');
    if (skillsList) {
        const initialSkills = ['JavaScript', 'HTML', 'CSS', 'Python', 'React'];
        
        function createSkillTag(skill) {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <i class="fas fa-times remove-skill"></i>
            `;
            
            tag.querySelector('.remove-skill').addEventListener('click', () => {
                tag.remove();
                showNotification('Skill removed successfully!');
            });
            return tag;
        }
        
        // Initialize skills
        skillsList.innerHTML = '';
        initialSkills.forEach(skill => {
            skillsList.appendChild(createSkillTag(skill));
        });

        // Add new skill functionality
        const addSkillBtn = document.getElementById('addSkillBtn');
        const newSkillInput = document.getElementById('newSkillInput');
        
        if (addSkillBtn && newSkillInput) {
            addSkillBtn.addEventListener('click', () => {
                const skill = newSkillInput.value.trim();
                if (skill) {
                    skillsList.appendChild(createSkillTag(skill));
                    newSkillInput.value = '';
                    showNotification('New skill added successfully!');
                }
            });

            newSkillInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillBtn.click();
                }
            });
        }
    }

    // New Message functionality
    const newMessageBtn = document.getElementById('newMessageBtn');
    const messageModal = document.getElementById('messageModal');
    const messageForm = document.getElementById('messageForm');
    const recipientSelect = document.getElementById('messageRecipient');

    // Sample network data - replace with actual network data
    const networkContacts = [
        { id: 1, name: "John Doe", role: "Alumni - Software Engineer" },
        { id: 2, name: "Jane Smith", role: "Alumni - Product Manager" },
        { id: 3, name: "Mike Johnson", role: "Alumni - Data Scientist" }
    ];

    if (newMessageBtn) {
        newMessageBtn.addEventListener('click', function() {
            // Populate recipient select
            recipientSelect.innerHTML = '<option value="">Select recipient...</option>';
            networkContacts.forEach(contact => {
                recipientSelect.innerHTML += `<option value="${contact.id}">${contact.name} (${contact.role})</option>`;
            });
            messageModal.style.display = 'block';
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const recipient = recipientSelect.value;
            const subject = document.getElementById('messageSubject').value;
            const message = document.getElementById('messageContent').value;
            
            if (!recipient || !subject || !message.trim()) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Here you would typically send the message to your backend
            console.log('Sending message:', {
                to: recipient,
                subject: subject,
                content: message
            });
            
            // Clear form and close modal
            this.reset();
            messageModal.style.display = 'none';
            showNotification('Message sent successfully!');
        });
    }

    // Modal handling
    function initializeModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        // Close modal when clicking close button
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

    // Initialize profile editing
    function initializeProfileEditing() {
        const editProfileBtn = document.getElementById('editProfileBtn');
        const editProfileModal = document.getElementById('editProfileModal');
        const editProfileForm = document.getElementById('editProfileForm');

        if (editProfileBtn && editProfileModal && editProfileForm) {
            // Show edit profile modal
            editProfileBtn.addEventListener('click', () => {
                // Pre-fill form with current values
                document.getElementById('editName').value = document.getElementById('fullName').textContent;
                document.getElementById('editStudentId').value = document.getElementById('studentId').textContent;
                document.getElementById('editDepartment').value = document.getElementById('department').textContent;
                document.getElementById('editYearOfStudy').value = document.getElementById('yearOfStudy').textContent;
                document.getElementById('editEmail').value = document.getElementById('email').textContent;
                
                showModal(editProfileModal);
            });

            // Handle form submission
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = {
                    name: document.getElementById('editName').value,
                    studentId: document.getElementById('editStudentId').value,
                    department: document.getElementById('editDepartment').value,
                    yearOfStudy: document.getElementById('editYearOfStudy').value,
                    email: document.getElementById('editEmail').value,
                    skills: document.getElementById('editSkills').value.split(',').map(s => s.trim()),
                    interests: document.getElementById('editInterests').value.split(',').map(s => s.trim())
                };

                // Update profile information
                updateProfileDisplay(formData);
                
                // Save to localStorage
                localStorage.setItem('profileData', JSON.stringify(formData));

                // Close modal and show notification
                closeModal(editProfileModal);
                showNotification('Profile updated successfully!');
            });
        }
    }

    // Initialize messaging
    function initializeMessaging() {
        const newMessageBtn = document.getElementById('newMessageBtn');
        const messageModal = document.getElementById('messageModal');
        const messageForm = document.getElementById('messageForm');

        if (newMessageBtn && messageModal && messageForm) {
            newMessageBtn.addEventListener('click', () => {
                showModal(messageModal);
            });

            messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {
                    recipient: document.getElementById('messageRecipient').value,
                    subject: document.getElementById('messageSubject').value,
                    message: document.getElementById('messageContent').value
                };

                if (!formData.recipient || !formData.subject || !formData.message.trim()) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }

                // Here you would typically send the message to your backend
                console.log('Message sent:', formData);

                // Clear form and close modal
                messageForm.reset();
                closeModal(messageModal);
                showNotification('Message sent successfully!');
            });
        }
    }

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Initialize sections with loading states
    function initializeSections() {
        const sections = ['overview', 'profile', 'network', 'opportunities', 'events', 'messages'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const loadingPlaceholders = section.querySelectorAll('.loading-placeholder');
                loadingPlaceholders.forEach(placeholder => {
                    placeholder.style.display = 'none';
                });
            }
        });
    }

    // Initialize everything
    initializeModals();
    initializeProfileEditing();
    initializeMessaging();
    initializeSections();

    // Load saved profile data
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        document.getElementById('fullName').textContent = profileData.name;
        document.getElementById('studentId').textContent = profileData.studentId;
        document.getElementById('department').textContent = profileData.department;
        document.getElementById('yearOfStudy').textContent = profileData.yearOfStudy;
        document.getElementById('email').textContent = profileData.email;
    }
});