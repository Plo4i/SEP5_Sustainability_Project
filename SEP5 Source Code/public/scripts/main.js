
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

//Log in modal

//Getting login link in header
const loginLink = document.getElementById("login-link");
//getting loginmodal in body of HTML
const loginModal = document.getElementById("login-modal");
//getting close button within modal
const loginModelCloseButton = loginModal.querySelector(".close");

//getting register link in header
const registerLink = document.getElementById("register-link");
//getting registermodal in body of HTML
const registerModel = document.getElementById("register-modal");
//getting close button within modal
const registerModelCloseButton = registerModel.querySelector(".close");


const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

//login button in header event listener to show modal
loginLink.addEventListener("click", function () {
  showModal("login");
});
//close button within modal to hide modal
loginModelCloseButton.addEventListener("click", function () {
  hideModal("login");
});

registerLink.addEventListener("click", function () {
  showModal("register");
});
//close button within modal to hide modal
registerModelCloseButton.addEventListener("click", function () {
  hideModal("register");
});


loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); // blocks the POST request from the HTML and handles it here. this way we can also handle the response here..

  let username = document.getElementById('username');
  let password = document.getElementById('password');

  console.log(username + password);

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
})



function showModal(caller) {
  if (caller == "login") {
    loginModal.style.display = "block";
  } else if (caller == "register") {
    registerModel.style.display = "block";
  }
}
//hide the modal
function hideModal(caller) {
  if (caller == "login") {
    loginModal.style.display = "none";
  } else if (caller == "register") {
    registerModel.style.display = "none";
  }
}

//handle isLoggedInCookie
var allCookies = document.cookie; //cookes are stored in one long string. they are key value pairs seperated by '='. paris sepereated by ';'
var cookiesArray = allCookies.split("; ");
var isLoggedInCookie = cookiesArray.find((cookie) =>
  cookie.startsWith("isLoggedIn=")
);
var isLoggedIn = isLoggedInCookie.split("=")[1];

console.log("Is logged In: " + isLoggedIn);

window.onload = function () {
  if (isLoggedIn === "true") {
    var contentsWrap = document.querySelector(".contents-wrap");
    contentsWrap.innerHTML = ""; // Clear the existing links
    contentsWrap.innerHTML += '<a href="#companies">Companies</a>';

    // Add the links for logged in users
    contentsWrap.innerHTML += '<a href="#">For Paid Customers</a>';
    contentsWrap.innerHTML +=
      '<a href="#"><i class="fa fa-search" aria-hidden="true"></i></a>';
  } else {
    //does nothing. Renders the HTML
  }
};

// Functionality to click on a card and be routed to the corresponding company page IF logged in

var companyCards = document.getElementsByClassName("companies-card");


for (let i = 0; i < companyCards.length; i++) {
  companyCards[i].addEventListener("click", (event) => {
    let clickedCompany = event.currentTarget.querySelector("h3").textContent;

    if (isLoggedIn) {
      fetch("/company", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clickedName: clickedCompany }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log("Something went wrong: " + error));
    }

    alert(clickedCompany);
  });
}
