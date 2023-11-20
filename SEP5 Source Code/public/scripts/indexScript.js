// JS version of the code above
document.querySelectorAll('.company-button').forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default form submission
        var buttonValue = this.value; // Get the value of the clicked button
        document.getElementById('company-form').action = '/company?buttonValue=' + buttonValue;
        document.getElementById('company-form').submit();
    });
});
