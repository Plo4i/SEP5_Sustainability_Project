// Add a scroll event listener to the window
window.addEventListener('scroll', function () {
    // Select the element with the class 'nav-container' and store it in the 'header' variable
    const header = document.querySelector('.nav-container');

    // Toggle the 'sticky' class on the 'header' element based on the scroll position
    header.classList.toggle("sticky", window.scrollY > 0);
});




//Log in modal

//Getting login link in header
const loginLink = document.getElementById('login-link');
//getting modal in body of HTML
const modal = document.getElementById('login-modal');
//getting close button within modal
const closeButton = modal.querySelector('.close');

//show the modal 
function showModal(){
    modal.style.display = 'block';
}
//hide the modal
function hideModal() {
    modal.style.display = 'none';
  }
//login button in header evenlistener to show modal
loginLink.addEventListener('click', showModal);
//close button within modal to hide modal
closeButton.addEventListener('click', hideModal);

