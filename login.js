// login.js

// Handle login form submission
document.getElementById('form-log').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameOrEmail = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!usernameOrEmail || !password) {
        alert('Please enter username and password');
        return;
    }

    try {
        // For demo purposes, ask for the user's display name
        const displayName = prompt("Enter your first name for display purposes:") || usernameOrEmail;

        // Dummy login data
        const data = {
            token: 'dummy-token-123',
            user: { username: usernameOrEmail, title: 'Mr./Ms.', name: displayName }
        };

        // Save token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update header links
        checkAuth();

        // Redirect to home or profile page (example: women.html)
        window.location.href = '/women.html';

    } catch (err) {
        console.error('Login error:', err);
        alert('Server error, please try again later.');
    }
});

// Function to display user info in header
function checkAuth() {
    const userStr = localStorage.getItem('user');
    const accountDropdown = document.getElementById('accountDropdown');
    const loginLinks = document.getElementById('loginLinks');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const dropdownMenu = document.querySelector('#accountDropdown .dropdown');

    if (userStr) {
        const user = JSON.parse(userStr);

        if (accountDropdown) accountDropdown.style.display = 'block';
        if (loginLinks) loginLinks.style.display = 'none';
        if (userNameDisplay) userNameDisplay.textContent = `${user.title} ${user.name} ▾`;

        // Ensure dropdown has Profile + Logout
        if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <li><a href="profile.html">Profile</a></li>
                <li><a href="#" id="logout">Logout</a></li>
            `;
            document.getElementById('logout').addEventListener('click', signOut);
        }

    } else {
        if (accountDropdown) accountDropdown.style.display = 'none';
        if (loginLinks) loginLinks.style.display = 'flex';
    }
}

// Function to restrict cart access to logged-in users
function viewCart() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        alert('Please login to view cart!');
        window.location.href = '/login.html';
        return;
    }
    window.location.href = '/cart.html';
}

// Sign out function
function signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Signed out successfully!');
    checkAuth();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkAuth);
