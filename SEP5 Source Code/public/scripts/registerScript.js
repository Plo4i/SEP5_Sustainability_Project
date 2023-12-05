document.title = 'Register';

document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var usernameInput = document.getElementById('username-input');
    var passwordInput = document.getElementById('password-input');
    var emailInput = document.getElementById('email-input');
    var usernameError = document.getElementById('username-error');
    var passwordError = document.getElementById('password-error');
    var emailError = document.getElementById('email-error');

    // Reset error messages and input borders
    usernameError.textContent = '';
    passwordError.textContent = '';
    emailError.textContent = '';
    usernameInput.style.border = '';
    passwordInput.style.border = '';
    emailInput.style.border = '';

    // Check if username, password and email are filled out
    if (!usernameInput.value.trim()) {
        usernameError.textContent = 'Username is required.';
        usernameInput.style.borderBottom = '3px solid red';
    }
    if (!passwordInput.value.trim()) {
        passwordError.textContent = 'Password is required.';
        passwordContainer.style.borderBottom = '3px solid red';
    }
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Email is required.';
        emailInput.style.borderBottom = '3px solid red';
    }

    const username = usernameInput.value;
    const password = passwordInput.value;
    const email = emailInput.value;
    const subscription = document.querySelector('input[name="subscription"]:checked').value;

    const formData = { "username": username, 'password': password, 'email': email, 'subscription': subscription };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
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
            document.getElementById("error-message").innerHTML = error;
            console.error('Fetch error:', error);
        });
});


// Declare variables
var passwordInput = document.getElementById('password-input');
var passwordContainer = document.querySelector('.password-container');
var icon = document.getElementById('toggle-password');

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
    } else {
        passwordInput.type = 'password';
        icon.setAttribute('data-icon', 'mdi:eye');
    }
}