// Declare variables
var passwordInput = document.getElementById('password-input');
var passwordContainer = document.querySelector('.password-container');
var icon = document.getElementById('toggle-password');
var usernameInput = document.getElementById('username-input');
var usernameError = document.getElementById('username-error');
var passwordError = document.getElementById('password-error');

// Setting up the title
document.title = 'Login';

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from being submitted

    const username = usernameInput.value;
    const password = passwordInput.value;

    const formData = { "username": username, 'password': password };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }

            return response.json();
        })
        .then(data => {
            // Handle the data received from the server
            window.location.href = '/';
        })
        .catch(error => {
            // Handle errors
            if (error.message === 'Invalid username') {
                usernameInput.style.borderBottom = '3px solid red';
                document.getElementById('error-message').textContent = error.message;
            } else if (error.message === 'Invalid password') {
                passwordContainer.style.borderBottom = '3px solid red';
                document.getElementById('error-message').textContent = error.message;
            }
            console.error('Fetch error:', error);
        });
});

// This script is toggling the bottom border of the "password-container" div to become orange
// when the user inputs a password in both the register and login form
passwordInput.addEventListener('focus', function () {
    passwordContainer.style.borderBottom = '3px solid var(--dark-orange-color)';
});

passwordInput.addEventListener('blur', function () {
    passwordContainer.style.borderBottom = '3px solid var(--white-font-color)';
});

// This function toggles the visibility of the password in both the register and login form
function togglePasswordVisibility() {

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.setAttribute('data-icon', 'mdi:eye-off');
    } else if (passwordInput.type === 'text') {
        passwordInput.type = 'password';
        icon.setAttribute('data-icon', 'mdi:eye');
    }
}