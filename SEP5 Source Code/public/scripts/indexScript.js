$('.company-button').click(function(e) {
    e.preventDefault(); // Prevent the default form submission
    var buttonValue = $(this).val(); // Get the value of the clicked button
    $('#company-form').attr('action', '/company?buttonValue=' + buttonValue)
    $('#company-form').submit();
});