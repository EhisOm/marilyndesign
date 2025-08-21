document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-reg');
    const messageElem = document.getElementById('message');  // cache the element once

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                title: document.getElementById('title').value,
                name: document.getElementById('name').value,
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                phone: document.getElementById('phone').value,
                dob: document.getElementById('dob').value,
            };

            try {
                const res = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await res.json();
                // Show message in alert or on page
                alert(result.message);
                if (messageElem) messageElem.textContent = result.message;
            } catch (err) {
                console.error('Error:', err);
                if (messageElem) messageElem.textContent = 'Something went wrong.';
            }
        });
    }
});
