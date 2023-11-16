// Add a scroll event listener to the window
window.addEventListener("scroll", function () {
    // Select the element with the class 'nav-container' and store it in the 'header' variable
    const header = document.querySelector(".nav-container");
  
    // Toggle the 'sticky' class on the 'header' element based on the scroll position
    header.classList.toggle("sticky-navbar", window.scrollY > 0);
  });
  
  // Serchbar functionality - event listener
  // Open searchbar
  document.querySelector('.fa-search').addEventListener('click', function () {
    var navLinks = document.getElementById('nav-links');
    navLinks.classList.remove("nav-links-searchbar-off");
    navLinks.classList.add("nav-links-searchbar-on");
    document.getElementById('search-bar').style.display = 'block';
  });
  
  document.getElementById('close-btn').addEventListener('click', function () {
    var navLinks = document.getElementById('nav-links');
    navLinks.classList.remove("nav-links-searchbar-on");
    navLinks.classList.add("nav-links-searchbar-off");
    document.getElementById('search-bar').style.display = 'none';
});


// Listening for the company button that is clicked
$('.company-button').click(function(e) {
    e.preventDefault(); // Prevent the default form submission
    var buttonValue = $(this).val(); // Get the value of the clicked button
    $('#company-form').attr('action', '/company?buttonValue=' + buttonValue)
    $('#company-form').submit();
});

// JS version of the code above
document.querySelectorAll('.company-button').forEach(function(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default form submission
        var buttonValue = this.value; // Get the value of the clicked button
        document.getElementById('company-form').action = '/company?buttonValue=' + buttonValue;
        document.getElementById('company-form').submit();
    });
});
