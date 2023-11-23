// Function for setting header links
function set_header_links(user) {

    const headerBar = document.getElementById('headerLinks');
    headerBar.innerHTML = '<a href="#companies">Companies</a>';

    if(user != undefined) {
        headerBar.innerHTML += `<a href="/user"> <div class='profile-button-container'> <div class='profile-button-image'> <img src="${user.image_url}"/> </div> ${user.username}</div> </a>
        <div class="search-icon"><a href="/">
        <i class="fa fa-search" aria-hidden="true"></i></a></div>`;
    }
    else {
        headerBar.innerHTML += 
        `<a href="/register" id="register-link">Sign Up</a> 
        <a href="/login" id="login-link">Log In</a>
        <a href="#" id='for-paid-customers-button'>For Paid Customers</a>
        <div class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></div>`;
    }
};

fetch('/user/data')  // Using fetch with http request to get session user
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); //Handling response if company not found
        }
        return response.json();
    })
    .then(data => {

        set_header_links(data.user); //Injecting data
    })
    .catch(error => {
        console.error('Error:', error);
    });


// Add a scroll event listener to the window
window.addEventListener("scroll", function () {
    // Select the element with the class 'nav-container' and store it in the 'header' variable
    const header = document.querySelector(".nav-container");

    // Toggle the 'sticky' class on the 'header' element based on the scroll position
    header.classList.toggle("sticky-navbar", window.scrollY > 0);
});

// Serchbar functionality - event listener
// Open searchbar
document.querySelector(".fa-search").addEventListener("click", function () {
    var navLinks = document.getElementById("nav-links");
    navLinks.classList.remove("nav-links-searchbar-off");
    navLinks.classList.add("nav-links-searchbar-on");
    document.getElementById("search-bar").style.display = "block";
});

document.getElementById("close-btn").addEventListener("click", function () {
    var navLinks = document.getElementById("nav-links");
    navLinks.classList.remove("nav-links-searchbar-on");
    navLinks.classList.add("nav-links-searchbar-off");
    document.getElementById("search-bar").style.display = "none";
});