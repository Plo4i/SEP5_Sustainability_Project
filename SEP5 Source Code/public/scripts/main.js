//import { response } from "express";

// Add a scroll event listener to the window
window.addEventListener("scroll", function () {
  // Select the element with the class 'nav-container' and store it in the 'header' variable
  const header = document.querySelector(".nav-container");

  // Toggle the 'sticky' class on the 'header' element based on the scroll position
  header.classList.toggle("sticky", window.scrollY > 0);
});

//Log in modal

//Getting login link in header
const loginLink = document.getElementById("login-link");
//getting modal in body of HTML
const modal = document.getElementById("login-modal");
//getting close button within modal
const closeButton = modal.querySelector(".close");

//show the modal
function showModal() {
  modal.style.display = "block";
}
//hide the modal
function hideModal() {
  modal.style.display = "none";
}
//login button in header evenlistener to show modal
loginLink.addEventListener("click", showModal);
//close button within modal to hide modal
closeButton.addEventListener("click", hideModal);

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
  }
};



// Functionality to click on a card and be routed to the corresponding company page IF logged in

var companyCards = document.getElementsByClassName('companies-card');
for (let i = 0; i < companyCards.length; i++){
    companyCards[i].addEventListener('click', (event) => {
        let clickedCompany = event.currentTarget.querySelector('h3').textContent;

        if(isLoggedIn){
            fetch('/company', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({clickedName: clickedCompany})
            })
            .then (response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log("Something went wrong: " + error))
        }

        alert(clickedCompany);
    })
}

