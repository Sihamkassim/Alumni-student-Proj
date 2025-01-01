document.addEventListener('DOMContentLoaded', function() {
    // Admin users configuration
    const adminUsers = {
        'siham': 'siham123',
        'liyda': 'lidya456',
        'kalkidan': 'kal56789'
    };

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Login attempt:', username); // Debug log

            // Check if it's an admin user
            if (adminUsers[username] === password) {
                console.log('Admin login successful'); // Debug log
                localStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    isAdmin: true
                }));
                
                showNotification('Login successful! Redirecting to admin dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
                return;
            }

            // If not admin, show error
            showNotification('Invalid username or password', 'error');
        });
    }
});
// Show notification function
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Retrieve stored user data
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Stored users:', storedUsers); // Debug log
        
        const user = storedUsers.find(u => 
            (u.fullName === username || u.email === username) && u.password === password
        );
        
        console.log('Found user:', user); // Debug log

        if (user) {
            // Store logged in user info
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect after notification
            setTimeout(() => {
                if (user.userType === 'student') {
                    window.location.href = 'student-dashboard.html';
                } else if (user.userType === 'alumni') {
                    window.location.href = 'alumni-dashboard.html';
                }
            }, 1500);
        } else {
            showNotification('Invalid username/email or password', 'error');
        }
    });
}

// Handle signup form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const userType = document.querySelector('input[name="userType"]:checked')?.value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate required fields
        if (!userType || !fullName || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Password validation
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        // Password complexity check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showNotification('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character', 'error');
            return;
        }

        // Create user object
        const newUser = {
            userType,
            fullName,
            email,
            password
        };

        try {
            // Get existing users or initialize empty array
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (existingUsers.some(user => user.email === email)) {
                showNotification('Email already registered. Please use another email.', 'error');
                return;
            }

            // Add new user to array
            existingUsers.push(newUser);
            
            // Save updated users array
            localStorage.setItem('users', JSON.stringify(existingUsers));

            // Show success notification
            showNotification('Registration successful! Redirecting to login...', 'success');
            
            // Clear form
            signupForm.reset();
            
            // Redirect to login page after notification
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            console.error('Error during registration:', error);
            showNotification('An error occurred during registration', 'error');
        }
    });
}

// Google OAuth login
const googleLoginBtn = document.getElementById('googleLogin');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', function() {
        const clientId = '984004975629-rh051nbv4hauq0qk347n3ikbk303sg6o.apps.googleusercontent.com';
        const redirectUri = 'http://127.0.0.1:5500/oauth-callback.html';
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
            client_id=${clientId}
            &redirect_uri=${encodeURIComponent(redirectUri)}
            &response_type=code
            &scope=email profile
            &prompt=select_account`;
        
        window.location.href = googleAuthUrl.replace(/\s/g, '');
    });
}

// LinkedIn OAuth login
const linkedinLoginBtn = document.getElementById('linkedinLogin');
if (linkedinLoginBtn) {
    linkedinLoginBtn.addEventListener('click', function() {
        const linkedinClientId = '77geqm0qj8l12j';
        const redirectUri = 'http://127.0.0.1:5500/linkedin-callback.html';
        
        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?
            response_type=code
            &client_id=${linkedinClientId}
            &redirect_uri=${encodeURIComponent(redirectUri)}
            &scope=r_liteprofile r_emailaddress`;
        
        window.location.href = linkedinAuthUrl.replace(/\s/g, '');
    });
}
