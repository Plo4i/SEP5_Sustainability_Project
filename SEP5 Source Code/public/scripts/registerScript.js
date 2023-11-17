var passwordInput = document.getElementById('password-input');
var passwordContainer = document.querySelector('.password-container');

passwordInput.addEventListener('focus', function () {
    passwordContainer.style.borderBottom = '3px solid var(--orange-button-color)';
});

passwordInput.addEventListener('blur', function () {
    passwordContainer.style.borderBottom = '3px solid var(--white-font-color)';
});