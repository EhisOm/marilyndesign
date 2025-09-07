fetch('/admin.html', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
    .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.text();
    })
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(() => {
        alert('Access denied');
        window.location.href = '/welcome.html';
    });


document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        // No user info, redirect to login
        window.location.href = '/login.html';
        return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
        // Not admin, redirect somewhere safe
        window.location.href = '/welcome.html';
    }
});

// adminLoader.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // If no token or not an admin, redirect to welcome page
    if (!token || user.role !== 'admin') {
        alert('Unauthorized');
        window.location.href = '/welcome.html';
    }
});