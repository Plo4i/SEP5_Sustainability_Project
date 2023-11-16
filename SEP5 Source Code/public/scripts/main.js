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

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const companyCards = document.getElementsByClassName("companies-card");


function activateHeaderLinks() {
  const loginLink = document.getElementById("login-link");
  loginLink.addEventListener("click", function () {
    showModal("login");
  });
  const registerLink = document.getElementById("register-link");
  registerLink.addEventListener("click", function () {
    showModal("register");
  });
}

function setEventListeners() {
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

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // blocks the POST request from the HTML and handles it here. this way we can also handle the response here..
    login();
  });
}

function login() {
  let username = document.querySelector('input[name="username"]').value;
  let password = document.querySelector('input[name="password"]').value;

  console.log(username + ",  " + password);

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        updateHeader();
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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

window.onload = function () {
  setEventListeners();
  updateHeader();
};

function updateHeader() {
  //handle isLoggedInCookie
  var allCookies = document.cookie; //cookies are stored in one long string. they are key value pairs seperated by '='. paris sepereated by ';'
  var cookiesArray = allCookies.split("; ");
  var isLoggedInCookie = cookiesArray.find((cookie) =>
    cookie.startsWith("isLoggedIn=")
  );
  var isLoggedIn = isLoggedInCookie.split("=")[1];
  console.log("Is logged In: " + isLoggedIn);
  var contentsWrap = document.querySelector(".contents-wrap");
  if (isLoggedIn === "true") {
    contentsWrap.innerHTML = ""; // Clear the existing links
    contentsWrap.innerHTML += '<a href="#companies">Companies</a>';
    contentsWrap.innerHTML += '<a href="#">For Paid Customers</a>';
    contentsWrap.innerHTML += '<a href="#" id ="logoutBtn">Log Out</a>';
    contentsWrap.innerHTML +=
      '<a href="#"><i class="fa fa-search" aria-hidden="true"></i></a>';
    var logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", function () {
      logout();
    });
  } else if (isLoggedIn === "false") {
    contentsWrap.innerHTML = ""; // Clear the existing links
    contentsWrap.innerHTML += ' <a href="#companies">Companies</a>';
    contentsWrap.innerHTML += '<a href="#" id="register-link">Sign Up</a>';
    contentsWrap.innerHTML += '<a href="#" id="login-link">Log In</a>';
    contentsWrap.innerHTML += '<a href="#">For Paid Customers</a>';
    contentsWrap.innerHTML +=
      '<div class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></a></div>';

    activateHeaderLinks();
  }
}

function logout() {
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.status);
      updateHeader();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Functionality to click on a card and be routed to the corresponding company page IF logged in

for (let i = 0; i < companyCards.length; i++) {
  console.log(companyCards[i])
  companyCards[i].addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default behavior of the click event

    let clickedCompany = event.currentTarget.querySelector("h3").textContent;
    console.log(clickedCompany)


    fetch("/company")
      .then((response) => response.json()) // parse the response as JSON
      .then((data) => console.log(data)) // log the company data
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
